import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

export function renderMarkdown(source: string): string {
  const html = marked.parse(source, { async: false });
  return html
    .replace(/<table>/g, '<div class="table-scroll"><table>')
    .replace(/<\/table>/g, "</table></div>")
    .replace(/href="(\/[^"#?]*)"/g, (_match, href: string) => {
      const path = href.endsWith("/") ? href : `${href}/`;
      return `href="${path}"`;
    })
    .replace(/<a href="(https?:\/\/[^"]+)"/g, (_match, href: string) => {
      const affiliate = /(?:^https?:\/\/)(?:www\.)?(?:amazon\.co\.jp|amzn\.to|amzn\.asia|amzn\.com)\b|afl\.rakuten\.co\.jp|moshimo\.com|px\.a8\.net|valuecommerce\.com/i.test(href);
      const rel = affiliate ? "sponsored noopener" : "noopener noreferrer";
      return `<a href="${href}" target="_blank" rel="${rel}"`;
    });
}
