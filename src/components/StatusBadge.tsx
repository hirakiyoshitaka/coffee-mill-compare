import type { CategoryStatus } from "@/data/categories";

export function StatusBadge({ status }: { status: CategoryStatus }) {
  if (status === "live") {
    return (
      <span className="inline-flex rounded-full bg-[#e7f0e6] px-2 py-0.5 text-[11px] font-medium text-[#1d4d32]">
        公開中
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-[#efe6d8] px-2 py-0.5 text-[11px] font-medium text-[#5c4a3a]">
      準備中
    </span>
  );
}
