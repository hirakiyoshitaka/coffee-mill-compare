import type { Metadata } from "next";
import { CampingHub } from "@/components/CampingHub";
import { campingHubCopy, campingLanguages } from "@/data/camping";
import { getSiteUrl, localizedSiteName } from "@/data/site";

const copy = campingHubCopy["zh-tw"];

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { absolute: `${copy.title}｜${localizedSiteName["zh-tw"]}` },
  description: copy.description,
  alternates: { canonical: "/zh-tw/camping/", languages: campingLanguages() },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <CampingHub locale="zh-tw" />;
}
