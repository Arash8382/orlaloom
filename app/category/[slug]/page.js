import Link from "next/link";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { site, categories, categoryBySlug } from "../../../lib/site";
import { getPostsByCategory, getCategoryProducts } from "../../../lib/posts";
import ShopScene from "../../components/ShopScene";
import AlbumGrid from "../../components/AlbumGrid";

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
  const hasScene = fs.existsSync(path.join(process.cwd(), "public", "scenes", `${cat.slug}.webp`));

  const url = `${site.url}/category/${cat.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", "@id": url, name: `${cat.name} — ${site.name}`, description: cat.blurb, url },
      { "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: cat.name, item: url },
        ] },
      ...(posts.length ? [{ "@type": "ItemList", itemListElement: posts.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.title, url: `${site.url}/blog/${p.slug}` })) }] : []),
    ],
  };

  // IMAGE-FIRST shoppable layout for categories that have a scene.
  if (hasScene) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="container" style={{ paddingTop: 18 }}>
          <div className="breadcrumb"><Link href="/">Home</Link> &nbsp;/&nbsp; {cat.name}</div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(24px,3.4vw,36px)", color: "var(--head)", margin: "10px 0 0" }}>Best Cottagecore {cat.name}</h1>
          {cat.intro && <p style={{ color: "var(--muted-2)", maxWidth: "72ch", marginTop: 10, lineHeight: 1.65 }}>{cat.intro}</p>}
        </div>

        <ShopScene scene={cat.slug} title={`Shop the ${cat.name}`} subtitle="Tap any piece to shop it." />

        {/* Album grid — image-only product tiles, hover reveals name/price, click → retailer */}
        <AlbumGrid products={products} catName={cat.name} />

        {/* Minimal guides strip — keeps internal links + SEO without cluttering the visual */}
        {posts.length > 0 && (
          <section className="container" style={{ padding: "10px 48px 46px" }}>
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 18, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--terra)", marginRight: 6 }}>Guides</span>
              {posts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ fontSize: 13, color: "var(--muted-2)", textDecoration: "none", background: "#fff", border: "1px solid var(--line)", borderRadius: 20, padding: "5px 12px" }}>{p.title}</Link>
              ))}
              <Link href="/" style={{ fontSize: 13, fontWeight: 700, color: "var(--terra)", marginLeft: "auto" }}>&larr; All categories</Link>
            </div>
          </section>
        )}
      </>
    );
  }

  // Classic grid layout for categories without a scene yet.
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="container" style={{ paddingTop: 26, paddingBottom: 2 }}>
        <div className="breadcrumb" style={{ marginBottom: 8 }}>
          <Link href="/">Home</Link> &nbsp;/&nbsp; {cat.name}
        </div>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px,4vw,42px)", color: "var(--head)", margin: 0 }}>{cat.name}</h1>
        <p style={{ color: "var(--muted-2)", marginTop: 8, maxWidth: "56ch" }}>{cat.blurb}</p>
        {cat.intro && <p style={{ color: "var(--muted-2)", marginTop: 10, maxWidth: "64ch", lineHeight: 1.65 }}>{cat.intro}</p>}
      </header>

      {products.length > 0 && (
        <section className="section" style={{ paddingTop: 24, paddingBottom: 12 }}>
          <div className="section-head">
            <span className="eyebrow">The finds</span>
            <h2 className="section-title">Shop all {cat.name.toLowerCase()} <span className="count">{products.length}</span></h2>
          </div>
          <div className="product-grid">
            {products.map((pr, i) => (
              <div className="product-card" key={i}>
                <div className="product-img ph">
                  {pr.image && (pr.url ? (
                    <a className="img-link" href={pr.url} target="_blank" rel="nofollow sponsored noopener" aria-label={pr.name}>
                      <img src={pr.image} alt={pr.name} loading="lazy" />
                    </a>
                  ) : (
                    <img src={pr.image} alt={pr.name} loading="lazy" />
                  ))}
                  {pr.badge && <span className="product-badge">{pr.badge}</span>}
                </div>
                <div className="product-body">
                  <div className="product-name">{pr.name}</div>
                  <div className="product-meta">{pr.brand}{pr.brand && pr.price ? " · " : ""}{pr.price}</div>
                  {pr.url && (
                    <a className="btn product-btn" href={pr.url} target="_blank" rel="nofollow sponsored noopener">Shop on {pr.retailer || "site"} →</a>
                  )}
                  <Link className="from-guide" href={`/blog/${pr.guideSlug}`}>Read the guide →</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
