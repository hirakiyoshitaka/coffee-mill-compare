import Link from "next/link";

const nav = [
  { href: "/categories", label: "道具" },
  { href: "/articles", label: "読みもの" },
  { href: "/compare", label: "ミル比較" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border-subtle)] bg-[var(--surface)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between lg:max-w-[90rem]">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--seal)] font-serif text-sm text-white">
            帳
          </span>
          <span className="min-w-0">
            <span className="block font-serif text-lg leading-tight tracking-tight text-stone-900 group-hover:text-[var(--accent)]">
              おうちカフェ道具帳
            </span>
            <span className="block text-xs text-stone-500">家で淹れる道具の比較ノート</span>
          </span>
        </Link>
        <nav aria-label="主要" className="flex flex-wrap gap-1 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-stone-700 transition hover:bg-stone-200/70 hover:text-stone-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
