import Link from "next/link";
import { siteConfig, localizedSiteName } from "@/data/site";
import type { TranslationLocale } from "@/lib/articles";
import { chromeDict } from "@/lib/i18n";

export function LocaleHeader({ locale }: { locale: TranslationLocale }) {
  const t = chromeDict[locale];
  return (
    <header className="site-header">
      <Link href={`/${locale}/`} className="brand" aria-label={`${localizedSiteName[locale]} ${t.listTitle}`}>
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 28 28" width="22" height="22" fill="none">
            <path d="M7 12h11.5v1.6c0 3.4-2.5 6.1-5.7 6.1S7.1 17 7.1 13.6V12H7Z" stroke="currentColor" strokeWidth="1.4" />
            <path d="M18.5 13.2h2.1c1.1 0 1.9.7 1.9 1.7s-.8 1.7-1.9 1.7h-2.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M10 10.5c.4-1.2 1.2-1.8 2.2-1.8 1 0 1.5.5 2 1.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </span>
        <span>{localizedSiteName[locale]}</span>
        <span className="brand-caption">{t.subtitle}</span>
      </Link>
      <nav className="site-nav" aria-label={t.nav}>
        <Link href={`/${locale}/`}>{t.articles}</Link>
        <Link href={`/${locale}/disclosure/`}>{t.disclosure}</Link>
        <Link href="/" lang="ja">
          {t.japanese}
        </Link>
      </nav>
    </header>
  );
}

export function LocaleFooter({ locale }: { locale: TranslationLocale }) {
  const t = chromeDict[locale];
  return (
    <footer className="site-footer">
      <p className="footer-brand">
        <span>{localizedSiteName[locale]}</span>
        <small className="mt-2 block font-sans text-[15px] font-normal tracking-normal text-[var(--muted)]">{t.subtitle}</small>
      </p>
      <div className="footer-links">
        <Link href={`/${locale}/`}>{t.articles}</Link>
        <Link href={`/${locale}/disclosure/`}>{t.disclosure}</Link>
        <Link href="/" lang="ja">
          {t.japanese}
        </Link>
      </div>
      <p className="fine">{t.footerNote}</p>
      <p className="fine">Contact {siteConfig.contactEmail}</p>
      <small>© {new Date().getFullYear()} {localizedSiteName[locale]}</small>
    </footer>
  );
}
