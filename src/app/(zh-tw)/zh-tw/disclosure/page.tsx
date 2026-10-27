import { LocaleDisclosure, localeDisclosureMetadata } from "@/components/intl/LocaleDisclosure";

export const metadata = localeDisclosureMetadata("zh-tw");

export default function Page() {
  return <LocaleDisclosure locale="zh-tw" />;
}
