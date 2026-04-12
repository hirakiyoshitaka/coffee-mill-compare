export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border-subtle)] bg-[var(--surface-muted)]/50 px-4 py-8 text-sm text-stone-600">
      <div className="mx-auto max-w-6xl space-y-3">
        <p className="font-medium text-stone-800">免責・データについて</p>
        <p>
          スペック・価格はメーカー公表値や市場の目安を基にしています。購入前は必ず最新の公式情報をご確認ください。口コミ欄は特定の投稿を転載したものではなく、コミュニティで繰り返し見られる論点を編集部が要約したものです。
        </p>
        <p className="text-xs text-stone-500">
          © {new Date().getFullYear()} coffee-mill-compare — 個人・学習用プロジェクト向けテンプレート
        </p>
      </div>
    </footer>
  );
}
