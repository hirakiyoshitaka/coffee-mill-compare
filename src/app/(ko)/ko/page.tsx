import { LocaleIndex, localeIndexMetadata } from "@/components/intl/LocaleIndex";

export const metadata = localeIndexMetadata("ko");

export default function Page() {
  return <LocaleIndex locale="ko" />;
}
