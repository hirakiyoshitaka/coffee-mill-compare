import { BeanEmbed } from "@/components/BeanViews";
import { GrinderCard } from "@/components/GrinderCard";
import { getBeanShop } from "@/data/beans";
import { getModel } from "@/data/grinders";
import type { SiteLocale } from "@/lib/i18n";
import { renderMarkdown } from "@/lib/markdown";

const TOKEN = /\{\{(grinder|bean):([a-z0-9-]+)\}\}/g;

export function ArticleBody({ markdown, locale = "ja", reviewHref }: { markdown: string; locale?: SiteLocale; reviewHref?: (slug: string) => string | undefined }) {
  const parts = markdown.split(TOKEN);
  const nodes = [];

  for (let index = 0; index < parts.length; ) {
    const source = parts[index]?.trim();
    if (source) {
      nodes.push(
        <div key={`md-${index}`} className="article-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(source) }} />,
      );
    }
    index += 1;
    if (index >= parts.length) break;

    const kind = parts[index];
    const id = parts[index + 1] ?? "";
    index += 2;

    if (kind === "grinder") {
      const model = getModel(id);
      if (!model) {
        throw new Error(`記事中のミルID「${id}」がデータにありません`);
      }
      nodes.push(<GrinderCard
          key={`grinder-${id}-${index}`}
          model={model}
          variant="embed"
          locale={locale}
          reviewHref={model.reviewSlug ? reviewHref?.(model.reviewSlug) : undefined}
        />);
      continue;
    }

    if (kind === "bean") {
      const shop = getBeanShop(id);
      if (!shop) {
        throw new Error(`記事中の豆の店ID「${id}」がデータにありません`);
      }
      nodes.push(<BeanEmbed key={`bean-${id}-${index}`} shop={shop} />);
      continue;
    }

    throw new Error(`記事中の差し込み「${kind ?? ""}:${id}」は未対応です`);
  }

  return <div>{nodes}</div>;
}
