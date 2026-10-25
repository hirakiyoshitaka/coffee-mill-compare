import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleList } from "@/components/ArticleList";
import { Breadcrumb } from "@/components/Breadcrumb";
import { GrinderCard } from "@/components/GrinderCard";
import { StatusBadge } from "@/components/StatusBadge";
import { categories, getCategory } from "@/data/categories";
import { getFlagshipModels, grinderTypeLabel } from "@/data/grinders";
import { getArticlesByCategory } from "@/lib/articles";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return pageMeta({
    title: category.name,
    description: category.lead,
    path: `/categories/${category.slug}`,
    noindex: category.status === "soon",
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const articles = getArticlesByCategory(category.slug);
  const models = getFlagshipModels();
  const manual = models.filter((model) => model.type === "manual");
  const electric = models.filter((model) => model.type === "electric");

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <Breadcrumb
        items={[
          { href: "/", label: "ホーム" },
          { href: "/categories", label: "道具" },
          { label: category.shortName },
        ]}
      />
      <header className="mb-10 max-w-3xl">
        <StatusBadge status={category.status} />
        <h1 className="mt-3 font-serif text-3xl text-stone-950 sm:text-4xl">{category.name}</h1>
        <p className="mt-4 text-base leading-relaxed text-stone-600">{category.lead}</p>
      </header>

      {category.slug === "mill" ? (
        <>
          <section>
            <h2 className="font-serif text-2xl text-stone-950">手挽き</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">
              掲載は{manual.length}機種、いずれも{grinderTypeLabel("manual")}です。写真はイメージで、価格は目安です。
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {manual.map((model) => (
                <li key={model.id}>
                  <GrinderCard model={model} />
                </li>
              ))}
            </ul>
            <p className="mt-6">
              <Link href="/compare" className="text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline">
                スペックを横並びで見る
              </Link>
            </p>
          </section>

          <section className="mt-14 rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-6">
            <h2 className="font-serif text-2xl text-stone-950">電動</h2>
            {electric.length === 0 ? (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">
                電動ミルの機種データは、まだありません。名前を出して勧める材料がないので、この欄は準備中です。手挽きとの違いは時短や音、置き場所ですが、具体的な機種はデータが揃ってから書きます。
              </p>
            ) : (
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {electric.map((model) => (
                  <li key={model.id}>
                    <GrinderCard model={model} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : (
        <section className="rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-6">
          <h2 className="font-serif text-2xl text-stone-950">準備している比べ方</h2>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-relaxed text-stone-700">
            {category.planned.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-stone-600">
            商品名、価格、購入リンクはまだ入れていません。いま中身があるのは
            <Link href="/categories/mill" className="mx-1 font-medium text-[var(--accent)] underline-offset-4 hover:underline">
              ミル
            </Link>
            です。
          </p>
        </section>
      )}

      <section className="mt-14">
        <h2 className="mb-5 font-serif text-2xl text-stone-950">このカテゴリの記事</h2>
        <ArticleList articles={articles} />
      </section>
    </main>
  );
}
