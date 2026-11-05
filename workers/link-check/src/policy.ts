/** URLs this checker must never request. */

const TRACKING_KEYS = new Set([
  "tag",
  "fbclid",
  "gclid",
  "gclsrc",
  "dclid",
  "gbraid",
  "wbraid",
  "msclkid",
  "yclid",
  "twclid",
  "ttclid",
  "igshid",
  "igsh",
  "mc_cid",
  "mc_eid",
  "_ga",
  "_gl",
  "srsltid",
  "sc_cid",
  "sc_channel",
]);

export type SkipReason = "unreadable_url" | "affiliate_redirect" | "tagged_url" | "rakuten_page";

export type FetchDecision =
  | { action: "skip"; reason: SkipReason }
  | { action: "amazon_disabled" }
  | { action: "rakuten_api"; itemCode: string }
  | { action: "plain"; url: string };

export type BlockedReason = "unreadable_url" | "affiliate_redirect" | "tagged_url" | "amazon" | "rakuten_page";

function normalizedHost(hostname: string): string {
  return hostname.toLowerCase().replace(/\.$/, "");
}

/** Affiliate and other redirect hosts. Never request these. */
export function isAffiliateRedirectHost(hostname: string): boolean {
  const host = normalizedHost(hostname);
  if (host === "a8.net" || host.endsWith(".a8.net")) return true;
  if (host === "invl.me" || host.endsWith(".invl.me")) return true;
  if (host === "moshimo.com" || host.endsWith(".moshimo.com")) return true;
  if (host.includes("afl.rakuten")) return true;
  if (host === "valuecommerce.com" || host.endsWith(".valuecommerce.com")) return true;
  if (host === "shp.ee" || host.endsWith(".shp.ee")) return true;
  return false;
}

/** amazon.* pages and the short hosts that send people there. */
export function isAmazonHost(hostname: string): boolean {
  const host = normalizedHost(hostname);
  if (/(^|\.)amazon\./.test(host)) return true;
  if (host === "amzn.to" || host.endsWith(".amzn.to")) return true;
  if (host === "amzn.asia" || host.endsWith(".amzn.asia")) return true;
  if (host === "amzn.com" || host.endsWith(".amzn.com")) return true;
  return false;
}

export function isRakutenPageHost(hostname: string): boolean {
  const host = normalizedHost(hostname);
  return host === "rakuten.co.jp" || host.endsWith(".rakuten.co.jp") || host === "rakuten.ne.jp" || host.endsWith(".rakuten.ne.jp");
}

/** True when the URL carries a query parameter named tag. */
export function hasTagParam(href: string): boolean {
  if (/(?:[?&#])tag=/i.test(href)) return true;
  try {
    const url = new URL(href);
    for (const key of url.searchParams.keys()) {
      if (key.toLowerCase() === "tag") return true;
    }
  } catch {
    return false;
  }
  return false;
}

export function fetchBlockedReason(href: string): BlockedReason | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return "unreadable_url";
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return "unreadable_url";
  if (hasTagParam(href)) return "tagged_url";
  if (isAffiliateRedirectHost(url.hostname)) return "affiliate_redirect";
  if (isAmazonHost(url.hostname)) return "amazon";
  if (isRakutenPageHost(url.hostname)) return "rakuten_page";
  return null;
}

export function stripTrackingParams(href: string): string {
  const url = new URL(href);
  const drop: string[] = [];
  for (const key of url.searchParams.keys()) {
    const lower = key.toLowerCase();
    if (lower.startsWith("utm_") || TRACKING_KEYS.has(lower)) drop.push(key);
  }
  for (const key of drop) url.searchParams.delete(key);
  return url.toString();
}

export function decideFetch(href: string, itemCode: string | null): FetchDecision {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return { action: "skip", reason: "unreadable_url" };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return { action: "skip", reason: "unreadable_url" };
  if (hasTagParam(href)) return { action: "skip", reason: "tagged_url" };
  if (isAffiliateRedirectHost(url.hostname)) {
    if (itemCode) return { action: "rakuten_api", itemCode };
    return { action: "skip", reason: "affiliate_redirect" };
  }
  if (isAmazonHost(url.hostname)) return { action: "amazon_disabled" };
  if (itemCode) return { action: "rakuten_api", itemCode };
  if (isRakutenPageHost(url.hostname)) return { action: "skip", reason: "rakuten_page" };
  return { action: "plain", url: stripTrackingParams(href) };
}
