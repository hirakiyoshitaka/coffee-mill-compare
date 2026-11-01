import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { ArticlePicks, QuickPick } from "@/components/ArticlePicks";
import { ShareButtons } from "@/components/ShareButtons";
import { getSiteUrl, siteConfig, localizedSiteName } from "@/data/site";
import { LanguageSwitcher } from "@/components/intl/LanguageSwitcher";
import { chromeDict } from "@/lib/i18n";
import { articleLanguageAlternates, articleLocalePaths, getLocalizedArticle, getLocalizedArticles, hreflangOf, type TranslationLocale } from "@/lib/articles";

const ui: Record<TranslationLocale, { og: string; home: string; pr: string; disclosure: string; others: string; share: string }> = {
  "zh-tw": {
    og: "zh_TW",
    home: "日本語版",
    pr: "廣告（PR）",
    disclosure:
      "本文含廣告與聯盟行銷連結。本站為 Amazon 日本的聯盟會員，透過合格銷售取得收入。經由連結購買時，本站可能獲得報酬。推薦順序不以報酬高低決定，價格僅供參考。",
    others: "其他文章",
    share: "分享這篇文章",
  },
  "zh-hk": {
    og: "zh_HK",
    home: "日本語版",
    pr: "廣告（PR）",
    disclosure:
      "本文含廣告及聯盟推廣連結。本站為 Amazon 日本的聯盟會員，透過合資格銷售賺取收入。經連結購買時，本站或會獲得報酬。推薦次序不以報酬高低決定，文中價格為日本市場價格，僅供參考。",
    others: "其他文章",
    share: "分享這篇文章",
  },
  ko: {
    og: "ko_KR",
    home: "일본어판",
    pr: "광고(PR)",
    disclosure:
      "이 글에는 광고·제휴 마케팅 링크가 포함되어 있습니다. 이 사이트는 아마존 재팬 어소시에이트로서 적격 판매를 통해 수익을 얻습니다. 링크를 통해 구매하면 사이트가 수수료를 받을 수 있습니다. 소개 순서는 수수료와 무관하며, 가격은 참고용입니다.",
    others: "다른 글",
    share: "이 글 공유하기",
  },
  en: {
    og: "en_US",
    home: "Japanese edition",
    pr: "Advertising disclosure",
    disclosure:
      "This article contains ads and affiliate links. As an Amazon Associate (Amazon.co.jp), we earn from qualifying purchases, and we may earn a commission when you buy through some links at no extra cost to you. Rankings are not based on commission rates, and prices are for reference only.",
    others: "More articles",
    share: "Share this article",
  },
};

export function localizedStaticParams(locale: TranslationLocale) {
  return getLocalizedArticles(locale).map((a) => ({ slug: a.slug }));
}

export function localizedMetadata(locale: TranslationLocale, slug: string): Metadata {
  const article = getLocalizedArticle(locale, slug);
  if (!article) return {};
  const url = `/${locale}/articles/${slug}/`;
  const ogImage = { url: `/${locale}/articles/${slug}/og.png`, width: 1200, height: 630, alt: article.title };
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { absolute: `${article.title}｜${localizedSiteName[locale]}` },
    description: article.description,
    alternates: { canonical: url, languages: articleLanguageAlternates(slug) },
    robots: { index: true, follow: true },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      type: "article",
      locale: ui[locale].og,
      siteName: localizedSiteName[locale],
      publishedTime: article.date,
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.description, images: [ogImage.url] },
  };
}

export function LocalizedArticle({ locale, slug }: { locale: TranslationLocale; slug: string }) {
  const article = getLocalizedArticle(locale, slug);
  if (!article) notFound();
  const t = ui[locale];
  const related = getLocalizedArticles(locale).filter((a) => a.slug !== slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    inLanguage: hreflangOf[locale],
    author: { "@type": "Organization", name: siteConfig.operatorName },
    publisher: { "@type": "Organization", name: localizedSiteName[locale] },
  };
  return (
    <main className="page-wrap page-narrow">
      <LanguageSwitcher current={locale} paths={articleLocalePaths(slug)} label={chromeDict[locale].lang} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="mb-8">
        <p className="text-xs font-medium tracking-wide text-[var(--seal)]">PR</p>
        <h1 className="mt-3 font-serif text-[1.75rem] leading-snug tracking-wide text-[var(--ink)] sm:text-[2.15rem]">{article.title}</h1>
        <p className="mt-4 text-sm text-stone-500">
          <time dateTime={article.date}>{article.date}</time>
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-600">{article.description}</p>
      </header>
      <aside className="border border-[var(--line)] bg-[var(--soft)] px-5 py-4 text-[16px] leading-[1.9]">
        <p className="font-bold text-[var(--accent)]">{t.pr}</p>
        <p className="mt-1">{t.disclosure}</p>
      </aside>
      <div className="mt-8">
        {locale === "en" ? <QuickPick title={article.title} markdown={article.content} locale="en" /> : null}
        <ArticlePicks title={article.title} markdown={article.content} locale={locale} quickPick={locale === "en"} />
        <ArticleBody
          markdown={article.content}
          locale={locale}
          reviewHref={(s) => (s !== slug && getLocalizedArticle(locale, s) ? `/${locale}/articles/${s}/` : undefined)}
        />
      </div>
      <aside className="mt-14 border-t border-[var(--border-subtle)] pt-8">
        {related.length > 0 ? (
          <>
            <h2 className="font-serif text-xl text-stone-950">{t.others}</h2>
            <ul className="mt-4 space-y-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={`/${locale}/articles/${item.slug}/`} className="text-sm text-[var(--accent)] underline-offset-4 hover:underline">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </aside>
      <ShareButtons
        url={`${getSiteUrl()}/${locale}/articles/${slug}/`}
        title={article.title}
        label={t.share}
      />
    </main>
  );
}
