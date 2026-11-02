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

# アフィリエイト運用方針（2026-11-03決定）

**English summary.** Break-even CPC is reward × approval rate × conversion rate; monthly profit is ad clicks × (break-even CPC − actual CPC). Judge every product in the private repo `hirakiyoshitaka/affiliate-roi` before writing (`keyword_roi.py` and `kw_seeds.py` stay unchanged). Line A is a small Google Search test that lands on our own articles; the owner publishes, changes the budget, and completes identity checks. Line B is SEO plus SNS, about three articles a week, with drafts and posts confirmed by the owner. Do not invent experience, reviews, results, or affiliate IDs, and do not touch passwords, cards, bank accounts, or identity documents. Report at the end of each stage and wait for OK.

この節の正本もこの `AGENTS.md` です。Cursor 向けの要点は `.cursor/rules/strategy.mdc` に置きます。方針を変えるときは、この節とその写しを同時に更新してください。

## 全体

損益分岐CPC = 報酬額 × 承認率 × 成約率。月利益 = 広告クリック数 ×（損益分岐CPC − 実際CPC）。

判定は、非公開リポジトリ `hirakiyoshitaka/affiliate-roi` の `keyword_roi.py` で行う。`keyword_roi.py` と `kw_seeds.py` は書き換えない。

手順は次のとおり。

1. `products.txt` を用意する。
2. Actions「1. キーワード候補を集める」を実行する。
3. キーワードプランナー（日本・日本語）の CSV を `data/` に push する。
4. Actions「2. 損益分岐CPCで判定」を実行する。
5. `out/roi_report.md` を見る。

どの商品も、記事にする前に必ずキーワードプランナーで確認する。

## ラインA PPC（Google広告）

1. **afb登録。** 運営者情報、プライバシーポリシー、問い合わせを整備する。パスワードと口座はオーナーが入力する。
2. **案件選定。** リスティング可、または条件付き。固定報酬は 3,000 円以上。成果条件が軽いものを選ぶ。損益分岐CPCが入札単価（高額帯）× 1.3 以上なら「勝てる」。Googleトレンド、実検索、予測タブで確認し、上位 3 案件に絞る。
3. **広告のリンク先。** 自サイトの記事にする。ASP の直リンクと、薄い中継ページは使わない。商標・指名ワードは入札しない。除外キーワードを入れ、誇大表現のない広告文案にする。
4. **少額テスト。** 検索キャンペーンのみ。ディスプレイと検索パートナーはオフ。地域は日本、言語は日本語。手動 CPC の上限は損益分岐 ÷ 1.3。1 日 1,000 円。マッチタイプはフレーズ一致と完全一致。公開ボタン、予算の変更、本人確認はオーナーが行う。「特典を選ぶ」は押さない。2 週間でクリック 100 回かつ成果 0 なら停止する。広告費が報酬を上回ったら停止する。実測の成約率で `offers.csv` を更新する。Amazon は有料広告経由が対象外。楽天・もしもは商標入札をしない（例: タイムモアは PPC 不可。集客は SEO）。

## ラインB SEO+SNS

週に約 10 商品を候補にする。出どころは、Amazon と楽天のランキング、A8・afb・もしも（固定報酬を優先）、Googleトレンド、X。

判定結果の「SEO向き」から、次の条件で残す。

- 月間検索は 100 以上。購買意図がある語、伸びが注目できる語は 10 以上でもよい。
- 前年比 −30% 以下は除外する。
- SEO 想定月収の高い順に並べる。
- 報酬は固定報酬を料率型より優先する。
- トレンド 5 年で右肩下がり、または一時的な急上昇は除外する。
- 検索上位が公式や大手ばかりなら後回しにする。個人ブログや知恵袋があれば狙い目にする。
- AI 回答が出る語は後回しにする。

記事の型は次の 4 つ。

1. まとめ: 「〇〇 おすすめ・比較」
2. 違い: 「AとBの違い」
3. レビュー
4. 情報（早見表など）。①〜③へ内部リンクする。

1 記事のメインの狙い語は 1 つ。週に約 3 本。

記事では、次を守る。

- 冒頭に「PR｜広告を含みます」と書く。
- タイトルと最初の見出しに狙い語を入れる。
- 比較表、選び方、メリット / デメリット、購入ボタンを置く。
- 内部リンクを入れる。
- 体験談、写真、実測値は作り話にしない。未記入は `【よんぴー実測：〇〇】` と `【写真：〇〇】` の空欄のままにする。
- 下書きをオーナーに確認してもらい、その後に公開する。

SNS は、公開日に 1 投稿し、数日後に別の切り口で 1 投稿する。`#PR` を付ける。リンクは自分の記事だけにする。Amazon への直リンクと有料宣伝はしない。投稿案は公開前にオーナーが確認する。

月に一度、サーチコンソールと ASP レポートを指標にする。順位が 11〜20 位の記事はリライトする。成果が出た商品は関連記事を足す。半年、集客がゼロのテーマは見直す。

## 共通

- 作り話の体験、口コミ、実績は書かない。
- 公開と SNS 投稿は、オーナーの確認の後にする。
- パスワード、カード、口座、本人確認書類には触らない。
- 各段階の終わりで報告し、OK をもらってから次へ進む。
- アフィリエイト ID は捏造しない。
