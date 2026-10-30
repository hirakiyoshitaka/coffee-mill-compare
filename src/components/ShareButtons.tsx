type Props = { url: string; title: string; label: string };

/** 記事末尾のシェアボタン。外部サービスの共有画面を開くだけで、投稿自体は読者が行う。 */
export function ShareButtons({ url, title, label }: Props) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title} ${url}`);
  const links = [
    { name: "X", href: `https://x.com/intent/post?text=${encodedText}` },
    { name: "Threads", href: `https://www.threads.net/intent/post?text=${encodedText}` },
    { name: "LINE", href: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}` },
  ];
  return (
    <section className="mt-14 border-t border-[var(--border-subtle)] pt-8" aria-label={label}>
      <h2 className="font-serif text-xl text-stone-950">{label}</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label}: ${link.name}`}
            className="rounded-full border border-[var(--border-subtle)] px-4 py-2 text-sm font-bold text-[var(--accent-dark)] hover:underline"
          >
            {link.name}
          </a>
        ))}
      </div>
    </section>
  );
}
