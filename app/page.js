import Link from "next/link";
import { site, categories, categoryBySlug } from "../lib/site";
import { getAllPosts } from "../lib/posts";

export default function Home() {
  const posts = getAllPosts();
  return (
    <>
      <section className="hero">
        <h1>{site.tagline}</h1>
        <p>
          Hand-picked butter dishes, scalloped dinnerware, candles, and colored
          glassware for a warm, vintage, cottagecore home.
        </p>
      </section>

      <div className="container wide">
        <div className="cat-grid">
          {categories.map((c) => (
            <div className="cat-card" key={c.slug}>
              <h3>{c.name}</h3>
              <p>{c.blurb}</p>
              <Link className="more" href={`/category/${c.slug}`}>
                Explore →
              </Link>
            </div>
          ))}
        </div>

        <div className="section-title">Latest guides</div>
        <ul className="post-list">
          {posts.map((p) => {
            const cat = categoryBySlug(p.category);
            return (
              <li key={p.slug}>
                <div className="meta">{cat ? cat.name : "Guide"}</div>
                <h2>
                  <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                </h2>
                <p>{p.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
