import Link from "next/link";

const nav = [
  { href: "/categories", label: "道具" },
  { href: "/compare", label: "ミル比較" },
  { href: "/beans", label: "豆" },
  { href: "/articles", label: "読みもの" },
  { href: "/kitchen", label: "キッチン" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="おうちカフェ道具帳 ホーム">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 28 28" width="22" height="22" fill="none">
            <path d="M7 12h11.5v1.6c0 3.4-2.5 6.1-5.7 6.1S7.1 17 7.1 13.6V12H7Z" stroke="currentColor" strokeWidth="1.4" />
            <path d="M18.5 13.2h2.1c1.1 0 1.9.7 1.9 1.7s-.8 1.7-1.9 1.7h-2.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M10 10.5c.4-1.2 1.2-1.8 2.2-1.8 1 0 1.5.5 2 1.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </span>
        おうちカフェ道具帳
        <span className="brand-caption">家のコーヒーを、条件から。</span>
      </Link>
      <nav className="site-nav" aria-label="主なメニュー">
        {nav.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
