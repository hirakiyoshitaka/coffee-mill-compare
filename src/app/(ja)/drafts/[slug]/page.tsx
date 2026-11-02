import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PrNotice } from "@/components/PrNotice";
import { categoryHref, getCategory } from "@/data/categories";
import { formatJaDate } from "@/data/site";
import { getAllDrafts, getDraft } from "@/lib/drafts";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllDrafts().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getDraft(slug);
  if (!article) {
    return { robots: { index: false, follow: false } };
  }
  const meta = pageMeta({
    title: article.title,
    description: article.description,
    path: `/drafts/${article.slug}`,
    type: "article",
    publishedTime: article.date,
    noindex: true,
  });
  return {
    ...meta,
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false, noimageindex: true },
    },
  };
}

export default async function DraftArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getDraft(slug);
  if (!article) notFound();

  const category = getCategory(article.category);
  const others = getAllDrafts().filter((item) => item.slug !== article.slug);

  return (
    <main className="page-wrap page-narrow">
      <p className="draft-banner">
        下書きです。メタデータは noindex / nofollow です。ホーム、読みもの、カテゴリ、ナビゲーション、サイトマップには載せていません。よんぴーの実測と写真が入るまで、公開しないでください。
      </p>
      <Breadcrumb
        items={[
          { href: "/", label: "ホーム" },
          { label: "下書き" },
          { label: article.title },
        ]}
      />
      <header className="mb-8">
        <p className="text-xs font-medium tracking-wide text-[var(--seal)]">PR</p>
        <h1 className="mt-3 font-serif text-[1.75rem] leading-snug tracking-wide text-[var(--ink)] sm:text-[2.15rem]">{article.title}</h1>
        <p className="mt-4 text-sm text-stone-500">
          <time dateTime={article.date}>{formatJaDate(article.date)}</time>
          {category ? (
            <>
              <span className="mx-2">/</span>
              <Link href={categoryHref(category.slug)} className="font-bold text-[var(--accent-dark)] underline underline-offset-4">
                {category.shortName}
              </Link>
            </>
          ) : null}
          <span className="mx-2">/</span>
          下書き
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-600">{article.description}</p>
      </header>
      <PrNotice />
      <div className="mt-8">
        <ArticleBody markdown={article.content} />
      </div>
      {others.length > 0 ? (
        <aside className="mt-14 border-t border-[var(--border-subtle)] pt-8">
          <h2 className="font-serif text-xl text-stone-950">ほかの下書き</h2>
          <p className="mt-2 text-sm text-stone-500">同じ一連の下書きです。公開中の読みもの一覧には出ていません。</p>
          <ul className="mt-4 space-y-3">
            {others.map((item) => (
              <li key={item.slug}>
                <Link href={`/drafts/${item.slug}`} className="text-sm leading-relaxed text-[var(--accent)] underline-offset-4 hover:underline">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </main>
  );
}
