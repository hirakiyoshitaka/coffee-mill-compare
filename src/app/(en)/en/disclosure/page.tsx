import { LocaleDisclosure, localeDisclosureMetadata } from "@/components/intl/LocaleDisclosure";

export const metadata = localeDisclosureMetadata("en");

export default function Page() {
  return <LocaleDisclosure locale="en" />;
}
