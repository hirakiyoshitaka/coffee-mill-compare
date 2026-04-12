import Link from "next/link";

const nav = [
  { href: "/", label: "ホーム" },
  { href: "/compare", label: "比較" },
  { href: "/brands/comandante", label: "コマンダンテ" },
  { href: "/brands/kinu", label: "キヌ" },
  { href: "/brands/timemore", label: "タイムモア" },
  { href: "/brands/1zpresso", label: "1Zpresso" },
  { href: "/brands/epeios", label: "EPEIOS" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--border-subtle)] bg-[var(--surface)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:max-w-[90rem]">
        <Link href="/" className="group">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--accent-soft)]">
            Coffee Mill Compare
          </p>
          <p className="text-lg font-medium tracking-tight text-stone-900 group-hover:text-[var(--accent)]">
            コーヒーミル比較
          </p>
        </Link>
        <nav className="flex flex-wrap gap-x-3 gap-y-2 text-[13px] text-stone-600">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-2.5 py-1 transition hover:bg-stone-200/60 hover:text-stone-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
