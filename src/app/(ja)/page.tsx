import Image from "next/image";
import Link from "next/link";
import { ArticleList } from "@/components/ArticleList";
import { BeanDirectoryCard } from "@/components/BeanViews";
import { BuyButtons, grinderBuyProps } from "@/components/BuyButtons";
import { GrinderCard } from "@/components/GrinderCard";
import { StatusBadge } from "@/components/StatusBadge";
import { beanShops } from "@/data/beans";
import { categories, categoryHref } from "@/data/categories";
import { getFeaturedModels } from "@/data/grinders";
import { articleModified, getArticle } from "@/lib/articles";
import { PrNotice } from "@/components/PrNotice";
import { KitchenList } from "@/components/KitchenList";
import { getKitchenArticles, kitchenPublic } from "@/lib/kitchen";

const reviewSlugs = [
  "coffee-mill-ranking",
  "how-to-choose-hand-coffee-mill",
  "luxury-relaxed-coffee-mill-best3",
  "japanese-premium-coffee-makers",
  "coffee-maker-guide",
  "home-latte-espresso-machines",
  "breville-vs-delonghi-all-in-one-espresso",
  "coffee-bean-subscription",
  "first-beans-after-hand-mill",
] as const;

/** トップの「まず読む5本」。同じ形のカード（写真か文字の面 → 分類 → 見出し → 一文 → 更新日）で並べる。 */
type Guide = {
  slug: string;
  kicker: string;
  title: string;
  text: string;
  tag: string;
  image?: { src: string; alt: string; credit?: string };
  tile?: string[];
};

const guides: Guide[] = [
  {
    slug: "coffee-mill-ranking",
    kicker: "ランキング",
    title: "手挽きミルのおすすめ順",
    text: "1位は栗子 S3、2位は Essence Go。3位のコマンダンテ C40 は使っておらず、レビューまとめです。",
    tag: "使っている2台が上位",
    tile: ["1　栗子 S3", "2　Essence Go", "3　C40"],
  },
  {
    slug: "timemore-chestnut-s3",
    kicker: "レビュー",
    title: "タイムモア 栗子 S3",
    text: "ふだん使っている手挽き。1回に約30gを挽いて、2〜3杯分にしています。仕様は公式ページから。",
    tag: "運営者がふだん使っています",
    image: { src: "/images/timemore-s3-green-cup.webp", alt: "運営者の S3 の横に置いた、淹れたコーヒーのカップ" },
  },
  {
    slug: "epeios-essence-go",
    kicker: "レビュー",
    title: "エペイオス Essence Go",
    text: "運営者の一言は「とにかく軽く回る」。38mm・10枚刃で、専用ケースが付きます。",
    tag: "運営者が使っています",
    image: {
      src: "https://epeios.jp/cdn/shop/files/20250121_epeios_3177.jpg?v=1744272927&width=1200",
      alt: "エペイオス Essence Go（EPEIOS公式サイトの製品写真）",
      credit: "公式写真",
    },
  },
  {
    slug: "amazon-black-friday-coffee-gear",
    kicker: "セールの前に",
    title: "ブラックフライデーの前に決めること",
    text: "使っている2台を中心に、買う前に決めておくことをまとめました。期間は発表のあとに書き足します。",
    tag: "使っている2台が中心",
    tile: ["Black Friday", "11月"],
  },
  {
    slug: "coffee-carrot-review",
    kicker: "豆の定期便",
    title: "珈琲きゃろっとを約1年",
    text: "定期便「くるべさ」を約1年続けた記録。申し込む前に知っておくことも、公式ページから書いています。",
    tag: "運営者が続けていた定期便",
    image: {
      src: "/images/coffee-carrot-costa-rica-don-mayo.webp",
      alt: "珈琲きゃろっとから届いたコスタリカ ドン・マヨの袋",
    },
  },
];

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

function dotDate(ymd: string): string {
  return ymd.replaceAll("-", ".");
}

