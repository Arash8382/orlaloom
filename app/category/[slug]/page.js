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
    <div className="container">
      <div className="section-title" style={{ marginTop: 36 }}>
        Category
      </div>
      <h1 style={{ fontSize: 38, color: "var(--green-deep)", margin: "4px 0 8px" }}>
        {cat.name}
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 19 }}>{cat.blurb}</p>

      {posts.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>
          New guides for this category are publishing soon.
        </p>
      ) : (
        <ul className="post-list">
          {posts.map((p) => (
            <li key={p.slug}>
              <h2>
                <Link href={`/blog/${p.slug}`}>{p.title}</Link>
              </h2>
              <p>{p.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
