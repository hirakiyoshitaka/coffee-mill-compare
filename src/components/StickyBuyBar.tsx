"use client";

import { useEffect, useState } from "react";
import { affiliateRel } from "@/lib/affiliate";
import styles from "./StickyBuyBar.module.css";

/**
 * スマホだけ、日本語は冒頭の購入枠が画面上に抜けたあと、英語は本文を30%読み進めたあとに出す。
 * 中身は「この記事の結論の1台」の名前＋ボタン1つ＋小さく「PR」。
 * リンクは記事で既に使っている購入リンクを再利用する（新しい ASIN・タグは足さない）。
 * 計測は既存の BuyClickTracker（rel="sponsored" で判定）に任せ、ここでは何も足さない。
 * バー経由かを見分けられるよう、リンクに sticky-buy-bar の印だけ付ける。
 */
type Props = { name: string; href: string } & (
  | { locale: "ja"; targetId: string }
  | { locale: "en"; targetId?: never }
);

export function StickyBuyBar({ name, href, locale, targetId }: Props) {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (closed) return;
    if (locale === "ja") {
      const target = document.getElementById(targetId);
      if (!target || typeof IntersectionObserver === "undefined") return;
      const observer = new IntersectionObserver(([entry]) => {
        setVisible(!entry.isIntersecting && entry.boundingClientRect.bottom < 0);
      });
      observer.observe(target);
      return () => observer.disconnect();
    }

    const body = document.getElementById("article-reading-body");
    if (!body) return;
    let frame: number | undefined;
    const update = () => {
      frame = undefined;
      const { top, height } = body.getBoundingClientRect();
      // 本文の30%地点が画面上端に達したら表示。冒頭枠・関連記事・画面の高さは含めない。
      setVisible(height > 0 && -top / height >= 0.3);
    };
    const onScroll = () => {
      if (frame !== undefined) return;
      frame = requestAnimationFrame(update);
    };
    update();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onScroll) : undefined;
    observer?.observe(body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      observer?.disconnect();
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, [closed, locale, targetId]);

  // 出している間、本文とフッターが隠れないよう下に余白を足す（PC では CSS で 0）
  useEffect(() => {
    if (closed) return;
    document.body.classList.add("has-sticky-buy");
    return () => document.body.classList.remove("has-sticky-buy");
  }, [closed]);

  if (closed) return null;

  return (
    <div className={`${styles.bar} ${visible ? styles.visible : ""}`} aria-hidden={!visible}>
      <a className={`${styles.link} sticky-buy-bar`} href={href} target="_blank" rel={affiliateRel} tabIndex={visible ? 0 : -1}>
        <span className={styles.name}>{name}</span>
        <span className={styles.cta}>
          {locale === "en" ? "Check price on Amazon" : "Amazonで価格を見る"}
          <small>PR</small>
        </span>
      </a>
      <button
        type="button"
        className={styles.close}
        onClick={() => setClosed(true)}
        aria-label={locale === "en" ? "Close the purchase bar" : "購入バーを閉じる"}
        tabIndex={visible ? 0 : -1}
      >
        ×
      </button>
    </div>
  );
}
