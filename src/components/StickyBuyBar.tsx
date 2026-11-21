"use client";

import { useEffect, useState } from "react";
import { affiliateRel } from "@/lib/affiliate";
import styles from "./StickyBuyBar.module.css";

/**
 * スマホだけ、記事を30%読み進めたあとに出す小さな購入バー（司令塔の導線実装 2026-11-21）。
 * 中身は「この記事の結論の1台」の名前＋ボタン1つ＋小さく「PR」。
 * リンクは記事で既に使っている購入リンクを再利用する（新しい ASIN・タグは足さない）。
 * 計測は既存の BuyClickTracker（rel="sponsored" で判定）に任せ、ここでは何も足さない。
 * バー経由かを見分けられるよう、リンクに sticky-buy-bar の印だけ付ける。
 */
export function StickyBuyBar({ name, href, locale }: { name: string; href: string; locale: "ja" | "en" }) {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (closed) return;
    const main = document.querySelector("main");
    if (!main) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const top = main.getBoundingClientRect().top + window.scrollY;
      const height = main.offsetHeight;
      const read = window.scrollY + window.innerHeight - top;
      // 読み進めた割合が30%に達し、かつ少しでもスクロールしてから出す
      setVisible(window.scrollY > 0 && height > 0 && read / height >= 0.3);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [closed]);

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
