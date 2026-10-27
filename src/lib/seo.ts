import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

export const defaultOgImage = { url: "/images/og-default.jpg", width: 1200, height: 630 };

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  noindex?: boolean;
};

function canonicalPath(path: string): string {
  if (path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

export function pageMeta({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  noindex = false,
}: PageMetaInput): Metadata {
  const canonical = canonicalPath(path);
  const fullTitle = title.includes(siteConfig.name) ? title : `${title}｜${siteConfig.name}`;
  const robots = noindex ? { index: false, follow: true } : { index: true, follow: true };

  const openGraph =
    type === "article"
      ? {
          title: fullTitle,
          description,
          url: canonical,
          type: "article" as const,
          locale: siteConfig.locale,
          siteName: siteConfig.name,
          images: [defaultOgImage],
          publishedTime,
        }
      : {
          title: fullTitle,
          description,
          url: canonical,
          type: "website" as const,
          locale: siteConfig.locale,
          siteName: siteConfig.name,
          images: [defaultOgImage],
        };

  return {
    title: title.includes(siteConfig.name) ? { absolute: title } : title,
    description,
    alternates: { canonical },
    robots,
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [defaultOgImage.url],
    },
  };
}
