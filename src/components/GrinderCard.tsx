import Link from "next/link";
import { BuyButtons, grinderBuyProps } from "@/components/BuyButtons";
import { ProductVisual } from "@/components/ProductVisual";
import { featuredLabel, getBrand, grinderTypeLabel, type GrinderModel } from "@/data/grinders";

function diameterLabel(model: GrinderModel): string {
  return model.burrDiameterMm ? `${model.burrDiameterMm} mm` : "公表値要確認";
}

export function GrinderCard({ model, variant = "tile" }: { model: GrinderModel; variant?: "tile" | "embed" }) {
  const brand = getBrand(model.brandSlug);
  const specs = [
    ["駆動", grinderTypeLabel(model.type)],
    ["バー", model.burrMaterial],
    ["バー径", diameterLabel(model)],
    ["調整", model.adjustment],
    ["重量", model.weightGrams ? `${model.weightGrams} g` : "—"],
  ] as const;

  const rank = featuredLabel(model.id);
  const body = (
    <div className="product-body flex flex-1 flex-col">
      <p className="pick-label">{rank ?? `${brand?.nameJa ?? model.brandSlug}・${grinderTypeLabel(model.type)}`}</p>
      {rank ? (
        <p className="fine">
          {brand ? `${brand.nameJa}（${brand.nameEn}）` : model.brandSlug}
          {brand?.country ? `・${brand.country}` : ""}
        </p>
      ) : null}
      <h3>{model.name}</h3>
      {model.highlight ? <p>{model.highlight}</p> : null}
      {variant === "embed" ? (
        <dl className="mt-2 grid gap-3 sm:grid-cols-2">
          {specs.map(([label, value]) => (
            <div key={label}>
              <dt className="text-[13px] text-[var(--muted)]">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p>{model.cuppingNotes[0]}</p>
      )}
      <p className="price-row">
        <span>価格の目安</span>
        <strong>{model.priceJpyHint}</strong>
      </p>
      <BuyButtons {...grinderBuyProps(model)} />
      <p className="hero-actions mt-auto pt-2">
        {model.reviewSlug ? (
          <Link href={`/articles/${model.reviewSlug}`} className="text-link">
            レビューを読む
          </Link>
        ) : null}
        <Link href={`/brands/${model.brandSlug}`} className="text-link">
          {brand?.nameJa ?? "ブランド"}のページへ
        </Link>
      </p>
    </div>
  );

  if (variant === "embed") {
    return (
      <aside className="product-card my-8">
        <div className="grid sm:grid-cols-[14rem_minmax(0,1fr)]">
          <ProductVisual model={model} variant="embed" />
          {body}
        </div>
      </aside>
    );
  }

  return (
    <article className="product-card flex h-full flex-col">
      <ProductVisual model={model} />
      {body}
    </article>
  );
}
