import Link from "next/link";
import { site, categories, categoryImage } from "../lib/site";
import { getAllPosts, getPostsByCategory, getCategoryThumbPool, getProductMap } from "../lib/posts";
import RotatingCategories from "./components/RotatingCategories";
import RotatingGuides from "./components/RotatingGuides";
import MobileGuidedPicker from "./components/MobileGuidedPicker";

export const metadata = { alternates: { canonical: "/" } };

const bg = (url) => ({
  backgroundImage: `url(${url})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
});

export default function Home() {
  // Full pools passed to the client so the homepage can shuffle a fresh
  // selection on every visit (see RotatingCategories / RotatingGuides).
  const catCards = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    guideCount: getPostsByCategory(c.slug).length,
    thumbs: getCategoryThumbPool(c.slug),
    fallback: c.image,
  }));

  const allGuides = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    cover: p.cover || categoryImage(p.category),
    catName: (categories.find((c) => c.slug === p.category) || {}).name || "Guide",
  }));

  // Newest guides, so the homepage always surfaces fresh content (the daily
  // generator adds ~1/day). getAllPosts() is already sorted newest-first.
  const latest = getAllPosts().slice(0, 4).map((p) => ({
    slug: p.slug,
    title: p.title,
    cover: p.cover || categoryImage(p.category),
    catName: (categories.find((c) => c.slug === p.category) || {}).name || "Guide",
    date: p.date,
  }));
  const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const isNew = (d) => Date.now() - new Date(d).getTime() < 12 * 864e5;

  // Data for the mobile-only storefront (Amazon-style). Filter chips on top, a
  // scrollable grid of ALL products below. Every product is tagged with a
  // "space" group so a chip can filter the grid in place. Links to /shop/[slug].
  const groupOf = {
    rugs: "living",
    "home-decor": "living",
    "butter-dishes": "kitchen",
    "cottagecore-kitchen": "kitchen",
    "retro-appliances": "kitchen",
    "scalloped-dinnerware": "table",
    glassware: "table",
    candles: "cosy",
    textiles: "cosy",
  };
  const mobileProducts = [...getProductMap().values()]
    .filter((p) => p.image && groupOf[p.category])
    .map((p) => ({ name: p.name, price: p.price || "", image: p.image, slug: p.slug, url: p.url || "", brand: p.brand || "", group: groupOf[p.category] }));
  const mobileChips = [
    { key: "all", label: "All items", banner: "/scenes/home-hero.webp" },
    { key: "kitchen", label: "Kitchen", banner: "/scenes/cottagecore-kitchen.webp" },
    { key: "living", label: "Living room", banner: "/scenes/home-decor.webp" },
    { key: "table", label: "The table", banner: "/scenes/scalloped-dinnerware.webp" },
    { key: "cosy", label: "Cosy touches", banner: "/scenes/candles.webp" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        description: site.description,
        logo: { "@type": "ImageObject", url: `${site.url}/orla-loom-logo.png` },
        sameAs: ["https://www.instagram.com/orlaloom/", "https://www.pinterest.com/orlaloom/"],
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        name: site.name,
        url: site.url,
        description: site.description,
        publisher: { "@id": `${site.url}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${site.url}/search?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* STOREFRONT — one chip menu drives a banner (with dots) + product grid.
          Same Amazon-style experience on every screen size. */}
      <section style={{ paddingTop: 12 }}>
        <div className="mgp-wrap">
          <MobileGuidedPicker chips={mobileChips} products={mobileProducts} />
        </div>
      </section>

      {/* NEW THIS WEEK — always shows the freshest guides so the homepage never looks static */}
      <section className="guides" style={{ paddingTop: 8 }}>
        <div className="guides-inner">
          <div className="guides-head">
            <h2>New this week</h2>
            <Link className="see-all" href="/category/rugs">See all guides →</Link>
          </div>
          <div className="guides-grid">
            {latest.map((p) => (
              <Link className="guide-card" href={`/blog/${p.slug}`} key={p.slug}>
                <div className="ph" style={{ position: "relative" }}>
                  <img src={p.cover} alt={p.title} loading="lazy" />
                  {isNew(p.date) && (
                    <span style={{ position: "absolute", top: 10, left: 10, background: "var(--head)", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 999 }}>
                      New
                    </span>
                  )}
                </div>
                <div className="guide-body">
                  <div className="guide-tag">{p.catName}</div>
                  <div className="guide-title">{p.title}</div>
                  <div className="guide-meta">Added {fmtDate(p.date)} · 2026</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY — one lifestyle image per category, reshuffled each visit */}
      <section className="categories">
        <div className="section-head-center">
          <span className="eyebrow">Shop by category</span>
          <h2>Browse the whole shop</h2>
        </div>
        <RotatingCategories cats={catCards} />
      </section>

      {/* GUIDES — a fresh mix of buyer's guides on every visit */}
      <section className="guides">
        <div className="guides-inner">
          <div className="guides-head">
            <h2>Fresh picks for you</h2>
            <Link className="see-all" href="/category/butter-dishes">See all →</Link>
          </div>
          <RotatingGuides guides={allGuides} count={6} />
          <div className="footer-note">Orla Loom · gentle finds for a warmer home · affiliate-supported</div>
        </div>
      </section>
    </>
  );
}
