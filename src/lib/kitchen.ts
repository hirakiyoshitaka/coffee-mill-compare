import fs from "fs";
import path from "path";
import matter from "gray-matter";

/** キッチン・ストック（旧ストック帖から移行）: content/kitchen/*.md。日本語のみ。 */
export type KitchenMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  updated: string;
  ogImage: string;
  originalUrl?: string;
};
export type KitchenArticle = KitchenMeta & { content: string };

const dir = path.join(process.cwd(), "content", "kitchen");

function str(value: unknown, file: string, field: string): string {
  if (typeof value !== "string" || value.trim() === "") throw new Error(`kitchen/${file} の ${field} が空です`);
  return value.trim();
}

function files(): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
}

function read(file: string): KitchenArticle {
  const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
  const slug = file.replace(/\.md$/, "");
  const date = str(data.published_on, file, "published_on");
  return {
    slug,
    title: str(data.title, file, "title"),
    description: str(data.summary, file, "summary"),
    category: str(data.category, file, "category"),
    date,
    updated: typeof data.updated_on === "string" ? data.updated_on : date,
    ogImage: typeof data.og_image === "string" ? data.og_image : `/kitchen/og/${slug}.png`,
    originalUrl: typeof data.original_url === "string" ? data.original_url : undefined,
    // 本文先頭の H1 はページ側で出すので外す
    content: content.trim().replace(/^# .+\n+/, ""),
  };
}

export function getKitchenArticles(): KitchenMeta[] {
  return files()
    .map(read)
    .sort((a, b) => (a.updated === b.updated ? a.slug.localeCompare(b.slug) : a.updated < b.updated ? 1 : -1))
    .map(({ content: _c, ...meta }) => meta);
}

export function getKitchenArticle(slug: string): KitchenArticle | undefined {
  const file = `${slug}.md`;
  return files().includes(file) ? read(file) : undefined;
}
