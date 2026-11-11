import type { GrinderModel } from "@/data/grinders";
import { shopeeTwAffiliateUrl } from "@/config/shopee-tw";
import { englishHandGrinderAmazonUrl } from "@/config/us-amazon";
import { cardDict, type SiteLocale } from "@/lib/i18n";
import { affiliateRel, isHttpUrl, prepareAffiliateHtml } from "@/lib/affiliate";

/** 海外向けの Amazon タグがリポジトリに無い言語。日本タグのボタンは出さない。 */
const localesWithoutOverseasAmazon = new Set<SiteLocale>(["en", "zh-tw"]);

export type BuyLink = {
  href?: string;
  label: string;
};

type Props = {
  name: string;
  links: BuyLink[];
  html?: string;
  note?: string;
  locale?: SiteLocale;
  primaryHref?: string;
};

export function grinderBuyProps(model: Pick<GrinderModel, "id" | "type" | "name" | "rakutenUrl" | "amazonUrl" | "yahooUrl" | "shopeeMyUrl" | "moshimoHtml" | "purchaseNote" | "ownerUse">, locale: SiteLocale = "ja", noteLocalized = false): Props {
  const d = cardDict[locale];
  const amazonCom = locale === "en" ? englishHandGrinderAmazonUrl(model) : undefined;
  return {
    name: model.name,
    html: model.moshimoHtml,
    // 翻訳ページでは、翻訳済みの purchaseNote があるときだけ出す
    note: locale === "ja" || noteLocalized ? model.purchaseNote : undefined,
    locale,
    primaryHref: locale === "ja" && model.ownerUse ? model.amazonUrl : undefined,
    links: [
      { href: model.rakutenUrl, label: d.rakuten },
      { href: localesWithoutOverseasAmazon.has(locale) ? undefined : model.amazonUrl, label: locale === "ja" && model.ownerUse ? d.amazonStock ?? d.amazon : d.amazon },
      { href: amazonCom, label: d.amazonCom ?? "Check price on Amazon.com" },
      { href: model.yahooUrl, label: d.yahoo },
      { href: model.shopeeMyUrl, label: d.shopeeMy },
      { href: locale === "zh-tw" ? shopeeTwAffiliateUrl(model.id) : undefined, label: d.shopeeTw ?? "在 Shopee（台灣）查看" },
    ],
  };
}

export function BuyButtons({ name, links, html, note, locale = "ja", primaryHref }: Props) {
  const d = cardDict[locale];
  const visible = links.flatMap((link) => {
    const href = link.href?.trim();
    if (!isHttpUrl(href)) return [];
    return [{ href, label: link.label }];
  });
  const snippet = html?.trim() ?? "";
  if (visible.length === 0 && snippet === "") return null;
  const primary = locale === "ja" ? visible.find((link) => link.href === primaryHref?.trim()) : undefined;
  const ordered = primary ? [primary, ...visible.filter((link) => link !== primary)] : visible;

  return (
    <div className={`buy-stack${primary ? " buy-stack-primary" : ""}`}>
      <p className="buy-note">{d.buyNote}</p>
      {note ? <p className="fine buy-choice">{note}</p> : null}
      {ordered.map((link) => (
        <a key={link.label} className={`buy-link${primary && link !== primary ? " buy-link-secondary" : ""}`} href={link.href} target="_blank" rel={affiliateRel}>
          {primary ? <span>{link.label}</span> : link.label}
          <small>{primary ? `（${d.ad}）` : d.ad}</small>
          <span className="sr-only">（{name}{`・${d.external}）`}</span>
        </a>
      ))}
      {primary ? <p className="fine buy-confirm">在庫・値段・配送予定は、各ショップで確認してください。</p> : null}
      {snippet ? <div className="affiliate-html" dangerouslySetInnerHTML={{ __html: prepareAffiliateHtml(snippet) }} /> : null}
    </div>
  );
}
