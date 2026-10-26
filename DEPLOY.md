# Cloudflare Pages への公開

このサイトは `output: 'export'` の静的サイトです。Pages には、ビルドでできた `out/` を置きます。

## 設定

| 項目 | 値 |
| --- | --- |
| フレームワーク | None。または Next.js (Static HTML Export)。サーバー用の Next.js は選ばない |
| ビルドコマンド | `npm run build` |
| 出力ディレクトリ | `out` |
| Node.js | 22（環境変数 `NODE_VERSION` = `22`） |
| ルート | リポジトリの直下 |

環境変数 `NEXT_PUBLIC_SITE_URL` に、公開するアドレスを `https://` から、末尾の `/` なしで入れます。未設定のビルドは `https://ouchi-cafe-dougucho.pages.dev` をサイトのアドレスとして使います。別のドメインで公開するときは、この環境変数をそのアドレスにしてからビルドし直します。sitemap、robots、canonical はビルド時のアドレスで焼き付きます。

## ビルドが置くもの

- `out/` が公開物です。`.next` は公開しません。
- `public/` のファイルは `out/` の同じパスにコピーされます。製品画像は `/images/timemore-s5-pro-green.webp` です。`basePath` は使っていません。
- `out/robots.txt` と `out/sitemap.xml` は、`src/app/robots.ts` と `src/app/sitemap.ts` からビルド時に生成されます。`public/robots.txt` を別に置くと、同じパスが衝突してビルドが失敗します。
- 楽天と Unsplash の画像は、見た人のブラウザがそれぞれのホストから読みます。静的ホストは代理しません。
