import type { ReactNode } from "react";
import Image from "next/image";
import { BuyButtons, grinderBuyProps } from "@/components/BuyButtons";
import { getModel } from "@/data/grinders";
import styles from "./ArticleOpening.module.css";

// 対象7記事の商品・見出しを明示する。本文から商品を推測しない。
// 使用事実は記事本文と既存の商品データに基づく。
// hideConclusion: 2つ目の結論枠を出さない記事（S3記事は1つ目の枠と重なるため）。
const openings: Record<string, { modelId: string; audience: string; label: string; evidence: string; hideConclusion?: boolean } | undefined> = {
  "coffee-mill-ranking": {
    modelId: "timemore-chestnut-s3",
    audience: "朝をゆっくり始めたい、手挽き選びに迷う方へ",
    label: "迷ったら、この1台",
    evidence: "運営者がふだん使っている1台",
  },
  "timemore-chestnut-s3": {
    modelId: "timemore-chestnut-s3",
    audience: "栗子 S3 の使い方と公式仕様を知りたい方へ",
    label: "この記事の結論",
    evidence: "運営者がふだん使っている1台",
    hideConclusion: true,
  },
  "epeios-essence-go": {
    modelId: "epeios-essence-go",
    audience: "Essence Go の回し心地と公式仕様を知りたい方へ",
    label: "この記事の結論",
    evidence: "運営者が持っているもう1台",
  },
  "how-to-choose-hand-coffee-mill": {
    modelId: "timemore-chestnut-s3",
    audience: "はじめての手挽きを、家でふだん使いたい方へ",
    label: "迷ったら、この1台",
    evidence: "運営者がふだん使っている1台",
  },
  "timemore-chestnut-s5-pro": {
    modelId: "timemore-chestnut-s3",
    audience: "S5 Pro が売り切れで、代わりを探している方へ",
    label: "売り切れなら、この1台",
    evidence: "運営者がふだん使っている1台",
  },
  "timemore-s5-pro-vs-essence-go": {
    modelId: "timemore-chestnut-s3",
    audience: "2台で迷っている方へ。運営者のふだんの1台はこちら",
    label: "迷ったら、この1台",
    evidence: "運営者がふだん使っている1台",
  },
  "amazon-black-friday-coffee-gear": {
    modelId: "timemore-chestnut-s3",
    audience: "セールの前に、ふだん使う手挽きを選びたい方へ",
    label: "迷ったら、この1台",
    evidence: "運営者がふだん使っている1台",
  },
};

export function ArticleOpening({ slug, children }: {
  slug: string;
  children: ReactNode;
}) {
  const opening = Object.hasOwn(openings, slug) ? openings[slug] : undefined;
  const model = opening ? getModel(opening.modelId) : undefined;
  if (!opening || !model) return <div className={styles.opening}>{children}</div>;

  const buyProps = grinderBuyProps(model);

  return (
    <section className={`${styles.opening} ${styles.featured}`} aria-label={opening.label}>
      <div className={styles.verdict}>
        <p className={styles.audience}>{opening.audience}</p>
        <h2 className={styles.label}>{opening.label}</h2>
        <div className={styles.productRow}>
          {model.imageUrl ? (
            <Image className={styles.photo} src={model.imageUrl} alt={model.imageAlt ?? model.name} width={560} height={1139} loading="eager" />
          ) : null}
          <div>
            <h3 className={styles.product}>{model.name}</h3>
            <p className={styles.evidence}>{opening.evidence}</p>
          </div>
        </div>
        <p className={styles.reason}>{model.highlight}</p>
        <BuyButtons {...buyProps} />
      </div>
      {/* 元の結論を丸ごと表示し、選び方・注意文・購入先を残す。 */}
      {opening.hideConclusion ? null : <div className={styles.conclusion}>{children}</div>}
    </section>
  );
}
