import Link from "next/link";
import { ArticleList } from "@/components/ArticleList";
import { BeanDirectoryCard } from "@/components/BeanViews";
import { Breadcrumb } from "@/components/Breadcrumb";
import { beanShops, priceAsOfLabel } from "@/data/beans";
import { getArticlesByCategory } from "@/lib/articles";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "豆の店",
  description:
    "珈琲きゃろっと、土居珈琲、LEO SPECIALTY COFFEE、ラボカフェ、澤井珈琲。焙煎と豆の選び方、お試しと定期便の目安を紹介します。",
  path: "/beans",
});

export default function BeansPage() {
  const articles = getArticlesByCategory("beans");

  return (
    <main className="page-wrap">
      <Breadcrumb items={[{ href: "/", label: "ホーム" }, { label: "豆" }]} />
      <p className="hero-kicker">家に届く豆</p>
      <h1 className="page-title">豆の店</h1>
      <p className="lede">
        5店を、焙煎の仕方と豆の選び方から紹介しています。店主の言葉の引用や、訪れた感想は載せていません。金額があるものは目安です。贈り物の分け方は
        <Link href="/articles/coffee-gift-guide" className="mx-1 font-bold text-[var(--accent-dark)] underline underline-offset-4">
          コーヒー好きへのギフト
        </Link>
        、夜に飲む豆の見方は
        <Link href="/articles/decaf-coffee-beans" className="mx-1 font-bold text-[var(--accent-dark)] underline underline-offset-4">
          カフェインレス・デカフェ
        </Link>
        です。
      </p>
      <p className="fine">{priceAsOfLabel}。5店が同じ等級、という意味にはしていません。</p>
      <ul className="shop-grid mt-8">
        {beanShops.map((shop) => (
          <li key={shop.slug}>
            <BeanDirectoryCard shop={shop} />
          </li>
        ))}
      </ul>
      <section className="section-block">
        <div className="section-heading">
          <h2>このテーマの記事</h2>
        </div>
        <ArticleList articles={articles} />
      </section>
    </main>
  );
}
