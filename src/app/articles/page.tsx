import { ArticleList } from "@/components/ArticleList";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getAllArticles } from "@/lib/articles";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "読みもの",
  description: "手挽きコーヒーミルの比べ方と、届く豆の紹介。価格は目安で、記事の冒頭に広告（PR）の表示があります。",
  path: "/articles",
});

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <main className="page-wrap page-narrow">
      <Breadcrumb items={[{ href: "/", label: "ホーム" }, { label: "読みもの" }]} />
      <header className="mb-8">
        <h1 className="page-title">読みもの</h1>
        <p className="lede">
          掲載データにあることだけを書いています。仕様や価格を足したいときは、先にデータを更新します。
        </p>
      </header>
      <ArticleList articles={articles} />
    </main>
  );
}
