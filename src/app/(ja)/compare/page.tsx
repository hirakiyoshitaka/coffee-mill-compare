import type { ReactNode } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BuyButtons, grinderBuyProps } from "@/components/BuyButtons";
import { ProductVisual } from "@/components/ProductVisual";
import { brands, comparisonRows, getFlagshipModels, type GrinderModel } from "@/data/grinders";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "手挽きミルのスペック比較",
  description: "掲載中の手挽きミルを横並びにし、仕様・価格の目安・口コミの傾向を整理します。",
  path: "/compare",
});

function MdSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-[var(--border-subtle)] pb-10 pt-1 last:border-0">
      <h2 className="mb-5 scroll-mt-24 text-[1.125rem] font-semibold tracking-tight text-stone-900 sm:text-[1.25rem]">
        {title}
      </h2>
      <div className="space-y-3 text-[17px] leading-[1.9] text-[var(--muted)] md:pl-7 [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--line)] [&_blockquote]:pl-4 [&_blockquote]:text-[16px] [&_blockquote]:text-[var(--muted)] [&_strong]:font-medium [&_strong]:text-[var(--ink)] [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}

function brandLine(m: GrinderModel) {
  const b = brands.find((x) => x.slug === m.brandSlug);
  return b ? `${b.nameJa}（${b.nameEn}）` : m.brandSlug;
}

