import { jpAmazonAssociateTag } from "@/lib/affiliate";
import type { GrinderType } from "@/data/grinders";

/**
 * 英語ページの手挽きミル向け、amazon.com のアソシエイトタグ。
 * 空のあいだは amazon.com の購入ボタンを出さない。
 * タグは作らない。日本の stocknotelife-22 を amazon.com に使い回さない。
 * タグを入れたら、英語の広告表記（disclosure・フッター）も合わせて直す。
 */
export const usAmazonAssociateTag = "";

/**
 * 手挽きミルごとの amazon.com ASIN。未確認は空文字。空ならボタンを出さない。
 * 2026-11-04 時点で、栗子 S5 Pro の amazon.com 商品ページと、
 * エペイオス Essence Go と同一商品の ASIN は確認できていないため空のまま。
 * 別機種（Chestnut C3 系、Cocinare ESSENCE GO）の ASIN は入れない。
 */
export const usAmazonAsinByGrinderId: Record<string, string> = {
  "timemore-chestnut-s5-pro": "",
  "epeios-essence-go": "",
};

/** タグと ASIN が両方あるときだけ、amazon.com の商品 URL を返す。 */
export function amazonComProductUrl(tag: string, asin: string): string | undefined {
  const cleanTag = tag.trim();
  const cleanAsin = asin.trim().toUpperCase();
  if (!cleanTag || !cleanAsin) return undefined;
  if (cleanTag === jpAmazonAssociateTag) return undefined;
  if (!/^[A-Za-z0-9][A-Za-z0-9-]{0,49}$/.test(cleanTag)) return undefined;
  if (!/^[A-Z0-9]{10}$/.test(cleanAsin)) return undefined;
  return `https://www.amazon.com/dp/${cleanAsin}?tag=${cleanTag}`;
}

/** 英語ページの手挽きミルだけ。タグか ASIN が空なら undefined。 */
export function englishHandGrinderAmazonUrl(model: { id: string; type: GrinderType }): string | undefined {
  if (model.type !== "manual") return undefined;
  return amazonComProductUrl(usAmazonAssociateTag, usAmazonAsinByGrinderId[model.id] ?? "");
}
