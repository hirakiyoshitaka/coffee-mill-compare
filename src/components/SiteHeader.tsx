import Link from "next/link";

const nav = [
  { href: "/", label: "ホーム" },
  { href: "/compare", label: "スペック比較" },
  { href: "/brands/comandante", label: "コマンダンテ" },
  { href: "/brands/timemore", label: "タイムモア" },
  { href: "/brands/1zpresso", label: "1Zpresso" },
  { href: "/brands/epeios", label: "EPEIOS" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-amber-900/15 bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="group">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-800/80">
            Coffee Mill Compare
          </p>
          <p className="text-lg font-semibold tracking-tight text-stone-900 group-hover:text-amber-900">
            コーヒーミル比較
          </p>
        </Link>
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-stone-700">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-1 py-0.5 hover:bg-amber-100/80 hover:text-amber-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
