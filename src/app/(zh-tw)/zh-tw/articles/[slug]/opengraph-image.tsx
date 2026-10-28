import { localizedOgImage, ogSize } from "@/lib/og";
import { localizedStaticParams } from "@/components/intl/LocalizedArticle";

export const dynamic = "force-static";
export const size = ogSize;
export const contentType = "image/png";
export const alt = "おうちカフェ道具帳";

export function generateStaticParams() {
  return localizedStaticParams("zh-tw");
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  return localizedOgImage("zh-tw", (await params).slug);
}
