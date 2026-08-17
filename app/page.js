import Link from "next/link";
import { site, categories, categoryImage } from "../lib/site";
import { getAllPosts, getPostsByFreshness, getPostsByCategory, getCategoryThumbPool, getProductMap, getProductsByFreshness } from "../lib/posts";
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

  // Freshest guides by `updated` (falling back to `date`), NOT purely by publish
  // date. New products get added to existing guides daily, so a refreshed guide
  // is genuinely new content — and during a publishing freeze it is the only
  // new content there is. Sorting by date alone made this block go stale.
  const latest = getPostsByFreshness().slice(0, 4).map((p) => ({
    slug: p.slug,
    title: p.title,
    cover: p.cover || categoryImage(p.category),
    catName: (categories.find((c) => c.slug === p.category) || {}).name || "Guide",
    date: p.date,
  }));
  const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const isNew = (d) => Date.now() - new Date(d).getTime() < 12 * 864e5;

  // Data for the single storefront (Amazon-style). One chip menu per real
  // category swaps a banner + filters the grid in place; the grid holds ALL
  // products. Each product carries its category slug. Links to /shop/[slug].
  const chipCats = [
    { slug: "butter-dishes", label: "Butter Dishes" },
    { slug: "cottagecore-kitchen", label: "Kitchen" },
    { slug: "scalloped-dinnerware", label: "Dinnerware" },
    { slug: "rugs", label: "Rugs" },
    { slug: "candles", label: "Candles" },
    { slug: "glassware", label: "Glassware" },
    { slug: "retro-appliances", label: "Appliances" },
    { slug: "home-decor", label: "Décor" },
    { slug: "textiles", label: "Linens" },
  ];
  const chipSlugs = new Set(chipCats.map((c) => c.slug));
  const mobileProducts = getProductsByFreshness()
    .filter((p) => p.image && chipSlugs.has(p.category))
    .map((p) => ({ name: p.name, price: p.price || "", image: p.image, slug: p.slug, url: p.url || "", brand: p.brand || "", cat: p.category }));
  const mobileChips = [
    { key: "all", label: "All items", banner: "/scenes/home-hero.webp" },
    ...chipCats.map((c) => ({ key: c.slug, label: c.label, banner: `/scenes/${c.slug}.webp` })),
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
            <div>
              <h2 style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                Fresh this week
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--terra, #c4704f)", background: "rgba(196,112,79,.12)", padding: "4px 10px", borderRadius: 999, whiteSpace: "nowrap" }}>
                  ✦ New finds daily
                </span>
              </h2>
              <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "var(--muted-2, #8a7466)" }}>
                New finds go into these guides every day — prices, picks and photos kept current.
              </p>
            </div>
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
