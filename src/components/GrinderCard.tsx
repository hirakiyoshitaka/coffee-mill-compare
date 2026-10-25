import Image from "next/image";
import Link from "next/link";
import { getBrand, grinderTypeLabel, type GrinderModel } from "@/data/grinders";
import { BuyButtons } from "@/components/BuyButtons";

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

  if (variant === "embed") {
    return (
      <aside className="my-8 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[0_18px_40px_-32px_rgba(60,32,18,0.45)]">
        <div className="grid sm:grid-cols-[11rem_1fr]">
          <div className="relative h-48 sm:h-full sm:min-h-52">
            <Image src={model.imageUrl} alt={model.imageAlt} fill sizes="(min-width: 640px) 11rem, 100vw" className="object-cover" />
          </div>
          <div className="p-4 sm:p-5">
            <p className="text-xs text-stone-500">
              {brand ? `${brand.nameJa}（${brand.nameEn}）` : model.brandSlug}・{grinderTypeLabel(model.type)}
            </p>
            <h3 className="mt-1 font-serif text-xl text-stone-900">{model.name}</h3>
            <p className="mt-1 text-xs text-stone-500">写真はイメージです。実機と一致しない場合があります。</p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              {specs.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-stone-500">{label}</dt>
                  <dd className="text-stone-800">{value}</dd>
                </div>
              ))}
              <div className="sm:col-span-2">
                <dt className="text-xs text-stone-500">価格の目安</dt>
                <dd className="text-stone-800">{model.priceJpyHint}</dd>
              </div>
            </dl>
            <BuyButtons model={model} />
            <p className="mt-3">
              <Link href={`/brands/${model.brandSlug}`} className="text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline">
                {brand?.nameJa ?? "ブランド"}のページへ
              </Link>
            </p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[0_16px_36px_-30px_rgba(60,32,18,0.5)]">
      <div className="relative aspect-[4/3] bg-stone-200">
        <Image src={model.imageUrl} alt={model.imageAlt} fill sizes="(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-stone-500">
          {brand?.nameJa}・{brand?.country}
        </p>
        <h3 className="mt-1 font-serif text-lg leading-snug text-stone-900">{model.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600">{model.cuppingNotes[0]}</p>
        <p className="mt-3 text-xs text-stone-500">価格の目安</p>
        <p className="text-sm leading-relaxed text-stone-800">{model.priceJpyHint}</p>
        <BuyButtons model={model} />
        <Link href={`/brands/${model.brandSlug}`} className="mt-4 text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline">
          詳しく見る
        </Link>
      </div>
    </article>
  );
}
