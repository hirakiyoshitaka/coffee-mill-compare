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

/* ---- 海外向け（翻訳）記事: content/<locale>/*.md ---- */

export const translationLocales = ["zh-tw", "zh-hk", "zh-cn", "ko", "en"] as const;
export type TranslationLocale = (typeof translationLocales)[number];

/** hreflang 用の言語コード */
export const hreflangOf: Record<"ja" | TranslationLocale, string> = { ja: "ja", "zh-tw": "zh-TW", "zh-hk": "zh-HK", "zh-cn": "zh-CN", ko: "ko", en: "en" };

function localeDir(locale: TranslationLocale): string {
  return path.join(contentDir, locale);
}

function readLocalizedArticle(locale: TranslationLocale, fileName: string): Article {
  const label = `${locale}/${fileName}`;
  const parsed = matter(fs.readFileSync(path.join(localeDir(locale), fileName), "utf8"));
  const category = requiredString(parsed.data.category, label, "category");
  if (!getCategory(category)) throw new Error(`${label} の category「${category}」はカテゴリ一覧にありません`);
  return {
    slug: fileName.replace(/\.md$/, ""),
    title: requiredString(parsed.data.title, label, "title"),
    description: requiredString(parsed.data.description, label, "description"),
    category,
    date: asDateString(parsed.data.date, label),
    content: parsed.content.trim(),
  };
}

function localizedFiles(locale: TranslationLocale): string[] {
  const dir = localeDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => file.endsWith(".md"));
}

export function getLocalizedArticles(locale: TranslationLocale): ArticleMeta[] {
  return localizedFiles(locale)
    .map((file) => readLocalizedArticle(locale, file))
    .sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : a.date < b.date ? 1 : -1))
    .map(({ slug, title, description, category, date }) => ({ slug, title, description, category, date }));
}

export function getLocalizedArticle(locale: TranslationLocale, slug: string): Article | undefined {
  const fileName = `${slug}.md`;
  if (!localizedFiles(locale).includes(fileName)) return undefined;
  return readLocalizedArticle(locale, fileName);
}

/** 同じ slug の記事がある言語ごとのパス（hreflang alternates 用） */
export function articleLanguageAlternates(slug: string): Record<string, string> {
  const languages: Record<string, string> = {};
  if (getArticle(slug)) languages[hreflangOf.ja] = `/articles/${slug}/`;
  for (const locale of translationLocales) {
    if (getLocalizedArticle(locale, slug)) languages[hreflangOf[locale]] = `/${locale}/articles/${slug}/`;
  }
  if (languages[hreflangOf.ja]) languages["x-default"] = languages[hreflangOf.ja];
  return languages;
}

/** 言語切り替え用: その slug の記事がある言語とパス（ja は /articles/） */
export function articleLocalePaths(slug: string): { locale: "ja" | TranslationLocale; href: string }[] {
  const out: { locale: "ja" | TranslationLocale; href: string }[] = [];
  if (getArticle(slug)) out.push({ locale: "ja", href: `/articles/${slug}/` });
  for (const locale of translationLocales) {
    if (getLocalizedArticle(locale, slug)) out.push({ locale, href: `/${locale}/articles/${slug}/` });
  }
  return out;
}
