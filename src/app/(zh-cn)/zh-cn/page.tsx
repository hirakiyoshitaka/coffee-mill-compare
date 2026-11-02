import { LocaleIndex, localeIndexMetadata } from "@/components/intl/LocaleIndex";

export const metadata = localeIndexMetadata("zh-cn");

export default function Page() {
  return <LocaleIndex locale="zh-cn" />;
}
