import Image from "next/image";
import { affiliateRel, isHttpUrl } from "@/lib/affiliate";
import type { GrinderModel } from "@/data/grinders";
import type { SiteLocale } from "@/lib/i18n";

type Variant = "card" | "embed" | "compact";

export function ProductVisual({ model, variant = "card", locale = "ja" }: { model: GrinderModel; variant?: Variant; locale?: SiteLocale }) {
  if (!model.imageUrl) {
    if (locale === "ja") {
      return (
        <div className="product-photo-note">
          <p className="product-placeholder-kicker">製品写真は未掲載</p>
          {model.placeholderNote ? <p className="product-placeholder-note">{model.placeholderNote}</p> : null}
        </div>
      );
    }
    return (
      <div
        className={`product-placeholder ${variant === "compact" ? "is-compact" : ""} ${variant === "embed" ? "is-embed" : ""}`}
        role="img"
        aria-label={`${model.name}。製品写真は未掲載`}
      >
        <p className="product-placeholder-kicker">製品写真は未掲載</p>
        <p className="product-placeholder-name">{model.name}</p>
        {model.placeholderNote ? <p className="product-placeholder-note">{model.placeholderNote}</p> : null}
      </div>
    );
  }

  const frameClass = `card-visual relative ${variant === "compact" ? "is-compact" : ""} ${variant === "embed" ? "is-embed" : ""}`;
  const sizes =
    variant === "compact"
      ? "(min-width: 1024px) 18vw, 46vw"
      : variant === "embed"
        ? "(min-width: 640px) 14rem, 100vw"
        : "(min-width: 1100px) 30vw, (min-width: 720px) 45vw, 100vw";
  const rakutenHosted = /^https:\/\/(?:[\w.-]+\.)?(?:rakuten\.co\.jp|r10s\.jp)\//i.test(model.imageUrl ?? "");
  const allowJpAmazon = locale !== "en" && locale !== "zh-tw";
  // 楽天の商品画像は楽天の購入リンクへ。それ以外の写真は、Amazon の購入リンクがあればそちらを優先する。
  // 英語と繁體中文（台灣）は、海外の Amazon タグが無いので日本タグの画像リンクを出さない。
  const imageLinkUrl = rakutenHosted
    ? model.rakutenUrl
    : allowJpAmazon && isHttpUrl(model.amazonUrl)
      ? model.amazonUrl
      : model.rakutenUrl;
  const linked = isHttpUrl(imageLinkUrl);
  const inner = (
    <>
      <Image src={model.imageUrl} alt={model.imageAlt ?? model.name} fill sizes={sizes} className="object-contain" />
      {rakutenHosted ? <p className="image-credit">楽天市場の商品画像</p> : null}
    </>
  );

  if (!linked) return <div className={frameClass}>{inner}</div>;

  return (
    <a className={frameClass} href={imageLinkUrl} target="_blank" rel={affiliateRel}>
      {inner}
    </a>
  );
}
