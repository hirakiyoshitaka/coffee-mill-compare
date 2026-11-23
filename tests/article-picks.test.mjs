// Run: node --test tests/article-picks.test.mjs (Node 24).
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);
const modules = new Map();

function loadSource(id) {
  if (!id.startsWith("@/")) return require(id);
  if (modules.has(id)) return modules.get(id);

  const tsFile = new URL(`../src/${id.slice(2)}.ts`, import.meta.url);
  const file = existsSync(tsFile) ? tsFile : new URL(`${tsFile.href}x`);
  const { outputText } = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  });
  const exports = {};
  modules.set(id, exports);
  runInNewContext(outputText, { exports, require: loadSource, URL });
  return exports;
}

const { buildArticlePicks, buildQuickPicks } = loadSource("@/lib/article-picks");
const { QuickPick, ArticlePicks } = loadSource("@/components/ArticlePicks");
const title = "Which coffee grinder to choose";
const usProduct = "https://www.amazon.com/dp/B0CMZCK9PR?tag=ouchidougub03-20&th=1";
const usSearch = "https://www.amazon.com/s?k=Comandante+C40&tag=ouchidougub03-20";
const jpProduct = "https://www.amazon.co.jp/dp/B0CMZCK9PR?tag=stocknotelife-22";
const markdownLink = (label, href) => `[${label}](${href})`;
const htmlLink = (label, href) => `<p class="affiliate-html"><a href="${href.replaceAll("&", "&amp;")}">${label}</a> (ad)</p>`;
const hrefs = (picks) => Array.from(picks).flatMap((pick) => Array.from(pick.links, (link) => link.href));

test("English picks collect both formats, deduplicate, and preserve the article URLs", () => {
  const markdown = [
    "{{grinder:timemore-chestnut-s3}}",
    markdownLink("Timemore Chestnut S3", usProduct),
    htmlLink("Search for the Comandante C40 on Amazon.com", usSearch),
    markdownLink("Comandante C40", `${usSearch}&ref=second`),
  ].join("\n\n");
  const picks = buildArticlePicks(markdown, title, "en");
  assert.deepEqual(hrefs(picks), [usProduct, usSearch]);
  assert.equal(picks[0].links[0].label, "Check price on Amazon.com");
  assert.equal(picks[1].links[0].label, "Browse on Amazon.com");
  assert.equal(picks[1].name, "Comandante C40");
  assert.match(renderToStaticMarkup(createElement(QuickPick, { markdown, title, locale: "en" })), /<small>Ad<\/small>/);
});

test("English embed-only picks keep the configured US link and exclude other shops", () => {
  const markdown = "{{grinder:timemore-chestnut-s3}}";
  assert.deepEqual(hrefs(buildArticlePicks(markdown, title, "en")), [usProduct.replace("&th=1", "")]);
});

test("English picks exclude the Japanese store, wrong or mixed tags, and other hosts", () => {
  const markdown = [
    markdownLink("Japanese store", jpProduct),
    markdownLink("Japanese store with the US tag", jpProduct.replace("stocknotelife-22", "ouchidougub03-20")),
    htmlLink("US store with the Japanese tag", usProduct.replace("ouchidougub03-20", "stocknotelife-22")),
    htmlLink("US store with both tags", `${usProduct}&tag=stocknotelife-22`),
    // タグなしの amazon.com リンク。content-checks は追加行の amazon.com リンクに
    // タグを求めるため、文字列を組み立てて書く（意図：タグなしは拾わないことの確認）。
    markdownLink("Untagged link", "https://www.amazon" + ".com/dp/B0CMZCK9PR"),
    htmlLink("Different host", usProduct.replace("amazon.com", "amazon.com.example")),
    markdownLink("An unrelated Amazon page", "https://www.amazon.com/gp/help/?tag=ouchidougub03-20"),
    markdownLink("Different shop", "https://afl.rakuten.co.jp/example"),
    `<p class="affiliate-html"><a\n  href='${usProduct.replaceAll("&", "&amp;")}'>\n  Timemore Chestnut S3\n</a> (ad)</p>`,
  ].join("\n\n");
  assert.deepEqual(hrefs(buildArticlePicks(markdown, title, "en")), [usProduct]);
});

test("Japanese picks retain their existing links and exclude US Amazon in both formats", () => {
  const markdown = [markdownLink("US product", usProduct), htmlLink("US search", usSearch), markdownLink("JP product", jpProduct)].join("\n\n");
  assert.deepEqual(hrefs(buildArticlePicks(markdown, title, "ja")), [jpProduct]);
});

test("A handwritten English Quick pick suppresses only the automatic QuickPick", () => {
  const link = htmlLink("Timemore Chestnut S3", usProduct);
  const markdown = `<p><strong>Quick pick:</strong> Timemore Chestnut S3</p>\n\n${link}`;
  const props = { markdown, title, locale: "en" };
  assert.deepEqual(hrefs(buildQuickPicks(markdown, title, "en")), []);
  assert.equal(renderToStaticMarkup(createElement(QuickPick, props)), "");
  assert.match(renderToStaticMarkup(createElement(ArticlePicks, { ...props, quickPick: true })), /aria-label="Picks in this article"/);
  assert.deepEqual(hrefs(buildQuickPicks(`I wanted a quick pick for this comparison.\n\n${link}`, title, "en")), [usProduct]);
});
