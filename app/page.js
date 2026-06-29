import Link from "next/link";
import { categories } from "../lib/site";
import { getAllPosts, getPostsByCategory } from "../lib/posts";

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
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
        <div className="hero-img">
          <span className="mono">[ hero — bright, cosy lifestyle ]</span>
        </div>
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
                <div className={`ph ph-${c.slug}`}>
                  <span className="mono">[ {c.name.toLowerCase()} ]</span>
                </div>
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
                  <div className={`ph ph-${p.category}`}>
                    <span className="mono">[ {cat ? cat.name.toLowerCase() : "guide"} ]</span>
                  </div>
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
