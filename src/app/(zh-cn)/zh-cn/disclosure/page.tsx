import { LocaleDisclosure, localeDisclosureMetadata } from "@/components/intl/LocaleDisclosure";

export const metadata = localeDisclosureMetadata("zh-cn");

export default function Page() {
  return <LocaleDisclosure locale="zh-cn" />;
}
