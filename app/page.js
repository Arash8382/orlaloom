import Link from "next/link";
import { site, categories, categoryImage } from "../lib/site";
import { getAllPosts, getPostsByCategory, getCategoryThumbPool } from "../lib/posts";
import RotatingCategories from "./components/RotatingCategories";
import RotatingGuides from "./components/RotatingGuides";

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        logo: { "@type": "ImageObject", url: `${site.url}/orla-loom-logo.png` },
        sameAs: ["https://www.pinterest.com/orlaloom/"],
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        name: site.name,
        url: site.url,
        description: site.description,
        publisher: { "@id": `${site.url}/#organization` },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO — brand mood, leads the page */}
      <section className="hero">
        <div>
          <span className="eyebrow">Cosy finds, gently chosen</span>
          <h1>Make every<br />day feel a<br />little softer.</h1>
          <p>
            Warm, vintage, cottagecore pieces for the table and home — hand-picked
            and quietly curated to make the everyday feel special.
          </p>
          <Link className="btn" href="/category/rugs">Explore the shop</Link>
        </div>
        <div className="hero-img" style={bg(site.heroImage)} />
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
