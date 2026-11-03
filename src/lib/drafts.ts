import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getCategory } from "@/data/categories";
import type { Article } from "@/lib/articles";

/**
 * 日本語だけの下書き。content/drafts に置き、公開一覧・サイトマップ・ナビには出さない。
 * 各ファイルは draft: true。実測が入るまで /drafts/ の noindex ページとしてだけ開く。
 * ゴルフと浄水は公開カテゴリを増やさない。名前だけ下書きページに出す。
 */
const draftsDir = path.join(process.cwd(), "content", "drafts");

/** 記事の並び。まとめ、違い、定期便。 */
export const draftOrder = [
  "golf-rangefinder-how-to-choose",
  "water-purifier-buy-or-rent",
  "coffee-subscription-how-to-choose",
] as const;

/** 公開のカテゴリ一覧には足さない見出し。 */
const draftCategoryLabels: Record<string, string> = {
  golf: "ゴルフ",
  water: "浄水",
};

export function draftCategoryLabel(slug: string): string | undefined {
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
  const label = `drafts/${fileName}`;
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

export function getAllDrafts(): Article[] {
  const articles = draftFiles().map((file) => readDraft(file));
  const rank = new Map<string, number>(draftOrder.map((slug, index) => [slug, index]));
  return articles.sort((a, b) => (rank.get(a.slug) ?? 99) - (rank.get(b.slug) ?? 99) || a.slug.localeCompare(b.slug, "ja"));
}

export function getDraft(slug: string): Article | undefined {
  const fileName = `${slug}.md`;
  if (!draftFiles().includes(fileName)) return undefined;
  return readDraft(fileName);
}
