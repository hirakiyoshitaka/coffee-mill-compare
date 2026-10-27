import type { MetadataRoute } from "next";
import { beanShops } from "@/data/beans";
import { categories } from "@/data/categories";
import { brands } from "@/data/grinders";
import { getSiteUrl, siteConfig } from "@/data/site";
import { getAllArticles, getLocalizedArticles, translationLocales } from "@/lib/articles";

export const dynamic = "force-static";

function abs(path: string): string {
  const base = getSiteUrl();
  if (path === "/") return `${base}/`;
  const withSlash = path.endsWith("/") ? path : `${path}/`;
  return `${base}${withSlash}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(`${siteConfig.legalUpdated}T00:00:00.000Z`);
  const staticPaths = ["/", "/categories", "/compare", "/articles", "/beans", "/about", "/privacy", "/disclosure"];
  const categoryPaths = categories
    .filter((category) => category.status === "live" && category.slug !== "beans")
    .map((category) => `/categories/${category.slug}`);
  const beanPaths = beanShops.map((shop) => `/beans/${shop.slug}`);
  const brandPaths = brands.map((brand) => `/brands/${brand.slug}`);
  const articles = getAllArticles();

  return [
    ...staticPaths.map((path) => ({
      url: abs(path),
      lastModified: updated,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...categoryPaths.map((path) => ({
      url: abs(path),
      lastModified: updated,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...beanPaths.map((path) => ({
      url: abs(path),
      lastModified: updated,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...brandPaths.map((path) => ({
      url: abs(path),
      lastModified: updated,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...articles.map((article) => ({
      url: abs(`/articles/${article.slug}`),
      lastModified: new Date(`${article.date}T00:00:00.000Z`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...translationLocales
      .filter((locale) => getLocalizedArticles(locale).length > 0)
      .map((locale) => ({
        url: abs(`/${locale}/`),
        lastModified: updated,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ...translationLocales.map((locale) => ({
      url: abs(`/${locale}/disclosure`),
      lastModified: updated,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
    ...translationLocales.flatMap((locale) =>
      getLocalizedArticles(locale).map((article) => ({
        url: abs(`/${locale}/articles/${article.slug}`),
        lastModified: new Date(`${article.date}T00:00:00.000Z`),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ),
  ];
}
