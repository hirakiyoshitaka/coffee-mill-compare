import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getCategory } from "@/data/categories";
import type { Article } from "@/lib/articles";

/**
 * 英語だけの下書き。content/en/drafts に置き、/en/ の公開一覧・サイトマップ・ナビには出さない。
 * 各ファイルは draft: true。/en/drafts/ の noindex, nofollow としてだけ開く。
 * 日本語の下書きは content/drafts（src/lib/drafts.ts）。ここには混ぜない。
 * content/en/*.md の公開翻訳とも別ディレクトリなので、getLocalizedArticles は拾わない。
 */
const draftsDir = path.join(process.cwd(), "content", "en", "drafts");

/** 記事の並び。距離計、定期便。浄水の英語下書きは作っていない。 */
export const enDraftOrder = ["golf-rangefinder-how-to-choose", "coffee-subscription-how-to-choose"] as const;

/** 公開の英語ナビには足さない見出し。 */
const draftCategoryLabels: Record<string, string> = {
  golf: "Golf",
  beans: "Coffee",
};

export function enDraftCategoryLabel(slug: string): string | undefined {
  return draftCategoryLabels[slug];
}

function requiredString(value: unknown, fileName: string, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${fileName} の ${field} が空です`);
  }
  return value.trim();
}

function asDateString(value: unknown, fileName: string): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    return value.trim();
  }
  throw new Error(`${fileName} の date は YYYY-MM-DD で書いてください`);
}

function draftFiles(): string[] {
  if (!fs.existsSync(draftsDir)) return [];
  return fs.readdirSync(draftsDir).filter((file) => file.endsWith(".md"));
}

function readDraft(fileName: string): Article {
  const label = `en/drafts/${fileName}`;
  const parsed = matter(fs.readFileSync(path.join(draftsDir, fileName), "utf8"));
  if (parsed.data.draft !== true) {
    throw new Error(`${label} は draft: true にしてください`);
  }
  const category = requiredString(parsed.data.category, label, "category");
  if (!getCategory(category) && !draftCategoryLabels[category]) {
    throw new Error(`${label} の category「${category}」はカテゴリ一覧にも下書き用の見出しにもありません`);
  }
  return {
    slug: fileName.replace(/\.md$/, ""),
    title: requiredString(parsed.data.title, label, "title"),
    description: requiredString(parsed.data.description, label, "description"),
    category,
    date: asDateString(parsed.data.date, label),
    content: parsed.content.trim(),
  };
}

export function getAllEnDrafts(): Article[] {
  const articles = draftFiles().map((file) => readDraft(file));
  const rank = new Map<string, number>(enDraftOrder.map((slug, index) => [slug, index]));
  return articles.sort((a, b) => (rank.get(a.slug) ?? 99) - (rank.get(b.slug) ?? 99) || a.slug.localeCompare(b.slug, "en"));
}

export function getEnDraft(slug: string): Article | undefined {
  const fileName = `${slug}.md`;
  if (!draftFiles().includes(fileName)) return undefined;
  return readDraft(fileName);
}
