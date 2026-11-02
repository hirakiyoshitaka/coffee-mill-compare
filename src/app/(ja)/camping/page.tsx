import { CampingHub } from "@/components/CampingHub";
import { campingHubCopy, campingLanguages } from "@/data/camping";
import { pageMeta } from "@/lib/seo";

const copy = campingHubCopy.ja;
const base = pageMeta({
  title: copy.title,
  description: copy.description,
  path: "/camping",
});

export const metadata = { ...base, alternates: { ...base.alternates, languages: campingLanguages() } };

export default function CampingPage() {
  return <CampingHub locale="ja" />;
}
