# 購入リンクの確認（Cloudflare Worker）

公開サイトの購入リンクを読んで、切れている普通のリンクをレポートします。サイト本体、DNS、計測、アフィリエイト ID は変えません。

**まだデプロイしていません。** Cron も `wrangler.toml` に入れていません。ワーカーの公開と Cron の開始は、社長の OK を待ってからにします。

## 何を取りに行かないか

次の URL は取得しません。

- `px.a8.net`（`a8.net` の他のホストも）
- 楽天アフィリエイト（`afl.rakuten`、`hb.afl.rakuten` など）
- `invl.me`
- もしも（`af.moshimo.com` や `moshimo.com`）
- `tag=` の付いた URL
- Amazon のページ（`amazon.*` と、そこへ送る `amzn.to` など）
- 楽天の商品ページそのもの

バリューコマースと `shp.ee` も、同じ種類の飛び先なので取りません。

Amazon の在庫を見る公式の PA-API は、関数だけ残して止めてあります。売上 3 件のあと、社長の OK が出てからだけ有効にします。今は Amazon へリクエストしません。

## 楽天の在庫

楽天の在庫だけ、公式の商品検索 API を使います。

`https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701`

アプリ ID とアクセスキーは、環境の秘密情報 `RAKUTEN_APP_ID` と `RAKUTEN_ACCESS_KEY` から読みます。コードや `wrangler.toml` には書きません。アフィリエイト ID は送りません。リクエストは 1 秒に 1 回までです。

鍵がまだ無いときは、楽天のページも API も呼びません。在庫は未確認のままです。

商品コードは `item.rakuten.co.jp/店/商品` の形から取ります。楽天アフィリエイトの URL に `pc` で商品ページが入っているときも、その文字列から店と商品を読みます。飛び先そのものは取りに行きません。

## 普通のリンク

上に当てはまらないリンクは、`utm_` や `tag` などの計測パラメータを外してから HEAD します。HEAD が使えないときは GET します。飛び先が Amazon やアフィリエイトのホストなら、そこへは進みません。

`LINK_SOURCE_URL` が空なら、`SITE_ORIGIN/sitemap.xml` の同じサイトのページから購入リンクを集めます。別のサイトのサイトマップ URL はページとして取りません。

## レポート

- `dead` … HTTP 404 / 410 など
- `fetch_failed` … タイムアウトや HTTP 5xx（503 を除く）
- `blocked` … 401 / 403 / 429 / 503
- `rakuten_unavailable` … 公式 API で在庫なし、または商品が無い
- `rakuten_api_error` … 公式 API が失敗した

飛ばしたもの、Amazon の未確認、楽天の鍵待ちは、問題の件数には入れません。ページの自動非公開はしません。

JSON でリンクを渡すときの形です。購入先のホスト以外は無視します。

```json
{
  "links": [
    { "url": "https://shop.example/items/kettle?utm_source=news", "page": "https://ouchi-dougubako.com/articles/example/" }
  ]
}
```

## テスト

ネットワークは使いません。リポジトリのルートで実行します。

```bash
npx --yes tsx workers/link-check/src/policy.test.ts
npx --yes tsx workers/link-check/src/self-check.ts
```

## 公開するとき

公開と Cron は、社長の OK が出てからです。OK の前に `wrangler deploy` しないでください。

OK のあとで社長が行うことは、次のとおりです。

1. このフォルダで依存関係を入れる。
2. `npx wrangler login` は社長が自分で行う。
3. 楽天の鍵は、次で秘密情報として入れる。ファイルには書かない。

   ```bash
   npx wrangler secret put RAKUTEN_APP_ID
   npx wrangler secret put RAKUTEN_ACCESS_KEY
   ```

4. Cron を始めるときだけ、`wrangler.toml` にトリガーを足す。今は入っていません。
5. そのあとで `npx wrangler deploy` する。

`RUN_KEY` が空のあいだ、外から `GET /run` では動きません。鍵を入れるときも、リポジトリには書きません。

ログだけで足りるあいだ、KV のブロックはコメントのままにします。レポートは Worker のログに出ます。
