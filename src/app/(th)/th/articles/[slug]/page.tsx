import type { Metadata } from "next";
import { LocalizedArticle, localizedMetadata, localizedStaticParams } from "@/components/intl/LocalizedArticle";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return localizedStaticParams("th");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return localizedMetadata("th", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <LocalizedArticle locale="th" slug={(await params).slug} />;
}
