import { shopBuyProps } from "@/components/BeanViews";
import { grinderBuyProps, type BuyLink } from "@/components/BuyButtons";
import { getBeanShop } from "@/data/beans";
import { getModel } from "@/data/grinders";
import { localizeModel } from "@/data/grinders-i18n";
import { isHttpUrl } from "@/lib/affiliate";
import { cardDict, type SiteLocale } from "@/lib/i18n";

export type ArticlePick = {
  key: string;
  name: string;
  line: number;
  source: "embed" | "link";
  links: BuyLink[];
  note?: string;
};

const PRODUCT_TOKEN =
  /S5|Essence|V60|HARIO|ハリオ|カリタ|Kalita|Timemore|TIMEMORE|タイムモア|エペイオス|EPEIOS|栗子|Chestnut|デロンギ|ネスプレッソ|ヴァーチュオ|エアロチーノ|マグニフィカ|デディカ|Audible|KINTO|丸山|Fellow|Atmos|Stagg|BALMUDA|ORIGAMI|Chemex|AeroPress|Vertuo|Dedica|Magnifica|Aeroccino|ブラックミラー|Black Mirror|ピーラー|シーチキン|iwaki|貝印|ブルーボトル/i;

const EMBED_RULES: [RegExp, string][] = [
  [/S5|Chestnut|栗子|タイムモア|Timemore|TIMEMORE|泰摩/i, "timemore-chestnut-s5-pro"],
  [/Essence\s*Go|エペイオス|EPEIOS|Epeios/i, "epeios-essence-go"],
  [/きゃろっと|Coffee\s*Carrot|coffeecarrot/i, "coffee-carrot"],
  [/LEO\s*SPECIALTY/i, "leo-specialty-coffee"],
  [/土居珈琲/i, "doi-coffee"],
  [/ラボカフェ/i, "lab-cafe"],
  [/澤井珈琲/i, "sawai-coffee"],
];

type RawLink = {
  line: number;
  key: string;
  href: string;
  label: string;
  h2: string;
  h3: string;
  image: boolean;
};

function asinOf(href: string | undefined): string | undefined {
  if (!href) return undefined;
  const match = href.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
  return match?.[1]?.toUpperCase();
}

function isAffiliateHref(href: string): boolean {
  return /(?:^https?:\/\/)(?:www\.)?(?:amazon\.co\.jp|amzn\.to|amzn\.asia)\b|afl\.rakuten\.co\.jp|px\.a8\.net|invl\.me|moshimo\.com|valuecommerce\.com/i.test(href);
}

function affiliateKey(href: string): string {
  const asin = asinOf(href);
  if (asin) return `dp:${asin}`;
  try {
    const url = new URL(href);
    if (/amazon\.co\.jp$/i.test(url.hostname) && url.pathname.startsWith("/s")) {
      return `s:${url.searchParams.get("k") || url.search}`;
    }
    if (/amazon\.co\.jp$/i.test(url.hostname) && url.pathname.startsWith("/b")) {
      return `b:${url.searchParams.get("node") || url.search}`;
    }
  } catch {
    return href;
  }
  return href;
}

function isCitationLabel(label: string): boolean {
  if (/未照合/.test(label)) return false;
  return /照合|出典|表示を確認|ASIN\s*[A-Z0-9]{10}/i.test(label);
}

function isGenericLabel(label: string): boolean {
  const text = label.replace(/（広告）|\(広告\)/g, "").trim();
  return /^Amazonで(価格|商品名|料金)/.test(text);
}

function isRedundantMillBrowse(label: string): boolean {
  const name = cleanPickName(label);
  return name === "手挽きコーヒーミル" || name === "電動コーヒーミル" || name === "manual coffee grinders" || name === "electric burr grinders";
}

function productHeading(text: string): string {
  if (!text || /口コミ|出典|仕様|選定根拠|比較表/.test(text)) return "";
  const parts = text.split(/：|:/);
  if (parts.length > 1 && parts[0].trim().length <= 8) {
    const rest = parts.slice(1).join("：").split(/：|:/)[0]?.trim();
    return rest || parts[0].trim();
  }
  return parts[0].trim();
}

export function cleanPickName(label: string): string {
  let text = label.replace(/（広告）|\(広告\)/g, "").trim();
  text = text.replace(/\s*を\s*Amazon(?:\.co\.jp)?\s*で[\s\S]*$/u, "");
  text = text.replace(/^在\s*Amazon\.co\.jp\s*(?:查看|搜尋)\s*/u, "");
  text = text.replace(/^Amazon\.co\.jp에서\s*/u, "");
  text = text.replace(/\s*보기\s*$/u, "");
  text = text.replace(/^Browse\s+/i, "");
  text = text.replace(/^Search for the\s+/i, "");
  text = text.replace(/\s+on Amazon\.co\.jp\s*$/i, "");
  return text.trim();
}

