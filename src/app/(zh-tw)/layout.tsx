import { Analytics } from "@vercel/analytics/next";
import "../globals.css";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-TW" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <div id="main" className="flex-1">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
