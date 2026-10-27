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

const heroImage =
  "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1400&q=80";

const reviewSlugs = ["timemore-chestnut-s5-pro", "epeios-essence-go"] as const;

export default function HomePage() {
  const models = getFeaturedModels();
  const featuredShop = beanShops.find((shop) => shop.ownerExperience?.length) ?? beanShops[0];
  const otherShops = beanShops.filter((shop) => shop.slug !== featuredShop.slug);
  const articles = reviewSlugs
    .map((slug) => getArticle(slug))
    .filter((article) => article !== undefined)
    .map(({ slug, title, description, category, date }) => ({ slug, title, description, category, date }));

  return (
    <main className="page-wrap">
      <section className="hero">
        <div>
          <p className="hero-kicker">先に置くのは、2台と1店</p>
          <h1>家のコーヒーを、条件から選ぶ。</h1>
          <p className="hero-description">
            おうちカフェ道具帳が勧める手挽きは、タイムモア栗子 S5 Pro と、エペイオス Essence Go です。豆は、運営者が定期便を1年ほど続けていた珈琲きゃろっとから開きます。価格は目安です。
          </p>
          <div className="hero-actions">
            <Link href="#picks" className="hero-cta">
              おすすめの2台を見る
            </Link>
            <Link href="/beans/coffee-carrot" className="text-link">
              きゃろっとの豆を見る
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
          <small>おすすめ2台</small>
        </Link>
        <Link href="/beans/coffee-carrot">
          豆
          <small>きゃろっとの定期便</small>
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

      <section className="section-block" id="picks">
        <div className="section-heading">
          <h2>おすすめの手挽き</h2>
          <Link href="/compare" className="text-link">
            比較表を見る
          </Link>
        </div>
        <p className="section-lead">
          No.1 は栗子 S5 Pro、No.2 はエペイオス Essence Go です。点数競技ではなく、このサイトが家に置くならこの2台、という選択です。栗子 S5 Pro の写真はグリーンです。Essence Go は製品名のカードです。楽天のページでは、型番「S5 Pro」と色「グリーン」を選んでください。
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
