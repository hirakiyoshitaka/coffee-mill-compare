import type { Metadata } from "next";
import { CampingHub } from "@/components/CampingHub";
import { campingHubCopy, campingLanguages } from "@/data/camping";
import { getSiteUrl, localizedSiteName } from "@/data/site";

const copy = campingHubCopy.vi;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { absolute: `${copy.title}｜${localizedSiteName.vi}` },
  description: copy.description,
  alternates: { canonical: "/vi/camping/", languages: campingLanguages() },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <CampingHub locale="vi" />;
}
