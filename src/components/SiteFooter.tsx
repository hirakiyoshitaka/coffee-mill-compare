import Link from "next/link";
import { categories } from "@/data/categories";
import { siteConfig } from "@/data/site";

const guides = [
  { href: "/articles", label: "読みもの" },
  { href: "/compare", label: "ミル比較" },
  { href: "/about", label: "運営者情報" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/disclosure", label: "広告表記" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border-subtle)] bg-[var(--surface-muted)]/70">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:max-w-[90rem] lg:grid-cols-4">
        <div className="sm:col-span-2">
          <p className="font-serif text-lg text-stone-900">{siteConfig.name}</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-stone-600">
            家のコーヒー道具を、用途別に比べるためのノートです。価格は目安。購入リンクを置いた場合は広告です。
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-stone-900">案内</p>
          <ul className="mt-3 space-y-2 text-sm">
            {guides.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-stone-600 hover:text-[var(--accent)]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-stone-900">道具</p>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/categories/${category.slug}`} className="text-stone-600 hover:text-[var(--accent)]">
                  {category.shortName}
                  {category.status === "soon" ? "（準備中）" : ""}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border-subtle)]">
        <div className="mx-auto max-w-6xl space-y-2 px-4 py-5 text-xs leading-relaxed text-stone-500 lg:max-w-[90rem]">
          <p>
            スペックと価格は、メーカー公表値や市場の目安をもとにした静的データです。購入前に販売ページの最新表示を確認してください。口コミは特定の投稿の転載ではなく、コミュニティで繰り返される論点の要約です。
          </p>
          <p>© {new Date().getFullYear()} {siteConfig.name}</p>
        </div>
      </div>
    </footer>
  );
}
