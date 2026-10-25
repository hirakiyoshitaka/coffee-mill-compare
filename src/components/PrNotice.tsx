import Link from "next/link";

export function PrNotice() {
  return (
    <aside className="rounded-2xl border border-[var(--seal)]/30 bg-[#f8efe8] px-4 py-3 text-sm leading-relaxed text-stone-800">
      <p className="font-medium text-[var(--seal)]">広告（PR）</p>
      <p className="mt-1">
        この記事はアフィリエイト広告を含む場合があります。リンクから購入されると、当サイトが報酬を受け取ることがあります。紹介の順は報酬額では決めていません。価格は目安です。方針は
        <Link href="/disclosure" className="mx-1 font-medium text-[var(--accent)] underline underline-offset-4">
          広告表記
        </Link>
        にまとめています。
      </p>
    </aside>
  );
}
