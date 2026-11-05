import Image from "next/image";
import Link from "next/link";
import { ArticleList } from "@/components/ArticleList";
import { BeanDirectoryCard } from "@/components/BeanViews";
import { GrinderCard } from "@/components/GrinderCard";
import { StatusBadge } from "@/components/StatusBadge";
import { beanShops } from "@/data/beans";
import { categories, categoryHref } from "@/data/categories";
import { getFeaturedModels } from "@/data/grinders";
import { getArticle } from "@/lib/articles";
import { PrNotice } from "@/components/PrNotice";
import { KitchenList } from "@/components/KitchenList";
import { getKitchenArticles, kitchenPublic } from "@/lib/kitchen";

const heroImage =
  "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1400&q=80";

const reviewSlugs = [
  "coffee-mill-ranking",
  "how-to-choose-hand-coffee-mill",
  "japanese-premium-coffee-makers",
  "coffee-maker-guide",
  "home-latte-espresso-machines",
  "breville-vs-delonghi-all-in-one-espresso",
  "coffee-bean-subscription",
  "first-beans-after-hand-mill",
] as const;

const leadPaths = [
  {
    href: "/articles/coffee-mill-ranking/",
    kicker: "コーヒーミル",
    title: "手挽きのおすすめ",
    text: "1位はタイムモア栗子 S3、2位はエペイオス Essence Go。3位のコマンダンテ C40 はレビューまとめで、使っていません。",
    links: [
      { href: "/articles/how-to-choose-hand-coffee-mill/", label: "選び方" },
      { href: "/articles/luxury-relaxed-coffee-mill-best3/", label: "ベスト3" },
    ],
  },
  {
    href: "/articles/japanese-premium-coffee-makers/",
    kicker: "コーヒーメーカー",
    title: "比較記事から入る",
    text: "日本ブランド3台、家でラテ、タイプの選び方、ブレビルとデロンギ。売り切れの機種は載せていません。運営者はこの機種を使っていません。公式の仕様と公開レビューのまとめです。",
    links: [
      { href: "/articles/coffee-maker-guide/", label: "選び方" },
      { href: "/articles/home-latte-espresso-machines/", label: "家でラテ" },
      { href: "/articles/breville-vs-delonghi-all-in-one-espresso/", label: "ブレビルとデロンギ" },
    ],
  },
  {
    href: "/articles/coffee-bean-subscription/",
    kicker: "豆",
    title: "お試しと定期便",
    text: "定期便の比較と、最初の一袋。運営者が続けていた記録があるのは珈琲きゃろっとの定期便だけです。",
    links: [
      { href: "/articles/first-beans-after-hand-mill/", label: "最初の一袋" },
      { href: "/beans/coffee-carrot/", label: "きゃろっとのお試し" },
    ],
  },
] as const;

export default function HomePage() {
  const models = getFeaturedModels();
  const featuredShop = beanShops.find((shop) => shop.ownerExperience?.length) ?? beanShops[0];
  const otherShops = beanShops.filter((shop) => shop.slug !== featuredShop.slug);
  const articles = reviewSlugs
    .map((slug) => getArticle(slug))
    .filter((article) => article !== undefined)
    .map(({ slug, title, description, category, date }) => ({ slug, title, description, category, date }));

  const kitchen = kitchenPublic ? getKitchenArticles().slice(0, 4) : [];

  return (
    <main className="page-wrap">
      <section className="hero">
        <div>
          <p className="hero-kicker">先に開くのは、3つの読みもの</p>
          <h1>家のコーヒーを、記事から選ぶ。</h1>
          <p className="hero-description">
            手挽きミル、コーヒーメーカー、豆のお試しと定期便。売り切れの商品は置いていません。使っていない機械の体験は書きません。
          </p>
          <div className="hero-actions">
            <Link href="/articles/coffee-mill-ranking/" className="hero-cta">
              ミルのおすすめを読む
            </Link>
            <Link href="/articles/japanese-premium-coffee-makers/" className="text-link">
              コーヒーメーカーを読む
            </Link>
            <Link href="/articles/coffee-bean-subscription/" className="text-link">
              豆のお試し・定期便
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
        <Link href="/articles/coffee-mill-ranking/">
          ミル
          <small>おすすめランキング</small>
        </Link>
        <Link href="/articles/coffee-maker-guide/">
          メーカー
          <small>選び方と比較</small>
        </Link>
        <Link href="/articles/coffee-bean-subscription/">
          豆
          <small>お試しと定期便</small>
        </Link>
        <Link href="/categories">
          道具
          <small>カテゴリの目次</small>
        </Link>
      </nav>

      <PrNotice />
      <section className="section-block" id="start">
        <div className="section-heading">
          <h2>先に読む</h2>
        </div>
        <ul className="article-index">
          {leadPaths.map((item, index) => (
            <li key={item.href}>
              <Link href={item.href} className="article-card">
                <span className="article-number">{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <span className="category">{item.kicker}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </span>
              </Link>
              <p className="hero-actions">
                {item.links.map((link) => (
                  <Link key={link.href} href={link.href} className="text-link">
                    {link.label}
                  </Link>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </section>
      <section className="section-block" id="picks">
        <div className="section-heading">
          <h2>おすすめの手挽き</h2>
          <Link href="/compare" className="text-link">
            比較表を見る
          </Link>
        </div>
        <p className="section-lead">
          No.1 は栗子 S3、No.2 はエペイオス Essence Go です。運営者がふだん使っているのは栗子 S3 で、1回に約30g、2〜3杯分です。栗子 S3 の実機写真は未掲載です。栗子 S5 Pro は使っていません。
        </p>
        <ul className="picks-grid">
          {models.map((model) => (
            <li key={model.id}>
              <GrinderCard model={model} />
            </li>
          ))}
        </ul>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>最初に頼む豆</h2>
          <Link href="/beans" className="text-link">
            ほかの店
          </Link>
        </div>
        <p className="section-lead">珈琲きゃろっとは、運営者が定期便を1年ほど続けていた店です。金額は目安です。</p>
        <BeanDirectoryCard shop={featuredShop} />
        <ul className="article-index">
          {otherShops.map((shop, index) => (
            <li key={shop.slug}>
              <Link href={`/beans/${shop.slug}`} className="article-card">
                <span className="article-number">{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <span className="category">{[shop.area, shop.company].filter(Boolean).join("・") || "焙煎豆の店"}</span>
                  <h3>{shop.name}</h3>
                  <p>{shop.summary}</p>
                </span>
              </Link>
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

      {kitchenPublic ? (
        <section className="section-block" id="kitchen">
          <div className="section-heading">
            <h2>キッチン・ストック</h2>
            <Link href="/kitchen" className="text-link">
              すべて
            </Link>
          </div>
          <p className="section-lead">帰宅後のごはんやストック食品を、使う場面と一食量から選ぶノートです。体験談ではなく、メーカー資料と外部の使用記事をもとにしています。</p>
          <KitchenList articles={kitchen} />
        </section>
      ) : null}

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
