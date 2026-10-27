import RootLayout, { metadata as jaMetadata } from "./(ja)/layout";
import NotFound from "./(ja)/not-found";

// 言語ごとにルートレイアウトが分かれているため、404 は日本語レイアウトで共通表示する。
export const metadata = jaMetadata;

export default function GlobalNotFound() {
  return (
    <RootLayout>
      <NotFound />
    </RootLayout>
  );
}
