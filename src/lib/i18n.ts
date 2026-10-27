import type { TranslationLocale } from "@/lib/articles";

export type SiteLocale = "ja" | TranslationLocale;

/** 言語切り替えの表示名（表示順） */
export const languageOrder: { locale: SiteLocale; label: string }[] = [
  { locale: "ja", label: "日本語" },
  { locale: "zh-tw", label: "繁體中文(台灣)" },
  { locale: "zh-hk", label: "繁體中文(香港)" },
  { locale: "ko", label: "한국어" },
];

/** 商品カードのラベル。ja は既存の日本語表示と同じ文言 */
export const cardDict: Record<
  SiteLocale,
  {
    drive: string;
    burr: string;
    burrSize: string;
    adjust: string;
    weight: string;
    diameterUnknown: string;
    price: string;
    priceNote?: string;
    buyNote: string;
    ad: string;
    external: string;
    rakuten: string;
    amazon: string;
    yahoo: string;
    review: string;
    brandPage: (brand: string) => string;
  }
> = {
  ja: {
    drive: "駆動",
    burr: "バー",
    burrSize: "バー径",
    adjust: "調整",
    weight: "重量",
    diameterUnknown: "公表値要確認",
    price: "価格の目安",
    buyNote: "購入リンク（広告）",
    ad: "広告",
    external: "外部サイト",
    rakuten: "楽天で見る",
    amazon: "Amazonで価格を見る",
    yahoo: "Yahoo!ショッピングで価格を見る",
    review: "レビューを読む",
    brandPage: (b) => `${b}のページへ`,
  },
  "zh-tw": {
    drive: "驅動",
    burr: "刀盤",
    burrSize: "刀盤尺寸",
    adjust: "調整",
    weight: "重量",
    diameterUnknown: "待確認官方數值",
    price: "參考價格",
    priceNote: "日本市場價格（日圓），僅供參考",
    buyNote: "購買連結（廣告）",
    ad: "廣告",
    external: "外部網站",
    rakuten: "在樂天（日本）查看",
    amazon: "在 Amazon.co.jp 查看價格",
    yahoo: "在 Yahoo!購物（日本）查看價格",
    review: "閱讀評測",
    brandPage: (b) => `${b} 品牌頁（日文）`,
  },
  "zh-hk": {
    drive: "驅動",
    burr: "刀盤",
    burrSize: "刀盤尺寸",
    adjust: "調整",
    weight: "重量",
    diameterUnknown: "待確認官方數值",
    price: "參考價錢",
    priceNote: "日本市場價格（日圓），並非香港售價",
    buyNote: "購買連結（廣告）",
    ad: "廣告",
    external: "外部網站",
    rakuten: "在樂天（日本）查看",
    amazon: "在 Amazon.co.jp 查看價錢",
    yahoo: "在 Yahoo!購物（日本）查看價錢",
    review: "閱讀評測",
    brandPage: (b) => `${b} 品牌頁（日文）`,
  },
  ko: {
    drive: "구동",
    burr: "버",
    burrSize: "버 지름",
    adjust: "조절",
    weight: "무게",
    diameterUnknown: "공식 수치 확인 필요",
    price: "참고 가격",
    priceNote: "일본 시장 가격(엔), 참고용",
    buyNote: "구매 링크(광고)",
    ad: "광고",
    external: "외부 사이트",
    rakuten: "라쿠텐(일본)에서 보기",
    amazon: "Amazon.co.jp에서 가격 보기",
    yahoo: "Yahoo!쇼핑(일본)에서 가격 보기",
    review: "리뷰 읽기",
    brandPage: (b) => `${b} 브랜드 페이지(일본어)`,
  },
};

/** 翻訳ページのヘッダー・フッター・一覧の文言 */
export const chromeDict: Record<
  TranslationLocale,
  { subtitle: string; articles: string; japanese: string; disclosure: string; listTitle: string; listLead: string; footerNote: string; skip: string; nav: string; lang: string }
> = {
  "zh-tw": {
    subtitle: "在家煮咖啡的器材筆記",
    articles: "文章",
    japanese: "日本語版",
    disclosure: "廣告揭露（日文）",
    listTitle: "文章列表",
    listLead: "依條件挑選居家咖啡器材。購買連結為 Amazon.co.jp 等日本商店，價格為日本市場價格。",
    footerNote: "本站含廣告與聯盟行銷連結。本站為 Amazon 日本的聯盟會員，透過合格銷售取得收入。",
    skip: "跳到主要內容",
    nav: "主選單",
    lang: "語言",
  },
  "zh-hk": {
    subtitle: "在家沖咖啡的器材筆記",
    articles: "文章",
    japanese: "日本語版",
    disclosure: "廣告披露（日文）",
    listTitle: "文章一覽",
    listLead: "按條件揀選在家用的咖啡器材。購買連結為 Amazon.co.jp 等日本商店，價錢為日本市場價格。",
    footerNote: "本站含廣告及聯盟推廣連結。本站為 Amazon 日本的聯盟會員，透過合資格銷售賺取收入。",
    skip: "跳到主要內容",
    nav: "主選單",
    lang: "語言",
  },
  ko: {
    subtitle: "집 커피 도구 노트",
    articles: "글 목록",
    japanese: "日本語版",
    disclosure: "광고 고지(일본어)",
    listTitle: "글 목록",
    listLead: "조건에 맞춰 집 커피 도구를 고릅니다. 구매 링크는 Amazon.co.jp 등 일본 쇼핑몰이며, 가격은 일본 시장 가격입니다.",
    footerNote: "이 사이트에는 광고·제휴 마케팅 링크가 포함되어 있습니다. 아마존 재팬 어소시에이트로서 적격 판매를 통해 수익을 얻습니다.",
    skip: "본문으로 건너뛰기",
    nav: "주요 메뉴",
    lang: "언어",
  },
};
