import Image from "next/image";
import Link from "next/link";
import { BuyButtons } from "@/components/BuyButtons";
import { StickyBuyBar } from "@/components/StickyBuyBar";
import { amazonComProductUrl, amazonComSearchUrl, usAmazonAssociateTag } from "@/config/us-amazon";
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

const K_ULTRA_QUERY = "1Zpresso K-Ultra"; // 記事内の既存リンク（タグは既存の ouchidougub03-20）。商品ページは未確認のため検索リンク

// 読まれている3記事の先頭に出す「3つの枠」。役割の印（Best overall／Budget pick／Upgrade pick）＋
// 商品名＋一言。Amazon.com の商品ページは、型番一致を Amazon 以外の出典で確かめた S3 だけ。
// 確かめていない物は検索リンクにする（asin ではなく query を入れる）。S5 Pro は入れない。
type TrioPick = {
  role: string;
  name: string;
  line: string;
  asin?: string;
  query?: string;
  buyLabel?: string;
  articleHref?: string;
  articleLabel?: string;
};

const trios: Record<string, TrioPick[] | undefined> = {
  "beginner-hand-drip-recipe": [
    { role: "Best overall", name: "Timemore Chestnut S3", line: "The grinder I use — about 30g at a time, for 2–3 cups.", asin: "B0CMZCK9PR", buyLabel: "See the Chestnut S3 on Amazon.com" },
    { role: "Budget pick", name: "Hario V60 dripper 01 (VD-01T)", line: "The brewer this recipe is written for, and the lowest-cost piece of the kit.", query: "Hario V60 coffee dripper 01 clear", buyLabel: "Search the V60 dripper on Amazon.com" },
    { role: "Upgrade pick", name: "Comandante C40 MK4", line: "The German Nitro Blade grinder from our comparison. We have not used it.", query: "Comandante C40 MK4 Nitro Blade", buyLabel: "Search the Comandante C40 MK4 on Amazon.com" },
  ],
  "comandante-c40-vs-timemore": [
    { role: "Best overall", name: "Timemore Chestnut S3", line: "The grinder I use — about 30g at a time, for 2–3 cups.", asin: "B0CMZCK9PR", buyLabel: "See the Chestnut S3 on Amazon.com" },
    { role: "Budget pick", name: "1Zpresso Q2", line: "The entry model in the 1Zpresso lineup we cover.", articleHref: "/en/articles/1zpresso-hand-grinder-lineup/", articleLabel: "See the 1Zpresso lineup" },
    { role: "Upgrade pick", name: "Comandante C40 MK4", line: "The German Nitro Blade grinder this article compares. We have not used it.", query: "Comandante C40 MK4 Nitro Blade", buyLabel: "Search the Comandante C40 MK4 on Amazon.com" },
  ],
  "coffee-grind-size-guide": [
    { role: "Best overall", name: "Timemore Chestnut S3", line: "The grinder I use, with an external dial I can set and return to.", asin: "B0CMZCK9PR", buyLabel: "See the Chestnut S3 on Amazon.com" },
    { role: "Budget pick", name: "1Zpresso Q2", line: "The entry model in the 1Zpresso lineup we cover.", articleHref: "/en/articles/1zpresso-hand-grinder-lineup/", articleLabel: "See the 1Zpresso lineup" },
    { role: "Upgrade pick", name: "Comandante C40 MK4", line: "The German Nitro Blade grinder from our comparison. We have not used it.", query: "Comandante C40 MK4 Nitro Blade", buyLabel: "Search the Comandante C40 MK4 on Amazon.com" },
  ],
};

export function hasEnglishOpening(slug: string): boolean {
  return Object.hasOwn(openings, slug);
}

// 結論枠のない英語記事の固定バー。出すのは記事の主役1台だけ。
// 商品ページ（asin）を優先する。asin は、同じ記事の本文で既に商品ページへ送っている物だけ（S3 の B0CMZCK9PR）。
// 商品ページを確かめていない物は、記事本文で既に使っている amazon.com 検索リンクと同一の検索語にする。
// BF・ギフト・ベスト3・S5 Pro 比較は S3（記事の主役・ふだん使う1台）、Essence Go 記事は Essence Go。
// 1台に決められない記事（エスプレッソマシン2本・はかり・電動ミル・日本製メーカー）は入れない。
type SearchBarPick = {
  name: string;
  query: string;
  asin?: string;
};

