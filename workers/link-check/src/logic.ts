export type BuyLink = { url: string; pages: string[] };

export type IssueKind = "dead" | "amazon_unavailable" | "amazon_no_offer" | "blocked" | "fetch_failed";

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
  /(?:^|\.)(?:amazon\.(?:com|co\.jp|co\.uk|de|fr|ca|com\.au)|amzn\.(?:to|asia|com)|rakuten\.co\.jp|afl\.rakuten\.co\.jp|px\.a8\.net|moshimo\.com|valuecommerce\.com|invl\.me|shopee\.(?:tw|com\.my|sg|co\.th|vn|ph|co\.id)|shp\.ee|shopping\.yahoo\.co\.jp)$/i;

const AMAZON_HOST = /(?:^|\.)(?:amazon\.(?:com|co\.jp|co\.uk|de|fr|ca|com\.au)|amzn\.(?:to|asia|com))$/i;

const USER_AGENT = "Mozilla/5.0 (compatible; OuchiDougubakoLinkCheck/1.0; +https://ouchi-dougubako.com)";

export type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;

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

export function isAmazonUrl(href: string): boolean {
  const host = hostname(href);
  return host ? AMAZON_HOST.test(host) : false;
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

export function classifyFetched(input: { url: string; status: number; finalUrl: string; body: string }): { ok: true } | { ok: false; kind: IssueKind; detail: string } {
  const { status, finalUrl, body } = input;
  if (status === 404 || status === 410) return { ok: false, kind: "dead", detail: `HTTP ${status}` };
  if (status === 401 || status === 403 || status === 429 || status === 503) return { ok: false, kind: "blocked", detail: `HTTP ${status}` };
  if (status >= 500 || status === 0) return { ok: false, kind: "fetch_failed", detail: `HTTP ${status}` };
  if (status >= 400) return { ok: false, kind: "dead", detail: `HTTP ${status}` };
  if (/\/(?:errors\/|gp\/errors|404)|sorry\.html/i.test(finalUrl)) return { ok: false, kind: "dead", detail: `landed on ${finalUrl}` };

  const amazon = isAmazonUrl(input.url) || isAmazonUrl(finalUrl);
  if (!amazon) return { ok: true };

  const sample = body.slice(0, 300_000);
  if (/robot check|type the characters you see|enter the characters you see|api-services-support@amazon\.com|to discuss automated access|captcha-delivery|validateCaptcha/i.test(sample)) {
    return { ok: false, kind: "blocked", detail: "Amazon bot check" };
  }
  const signal = amazonOfferSignal(sample);
  if (signal) return { ok: false, kind: signal.kind, detail: signal.detail };
  return { ok: true };
}

function amazonOfferSignal(body: string): { kind: "amazon_unavailable" | "amazon_no_offer"; detail: string } | null {
  const rules: [RegExp, "amazon_unavailable" | "amazon_no_offer", string][] = [
    [/schema\.org\/(?:OutOfStock|SoldOut|Discontinued)/i, "amazon_unavailable", "schema.org availability"],
    [/currently unavailable/i, "amazon_unavailable", "currently unavailable"],
    [/we don['’]t know when or if this item will be back in stock/i, "amazon_unavailable", "no restock date"],
    [/temporarily out of stock/i, "amazon_unavailable", "temporarily out of stock"],
    [/この商品は現在お取り扱いできません/, "amazon_unavailable", "この商品は現在お取り扱いできません"],
    [/現在在庫切れ/, "amazon_unavailable", "現在在庫切れ"],
    [/一時的に在庫切れ/, "amazon_unavailable", "一時的に在庫切れ"],
    [/no featured offers available/i, "amazon_no_offer", "no featured offers"],
    [/unavailable from the seller/i, "amazon_no_offer", "unavailable from the seller"],
    [/出品者が見つかりません/, "amazon_no_offer", "出品者が見つかりません"],
  ];
  for (const [pattern, kind, detail] of rules) {
    if (pattern.test(body)) return { kind, detail };
  }
  return null;
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

async function readText(fetchImpl: Fetcher, url: string, timeoutMs: number): Promise<Response> {
  return fetchImpl(url, {
    method: "GET",
    redirect: "follow",
    headers: { "user-agent": USER_AGENT, accept: "text/html,application/xhtml+xml,application/xml" },
    signal: AbortSignal.timeout(timeoutMs),
  });
}

export async function collectFromSitemap(origin: string, fetchImpl: Fetcher, limits: Limits): Promise<{ links: BuyLink[]; pagesFetched: number; pageErrors: number; truncated: boolean }> {
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

export async function checkBuyLink(url: string, fetchImpl: Fetcher, timeoutMs: number): Promise<{ ok: true } | { ok: false; kind: IssueKind; status?: number; detail: string }> {
  try {
    const res = await readText(fetchImpl, url, timeoutMs);
    const finalUrl = res.url || url;
    const amazon = isAmazonUrl(url) || isAmazonUrl(finalUrl);
    const body = amazon ? (await res.text()).slice(0, 300_000) : "";
    if (!amazon) await res.body?.cancel();
    const judged = classifyFetched({ url, status: res.status, finalUrl, body });
    if (judged.ok) return { ok: true };
    return { ok: false, kind: judged.kind, status: res.status, detail: judged.detail };
  } catch (error) {
    const message = error instanceof Error ? error.message : "fetch failed";
    return { ok: false, kind: "fetch_failed", detail: message.slice(0, 200) };
  }
}

export async function buildReport(input: { origin: string; linkSourceUrl?: string; fetchImpl: Fetcher; limits?: Limits; now?: Date }): Promise<Report> {
  const limits = input.limits ?? LIMITS;
  const sourceUrl = input.linkSourceUrl?.trim() ?? "";
  let source: Report["source"] = "sitemap";
  let pagesFetched = 0;
  let pageErrors = 0;
  let truncated = false;
  let found: BuyLink[] = [];

  if (sourceUrl) {
    if (!/^https:\/\//i.test(sourceUrl)) throw new Error("LINK_SOURCE_URL must be https");
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
  const checked = await mapPool(urls, limits.concurrency, async (url) => ({ url, result: await checkBuyLink(url, input.fetchImpl, limits.timeoutMs) }));
  const issues: Issue[] = [];
  let ok = 0;
  for (const item of checked) {
    if (item.result.ok) {
      ok += 1;
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
    issues,
    truncated,
  };
}
