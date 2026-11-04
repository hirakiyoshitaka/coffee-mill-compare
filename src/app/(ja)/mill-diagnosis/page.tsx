import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { MillDiagnosis } from "@/components/MillDiagnosis";
import { PrNotice } from "@/components/PrNotice";
import { getArticle } from "@/lib/articles";
import { assertMillDiagnosis, diagnosisArticleSlugs, diagnosisProducts, diagnosisRules } from "@/lib/mill-diagnosis";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "ミル選びの診断",
  description:
    "1日の杯数、淹れる場所、予算の感じ、音と置き場所、挽く手間の5問から、手挽きを1台に決めます。計算はこのページの中だけで、売り切れの栗子 S5 Pro は候補に入れていません。",
  path: "/mill-diagnosis",
});

export default function MillDiagnosisPage() {
  assertMillDiagnosis();
  for (const slug of diagnosisArticleSlugs()) {
    if (!getArticle(slug)) {
      throw new Error(`診断の記事 /articles/${slug}/ がありません`);
    }
  }

  return (
    <main className="page-wrap page-narrow">
      <Breadcrumb items={[{ href: "/", label: "ホーム" }, { label: "ミル選びの診断" }]} />
      <h1 className="page-title">ミル選びの診断</h1>
      <p className="lede">
        5問に答えると、手挽きを1台に決めます。計算はこのページの中だけで行い、外部のAIは使いません。同じ回答は、いつも同じ1台です。
      </p>
      <p className="lede">
        ふだん使っている手挽きは、タイムモア栗子 S3 です。1回に挽く豆は30gで、2〜3杯になります。S3 の個別記事と購入リンクは、公開データにまだありません。売り切れの栗子 S5 Pro は、候補から外しています。候補は、公開中の記事と、既にある Amazon リンク（tag=stocknotelife-22）がある手挽きです。
      </p>
      <PrNotice />
      <MillDiagnosis />
      <details className="diagnosis-rules">
        <summary>質問と回答の対応表</summary>
        <p className="fine">
          上から見て、最初に当てはまった行の機種です。あとの行は見ません。円の目安を掲載しているのは Essence Go だけです。1Zpresso とコマンダンテ C40 のボタンは、記事と同じ検索リンクです。
        </p>
        <div className="article-body">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>順</th>
                  <th>当てはまる回答</th>
                  <th>機種</th>
                </tr>
              </thead>
              <tbody>
                {diagnosisRules.map((rule, index) => (
                  <tr key={rule.id}>
                    <td>{index + 1}</td>
                    <td>{rule.when}</td>
                    <td>{diagnosisProducts[rule.productId].name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </details>
      <p className="fine">
        記事の一覧は
        <Link href="/articles/" className="mx-1 text-link">
          読みもの
        </Link>
        にあります。
      </p>
    </main>
  );
}
