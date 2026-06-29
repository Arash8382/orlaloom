import Link from "next/link";
import { site, categories, categoryImage } from "../lib/site";
import { getAllPosts, getPostsByCategory } from "../lib/posts";

export const metadata = { alternates: { canonical: "/" } };

const bg = (url) => ({
  backgroundImage: `url(${url})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
});

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

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
      {/* HERO */}
      <section className="hero">
        <div>
          <span className="eyebrow">Cosy finds, gently chosen</span>
          <h1>Make every<br />day feel a<br />little softer.</h1>
          <p>
            Sweet butter dishes, scalloped plates and warm glassware, hand-picked
            to make your table feel like a hug.
          </p>
          <Link className="btn" href="/category/butter-dishes">Start exploring</Link>
        </div>
        <div className="hero-img" style={bg(site.heroImage)} />
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="categories">
        <div className="section-head-center">
          <span className="eyebrow">Shop by category</span>
          <h2>Pick your little joy</h2>
        </div>
        <div className="cat-grid">
          {categories.map((c) => {
            const n = getPostsByCategory(c.slug).length;
            return (
              <Link className="cat-card" href={`/category/${c.slug}`} key={c.slug}>
                <div className="ph" style={bg(c.image)} />
                <div className="cat-name">{c.name}</div>
                <div className="cat-count">{n > 0 ? `${n} guide${n > 1 ? "s" : ""}` : "New finds"}</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* GUIDES */}
      <section className="guides">
        <div className="guides-inner">
          <div className="guides-head">
            <h2>Loved by the Loom community</h2>
            <Link className="see-all" href="/category/butter-dishes">See all →</Link>
          </div>
          <div className="guides-grid">
            {posts.map((p) => {
              const cat = categories.find((c) => c.slug === p.category);
              return (
                <Link className="guide-card" href={`/blog/${p.slug}`} key={p.slug}>
                  <div className="ph" style={bg(p.cover || categoryImage(p.category))} />
                  <div className="guide-body">
                    <div className="guide-tag">{cat ? cat.name : "Guide"}</div>
                    <div className="guide-title">{p.title}</div>
                    <div className="guide-meta">Buyer’s guide · updated 2026</div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="footer-note">Orla Loom · gentle finds for a warmer home · affiliate-supported</div>
        </div>
      </section>
    </>
  );
}
