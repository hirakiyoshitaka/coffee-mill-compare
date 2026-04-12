import Link from "next/link";
import { brands, grinderModels } from "@/data/grinders";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:max-w-[90rem]">
      <section className="mb-14 max-w-3xl">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--accent-soft)]">
          Flagship manual grinders
        </p>
        <h1 className="mb-4 text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">
          世界で名前の挙がりやすいコーヒーミルを、一台ずつ丁寧に比較
        </h1>
        <p className="text-lg leading-relaxed text-stone-600">
          コマンダンテ・キヌ・タイムモア・1Zpresso・EPEIOS（エペイオス／エネペイオス 等の表記）のフラッグシップ級モデルを
          <strong className="font-medium text-stone-800">写真付きで5機種横並び</strong>
          にし、スペック・価格・口コミの傾向を整理しました。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/compare"
            className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
          >
            5機種を比較する
          </Link>
          <a
            href="#brands"
            className="inline-flex items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-5 py-2.5 text-sm font-medium text-stone-800 hover:border-stone-300"
          >
            ブランド一覧
          </a>
        </div>
      </section>

      <section id="brands" className="scroll-mt-24">
        <h2 className="mb-6 text-xl font-medium tracking-tight text-stone-900">比較対象ブランド</h2>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {brands.map((brand) => {
            const flagship = brand.flagshipIds.map((id) => grinderModels[id]).filter(Boolean);
            return (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="group flex flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-6 shadow-[0_12px_40px_-28px_rgba(0,0,0,0.18)] transition hover:border-stone-300/80"
              >
                <div className="mb-3 flex items-baseline justify-between gap-2">
                  <div>
                    <p className="text-xs text-stone-500">{brand.country}</p>
                    <p className="text-lg font-medium text-stone-900 group-hover:text-[var(--accent)]">
                      {brand.nameJa}
                    </p>
                    <p className="text-sm text-stone-500">{brand.nameEn}</p>
                  </div>
                  <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
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
