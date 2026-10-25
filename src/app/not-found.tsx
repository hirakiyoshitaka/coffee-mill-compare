import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm text-[var(--seal)]">404</p>
      <h1 className="mt-2 font-serif text-3xl text-stone-950">ページがありません</h1>
      <p className="mt-4 text-sm leading-relaxed text-stone-600">アドレスが変わったか、まだ作っていないページです。</p>
      <p className="mt-6">
        <Link href="/" className="text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline">
          ホームへ戻る
        </Link>
      </p>
    </main>
  );
}
