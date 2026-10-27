import type { GrinderModel } from "@/data/grinders";
import { cardDict, type SiteLocale } from "@/lib/i18n";
import { affiliateRel, isHttpUrl, prepareAffiliateHtml } from "@/lib/affiliate";

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
};

export function grinderBuyProps(model: Pick<GrinderModel, "name" | "rakutenUrl" | "amazonUrl" | "yahooUrl" | "moshimoHtml" | "purchaseNote">, locale: SiteLocale = "ja"): Props {
  const d = cardDict[locale];
  return {
    name: model.name,
    html: model.moshimoHtml,
    // purchaseNote は日本語のみのデータなので、翻訳ページでは出さない
    note: locale === "ja" ? model.purchaseNote : undefined,
    locale,
    links: [
      { href: model.rakutenUrl, label: d.rakuten },
      { href: model.amazonUrl, label: d.amazon },
      { href: model.yahooUrl, label: d.yahoo },
    ],
  };
}

export function BuyButtons({ name, links, html, note, locale = "ja" }: Props) {
  const d = cardDict[locale];
  const visible = links.flatMap((link) => {
    const href = link.href?.trim();
    if (!isHttpUrl(href)) return [];
    return [{ href, label: link.label }];
  });
  const snippet = html?.trim() ?? "";
  if (visible.length === 0 && snippet === "") return null;

  return (
    <div className="buy-stack">
      <p className="buy-note">{d.buyNote}</p>
      {note ? <p className="fine buy-choice">{note}</p> : null}
      {visible.map((link) => (
        <a key={link.label} className="buy-link" href={link.href} target="_blank" rel={affiliateRel}>
          {link.label}
          <small>{d.ad}</small>
          <span className="sr-only">（{name}{`・${d.external}）`}</span>
        </a>
      ))}
      {snippet ? <div className="affiliate-html" dangerouslySetInnerHTML={{ __html: prepareAffiliateHtml(snippet) }} /> : null}
    </div>
  );
}
