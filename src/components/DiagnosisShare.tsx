"use client";

import { useState, useSyncExternalStore } from "react";
import { getSiteUrl, siteConfig } from "@/data/site";
import { diagnosisPath } from "@/lib/mill-diagnosis";

type Props = { productName: string };

const pillClass =
  "rounded-full border border-[var(--border-subtle)] px-4 py-2 text-sm font-bold text-[var(--accent-dark)] hover:underline";

const subscribeNoop = () => () => {};
const getNativeShareCapability = () => typeof navigator !== "undefined" && "share" in navigator;
const getFileShareCapability = () =>
  typeof navigator !== "undefined" && "share" in navigator && "canShare" in navigator;
const getServerNativeShareCapability = () => false;

/* 結果カード画像の配色は globals.css のサイトトーンに合わせる。 */
const CARD = {
  width: 1200,
  height: 630,
  paper: "#faf7f3",
  white: "#fffcf8",
  ink: "#2a241f",
  muted: "#5e534a",
  line: "#e4dbd0",
  accent: "#9a4e36",
  accentDark: "#7a3d2c",
} as const;

const CARD_FILE_NAME = "mill-diagnosis-result.png";

function resolveFontFamily(variable: string, fallback: string): string {
  const value = window.getComputedStyle(document.body).getPropertyValue(variable).trim();
  return value ? `${value}, ${fallback}` : fallback;
}

/** 商品名をカード幅に収める。1行で入らなければ2行に割り、フォントを段階的に縮める。 */
function layoutProductName(
  ctx: CanvasRenderingContext2D,
  name: string,
  serif: string,
): { lines: string[]; size: number } {
  const maxWidth = 1000;
  for (let size = 76; size >= 48; size -= 4) {
    ctx.font = `700 ${size}px ${serif}`;
    if (ctx.measureText(name).width <= maxWidth) return { lines: [name], size };
  }
  let size = 46;
  ctx.font = `700 ${size}px ${serif}`;
  const lines: string[] = [];
  let current = "";
  let truncated = false;
  for (const ch of name) {
    if (current && ctx.measureText(current + ch).width > maxWidth) {
      lines.push(current);
      current = ch;
      if (lines.length === 2) {
        truncated = true;
        break;
      }
    } else {
      current += ch;
    }
  }
  if (lines.length < 2 && current) lines.push(current);
  if (truncated && lines.length === 2) lines[1] += "…";
  while (
    size > 32 &&
    Math.max(...lines.map((line) => ctx.measureText(line).width)) > maxWidth
  ) {
    size -= 2;
    ctx.font = `700 ${size}px ${serif}`;
  }
  return { lines, size };
}

function drawResultCard(
  ctx: CanvasRenderingContext2D,
  productName: string,
  siteName: string,
  url: string,
) {
  const { width, height } = CARD;
  const serif = resolveFontFamily(
    "--font-serif-jp",
    '"Hiragino Mincho ProN", "Yu Mincho", "Noto Serif JP", serif',
  );
  const sans = resolveFontFamily(
    "--font-sans-jp",
    '"Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", sans-serif',
  );
  const centerX = width / 2;

  ctx.fillStyle = CARD.paper;
  ctx.fillRect(0, 0, width, height);

  /* 内側の白パネル＋細い枠線で、サイトの面の見た目に寄せる。 */
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") ctx.roundRect(36, 36, width - 72, height - 72, 18);
  else ctx.rect(36, 36, width - 72, height - 72);
  ctx.fillStyle = CARD.white;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = CARD.line;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  /* 上部のラベルとアクセントの短い線。 */
  ctx.fillStyle = CARD.muted;
  ctx.font = `500 29px ${sans}`;
  const spaced = ctx as CanvasRenderingContext2D & { letterSpacing?: string };
  try {
    spaced.letterSpacing = "10px";
  } catch {
    // letterSpacing 非対応の環境ではそのまま描く。
  }
  ctx.fillText("手挽きミル選び診断", centerX, 168);
  try {
    spaced.letterSpacing = "0px";
  } catch {
    // 同上。
  }
  ctx.fillStyle = CARD.accent;
  ctx.fillRect(centerX - 36, 190, 72, 5);

  ctx.fillStyle = CARD.accentDark;
  ctx.font = `700 27px ${sans}`;
  ctx.fillText("私の結果は", centerX, 254);

  /* 結果名（商品名）。購入リンク・価格・体験の文言は入れない。 */
  const { lines, size } = layoutProductName(ctx, productName, serif);
  ctx.fillStyle = CARD.ink;
  ctx.font = `700 ${size}px ${serif}`;
  if (lines.length === 1) {
    ctx.fillText(lines[0], centerX, 348);
  } else {
    ctx.fillText(lines[0], centerX, 316);
    ctx.fillText(lines[1], centerX, 316 + Math.round(size * 1.45));
  }

  ctx.fillStyle = CARD.line;
  ctx.fillRect(centerX - 130, 452, 260, 2);

  /* 下部はサイト名と診断ページのURLだけ。 */
  ctx.fillStyle = CARD.ink;
  ctx.font = `700 37px ${serif}`;
  ctx.fillText(siteName, centerX, 510);

  ctx.fillStyle = CARD.muted;
  ctx.font = `400 25px ${sans}`;
  ctx.fillText(url, centerX, 554);
}

