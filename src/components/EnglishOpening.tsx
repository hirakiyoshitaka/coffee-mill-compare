import Image from "next/image";
import Link from "next/link";
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

// 読まれている3記事の先頭に出す「3つの枠」。役割の印（Best overall／Budget pick／Upgrade pick）＋
// 商品名＋一言。Amazon.com の ASIN は、型番一致を Amazon 以外の出典で確かめた物だけ。
// ASIN が無い商品は、このサイトの記事へのリンクに留める。S5 Pro は入れない。
type TrioPick = {
  role: string;
  name: string;
  line: string;
  asin?: string;
  buyLabel?: string;
  articleHref?: string;
  articleLabel?: string;
};

const trios: Record<string, TrioPick[] | undefined> = {
  "beginner-hand-drip-recipe": [
    { role: "Best overall", name: "Timemore Chestnut S3", line: "The grinder I use — about 30g at a time, for 2–3 cups.", asin: "B0CMZCK9PR", buyLabel: "See the Chestnut S3 on Amazon.com" },
    { role: "Budget pick", name: "Hario V60 dripper 01 (VD-01T)", line: "The brewer this recipe is written for, and the lowest-cost piece of the kit.", asin: "B001HC9GIC", buyLabel: "See the V60 dripper on Amazon.com" },
    { role: "Upgrade pick", name: "Comandante C40 MK4", line: "The German Nitro Blade grinder from our comparison. We have not used it.", asin: "B07JQ4P976", buyLabel: "See the Comandante C40 MK4 on Amazon.com" },
  ],
  "comandante-c40-vs-timemore": [
    { role: "Best overall", name: "Timemore Chestnut S3", line: "The grinder I use — about 30g at a time, for 2–3 cups.", asin: "B0CMZCK9PR", buyLabel: "See the Chestnut S3 on Amazon.com" },
    { role: "Budget pick", name: "1Zpresso Q2", line: "The entry model in the 1Zpresso lineup we cover.", articleHref: "/en/articles/1zpresso-hand-grinder-lineup/", articleLabel: "See the 1Zpresso lineup" },
    { role: "Upgrade pick", name: "Comandante C40 MK4", line: "The German Nitro Blade grinder this article compares. We have not used it.", asin: "B07JQ4P976", buyLabel: "See the Comandante C40 MK4 on Amazon.com" },
  ],
  "coffee-grind-size-guide": [
    { role: "Best overall", name: "Timemore Chestnut S3", line: "The grinder I use, with an external dial I can set and return to.", asin: "B0CMZCK9PR", buyLabel: "See the Chestnut S3 on Amazon.com" },
    { role: "Budget pick", name: "1Zpresso Q2", line: "The entry model in the 1Zpresso lineup we cover.", articleHref: "/en/articles/1zpresso-hand-grinder-lineup/", articleLabel: "See the 1Zpresso lineup" },
    { role: "Upgrade pick", name: "Comandante C40 MK4", line: "The German Nitro Blade grinder from our comparison. We have not used it.", asin: "B07JQ4P976", buyLabel: "See the Comandante C40 MK4 on Amazon.com" },
  ],
};

export function hasEnglishOpening(slug: string): boolean {
  return Object.hasOwn(openings, slug);
}

export function EnglishOpening({ slug }: { slug: string }) {
  const opening = Object.hasOwn(openings, slug) ? openings[slug] : undefined;
  if (!opening) return null;

  const trio = Object.hasOwn(trios, slug) ? trios[slug] : undefined;
  if (trio) return <TrioFrame audience={opening.audience} picks={trio} />;

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

function TrioFrame({ audience, picks }: { audience: string; picks: TrioPick[] }) {
  return (
    <section className={styles.frame} aria-label="Three picks">
      <p className={styles.audience}>{audience}</p>
      <h2 className={styles.label}>Three picks</h2>
      {picks.map((pick) => {
        const href = pick.asin ? amazonComProductUrl(usAmazonAssociateTag, pick.asin) : undefined;
        return (
          <div key={pick.role} style={{ marginTop: 12 }}>
            <p className={styles.audience}>{pick.role}</p>
            <h3 className={styles.product} style={{ fontSize: "1.05rem" }}>
              {pick.name}
            </h3>
            <p className={styles.evidence}>{pick.line}</p>
            {href && pick.buyLabel ? (
              <BuyButtons name={pick.name} links={[{ href, label: pick.buyLabel }]} locale="en" />
            ) : null}
            {pick.articleHref && pick.articleLabel ? (
              <p style={{ marginTop: 6 }}>
                <Link href={pick.articleHref} className="text-[var(--accent)] underline-offset-4 hover:underline">
                  {pick.articleLabel}
                </Link>
              </p>
            ) : null}
          </div>
        );
      })}
    </section>
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
