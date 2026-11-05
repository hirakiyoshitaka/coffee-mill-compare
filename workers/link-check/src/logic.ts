import { AMAZON_PAAPI_ENABLED, amazonStockHook } from "./amazon";
import { decideFetch, fetchBlockedReason, stripTrackingParams } from "./policy";
import {
  checkRakutenStock,
  createRakutenPacer,
  rakutenItemCodeFromUrl,
  rakutenSecretsReady,
  type Fetcher,
  type RakutenPacer,
  type RakutenSecrets,
} from "./rakuten";

export type { Fetcher, RakutenSecrets };

export type BuyLink = { url: string; pages: string[] };

export type IssueKind = "dead" | "blocked" | "fetch_failed" | "rakuten_unavailable" | "rakuten_api_error";

export type Issue = {
  url: string;
  pages: string[];
  kind: IssueKind;
  status?: number;
  detail: string;
};

export type Report = {
  checkedAt: string;
  source: "json" | "sitemap";
  pagesFetched: number;
  pageErrors: number;
  uniqueLinks: number;
  ok: number;
  skipped: number;
  amazonDisabled: number;
  rakutenUnchecked: number;
  issues: Issue[];
  truncated: boolean;
};

export type Limits = {
  maxPages: number;
  maxLinks: number;
  timeoutMs: number;
  concurrency: number;
};

export const LIMITS: Limits = {
  maxPages: 200,
  maxLinks: 300,
  timeoutMs: 12_000,
  concurrency: 4,
};

const BUY_HOST =
  /(?:^|\.)(?:amazon\.(?:com|co\.jp|co\.uk|de|fr|ca|com\.au)|amzn\.(?:to|asia|com)|rakuten\.co\.jp|afl\.rakuten\.co\.jp|px\.a8\.net|a8\.net|moshimo\.com|valuecommerce\.com|invl\.me|shopee\.(?:tw|com\.my|sg|co\.th|vn|ph|co\.id)|shp\.ee|shopping\.yahoo\.co\.jp)$/i;

const USER_AGENT = "Mozilla/5.0 (compatible; OuchiDougubakoLinkCheck/1.0; +https://ouchi-dougubako.com)";

export type LinkCheckResult =
  | { outcome: "ok" }
  | { outcome: "skipped"; reason: string }
  | { outcome: "amazon_disabled" }
  | { outcome: "rakuten_unchecked" }
  | { outcome: "issue"; kind: IssueKind; status?: number; detail: string };

export type CheckContext = {
  pacer?: RakutenPacer;
  rakuten?: RakutenSecrets;
  origin?: string;
};

function hostname(href: string): string | undefined {
  try {
    return new URL(href).hostname;
  } catch {
    return undefined;
  }
}

