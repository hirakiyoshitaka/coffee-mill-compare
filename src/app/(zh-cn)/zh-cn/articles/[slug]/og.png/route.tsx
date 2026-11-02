import { localizedOgImage } from "@/lib/og";
import { localizedStaticParams } from "@/components/intl/LocalizedArticle";

export const dynamic = "force-static";

export function generateStaticParams() {
  return localizedStaticParams("zh-cn");
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  return localizedOgImage("zh-cn", (await params).slug);
}
