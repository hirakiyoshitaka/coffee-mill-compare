import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StatusBadge } from "@/components/StatusBadge";
import { categories } from "@/data/categories";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "道具カテゴリ",
  description: "ミル、ドリッパー、ケトル、スケール、コーヒーメーカー、エスプレッソマシン、キャニスター、豆通販。公開中は手挽きミルです。",
  path: "/categories",
});

export default function CategoriesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <Breadcrumb items={[{ href: "/", label: "ホーム" }, { label: "道具" }]} />
      <header className="mb-10 max-w-2xl">
        <h1 className="font-serif text-3xl text-stone-950 sm:text-4xl">道具カテゴリ</h1>
        <p className="mt-4 text-base leading-relaxed text-stone-600">
          家カフェの道具を、種類ごとに分ける目次です。中身があるのはミルだけです。準備中のページには、機種名を置いていません。
        </p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/categories/${category.slug}`}
              className="flex h-full flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-5 transition hover:border-stone-300"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-serif text-2xl text-stone-900">{category.shortName}</span>
                <StatusBadge status={category.status} />
              </span>
              <span className="mt-3 text-sm leading-relaxed text-stone-600">{category.lead}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
