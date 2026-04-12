import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewChips } from "@/components/ReviewChips";
import { brands, grinderModels, getBrand } from "@/data/grinders";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return {};
  return {
    title: `${brand.nameJa}（${brand.nameEn}）`,
    description: `${brand.nameJa} のフラッグシップ概要と、コミュニティで繰り返し見られる論点の要約。`,
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const flagships = brand.flagshipIds.map((id) => grinderModels[id]).filter(Boolean);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <nav className="mb-6 text-sm text-stone-500">
        <Link href="/" className="hover:text-amber-900">
          ホーム
        </Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">{brand.nameJa}</span>
      </nav>

      <p className="text-sm text-stone-500">{brand.country}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">
        {brand.nameJa}
        <span className="ml-2 text-xl font-medium text-stone-500">{brand.nameEn}</span>
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-stone-600">{brand.blurb}</p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-stone-900">本サイトで扱うモデル</h2>
        <ul className="mt-3 space-y-6">
          {flagships.map((m) => (
            <li
              key={m.id}
              className="rounded-2xl border border-stone-200 bg-[var(--surface)] p-5 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-stone-900">{m.name}</h3>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    バー
                  </dt>
                  <dd className="text-stone-800">{m.burrMaterial}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    調整
                  </dt>
                  <dd className="text-stone-800">{m.adjustment}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    価格の目安
                  </dt>
                  <dd className="text-stone-800">{m.priceJpyHint}</dd>
                </div>
              </dl>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-stone-500">長所として挙がりやすい点</p>
                  <ul className="mt-1 list-inside list-disc text-sm text-stone-700">
                    {m.cuppingNotes.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-stone-500">留意点</p>
                  <ul className="mt-1 list-inside list-disc text-sm text-stone-700">
                    {m.caveats.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-stone-900">口コミ・レビューの傾向</h2>
        <p className="mt-2 text-sm text-stone-600">
          特定の投稿や星評価の転載ではなく、フォーラム・レビュー記事・SNS で繰り返し見られる論点を要約しています。
        </p>
        <div className="mt-6">
          <ReviewChips reviews={brand.communityReviews} />
        </div>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/compare"
          className="inline-flex rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-amber-50 hover:bg-amber-800"
        >
          比較表に戻る
        </Link>
        <Link
          href="/"
          className="inline-flex rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 hover:border-amber-400"
        >
          トップへ
        </Link>
      </div>
    </main>
  );
}
