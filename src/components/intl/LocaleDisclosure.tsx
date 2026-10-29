import type { Metadata } from "next";
import { LanguageSwitcher } from "@/components/intl/LanguageSwitcher";
import { getSiteUrl, siteConfig, localizedSiteName } from "@/data/site";
import { hreflangOf, translationLocales, type TranslationLocale } from "@/lib/articles";
import { chromeDict } from "@/lib/i18n";

type Section = { h: string; p: string[]; list?: string[] };
type Doc = { title: string; description: string; updated: string; sections: Section[] };

const programs = ["A8.net", "Rakuten Affiliate", "Amazon Associates (Amazon.co.jp)", "Yahoo! Shopping (ValueCommerce, etc.)", "Moshimo Affiliate"];

const docs: Record<TranslationLocale, Doc> = {
  "zh-tw": {
    title: "廣告揭露",
    description: "居家時光工具箱的聯盟行銷廣告、文章開頭的 PR 標示、排名與參考價格的原則。",
    updated: "最後更新",
    sections: [
      { h: "先告訴你：這裡有廣告", p: ["本站含廣告與聯盟行銷連結。", "本站為 Amazon 日本（Amazon.co.jp）的聯盟會員，透過合格銷售取得收入。", "本站可能從商品購買連結獲得報酬。依照日本《景品表示法》的隱性行銷規範，我們會清楚標示廣告：文章本文前會寫「廣告（PR）」，標題上方也會顯示 PR，每頁頁尾也放有上面兩句。"] },
      { h: "哪些連結是廣告", p: ["前往樂天市場、Amazon、Yahoo!購物、A8.net 的購買連結，以及聯盟行銷用的 HTML，都是聯盟廣告。連結會加上 rel=\"sponsored noopener\" 與 target=\"_blank\"。Amazon 商品連結附有聯盟標籤 tag=stocknotelife-22。商品照片本身也可能是購買連結（Amazon）。沒有設定網址的商品，不會顯示購買按鈕。", "已參加或預計參加的計畫如下："], list: programs },
      { h: "排名不看報酬", p: ["文章的排序與推薦，不是依聯盟報酬高低決定，而是依用途、規格、參考價格，以及社群中反覆出現的評論重點整理。資料中沒有的風味分數或虛構的最低價，我們不寫。"] },
      { h: "價格僅供參考", p: ["金額為日本市場的「參考價格」（日圓），會因商店、促銷、匯率與廠商調價而變動，並非台灣售價。透過 AmazonGlobal 寄送時，運費與關稅會在結帳時顯示。實際金額以商店頁面為準。"] },
      { h: "評論的處理方式", p: ["評論欄不是轉載特定貼文或星等，而是編輯部整理論壇與評測中反覆出現的重點。"] },
      { h: "營運者", p: [`${siteConfig.operatorName}。聯絡方式：${siteConfig.contactEmail}`] },
    ],
  },
  "zh-hk": {
    title: "廣告披露",
    description: "居家時光工具箱的聯盟推廣廣告、文章開頭的 PR 標示，以及排名與參考價錢的原則。",
    updated: "最後更新",
    sections: [
      { h: "先行說明：本站含廣告", p: ["本站含廣告及聯盟推廣連結。", "本站為 Amazon 日本（Amazon.co.jp）的聯盟會員，透過合資格銷售賺取收入。", "本站或會從商品購買連結收取報酬。根據日本《景品表示法》對隱性營銷的規範，本站會清楚標示廣告：文章正文前會註明「廣告（PR）」，標題上方亦會顯示 PR，每頁頁尾均載有以上兩句。"] },
      { h: "哪些連結屬於廣告", p: ["前往樂天市場、Amazon、Yahoo!購物、A8.net 的購買連結，以及聯盟推廣用的 HTML，均屬聯盟廣告。連結會加上 rel=\"sponsored noopener\" 及 target=\"_blank\"。Amazon 商品連結附有聯盟標籤 tag=stocknotelife-22。商品相片本身亦可能是購買連結（Amazon）。未設定網址的商品，不會顯示購買按鈕。", "已參加或計劃參加的計劃如下："], list: programs },
      { h: "排名不以報酬決定", p: ["文章排序及推介並非按聯盟報酬高低決定，而是按用途、規格、參考價錢，以及社群中反覆出現的評論重點整理。資料中沒有的風味評分或虛構的最低價，本站一概不寫。"] },
      { h: "價錢僅供參考", p: ["金額為日本市場的「參考價錢」（日圓），會因商店、優惠、匯率及廠商調價而變動，並非香港售價。經 AmazonGlobal 寄送時，運費會在結帳時顯示。實際金額以商店頁面為準。"] },
      { h: "評論的處理方式", p: ["評論欄並非轉載特定帖文或星級，而是編輯部整理論壇及評測中反覆出現的重點。"] },
      { h: "營運者", p: [`${siteConfig.operatorName}。聯絡方法：${siteConfig.contactEmail}`] },
    ],
  },
  ko: {
    title: "광고 고지",
    description: "집콕 시간의 도구상자의 제휴 광고, 글머리 PR 표시, 순위와 참고 가격에 대한 원칙입니다.",
    updated: "최종 업데이트",
    sections: [
      { h: "광고가 있다는 것을 먼저 알립니다", p: ["이 사이트에는 광고·제휴 마케팅 링크가 포함되어 있습니다.", "아마존 재팬(Amazon.co.jp) 어소시에이트로서 적격 판매를 통해 수익을 얻습니다.", "이 사이트는 상품 구매 링크를 통해 보수를 받을 수 있습니다. 일본 경품표시법의 스텔스 마케팅 규제에 따라 광고임을 알기 쉽게 표시합니다. 글 본문 앞에 「광고(PR)」를, 제목 위에도 PR을 표시하며, 모든 페이지 하단에 위 두 문장을 둡니다."] },
      { h: "어떤 링크가 광고인가", p: ["라쿠텐 시장, Amazon, Yahoo!쇼핑, A8.net으로 가는 구매 링크와 제휴용 HTML은 제휴 광고입니다. 링크에는 rel=\"sponsored noopener\"와 target=\"_blank\"를 붙입니다. Amazon 상품 링크에는 어소시에이트 태그 tag=stocknotelife-22가 붙습니다. 상품 사진 자체가 구매 링크(Amazon)인 경우도 있습니다. URL이 없는 상품에는 구매 버튼을 표시하지 않습니다.", "참여 중이거나 참여 예정인 프로그램은 다음과 같습니다."], list: programs },
      { h: "순위는 보수로 정하지 않습니다", p: ["글의 순서와 추천은 제휴 보수가 높은 순이 아닙니다. 용도, 사양, 참고 가격, 커뮤니티에서 반복되는 논점으로 정리합니다. 데이터에 없는 맛 점수나 가상의 최저가는 쓰지 않습니다."] },
      { h: "가격은 참고용입니다", p: ["금액은 일본 시장의 「참고 가격」(엔)이며 매장, 세일, 환율, 제조사 가격 변경에 따라 달라집니다. 한국 판매가가 아닙니다. AmazonGlobal 배송 시 배송비와 관세는 결제 화면에 표시됩니다. 실제 금액은 매장 페이지가 우선합니다."] },
      { h: "후기의 취급", p: ["후기란은 특정 게시물이나 별점을 옮긴 것이 아니라, 포럼과 리뷰에서 반복되는 논점을 편집부가 요약한 것입니다."] },
      { h: "운영", p: [`${siteConfig.operatorName}. 연락처: ${siteConfig.contactEmail}`] },
    ],
  },
  en: {
    title: "Advertising Disclosure",
    description: "How Ouchi Dougubako handles affiliate advertising, PR labels, rankings, and reference prices.",
    updated: "Last updated",
    sections: [
      { h: "Up front: this site has ads", p: ["This site contains ads and affiliate links.", "As an Amazon Associate (Amazon.co.jp), we earn from qualifying purchases.", "We may earn a commission from product links, at no extra cost to you. In line with Japan's rules on stealth marketing, every article is labeled as advertising before the main text, and a PR mark appears above the title."] },
      { h: "Which links are ads", p: ["Purchase links to Rakuten, Amazon.co.jp, Yahoo! Shopping, A8.net, and Shopee (via Involve Asia) are affiliate links. They carry rel=\"sponsored noopener\" and open in a new tab. Amazon.co.jp links include the associate tag stocknotelife-22. Links to Amazon.com in our English articles are plain search links with no affiliate tag; we currently earn nothing from them.", "Programs we take part in or plan to join:"], list: [...programs, "Involve Asia (Shopee Malaysia)"] },
      { h: "Rankings aren't for sale", p: ["Our order and recommendations are not based on commission rates. They are based on use case, specs, reference prices, and points that come up repeatedly in public reviews. We don't make up flavor scores or lowest prices."] },
      { h: "Prices are for reference", p: ["Prices are Japanese market estimates in yen unless stated otherwise. They change with stores, sales, exchange rates, and manufacturer price changes. Shipping, duties, and availability in your country are shown by the store at checkout."] },
      { h: "How we handle reviews", p: ["Review summaries condense points that come up repeatedly in forums and reviews; they are not copies of individual posts or star ratings. We only describe personal use for gear we actually use."] },
      { h: "Operator", p: [`${siteConfig.operatorName}. Contact: ${siteConfig.contactEmail}`] },
    ],
  },
};

