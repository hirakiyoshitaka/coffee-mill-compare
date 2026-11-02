import { LocaleDisclosure, localeDisclosureMetadata } from "@/components/intl/LocaleDisclosure";

export const metadata = localeDisclosureMetadata("th");

export default function Page() {
  return <LocaleDisclosure locale="th" />;
}
