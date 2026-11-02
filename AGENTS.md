<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# サイト運営方針（2026-11-03決定）

**English summary.** Target at least ¥200,000 per month with a global, micro-niche site: first-person “best 3” rankings and comparisons, written in each market’s language (ja, en, zh-tw, zh-hk, zh-cn, ko, th, vi, and others) for North America, Europe, Asia, and Australia, linking to that country’s Amazon. Theme: things a 58-year-old office worker actually used that improved quality of life. Photos and personal impressions only for products the operator uses; label everything else a review roundup and never pretend to have used it. Do not copy third-party text or photos, invent affiliate IDs, or send paid-ad traffic straight to Amazon. Specs come from official sources only. Prioritize premium coffee machines, portable power stations, Japanese knives, and work-from-home furniture (kitchen and home pay about 5% in the UK and Europe). Defer PCs, TVs, and games. Keep the existing affiliate, disclosure, hreflang, sitemap, and analytics rules.

この節が Codex、Muse、Cursor、Claude Code の共通方針です。方針の正本はこの `AGENTS.md` です。Claude Code は `CLAUDE.md` の `@AGENTS.md` から読みます。Cursor は `.cursor/rules/strategy.mdc` に同じ方針を置きます。方針を変えるときは、この節と `strategy.mdc` の写しを同時に更新し、上の Next.js 向け注記と `CLAUDE.md` の参照は残してください。

記事、導線、多言語、計測、データに触れる作業は、この方針に合わせてください。

## 目標

月¥200,000以上。読者は世界向け（北米・欧州・アジア・オーストラリア）で、各市場の言語で書く（ja、en、zh-tw、zh-hk、zh-cn、ko、th、vi ほか）。購入導線は、その市場の Amazon につなぐ。

## 構造

マイクロ特化型にする。テーマは「58歳の会社員が実際に使ってQOLが上がったもの」。ジャンルごとのハブ（コーヒー、ゴルフ、在宅ワーク、キッチン、キャンプなど）を置く。

## 記事の形

生活感と人のぬくもりのある「ベスト3」ランキングと比較記事を軸にする。運営者の一人称で書き、購買意欲につなげる。

## 一次情報

運営者が使っているものには、写真と感想を入れる。対象は次のとおり。

- Timemore S5 Pro
- EPEIOS Essence Go
- Nikon COOLSHOT 手ブレ補正最上位
- 折りたたみ昇降デスク
- 細口ドリップポット
- 珈琲きゃろっとの豆

使っていないものは「レビューまとめ」と明記する。使ったふりをしない。手元にない製品を、使った体験として書かない。写真も、運営者が撮ったものか、掲載が許された公式素材に限る。

## 禁止

- 第三者の文章・写真をコピーしない。
- アフィリエイト ID を捏造しない。
- 有料広告から Amazon へ直接送客しない。
- スペックは公式情報のみを使う。公式に無い数値、味の点数、架空の最安値は書かない。

## 優先ジャンル（調査結果）

先に扱うのは、高級コーヒーマシン、ポータブル電源、日本製包丁、在宅ワーク家具。キッチン・ホーム系は英国と欧州で報酬率5%と有利なため、ここを厚くする。PC・テレビ・ゲームは後回し。

## 既存の規約

既存のアフィリエイトリンク、広告表記、hreflang、サイトマップ、アクセス解析の規約を守る。実装や記事を変えても、次は崩さない。

- **アフィリエイトリンク:** 空の URL や HTML には購入ボタンを出さない。Amazon のアソシエイトタグは、いま入っている `tag=stocknotelife-22` だけを使う。リンクの `rel` は `sponsored nofollow noopener`、`target` は `_blank` とする（`src/lib/affiliate.ts`）。楽天市場、Amazon、Yahoo!ショッピング、A8.net、もしもアフィリエイトなど、既にある経路を別サービスへ勝手に置き換えない。
- **広告表記:** 記事タイトル上と本文前の「PR」、フッター、`/disclosure`（広告表記）を維持する。購入リンクがあるページでは、広告であることを先に示す。景品表示法上のステルスマーケティング規制に沿う。
- **hreflang:** `src/lib/articles.ts` の `hreflangOf`（ja、zh-TW、zh-HK、zh-CN、ko、th、vi、en）と、同じ slug の `alternates.languages`（`x-default` を含む）を維持する。翻訳記事は `content/<locale>/` に置く。言語を増やすときは、言語切替、hreflang、サイトマップを揃える。
- **サイトマップ:** `src/app/sitemap.ts` と `src/app/robots.ts` の `sitemap.xml` を、公開している URL と一致させる。
- **アクセス解析:** 各言語レイアウトにある Vercel Analytics（`@vercel/analytics/react` の `<Analytics />`）を外さない。計測を変えるときは、プライバシーポリシー（`/privacy`）の記載と合わせる。
