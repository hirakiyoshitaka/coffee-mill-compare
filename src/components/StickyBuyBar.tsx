"use client";

import { useEffect, useState } from "react";
import { affiliateRel } from "@/lib/affiliate";
import styles from "./StickyBuyBar.module.css";

/**
 * スマホだけ、最初の購入枠（targetId）が画面の上へ通り過ぎたあとに出す小さな購入バー。
 * 計測は既存の BuyClickTracker（リンク先のホストで判定）に任せ、ここでは何も足さない。
 */
export function StickyBuyBar({ targetId, name, href }: { targetId: string; name: string; href: string }) {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target || closed || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      // 枠が見えていない、かつ枠が画面の上へ出ていったときだけ出す
      setVisible(!entry.isIntersecting && entry.boundingClientRect.bottom < 0);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId, closed]);

  // 出している間、本文とフッターが隠れないよう下に余白を足す（PC では CSS で 0）
  useEffect(() => {
    if (closed) return;
    document.body.classList.add("has-sticky-buy");
    return () => document.body.classList.remove("has-sticky-buy");
  }, [closed]);

  if (closed) return null;

  return (
    <div className={`${styles.bar} ${visible ? styles.visible : ""}`} aria-hidden={!visible}>
      <a className={styles.link} href={href} target="_blank" rel={affiliateRel} tabIndex={visible ? 0 : -1}>
        <span className={styles.name}>{name}</span>
        <span className={styles.cta}>
          Amazonで見る<small>（広告）</small>
        </span>
      </a>
      <button type="button" className={styles.close} onClick={() => setClosed(true)} aria-label="購入バーを閉じる" tabIndex={visible ? 0 : -1}>
        ×
      </button>
    </div>
  );
}
