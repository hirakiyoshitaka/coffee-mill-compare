import type { GrinderModel } from "@/data/grinders";
import { affiliateRel, isHttpUrl, prepareAffiliateHtml } from "@/lib/affiliate";

type Props = {
  model: Pick<GrinderModel, "name" | "rakutenUrl" | "amazonUrl" | "yahooUrl" | "moshimoHtml">;
};

const shops: { key: "rakutenUrl" | "amazonUrl" | "yahooUrl"; label: string }[] = [
  { key: "rakutenUrl", label: "楽天市場で見る" },
  { key: "amazonUrl", label: "Amazonで見る" },
  { key: "yahooUrl", label: "Yahoo!ショッピングで見る" },
];

export function BuyButtons({ model }: Props) {
  const links = shops.flatMap((shop) => {
    const href = model[shop.key]?.trim();
    if (!isHttpUrl(href)) return [];
    return [{ href, label: shop.label }];
  });
  const html = model.moshimoHtml?.trim() ?? "";
  if (links.length === 0 && html === "") return null;

  return (
    <div className="mt-4 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-3">
      <p className="text-xs font-medium text-[var(--seal)]">購入リンク（広告）</p>
      {links.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-2">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel={affiliateRel}
                className="inline-flex rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
              >
                {link.label}
                <span className="sr-only">（{model.name}・外部サイト）</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      {html ? (
        <div
          className="affiliate-html mt-3 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: prepareAffiliateHtml(html) }}
        />
      ) : null}
    </div>
  );
}
