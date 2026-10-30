/**
 * サイトの本番アドレス（末尾の / なし）。独自ドメインへ切り替えるときはこの1行だけ変えます。
 * 例: "https://ouchi-dougubako.com"。環境変数 NEXT_PUBLIC_SITE_URL があればそちらが優先です。
 */
export const SITE_URL = "https://ouchi-dougubako.com";

export const siteConfig = {
  name: "おうち時間の道具箱",
  /** コーヒー道具のコーナー名（旧サイト名） */
  coffeeSectionName: "おうちカフェ道具帳",
  description:
    "コーヒー道具、キッチン用品、ガジェットなど、おうち時間を楽しむ道具を用途別に比べるノート。手挽きミルの仕様や焙煎店の紹介も置いています。価格は目安です。",
  locale: "ja_JP" as const,
  operatorName: "おうち時間の道具箱 編集部",
  contactEmail: "hiraki19680812@gmail.com",
  contactEmailIsPlaceholder: false,
  legalUpdated: "2026-10-26",
};

/** 翻訳ページで使うサイト名 */
export const localizedSiteName = {
  "zh-tw": "居家時光工具箱",
  "zh-hk": "居家時光工具箱",
  ko: "집콕 시간의 도구상자",
  en: "Ouchi Dougubako",
} as const;

export function getSiteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || SITE_URL).trim().replace(/\/+$/, "");
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
