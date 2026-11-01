import { ImageResponse } from "next/og";
import { getLocalizedArticle, type TranslationLocale } from "@/lib/articles";
import { siteConfig, localizedSiteName } from "@/data/site";

export const ogSize = { width: 1200, height: 630 };

const fontFamily: Record<TranslationLocale, string> = {
  "zh-tw": "Noto Sans TC",
  "zh-hk": "Noto Sans HK",
  "zh-cn": "Noto Sans SC",
  ko: "Noto Sans KR",
  en: "Noto Sans",
};

// Fetch a glyph-subset TTF from Google Fonts at build time (static export).
async function loadFont(family: string, text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@700&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (!src) return null;
    const res = await fetch(src[1]);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export async function localizedOgImage(locale: TranslationLocale, slug: string) {
  const article = getLocalizedArticle(locale, slug);
  const title = article?.title ?? localizedSiteName[locale];
  const all = `${title}${localizedSiteName[locale]}`;
  const [main, jp] = await Promise.all([loadFont(fontFamily[locale], all), loadFont("Noto Sans JP", all)]);
  const fonts = [
    ...(main ? [{ name: "Main", data: main, weight: 700 as const, style: "normal" as const }] : []),
    ...(jp ? [{ name: "JP", data: jp, weight: 700 as const, style: "normal" as const }] : []),
  ];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #f7efe3 0%, #e8d5bc 100%)",
          color: "#3b2a1e",
          fontFamily: "Main, JP",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#8a5a3b" }}>{localizedSiteName[locale]}</div>
        <div style={{ display: "flex", fontSize: title.length > 28 ? 56 : 66, lineHeight: 1.3, fontWeight: 700 }}>{title}</div>
        <div style={{ display: "flex", width: 160, height: 10, borderRadius: 5, background: "#8a5a3b" }} />
      </div>
    ),
    { ...ogSize, fonts }
  );
}
