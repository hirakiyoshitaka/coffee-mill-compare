import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { ArticleOpening } from "@/components/ArticleOpening";
import styles from "@/components/ArticleOpening.module.css";
import { ArticlePicks, QuickPick } from "@/components/ArticlePicks";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PrNotice } from "@/components/PrNotice";
import { categoryHref, getCategory } from "@/data/categories";
import { formatJaDate, siteConfig } from "@/data/site";
import { LanguageSwitcher } from "@/components/intl/LanguageSwitcher";
import { articleLanguageAlternates, articleLocalePaths, articleModified, getAllArticles, getArticle, getArticlesByCategory } from "@/lib/articles";
import { articleHasQuickPick } from "@/lib/article-picks";
import { pageMeta } from "@/lib/seo";
import { GrinderCard } from "@/components/GrinderCard";
import { ShareButtons } from "@/components/ShareButtons";
import { getModel } from "@/data/grinders";
import { getSiteUrl } from "@/data/site";

function splitAfterConclusion(markdown: string): [string, string] {
  const aside = markdown.match(/<aside class="article-picks" aria-label="おすすめ結論">[\s\S]*?<\/aside>/);
  if (aside && aside.index !== undefined) {
    const end = aside.index + aside[0].length;
    return [markdown.slice(0, end), markdown.slice(end)];
  }

  const heading = markdown.match(/^## おすすめ結論\s*$/m);
  if (heading && heading.index !== undefined) {
    const start = heading.index + heading[0].length;
    const nextHeading = markdown.slice(start).search(/^## /m);
    if (nextHeading !== -1) {
      const end = start + nextHeading;
      return [markdown.slice(0, end), markdown.slice(end)];
    }
  }

  return [markdown, ""];
}

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
  const related = getArticlesByCategory(article.category)
    .filter((item) => item.slug !== article.slug)
    .slice(0, 6);
  const ownConclusion = articleHasQuickPick(article.content);
  const ownConclusionParts = ownConclusion ? splitAfterConclusion(article.content) : null;
  const localePaths = articleLocalePaths(article.slug);
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
    dateModified: articleModified(article),
    mainEntityOfPage: pageUrl,
    image: `${siteUrl}/images/og-default.jpg`,
    inLanguage: "ja",
    author: { "@type": "Organization", name: siteConfig.operatorName },
    publisher: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <main className={`page-wrap page-narrow ${styles.page}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className={styles.navigation}>
        <Breadcrumb
          items={[
            { href: "/", label: "ホーム" },
            { href: "/articles", label: "読みもの" },
            { label: article.title },
          ]}
        />
        {localePaths.length > 1 ? (
          <details className={styles.languages}>
            <summary>言語</summary>
            <LanguageSwitcher current="ja" paths={localePaths} label="言語" />
          </details>
        ) : null}
      </div>
      <header className={styles.header}>
        <p className={styles.disclosure}>
          広告（PR）：この記事の購入リンクは広告です。
          <Link href="/disclosure">広告表記</Link>
        </p>
        <h1 className={styles.title}>{article.title}</h1>
        <p className={styles.meta}>
          <span>公開 <time dateTime={article.date}>{formatJaDate(article.date)}</time></span>
          {article.updated ? (
            <span>更新 <time dateTime={article.updated}>{formatJaDate(article.updated)}</time></span>
          ) : null}
          {category ? (
            <Link href={categoryHref(category.slug)}>
              {category.shortName}
            </Link>
          ) : null}
        </p>
      </header>
      <ArticleOpening slug={article.slug}>
        {ownConclusionParts ? (
          <ArticleBody markdown={ownConclusionParts[0]} />
        ) : (
          <QuickPick title={article.title} markdown={article.content} locale="ja" />
        )}
      </ArticleOpening>
      <div className={styles.notice}><PrNotice /></div>
      <p className="my-6 text-base leading-relaxed text-stone-600">{article.description}</p>
      {ownConclusionParts ? (
        <div>
          {ownConclusionParts[1] ? <ArticleBody markdown={ownConclusionParts[1]} /> : null}
        </div>
      ) : (
        <div>
          <ArticlePicks title={article.title} markdown={article.content} quickPick />
          <ArticleBody markdown={article.content} />
        </div>
      )}
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
