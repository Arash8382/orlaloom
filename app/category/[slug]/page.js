import Link from "next/link";
import { notFound } from "next/navigation";
import { site, categories, categoryBySlug } from "../../../lib/site";
import { getPostsByCategory } from "../../../lib/posts";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }) {
  const cat = categoryBySlug(params.slug);
  if (!cat) return {};
  return {
    title: cat.name,
    description: cat.blurb,
    alternates: { canonical: `/category/${params.slug}` },
    openGraph: { title: `${cat.name} — ${site.name}`, description: cat.blurb, url: `${site.url}/category/${params.slug}`, images: cat.image ? [{ url: cat.image }] : [] },
  };
}

export default function CategoryPage({ params }) {
  const cat = categoryBySlug(params.slug);
  if (!cat) return notFound();
  const posts = getPostsByCategory(cat.slug);

  const url = `${site.url}/category/${cat.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": url,
        name: `${cat.name} — ${site.name}`,
        description: cat.blurb,
        url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: cat.name, item: url },
        ],
      },
      ...(posts.length
        ? [{
            "@type": "ItemList",
            itemListElement: posts.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.title,
              url: `${site.url}/blog/${p.slug}`,
            })),
          }]
        : []),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="cat-hero">
        <div>
          <div className="breadcrumb" style={{ marginBottom: 14 }}>
            <Link href="/">Home</Link> &nbsp;/&nbsp; {cat.name}
          </div>
          <span className="eyebrow">Category</span>
          <h1>{cat.name}</h1>
          <p>{cat.blurb}</p>
        </div>
        <div className="badge ph" style={{ backgroundImage: `url(${cat.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      </section>

      <section className="section">
        {posts.length === 0 ? (
          <div className="callout">New finds for this category are landing soon — check back shortly. 🤍</div>
        ) : (
          <div className="guides-grid">
            {posts.map((p) => (
              <Link className="guide-card" href={`/blog/${p.slug}`} key={p.slug}>
                <div className="ph" style={{ backgroundImage: `url(${p.cover || cat.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
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
