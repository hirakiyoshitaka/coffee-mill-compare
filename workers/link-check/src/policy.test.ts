import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { AMAZON_PAAPI_ENABLED, amazonStockHook } from "./amazon";
import { buildReport, checkBuyLink, type LinkCheckResult } from "./logic";
import { decideFetch, fetchBlockedReason, hasTagParam, isAffiliateRedirectHost, isAmazonHost, stripTrackingParams } from "./policy";
import {
  RAKUTEN_ICHIBA_SEARCH_ENDPOINT,
  RAKUTEN_MIN_INTERVAL_MS,
  buildRakutenSearchRequest,
  createRakutenPacer,
  rakutenItemCodeFromUrl,
  readRakutenStock,
} from "./rakuten";

const APP_ID = "app-from-env";
const ACCESS_KEY = "test-access-key-not-real";

function assertNeverFetched(result: LinkCheckResult, calls: string[], url: string): void {
  assert.deepEqual(calls, [], url);
  assert.notEqual(result.outcome, "ok", url);
}

async function run(): Promise<void> {
  assert.equal(AMAZON_PAAPI_ENABLED, false);
  const hook = amazonStockHook("https://www.amazon.co.jp/dp/B000EXAMPLE");
  assert.equal(hook.enabled, false);
  assert.equal(hook.fetched, false);
  assert.match(hook.detail, /売上 3 件/);
  assert.match(hook.detail, /社長の OK/);

  const amazonSource = readFileSync(new URL("./amazon.ts", import.meta.url), "utf8");
  assert.equal(/\bfetch\s*\(/.test(amazonSource), false);

  const blockedUrls = [
    "https://px.a8.net/svt/ejp?a8mat=example",
    "https://www.a8.net/svt/ejp?a8mat=example",
    "https://afl.rakuten.co.jp/ichiba/example",
    "https://hb.afl.rakuten.co.jp/ichiba/example",
    "https://hbb.afl.rakuten.co.jp/hgc/example",
    "https://HB.AFL.RAKUTEN.CO.JP/ichiba/example",
    "https://invl.me/example",
    "https://www.invl.me/example",
    "https://af.moshimo.com/af/c/click?a_id=example",
    "https://moshimo.com/af/example",
    "https://ssl.moshimo.com/af/example",
    "https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=example",
    "https://shp.ee/example",
    "https://shop.example/kettle?id=7&tag=example",
    "https://shop.example/kettle?TAG=example",
    "https://www.amazon.co.jp/dp/B000EXAMPLE?tag=example",
    "https://www.amazon.com/dp/B000EXAMPLE?tag=example&utm_source=news",
    "https://www.amazon.co.jp/dp/B000EXAMPLE",
    "https://amazon.co.jp/dp/B000EXAMPLE",
    "https://WWW.AMAZON.CO.JP/dp/B000EXAMPLE",
    "https://www.amazon.com/dp/B000EXAMPLE",
    "https://www.amazon.co.uk/dp/B000EXAMPLE",
    "https://www.amazon.de/dp/B000EXAMPLE",
    "https://www.amazon.fr/dp/B000EXAMPLE",
    "https://www.amazon.ca/dp/B000EXAMPLE",
    "https://www.amazon.com.au/dp/B000EXAMPLE",
    "https://smile.amazon.com/dp/B000EXAMPLE",
    "https://amzn.to/example",
    "https://amzn.asia/example",
    "https://amzn.com/example",
    "https://item.rakuten.co.jp/example-shop/example-item/",
    "https://search.rakuten.co.jp/search/mall/coffee/",
  ];

  for (const url of blockedUrls) {
    const calls: string[] = [];
    const result = await checkBuyLink(
      url,
      async (input) => {
        calls.push(String(input));
        return new Response("fetched", { status: 200 });
      },
      1000,
    );
    assertNeverFetched(result, calls, url);
    assert.ok(fetchBlockedReason(url), url);
  }

  const taggedAmazon = await checkBuyLink("https://www.amazon.co.jp/dp/B000EXAMPLE?tag=example", async () => new Response("", { status: 200 }), 1000);
  assert.equal(taggedAmazon.outcome, "skipped");
  const bareAmazon = await checkBuyLink("https://www.amazon.com/dp/B000EXAMPLE", async () => new Response("", { status: 200 }), 1000);
  assert.equal(bareAmazon.outcome, "amazon_disabled");
  const a8 = await checkBuyLink("https://px.a8.net/svt/ejp?a8mat=example", async () => new Response("", { status: 200 }), 1000);
  assert.equal(a8.outcome, "skipped");
  if (a8.outcome === "skipped") assert.equal(a8.reason, "affiliate_redirect");
  const moshimo = await checkBuyLink("https://af.moshimo.com/af/c/click?a_id=example", async () => new Response("", { status: 200 }), 1000);
  assert.equal(moshimo.outcome, "skipped");
  const taggedPlain = await checkBuyLink("https://shop.example/kettle?tag=example&utm_source=news", async () => new Response("", { status: 200 }), 1000);
  assert.equal(taggedPlain.outcome, "skipped");
  if (taggedPlain.outcome === "skipped") assert.equal(taggedPlain.reason, "tagged_url");

  assert.equal(isAffiliateRedirectHost("px.a8.net"), true);
  assert.equal(isAffiliateRedirectHost("hb.afl.rakuten.co.jp"), true);
  assert.equal(isAffiliateRedirectHost("af.moshimo.com"), true);
  assert.equal(isAffiliateRedirectHost("invl.me"), true);
  assert.equal(isAmazonHost("www.amazon.co.jp"), true);
  assert.equal(isAmazonHost("amazon.com"), true);
  assert.equal(isAmazonHost("shop.example"), false);
  assert.equal(hasTagParam("https://shop.example/tags/kettle"), false);
  assert.equal(hasTagParam("https://shop.example/item?mytag=1"), false);

  const stripped = stripTrackingParams("https://shop.example/kettle?id=7&utm_source=news&utm_medium=mail&fbclid=abc&gclid=xyz");
  const strippedUrl = new URL(stripped);
  assert.equal(strippedUrl.searchParams.get("id"), "7");
  assert.equal(strippedUrl.searchParams.get("utm_source"), null);
  assert.equal(strippedUrl.searchParams.get("utm_medium"), null);
  assert.equal(strippedUrl.searchParams.get("fbclid"), null);
  assert.equal(strippedUrl.searchParams.get("gclid"), null);
  assert.equal(strippedUrl.searchParams.get("tag"), null);
  assert.equal(stripTrackingParams(stripped), stripped);

  const plainDecision = decideFetch("https://shop.example/kettle?id=7&utm_source=news", null);
  assert.equal(plainDecision.action, "plain");
  if (plainDecision.action === "plain") assert.equal(new URL(plainDecision.url).searchParams.get("utm_source"), null);

  const plainCalls: { url: string; method: string }[] = [];
  const plain = await checkBuyLink("https://shop.example/kettle?id=7&utm_source=news&utm_medium=mail&fbclid=abc", async (input, init) => {
    plainCalls.push({ url: String(input), method: init?.method ?? "" });
    return new Response(null, { status: 200 });
  }, 1000);
  assert.equal(plain.outcome, "ok");
  assert.equal(plainCalls.length, 1);
  assert.equal(plainCalls[0]?.method, "HEAD");
  assert.equal(new URL(plainCalls[0]?.url ?? "").searchParams.get("id"), "7");
  assert.equal(new URL(plainCalls[0]?.url ?? "").searchParams.has("utm_source"), false);
  assert.equal(hasTagParam(plainCalls[0]?.url ?? ""), false);

  const pathCalls: string[] = [];
  const pathTag = await checkBuyLink("https://shop.example/tags/kettle?mytag=1", async (input) => {
    pathCalls.push(String(input));
    return new Response(null, { status: 200 });
  }, 1000);
  assert.equal(pathTag.outcome, "ok");
  assert.equal(pathCalls.length, 1);
  assert.equal(new URL(pathCalls[0] ?? "").searchParams.get("mytag"), "1");

  const methods: string[] = [];
  const fallback = await checkBuyLink("https://shop.example/kettle?id=7", async (input, init) => {
    methods.push(init?.method ?? "");
    if (init?.method === "HEAD") return new Response(null, { status: 405 });
    return new Response("ok", { status: 200 });
  }, 1000);
  assert.equal(fallback.outcome, "ok");
  assert.deepEqual(methods, ["HEAD", "GET"]);

  const redirectCalls: string[] = [];
  const redirected = await checkBuyLink("https://shop.example/go?id=7", async (input) => {
    const href = String(input);
    redirectCalls.push(href);
    if (fetchBlockedReason(href)) throw new Error(`blocked host was fetched: ${href}`);
    return new Response(null, { status: 302, headers: { location: "https://www.amazon.co.jp/dp/B000EXAMPLE?tag=example" } });
  }, 1000);
  assert.deepEqual(redirectCalls, ["https://shop.example/go?id=7"]);
  assert.equal(redirected.outcome, "skipped");

  const dead = await checkBuyLink("https://shop.example/missing?id=1&utm_campaign=spring", async (input) => {
    assert.equal(new URL(String(input)).searchParams.has("utm_campaign"), false);
    return new Response(null, { status: 404 });
  }, 1000);
  assert.equal(dead.outcome, "issue");
  if (dead.outcome === "issue") assert.equal(dead.kind, "dead");

  const affiliateItem = "https://hb.afl.rakuten.co.jp/ichiba/example/?pc=" + encodeURIComponent("https://item.rakuten.co.jp/example-shop/example-item/") + "&link_type=hybrid_url";
  assert.equal(rakutenItemCodeFromUrl(affiliateItem), "example-shop:example-item");
  assert.equal(rakutenItemCodeFromUrl("https://item.rakuten.co.jp/example-shop/example-item/"), "example-shop:example-item");
  assert.equal(rakutenItemCodeFromUrl("https://px.a8.net/svt/ejp?a8mat=example"), null);

  const uncheckedCalls: string[] = [];
  const unchecked = await checkBuyLink(affiliateItem, async (input) => {
    uncheckedCalls.push(String(input));
    return new Response("{}", { status: 200 });
  }, 1000);
  assert.deepEqual(uncheckedCalls, []);
  assert.equal(unchecked.outcome, "rakuten_unchecked");

  const request = buildRakutenSearchRequest("example-shop:example-item", APP_ID, ACCESS_KEY, "https://ouchi-dougubako.com");
  const requestUrl = new URL(request.url);
  assert.equal(request.url.startsWith(RAKUTEN_ICHIBA_SEARCH_ENDPOINT), true);
  assert.equal(RAKUTEN_ICHIBA_SEARCH_ENDPOINT, "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701");
  assert.equal(requestUrl.hostname, "openapi.rakuten.co.jp");
  assert.equal(requestUrl.pathname, "/ichibams/api/IchibaItem/Search/20260701");
  assert.equal(requestUrl.searchParams.get("applicationId"), APP_ID);
  assert.equal(requestUrl.searchParams.get("itemCode"), "example-shop:example-item");
  assert.equal(requestUrl.searchParams.get("availability"), "0");
  assert.equal(requestUrl.searchParams.get("accessKey"), null);
  assert.equal(requestUrl.searchParams.get("affiliateId"), null);
  assert.equal(request.url.includes(ACCESS_KEY), false);
  assert.equal(request.headers.accessKey, ACCESS_KEY);
  assert.equal(request.headers.origin, "https://ouchi-dougubako.com");

  assert.equal(readRakutenStock({ count: 1, items: [{ availability: 1, itemCode: "example-shop:example-item" }] }), "in_stock");
  assert.equal(readRakutenStock({ count: 1, items: [{ item: { availability: 0 } }] }), "out_of_stock");
  assert.equal(readRakutenStock({ count: 0, items: [] }), "missing");
  assert.equal(readRakutenStock({ Items: [{ Item: { availability: "1" } }] }), "in_stock");

  let waits = 0;
  const rakutenCalls: { url: string; accessKey: string | null }[] = [];
  const stock = await checkBuyLink(affiliateItem, async (input, init) => {
    const href = String(input);
    rakutenCalls.push({ url: href, accessKey: new Headers(init?.headers).get("accessKey") });
    if (isAmazonHost(new URL(href).hostname) || isAffiliateRedirectHost(new URL(href).hostname) || hasTagParam(href)) {
      throw new Error(`blocked host was fetched: ${href}`);
    }
    assert.equal(new URL(href).hostname, "openapi.rakuten.co.jp");
    assert.equal(new URL(href).searchParams.get("accessKey"), null);
    assert.equal(new URL(href).searchParams.get("affiliateId"), null);
    return new Response(JSON.stringify({ count: 1, items: [{ availability: 1 }] }), { status: 200 });
  }, 1000, {
    pacer: { async wait() { waits += 1; } },
    rakuten: { applicationId: APP_ID, accessKey: ACCESS_KEY },
    origin: "https://ouchi-dougubako.com",
  });
  assert.equal(stock.outcome, "ok");
  assert.equal(waits, 1);
  assert.equal(rakutenCalls.length, 1);
  assert.equal(rakutenCalls[0]?.accessKey, ACCESS_KEY);
  assert.equal(rakutenCalls[0]?.url.includes(ACCESS_KEY), false);

  let clock = 0;
  const sleeps: number[] = [];
  const pacer = createRakutenPacer({
    intervalMs: 1,
    now: () => clock,
    sleep: async (ms) => {
      sleeps.push(ms);
      clock += ms;
    },
  });
  await Promise.all([pacer.wait(), pacer.wait()]);
  assert.equal(RAKUTEN_MIN_INTERVAL_MS, 1000);
  assert.deepEqual(sleeps, [1000]);

  const page = "https://ouchi-dougubako.com/articles/example/";
  const seen: string[] = [];
  const report = await buildReport({
    origin: "https://ouchi-dougubako.com",
    now: new Date("2026-11-05T00:00:00.000Z"),
    limits: { maxPages: 5, maxLinks: 20, timeoutMs: 1000, concurrency: 2 },
    rakuten: { applicationId: APP_ID, accessKey: ACCESS_KEY },
    fetchImpl: async (input, init) => {
      const href = String(input);
      seen.push(href);
      const blocked = fetchBlockedReason(href);
      if (blocked === "rakuten_page") {
        assert.equal(new URL(href).hostname, "openapi.rakuten.co.jp");
        assert.equal(new URL(href).pathname, "/ichibams/api/IchibaItem/Search/20260701");
        assert.equal(new Headers(init?.headers).get("accessKey"), ACCESS_KEY);
        assert.equal(new URL(href).searchParams.has("affiliateId"), false);
        return new Response(JSON.stringify({ count: 1, items: [{ availability: 0 }] }), { status: 200 });
      }
      if (blocked) throw new Error(`blocked host was fetched: ${href}`);
      if (href.endsWith("/sitemap.xml")) {
        return new Response(`<urlset><loc>${page}</loc><loc>https://evil.example/no</loc></urlset>`, { status: 200 });
      }
      if (href === page) {
        return new Response(
          [
            `<a class="buy-link" href="https://www.amazon.co.jp/dp/B000EXAMPLE">Amazon</a>`,
            `<a href="https://px.a8.net/svt/ejp?a8mat=example">A8</a>`,
            `<a href="https://af.moshimo.com/af/c/click?a_id=example">Moshimo</a>`,
            `<a href="${affiliateItem}">Rakuten</a>`,
            `<a class="buy-link" href="https://shop.example/kettle?id=7&utm_source=news">Shop</a>`,
          ].join(""),
          { status: 200 },
        );
      }
      if (href.startsWith("https://shop.example/")) {
        assert.equal(new URL(href).searchParams.get("utm_source"), null);
        return new Response(null, { status: 404 });
      }
      throw new Error(`unexpected fetch: ${href}`);
    },
  });

  assert.equal(seen.some((href) => isAmazonHost(new URL(href).hostname)), false);
  assert.equal(seen.some((href) => isAffiliateRedirectHost(new URL(href).hostname)), false);
  assert.equal(seen.some((href) => hasTagParam(href)), false);
  assert.equal(seen.filter((href) => href.startsWith("https://openapi.rakuten.co.jp/")).length, 1);
  assert.equal(report.pagesFetched, 1);
  assert.equal(report.uniqueLinks, 5);
  assert.equal(report.skipped, 2);
  assert.equal(report.amazonDisabled, 1);
  assert.equal(report.rakutenUnchecked, 0);
  assert.equal(report.issues.length, 2);
  assert.equal(report.issues.some((issue) => issue.kind === "dead"), true);
  assert.equal(report.issues.some((issue) => issue.kind === "rakuten_unavailable"), true);
  const serialized = JSON.stringify(report);
  assert.equal(serialized.includes(ACCESS_KEY), false);
  assert.equal(serialized.includes(APP_ID), false);

  const sitemapRedirects: string[] = [];
  await assert.rejects(
    () =>
      buildReport({
        origin: "https://ouchi-dougubako.com",
        limits: { maxPages: 1, maxLinks: 1, timeoutMs: 1000, concurrency: 1 },
        fetchImpl: async (input) => {
          const href = String(input);
          sitemapRedirects.push(href);
          if (fetchBlockedReason(href)) throw new Error(`blocked host was fetched: ${href}`);
          return new Response(null, {
            status: 302,
            headers: { location: "https://www.amazon.co.jp/dp/B000EXAMPLE?tag=example" },
          });
        },
      }),
    /refusing to fetch a blocked URL/,
  );
  assert.deepEqual(sitemapRedirects, ["https://ouchi-dougubako.com/sitemap.xml"]);

  const toml = readFileSync(new URL("../wrangler.toml", import.meta.url), "utf8");
  assert.equal(/^\s*crons\s*=/m.test(toml), false);
  assert.equal(toml.includes("[triggers]"), false);
  assert.equal(/RAKUTEN_(APP_ID|ACCESS_KEY)\s*=\s*"/m.test(toml), false);
  assert.equal(toml.includes(ACCESS_KEY), false);
  assert.equal(toml.includes(APP_ID), false);

  for (const name of ["policy.ts", "amazon.ts", "rakuten.ts", "logic.ts", "index.ts", "self-check.ts"]) {
    const source = readFileSync(new URL(`./${name}`, import.meta.url), "utf8");
    assert.equal(source.includes("pk_"), false, name);
    assert.equal(source.includes("stocknotelife-22"), false, name);
  }
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
  assert.equal(readme.includes("stocknotelife-22"), false);
  assert.equal(readme.includes("pk_"), false);

  console.log("link-check policy tests ok");
}

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
