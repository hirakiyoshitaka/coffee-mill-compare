import type { GrinderModel } from "@/data/grinders";
import { affiliateRel, isHttpUrl, prepareAffiliateHtml } from "@/lib/affiliate";

export type BuyLink = {
  href?: string;
  label: string;
};

type Props = {
  name: string;
  links: BuyLink[];
  html?: string;
};

export function grinderBuyProps(model: Pick<GrinderModel, "name" | "rakutenUrl" | "amazonUrl" | "yahooUrl" | "moshimoHtml">): Props {
  return {
    name: model.name,
    html: model.moshimoHtml,
    links: [
      { href: model.rakutenUrl, label: "楽天市場で価格を見る" },
      { href: model.amazonUrl, label: "Amazonで価格を見る" },
      { href: model.yahooUrl, label: "Yahoo!ショッピングで価格を見る" },
    ],
  };
}

export function BuyButtons({ name, links, html }: Props) {
  const visible = links.flatMap((link) => {
    const href = link.href?.trim();
    if (!isHttpUrl(href)) return [];
    return [{ href, label: link.label }];
  });
  const snippet = html?.trim() ?? "";
  if (visible.length === 0 && snippet === "") return null;

  return (
    <div className="buy-stack">
      <p className="buy-note">購入リンク（広告）</p>
      {visible.map((link) => (
        <a key={link.label} className="buy-link" href={link.href} target="_blank" rel={affiliateRel}>
          {link.label}
          <small>広告</small>
          <span className="sr-only">（{name}・外部サイト）</span>
        </a>
      ))}
      {snippet ? <div className="affiliate-html" dangerouslySetInnerHTML={{ __html: prepareAffiliateHtml(snippet) }} /> : null}
    </div>
  );
}
