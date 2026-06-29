import Link from "next/link";
import { notFound } from "next/navigation";
import { site, categories, categoryBySlug } from "../../../lib/site";
import { getPostsByCategory, getCategoryProducts } from "../../../lib/posts";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }) {
  const cat = categoryBySlug(params.slug);
  if (!cat) return {};
  const seoTitle = `Best Cottagecore ${cat.name} (2026)`;
  return {
    title: seoTitle,
    description: cat.blurb,
    alternates: { canonical: `/category/${params.slug}` },
    openGraph: { title: `${seoTitle} — ${site.name}`, description: cat.blurb, url: `${site.url}/category/${params.slug}`, images: cat.image ? [{ url: cat.image }] : [] },
  };
}

export default function CategoryPage({ params }) {
  const cat = categoryBySlug(params.slug);
  if (!cat) return notFound();
  const posts = getPostsByCategory(cat.slug);
  const products = getCategoryProducts(cat.slug);

  const url = `${site.url}/category/${cat.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": url,
        name: `${cat.name} — ${site.name}`,
        description: cat.blurb,
        url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: cat.name, item: url },
        ],
      },
      ...(posts.length
        ? [{
            "@type": "ItemList",
            itemListElement: posts.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.title,
              url: `${site.url}/blog/${p.slug}`,
            })),
          }]
        : []),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="cat-hero">
        <div>
          <div className="breadcrumb" style={{ marginBottom: 14 }}>
            <Link href="/">Home</Link> &nbsp;/&nbsp; {cat.name}
          </div>
          <span className="eyebrow">Category</span>
          <h1>{cat.name}</h1>
          <p>{cat.blurb}</p>
        </div>
        <div className="badge ph"><img src={cat.image} alt={`${cat.name} — cottagecore home decor`} loading="eager" /></div>
      </section>

      {/* SHOP — every product in this category */}
      {products.length > 0 && (
        <section className="section" style={{ paddingBottom: 12 }}>
          <div className="section-head">
            <span className="eyebrow">The finds</span>
            <h2 className="section-title">Shop all {cat.name.toLowerCase()} <span className="count">{products.length}</span></h2>
          </div>
          <div className="product-grid">
            {products.map((pr, i) => (
              <div className="product-card" key={i}>
                <div className="product-img ph">
                  {pr.image && <img src={pr.image} alt={pr.name} loading="lazy" />}
                  {pr.badge && <span className="product-badge">{pr.badge}</span>}
                </div>
                <div className="product-body">
                  <div className="product-name">{pr.name}</div>
                  <div className="product-meta">
                    {pr.brand}{pr.brand && pr.price ? " · " : ""}{pr.price}
                  </div>
                  {pr.url && (
                    <a className="btn product-btn" href={pr.url} target="_blank" rel="nofollow sponsored noopener">
                      Shop on {pr.retailer || "site"} →
                    </a>
                  )}
                  <Link className="from-guide" href={`/blog/${pr.guideSlug}`}>Read the guide →</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* GUIDES — deeper reading */}
      <section className="section" style={{ paddingTop: products.length ? 24 : 60 }}>
        {posts.length === 0 ? (
          <div className="callout">New finds for this category are landing soon — check back shortly. 🤍</div>
        ) : (
          <>
            <div className="section-head">
              <span className="eyebrow">Read</span>
              <h2 className="section-title">{cat.name} buyer's guides</h2>
            </div>
            <div className="guides-grid">
              {posts.map((p) => (
                <Link className="guide-card" href={`/blog/${p.slug}`} key={p.slug}>
                  <div className="ph"><img src={p.cover || cat.image} alt={p.title} loading="lazy" /></div>
                  <div className="guide-body">
                    <div className="guide-tag">{cat.name}</div>
                    <div className="guide-title">{p.title}</div>
                    <div className="guide-meta">{p.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
        <p style={{ marginTop: 34 }}>
          <Link className="see-all" href="/">&larr; All categories</Link>
        </p>
      </section>
    </>
  );
}
