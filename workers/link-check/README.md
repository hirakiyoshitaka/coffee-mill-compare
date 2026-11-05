# 購入リンクの死活チェック（Cloudflare Worker）

公開サイトの購入リンクを読み、404 などの切れたリンクと、Amazon の「取り扱いなし / 出品なし」をレポートします。サイト本体、DNS、計測、アフィリエイト ID は変えません。

**このフォルダをリポジトリに追加した時点では、デプロイしていません。** デプロイと Cron の有効化はオーナーが行います。

## 何を見るか

1. `LINK_SOURCE_URL` が空なら、`SITE_ORIGIN/sitemap.xml` のページを取得する。サイトマップ索引なら、同じオリジンの子サイトマップも読む。
2. 各ページの購入リンクを集める。対象は、既知の購入先ホスト（Amazon、楽天アフィリエイト、A8.net、もしも、ValueCommerce、Involve Asia の `invl.me`、Shopee、Yahoo!ショッピング）と、`class="buy-link"` の http(s) リンク。
3. 別オリジンのサイトマップ URL はページとして取得しない。
4. 各リンクを GET し、次をレポートする。
   - `dead` … HTTP 404 / 410、その他の 4xx（拒否・制限を除く）、エラーページへの着地
   - `fetch_failed` … タイムアウト、接続失敗、HTTP 5xx（503 を除く。503 は `blocked`）
   - `amazon_unavailable` … 「Currently unavailable」「現在在庫切れ」「この商品は現在お取り扱いできません」、schema.org の OutOfStock / SoldOut / Discontinued など
   - `amazon_no_offer` … 「No featured offers available」「出品者が見つかりません」など
   - `blocked` … 401 / 403 / 429 / 503、または Amazon のロボット確認。売り切れとは分けて出る

Amazon はデータセンターからの取得を止めることがあります。`blocked` は在庫切れではありません。レポートは確認用で、ページの自動非公開はしません。

`LINK_SOURCE_URL` に JSON を置く場合の形:

```json
{
  "links": [
    { "url": "https://www.amazon.co.jp/dp/B0HF4LXCCY?tag=stocknotelife-22", "page": "https://ouchi-dougubako.com/articles/timemore-chestnut-s5-pro/" }
  ]
}
```

購入先ホスト以外の URL は無視します。

## デプロイ手順（オーナー）

1. Cloudflare アカウントで、このフォルダをワーカーとして置く権限があることを確認する。
2. このフォルダで依存関係を入れる。

   ```bash
   cd workers/link-check
   npm install
   npx wrangler login
   ```

3. `wrangler.toml` のプレースホルダを確認する。
   - `SITE_ORIGIN` は公開サイトのオリジン（末尾スラッシュなし）。今の初期値は `https://ouchi-dougubako.com`。
   - Cron は毎日 18:00 UTC。時刻を変えるなら `crons` を書き換えてからデプロイする。
   - `LINK_SOURCE_URL` は空のままで、サイトマップから読む。
   - `RUN_KEY` は空のままにする。空のあいだ `GET /run` は 404 で、外部からチェックを起動できない。
4. ログだけで足りるなら、KV のブロックはコメントのままにする。レポートは Worker のログに出る。
5. KV にも残す場合:

   ```bash
   npx wrangler kv namespace create LINK_REPORTS
   ```

   表示された id を `wrangler.toml` の `REPLACE_WITH_KV_NAMESPACE_ID` に入れ、`[[kv_namespaces]]` の3行のコメントを外す。binding 名は `REPORTS` のままにする。
6. デプロイする。

   ```bash
   npx wrangler deploy
   ```

   これで Cron Trigger が有効になる。手動ではデプロイしないこと。アカウントと支払いの操作はオーナーが行う。
7. ログを見る。

   ```bash
   npx wrangler tail
   ```

   要約は `link-check <時刻> source=sitemap ... issues=<件数>`。問題は `link-check issue <kind> ...`。
8. KV を有効にした場合、最新は `report:latest`、日付ごとは `report:YYYY-MM-DD`。

   ```bash
   npx wrangler kv key get report:latest --namespace-id REPLACE_WITH_KV_NAMESPACE_ID
   ```

## 手元で一度だけ動かす

本番の Cron を待たずに試すとき:

```bash
npx wrangler dev
```

別の端末で、開発用の Cron を撃つ（Wrangler が案内するローカル URL に合わせる）:

```bash
curl "http://localhost:8787/cdn-cgi/handler/scheduled"
```

`wrangler dev` は `SITE_ORIGIN` の公開ページと、そこから見つかった購入リンクへ実際に GET する。

ブラウザから手動実行したいときだけ、空の `RUN_KEY` 行を `wrangler.toml` から消し、秘密として入れる。

```bash
npx wrangler secret put RUN_KEY
npx wrangler deploy
```

その後の起動は `GET /run?key=...`。キーはリポジトリに書かない。

## ロジックの確認

ネットワークを使わない自己チェック:

```bash
npx --yes tsx workers/link-check/src/self-check.ts
```

リポジトリのルートで実行する。
