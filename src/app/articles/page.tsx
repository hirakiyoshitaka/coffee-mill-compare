import { ArticleList } from "@/components/ArticleList";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getAllArticles } from "@/lib/articles";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "読みもの",
  description: "手挽きコーヒーミルの比べ方と、用途別の整理。価格は目安で、記事の冒頭に広告（PR）の表示があります。",
  path: "/articles",
});

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <Breadcrumb items={[{ href: "/", label: "ホーム" }, { label: "読みもの" }]} />
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-stone-950 sm:text-4xl">読みもの</h1>
        <p className="mt-4 text-base leading-relaxed text-stone-600">
          掲載データにあることだけを書いています。仕様や価格を足したいときは、先にデータを更新します。
        </p>
      </header>
      <ArticleList articles={articles} />
    </main>
  );
}
