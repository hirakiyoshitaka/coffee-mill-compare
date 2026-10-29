import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { KitchenList } from "@/components/KitchenList";
import { PrNotice } from "@/components/PrNotice";
import { getKitchenArticles } from "@/lib/kitchen";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "キッチン・ストック",
  description: "帰宅後のごはん、作り置き、ストック食品と台所道具を、使う場面・一食量・置き場所から選ぶノート。",
  path: "/kitchen",
});

export default function KitchenIndexPage() {
  const articles = getKitchenArticles();
  return (
    <main className="page-wrap page-narrow">
      <Breadcrumb items={[{ href: "/", label: "ホーム" }, { label: "キッチン・ストック" }]} />
      <header className="mb-8">
        <h1 className="font-serif text-[1.75rem] leading-snug tracking-wide text-[var(--ink)] sm:text-[2.15rem]">キッチン・ストック</h1>
        <p className="mt-4 text-base leading-relaxed text-stone-600">
          帰宅後のごはん、作り置き、ストック食品と台所道具を、使う場面・一食量・置き場所から選ぶノートです。旧「ストック帖」の記事を移しました。
          運営者の実食・実機使用による体験談ではなく、メーカー資料・公的資料・外部の使用記事をもとにしています。
        </p>
      </header>
      <PrNotice />
      <div className="mt-8">
        <KitchenList articles={articles} />
      </div>
    </main>
  );
}
