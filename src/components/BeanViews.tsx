import Link from "next/link";
import { BuyButtons } from "@/components/BuyButtons";
import { priceAsOfLabel, type BeanShop } from "@/data/beans";

export function shopBuyProps(shop: BeanShop) {
  return {
    name: shop.name,
    links: [
      { href: shop.a8Url, label: "ショップで見る" },
      { href: shop.rakutenUrl, label: "楽天市場で見る" },
      { href: shop.amazonUrl, label: "Amazonで探す" },
    ],
  };
}

function placeLabel(shop: BeanShop): string {
  return [shop.area, shop.company].filter(Boolean).join("・") || "焙煎豆の店";
}

export function OfferCards({ shop }: { shop: BeanShop }) {
  return (
    <ul className="shop-grid">
      {shop.offers.map((offer) => (
        <li key={offer.id} className="offer-card">
          <h3>{offer.name}</h3>
          {offer.priceHint ? (
            <p className="price-row">
              <span>価格の目安</span>
              <strong>{offer.priceHint}</strong>
            </p>
          ) : (
            <p className="fine">金額は、このサイトの掲載データにありません。</p>
          )}
          {offer.note ? <p>{offer.note}</p> : null}
        </li>
      ))}
    </ul>
  );
}

export function ShopLinks({ shop }: { shop: BeanShop }) {
  if (!shop.officialUrl && !shop.rakutenShopUrl) return null;
  return (
    <p className="hero-actions">
      {shop.officialUrl ? (
        <a className="text-link" href={shop.officialUrl} target="_blank" rel="noopener noreferrer">
          公式サイト
        </a>
      ) : null}
      {shop.rakutenShopUrl ? (
        <a className="text-link" href={shop.rakutenShopUrl} target="_blank" rel="noopener noreferrer">
          楽天の店舗ページ
        </a>
      ) : null}
    </p>
  );
}

export function BeanDirectoryCard({ shop }: { shop: BeanShop }) {
  return (
    <article className="shop-card">
      <p className="pick-label">{shop.ownerExperience ? "最初に開く店" : placeLabel(shop)}</p>
      {shop.ownerExperience ? <p className="fine">{placeLabel(shop)}</p> : null}
      <h3>{shop.name}</h3>
      <p>{shop.summary}</p>
      <p>{shop.position}</p>
      <ul>
        {shop.offers.map((offer) => (
          <li key={offer.id} className="price-row">
            <span>{offer.name}</span>
            <strong>{offer.priceHint ?? "金額の掲載なし"}</strong>
          </li>
        ))}
      </ul>
      <p className="fine">{priceAsOfLabel}</p>
      <p>
        <Link className="text-link" href={`/beans/${shop.slug}`}>
          この店のページ
        </Link>
      </p>
    </article>
  );
}

export function BeanEmbed({ shop }: { shop: BeanShop }) {
  return (
    <aside className="shop-card my-8">
      <p className="pick-label">{placeLabel(shop)}</p>
      <h3>{shop.name}</h3>
      <p>{shop.summary}</p>
      <ul>
        {shop.offers.map((offer) => (
          <li key={offer.id} className="price-row">
            <span>{offer.name}</span>
            <strong>{offer.priceHint ?? "金額の掲載なし"}</strong>
            {offer.note ? <span>{offer.note}</span> : null}
          </li>
        ))}
      </ul>
      <p className="fine">{priceAsOfLabel}</p>
      <BuyButtons {...shopBuyProps(shop)} />
      <p>
        <Link className="text-link" href={`/beans/${shop.slug}`}>
          こだわりを読む
        </Link>
      </p>
    </aside>
  );
}

export function BeanShopDetail({ shop }: { shop: BeanShop }) {
  return (
    <>
      <p className="hero-kicker">{placeLabel(shop)}</p>
      <h1 className="page-title">{shop.name}</h1>
      <p className="lede">{shop.summary}</p>
      <p className="fine">{shop.position}</p>

      {shop.ownerExperience?.length ? (
        <section className="story-block owner-note">
          <h2>運営者の体験</h2>
          {shop.ownerExperience.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ) : null}

      <section className="story-block">
        <h2>こだわり</h2>
        {shop.story.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="story-block">
        <h2>焙煎</h2>
        {shop.roasting.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="story-block">
        <h2>豆の選び方</h2>
        {shop.selection.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="story-block">
        <h2>紹介している売り方</h2>
        <p>金額があるものは目安です。{priceAsOfLabel}。販売ページの表示が優先します。</p>
        <OfferCards shop={shop} />
        <BuyButtons {...shopBuyProps(shop)} />
        <ShopLinks shop={shop} />
        <p className="fine">
          公式サイトと楽天の店舗ページは、店の公開ページです。購入ボタンは、アフィリエイト用の URL を入れたときだけ出ます。
        </p>
      </section>
    </>
  );
}