export default function ComparePage() {
  const models = getFlagshipModels();

  return (
    <main className="page-wrap">
      <Breadcrumb
        items={[
          { href: "/", label: "ホーム" },
          { href: "/categories/mill", label: "ミル" },
          { label: "スペック比較" },
        ]}
      />
      <header className="mb-10 max-w-2xl">
        <p className="mb-2 text-sm font-medium text-[var(--accent-soft)]">コーヒーミル（手挽き）</p>
        <h1 className="page-title">{models.length}機種スペック比較</h1>
        <p className="lede">
          このサイトが先に勧めるのは、栗子 S5 Pro とエペイオス Essence Go です。ほかの機種は、条件を並べるために残しています。栗子 S5 Pro の写真はグリーンです。Essence Go は製品名のカードです。ほかの機種の実機写真は載せていません。数値と価格は目安です。
        </p>
      </header>

      {/* 掲載機種の横並び */}
      <div className="-mx-4 mb-14 px-4 lg:mx-0 lg:px-0">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 scrollbar-thin sm:gap-4 lg:grid lg:snap-none lg:grid-cols-5 lg:overflow-visible lg:pb-0">
          {models.map((m) => (
            <article
              key={m.id}
              className="w-[min(46vw,12.5rem)] shrink-0 snap-center sm:w-48 lg:w-auto"
            >
              <div className="flex h-full flex-col overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[0_12px_40px_-24px_rgba(0,0,0,0.25)]">
                <ProductVisual model={m} variant="compact" />
                <div className="flex flex-1 flex-col gap-2 p-3 sm:p-3.5">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-stone-400">
                      {brandLine(m)}
                    </p>
                    <p className="mt-0.5 text-[13px] font-medium leading-snug text-stone-900">
                      {m.name}
                    </p>
                  </div>
                  <p className="line-clamp-2 flex-1 text-[12px] leading-relaxed text-stone-500">
                    {m.cuppingNotes[0]}
                  </p>
                  <Link
                    href={`/brands/${m.brandSlug}`}
                    className="text-[11px] font-medium text-[var(--accent)] underline-offset-4 hover:underline"
                  >
                    ブランド詳細
                  </Link>
                  <BuyButtons {...grinderBuyProps(m)} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* マークダウン風ドキュメント */}
      <article className="mx-auto max-w-3xl space-y-10 lg:max-w-[42rem]">
        <MdSection title="比較の前提と免責">
          <p>
            本ページは<strong>教育・検討用の整理</strong>
            です。スペックは公表値や市場の目安を基にした静的データで、メーカー改定や為替により実際と異なる場合があります。
          </p>
          <blockquote>口コミ・レビュー欄は特定投稿の転載ではなく、コミュニティで繰り返し見られる論点の要約です。</blockquote>
        </MdSection>

        <MdSection title="各機種の位置づけ（一言）">
          <ul>
            {models.map((m) => (
              <li key={m.id}>
                <strong>{m.shortLabel}</strong> — {m.cuppingNotes[0]}
              </li>
            ))}
          </ul>
        </MdSection>

        <MdSection title="駆動方式">
          <p>
            本比較の{models.length}機種はいずれも<strong>手挽き（ハンドル駆動）</strong>
            です。電動ミルの機種データはまだないため、本ページでは扱いません。
          </p>
        </MdSection>

        <MdSection title="バー素材と径（参考）">
          <div className="overflow-x-auto rounded-md border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
            <table className="w-full min-w-[520px] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-stone-500">
                  <th className="px-3 py-2.5 font-medium">機種</th>
                  <th className="px-3 py-2.5 font-medium">バー</th>
                  <th className="px-3 py-2.5 font-medium">径</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m) => (
                  <tr key={m.id} className="border-b border-[var(--border-subtle)] last:border-0">
                    <td className="px-3 py-2.5 font-medium text-stone-800">{m.shortLabel}</td>
                    <td className="px-3 py-2.5 text-stone-600">{m.burrMaterial}</td>
                    <td className="px-3 py-2.5 text-stone-600">
                      {m.burrDiameterMm ? `${m.burrDiameterMm} mm` : "公表値要確認"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MdSection>

        <MdSection title="粒度調整の特徴">
          <ul>
            {models.map((m) => (
              <li key={m.id}>
                <strong>{m.shortLabel}</strong> — {m.adjustment}
              </li>
            ))}
          </ul>
          <p>
            抽出方法ごとの粗さの順番は
            <Link href="/articles/coffee-grind-size-guide/" className="mx-1 font-medium text-[var(--accent)] underline underline-offset-4">
              コーヒーの挽き目（粒度）の選び方
            </Link>
            です。クリックの数字は機種のあいだで移せません。
          </p>
        </MdSection>

        <MdSection title="重量と携帯性の目安">
          <ul>
            {models.map((m) => (
              <li key={m.id}>
                <strong>{m.shortLabel}</strong> —{" "}
                {m.weightGrams ? (
                  <>
                    約 <strong>{m.weightGrams} g</strong>（公表・参考値）
                  </>
                ) : (
                  "—"
                )}
              </li>
            ))}
          </ul>
          <p className="text-[14px] text-stone-500">
            軽量モデルほどアウトドア向き、重量級は据え置き抽出のしっかり感、といった読みで整理すると比較しやすいです。
          </p>
        </MdSection>

        <MdSection title="価格帯の目安（日本円）">
          <ul>
            {models.map((m) => (
              <li key={m.id}>
                <strong>{m.shortLabel}</strong> — {m.priceJpyHint}
              </li>
            ))}
          </ul>
          <p>
            掲載の価格目安は、いずれもおよそ1万円を超えます。予算をそこまでに抑えたい場合は
            <Link href="/articles/hand-coffee-mill-under-10000/" className="mx-1 font-medium text-[var(--accent)] underline underline-offset-4">
              1万円以下の手挽きコーヒーミルの選び方
            </Link>
            を見てください。価格は変動します。
          </p>
        </MdSection>

        <MdSection title="味わい・抽出におけるコミュニティの傾向">
          <p>
            個人の豆・レシピ・水に依存するため断定はできませんが、レビュー記事やフォーラムで<strong>繰り返し語られやすい軸</strong>
            は次のとおりです。
          </p>
          <ul>
            <li>
              <strong>均一さ・甘みの立ち上がり</strong> — 粒子の揃いとカップのバランスを称する声が多いモデルがあります。
            </li>
            <li>
              <strong>エスプレッソ極細</strong> — 可能でも時間と習熟が要る、という声と、十分実用的という声が併存しがちです。手挽きの目盛りが細かい側まで公式に示されているかの見方は
              <Link href="/articles/hand-mill-espresso-moka/" className="mx-1 font-medium text-[var(--accent)] underline underline-offset-4">
                エスプレッソ・モカポット向け手挽きミルの選び方
              </Link>
              に分けています。
            </li>
            <li>
              <strong>コストと満足度</strong> — 初回投資が高くても長期利用で納得、という意見と、まず中価格帯から、という意見が対立しやすいです。
            </li>
          </ul>
        </MdSection>

        <MdSection title="よく挙がる長所（機種別）">
          <ul>
            {models.map((m) => (
              <li key={m.id}>
                <strong>{m.shortLabel}</strong>
                <ul className="mt-1 list-[circle] pl-4">
                  {m.cuppingNotes.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </MdSection>

        <MdSection title="留意点と口コミで繰り返される論点">
          <ul>
            {models.map((m) => (
              <li key={m.id}>
                <strong>{m.shortLabel}</strong>
                <ul className="mt-1 list-[circle] pl-4">
                  {m.caveats.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p>
            粉と油分の手入れの整理は
            <Link href="/articles/coffee-mill-cleaning/" className="mx-1 font-medium text-[var(--accent)] underline underline-offset-4">
              コーヒーミルの掃除・お手入れ方法
            </Link>
            です。このページでは掃除の実測は書いていません。
          </p>
          <p className="pt-2 text-[14px] font-medium text-stone-800">ブランド別・口コミテーマ要約</p>
          <ul className="text-[14px]">
            {brands.map((b) => (
              <li key={b.slug} className="mb-4">
                <strong>{b.nameJa}</strong>
                <ul className="mt-1 space-y-2 pl-4">
                  {b.communityReviews.map((r) => (
                    <li key={r.id}>
                      <span className="text-stone-800">「{r.theme}」</span> — {r.summary}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </MdSection>

        <MdSection title="スペック早見（全項目）">
          <div className="overflow-x-auto rounded-md border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
            <table className="w-full min-w-[640px] border-collapse text-left text-[12px] sm:text-[13px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-stone-50/80 text-stone-500">
                  <th className="sticky left-0 z-10 bg-stone-50/95 px-3 py-2.5 font-medium backdrop-blur-sm">
                    項目
                  </th>
                  {models.map((m) => (
                    <th key={m.id} className="min-w-[7.5rem] px-2 py-2.5 font-medium text-stone-800">
                      {m.shortLabel}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.key} className="border-b border-[var(--border-subtle)] last:border-0">
                    <th className="sticky left-0 z-10 bg-[var(--surface-elevated)] px-3 py-2.5 font-medium text-stone-700 shadow-[1px_0_0_0_var(--border-subtle)]">
                      {row.label}
                    </th>
                    {models.map((m) => (
                      <td key={m.id} className="px-2 py-2.5 text-stone-600">
                        {row.get(m)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MdSection>
      </article>

      <p className="mx-auto mt-14 flex max-w-3xl flex-wrap justify-center gap-x-8 gap-y-3 text-center lg:max-w-[42rem]">
        <Link href="/beans" className="text-link">
          挽いたあとの豆の店
        </Link>
        <Link href="/" className="text-link">
          ホームへ戻る
        </Link>
      </p>
    </main>
  );
}
