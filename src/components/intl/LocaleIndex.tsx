import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl, siteConfig } from "@/data/site";
import { getLocalizedArticles, hreflangOf, translationLocales, type TranslationLocale } from "@/lib/articles";
import { chromeDict } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/intl/LanguageSwitcher";

function indexPaths() {
  return [
    { locale: "ja" as const, href: "/articles/" },
    ...translationLocales.filter((l) => getLocalizedArticles(l).length > 0).map((l) => ({ locale: l, href: `/${l}/` })),
  ];
}

export function localeIndexMetadata(locale: TranslationLocale): Metadata {
  const t = chromeDict[locale];
  const languages: Record<string, string> = {};
  for (const p of indexPaths()) languages[hreflangOf[p.locale]] = p.href;
  languages["x-default"] = "/articles/";
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { absolute: `${t.listTitle}｜${siteConfig.name}` },
    description: t.listLead,
    alternates: { canonical: `/${locale}/`, languages },
    robots: { index: true, follow: true },
  };
}

export function LocaleIndex({ locale }: { locale: TranslationLocale }) {
  const t = chromeDict[locale];
  const articles = getLocalizedArticles(locale);
  return (
    <main className="page-wrap page-narrow">
      <LanguageSwitcher current={locale} paths={indexPaths()} label={t.lang} />
      <h1 className="font-serif text-[1.75rem] leading-snug tracking-wide text-[var(--ink)]">{t.listTitle}</h1>
      <p className="mt-4 text-base leading-relaxed text-stone-600">{t.listLead}</p>
      <ul className="mt-8 space-y-6">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link href={`/${locale}/articles/${a.slug}/`} className="font-serif text-lg text-[var(--accent)] underline-offset-4 hover:underline">
              {a.title}
            </Link>
            <p className="mt-1 text-sm leading-relaxed text-stone-600">{a.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
