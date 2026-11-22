// Run: node --test tests/audit-fixes.test.mjs (Node 24).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as buyClick from "../src/lib/buy-click.ts";

const require = createRequire(import.meta.url);

// Execute the real component with controlled DOM/React effects; never send analytics.
function loadComponent(name, mocks, globals) {
  const source = readFileSync(new URL(`../src/components/${name}.tsx`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  });
  const exports = {};
  runInNewContext(outputText, {
    exports,
    require: (id) => Object.hasOwn(mocks, id) ? mocks[id] : require(id),
    ...globals,
  });
  return exports[name];
}

test("buy_click has exactly two fields, with separate US/JP shops and unchanged other shops", () => {
  for (const [host, shop] of [
    ["www.amazon.com", "amazon_com"], ["amazon.co.jp", "amazon_jp"],
    ["amzn.to", "Amazon"], ["amzn.asia", "Amazon"], ["amzn.com", "Amazon"],
    ["hb.afl.rakuten.co.jp", "Rakuten"], ["px.a8.net", "A8"], ["invl.me", "Shopee"],
  ]) {
    assert.deepEqual(buyClick.buyClickData(`https://${host}/example?private=value`, "/en/articles/test-article/?q=ignored#part"), {
      shop, article: "test-article",
    });
  }
  assert.equal(buyClick.buyClickData("https://amazon.com.evil.example/", "/"), null);
  assert.equal(buyClick.buyClickData("https://m.media-amazon.com/image.jpg?tag=ouchidougub03-20", "/"), null);
  assert.equal(buyClick.buyClickData("javascript:void(0)", "/"), null);
  assert.deepEqual(buyClick.buyClickData("https://amazon.com/example?tag=ouchidougub03-20", "/beans/"), { shop: "amazon_com", article: "" });
});

test("tracker counts left, middle and keyboard activation once; ignores right/non-buy clicks and cleans up", () => {
  const document = new EventTarget();
  const calls = [];
  let cleanup;
  class Element {
    constructor(anchor) { this.anchor = anchor; }
    closest(selector) { return selector === "a" ? this.anchor : null; }
  }
  class Anchor extends Element {
    constructor(kind = "buy-link") {
      super();
      this.anchor = this;
      this.href = "https://www.amazon.com/example?tag=ouchidougub03-20";
      this.classList = { contains: (name) => name === kind };
      this.relList = { contains: (name) => kind === "sponsored" && name === kind };
    }
  }
  const Component = loadComponent("BuyClickTracker", {
    react: { useEffect: (effect) => { cleanup = effect(); } },
    "@vercel/analytics": { track: (...args) => calls.push(JSON.parse(JSON.stringify(args))) },
    "@/lib/buy-click": buyClick,
  }, { document, window: { location: { pathname: "/en/articles/test-article/" } }, Element, HTMLAnchorElement: Anchor });
  const dispatch = (type, button, target, detail = 1) => {
    const event = new Event(type);
    Object.defineProperties(event, { button: { value: button }, target: { value: target }, detail: { value: detail } });
    document.dispatchEvent(event);
    assert.equal(event.defaultPrevented, false);
  };
  Component();
  const target = new Element(new Anchor());
  dispatch("click", 0, target);
  assert.equal(calls.length, 1);
  dispatch("click", 1, target); // Guard against an additional middle-button click.
  dispatch("auxclick", 1, target);
  assert.equal(calls.length, 2);
  dispatch("click", 0, target, 0); // Keyboard Enter.
  assert.equal(calls.length, 3);
  dispatch("auxclick", 2, target);
  dispatch("click", 2, target);
  dispatch("auxclick", 0, target);
  dispatch("click", 0, new Anchor("ordinary"));
  dispatch("click", 0, null);
  assert.equal(calls.length, 3);
  dispatch("auxclick", 1, new Anchor("sponsored"));
  assert.equal(calls.length, 4);
  for (const call of calls) assert.deepEqual(call, ["buy_click", { shop: "amazon_com", article: "test-article" }]);
  cleanup();
  dispatch("click", 0, target);
  dispatch("auxclick", 1, target);
  assert.equal(calls.length, 4);
});

function stickyHarness(locale) {
  const effects = [];
  const states = [];
  const values = [];
  const window = new EventTarget();
  const frames = new Map();
  let nextFrame = 0;
  let intersection;
  let disconnected = false;
  const body = { top: 400, height: 1000, getBoundingClientRect() { return this; } };
  const opening = {};
  const Component = loadComponent("StickyBuyBar", {
    react: {
      useEffect: (effect) => effects.push(effect),
      useState: (initial) => {
        const index = states.length;
        states.push(initial);
        return [initial, (value) => { states[index] = value; if (index === 0) values.push(value); }];
      },
    },
    "@/lib/affiliate": { affiliateRel: "sponsored nofollow noopener" },
    "./StickyBuyBar.module.css": { default: {} },
  }, {
    window,
    document: { getElementById: (id) => {
      assert.equal(id, locale === "ja" ? "article-opening" : "article-reading-body");
      return locale === "ja" ? opening : body;
    } },
    IntersectionObserver: class {
      constructor(callback) { intersection = callback; }
      observe(target) { assert.equal(target, opening); }
      disconnect() { disconnected = true; }
    },
    requestAnimationFrame: (callback) => { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame: (id) => frames.delete(id),
  });
  Component({ locale, targetId: locale === "ja" ? "article-opening" : undefined, name: "Test", href: "https://example.com/" });
  const cleanup = effects[0]();
  return {
    body, states, values, frames, cleanup,
    scroll() {
      window.dispatchEvent(new Event("scroll"));
      for (const [id, callback] of frames) { frames.delete(id); callback(); }
    },
    queueScroll() { window.dispatchEvent(new Event("scroll")); },
    observe(isIntersecting, bottom) { intersection([{ isIntersecting, boundingClientRect: { bottom } }]); },
    disconnected: () => disconnected,
  };
}

test("Japanese bar appears only after opening is above viewport, and hides when returning", () => {
  const h = stickyHarness("ja");
  for (const [intersecting, bottom, expected] of [[false, 500, false], [true, 100, false], [false, 0, false], [false, -1, true], [true, 50, false]]) {
    h.observe(intersecting, bottom);
    assert.equal(h.states[0], expected);
  }
  h.cleanup();
  assert.equal(h.disconnected(), true);
});

test("English bar uses only body start/end and top of viewport at the 30% boundary", () => {
  const h = stickyHarness("en");
  assert.equal(h.states[0], false);
  for (const [top, height, expected] of [[0, 1000, false], [-299, 1000, false], [-300, 1000, true], [-301, 1000, true], [-1000, 1000, true], [-299, 1000, false], [-300, 2000, false], [-600, 2000, true], [-10, 0, false]]) {
    Object.assign(h.body, { top, height });
    h.scroll();
    assert.equal(h.states[0], expected);
  }
  h.queueScroll();
  assert.equal(h.frames.size, 1);
  h.cleanup();
  assert.equal(h.frames.size, 0);
  const count = h.values.length;
  h.scroll();
  assert.equal(h.values.length, count);
});