/** 診断結果のカード画像（1200×630 PNG）をブラウザ側で生成する。サーバーには送らない。 */
async function createResultCardFile(productName: string, siteName: string, url: string): Promise<File> {
  try {
    await document.fonts.ready;
  } catch {
    // フォント読み込み待ちが使えなくても生成は続ける。
  }
  const canvas = document.createElement("canvas");
  canvas.width = CARD.width;
  canvas.height = CARD.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas is not available");
  drawResultCard(ctx, productName, siteName, url);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("failed to create card image");
  return new File([blob], CARD_FILE_NAME, { type: "image/png" });
}

function downloadFile(file: File) {
  const objectUrl = URL.createObjectURL(file);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = file.name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 4000);
}

/**
 * 診断結果のシェア導線。記事末尾の ShareButtons と同じ並び（X / Threads / LINE）に、
 * 端末の共有シート（Web Share API）が使える環境では「端末で共有」を足す。
 * あわせて、結果名・サイト名・診断ページURLだけを載せた結果カード画像（1200×630）を
 * ブラウザ側で生成し、「画像を保存」と、画像共有に対応した端末では「画像で共有」を出す。
 * 共有先は診断ページだけ。購入リンク・価格は文面にも画像にも入れない。投稿自体は読者が行う。
 */
export function DiagnosisShare({ productName }: Props) {
  const canNativeShare = useSyncExternalStore(
    subscribeNoop,
    getNativeShareCapability,
    getServerNativeShareCapability,
  );
  const canFileShare = useSyncExternalStore(
    subscribeNoop,
    getFileShareCapability,
    getServerNativeShareCapability,
  );
  const [cardBusy, setCardBusy] = useState<"save" | "share" | null>(null);

  const url = `${getSiteUrl()}${diagnosisPath}`;
  const text = `手挽きミル選び診断、私の結果は『${productName}』でした`;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${text} ${url}`);
  const links = [
    { name: "X", href: `https://x.com/intent/post?text=${encodedText}` },
    { name: "Threads", href: `https://www.threads.net/intent/post?text=${encodedText}` },
    { name: "LINE", href: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}` },
  ];

  async function nativeShare() {
    try {
      await navigator.share({ title: "ミル選びの診断", text, url });
    } catch {
      // 読者が共有シートを閉じた場合は何もしない。
    }
  }

  async function saveCardImage() {
    if (cardBusy) return;
    setCardBusy("save");
    try {
      downloadFile(await createResultCardFile(productName, siteConfig.name, url));
    } catch {
      // 画像を生成できなかった場合は何もしない。
    } finally {
      setCardBusy(null);
    }
  }

  async function shareCardImage() {
    if (cardBusy) return;
    setCardBusy("share");
    try {
      const file = await createResultCardFile(productName, siteConfig.name, url);
      if (typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "ミル選びの診断", text });
      } else {
        // 画像共有に未対応の環境では保存に切り替える。
        downloadFile(file);
      }
    } catch {
      // 読者が共有シートを閉じた場合などは何もしない。
    } finally {
      setCardBusy(null);
    }
  }

  return (
    <section className="mt-14 border-t border-[var(--border-subtle)] pt-8" aria-label="診断結果をシェア">
      <h2 className="font-serif text-xl text-stone-950">診断結果をシェア</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`診断結果をシェア: ${link.name}`}
            className={pillClass}
          >
            {link.name}
          </a>
        ))}
        {canNativeShare ? (
          <button type="button" onClick={nativeShare} className={pillClass}>
            端末で共有
          </button>
        ) : null}
      </div>
      <p className="mt-6 text-sm text-[var(--ink-soft)]">
        結果を画像カード（結果名とサイト名だけの絵）にして残せます。
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={saveCardImage}
          disabled={cardBusy !== null}
          className={`${pillClass} disabled:opacity-60`}
        >
          {cardBusy === "save" ? "画像を作成中…" : "画像を保存"}
        </button>
        {canFileShare ? (
          <button
            type="button"
            onClick={shareCardImage}
            disabled={cardBusy !== null}
            className={`${pillClass} disabled:opacity-60`}
          >
            {cardBusy === "share" ? "画像を作成中…" : "画像で共有"}
          </button>
        ) : null}
      </div>
    </section>
  );
}
