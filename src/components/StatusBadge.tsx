import type { CategoryStatus } from "@/data/categories";

export function StatusBadge({ status }: { status: CategoryStatus }) {
  if (status === "live") {
    return <span className="status-live">公開中</span>;
  }
  return <span className="status-soon">準備中</span>;
}
