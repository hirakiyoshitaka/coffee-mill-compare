const REL = "sponsored noopener";

/** もしも等のHTMLに、広告リンク用の rel を足す。script と onclick 系は取り除く。 */
export function prepareAffiliateHtml(html: string): string {
  const stripped = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\shref\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*')/gi, ' href="#"');

  return stripped.replace(/<a\b([^>]*?)>/gi, (_full, attrs: string) => {
    let next = attrs;
    if (/\srel\s*=/i.test(next)) {
      next = next.replace(/\srel\s*=\s*("([^"]*)"|'([^']*)')/i, (_match, _quoted, doubleQuoted: string | undefined, singleQuoted: string | undefined) => {
        const current = (doubleQuoted ?? singleQuoted ?? "").split(/\s+/).filter(Boolean);
        for (const token of ["sponsored", "noopener"]) {
          if (!current.includes(token)) current.push(token);
        }
        return ` rel="${current.join(" ")}"`;
      });
    } else {
      next += ` rel="${REL}"`;
    }
    if (!/\starget\s*=/i.test(next)) next += ' target="_blank"';
    return `<a${next}>`;
  });
}

export function isHttpUrl(value: string | undefined): value is string {
  if (!value) return false;
  return /^https?:\/\//i.test(value.trim());
}

export const affiliateRel = REL;
