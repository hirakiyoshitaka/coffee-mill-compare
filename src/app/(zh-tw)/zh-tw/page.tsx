import { LocaleIndex, localeIndexMetadata } from "@/components/intl/LocaleIndex";

export const metadata = localeIndexMetadata("zh-tw");

export default function Page() {
  return <LocaleIndex locale="zh-tw" />;
}
