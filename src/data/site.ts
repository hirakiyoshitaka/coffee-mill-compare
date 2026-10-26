export const siteConfig = {
  name: "おうちカフェ道具帳",
  description:
    "家でコーヒーを淹れる道具を、用途別に比べるノート。手挽きミルの仕様、価格の目安、口コミの傾向を整理しています。ドリッパーやケトルなどは順次追加します。",
  locale: "ja_JP" as const,
  operatorName: "おうちカフェ道具帳 編集部",
  contactEmail: "hiraki19680812@gmail.com",
  contactEmailIsPlaceholder: false,
  legalUpdated: "2026-10-25",
};

export function getSiteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").trim().replace(/\/+$/, "");
  if (!/^https?:\/\//.test(raw)) {
    throw new Error("NEXT_PUBLIC_SITE_URL は https:// から書いてください（末尾のスラッシュは不要です）");
  }
  return raw;
}

export function formatJaDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate;
  return `${match[1]}年${Number(match[2])}月${Number(match[3])}日`;
}