function displayName(h3: string, h2: string, label: string): string {
  const cleaned = cleanPickName(label);
  const fromH3 = productHeading(h3);
  const fromH2 = productHeading(h2);
  if (isGenericLabel(label)) return fromH3 || fromH2 || cleaned || label;
  if (/探す|Browse|Search|搜尋/.test(label)) return cleaned || fromH3 || fromH2 || label;
  if (fromH3) return fromH3;
  if (fromH2 && cleaned && fromH2.includes(cleaned)) return fromH2;
  return cleaned || fromH2 || label;
}

function searchAction(locale: SiteLocale): string {
  if (locale === "en") return "Browse on Amazon.co.jp";
  if (locale === "ko") return "Amazon.co.jp에서 찾기";
  if (locale === "zh-tw" || locale === "zh-hk") return "在 Amazon.co.jp 搜尋";
  return "Amazonで探す";
}

function shopAction(locale: SiteLocale): string {
  if (locale === "en") return "View shop";
  if (locale === "ko") return "쇼핑몰에서 보기";
  if (locale === "zh-tw" || locale === "zh-hk") return "前往商店查看";
  return "ショップで見る";
}

function actionLabel(href: string, label: string, locale: SiteLocale): string {
  if (/未照合/.test(label)) return "Amazonで商品名を検索";
  if (/料金|利用条件/.test(label)) return "Amazonで料金・利用条件を確認";
  if (/px\.a8\.net/i.test(href)) return shopAction(locale);
  if (/afl\.rakuten\.co\.jp|rakuten\.co\.jp/i.test(href)) return cardDict[locale].rakuten;
  if (/invl\.me/i.test(href)) return cardDict[locale].shopeeMy;
  if (/amazon\.co\.jp\/(?:s\?|b\/)/i.test(href)) return searchAction(locale);
  return cardDict[locale].amazon;
}

function httpLinks(links: BuyLink[]): BuyLink[] {
  return links.flatMap((link) => {
    const href = link.href?.trim();
    if (!isHttpUrl(href)) return [];
    return [{ href, label: link.label }];
  });
}

function embedUrls(id: string): string[] {
  const model = getModel(id);
  if (model) return [model.amazonUrl, model.rakutenUrl, model.shopeeMyUrl, model.yahooUrl].filter((url): url is string => Boolean(url));
  const shop = getBeanShop(id);
  if (shop) return [shop.a8Url, shop.rakutenUrl, shop.amazonUrl].filter((url): url is string => Boolean(url));
  return [];
}

function resolveEmbed(label: string, href: string, embedIds: string[]): string | undefined {
  const asin = asinOf(href);
  if (asin) {
    for (const id of embedIds) {
      if (embedUrls(id).some((url) => asinOf(url) === asin)) return id;
    }
  }
  let blob = `${label} ${href}`;
  try {
    blob = `${label} ${decodeURIComponent(href)}`;
  } catch {
    blob = `${label} ${href}`;
  }
  for (const [pattern, id] of EMBED_RULES) {
    if (embedIds.includes(id) && pattern.test(blob)) return id;
  }
  return undefined;
}

function embedPick(id: string, line: number, locale: SiteLocale): ArticlePick | undefined {
  const model = getModel(id);
  if (model) {
    const localized = localizeModel(model, locale);
    const props = grinderBuyProps(localized, locale, localized.localized);
    const links = httpLinks(props.links);
    if (links.length === 0 && !props.html?.trim()) return undefined;
    return { key: `embed:${id}`, name: localized.name, line, source: "embed", links, note: props.note };
  }
  const shop = getBeanShop(id);
  if (!shop) return undefined;
  const props = shopBuyProps(shop);
  const links = httpLinks(props.links);
  if (links.length === 0) return undefined;
  return { key: `embed:${id}`, name: shop.name, line, source: "embed", links };
}

export function isHighIntentTitle(title: string): boolean {
  return /選び方|おすすめ|比較|どっち|ランキング|そろえ方|一段上げ|予算別|ギフト|定期便|通販|頼みたい|How to Choose|Which|\bvs\b|推薦|추천|升級|選ぶ|比べ|挑/.test(title);
}

