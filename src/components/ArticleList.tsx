import Link from "next/link";
import { getCategory } from "@/data/categories";
import { formatJaDate } from "@/data/site";
import type { ArticleMeta } from "@/lib/articles";

export function ArticleList({ articles }: { articles: ArticleMeta[] }) {
  if (articles.length === 0) {
    return <p className="text-sm leading-relaxed text-stone-600">このカテゴリの記事は、まだありません。</p>;
  }

  return (
    <ul className="grid gap-4">
      {articles.map((article) => {
        const category = getCategory(article.category);
        return (
          <li key={article.slug}>
            <Link
              href={`/articles/${article.slug}`}
              className="group block rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-5 transition hover:border-stone-300"
            >
              <p className="text-xs text-stone-500">
                <time dateTime={article.date}>{formatJaDate(article.date)}</time>
                <span className="mx-2">/</span>
                {category?.shortName ?? article.category}
              </p>
              <h3 className="mt-2 font-serif text-xl leading-snug text-stone-900 group-hover:text-[var(--accent)]">{article.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{article.description}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
