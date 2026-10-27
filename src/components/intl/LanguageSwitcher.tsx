import Link from "next/link";
import { hreflangOf } from "@/lib/articles";
import { languageOrder, type SiteLocale } from "@/lib/i18n";

/** 翻訳があるページだけを並べる言語切り替え */
export function LanguageSwitcher({ current, paths, label = "Language" }: { current: SiteLocale; paths: { locale: SiteLocale; href: string }[]; label?: string }) {
  const available = languageOrder.filter((l) => paths.some((p) => p.locale === l.locale));
  if (available.length < 2) return null;
  return (
    <nav aria-label={label} className="mb-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
      {available.map((l) => {
        const href = paths.find((p) => p.locale === l.locale)!.href;
        return l.locale === current ? (
          <span key={l.locale} aria-current="page" lang={hreflangOf[l.locale]} className="font-bold text-[var(--ink)]">
            {l.label}
          </span>
        ) : (
          <Link key={l.locale} href={href} lang={hreflangOf[l.locale]} hrefLang={hreflangOf[l.locale]} className="text-[var(--accent)] underline underline-offset-4">
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
