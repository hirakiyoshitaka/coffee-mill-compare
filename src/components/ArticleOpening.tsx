import type { ReactNode } from "react";
import Image from "next/image";
import { BuyButtons, grinderBuyProps } from "@/components/BuyButtons";
import { getModel } from "@/data/grinders";
import { StickyBuyBar } from "@/components/StickyBuyBar";
import styles from "./ArticleOpening.module.css";

// 対象8記事の商品・見出しを明示する。本文から商品を推測しない。
// 使用事実は記事本文と既存の商品データに基づく。
// hideConclusion: 2つ目の結論枠を出さない記事（S3記事は1つ目の枠と重なるため）。
// hideOpening: 共通の箱（冒頭の商品枠）自体を出さない記事。記事独自の結論枠が先頭に来る。
const openings: Record<string, { modelId: string; audience: string; learn?: string; label: string; evidence: string; hideConclusion?: boolean; hideOpening?: boolean } | undefined> = {
  "coffee-mill-ranking": {
    modelId: "timemore-chestnut-s3",
    audience: "朝をゆっくり始めたい、手挽き選びに迷う方へ",
    learn: "手挽きのおすすめ順。1位は栗子 S3、2位は Essence Go、3位のコマンダンテ C40 はレビューまとめです",
    label: "迷ったら、この1台",
    evidence: "運営者がふだん使っている1台",
  },
  "timemore-chestnut-s3": {
    modelId: "timemore-chestnut-s3",
    audience: "栗子 S3 の使い方と公式仕様を知りたい方へ",
    learn: "ふだん使っている S3 の使い心地と、公式の仕様（刃・挽き目調整・ベアリング）",
    label: "この記事の結論",
    evidence: "運営者がふだん使っている1台",
    hideConclusion: true,
    hideOpening: true,
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
    learn: "セール前に決めておくこと。買う1台、買うタイミング、値段と在庫の確かめ方",
    label: "迷ったら、この1台",
    evidence: "運営者がふだん使っている1台",
    hideOpening: true,
  },
  "coffee-gift-guide": {
    modelId: "timemore-chestnut-s3",
    audience: "コーヒー好きへの贈り物に迷う方へ",
    learn: "相手が道具を持っているかで分ける、豆・ドリップバッグ・手挽きミルの贈り方",
    label: "迷ったら、この1台",
    evidence: "運営者がふだん使っている1台",
    hideOpening: true,
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
  // スマホの固定バー：主役が S3 か Essence Go で、Amazon のリンクがあるときだけ
  const stickyOk = (model.id === "timemore-chestnut-s3" || model.id === "epeios-essence-go") && (model.amazonUrl ?? "").trim() !== "";
  // 共通の箱を出さない記事：記事独自の結論枠を先頭にし、固定バーだけ残す
  if (opening.hideOpening) {
    return (
      <>
        <div id="article-opening" className={styles.opening}>{children}</div>
        {stickyOk ? <StickyBuyBar targetId="article-opening" name={model.name} href={model.amazonUrl ?? ""} locale="ja" /> : null}
      </>
    );
  }

  return (
    <>
    <section id="article-opening" className={`${styles.opening} ${styles.featured}`} aria-label={opening.label}>
      <div className={styles.verdict}>
        {opening.learn ? <p className={styles.audience}>このページで分かること：{opening.learn}</p> : null}
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
    {stickyOk ? <StickyBuyBar targetId="article-opening" name={model.name} href={model.amazonUrl ?? ""} locale="ja" /> : null}
    </>
  );
}
