import Link from "next/link";

export type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="パンくず" className="mb-6 text-sm text-stone-500">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {item.href && !last ? (
                <Link href={item.href} className="hover:text-[var(--accent)]">
                  {item.label}
                </Link>
              ) : (
                <span className="inline-block max-w-[min(70vw,32rem)] truncate align-bottom text-stone-800">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
