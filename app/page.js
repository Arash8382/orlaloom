import Link from "next/link";
import { site, categories, categoryImage } from "../lib/site";
import { getAllPosts, getPostsByCategory, getCategoryThumbPool } from "../lib/posts";
import RotatingCategories from "./components/RotatingCategories";
import RotatingGuides from "./components/RotatingGuides";
import RoomSlider from "./components/RoomSlider";

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

      {/* HERO — shoppable scene, the new signature style */}
      <section style={{ paddingTop: 12 }}>
        <div style={{ textAlign: "center", maxWidth: 780, margin: "0 auto", padding: "0 24px" }}>
          <span className="eyebrow">Cosy finds, gently chosen</span>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px,3.6vw,40px)", color: "var(--head)", lineHeight: 1.05, margin: "6px 0 8px", letterSpacing: "-.01em" }}>
            Make every day feel a little softer.
          </h1>
          <p style={{ color: "var(--muted-2)", margin: "0 auto 12px", maxWidth: "56ch", fontSize: 15 }}>
            Slide through our cottagecore rooms and tap any piece to shop it.
          </p>
        </div>
        <RoomSlider />
        <div style={{ textAlign: "center", marginTop: 6 }}>
          <Link className="btn" href="/category/rugs">Explore the shop</Link>
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
