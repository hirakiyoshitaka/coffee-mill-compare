/** 購入ボタンのクリックで送ってよい店。この4つ以外は送らない。 */
export const buyShops = ["Amazon", "Rakuten", "A8", "Shopee"] as const;

export type BuyShop = (typeof buyShops)[number];

export type BuyClickData = {
  shop: BuyShop;
  article: string;
};

const articlePath =
  /^\/(?:(?:en|zh-tw|zh-hk|zh-cn|ko|th|vi)\/)?(?:articles|kitchen)\/([a-z0-9-]+)\/?$/;

/**
 * 記事ページのスラッグだけを返す。クエリやハッシュは見ない。
 * 記事以外では空文字。URL そのものは返さない。
 */
export function articleSlugFromPath(pathname: string): string {
  let path = pathname.trim();
  if (/^https?:\/\//i.test(path)) {
    try {
      path = new URL(path).pathname;
    } catch {
      return "";
    }
  }
  path = path.split("#")[0]?.split("?")[0] ?? "";
  return path.match(articlePath)?.[1] ?? "";
}

function hostnameOf(href: string): string | null {
  const trimmed = href.trim();
  if (!trimmed || /^javascript:/i.test(trimmed) || trimmed.startsWith("#")) return null;
  try {
    return new URL(trimmed).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isAmazonHost(host: string): boolean {
  if (host.includes("media-amazon") || host.includes("images-amazon")) return false;
  return (
    host === "amazon.com" ||
    host.endsWith(".amazon.com") ||
    host === "amazon.co.jp" ||
    host.endsWith(".amazon.co.jp") ||
    host === "amzn.to" ||
    host.endsWith(".amzn.to") ||
    host === "amzn.asia" ||
    host.endsWith(".amzn.asia") ||
    host === "amzn.com" ||
    host.endsWith(".amzn.com")
  );
}

function isShopeeHost(host: string): boolean {
  if (host === "invl.me" || host.endsWith(".invl.me")) return true;
  return host === "shopee.com" || host.endsWith(".shopee.com") || /(?:^|\.)shopee\.[a-z.]+$/.test(host);
}

/** リンク先のホストだけを見て店を決める。URL は返さない。 */
export function shopOfHref(href: string): BuyShop | null {
  const host = hostnameOf(href);
  if (!host) return null;
  if (host === "a8.net" || host.endsWith(".a8.net")) return "A8";
  if (isShopeeHost(host)) return "Shopee";
  if (host === "rakuten.co.jp" || host.endsWith(".rakuten.co.jp")) return "Rakuten";
  if (isAmazonHost(host)) return "Amazon";
  return null;
}

/** track に渡すオブジェクト。店が4つのどれでもなければ null。 */
export function buyClickData(href: string, pathname: string): BuyClickData | null {
  const shop = shopOfHref(href);
  if (!shop) return null;
  return { shop, article: articleSlugFromPath(pathname) };
}
