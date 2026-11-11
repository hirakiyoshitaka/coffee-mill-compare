import Link from "next/link";
import { BuyButtons, grinderBuyProps } from "@/components/BuyButtons";
import { ProductVisual } from "@/components/ProductVisual";
import { cardDict, type SiteLocale } from "@/lib/i18n";
import { localizeModel, localizedTypeLabel } from "@/data/grinders-i18n";
import { featuredLabel, getBrand, grinderTypeLabel, type GrinderModel } from "@/data/grinders";

function diameterLabel(model: GrinderModel, locale: SiteLocale): string {
  return model.burrDiameterMm ? `${model.burrDiameterMm} mm` : cardDict[locale].diameterUnknown;
}

export function GrinderCard({ model: baseModel, variant = "tile", locale = "ja", reviewHref }: { model: GrinderModel; variant?: "tile" | "embed"; locale?: SiteLocale; reviewHref?: string }) {
  const d = cardDict[locale];
  const ja = locale === "ja";
  const owned = ja && baseModel.ownerUse;
  const model = localizeModel(baseModel, locale);
  const typeLabel = ja ? grinderTypeLabel(model.type) : localizedTypeLabel(model.type, locale);
  const brand = getBrand(model.brandSlug);
  const specs = [
    [d.drive, typeLabel],
    [d.burr, model.burrMaterial],
    [d.burrSize, diameterLabel(model, locale)],
    [d.adjust, model.adjustment],
    [d.weight, model.weightGrams ? `${model.weightGrams} g` : "—"],
  ] as const;

  const jaRank = featuredLabel(model.id);
  const rank = ja ? jaRank : jaRank?.replace(/^おすすめ\s*/, "");
  const specList = (
    <dl className="mt-2 grid gap-3 sm:grid-cols-2">
      {specs.map(([label, value]) => (
        <div key={label}>
          <dt className="text-[13px] text-[var(--muted)]">{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
  const ownerBadge = owned ? (
    <p className="owner-use-badge">
      {baseModel.ownerUse === "daily" ? "運営者がふだん使っています" : "運営者が使っています"}
    </p>
  ) : null;
  const body = (
    <div className="product-body flex flex-1 flex-col">
      <p className="pick-label">{rank ?? `${(ja ? brand?.nameJa : brand?.nameEn) ?? model.brandSlug}・${typeLabel}`}</p>
      {rank ? (
        <p className="fine">
          {brand ? (ja ? `${brand.nameJa}（${brand.nameEn}）` : brand.nameEn) : model.brandSlug}
          {ja && brand?.country ? `・${brand.country}` : ""}
        </p>
      ) : null}
      <h3>{model.name}</h3>
      {(ja || model.localized) && model.highlight ? <p>{model.highlight}</p> : null}
      {owned ? (
        <>
          <BuyButtons {...grinderBuyProps(model, locale, model.localized)} />
          <details className="purchase-details">
            <summary>仕様・購入前の確認点</summary>
            {specList}
            <p className="fine">購入前の確認点</p>
            <ul>
              {model.caveats.map((caveat) => <li key={caveat}>{caveat}</li>)}
            </ul>
          </details>
        </>
      ) : (
        <>
          {variant === "embed" ? specList : <p>{model.cuppingNotes[0]}</p>}
          <p className="price-row">
            <span>{d.price}</span>
            <strong>{model.priceJpyHint}</strong>
          </p>
          {d.priceNote ? <p className="fine">{d.priceNote}</p> : null}
          <BuyButtons {...grinderBuyProps(model, locale, model.localized)} />
        </>
      )}
      <p className="hero-actions mt-auto pt-2">
        {ja && model.reviewSlug ? (
          <Link href={`/articles/${model.reviewSlug}`} className="text-link">
            {d.review}
          </Link>
        ) : null}
        {!ja && reviewHref ? (
          <Link href={reviewHref} className="text-link">
            {d.review}
          </Link>
        ) : null}
        <Link href={`/brands/${model.brandSlug}`} className="text-link" {...(ja ? {} : { lang: "ja" as const })}>
          {ja ? <>{brand?.nameJa ?? "ブランド"}のページへ</> : d.brandPage(brand?.nameEn ?? model.brandSlug)}
        </Link>
      </p>
    </div>
  );

  if (variant === "embed") {
    return (
      <aside className={`product-card my-8${owned ? " owner-product-card" : ""}`}>
        {ownerBadge}
        <div className={model.imageUrl || !ja ? "grid sm:grid-cols-[14rem_minmax(0,1fr)]" : undefined}>
          <ProductVisual model={model} variant="embed" locale={locale} />
          {body}
        </div>
      </aside>
    );
  }

  return (
    <article className={`product-card flex h-full flex-col${owned ? " owner-product-card" : ""}`}>
      {ownerBadge}
      <ProductVisual model={model} locale={locale} />
      {body}
    </article>
  );
}
