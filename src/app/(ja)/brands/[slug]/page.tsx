import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PrNotice } from "@/components/PrNotice";
import { BuyButtons, grinderBuyProps } from "@/components/BuyButtons";
import { ProductVisual } from "@/components/ProductVisual";
import { ReviewChips } from "@/components/ReviewChips";
import { RichText } from "@/components/RichText";
import { brands, getBrand, getModel, grinderTypeLabel } from "@/data/grinders";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return {};
  return pageMeta({
    title: `${brand.nameJa}（${brand.nameEn}）のコーヒーミル`,
    description: `${brand.nameJa}の掲載モデル、価格の目安、コミュニティで繰り返される論点の要約。`,
    path: `/brands/${brand.slug}`,
  });
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const flagships = brand.flagshipIds.map((id) => getModel(id)).filter((model) => model !== undefined);

  return (
    <main className="page-wrap page-narrow">
      <Breadcrumb
        items={[
          { href: "/", label: "ホーム" },
          { href: "/categories/mill", label: "ミル" },
          { label: brand.nameJa },
        ]}
      />

      <p className="text-sm text-stone-500">{brand.country}</p>
      <h1 className="page-title">
        {brand.nameJa}
        <span className="ml-2 text-xl font-medium text-stone-500">{brand.nameEn}</span>
      </h1>
      <p className="mt-4 text-base leading-relaxed text-stone-600">
        <RichText text={brand.blurb} />
      </p>

      <div className="mt-8">
        <PrNotice />
      </div>
      <section className="mt-10">
        <h2 className="font-serif text-2xl text-stone-950">掲載モデル</h2>
        <ul className="mt-4 space-y-6">
          {flagships.map((model) => (
            <li key={model.id} className="product-card">
              <ProductVisual model={model} />
              <div className="p-5">
                <p className="text-xs text-stone-500">{grinderTypeLabel(model.type)}</p>
                <h3 className="mt-1 font-serif text-2xl text-stone-950">{model.name}</h3>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-stone-500">バー</dt>
                    <dd className="text-stone-800">{model.burrMaterial}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-stone-500">バー径（参考）</dt>
                    <dd className="text-stone-800">{model.burrDiameterMm ? `${model.burrDiameterMm} mm` : "公表値要確認"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-stone-500">粒度調整</dt>
                    <dd className="text-stone-800">{model.adjustment}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-stone-500">重量（参考）</dt>
                    <dd className="text-stone-800">{model.weightGrams ? `${model.weightGrams} g` : "—"}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-stone-500">価格の目安</dt>
                    <dd className="text-stone-800">{model.priceJpyHint}</dd>
                  </div>
                </dl>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-stone-500">長所として挙がりやすい点</p>
                    <ul className="mt-1 list-disc pl-4 text-sm leading-relaxed text-stone-700">
                      {model.cuppingNotes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-stone-500">留意点</p>
                    <ul className="mt-1 list-disc pl-4 text-sm leading-relaxed text-stone-700">
                      {model.caveats.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <BuyButtons {...grinderBuyProps(model)} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-stone-950">口コミ・レビューの傾向</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          特定の投稿や星評価の転載ではなく、フォーラム・レビュー記事・SNS で繰り返し見られる論点を要約しています。
        </p>
        <div className="mt-6">
          <ReviewChips reviews={brand.communityReviews} />
        </div>
      </section>

      <div className="hero-actions mt-12">
        <Link href="/compare" className="hero-cta">
          比較表を見る
        </Link>
        <Link href="/beans" className="text-link">
          豆の店を見る
        </Link>
        <Link href="/categories/mill" className="text-link">
          ミルのカテゴリへ
        </Link>
      </div>
    </main>
  );
}
