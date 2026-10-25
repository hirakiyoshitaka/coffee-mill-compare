import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getCategory } from "@/data/categories";

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
};

export type Article = ArticleMeta & {
  content: string;
};

const contentDir = path.join(process.cwd(), "content");

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

function readArticle(fileName: string): Article {
  const slug = fileName.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(contentDir, fileName), "utf8");
  const parsed = matter(raw);
  const title = requiredString(parsed.data.title, fileName, "title");
  const description = requiredString(parsed.data.description, fileName, "description");
  const category = requiredString(parsed.data.category, fileName, "category");
  if (!getCategory(category)) {
    throw new Error(`${fileName} の category「${category}」はカテゴリ一覧にありません`);
  }
  return {
    slug,
    title,
    description,
    category,
    date: asDateString(parsed.data.date, fileName),
    content: parsed.content.trim(),
  };
}

function articleFiles(): string[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs.readdirSync(contentDir).filter((file) => file.endsWith(".md"));
}

export function getAllArticles(): ArticleMeta[] {
  return articleFiles()
    .map((file) => readArticle(file))
    .sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug, "ja") : a.date < b.date ? 1 : -1))
    .map(({ slug, title, description, category, date }) => ({ slug, title, description, category, date }));
}

export function getArticle(slug: string): Article | undefined {
  const fileName = `${slug}.md`;
  if (!articleFiles().includes(fileName)) return undefined;
  return readArticle(fileName);
}

export function getArticlesByCategory(category: string): ArticleMeta[] {
  return getAllArticles().filter((article) => article.category === category);
}
