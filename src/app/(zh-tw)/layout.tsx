import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { LocaleFooter, LocaleHeader } from "@/components/intl/LocaleChrome";
import { chromeDict } from "@/lib/i18n";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-TW" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
        >
          {chromeDict["zh-tw"].skip}
        </a>
        <LocaleHeader locale="zh-tw" />
        <div id="main" className="flex-1">
          {children}
        </div>
        <LocaleFooter locale="zh-tw" />
        <Analytics />
      </body>
    </html>
  );
}
