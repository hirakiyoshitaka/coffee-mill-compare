import Image from "next/image";
import type { GrinderModel } from "@/data/grinders";

type Variant = "card" | "embed" | "compact";

export function ProductVisual({ model, variant = "card" }: { model: GrinderModel; variant?: Variant }) {
  if (model.imageUrl) {
    return (
      <div className={`card-visual relative ${variant === "compact" ? "is-compact" : ""} ${variant === "embed" ? "is-embed" : ""}`}>
        <Image
          src={model.imageUrl}
          alt={model.imageAlt ?? model.name}
          fill
          sizes={variant === "compact" ? "(min-width: 1024px) 18vw, 46vw" : variant === "embed" ? "(min-width: 640px) 14rem, 100vw" : "(min-width: 1100px) 30vw, (min-width: 720px) 45vw, 100vw"}
          className="object-cover"
        />
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
