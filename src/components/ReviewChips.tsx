import type { CommunityReview } from "@/data/grinders";

const tone: Record<CommunityReview["tendency"], { label: string; className: string }> = {
  good: { label: "好意的な傾向", className: "bg-emerald-50 text-emerald-900 ring-emerald-200" },
  mixed: { label: "賛否あり", className: "bg-amber-50 text-amber-950 ring-amber-200" },
  watch: { label: "要検討ポイント", className: "bg-stone-100 text-stone-800 ring-stone-200" },
};

export function ReviewChips({ reviews }: { reviews: CommunityReview[] }) {
  return (
    <ul className="space-y-4">
      {reviews.map((r) => (
        <li
          key={r.id}
          className="rounded-xl border border-stone-200/80 bg-white/80 p-4 shadow-sm shadow-amber-900/5"
        >
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-stone-900">{r.theme}</span>
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${tone[r.tendency].className}`}
            >
              {tone[r.tendency].label}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-stone-700">{r.summary}</p>
        </li>
      ))}
    </ul>
  );
}
