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
    .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
}
