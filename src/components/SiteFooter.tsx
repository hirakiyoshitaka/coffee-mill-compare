import Link from "next/link";
import { categories, categoryHref } from "@/data/categories";
import { siteConfig } from "@/data/site";

const guides = [
  { href: "/compare", label: "ミル比較" },
  { href: "/beans", label: "豆の店" },
  { href: "/articles", label: "読みもの" },
  { href: "/about", label: "運営者情報" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/disclosure", label: "広告表記" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p className="footer-brand">
        {siteConfig.name}
        <small className="mt-2 block font-sans text-[15px] font-normal tracking-normal text-[var(--muted)]">
          道具と豆を、買う前の条件から。
        </small>
      </p>
      <div className="footer-links">
        {guides.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        {categories
          .filter((category) => category.slug !== "beans")
          .map((category) => (
            <Link key={category.slug} href={categoryHref(category.slug)}>
              {category.shortName}
              {category.status === "soon" ? "（準備中）" : ""}
            </Link>
          ))}
      </div>
      <p className="fine">
        広告・アフィリエイトリンクを含みます。Amazonのアソシエイトとして、当サイトは適格販売により収入を得ています。
      </p>
      <p className="fine">
        スペックと価格は目安です。豆の店は、確認できた事実の紹介で、店主の言葉の引用ではありません。購入リンクを置いた場合は広告です。購入前に販売ページの表示を確認してください。
      </p>
      <p className="fine">連絡先 {siteConfig.contactEmail}</p>
      <small>© {new Date().getFullYear()} {siteConfig.name}</small>
    </footer>
  );
}
