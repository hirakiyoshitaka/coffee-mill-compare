import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { ArticlePicks, QuickPick } from "@/components/ArticlePicks";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PrNotice } from "@/components/PrNotice";
import { categoryHref, getCategory } from "@/data/categories";
import { formatJaDate, siteConfig } from "@/data/site";
import { LanguageSwitcher } from "@/components/intl/LanguageSwitcher";
import { articleLanguageAlternates, articleLocalePaths, getAllArticles, getArticle } from "@/lib/articles";
import { pageMeta } from "@/lib/seo";
import { GrinderCard } from "@/components/GrinderCard";
import { ShareButtons } from "@/components/ShareButtons";
import { getModel } from "@/data/grinders";
import { getSiteUrl } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const meta = pageMeta({
    title: article.title,
    description: article.description,
    path: `/articles/${article.slug}`,
    type: "article",
    publishedTime: article.date,
  });
  const languages = articleLanguageAlternates(article.slug);
  if (Object.keys(languages).length > 2) meta.alternates = { ...meta.alternates, languages };
  return meta;
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const category = getCategory(article.category);
  const others = getAllArticles().filter((item) => item.slug !== article.slug);
  const related = [...others.filter((item) => item.category === article.category), ...others.filter((item) => item.category !== article.category)];
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/articles/${article.slug}/`;
  const grinderIds = [...new Set([...article.content.matchAll(/\{\{grinder:([a-z0-9-]+)\}\}/g)].map((m) => m[1]))];
  const endModels = grinderIds.map((id) => getModel(id)).filter((m): m is NonNullable<typeof m> => Boolean(m));
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "読みもの", item: `${siteUrl}/articles/` },
      { "@type": "ListItem", position: 3, name: article.title, item: pageUrl },
    ],
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    mainEntityOfPage: pageUrl,
    image: `${siteUrl}/images/og-default.jpg`,
    inLanguage: "ja",
    author: { "@type": "Organization", name: siteConfig.operatorName },
    publisher: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <main className="page-wrap page-narrow">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Breadcrumb
        items={[
          { href: "/", label: "ホーム" },
          { href: "/articles", label: "読みもの" },
          { label: article.title },
        ]}
      />
      <LanguageSwitcher current="ja" paths={articleLocalePaths(article.slug)} label="言語" />
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
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-600">{article.description}</p>
      </header>
      <PrNotice />
      <div className="mt-8">
        <QuickPick title={article.title} markdown={article.content} locale="ja" />
        <ArticlePicks title={article.title} markdown={article.content} quickPick />
        <ArticleBody markdown={article.content} />
      </div>
      {endModels.length > 0 ? (
        <section className="mt-12 border-t border-[var(--border-subtle)] pt-8" aria-label="この記事で紹介したミル">
          <h2 className="font-serif text-xl text-stone-950">この記事で紹介したミル</h2>
          <p className="mt-2 text-xs text-stone-500">価格と在庫は、各ショップのページで確認してください。</p>
          {endModels.map((model) => (
            <GrinderCard key={`end-${model.id}`} model={model} variant="embed" />
          ))}
        </section>
      ) : null}
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
      <ShareButtons url={pageUrl} title={article.title} label="この記事をシェア" />
    </main>
  );
}
