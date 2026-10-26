import Image from "next/image";
import Link from "next/link";
import { BuyButtons, grinderBuyProps } from "@/components/BuyButtons";
import { getBrand, grinderTypeLabel, type GrinderModel } from "@/data/grinders";

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

  const body = (
    <div className="product-body flex flex-1 flex-col">
      <p className="pick-label">
        {brand ? `${brand.nameJa}（${brand.nameEn}）` : model.brandSlug}
        {brand?.country ? `・${brand.country}` : ""}・{grinderTypeLabel(model.type)}
      </p>
      <h3>{model.name}</h3>
      <p className="fine">写真はイメージです。実機と一致しない場合があります。</p>
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
      <p className="mt-auto pt-2">
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
          <div className="card-visual relative min-h-52">
            <Image src={model.imageUrl} alt={model.imageAlt} fill sizes="(min-width: 640px) 14rem, 100vw" className="object-cover" />
          </div>
          {body}
        </div>
      </aside>
    );
  }

  return (
    <article className="product-card flex h-full flex-col">
      <div className="card-visual relative">
        <Image src={model.imageUrl} alt={model.imageAlt} fill sizes="(min-width: 1100px) 30vw, (min-width: 720px) 45vw, 100vw" className="object-cover" />
      </div>
      {body}
    </article>
  );
}
