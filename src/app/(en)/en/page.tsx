import { LocaleIndex, localeIndexMetadata } from "@/components/intl/LocaleIndex";

export const metadata = localeIndexMetadata("en");

export default function Page() {
  return <LocaleIndex locale="en" />;
}
