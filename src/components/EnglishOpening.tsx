import Image from "next/image";
import { BuyButtons } from "@/components/BuyButtons";
import { amazonComProductUrl, usAmazonAssociateTag } from "@/config/us-amazon";
import { getModel } from "@/data/grinders";
import styles from "./EnglishOpening.module.css";

// 英語の手挽きミル記事の最初の画面に出す「結論＋購入ボタン」。
// 商品は記事ごとに明示する。使った事実は S3 だけ（K-Ultra は運営者が使っていない）。
type Pick = {
  kind: "s3" | "kultra";
  audience: string;
};

const openings: Record<string, Pick | undefined> = {
  "how-to-choose-hand-coffee-mill": { kind: "s3", audience: "Picking your first hand grinder to keep at home?" },
  "comandante-c40-vs-timemore": { kind: "s3", audience: "Torn between the Comandante C40 and a Timemore?" },
  "timemore-chestnut-s5-pro": { kind: "s3", audience: "Looking at the Chestnut S5 Pro?" },
  "hand-vs-electric-coffee-mill": { kind: "s3", audience: "Not sure whether to go hand or electric?" },
  "coffee-grind-size-guide": { kind: "s3", audience: "Want an adjustable hand grinder for dialing in grind size?" },
  "beginner-hand-drip-recipe": { kind: "s3", audience: "Starting out with hand drip at home?" },
  "1zpresso-hand-grinder-lineup": { kind: "kultra", audience: "Comparing the 1Zpresso lineup?" },
};

const K_ULTRA_ASIN = "B0CC4LXF1Z"; // 記事内の既存リンク（タグは既存の ouchidougub03-20）

export function hasEnglishOpening(slug: string): boolean {
  return Object.hasOwn(openings, slug);
}

export function EnglishOpening({ slug }: { slug: string }) {
  const opening = Object.hasOwn(openings, slug) ? openings[slug] : undefined;
  if (!opening) return null;

  if (opening.kind === "s3") {
    const model = getModel("timemore-chestnut-s3");
    const href = amazonComProductUrl(usAmazonAssociateTag, "B0CMZCK9PR");
    if (!model || !href) return null;
    return (
      <Frame
        audience={opening.audience}
        label="Short answer"
        name="Timemore Chestnut S3"
        evidence="I usually use the Chestnut S3, about 30g at a time for 2–3 cups."
        imageUrl={model.imageUrl}
        imageAlt={model.imageAlt ?? model.name}
        buyName="Timemore Chestnut S3"
        links={[{ href, label: "See the Chestnut S3 on Amazon.com" }]}
      />
    );
  }

  const href = amazonComProductUrl(usAmazonAssociateTag, K_ULTRA_ASIN);
  if (!href) return null;
  return (
    <Frame
      audience={opening.audience}
      label="Featured in this lineup"
      name="1Zpresso K-Ultra"
      evidence="I have not used this one. Specs in this article come from the manufacturer."
      buyName="1Zpresso K-Ultra"
      links={[{ href, label: "See the K-Ultra on Amazon.com" }]}
    />
  );
}

function Frame(props: {
  audience: string;
  label: string;
  name: string;
  evidence: string;
  imageUrl?: string;
  imageAlt?: string;
  buyName: string;
  links: { href: string; label: string }[];
}) {
  return (
    <section className={styles.frame} aria-label={props.label}>
      <p className={styles.audience}>{props.audience}</p>
      <h2 className={styles.label}>{props.label}</h2>
      <div className={styles.row}>
        {props.imageUrl ? (
          <Image className={styles.photo} src={props.imageUrl} alt={props.imageAlt ?? props.name} width={560} height={1139} loading="eager" />
        ) : null}
        <div>
          <h3 className={styles.product}>{props.name}</h3>
          <p className={styles.evidence}>{props.evidence}</p>
        </div>
      </div>
      <BuyButtons name={props.buyName} links={props.links} locale="en" />
    </section>
  );
}
