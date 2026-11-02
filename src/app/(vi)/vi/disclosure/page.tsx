import { LocaleDisclosure, localeDisclosureMetadata } from "@/components/intl/LocaleDisclosure";

export const metadata = localeDisclosureMetadata("vi");

export default function Page() {
  return <LocaleDisclosure locale="vi" />;
}
