# 公開

本番は Vercel です。アドレスは https://coffee-mill-compare.vercel.app です。GitHub の `main` へマージすると、自動でデプロイされます。

このサイトは `output: 'export'` の静的サイトです。Vercel はビルドでできた `out/` を公開します。

## 設定

| 項目 | 値 |
| --- | --- |
| 本番 | Vercel。`main` へのマージで自動デプロイ |
| 本番URL | `https://coffee-mill-compare.vercel.app` |
| ビルドコマンド | `npm run build` |
| 出力ディレクトリ | `out` |
| Node.js | 22 |
| ルート | リポジトリの直下 |

環境変数 `NEXT_PUBLIC_SITE_URL` は任意です。未設定のビルドは `https://coffee-mill-compare.vercel.app` をサイトのアドレスとして使います。別のドメインで公開するときは、この環境変数を `https://` から、末尾の `/` なしで入れてからビルドし直します。sitemap、robots、canonical はビルド時のアドレスで焼き付きます。

## ビルドが置くもの

- `out/` が公開物です。`.next` は公開しません。
- `public/` のファイルは `out/` の同じパスにコピーされます。製品画像は `/images/timemore-s5-pro-green.webp` です。`basePath` は使っていません。
- `out/robots.txt` と `out/sitemap.xml` は、`src/app/robots.ts` と `src/app/sitemap.ts` からビルド時に生成されます。`public/robots.txt` を別に置くと、同じパスが衝突してビルドが失敗します。
- 楽天と Unsplash の画像は、見た人のブラウザがそれぞれのホストから読みます。静的ホストは代理しません。
