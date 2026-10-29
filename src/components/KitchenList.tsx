import Link from "next/link";
import { formatJaDate } from "@/data/site";
import type { KitchenMeta } from "@/lib/kitchen";

export function KitchenList({ articles }: { articles: KitchenMeta[] }) {
  return (
    <ul className="article-index">
      {articles.map((article, index) => (
        <li key={article.slug}>
          <Link href={`/kitchen/${article.slug}`} className="article-card">
            <span className="article-number">{String(index + 1).padStart(2, "0")}</span>
            <span>
              <span className="category">
                {article.category}
                <span className="mx-2 font-normal tracking-normal text-[var(--muted)]">/</span>
                <time dateTime={article.updated}>{formatJaDate(article.updated)}</time>
              </span>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
