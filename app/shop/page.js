import Link from "next/link";
import { site, categories, categoryBySlug } from "../../lib/site";
import { getProductMap } from "../../lib/posts";

export const metadata = {
  title: "Shop — Orla Loom",
  description: "Every cottagecore pick from Orla Loom in one place — butter dishes, rugs, glassware, candles and more, each linking straight to where to buy.",
  alternates: { canonical: "/shop" },
};

export default function ShopIndex() {
  const products = [...getProductMap().values()];
  const byCat = {};
  for (const p of products) {
    (byCat[p.category] = byCat[p.category] || []).push(p);
  }
  const orderedCats = categories.filter((c) => byCat[c.slug] && byCat[c.slug].length);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shop — Orla Loom",
    url: `${site.url}/shop`,
    description: metadata.description,
  };

  return (
    <div className="article-wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="breadcrumb">
        <Link href="/">Home</Link> &nbsp;/&nbsp; <span style={{ color: "var(--ink)" }}>Shop</span>
      </div>

      <header className="article-head">
        <span className="eyebrow">Shop</span>
        <h1>Shop every Orla Loom pick</h1>
        <p style={{ color: "var(--muted,#7a6f60)", maxWidth: 640, lineHeight: 1.6 }}>
          Every hand-picked cottagecore find in one place. Tap any piece for the details and a direct link to buy.
        </p>
      </header>

      {orderedCats.map((c) => (
        <section key={c.slug} style={{ margin: "26px 0" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 style={{ margin: 0 }}>{c.name}</h2>
            <Link href={`/category/${c.slug}`} style={{ fontSize: 14, color: "var(--head)", fontWeight: 600 }}>All {c.name.toLowerCase()} →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
            {byCat[c.slug].map((p) => (
              <Link href={`/shop/${p.slug}`} key={p.slug} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: "var(--card,#fbf7f0)", border: "1px solid var(--line,#e7ddcf)", borderRadius: 12, overflow: "hidden", aspectRatio: "1 / 1" }}>
                  {p.image && <img src={p.image} alt={p.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginTop: 6, lineHeight: 1.3 }}>{p.name}</div>
                {p.price && <div style={{ fontSize: 12, color: "var(--muted,#7a6f60)" }}>{p.price}</div>}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