export default function HomePage() {
  const models = getFeaturedModels();
  const pick = models.find((model) => model.id === "timemore-chestnut-s3") ?? models[0];
  const featuredShop = beanShops.find((shop) => shop.ownerExperience?.length) ?? beanShops[0];
  const otherShops = beanShops.filter((shop) => shop.slug !== featuredShop.slug);
  const articles = reviewSlugs
    .map((slug) => getArticle(slug))
    .filter((article) => article !== undefined)
    .map(({ slug, title, description, category, date }) => ({ slug, title, description, category, date }));
  const guideCards = guides.flatMap((guide) => {
    const article = getArticle(guide.slug);
    return article ? [{ ...guide, modified: articleModified(article) }] : [];
  });

  const kitchen = kitchenPublic ? getKitchenArticles().slice(0, 4) : [];

  return (
    <main className="page-wrap home-wrap">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-text">
          <p className="hero-kicker">コーヒー道具の選び方ノート・PR を含みます</p>
          <h1 id="home-title">家のコーヒー道具を、使っているものと公式情報で選ぶ。</h1>
          <p className="home-lede">
            手挽きミル、コーヒーメーカー、豆。使っている道具は体験から、使っていない道具は公式の情報と公開レビューから書いています。
          </p>
        </div>

        <aside className="home-pick" aria-labelledby="home-pick-title">
          <p className="home-pick-label">迷ったら、この1台</p>
          <div className="home-pick-main">
            <Link href={`/articles/${pick.reviewSlug ?? "coffee-mill-ranking"}/`} className="home-pick-photo">
              <Image
                src={pick.imageUrl ?? "/images/timemore-s3-green-owner.webp"}
                alt={pick.imageAlt ?? pick.name}
                width={480}
                height={480}
                priority
              />
            </Link>
            <div>
              <p className="home-pick-owner">運営者がふだん使っています</p>
              <h2 id="home-pick-title">{pick.name}</h2>
              <p className="home-pick-text">1回に約30gを挽いて、2〜3杯分。ランキングの1位です。</p>
            </div>
          </div>
          <BuyButtons {...grinderBuyProps(pick, "ja")} />
          <p className="home-pick-links">
            <Link href={`/articles/${pick.reviewSlug ?? "coffee-mill-ranking"}/`} className="text-link">
              レビューを読む
            </Link>
            <Link href="/articles/coffee-mill-ranking/" className="text-link">
              ランキングを見る
            </Link>
          </p>
        </aside>
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
          <h2>まず読む5本</h2>
          <Link href="/articles" className="text-link">
            読みものの一覧
          </Link>
        </div>
        <ul className="home-guides">
          {guideCards.map((guide) => (
            <li key={guide.slug}>
              <Link href={`/articles/${guide.slug}/`} className="home-guide">
                {guide.image ? (
                  <span className="home-guide-media">
                    <Image src={guide.image.src} alt={guide.image.alt} fill sizes="(min-width: 1100px) 20vw, (min-width: 720px) 45vw, 100vw" />
                    {guide.image.credit ? <span className="home-guide-credit">{guide.image.credit}</span> : null}
                  </span>
                ) : (
                  <span className="home-guide-media home-guide-tile" aria-hidden="true">
                    {guide.tile?.map((line) => <span key={line}>{line}</span>)}
                  </span>
                )}
                <span className="home-guide-body">
                  <span className="home-guide-kicker">{guide.kicker}</span>
                  <span className="home-guide-title">{guide.title}</span>
                  <span className="home-guide-text">{guide.text}</span>
                  <span className="home-guide-meta">
                    <span>{guide.tag}</span>
                    <time dateTime={guide.modified}>{dotDate(guide.modified)}</time>
                  </span>
                </span>
              </Link>
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
          No.1 は栗子 S3、No.2 はエペイオス Essence Go です。運営者がふだん使っているのは栗子 S3 で、1回に約30g、2〜3杯分です。栗子 S5 Pro は使っていません。
        </p>
        <ul className="picks-grid">
          {models.map((model) => (
            <li key={model.id}>
              <GrinderCard model={model} />
            </li>
          ))}
        </ul>
      </section>

      <section className="section-block" id="writer">
        <div className="home-writer">
          <div>
            <p className="hero-kicker">書いている人</p>
            <h2>58歳の会社員が、朝のコーヒーのために。</h2>
            <p className="home-writer-lede">
              出かける前に、急がず少し良い道具で淹れたい。体験として書くのは、下の3つだけです。
            </p>
          </div>
          <dl className="home-writer-facts">
            <div>
              <dt>タイムモア 栗子 S3</dt>
              <dd>ふだん使い。1回に約30g、2〜3杯分</dd>
            </div>
            <div>
              <dt>エペイオス Essence Go</dt>
              <dd>使っています。一言は「とにかく軽く回る」</dd>
            </div>
            <div>
              <dt>珈琲きゃろっと</dt>
              <dd>定期便を約1年続けていました</dd>
            </div>
          </dl>
          <p className="home-writer-note">
            ほかの道具は、公式の情報と公開レビューのまとめです。
            <Link href="/about" className="text-link">
              運営者情報
            </Link>
          </p>
        </div>
      </section>

      <section className="section-block" id="paths">
        <div className="section-heading">
          <h2>目的から探す</h2>
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
        <p className="section-lead">ミル、ドリッパー、ケトル、スケール、コーヒーメーカー、エスプレッソマシン、キャニスター、豆の8つを公開中です。</p>
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
