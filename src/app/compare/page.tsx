import type { Metadata } from "next";
import Link from "next/link";
import { brands, comparisonRows, grinderModels } from "@/data/grinders";

export const metadata: Metadata = {
  title: "スペック比較",
  description: "フラッグシップ手挽きミル主要4機種のスペックを横並びで比較します。",
};

export default function ComparePage() {
  const models = brands.flatMap((b) =>
    b.flagshipIds.map((id) => grinderModels[id]).filter(Boolean),
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">スペック比較</h1>
        <p className="mt-3 text-stone-600">
          各ブランドの代表的フラッグシップ（手挽き中心）を並べています。セルは参考情報です。
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-[var(--surface)] shadow-sm">
        <table className="min-w-[720px] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-amber-50/60">
              <th className="sticky left-0 z-10 bg-amber-50/95 px-4 py-3 font-semibold text-stone-800 backdrop-blur-sm">
                項目
              </th>
              {models.map((m) => (
                <th key={m.id} className="min-w-[160px] px-4 py-3 font-semibold text-stone-900">
                  <div>{m.shortLabel}</div>
                  <Link
                    href={`/brands/${m.brandSlug}`}
                    className="mt-1 inline-block text-xs font-normal text-amber-800 hover:underline"
                  >
                    ブランドページ
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.key} className="border-b border-stone-100 last:border-0">
                <th className="sticky left-0 z-10 bg-[var(--surface)] px-4 py-3 font-medium text-stone-700 shadow-[1px_0_0_0_rgba(0,0,0,0.06)]">
                  {row.label}
                </th>
                {models.map((m) => (
                  <td key={m.id} className="px-4 py-3 text-stone-700">
                    {row.get(m)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-12 grid gap-8 sm:grid-cols-2">
        {models.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-stone-900">{m.name}</h2>
            <div className="mt-3 space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  よく挙がる長所
                </p>
                <ul className="mt-1 list-inside list-disc text-stone-700">
                  {m.cuppingNotes.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  検討時の留意点
                </p>
                <ul className="mt-1 list-inside list-disc text-stone-700">
                  {m.caveats.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
