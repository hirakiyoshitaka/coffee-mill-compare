import Link from "next/link";
import { LocaleIndex, localeIndexMetadata } from "@/components/intl/LocaleIndex";
import { BuyButtons } from "@/components/BuyButtons";
import { amazonComProductUrl, amazonComSearchUrl, usAmazonAssociateTag } from "@/config/us-amazon";

export const metadata = localeIndexMetadata("en");

const s3Href = amazonComProductUrl(usAmazonAssociateTag, "B0CMZCK9PR");
const c40Href = amazonComSearchUrl(usAmazonAssociateTag, "Comandante C40 MK4 Nitro Blade");

const featured = (
  <section aria-label="Start here" className="mt-8 border border-[var(--line)] bg-[var(--soft)] px-5 py-4">
    <h2 className="font-serif text-xl text-[var(--ink)]">Start here</h2>
    <p className="mt-3 text-base leading-relaxed">
      <Link href="/en/articles/amazon-black-friday-2026-coffee-gear/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        Amazon Black Friday 2026: coffee gear to decide before the sale
      </Link>
    </p>
    <p className="mt-2 text-base leading-relaxed">
      <Link href="/en/articles/gifts-for-home-coffee-lovers-2026/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        Gifts for home coffee lovers 2026: under $50, under $150, and splurge picks
      </Link>
    </p>
    <p className="mt-4 text-base leading-relaxed text-stone-600">
      The hand grinder I use is the{" "}
      <Link href="/en/articles/timemore-chestnut-s3/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        Timemore Chestnut S3
      </Link>{" "}
      — about 30g at a time, for 2–3 cups. The Comandante C40 MK4 is
      the German Nitro Blade grinder we compare it with; we have not used the C40.
    </p>
    <p className="mt-3 text-base leading-relaxed">
      <Link href="/en/articles/comandante-c40-vs-timemore/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        Comandante C40 vs Timemore: counting clicks or an external dial
      </Link>
    </p>
    {s3Href ? (
      <BuyButtons name="Timemore Chestnut S3" locale="en" links={[{ href: s3Href, label: "See the Chestnut S3 on Amazon.com" }]} />
    ) : null}
    {c40Href ? (
      <BuyButtons name="Comandante C40 MK4" locale="en" links={[{ href: c40Href, label: "Search the Comandante C40 MK4 on Amazon.com" }]} />
    ) : null}
    <p className="mt-3 text-base leading-relaxed">
      New to pour-over? Start with the{" "}
      <Link href="/en/articles/beginner-hand-drip-recipe/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        beginner pour-over recipe (Hario V60)
      </Link>
      . The three Hario pieces to start with — paper, scale, and kettle — are in the{" "}
      <Link href="/en/articles/hario-v60-pour-over-starter/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        Hario V60 pour-over starter
      </Link>
      . Choosing a kettle first? The{" "}
      <Link href="/en/articles/gooseneck-kettle-guide/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        gooseneck kettle guide
      </Link>{" "}
      covers spout, temperature control, and size. For cold coffee, the{" "}
      <Link href="/en/articles/cold-brew-makers-guide/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        cold brew makers guide
      </Link>{" "}
      covers immersion pitchers, capacity, and filters. Choosing a grinder first? The{" "}
      <Link href="/en/articles/burr-grinders-under-200/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        burr grinders under $200
      </Link>{" "}
      list covers five grinders, from hand grinders to electric ones. For immersion brewing, the{" "}
      <Link href="/en/articles/french-press-vs-aeropress/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        French press vs AeroPress
      </Link>{" "}
      guide compares the two brewers, from body to cleanup. For stovetop espresso-style coffee, the{" "}
      <Link href="/en/articles/moka-pot-guide/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        moka pot guide
      </Link>{" "}
      covers size, heat source, and the three Bialetti lines. For milk drinks, the{" "}
      <Link href="/en/articles/milk-frother-guide/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        milk frother guide
      </Link>{" "}
      covers jug and handheld frothers. For pour-over, the{" "}
      <Link href="/en/articles/pour-over-dripper-guide/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        pour-over dripper guide
      </Link>{" "}
      covers cone, trapezoid, and flat-bottom shapes.
    </p>
    <p className="mt-3 text-base leading-relaxed">
      Still deciding? The{" "}
      <Link href="/en/articles/coffee-grind-size-guide/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        grind size guide
      </Link>{" "}
      gives a starting chart for espresso, moka pot, pour-over, French press, and cold brew.
      Choosing between the two hand grinders I use? The{" "}
      <Link href="/en/articles/timemore-chestnut-s3-vs-epeios-essence-go/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        S3 vs Essence Go
      </Link>{" "}
      comparison puts them side by side. Buying your first hand grinder?{" "}
      <Link href="/en/articles/how-to-choose-hand-coffee-mill/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        How to choose your first hand coffee grinder
      </Link>{" "}
      narrows it to four things that matter, and{" "}
      <Link href="/en/articles/hand-vs-electric-coffee-mill/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        hand vs electric
      </Link>{" "}
      compares effort, noise, and portability. A scale keeps the dose steady — the{" "}
      <Link href="/en/articles/coffee-scale-guide/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        coffee scale guide
      </Link>{" "}
      covers timer, 0.1g accuracy, and water resistance — and the{" "}
      <Link href="/en/articles/electric-coffee-grinder-guide/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        electric grinder guide
      </Link>{" "}
      covers flat burr, conical burr, and blade. Looking for a gift?{" "}
      <Link href="/en/articles/coffee-gifts-under-50/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        Coffee gifts under $50
      </Link>{" "}
      lists seven picks,{" "}
      <Link href="/en/articles/coffee-gifts-under-25/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        coffee gifts under $25
      </Link>{" "}
      lists five small pieces, and{" "}
      <Link href="/en/articles/coffee-gifts-under-100/" className="text-[var(--accent)] underline-offset-4 hover:underline">
        coffee gifts under $100
      </Link>{" "}
      picks five things, each under $100.
    </p>
  </section>
);

export default function Page() {
  return <LocaleIndex locale="en" top={featured} />;
}