function collect(markdown: string): { links: RawLink[]; embeds: { id: string; line: number }[] } {
  const links: RawLink[] = [];
  const embeds: { id: string; line: number }[] = [];
  let h2 = "";
  let h3 = "";
  let section = "";
  const lines = markdown.split("\n");

  lines.forEach((line, index) => {
    const lineNo = index + 1;
    const heading = /^(#{2,6})\s+(.+)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2].trim();
      if (level === 2) {
        h2 = text;
        h3 = "";
      } else if (level === 3) {
        h3 = text;
      }
      section = text;
      return;
    }
    if (/出典|あわせて読みたい|其他文章|More articles/.test(section)) return;

    const embed = /\{\{(?:grinder|bean):([a-z0-9-]+)\}\}/.exec(line);
    if (embed?.[1]) embeds.push({ id: embed[1], line: lineNo });

    const wrapped = /\[!\[([^\]]*)\]\([^)]+\)\]\((https?:\/\/[^)\s]+)\)/g;
    for (const match of line.matchAll(wrapped)) {
      const href = match[2];
      if (!href || !isAffiliateHref(href)) continue;
      const label = match[1] || "";
      if (isCitationLabel(label)) continue;
      links.push({
        line: lineNo,
        key: affiliateKey(href),
        href,
        label,
        h2,
        h3,
        image: true,
      });
    }

    const plain = /(?<!!)\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
    for (const match of line.matchAll(plain)) {
      const href = match[2];
      if (!href || !isAffiliateHref(href)) continue;
      const label = match[1];
      if (label.startsWith("!")) continue;
      if (isCitationLabel(label)) continue;
      links.push({
        line: lineNo,
        key: affiliateKey(href),
        href,
        label,
        h2,
        h3,
        image: false,
      });
    }
  });

  return { links, embeds };
}

function preferTextLinks(links: RawLink[]): RawLink[] {
  const byKey = new Map<string, RawLink>();
  for (const link of links) {
    const current = byKey.get(link.key);
    if (!current || (current.image && !link.image)) byKey.set(link.key, link);
  }
  return [...byKey.values()].sort((a, b) => a.line - b.line);
}

export function buildArticlePicks(markdown: string, title: string, locale: SiteLocale = "ja"): ArticlePick[] {
  const highIntent = isHighIntentTitle(title);
  const { links, embeds } = collect(markdown);
  const embedIds = embeds.map((embed) => embed.id);
  const hasMillEmbed = embedIds.some((id) => id === "timemore-chestnut-s5-pro" || id === "epeios-essence-go");
  const deduped = preferTextLinks(links).filter((link) => !(hasMillEmbed && isRedundantMillBrowse(link.label)));
  const kept = deduped;
  const embedLine = new Map(embeds.map((embed) => [embed.id, embed.line]));
  const used = new Set<string>();
  const picks: ArticlePick[] = [];

  for (const link of kept) {
    const embedId = resolveEmbed(link.label, link.href, embedIds);
    if (embedId) {
      if (used.has(embedId)) continue;
      used.add(embedId);
      const line = Math.min(embedLine.get(embedId) ?? link.line, link.line);
      const pick = embedPick(embedId, line, locale);
      if (pick) picks.push(pick);
      continue;
    }
    const linksForPick = httpLinks([{ href: link.href, label: actionLabel(link.href, link.label, locale) }]);
    if (linksForPick.length === 0) continue;
    picks.push({
      key: link.key,
      name: displayName(link.h3, link.h2, link.label),
      line: link.line,
      source: "link",
      links: linksForPick,
      note: /未照合/.test(link.label) ? "販売単位は未照合です。ページの表示を確認してください。" : undefined,
    });
  }

  if (highIntent || kept.length === 0) {
    for (const embed of embeds) {
      if (used.has(embed.id)) continue;
      used.add(embed.id);
      const pick = embedPick(embed.id, embed.line, locale);
      if (pick) picks.push(pick);
    }
  }

  const ordered = picks.sort((a, b) => a.line - b.line);
  const specific = ordered.filter((pick) => !isCategorySearchPick(pick));
  if (specific.length >= 4) return specific.slice(0, 8);
  return ordered.slice(0, 8);
}

function isCategorySearchPick(pick: ArticlePick): boolean {
  if (pick.source !== "link") return false;
  const href = pick.links[0]?.href ?? "";
  if (!/amazon\.co\.jp\/s\?/i.test(href)) return false;
  if (pick.note?.includes("未照合")) return false;
  return !PRODUCT_TOKEN.test(pick.name);
}

export function shouldShowArticlePicks(title: string, kind: "article" | "kitchen", picks: ArticlePick[]): boolean {
  if (picks.length === 0) return false;
  if (kind === "kitchen") return true;
  const onlyEarlyEmbed = picks.every((pick) => pick.source === "embed" && pick.line <= 16);
  if (onlyEarlyEmbed) return false;
  if (isHighIntentTitle(title)) return true;
  const first = Math.min(...picks.map((pick) => pick.line));
  return first >= 18;
}
