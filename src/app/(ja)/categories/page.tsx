import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StatusBadge } from "@/components/StatusBadge";
import { categories, categoryHref } from "@/data/categories";
import { pageMeta } from "@/lib/seo";
import { siteConfig } from "@/data/site";

export const metadata = pageMeta({
  title: "道具カテゴリ",
  description: "コーヒー道具に加え、ゴルフの距離計、折りたたみ昇降デスク、日本の牛刀。公開中のハブと、準備中の枠を分けています。",
  path: "/categories",
});

export default function CategoriesPage() {
  return (
    <main className="page-wrap">
      <Breadcrumb items={[{ href: "/", label: "ホーム" }, { label: "道具" }]} />
      <p className="hero-kicker">{siteConfig.name}の目次</p>
      <h1 className="page-title">道具カテゴリ</h1>
      <p className="lede">
        コーヒー、ゴルフ、在宅、包丁を、ジャンルのハブに分けています。準備中のページには、機種名を置いていません。
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