export function disclosureLocalePaths() {
  return [{ locale: "ja" as const, href: "/disclosure/" }, ...translationLocales.map((l) => ({ locale: l, href: `/${l}/disclosure/` }))];
}

export function disclosureLanguages(): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const p of disclosureLocalePaths()) languages[hreflangOf[p.locale]] = p.href;
  languages["x-default"] = "/disclosure/";
  return languages;
}

export function localeDisclosureMetadata(locale: TranslationLocale): Metadata {
  const doc = docs[locale];
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { absolute: `${doc.title}｜${localizedSiteName[locale]}` },
    description: doc.description,
    alternates: { canonical: `/${locale}/disclosure/`, languages: disclosureLanguages() },
    robots: { index: true, follow: true },
  };
}

export function LocaleDisclosure({ locale }: { locale: TranslationLocale }) {
  const doc = docs[locale];
  return (
    <main className="page-wrap page-narrow">
      <LanguageSwitcher current={locale} paths={disclosureLocalePaths()} label={chromeDict[locale].lang} />
      <h1 className="page-title">{doc.title}</h1>
      <p className="mt-3 text-sm text-stone-500">
        {doc.updated}: {siteConfig.legalUpdated}
      </p>
      <div className="article-body mt-8">
        {doc.sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            {s.p.map((t) => (
              <p key={t}>{t}</p>
            ))}
            {s.list ? (
              <ul>
                {s.list.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </main>
  );
}
