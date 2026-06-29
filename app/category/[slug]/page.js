import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, categoryBySlug } from "../../../lib/site";
import { getPostsByCategory } from "../../../lib/posts";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }) {
  const cat = categoryBySlug(params.slug);
  if (!cat) return {};
  return { title: cat.name, description: cat.blurb };
}

export default function CategoryPage({ params }) {
  const cat = categoryBySlug(params.slug);
  if (!cat) return notFound();
  const posts = getPostsByCategory(cat.slug);

  return (
    <>
      <section className="cat-hero">
        <div>
          <div className="breadcrumb" style={{ marginBottom: 14 }}>
            <Link href="/">Home</Link> &nbsp;/&nbsp; {cat.name}
          </div>
          <span className="eyebrow">Category</span>
          <h1>{cat.name}</h1>
          <p>{cat.blurb}</p>
        </div>
        <div className={`badge ph ph-${cat.slug}`} />
      </section>

      <section className="section">
        {posts.length === 0 ? (
          <div className="callout">New finds for this category are landing soon — check back shortly. 🤍</div>
        ) : (
          <div className="guides-grid">
            {posts.map((p) => (
              <Link className="guide-card" href={`/blog/${p.slug}`} key={p.slug}>
                <div className={`ph ph-${p.category}`}>
                  <span className="mono">[ {cat.name.toLowerCase()} ]</span>
                </div>
                <div className="guide-body">
                  <div className="guide-tag">{cat.name}</div>
                  <div className="guide-title">{p.title}</div>
                  <div className="guide-meta">{p.description}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <p style={{ marginTop: 34 }}>
          <Link className="see-all" href="/">&larr; All categories</Link>
        </p>
      </section>
    </>
  );
}
