import { getModel } from "@/data/grinders";
import { renderMarkdown } from "@/lib/markdown";
import { GrinderCard } from "@/components/GrinderCard";

const GRINDER_TOKEN = /\{\{grinder:([a-z0-9-]+)\}\}/g;

export function ArticleBody({ markdown }: { markdown: string }) {
  const parts = markdown.split(GRINDER_TOKEN);
  const nodes = [];

  for (let index = 0; index < parts.length; index += 1) {
    if (index % 2 === 0) {
      const source = parts[index]?.trim();
      if (!source) continue;
      nodes.push(
        <div key={`md-${index}`} className="article-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(source) }} />,
      );
      continue;
    }

    const id = parts[index];
    const model = id ? getModel(id) : undefined;
    if (!model) {
      throw new Error(`記事中のミルID「${id ?? ""}」がデータにありません`);
    }
    nodes.push(<GrinderCard key={`grinder-${id}-${index}`} model={model} variant="embed" />);
  }

  return <div>{nodes}</div>;
}
