import { LocaleDisclosure, localeDisclosureMetadata } from "@/components/intl/LocaleDisclosure";

export const metadata = localeDisclosureMetadata("zh-hk");

export default function Page() {
  return <LocaleDisclosure locale="zh-hk" />;
}
