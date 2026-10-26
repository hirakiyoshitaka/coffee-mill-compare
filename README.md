# おうちカフェ道具帳

家でコーヒーを淹れる道具を、用途別に比べるサイトです。いま中身があるのは**手挽きのコーヒーミル**だけです。ドリッパーやケトルなどは、ページの枠だけ先に置いてあります。

プログラミングが初めてでも、下の手順どおりに進めれば公開できます。分からない言葉は、その場で短く説明します。

## このサイトに入っているもの

- トップページ、道具カテゴリ、読みもの（記事）
- 手挽きミルの比較と、ブランドごとのページ。先に勧めるのは栗子 S5 Pro とエペイオス Essence Go です
- 運営者情報、プライバシーポリシー、広告表記
- 記事の冒頭にある「広告（PR）」の表示
- 検索向けのタイトルと説明、シェアされたときに出る情報、`sitemap.xml`、`robots.txt`

価格はすべて**目安**です。購入リンクは、アドレスを入れた商品だけに出ます。空のままならボタンは出ません。

## 公開する（Cloudflare Pages）

Cloudflare Pages は、できた HTML をインターネットに置く無料の置き場です。このサイトは、サーバーを常時動かす種類ではなく、**完成したファイル一式**を置きます。

1. [Cloudflare](https://dash.cloudflare.com/) にアカウントを作り、ログインします。
2. 左のメニューから **Workers & Pages**（表記が **Compute** のこともあります）を開きます。
3. **Create** → **Pages** → **Connect to Git** を選びます。
4. GitHub のアカウントを接続し、このサイトのリポジトリを選びます。
5. ビルドの設定を、次のとおりにします。ここを間違えると公開に失敗します。
   - フレームワーク：**None**（なし）。または **Next.js (Static HTML Export)** があればそれ。
   - 「Next.js」とだけ書いてあり、静的書き出しと分からない選択肢は選ばないでください。サーバー用の設定になり、このサイトとは合いません。
   - ビルドコマンド：`npm run build`
   - ビルドの出力ディレクトリ：`out`
   - 本番ブランチ：普段使うブランチ（多くは `main`）
6. **Environment variables（環境変数）** を追加します。環境変数は、公開時だけ差し込む設定です。
   - 名前：`NEXT_PUBLIC_SITE_URL`
   - 値：公開されるアドレス。例 `https://ouchi-cafe.pages.dev`
   - `https://` から書き、最後に `/` は付けません。
   - 名前：`NODE_VERSION`
   - 値：`22`
7. 保存してデプロイ（公開作業）を開始します。数分待つと、`https://（プロジェクト名）.pages.dev` で見られます。
8. 表示されたアドレスが、手順6で入れた値と違うときは、`NEXT_PUBLIC_SITE_URL` をそのアドレスに直して、もう一度デプロイします。この値はビルドのときにページへ焼き付くので、あとから画面だけ変えても反映されません。
9. 自分のドメイン（`example.jp` のような住所）を使うときは、Pages の **Custom domains** から追加し、そのアドレスでもう一度 `NEXT_PUBLIC_SITE_URL` を更新して再デプロイします。

成功すると、`out` フォルダの中身がサイトになります。`.next` というフォルダは公開先ではありません。

## 購入リンクの入れ方

ファイルは `src/data/grinders.ts` です。GitHub のサイト上でも編集できます。

1. リポジトリのそのファイルを開きます。
2. 鉛筆アイコン（Edit）を押します。
3. 各ミルにある次の4つを探します。最初はすべて空です。

```ts
rakutenUrl: "",
amazonUrl: "",
yahooUrl: "",
moshimoHtml: "",
```

4. URL は、引用符のあいだに貼ります。例：

```ts
rakutenUrl: "https://hb.afl.rakuten.co.jp/...",
amazonUrl: "https://www.amazon.co.jp/...",
yahooUrl: "",
moshimoHtml: "",
```

5. もしもアフィリエイトの HTML には `"` が含まれるので、次のようにバッククォート（キーボードの `@` の左にあることが多い記号）で囲みます。

```ts
moshimoHtml: `
<a href="https://example.moshimo.com/...">商品名</a>
`,
```

6. 空の `""` のままの項目は、ボタンも HTML も出ません。入れたリンクには、自動で `rel="sponsored nofollow"` が付きます。
7. 下の **Commit changes** を押します。Git と連携していれば、Cloudflare が自動でもう一度公開します。

楽天・Amazon・もしもの会員登録や、商品リンクの発行は各サービスの画面で行います。この README では、発行済みの URL や HTML をサイトへ貼るところまでを扱います。

## 記事を追加する

`content` フォルダに、新しい `.md` ファイルを作ります。ファイル名がアドレスになります。例：`content/dripper-start.md` なら、ページは `/articles/dripper-start/` です。

ファイルの先頭は、次の形にしてください。日付は `年-月-日` です。`category` は、あるカテゴリの英語スラッグ（`mill` など）と一致させます。

```md
---
title: "記事のタイトル"
description: "検索結果や一覧に出る説明。1〜2文。"
category: "mill"
date: "2026-10-25"
---

ここに本文を書きます。
```

本文では、次の1行を置くと、そのミルの仕様カード（価格の目安つき）がデータから差し込まれます。

```md
{{grinder:comandante-c40}}
```

使える ID は `timemore-chestnut-s5-pro`、`epeios-essence-go`、`comandante-c40`、`timemore-chestnut-x`、`1zpresso-k-ultra`、`kinu-m47-classic` です。データにない数字や価格は、本文にも書かないでください。価格に触れるときは「目安」と分かる書き方にします。

豆の店カードは、次の1行です。

```md
{{bean:coffee-carrot}}
```

使える ID は `coffee-carrot`、`doi-coffee`、`leo-specialty-coffee`、`lab-cafe`、`sawai-coffee` です。

## 豆の購入リンク

ファイルは `src/data/beans.ts` です。各店に次の2つがあります。最初は空です。

```ts
a8Url: "",
rakutenUrl: "",
```

A8.net の URL は `a8Url`、楽天アフィリエイトの URL は `rakutenUrl` に貼ります。どちらも `https://` から書いたときだけ、「ショップで見る」「楽天市場で見る」のボタンが出ます。空のままならボタンは出ません。

`officialUrl` と `rakutenShopUrl` は、店の公開ページです。広告のボタンではありません。金額を足すときは、目安であることと、いつの紹介に基づくかを本文とデータの時点表記に残してください。

## 連絡先

運営者情報とプライバシーポリシーに出るメールアドレスは `hiraki19680812@gmail.com` です。変えるときは `src/data/site.ts` の `contactEmail` を書き換えます。見本のアドレスに戻す場合だけ、`contactEmailIsPlaceholder` を `true` にしてください。

個人の氏名や住所は、最初から載せていません。載せる場合は運営者情報のページ（`src/app/about/page.tsx`）を編集します。

## 手元のパソコンで見る（任意）

公開だけなら、この手順は不要です。

1. [Node.js 22](https://nodejs.org/) を入れます。
2. このフォルダで、次を実行します。

```bash
npm install
npm run dev
```

3. ブラウザで <http://localhost:3000> を開きます。
4. 公開と同じ結果を確認するときは、`npm run build` のあと、`out` フォルダの中身を見ます。

## 仕組みのメモ（読まなくても公開できます）

- Next.js の静的書き出し（`output: 'export'`）です。画像の最適化サーバーは使わず、`images.unoptimized` にしています。Cloudflare Pages は HTML を置くだけで動きます。
- 各ページの URL は、末尾に `/` が付く形で書き出します（例：`/articles/coffee-mill-ranking/index.html`）。Pages はこの形を問題なく配信できます。
- 準備中のカテゴリは、人が開けるページとしては存在しますが、検索結果には出さない設定（noindex）です。中身ができてから検索対象にします。
- サイトマップに載るのは、ホーム、道具一覧、ミル、豆の店と各店、比較、ブランド、記事、運営者情報、プライバシーポリシー、広告表記です。豆のカテゴリ枠（`/categories/beans/`）は、豆の店（`/beans/`）へ案内するページで、検索結果には出しません。
