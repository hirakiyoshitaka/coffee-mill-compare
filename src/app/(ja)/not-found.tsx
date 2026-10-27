import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-wrap page-narrow">
      <p className="text-sm text-[var(--seal)]">404</p>
      <h1 className="page-title">ページがありません</h1>
      <p className="lede">アドレスが変わったか、まだ作っていないページです。</p>
      <p>
        <Link href="/" className="text-link">
          ホームへ戻る
        </Link>
      </p>
    </main>
  );
}
