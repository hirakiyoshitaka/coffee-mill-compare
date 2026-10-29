import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { formatJaDate, getSiteUrl, siteConfig } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "運営者情報",
  description: "おうち時間の道具箱の運営形態、連絡先、サイトの目的。個人運営の比較ノートです。",
  path: "/about",
});

export default function AboutPage() {
  const siteUrl = getSiteUrl();
  const usingPlaceholderUrl = siteUrl === "https://example.com";

  return (
    <main className="page-wrap page-narrow">
      <Breadcrumb items={[{ href: "/", label: "ホーム" }, { label: "運営者情報" }]} />
      <h1 className="page-title">運営者情報</h1>
      <p className="mt-3 text-sm text-stone-500">最終更新：{formatJaDate(siteConfig.legalUpdated)}</p>
      <dl className="mt-8 space-y-6 text-sm leading-relaxed text-stone-700">
        <div>
          <dt className="font-medium text-stone-900">サイト名</dt>
          <dd className="mt-1">{siteConfig.name}</dd>
        </div>
        <div>
          <dt className="font-medium text-stone-900">サイトの目的</dt>
          <dd className="mt-1">
            家でコーヒーを淹れる道具を、用途別に比べるためのノートです。掲載している仕様、価格の目安、口コミの傾向は、サイト内のデータに基づきます。販売店の在庫や本日の価格を保証するものではありません。
          </dd>
        </div>
        <div>
          <dt className="font-medium text-stone-900">運営</dt>
          <dd className="mt-1">
            {siteConfig.operatorName}（個人運営）。個人の氏名、住所、電話番号は公開していません。
          </dd>
        </div>
        <div>
          <dt className="font-medium text-stone-900">公開URL</dt>
          <dd className="mt-1">
            {usingPlaceholderUrl ? (
              <>
                まだ本番のURLが設定されていません。公開時に環境変数 <code className="rounded bg-stone-100 px-1">NEXT_PUBLIC_SITE_URL</code>{" "}
                を自分のアドレスへ変えて、再デプロイしてください。
              </>
            ) : (
              siteUrl
            )}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-stone-900">連絡先</dt>
          <dd className="mt-1">
            <a className="text-[var(--accent)] underline underline-offset-4" href={`mailto:${siteConfig.contactEmail}`}>
              {siteConfig.contactEmail}
            </a>
            {siteConfig.contactEmailIsPlaceholder ? (
              <span className="mt-1 block text-stone-500">
                このメールアドレスは見本です。公開前に <code className="rounded bg-stone-100 px-1">src/data/site.ts</code> の contactEmail を、受け取れるアドレスへ変えてください。
              </span>
            ) : null}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-stone-900">広告</dt>
          <dd className="mt-1">
            購入リンクはアフィリエイト広告になることがあります。記事の冒頭に PR の表示を出します。詳しくは
            <Link href="/disclosure" className="mx-1 text-[var(--accent)] underline underline-offset-4">
              広告表記
            </Link>
            を見てください。
          </dd>
        </div>
      </dl>
    </main>
  );
}
