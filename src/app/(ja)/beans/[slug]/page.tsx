import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BeanShopDetail } from "@/components/BeanViews";
import { Breadcrumb } from "@/components/Breadcrumb";
import { beanShops, getBeanShop } from "@/data/beans";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return beanShops.map((shop) => ({ slug: shop.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const shop = getBeanShop(slug);
  if (!shop) return {};
  const place = [shop.area, shop.company].filter(Boolean).join("・");
  return pageMeta({
    title: place ? `${shop.name}（${place}）` : shop.name,
    description: shop.summary,
    path: `/beans/${shop.slug}`,
  });
}

export default async function BeanShopPage({ params }: Props) {
  const { slug } = await params;
  const shop = getBeanShop(slug);
  if (!shop) notFound();

  const others = beanShops.filter((item) => item.slug !== shop.slug);

  return (
    <main className="page-wrap">
      <Breadcrumb
        items={[
          { href: "/", label: "ホーム" },
          { href: "/beans", label: "豆" },
          { label: shop.name },
        ]}
      />
      <BeanShopDetail shop={shop} />
      <section className="section-block">
        <div className="section-heading">
          <h2>ほかの店</h2>
          <Link href="/beans" className="text-link">
            豆の店一覧
          </Link>
        </div>
        <ul className="article-index">
          {others.map((item, index) => (
            <li key={item.slug}>
              <Link href={`/beans/${item.slug}`} className="article-card">
                <span className="article-number">{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <span className="category">{[item.area, item.company].filter(Boolean).join("・") || "焙煎豆の店"}</span>
                  <h3>{item.name}</h3>
                  <p>{item.summary}</p>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <Link href="/articles/first-beans-after-hand-mill" className="text-link">
            手挽きミルを買ったら最初に頼みたい豆
          </Link>
        </p>
      </section>
    </main>
  );
}
