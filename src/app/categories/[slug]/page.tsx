import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleList } from "@/components/ArticleList";
import { Breadcrumb } from "@/components/Breadcrumb";
import { GrinderCard } from "@/components/GrinderCard";
import { StatusBadge } from "@/components/StatusBadge";
import { beanShops } from "@/data/beans";
import { categories, getCategory } from "@/data/categories";
import { featuredLabel, getFlagshipModels, grinderTypeLabel } from "@/data/grinders";
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
  const beansAlias = category.slug === "beans";
  return pageMeta({
    title: category.name,
    description: category.lead,
    path: beansAlias ? "/beans" : `/categories/${category.slug}`,
    noindex: category.status === "soon" || beansAlias,
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

  if (category.slug === "beans") {
    return (
      <main className="page-wrap">
        <Breadcrumb
          items={[
            { href: "/", label: "ホーム" },
            { href: "/categories", label: "道具" },
            { label: category.shortName },
          ]}
        />
        <p className="hero-kicker">豆</p>
        <h1 className="page-title">{category.name}</h1>
        <p className="lede">{category.lead}</p>
        <p>
          <Link href="/beans" className="text-link">
            豆の店のページを開く
          </Link>
        </p>
        <ul className="article-index mt-8">
          {beanShops.map((shop, index) => (
            <li key={shop.slug}>
              <Link href={`/beans/${shop.slug}`} className="article-card">
                <span className="article-number">{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <span className="category">{[shop.area, shop.company].filter(Boolean).join("・") || "焙煎豆の店"}</span>
                  <h3>{shop.name}</h3>
                  <p>{shop.summary}</p>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    );
  }

  return (
    <main className="page-wrap">
      <Breadcrumb
        items={[
          { href: "/", label: "ホーム" },
          { href: "/categories", label: "道具" },
          { label: category.shortName },
        ]}
      />
      <header className="mb-10 max-w-3xl">
        <StatusBadge status={category.status} />
        <h1 className="page-title">{category.name}</h1>
        <p className="lede">{category.lead}</p>
      </header>

      {category.slug === "mill" ? (
        <>
          <section>
            <h2 className="font-serif text-2xl text-stone-950">おすすめ</h2>
            <p className="section-lead">
              掲載は{manual.length}機種、いずれも{grinderTypeLabel("manual")}です。先に見るのは2台です。栗子 S5 Pro の写真はグリーンです。Essence Go は製品名のカードです。ほかの機種の実機写真は載せていません。価格は目安です。
            </p>
            <ul className="picks-grid">
              {manual
                .filter((model) => featuredLabel(model.id))
                .map((model) => (
                  <li key={model.id}>
                    <GrinderCard model={model} />
                  </li>
                ))}
            </ul>
            <h2 className="mt-14 font-serif text-2xl text-stone-950">比較用に残している機種</h2>
            <p className="section-lead">このサイトの一番手ではありません。仕様を横並びで見るための掲載です。</p>
            <ul className="card-grid">
              {manual
                .filter((model) => !featuredLabel(model.id))
                .map((model) => (
                  <li key={model.id}>
                    <GrinderCard model={model} />
                  </li>
                ))}
            </ul>
            <p className="hero-actions mt-6">
              <Link href="/compare" className="text-link">
                スペックを横並びで見る
              </Link>
              <Link href="/beans" className="text-link">
                挽いたあとの豆の店
              </Link>
            </p>
          </section>

          <section className="section-block border border-[var(--line)] bg-[var(--white)] p-6">
            <h2 className="font-serif text-2xl text-stone-950">電動</h2>
            {electric.length === 0 ? (
              <p className="section-lead">
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
        <section className="border border-[var(--line)] bg-[var(--white)] p-6">
          <h2 className="font-serif text-2xl text-stone-950">準備している比べ方</h2>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-relaxed text-stone-700">
            {category.planned.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-stone-600">
            商品名、価格、購入リンクはまだ入れていません。いま中身があるのは
            <Link href="/categories/mill" className="mx-1 font-bold text-[var(--accent-dark)] underline underline-offset-4">
              ミル
            </Link>
            と
            <Link href="/beans" className="mx-1 font-bold text-[var(--accent-dark)] underline underline-offset-4">
              豆
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
