import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { formatJaDate, siteConfig } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "お問い合わせ",
  description: "おうち時間の道具箱への連絡方法。運営者よんぴーへのメール連絡先です。問い合わせフォームはありません。",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="page-wrap page-narrow">
      <Breadcrumb items={[{ href: "/", label: "ホーム" }, { label: "お問い合わせ" }]} />
      <h1 className="page-title">お問い合わせ</h1>
      <p className="mt-3 text-sm text-stone-500">最終更新：{formatJaDate(siteConfig.legalUpdated)}</p>
      <p className="mt-8 text-sm leading-relaxed text-stone-700">
        {siteConfig.name}への連絡は、メールで受け付けています。問い合わせフォームはありません。内容を確認し、必要なときに返信します。
      </p>
      <dl className="mt-8 space-y-6 text-sm leading-relaxed text-stone-700">
        <div>
          <dt className="font-medium text-stone-900">運営者</dt>
          <dd className="mt-1">よんぴー（個人運営）。個人の氏名、住所、電話番号は公開していません。</dd>
        </div>
        <div>
          <dt className="font-medium text-stone-900">サイト名</dt>
          <dd className="mt-1">{siteConfig.name}</dd>
        </div>
        <div>
          <dt className="font-medium text-stone-900">メール</dt>
          <dd className="mt-1">
            <a className="text-[var(--accent)] underline underline-offset-4" href={`mailto:${siteConfig.contactEmail}`}>
              {siteConfig.contactEmail}
            </a>
            <span className="mt-1 block text-stone-500">
              同じアドレスは
              <Link href="/about" className="mx-1 text-[var(--accent)] underline underline-offset-4">
                運営者情報
              </Link>
              にも載せています。
            </span>
          </dd>
        </div>
        <div>
          <dt className="font-medium text-stone-900">メールの扱い</dt>
          <dd className="mt-1">
            いただいたメールは、返信に必要な範囲で保持します。詳しくは
            <Link href="/privacy" className="mx-1 text-[var(--accent)] underline underline-offset-4">
              プライバシーポリシー
            </Link>
            を見てください。
          </dd>
        </div>
      </dl>
    </main>
  );
}
