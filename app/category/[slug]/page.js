import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, categoryBySlug } from "../../../lib/site";
import { getPostsByCategory } from "../../../lib/posts";
import { CategoryArt, Arrow } from "../../components/Art";

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
      <section style={{ background: "var(--bg-2)", borderBottom: "1px solid var(--line)" }}>
        <div className="container" style={{ padding: "26px 24px 0" }}>
          <div className="breadcrumb" style={{ padding: 0 }}>
            <Link href="/">Home</Link> &nbsp;/&nbsp; {cat.name}
          </div>
        </div>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center", padding: "26px 24px 36px" }}>
          <div>
            <span className="eyebrow">Category</span>
            <h1 style={{ fontSize: "clamp(32px,5vw,48px)", margin: "10px 0 10px" }}>{cat.name}</h1>
            <p style={{ color: "var(--muted)", fontSize: 18, maxWidth: "52ch", margin: 0 }}>{cat.blurb}</p>
          </div>
          <div className={`hero-tile tint-${cat.slug}`} style={{ width: 132, height: 132 }}>
            <CategoryArt slug={cat.slug} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {posts.length === 0 ? (
            <div className="callout">New guides for this category are publishing soon — check back shortly.</div>
          ) : (
            <div className="posts">
              {posts.map((p) => (
                <Link className="post-card" href={`/blog/${p.slug}`} key={p.slug}>
                  <div className={`thumb tint-${p.category}`}><CategoryArt slug={p.category} /></div>
                  <div className="pc-body">
                    <span className="pc-tag">{cat.name}</span>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <p style={{ marginTop: 34 }}>
            <Link className="card-link" href="/">&larr; All categories</Link>
          </p>
        </div>
      </section>
    </>
  );
}
