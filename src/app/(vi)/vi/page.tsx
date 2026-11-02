import { LocaleIndex, localeIndexMetadata } from "@/components/intl/LocaleIndex";

export const metadata = localeIndexMetadata("vi");

export default function Page() {
  return <LocaleIndex locale="vi" />;
}
