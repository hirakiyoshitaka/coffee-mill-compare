import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { LanguageSwitcher } from "@/components/intl/LanguageSwitcher";
import { PrNotice } from "@/components/PrNotice";
import { campingHubCopy, campingHubPaths, orderCamping, type CampingLocale } from "@/data/camping";
import { formatJaDate } from "@/data/site";
import { getArticlesByCategory, getLocalizedArticles } from "@/lib/articles";
import { chromeDict } from "@/lib/i18n";

export function CampingHub({ locale }: { locale: CampingLocale }) {
  const copy = campingHubCopy[locale];
  const articles = orderCamping(
    locale === "ja" ? getArticlesByCategory("camping") : getLocalizedArticles(locale).filter((article) => article.category === "camping"),
  );
  const articleHref = (slug: string) => (locale === "ja" ? `/articles/${slug}/` : `/${locale}/articles/${slug}/`);

  return (
    <main className="page-wrap page-narrow">
      {locale === "ja" ? <Breadcrumb items={[{ href: "/", label: "ホーム" }, { label: copy.title }]} /> : null}
      <LanguageSwitcher current={locale} paths={campingHubPaths()} label={locale === "ja" ? "言語" : chromeDict[locale].lang} />
      <header className="mb-8">
        <p className="hero-kicker">{copy.kicker}</p>
        <h1 className="page-title">{copy.title}</h1>
        <p className="lede">{copy.lead}</p>
      </header>
      {locale === "ja" ? <PrNotice /> : <p className="fine">{copy.note}</p>}
      {locale === "ja" ? <p className="mt-6 text-sm leading-relaxed text-stone-600">{copy.note}</p> : null}
      <ul className="article-index mt-8">
        {articles.map((article, index) => (
          <li key={article.slug}>
            <Link href={articleHref(article.slug)} className="article-card">
              <span className="article-number">{String(index + 1).padStart(2, "0")}</span>
              <span>
                <span className="category">
                  <time dateTime={article.date}>{locale === "ja" ? formatJaDate(article.date) : article.date}</time>
                </span>
                <h3>{article.title}</h3>
                <p>{article.description}</p>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
