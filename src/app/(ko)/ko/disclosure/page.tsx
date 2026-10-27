import { LocaleDisclosure, localeDisclosureMetadata } from "@/components/intl/LocaleDisclosure";

export const metadata = localeDisclosureMetadata("ko");

export default function Page() {
  return <LocaleDisclosure locale="ko" />;
}
