import { LocaleIndex, localeIndexMetadata } from "@/components/intl/LocaleIndex";

export const metadata = localeIndexMetadata("th");

export default function Page() {
  return <LocaleIndex locale="th" />;
}
