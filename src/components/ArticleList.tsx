import Link from "next/link";
import { getCategory } from "@/data/categories";
import { formatJaDate } from "@/data/site";
import type { ArticleMeta } from "@/lib/articles";

export function ArticleList({ articles }: { articles: ArticleMeta[] }) {
  if (articles.length === 0) {
    return <p className="section-lead">このカテゴリの記事は、まだありません。</p>;
  }

  return (
    <ul className="article-index">
      {articles.map((article, index) => {
        const category = getCategory(article.category);
        return (
          <li key={article.slug}>
            <Link href={`/articles/${article.slug}`} className="article-card">
              <span className="article-number">{String(index + 1).padStart(2, "0")}</span>
              <span>
                <span className="category">
                  {category?.shortName ?? article.category}
                  <span className="mx-2 font-normal tracking-normal text-[var(--muted)]">/</span>
                  <time dateTime={article.date}>{formatJaDate(article.date)}</time>
                </span>
                <h3>{article.title}</h3>
                <p>{article.description}</p>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
