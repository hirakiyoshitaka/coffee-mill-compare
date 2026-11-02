import type { Metadata } from "next";
import { LocalizedArticle, localizedMetadata, localizedStaticParams } from "@/components/intl/LocalizedArticle";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return localizedStaticParams("zh-cn");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return localizedMetadata("zh-cn", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <LocalizedArticle locale="zh-cn" slug={(await params).slug} />;
}
