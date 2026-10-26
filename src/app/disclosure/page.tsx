import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { formatJaDate, siteConfig } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "広告表記",
  description: "おうちカフェ道具帳のアフィリエイト広告、記事冒頭のPR表示、ランキングと価格の目安の考え方。ステルスマーケティング規制への対応です。",
  path: "/disclosure",
});

export default function DisclosurePage() {
  return (
    <main className="page-wrap page-narrow">
      <Breadcrumb items={[{ href: "/", label: "ホーム" }, { label: "広告表記" }]} />
      <h1 className="page-title">広告表記</h1>
      <p className="mt-3 text-sm text-stone-500">最終更新：{formatJaDate(siteConfig.legalUpdated)}</p>
      <div className="article-body mt-8">
        <h2>広告であることを、先に示します</h2>
        <p>
          当サイトは、商品の購入リンクから報酬を受け取ることがあります。景品表示法上のステルスマーケティング規制に沿い、広告であることを分かりやすく示します。記事ページでは、本文の前に「広告（PR）」と書きます。タイトルの上にも PR と出します。
        </p>
        <h2>どのリンクが広告か</h2>
        <p>
          楽天市場、Amazon、Yahoo!ショッピング、A8.net への購入リンクと、もしもアフィリエイト等の HTML は、アフィリエイト広告です。リンクには <code>rel=&quot;sponsored nofollow&quot;</code> を付けます。Essence Go の写真は、楽天アフィリエイトの商品画像で、画像そのものが同じ購入リンクです。URL も HTML も空の商品には、購入ボタンを出しません。豆の店にある公式サイトや、紹介用の楽天店舗ページは、アフィリエイト用の URL を入れていない限り広告リンクではありません。
        </p>
        <p>参加している、または参加する予定のプログラムは次のとおりです。未設定のプログラムは、ボタンも出ません。</p>
        <ul>
          <li>A8.net</li>
          <li>楽天アフィリエイト</li>
          <li>Amazonアソシエイト</li>
          <li>Yahoo!ショッピング（バリューコマース等を含む場合があります）</li>
          <li>もしもアフィリエイト</li>
        </ul>
        <h2>順位は、報酬では決めません</h2>
        <p>
          記事の並びや「先に見る一台」は、アフィリエイト報酬の高い順ではありません。掲載データにある用途、仕様、価格の目安、コミュニティで繰り返される論点で整理しています。データにない味の点数や、架空の最安値は書きません。
        </p>
        <h2>価格は目安です</h2>
        <p>
          金額は「価格の目安」です。店舗、セール、為替、メーカー改定で変わります。EPEIOS Essence Go の金額は、公式掲載を基準にしたサイト内の固定値です。タイムモア栗子 S5 Pro の金額は、2026年10月26日に公式サイトへ出ていた表示です。どちらも、変わるときはデータを手で更新します。豆の金額は、2026年10月26日時点の紹介に基づく目安です。店のページの表示が優先します。
        </p>
        <h2>口コミの扱い</h2>
        <p>口コミ欄は、特定の投稿や星の転載ではありません。フォーラムやレビューで繰り返される論点を、編集部があらかじめ要約したものです。</p>
        <h2>運営</h2>
        <p>
          {siteConfig.operatorName}。連絡先は
          <Link href="/about">運営者情報</Link>
          にあります。
        </p>
      </div>
    </main>
  );
}
