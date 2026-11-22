"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";
import { buyClickData, isBuyClick } from "@/lib/buy-click";

function buyAnchor(target: EventTarget | null): HTMLAnchorElement | null {
  if (!(target instanceof Element)) return null;
  const anchor = target.closest("a");
  if (!(anchor instanceof HTMLAnchorElement)) return null;
  if (anchor.classList.contains("buy-link") || anchor.closest(".affiliate-html")) return anchor;
  // 記事本文の購入リンク（markdown.ts が rel="sponsored" を付ける）も数える。店でない行き先は buyClickData が null を返す
  if (anchor.relList.contains("sponsored")) return anchor;
  return null;
}

/** 購入クリックの追加データは店と記事スラッグだけ。Amazon の国は店の値で分ける。 */
export function BuyClickTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!isBuyClick(event)) return;
      const anchor = buyAnchor(event.target);
      if (!anchor) return;
      const data = buyClickData(anchor.href, window.location.pathname);
      if (!data) return;
      track("buy_click", { shop: data.shop, article: data.article });
    }

    document.addEventListener("click", onClick);
    document.addEventListener("auxclick", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("auxclick", onClick);
    };
  }, []);

  return null;
}
