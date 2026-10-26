import Link from "next/link";

export function PrNotice() {
  return (
    <aside className="border border-[var(--line)] bg-[var(--soft)] px-5 py-4 text-[16px] leading-[1.9]">
      <p className="font-bold text-[var(--accent)]">広告（PR）</p>
      <p className="mt-1">
        広告・アフィリエイトリンクを含みます。Amazonのアソシエイトとして、当サイトは適格販売により収入を得ています。リンクから購入されると、当サイトが報酬を受け取ることがあります。紹介の順は報酬額では決めていません。価格は目安です。方針は
        <Link href="/disclosure" className="mx-1 font-bold text-[var(--accent-dark)] underline underline-offset-4">
          広告表記
        </Link>
        にまとめています。
      </p>
    </aside>
  );
}
