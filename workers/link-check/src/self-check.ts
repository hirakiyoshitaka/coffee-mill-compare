import assert from "node:assert/strict";
import { buildReport, classifyFetched, extractBuyLinks, parseLinkSource, sitemapLocs } from "./logic";

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset>
  <loc>https://ouchi-dougubako.com/en/articles/example/</loc>
  <loc>https://evil.example/steal</loc>
</urlset>`;
assert.equal(sitemapLocs(sitemap).kind, "urlset");
assert.deepEqual(sitemapLocs(sitemap).locs, ["https://ouchi-dougubako.com/en/articles/example/", "https://evil.example/steal"]);
assert.equal(sitemapLocs("<sitemapindex><loc>https://ouchi-dougubako.com/sitemap-0.xml</loc></sitemapindex>").kind, "index");

const html = `
<a href="/about/">About</a>
<a class="buy-link" href="https://www.amazon.co.jp/dp/B0HF4LXCCY?tag=stocknotelife-22&amp;th=1">Amazon</a>
<a class="buy-link" href="https://shop.example/future">Future</a>
<a href="https://hb.afl.rakuten.co.jp/ichiba/abc">Rakuten</a>
<a href="https://example.com/blog">Not a buy link</a>
`;
const links = extractBuyLinks(html, "https://ouchi-dougubako.com/en/articles/example/");
assert.ok(links.includes("https://www.amazon.co.jp/dp/B0HF4LXCCY?tag=stocknotelife-22&th=1"));
assert.ok(links.includes("https://shop.example/future"));
assert.ok(links.includes("https://hb.afl.rakuten.co.jp/ichiba/abc"));
assert.equal(links.some((href) => href.endsWith("/about/")), false);
assert.equal(links.some((href) => href.includes("example.com/blog")), false);

const missing = classifyFetched({ url: "https://www.amazon.com/dp/B000000000", status: 404, finalUrl: "https://www.amazon.com/dp/B000000000", body: "" });
assert.equal(missing.ok, false);
if (!missing.ok) assert.equal(missing.kind, "dead");
const serverError = classifyFetched({ url: "https://hb.afl.rakuten.co.jp/x", status: 502, finalUrl: "https://hb.afl.rakuten.co.jp/x", body: "" });
assert.equal(serverError.ok, false);
if (!serverError.ok) assert.equal(serverError.kind, "fetch_failed");
assert.equal(classifyFetched({ url: "https://www.amazon.com/dp/B000000000", status: 200, finalUrl: "https://www.amazon.com/dp/B000000000", body: "Currently unavailable. We don't know when or if this item will be back in stock." }).ok, false);
const unavailable = classifyFetched({ url: "https://www.amazon.co.jp/dp/B0HF4LXCCY", status: 200, finalUrl: "https://www.amazon.co.jp/dp/B0HF4LXCCY", body: "この商品は現在お取り扱いできません" });
assert.equal(unavailable.ok, false);
if (!unavailable.ok) assert.equal(unavailable.kind, "amazon_unavailable");
const noOffer = classifyFetched({ url: "https://www.amazon.com/dp/B000000000", status: 200, finalUrl: "https://www.amazon.com/dp/B000000000", body: "No featured offers available" });
assert.equal(noOffer.ok, false);
if (!noOffer.ok) assert.equal(noOffer.kind, "amazon_no_offer");
const blocked = classifyFetched({ url: "https://www.amazon.com/dp/B000000000", status: 200, finalUrl: "https://www.amazon.com/dp/B000000000", body: "Robot Check" });
assert.equal(blocked.ok, false);
if (!blocked.ok) assert.equal(blocked.kind, "blocked");
assert.equal(classifyFetched({ url: "https://hb.afl.rakuten.co.jp/x", status: 200, finalUrl: "https://item.rakuten.co.jp/x", body: "" }).ok, true);

const parsed = parseLinkSource(JSON.stringify({ links: [{ url: "https://invl.me/abc", page: "https://ouchi-dougubako.com/zh-tw/" }, { url: "https://example.com/nope" }] }));
assert.deepEqual(parsed, [{ url: "https://invl.me/abc", pages: ["https://ouchi-dougubako.com/zh-tw/"] }]);

async function checkPipeline(): Promise<void> {
  const page = "https://ouchi-dougubako.com/en/articles/example/";
  const amazon = "https://www.amazon.com/dp/B000000000";
  const report = await buildReport({
    origin: "https://ouchi-dougubako.com",
    now: new Date("2026-11-04T00:00:00.000Z"),
    limits: { maxPages: 10, maxLinks: 10, timeoutMs: 1000, concurrency: 2 },
    fetchImpl: async (input) => {
      if (input.endsWith("/sitemap.xml")) {
        return new Response(`<urlset><loc>${page}</loc><loc>https://evil.example/no</loc></urlset>`, { status: 200 });
      }
      if (input === page) {
        return new Response(`<a class="buy-link" href="${amazon}">Buy</a>`, { status: 200 });
      }
      if (input === amazon) {
        return new Response("Currently unavailable", { status: 200 });
      }
      return new Response("missing", { status: 404 });
    },
  });

  assert.equal(report.source, "sitemap");
  assert.equal(report.pagesFetched, 1);
  assert.equal(report.uniqueLinks, 1);
  assert.equal(report.issues.length, 1);
  assert.equal(report.issues[0]?.kind, "amazon_unavailable");
  assert.equal(report.issues[0]?.url, amazon);
  assert.deepEqual(report.issues[0]?.pages, [page]);
}

checkPipeline()
  .then(() => {
    console.log("link-check self-check ok");
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
