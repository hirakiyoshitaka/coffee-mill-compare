import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ArticleBody";
import { getSiteUrl, localizedSiteName } from "@/data/site";
import { getDraft } from "@/lib/drafts";
import { enDraftCategoryLabel, getAllEnDrafts, getEnDraft } from "@/lib/en-drafts";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

function formatEnDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date);
}

export function generateStaticParams() {
  return getAllEnDrafts().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getEnDraft(slug);
  if (!article) {
    return { robots: { index: false, follow: false } };
  }
  const path = `/en/drafts/${article.slug}/`;
  const title = `${article.title}｜${localizedSiteName.en}`;
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { absolute: title },
    description: article.description,
    alternates: { canonical: path },
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false, noimageindex: true },
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: path,
      type: "article",
      locale: "en_US",
      siteName: localizedSiteName.en,
      publishedTime: article.date,
    },
  };
}

export default async function EnglishDraftPage({ params }: Props) {
  const { slug } = await params;
  const article = getEnDraft(slug);
  if (!article) notFound();

  const categoryLabel = enDraftCategoryLabel(article.category);
  const japanese = getDraft(article.slug);
  const others = getAllEnDrafts().filter((item) => item.slug !== article.slug);

  return (
    <main className="page-wrap page-narrow">
      <p className="draft-banner">
        Draft. The metadata is noindex, nofollow. This page is not on the home page, the article list, the navigation, or the sitemap. Do not publish it, and do not post it, until the owner says so. Leave the measurement and photo lines blank until they are real.
      </p>
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-stone-500">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/en/" className="hover:text-[var(--accent)]">
              Home
            </Link>
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            <span>Draft</span>
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            <span className="inline-block max-w-[min(70vw,32rem)] truncate align-bottom text-stone-800">{article.title}</span>
          </li>
        </ol>
      </nav>
      <header className="mb-8">
        <p className="text-xs font-medium tracking-wide text-[var(--seal)]">PR</p>
        <h1 className="mt-3 font-serif text-[1.75rem] leading-snug tracking-wide text-[var(--ink)] sm:text-[2.15rem]">{article.title}</h1>
        <p className="mt-4 text-sm text-stone-500">
          <time dateTime={article.date}>{formatEnDate(article.date)}</time>
          {categoryLabel ? (
            <>
              <span className="mx-2">/</span>
              {categoryLabel}
            </>
          ) : null}
          <span className="mx-2">/</span>
          Draft
          {japanese ? (
            <>
              <span className="mx-2">/</span>
              <Link href={`/drafts/${japanese.slug}/`} hrefLang="ja" className="font-bold text-[var(--accent-dark)] underline underline-offset-4">
                Japanese draft
              </Link>
            </>
          ) : null}
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-600">{article.description}</p>
      </header>
      <aside className="border border-[var(--line)] bg-[var(--soft)] px-5 py-4 text-[16px] leading-[1.9]">
        <p className="font-bold text-[var(--accent)]">Advertising disclosure</p>
        <p className="mt-1">
          This draft is advertising. Purchase buttons are not live. The lines that look like links are placeholders, and no affiliate ID was created for them. Published English pages disclose an Amazon.co.jp Associates relationship. This draft does not add a tag for Amazon.com or for any other Amazon store. The policy is on the{" "}
          <Link href="/en/disclosure/" className="font-bold text-[var(--accent-dark)] underline underline-offset-4">
            disclosure page
          </Link>
          .
        </p>
      </aside>
      <div className="mt-8">
        <ArticleBody markdown={article.content} locale="en" />
      </div>
      {others.length > 0 ? (
        <aside className="mt-14 border-t border-[var(--border-subtle)] pt-8">
          <h2 className="font-serif text-xl text-stone-950">Other English drafts</h2>
          <p className="mt-2 text-sm text-stone-500">Same unpublished set. They are not on the public article list.</p>
          <ul className="mt-4 space-y-3">
            {others.map((item) => (
              <li key={item.slug}>
                <Link href={`/en/drafts/${item.slug}/`} className="text-sm leading-relaxed text-[var(--accent)] underline-offset-4 hover:underline">
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
