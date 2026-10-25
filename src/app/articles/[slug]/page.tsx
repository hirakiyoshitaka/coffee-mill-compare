import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PrNotice } from "@/components/PrNotice";
import { getCategory } from "@/data/categories";
import { formatJaDate, siteConfig } from "@/data/site";
import { getAllArticles, getArticle } from "@/lib/articles";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return pageMeta({
    title: article.title,
    description: article.description,
    path: `/articles/${article.slug}`,
    type: "article",
    publishedTime: article.date,
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const category = getCategory(article.category);
  const related = getAllArticles().filter((item) => item.slug !== article.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    inLanguage: "ja",
    author: { "@type": "Organization", name: siteConfig.operatorName },
    publisher: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumb
        items={[
          { href: "/", label: "ホーム" },
          { href: "/articles", label: "読みもの" },
          { label: article.title },
        ]}
      />
      <header className="mb-8">
        <p className="text-xs font-medium tracking-wide text-[var(--seal)]">PR</p>
        <h1 className="mt-2 font-serif text-3xl leading-snug text-stone-950 sm:text-4xl">{article.title}</h1>
        <p className="mt-4 text-sm text-stone-500">
          <time dateTime={article.date}>{formatJaDate(article.date)}</time>
          {category ? (
            <>
              <span className="mx-2">/</span>
              <Link href={`/categories/${category.slug}`} className="text-[var(--accent)] underline-offset-4 hover:underline">
                {category.shortName}
              </Link>
            </>
          ) : null}
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-600">{article.description}</p>
      </header>
      <PrNotice />
      <div className="mt-8">
        <ArticleBody markdown={article.content} />
      </div>
      {related.length > 0 ? (
        <aside className="mt-14 border-t border-[var(--border-subtle)] pt-8">
          <h2 className="font-serif text-xl text-stone-950">ほかのノート</h2>
          <ul className="mt-4 space-y-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/articles/${item.slug}`} className="text-sm leading-relaxed text-[var(--accent)] underline-offset-4 hover:underline">
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
