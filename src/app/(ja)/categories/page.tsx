import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StatusBadge } from "@/components/StatusBadge";
import { categories, categoryHref } from "@/data/categories";
import { pageMeta } from "@/lib/seo";
import { siteConfig } from "@/data/site";

export const metadata = pageMeta({
  title: "道具カテゴリ",
  description: "ミル、ドリッパー、ケトル、スケール、コーヒーメーカー、エスプレッソマシン、キャニスター、豆。家のコーヒー道具を種類ごとに分けた目次です。",
  path: "/categories",
});

export default function CategoriesPage() {
  return (
    <main className="page-wrap">
      <Breadcrumb items={[{ href: "/", label: "ホーム" }, { label: "道具" }]} />
      <p className="hero-kicker">{siteConfig.coffeeSectionName}（コーヒー）の目次</p>
      <h1 className="page-title">道具カテゴリ</h1>
      <p className="lede">
        家のコーヒー道具を、種類ごとに分ける目次です。手挽きを5問で1台に決めるときは
        <Link href="/mill-diagnosis/" className="mx-1 text-link">
          ミル選びの診断
        </Link>
        を使います。
      </p>
      <ul className="category-grid">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link href={categoryHref(category.slug)} className="category-card">
              <StatusBadge status={category.status} />
              <strong>{category.shortName}</strong>
              <span>{category.lead}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