const searchBars: Record<string, SearchBarPick | undefined> = {
  "amazon-black-friday-2026-coffee-gear": { name: "Timemore Chestnut S3", query: "TIMEMORE Chestnut S3 coffee grinder", asin: "B0CMZCK9PR" },
  "gifts-for-home-coffee-lovers-2026": { name: "Timemore Chestnut S3", query: "TIMEMORE Chestnut S3 coffee grinder", asin: "B0CMZCK9PR" },
  "luxury-relaxed-coffee-mill-best3": { name: "Timemore Chestnut S3", query: "TIMEMORE Chestnut S3 coffee grinder", asin: "B0CMZCK9PR" },
  "timemore-s5-pro-vs-essence-go": { name: "Timemore Chestnut S3", query: "TIMEMORE Chestnut S3 coffee grinder", asin: "B0CMZCK9PR" },
  "epeios-essence-go": { name: "EPEIOS Essence Go", query: "EPEIOS Essence Go coffee grinder" },
};

export function hasEnglishSearchBar(slug: string): boolean {
  return Object.hasOwn(searchBars, slug);
}

export function EnglishSearchBar({ slug }: { slug: string }) {
  const pick = Object.hasOwn(searchBars, slug) ? searchBars[slug] : undefined;
  if (!pick) return null;
  if (hasEnglishOpening(slug)) return null; // 結論枠がある記事は商品ページ版のバーを使う
  const href = pick.asin
    ? amazonComProductUrl(usAmazonAssociateTag, pick.asin)
    : amazonComSearchUrl(usAmazonAssociateTag, pick.query);
  if (!href) return null;
  return <StickyBuyBar name={pick.name} href={href} locale="en" />;
}

export function EnglishOpening({ slug }: { slug: string }) {
  const opening = Object.hasOwn(openings, slug) ? openings[slug] : undefined;
  if (!opening) return null;

  const trio = Object.hasOwn(trios, slug) ? trios[slug] : undefined;
  if (trio) {
    // 3つの枠の「Best overall」は S3。バーはその1台を指す。
    const s3Href = amazonComProductUrl(usAmazonAssociateTag, "B0CMZCK9PR");
    return (
      <>
        <TrioFrame audience={opening.audience} picks={trio} />
        {s3Href ? <StickyBuyBar name="Timemore Chestnut S3" href={s3Href} locale="en" /> : null}
      </>
    );
  }

  if (opening.kind === "s3") {
    const model = getModel("timemore-chestnut-s3");
    const href = amazonComProductUrl(usAmazonAssociateTag, "B0CMZCK9PR");
    if (!model || !href) return null;
    return (
      <>
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
      <StickyBuyBar name="Timemore Chestnut S3" href={href} locale="en" />
      </>
    );
  }

  const href = amazonComSearchUrl(usAmazonAssociateTag, K_ULTRA_QUERY);
  if (!href) return null;
  return (
    <>
    <Frame
      audience={opening.audience}
      label="Featured in this lineup"
      name="1Zpresso K-Ultra"
      evidence="I have not used this one. Specs in this article come from the manufacturer."
      buyName="1Zpresso K-Ultra"
      links={[{ href, label: "Search the K-Ultra on Amazon.com" }]}
    />
    <StickyBuyBar name="1Zpresso K-Ultra" href={href} locale="en" />
    </>
  );
}

function TrioFrame({ audience, picks }: { audience: string; picks: TrioPick[] }) {
  return (
    <section className={styles.frame} aria-label="Three picks">
      <p className={styles.audience}>{audience}</p>
      <h2 className={styles.label}>Three picks</h2>
      {picks.map((pick) => {
        const href = pick.asin
          ? amazonComProductUrl(usAmazonAssociateTag, pick.asin)
          : pick.query
            ? amazonComSearchUrl(usAmazonAssociateTag, pick.query)
            : undefined;
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
