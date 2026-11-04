import { isHttpUrl } from "@/lib/affiliate";

/**
 * 台湾の Shopee アフィリエイト URL。商品 ID ごと。すべて空。
 * 空、または http(s) でない値はボタンを出さない。
 * マレーシア向けの invl.me を、行き先だけ変えて使い回さない。リンクは作らない。
 * URL を入れたら、繁體中文（台灣）の広告表記に Shopee 台湾を足す。
 */
export const shopeeTwAffiliateUrlByProductId: Record<string, string> = {
  "timemore-chestnut-s5-pro": "",
  "epeios-essence-go": "",
  "coffee-carrot": "",
  "leo-specialty-coffee": "",
  "lab-cafe": "",
  "sawai-coffee": "",
};

export function shopeeTwAffiliateUrl(productId: string): string | undefined {
  const url = shopeeTwAffiliateUrlByProductId[productId]?.trim() ?? "";
  if (!isHttpUrl(url)) return undefined;
  return url;
}