export function isBuyUrl(href: string): boolean {
  const host = hostname(href);
  return host ? BUY_HOST.test(host) : false;
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

export function sitemapLocs(xml: string): { kind: "index" | "urlset"; locs: string[] } {
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((match) => decodeEntities(match[1] ?? "").trim());
  return { kind: /<sitemapindex[\s>]/i.test(xml) ? "index" : "urlset", locs: locs.filter((loc) => /^https?:\/\//i.test(loc)) };
}

export function extractBuyLinks(html: string, pageUrl: string): string[] {
  const found = new Set<string>();
  for (const match of html.matchAll(/<a\b([^>]*?)>/gi)) {
    const attrs = match[1] ?? "";
    const hrefMatch = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(attrs);
    const raw = decodeEntities((hrefMatch?.[1] ?? hrefMatch?.[2] ?? hrefMatch?.[3] ?? "").trim());
    if (!raw || raw.startsWith("#") || /^javascript:/i.test(raw) || /^mailto:/i.test(raw)) continue;
    let href = raw;
    try {
      href = new URL(raw, pageUrl).href;
    } catch {
      continue;
    }
    const isButton = /\bclass\s*=\s*(?:"[^"]*\bbuy-link\b[^"]*"|'[^']*\bbuy-link\b[^']*')/i.test(attrs);
    if ((isButton && /^https?:\/\//i.test(href)) || isBuyUrl(href)) found.add(href);
  }
  return [...found];
}

export function parseLinkSource(raw: string): BuyLink[] {
  const data: unknown = JSON.parse(raw);
  const list = Array.isArray(data) ? data : isRecord(data) && Array.isArray(data.links) ? data.links : [];
  const out: BuyLink[] = [];
  for (const item of list) {
    if (typeof item === "string") {
      if (isBuyUrl(item)) out.push({ url: item, pages: [] });
      continue;
    }
    if (!isRecord(item) || typeof item.url !== "string" || !isBuyUrl(item.url)) continue;
    const page = typeof item.page === "string" ? item.page : "";
    out.push({ url: item.url, pages: page ? [page] : [] });
  }
  return out;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function classifyStatus(status: number): { ok: true } | { ok: false; kind: IssueKind; detail: string } {
  if (status === 404 || status === 410) return { ok: false, kind: "dead", detail: `HTTP ${status}` };
  if (status === 401 || status === 403 || status === 429 || status === 503) return { ok: false, kind: "blocked", detail: `HTTP ${status}` };
  if (status >= 500 || status === 0) return { ok: false, kind: "fetch_failed", detail: `HTTP ${status}` };
  if (status >= 400) return { ok: false, kind: "dead", detail: `HTTP ${status}` };
  if (status >= 200 && status < 300) return { ok: true };
  return { ok: false, kind: "fetch_failed", detail: `HTTP ${status}` };
}

function sameOrigin(origin: string, url: string): boolean {
  try {
    return new URL(url).origin === new URL(origin).origin;
  } catch {
    return false;
  }
}

async function mapPool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      const item = items[index];
      if (item === undefined) continue;
      results[index] = await fn(item);
    }
  });
  await Promise.all(workers);
  return results;
}

function safeErrorDetail(error: unknown): string {
  const message = error instanceof Error ? error.message : "fetch failed";
  const cleaned = message.replace(/https?:\/\/\S+/gi, "[url]").trim();
  return (cleaned || "fetch failed").slice(0, 180);
}

async function readText(fetchImpl: Fetcher, url: string, timeoutMs: number): Promise<Response> {
  let current = url;
  for (let hop = 0; hop < 4; hop += 1) {
    if (fetchBlockedReason(current)) throw new Error("refusing to fetch a blocked URL");
    const res = await fetchImpl(current, {
      method: "GET",
      redirect: "manual",
      headers: { "user-agent": USER_AGENT, accept: "text/html,application/xhtml+xml,application/xml" },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.status < 300 || res.status >= 400) return res;
    const location = res.headers.get("location");
    await res.body?.cancel();
    if (!location) throw new Error("redirect had no location");
    current = new URL(location, current).href;
  }
  throw new Error("too many redirects");
}

export async function collectFromSitemap(
  origin: string,
  fetchImpl: Fetcher,
  limits: Limits,
): Promise<{ links: BuyLink[]; pagesFetched: number; pageErrors: number; truncated: boolean }> {
  const root = origin.replace(/\/+$/, "");
  const sitemapUrl = `${root}/sitemap.xml`;
  const sitemap = await readText(fetchImpl, sitemapUrl, limits.timeoutMs);
  if (!sitemap.ok) throw new Error(`sitemap HTTP ${sitemap.status}`);
  const first = sitemapLocs(await sitemap.text());
  let pageUrls = first.locs.filter((loc) => sameOrigin(root, loc));
  if (first.kind === "index") {
    const children = pageUrls.slice(0, 20);
    pageUrls = [];
    for (const child of children) {
      const res = await readText(fetchImpl, child, limits.timeoutMs);
      if (!res.ok) continue;
      const parsed = sitemapLocs(await res.text());
      pageUrls.push(...parsed.locs.filter((loc) => sameOrigin(root, loc)));
    }
  }

  let truncated = pageUrls.length > limits.maxPages;
  pageUrls = pageUrls.slice(0, limits.maxPages);
  const byUrl = new Map<string, string[]>();
  let pagesFetched = 0;
  let pageErrors = 0;

  await mapPool(pageUrls, limits.concurrency, async (page) => {
    try {
      const res = await readText(fetchImpl, page, limits.timeoutMs);
      if (!res.ok) {
        pageErrors += 1;
        await res.body?.cancel();
        return;
      }
      const html = await res.text();
      pagesFetched += 1;
      for (const url of extractBuyLinks(html, page)) {
        const pages = byUrl.get(url) ?? [];
        if (!pages.includes(page)) pages.push(page);
        byUrl.set(url, pages);
      }
    } catch {
      pageErrors += 1;
    }
  });

  let links = [...byUrl.entries()].map(([url, pages]) => ({ url, pages }));
  if (links.length > limits.maxLinks) {
    truncated = true;
    links = links.slice(0, limits.maxLinks);
  }
  return { links, pagesFetched, pageErrors, truncated };
}

async function inspectLink(url: string, fetchImpl: Fetcher, timeoutMs: number, ctx: CheckContext, pacer: RakutenPacer, hops: number): Promise<LinkCheckResult> {
  if (hops > 3) return { outcome: "issue", kind: "fetch_failed", detail: "too many redirects" };
  const decision = decideFetch(url, rakutenItemCodeFromUrl(url));
  if (decision.action === "skip") return { outcome: "skipped", reason: decision.reason };
  if (decision.action === "amazon_disabled") {
    const hook = amazonStockHook(url);
    if (hook.fetched !== false || hook.enabled !== false || AMAZON_PAAPI_ENABLED) {
      return { outcome: "issue", kind: "fetch_failed", detail: "Amazon fetch is disabled" };
    }
    return { outcome: "amazon_disabled" };
  }
  if (decision.action === "rakuten_api") {
    if (!rakutenSecretsReady(ctx.rakuten)) return { outcome: "rakuten_unchecked" };
    const checked = await checkRakutenStock({
      itemCode: decision.itemCode,
      applicationId: ctx.rakuten.applicationId,
      accessKey: ctx.rakuten.accessKey,
      origin: ctx.origin,
      fetchImpl,
      timeoutMs,
      pacer,
    });
    if (checked.ok) return { outcome: "ok" };
    return { outcome: "issue", kind: checked.kind, status: checked.status, detail: checked.detail };
  }
  return probePlain(decision.url, fetchImpl, timeoutMs, ctx, pacer, hops);
}

async function probePlain(
  cleanUrl: string,
  fetchImpl: Fetcher,
  timeoutMs: number,
  ctx: CheckContext,
  pacer: RakutenPacer,
  hops: number,
): Promise<LinkCheckResult> {
  const target = stripTrackingParams(cleanUrl);
  if (fetchBlockedReason(target)) return { outcome: "issue", kind: "fetch_failed", detail: "refusing to fetch a blocked URL" };

  for (const method of ["HEAD", "GET"] as const) {
    let res: Response;
    try {
      res = await fetchImpl(target, {
        method,
        redirect: "manual",
        headers: { "user-agent": USER_AGENT, accept: "text/html,application/xhtml+xml" },
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      if (method === "HEAD") continue;
      return { outcome: "issue", kind: "fetch_failed", detail: safeErrorDetail(error) };
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      await res.body?.cancel();
      if (!location) return { outcome: "issue", kind: "fetch_failed", detail: "redirect had no location" };
      let next = "";
      try {
        next = new URL(location, target).href;
      } catch {
        return { outcome: "issue", kind: "fetch_failed", detail: "redirect had no location" };
      }
      return inspectLink(next, fetchImpl, timeoutMs, ctx, pacer, hops + 1);
    }

    if ((res.status === 405 || res.status === 501) && method === "HEAD") {
      await res.body?.cancel();
      continue;
    }

    await res.body?.cancel();
    const judged = classifyStatus(res.status);
    if (judged.ok) return { outcome: "ok" };
    return { outcome: "issue", kind: judged.kind, status: res.status, detail: judged.detail };
  }

  return { outcome: "issue", kind: "fetch_failed", detail: "HEAD and GET failed" };
}

export async function checkBuyLink(url: string, fetchImpl: Fetcher, timeoutMs: number, ctx: CheckContext = {}): Promise<LinkCheckResult> {
  const pacer = ctx.pacer ?? createRakutenPacer();
  try {
    return await inspectLink(url, fetchImpl, timeoutMs, ctx, pacer, 0);
  } catch (error) {
    return { outcome: "issue", kind: "fetch_failed", detail: safeErrorDetail(error) };
  }
}

export async function buildReport(input: {
  origin: string;
  linkSourceUrl?: string;
  fetchImpl: Fetcher;
  limits?: Limits;
  now?: Date;
  rakuten?: RakutenSecrets;
  pacer?: RakutenPacer;
}): Promise<Report> {
  const limits = input.limits ?? LIMITS;
  const sourceUrl = input.linkSourceUrl?.trim() ?? "";
  let source: Report["source"] = "sitemap";
  let pagesFetched = 0;
  let pageErrors = 0;
  let truncated = false;
  let found: BuyLink[] = [];

  if (sourceUrl) {
    if (!/^https:\/\//i.test(sourceUrl)) throw new Error("LINK_SOURCE_URL must be https");
    if (fetchBlockedReason(sourceUrl)) throw new Error("LINK_SOURCE_URL is a host this checker does not fetch");
    source = "json";
    const res = await readText(input.fetchImpl, sourceUrl, limits.timeoutMs);
    if (!res.ok) throw new Error(`link source HTTP ${res.status}`);
    const parsed = parseLinkSource(await res.text());
    truncated = parsed.length > limits.maxLinks;
    found = parsed.slice(0, limits.maxLinks);
  } else {
    const collected = await collectFromSitemap(input.origin, input.fetchImpl, limits);
    found = collected.links;
    pagesFetched = collected.pagesFetched;
    pageErrors = collected.pageErrors;
    truncated = collected.truncated;
  }

  const pagesByUrl = new Map<string, string[]>();
  for (const link of found) {
    const pages = pagesByUrl.get(link.url) ?? [];
    for (const page of link.pages) {
      if (page && !pages.includes(page)) pages.push(page);
    }
    pagesByUrl.set(link.url, pages);
  }

  const urls = [...pagesByUrl.keys()];
  const pacer = input.pacer ?? createRakutenPacer();
  const checked = await mapPool(urls, limits.concurrency, async (url) => ({
    url,
    result: await checkBuyLink(url, input.fetchImpl, limits.timeoutMs, {
      pacer,
      rakuten: input.rakuten,
      origin: input.origin,
    }),
  }));

  const issues: Issue[] = [];
  let ok = 0;
  let skipped = 0;
  let amazonDisabled = 0;
  let rakutenUnchecked = 0;
  for (const item of checked) {
    if (item.result.outcome === "ok") {
      ok += 1;
      continue;
    }
    if (item.result.outcome === "skipped") {
      skipped += 1;
      continue;
    }
    if (item.result.outcome === "amazon_disabled") {
      amazonDisabled += 1;
      continue;
    }
    if (item.result.outcome === "rakuten_unchecked") {
      rakutenUnchecked += 1;
      continue;
    }
    issues.push({
      url: item.url,
      pages: pagesByUrl.get(item.url) ?? [],
      kind: item.result.kind,
      status: item.result.status,
      detail: item.result.detail,
    });
  }

  return {
    checkedAt: (input.now ?? new Date()).toISOString(),
    source,
    pagesFetched,
    pageErrors,
    uniqueLinks: urls.length,
    ok,
    skipped,
    amazonDisabled,
    rakutenUnchecked,
    issues,
    truncated,
  };
}
