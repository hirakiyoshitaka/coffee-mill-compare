import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PrNotice } from "@/components/PrNotice";
import { formatJaDate, getSiteUrl, siteConfig } from "@/data/site";
import { getKitchenArticle, getKitchenArticles } from "@/lib/kitchen";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getKitchenArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getKitchenArticle(slug);
  if (!article) return {};
  const meta = pageMeta({
    title: article.title,
    description: article.description,
    path: `/kitchen/${article.slug}`,
    type: "article",
    publishedTime: article.date,
  });
  const image = { url: article.ogImage, width: 1200, height: 630 };
  meta.openGraph = { ...meta.openGraph, images: [image] };
  meta.twitter = { ...(meta.twitter ?? {}), images: [image.url] };
  return meta;
}

export default async function KitchenArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getKitchenArticle(slug);
  if (!article) notFound();
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/kitchen/${article.slug}/`;
  const others = getKitchenArticles().filter((a) => a.slug !== article.slug);
  const related = [...others.filter((a) => a.category === article.category), ...others.filter((a) => a.category !== article.category)].slice(0, 6);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.updated,
    mainEntityOfPage: pageUrl,
    image: `${siteUrl}${article.ogImage}`,
    inLanguage: "ja",
    author: { "@type": "Organization", name: siteConfig.operatorName },
    publisher: { "@type": "Organization", name: siteConfig.name },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "キッチン・ストック", item: `${siteUrl}/kitchen/` },
      { "@type": "ListItem", position: 3, name: article.title, item: pageUrl },
    ],
  };

  return (
    <main className="page-wrap page-narrow">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Breadcrumb items={[{ href: "/", label: "ホーム" }, { href: "/kitchen", label: "キッチン・ストック" }, { label: article.title }]} />
      <header className="mb-8">
        <p className="text-xs font-medium tracking-wide text-[var(--seal)]">PR</p>
        <h1 className="mt-3 font-serif text-[1.75rem] leading-snug tracking-wide text-[var(--ink)] sm:text-[2.15rem]">{article.title}</h1>
        <p className="mt-4 text-sm text-stone-500">
          <time dateTime={article.date}>{formatJaDate(article.date)}</time>
          {article.updated !== article.date ? <> （更新 <time dateTime={article.updated}>{formatJaDate(article.updated)}</time>）</> : null}
          <span className="mx-2">/</span>
          {article.category}
        </p>
      </header>
      <PrNotice />
      <div className="mt-8">
        <ArticleBody markdown={article.content} />
      </div>
      {related.length > 0 ? (
        <aside className="mt-14 border-t border-[var(--border-subtle)] pt-8">
          <h2 className="font-serif text-xl text-stone-950">ほかのキッチン・ストック</h2>
          <ul className="mt-4 space-y-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/kitchen/${item.slug}`} className="text-sm leading-relaxed text-[var(--accent)] underline-offset-4 hover:underline">
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
