import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { formatJaDate, siteConfig } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "プライバシーポリシー",
  description: "おうちカフェ道具帳における、取得する情報、Cookie、アフィリエイトリンク、アクセス解析の扱い。",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <main className="page-wrap page-narrow">
      <Breadcrumb items={[{ href: "/", label: "ホーム" }, { label: "プライバシーポリシー" }]} />
      <h1 className="page-title">プライバシーポリシー</h1>
      <p className="mt-3 text-sm text-stone-500">最終更新：{formatJaDate(siteConfig.legalUpdated)}</p>
      <div className="article-body mt-8">
        <h2>はじめに</h2>
        <p>
          {siteConfig.name}（以下、当サイト）は、{siteConfig.operatorName}が個人で運営しています。このページは、当サイトがどのような情報を扱うかを説明するものです。
        </p>
        <h2>当サイトが自ら集める情報</h2>
        <p>
          会員登録、問い合わせフォーム、コメント欄はありません。当サイトのページを見るだけでは、名前やメールアドレスをこちらから預かることはありません。メールで連絡をいただいた場合は、返信に必要な範囲で、そのメールの内容を保持します。
        </p>
        <h2>アクセス解析</h2>
        <p>
          現時点では、アクセス解析ツールを入れていません。あとから入れる場合は、このページを更新し、何を測るのかを書きます。
        </p>
        <h2>Cookie とアフィリエイト</h2>
        <p>
          当サイト自身は、広告配信用の Cookie を発行していません。楽天市場、Amazon、Yahoo!ショッピング、もしもアフィリエイトなどの購入リンクを踏むと、リンク先の事業者が Cookie 等で流入元を記録することがあります。その扱いは各事業者の方針に従います。リンクの有無と広告である旨は、
          <Link href="/disclosure">広告表記</Link>
          に書いています。
        </p>
        <h2>外部サイト</h2>
        <p>
          Essence Go の商品画像は、楽天アフィリエイトの商品画像です。栗子 S5 Pro と、ほかの手挽きの実機写真は載せていません。トップの雰囲気写真は特定の店や機種の実物ではありません。外部サイトへ移動したあとの情報の扱いは、当サイトの管理外です。
        </p>
        <h2>掲載情報の限度</h2>
        <p>
          スペックと価格は目安です。メーカーの改定、為替、店舗の在庫で、ページの数字と違うことがあります。購入の前に、販売ページの表示を確認してください。
        </p>
        <h2>改定</h2>
        <p>運営の仕方を変えたときは、このページの文と更新日を直します。</p>
        <h2>連絡先</h2>
        <p>
          <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          {siteConfig.contactEmailIsPlaceholder ? "（見本のアドレスです。公開前に差し替えてください）" : null}
        </p>
      </div>
    </main>
  );
}
