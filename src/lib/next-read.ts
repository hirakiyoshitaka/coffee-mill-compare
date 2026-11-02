import { getLocalizedArticles, type ArticleMeta, type TranslationLocale } from "@/lib/articles";

/**
 * Curated next reads for the pages that currently get the most traffic.
 * Every slug is checked against articles that exist in that locale.
 */
const NEXT_READS: Record<string, readonly string[]> = {
  "zh-tw/french-press-guide": [
    "moka-pot-guide",
    "coffee-server-guide",
    "japanese-premium-coffee-makers",
    "1zpresso-hand-grinder-lineup",
    "breville-vs-delonghi-all-in-one-espresso",
    "home-latte-espresso-machines",
  ],
  "zh-tw/1zpresso-hand-grinder-lineup": [
    "timemore-chestnut-s5-pro",
    "epeios-essence-go",
    "french-press-guide",
    "moka-pot-guide",
    "coffee-server-guide",
    "japanese-premium-coffee-makers",
  ],
  "zh-tw/coffee-server-guide": [
    "hand-drip-upgrade-gear",
    "french-press-guide",
    "1zpresso-hand-grinder-lineup",
    "japanese-premium-coffee-makers",
    "moka-pot-guide",
    "cold-brew-outdoor-coffee",
  ],
  "zh-tw/moka-pot-guide": [
    "french-press-guide",
    "breville-vs-delonghi-all-in-one-espresso",
    "home-latte-espresso-machines",
    "1zpresso-hand-grinder-lineup",
    "japanese-premium-coffee-makers",
    "coffee-server-guide",
  ],
  "zh-tw/breville-vs-delonghi-all-in-one-espresso": [
    "home-latte-espresso-machines",
    "moka-pot-guide",
    "japanese-premium-coffee-makers",
    "1zpresso-hand-grinder-lineup",
    "french-press-guide",
    "timemore-chestnut-s5-pro",
  ],
  "zh-tw/japanese-premium-coffee-makers": [
    "french-press-guide",
    "moka-pot-guide",
    "coffee-server-guide",
    "1zpresso-hand-grinder-lineup",
    "breville-vs-delonghi-all-in-one-espresso",
    "hand-drip-upgrade-gear",
  ],
  "en/1zpresso-hand-grinder-lineup": [
    "timemore-chestnut-s5-pro",
    "epeios-essence-go",
    "timemore-s5-pro-vs-essence-go",
    "japanese-premium-coffee-makers",
    "breville-vs-delonghi-all-in-one-espresso",
    "coffee-grind-size-guide",
  ],
  "en/japanese-premium-coffee-makers": [
    "1zpresso-hand-grinder-lineup",
    "epeios-essence-go",
    "how-to-choose-hand-coffee-mill",
    "breville-vs-delonghi-all-in-one-espresso",
    "coffee-grind-size-guide",
    "beginner-hand-drip-recipe",
  ],
  "en/epeios-essence-go": [
    "timemore-s5-pro-vs-essence-go",
    "timemore-chestnut-s5-pro",
    "1zpresso-hand-grinder-lineup",
    "how-to-choose-hand-coffee-mill",
    "japanese-premium-coffee-makers",
    "coffee-grind-size-guide",
  ],
};

const HUB_SLUGS = [
  "best-3-golf-laser-rangefinders",
  "best-3-folding-standing-desks",
  "best-3-premium-drip-kettles",
  "best-3-premium-coffee-machines",
  "best-3-japanese-kitchen-knives",
] as const;

function hubReads(slug: string): string[] {
  if (!HUB_SLUGS.includes(slug as (typeof HUB_SLUGS)[number])) return [];
  const siblings = HUB_SLUGS.filter((item) => item !== slug);
  if (slug === "best-3-premium-drip-kettles") return [...siblings, "drip-kettle-guide", "hand-drip-upgrade-gear"];
  if (slug === "best-3-premium-coffee-machines") {
    return [...siblings, "japanese-premium-coffee-makers", "home-latte-espresso-machines", "breville-vs-delonghi-all-in-one-espresso", "coffee-maker-guide"];
  }
  return [...siblings];
}

export function getNextReads(locale: TranslationLocale, slug: string): ArticleMeta[] {
  const slugs = NEXT_READS[`${locale}/${slug}`] ?? hubReads(slug);
  if (!slugs.length) return [];
  const bySlug = new Map(getLocalizedArticles(locale).map((article) => [article.slug, article]));
  return slugs.flatMap((nextSlug) => {
    if (nextSlug === slug) return [];
    const article = bySlug.get(nextSlug);
    return article ? [article] : [];
  });
}
