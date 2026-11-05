import assert from "node:assert/strict";
import { buildReport, classifyStatus, extractBuyLinks, parseLinkSource, sitemapLocs } from "./logic";
import { fetchBlockedReason } from "./policy";

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset>
  <loc>https://ouchi-dougubako.com/articles/example/</loc>
  <loc>https://evil.example/steal</loc>
</urlset>`;
assert.equal(sitemapLocs(sitemap).kind, "urlset");
assert.deepEqual(sitemapLocs(sitemap).locs, ["https://ouchi-dougubako.com/articles/example/", "https://evil.example/steal"]);
assert.equal(sitemapLocs("<sitemapindex><loc>https://ouchi-dougubako.com/sitemap-0.xml</loc></sitemapindex>").kind, "index");

const html = `
<a href="/about/">About</a>
<a class="buy-link" href="https://www.amazon.co.jp/dp/B000EXAMPLE?tag=example&amp;th=1">Amazon</a>
<a class="buy-link" href="https://shop.example/kettle?utm_source=news">Shop</a>
<a href="https://hb.afl.rakuten.co.jp/ichiba/example">Rakuten</a>
<a href="https://example.com/blog">Not a buy link</a>
`;
const links = extractBuyLinks(html, "https://ouchi-dougubako.com/articles/example/");
assert.ok(links.includes("https://www.amazon.co.jp/dp/B000EXAMPLE?tag=example&th=1"));
assert.ok(links.includes("https://shop.example/kettle?utm_source=news"));
assert.ok(links.includes("https://hb.afl.rakuten.co.jp/ichiba/example"));
assert.equal(links.some((href) => href.endsWith("/about/")), false);
assert.equal(links.some((href) => href.includes("example.com/blog")), false);

const missing = classifyStatus(404);
assert.equal(missing.ok, false);
if (!missing.ok) assert.equal(missing.kind, "dead");
const serverError = classifyStatus(502);
assert.equal(serverError.ok, false);
if (!serverError.ok) assert.equal(serverError.kind, "fetch_failed");
assert.equal(classifyStatus(200).ok, true);

const parsed = parseLinkSource(JSON.stringify({ links: [{ url: "https://invl.me/example", page: "https://ouchi-dougubako.com/articles/example/" }, { url: "https://example.com/nope" }] }));
assert.deepEqual(parsed, [{ url: "https://invl.me/example", pages: ["https://ouchi-dougubako.com/articles/example/"] }]);

async function checkPipeline(): Promise<void> {
  const page = "https://ouchi-dougubako.com/articles/example/";
  const amazon = "https://www.amazon.co.jp/dp/B000EXAMPLE?tag=example";
  const a8 = "https://px.a8.net/svt/ejp?a8mat=example";
  const shop = "https://shop.example/kettle?id=7&utm_source=news";
  const calls: string[] = [];
  const report = await buildReport({
    origin: "https://ouchi-dougubako.com",
    now: new Date("2026-11-05T00:00:00.000Z"),
    limits: { maxPages: 10, maxLinks: 10, timeoutMs: 1000, concurrency: 2 },
    fetchImpl: async (input) => {
      const href = String(input);
      calls.push(href);
      if (fetchBlockedReason(href)) throw new Error(`blocked host was fetched: ${href}`);
      if (href.endsWith("/sitemap.xml")) {
        return new Response(`<urlset><loc>${page}</loc><loc>https://evil.example/no</loc></urlset>`, { status: 200 });
      }
      if (href === page) {
        return new Response(`<a class="buy-link" href="${amazon}">Amazon</a><a href="${a8}">A8</a><a class="buy-link" href="${shop}">Shop</a>`, { status: 200 });
      }
      if (href.startsWith("https://shop.example/")) {
        assert.equal(new URL(href).searchParams.get("utm_source"), null);
        assert.equal(new URL(href).searchParams.get("id"), "7");
        return new Response(null, { status: 404 });
      }
      return new Response("missing", { status: 404 });
    },
  });

  assert.equal(calls.some((href) => href.includes("amazon.")), false);
  assert.equal(calls.some((href) => href.includes("px.a8.net")), false);
  assert.equal(calls.some((href) => href.includes("tag=")), false);
  assert.equal(report.source, "sitemap");
  assert.equal(report.pagesFetched, 1);
  assert.equal(report.uniqueLinks, 3);
  assert.equal(report.skipped, 2);
  assert.equal(report.amazonDisabled, 0);
  assert.equal(report.issues.length, 1);
  assert.equal(report.issues[0]?.kind, "dead");
  assert.equal(report.issues[0]?.url, shop);
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
