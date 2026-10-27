import { LocaleIndex, localeIndexMetadata } from "@/components/intl/LocaleIndex";

export const metadata = localeIndexMetadata("zh-hk");

export default function Page() {
  return <LocaleIndex locale="zh-hk" />;
}
