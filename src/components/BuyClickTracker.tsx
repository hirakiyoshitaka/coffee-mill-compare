"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";
import { buyClickData } from "@/lib/buy-click";

function buyAnchor(target: EventTarget | null): HTMLAnchorElement | null {
  if (!(target instanceof Element)) return null;
  const anchor = target.closest("a");
  if (!(anchor instanceof HTMLAnchorElement)) return null;
  if (anchor.classList.contains("buy-link") || anchor.closest(".affiliate-html")) return anchor;
  return null;
}

/** 購入ボタンのクリックを、店と記事スラッグだけ送る。URL とユーザー ID は送らない。 */
export function BuyClickTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const anchor = buyAnchor(event.target);
      if (!anchor) return;
      const data = buyClickData(anchor.href, window.location.pathname);
      if (!data) return;
      track("buy_click", { shop: data.shop, article: data.article });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
