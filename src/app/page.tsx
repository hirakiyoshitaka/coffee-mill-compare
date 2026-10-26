import Image from "next/image";
import Link from "next/link";
import { ArticleList } from "@/components/ArticleList";
import { BeanDirectoryCard } from "@/components/BeanViews";
import { GrinderCard } from "@/components/GrinderCard";
import { StatusBadge } from "@/components/StatusBadge";
import { beanShops } from "@/data/beans";
import { categories, categoryHref } from "@/data/categories";
import { getFlagshipModels } from "@/data/grinders";
import { getAllArticles } from "@/lib/articles";

const heroImage =
  "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1400&q=80";

export default function HomePage() {
  const articles = getAllArticles().slice(0, 3);
  const models = getFlagshipModels();

  return (
    <main className="page-wrap">
      <section className="hero">
        <div>
          <p className="hero-kicker">手挽きミルと、届く豆</p>
          <h1>家のコーヒーを、条件から選ぶ。</h1>
          <p className="hero-description">
            おうちカフェ道具帳は、手挽きミルの仕様と、焙煎店の紹介を置くノートです。いま比べられるミルは{models.length}
            機種。豆は{beanShops.length}店。価格は目安です。
          </p>
          <div className="hero-actions">
            <Link href="/compare" className="hero-cta">
              手挽きミルを比較する
            </Link>
            <Link href="/beans" className="text-link">
              豆の店を見る
            </Link>
          </div>
          <p className="ad-note">購入リンクを置いた場合は広告です。空のリンクはボタンを出しません。</p>
        </div>
        <figure className="hero-art">
          <Image
            src={heroImage}
            alt="カップに注がれたコーヒーのイメージ"
            width={1400}
            height={1200}
            priority
          />
          <figcaption>写真はイメージです。特定の店や機種の実物ではありません。</figcaption>
        </figure>
      </section>

      <nav className="path-links" aria-label="入口">
        <Link href="/categories/mill">
          ミル
          <small>手挽き{models.length}機種</small>
        </Link>
        <Link href="/beans">
          豆
          <small>{beanShops.length}店の紹介</small>
        </Link>
        <Link href="/articles">
          読みもの
          <small>比べ方のノート</small>
        </Link>
        <Link href="/categories">
          道具
          <small>カテゴリの目次</small>
        </Link>
      </nav>

      <section className="section-block">
        <div className="section-heading">
          <h2>掲載中の手挽きミル</h2>
          <Link href="/compare" className="text-link">
            横並びで比べる
          </Link>
        </div>
        <p className="section-lead">写真はイメージです。価格は目安で、購入リンクは設定したものだけ表示します。</p>
        <ul className="card-grid">
          {models.map((model) => (
            <li key={model.id}>
              <GrinderCard model={model} />
            </li>
          ))}
        </ul>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>豆の店</h2>
          <Link href="/beans" className="text-link">
            5店を見る
          </Link>
        </div>
        <p className="section-lead">
          焙煎と豆の選び方を、確認できた事実だけ書いています。金額は目安です。5店を同じ等級としては扱っていません。
        </p>
        <ul className="shop-grid">
          {beanShops.map((shop) => (
            <li key={shop.slug}>
              <BeanDirectoryCard shop={shop} />
            </li>
          ))}
        </ul>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>読みもの</h2>
          <Link href="/articles" className="text-link">
            すべて
          </Link>
        </div>
        <ArticleList articles={articles} />
      </section>

      <section className="section-block" id="categories">
        <div className="section-heading">
          <h2>道具カテゴリ</h2>
          <Link href="/categories" className="text-link">
            一覧
          </Link>
        </div>
        <p className="section-lead">公開中はミルと豆です。ほかは、比べるページの枠だけ先に置いています。</p>
        <ul className="category-grid">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link href={categoryHref(category.slug)} className="category-card">
                <StatusBadge status={category.status} />
                <strong>{category.shortName}</strong>
                <span>{category.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
