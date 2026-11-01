import { BuyButtons } from "@/components/BuyButtons";
import { buildArticlePicks, buildQuickPicks, shouldShowArticlePicks, type ArticlePick } from "@/lib/article-picks";
import type { SiteLocale } from "@/lib/i18n";

const copy: Record<SiteLocale, { heading: string; note: string }> = {
  ja: {
    heading: "この記事のおすすめ",
    note: "この記事で紹介している購入先です。価格と在庫は、リンク先のページで確認してください。",
  },
  en: {
    heading: "Picks in this article",
    note: "Shops for the products in this article. Check the current price and availability on the store page.",
  },
  "zh-tw": {
    heading: "本文推薦",
    note: "以下是本文介紹的購買連結。價格與庫存請以商店頁面為準。",
  },
  "zh-hk": {
    heading: "本文推薦",
    note: "以下是本文介紹的購買連結。價錢與存貨請以商店頁面為準。",
  },
  ko: {
    heading: "이 글의 추천",
    note: "이 글에서 소개한 구매처입니다. 가격과 재고는 상점 페이지에서 확인해 주세요.",
  },
};

const quickCopy: Record<"ja" | "en", { heading: string; note: string }> = {
  ja: {
    heading: "おすすめ結論",
    note: "この記事で先に開く購入先です。価格と在庫は、リンク先で確認してください。",
  },
  en: {
    heading: "Quick pick",
    note: "Open these first. Check the current price and stock on the store page.",
  },
};

export function QuickPick({
  title,
  markdown,
  locale,
}: {
  title: string;
  markdown: string;
  locale: "ja" | "en";
}) {
  const picks = buildQuickPicks(markdown, title, locale);
  if (picks.length === 0) return null;
  const text = quickCopy[locale];
  return <PickList heading={text.heading} note={text.note} picks={picks} locale={locale} />;
}

export function ArticlePicks({
  title,
  markdown,
  locale = "ja",
  kind = "article",
  quickPick = false,
}: {
  title: string;
  markdown: string;
  locale?: SiteLocale;
  kind?: "article" | "kitchen";
  /** 日本語・英語の記事で、先頭の結論ボックスに出した商品はここから外す */
  quickPick?: boolean;
}) {
  const picks = buildArticlePicks(markdown, title, locale);
  if (!shouldShowArticlePicks(title, kind, picks)) return null;
  const quickKeys = new Set(
    quickPick ? buildQuickPicks(markdown, title, locale).map((pick) => pick.key) : [],
  );
  const shown = picks.filter((pick) => !quickKeys.has(pick.key));
  if (shown.length === 0) return null;
  const text = copy[locale];
  return <PickList heading={text.heading} note={text.note} picks={shown} locale={locale} />;
}

function PickList({
  heading,
  note,
  picks,
  locale,
}: {
  heading: string;
  note: string;
  picks: ArticlePick[];
  locale: SiteLocale;
}) {

  return (
    <aside className="article-picks" aria-label={heading}>
      <h2>{heading}</h2>
      <p className="fine">{note}</p>
      <ul className="picks">
        {picks.map((pick) => (
          <li key={pick.key} className="article-pick">
            <h3>{pick.name}</h3>
            <BuyButtons name={pick.name} links={pick.links} note={pick.note} locale={locale} />
          </li>
        ))}
      </ul>
    </aside>
  );
}
