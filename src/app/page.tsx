import Link from "next/link";
import { ArticleList } from "@/components/ArticleList";
import { GrinderCard } from "@/components/GrinderCard";
import { StatusBadge } from "@/components/StatusBadge";
import { categories } from "@/data/categories";
import { getFlagshipModels } from "@/data/grinders";
import { getAllArticles } from "@/lib/articles";

export default function HomePage() {
  const articles = getAllArticles().slice(0, 3);
  const models = getFlagshipModels();
  const newest = articles[0];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14 lg:max-w-[90rem]">
      <section className="grid items-end gap-8 border-b border-[var(--border-subtle)] pb-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        <div>
          <p className="mb-3 text-sm font-medium text-[var(--seal)]">手挽きミルを公開中</p>
          <h1 className="font-serif text-4xl leading-tight tracking-tight text-stone-950 sm:text-5xl">おうちカフェ道具帳</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-stone-600">
            ミル、ドリッパー、ケトル。家でコーヒーを淹れる道具を、用途別に比べるためのノートです。いま読めるのは手挽きミルの{models.length}機種。価格は目安です。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/compare"
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              手挽きミルを比較する
            </Link>
            <Link
              href="/articles"
              className="inline-flex items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-5 py-2.5 text-sm font-medium text-stone-800 hover:border-stone-300"
            >
              読みものを見る
            </Link>
          </div>
        </div>
        {newest ? (
          <Link
            href={`/articles/${newest.slug}`}
            className="block rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-6 shadow-[0_20px_50px_-36px_rgba(60,32,18,0.55)] transition hover:border-stone-300"
          >
            <p className="text-xs font-medium tracking-wide text-[var(--accent-soft)]">最新のノート</p>
            <p className="mt-4 font-serif text-2xl leading-snug text-stone-900">{newest.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">{newest.description}</p>
            <p className="mt-5 text-sm font-medium text-[var(--accent)]">記事を読む</p>
          </Link>
        ) : null}
      </section>

      <section id="categories" className="scroll-mt-24 py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl text-stone-950">道具カテゴリ</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">公開中はミルだけです。ほかは、比べるページの枠だけ先に置いています。</p>
          </div>
          <Link href="/categories" className="text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline">
            カテゴリ一覧
          </Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category, index) => (
            <li key={category.slug}>
              <Link
                href={`/categories/${category.slug}`}
                className="flex h-full flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 transition hover:border-stone-300"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-serif text-sm text-[var(--accent-soft)]">{String(index + 1).padStart(2, "0")}</span>
                  <StatusBadge status={category.status} />
                </span>
                <span className="mt-4 font-serif text-xl text-stone-900">{category.shortName}</span>
                <span className="mt-2 text-sm leading-relaxed text-stone-600">{category.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-[var(--border-subtle)] py-12">
        <div className="mb-6 flex items-end justify-between gap-3">
          <h2 className="font-serif text-2xl text-stone-950">読みもの</h2>
          <Link href="/articles" className="text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline">
            すべて
          </Link>
        </div>
        <ArticleList articles={articles} />
      </section>

      <section className="border-t border-[var(--border-subtle)] py-12">
        <div className="mb-6 max-w-2xl">
          <h2 className="font-serif text-2xl text-stone-950">掲載中の手挽きミル</h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            写真はイメージです。価格は目安で、購入リンクは設定したものだけ表示します。
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {models.map((model) => (
            <li key={model.id}>
              <GrinderCard model={model} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
