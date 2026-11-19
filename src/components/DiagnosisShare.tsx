"use client";

import { useSyncExternalStore } from "react";
import { getSiteUrl } from "@/data/site";
import { diagnosisPath } from "@/lib/mill-diagnosis";

type Props = { productName: string };

const pillClass =
  "rounded-full border border-[var(--border-subtle)] px-4 py-2 text-sm font-bold text-[var(--accent-dark)] hover:underline";

const subscribeNoop = () => () => {};
const getNativeShareCapability = () => typeof navigator !== "undefined" && "share" in navigator;
const getServerNativeShareCapability = () => false;

/**
 * 診断結果のシェア導線。記事末尾の ShareButtons と同じ並び（X / Threads / LINE）に、
 * 端末の共有シート（Web Share API）が使える環境では「端末で共有」を足す。
 * 共有先は診断ページだけ。購入リンクは文面に入れない。投稿自体は読者が行う。
 */
export function DiagnosisShare({ productName }: Props) {
  const canNativeShare = useSyncExternalStore(
    subscribeNoop,
    getNativeShareCapability,
    getServerNativeShareCapability,
  );

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
    </section>
  );
}
