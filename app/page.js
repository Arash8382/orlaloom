import Link from "next/link";
import { site, categories, categoryImage } from "../lib/site";
import { getAllPosts, getPostsByCategory, getCategoryThumbs } from "../lib/posts";

export const metadata = { alternates: { canonical: "/" } };

const bg = (url) => ({
  backgroundImage: `url(${url})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
});

export default function Home() {
  const posts = getAllPosts().slice(0, 6);

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
      {/* SHOP BY CATEGORY — Amazon-style cards with 4 product thumbs each */}
      <section className="categories">
        <div className="section-head-center">
          <span className="eyebrow">Shop by category</span>
          <h2>Browse the whole shop</h2>
        </div>
        <div className="catcard-grid">
          {categories.map((c) => {
            const n = getPostsByCategory(c.slug).length;
            const raw = getCategoryThumbs(c.slug, 4);
            const thumbs = [...raw];
            while (thumbs.length < 4) thumbs.push(c.image);
            return (
              <Link className="catcard" href={`/category/${c.slug}`} key={c.slug}>
                <div className="catcard-thumbs">
                  {thumbs.slice(0, 4).map((src, i) => (
                    <span className="cct" key={i}>
                      <img src={src} alt={`${c.name} pick`} loading="lazy" />
                    </span>
                  ))}
                </div>
                <div className="catcard-foot">
                  <div className="catcard-name">{c.name}</div>
                  <div className="catcard-cta">
                    {n > 0 ? `${n} guide${n > 1 ? "s" : ""}` : "New finds"} <span className="arrow">→</span>
                  </div>
                </div>
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
                  <div className="ph"><img src={p.cover || categoryImage(p.category)} alt={p.title} loading="lazy" /></div>
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

      {/* HERO — brand note, now at the bottom */}
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
    </>
  );
}
