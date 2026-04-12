import Link from "next/link";
import { brands, grinderModels } from "@/data/grinders";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <section className="mb-14 max-w-3xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-amber-800">
          Flagship manual grinders
        </p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          世界で名前の挙がりやすいコーヒーミルを、一台ずつ丁寧に比較
        </h1>
        <p className="text-lg leading-relaxed text-stone-600">
          コマンダンテ・タイムモア・1Zpresso・EPEIOS（エペイオス／エネペイオス 等の表記）のフラッグシップ級モデルをスペック表で横並びし、各ブランドページではコミュニティで繰り返し語られる論点を整理しました。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/compare"
            className="inline-flex items-center justify-center rounded-full bg-amber-900 px-5 py-2.5 text-sm font-semibold text-amber-50 shadow-sm transition hover:bg-amber-800"
          >
            スペック比較表を見る
          </Link>
          <a
            href="#brands"
            className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 hover:border-amber-400"
          >
            ブランド一覧
          </a>
        </div>
      </section>

      <section id="brands" className="scroll-mt-24">
        <h2 className="mb-6 text-xl font-bold text-stone-900">比較対象ブランド</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {brands.map((brand) => {
            const flagship = brand.flagshipIds.map((id) => grinderModels[id]).filter(Boolean);
            return (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="group flex flex-col rounded-2xl border border-stone-200/90 bg-[var(--surface)] p-6 shadow-sm shadow-amber-950/5 transition hover:border-amber-300 hover:shadow-md"
              >
                <div className="mb-3 flex items-baseline justify-between gap-2">
                  <div>
                    <p className="text-xs text-stone-500">{brand.country}</p>
                    <p className="text-lg font-semibold text-stone-900 group-hover:text-amber-950">
                      {brand.nameJa}
                    </p>
                    <p className="text-sm text-stone-500">{brand.nameEn}</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-950">
                    詳細へ
                  </span>
                </div>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-stone-600">{brand.blurb}</p>
                <div className="border-t border-stone-200/80 pt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                    本サイトでの主なモデル
                  </p>
                  <ul className="mt-1 text-sm font-medium text-stone-800">
                    {flagship.map((m) => (
                      <li key={m.id}>{m.name}</li>
                    ))}
                  </ul>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
