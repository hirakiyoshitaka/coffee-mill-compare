import Link from "next/link";
import { siteConfig, localizedSiteName } from "@/data/site";
import type { TranslationLocale } from "@/lib/articles";
import { chromeDict } from "@/lib/i18n";

const hubNav: Record<TranslationLocale, { href: string; label: string }[]> = {
  en: [
    { href: "/en/articles/best-3-golf-laser-rangefinders/", label: "Golf" },
    { href: "/en/articles/best-3-folding-standing-desks/", label: "Desk" },
    { href: "/en/articles/best-3-premium-drip-kettles/", label: "Kettle" },
    { href: "/en/articles/best-3-premium-coffee-machines/", label: "Brewer" },
    { href: "/en/articles/best-3-japanese-kitchen-knives/", label: "Knives" },
  ],
  "zh-tw": [
    { href: "/zh-tw/articles/best-3-golf-laser-rangefinders/", label: "測距" },
    { href: "/zh-tw/articles/best-3-folding-standing-desks/", label: "書桌" },
    { href: "/zh-tw/articles/best-3-premium-drip-kettles/", label: "手沖壺" },
    { href: "/zh-tw/articles/best-3-premium-coffee-machines/", label: "咖啡機" },
    { href: "/zh-tw/articles/best-3-japanese-kitchen-knives/", label: "菜刀" },
  ],
  "zh-hk": [
    { href: "/zh-hk/articles/best-3-golf-laser-rangefinders/", label: "測距" },
    { href: "/zh-hk/articles/best-3-folding-standing-desks/", label: "書桌" },
    { href: "/zh-hk/articles/best-3-premium-drip-kettles/", label: "手沖壺" },
    { href: "/zh-hk/articles/best-3-premium-coffee-machines/", label: "咖啡機" },
    { href: "/zh-hk/articles/best-3-japanese-kitchen-knives/", label: "菜刀" },
  ],
  "zh-cn": [
    { href: "/zh-cn/articles/best-3-golf-laser-rangefinders/", label: "测距" },
    { href: "/zh-cn/articles/best-3-folding-standing-desks/", label: "书桌" },
    { href: "/zh-cn/articles/best-3-premium-drip-kettles/", label: "手冲壶" },
    { href: "/zh-cn/articles/best-3-premium-coffee-machines/", label: "咖啡机" },
    { href: "/zh-cn/articles/best-3-japanese-kitchen-knives/", label: "菜刀" },
  ],
  ko: [
    { href: "/ko/articles/best-3-golf-laser-rangefinders/", label: "골프" },
    { href: "/ko/articles/best-3-folding-standing-desks/", label: "데스크" },
    { href: "/ko/articles/best-3-premium-drip-kettles/", label: "드립포트" },
    { href: "/ko/articles/best-3-premium-coffee-machines/", label: "커피머신" },
    { href: "/ko/articles/best-3-japanese-kitchen-knives/", label: "칼" },
  ],
  th: [
    { href: "/th/articles/best-3-golf-laser-rangefinders/", label: "กอล์ฟ" },
    { href: "/th/articles/best-3-folding-standing-desks/", label: "โต๊ะ" },
    { href: "/th/articles/best-3-premium-drip-kettles/", label: "กา" },
    { href: "/th/articles/best-3-premium-coffee-machines/", label: "เครื่องชง" },
    { href: "/th/articles/best-3-japanese-kitchen-knives/", label: "มีด" },
  ],
  vi: [
    { href: "/vi/articles/best-3-golf-laser-rangefinders/", label: "Golf" },
    { href: "/vi/articles/best-3-folding-standing-desks/", label: "Bàn" },
    { href: "/vi/articles/best-3-premium-drip-kettles/", label: "Ấm" },
    { href: "/vi/articles/best-3-premium-coffee-machines/", label: "Máy pha" },
    { href: "/vi/articles/best-3-japanese-kitchen-knives/", label: "Dao" },
  ],
};

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
        {hubNav[locale].map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
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
        {hubNav[locale].map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
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
