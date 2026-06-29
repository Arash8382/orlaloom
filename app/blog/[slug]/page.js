import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryBySlug, categoryImage } from "../../../lib/site";
import { getPostSlugs, getPost, getPostMeta, getPostsByCategory } from "../../../lib/posts";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  try {
    const meta = getPostMeta(params.slug);
    const img = meta.cover || categoryImage(meta.category);
    return {
      title: meta.title,
      description: meta.description,
      openGraph: {
        title: meta.title,
        description: meta.description,
        images: img ? [{ url: img, width: 1200, height: 800 }] : [],
        type: "article",
      },
      twitter: { card: "summary_large_image", title: meta.title, description: meta.description, images: img ? [img] : [] },
    };
  } catch {
    return {};
  }
}

export default async function PostPage({ params }) {
  if (!getPostSlugs().includes(params.slug)) return notFound();
  const post = await getPost(params.slug);
  const cat = categoryBySlug(post.category);
  const related = getPostsByCategory(post.category).filter((p) => p.slug !== post.slug).slice(0, 3);
  const dateStr = new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <article className="article-wrap">
      <div className="breadcrumb">
        <Link href="/">Home</Link> &nbsp;/&nbsp;{" "}
        {cat && <><Link href={`/category/${cat.slug}`}>{cat.name}</Link> &nbsp;/&nbsp;{" "}</>}
        <span style={{ color: "var(--ink)" }}>{post.title}</span>
      </div>

      <header className="article-head">
        {cat && <Link className="eyebrow" href={`/category/${cat.slug}`}>{cat.name}</Link>}
        <h1>{post.title}</h1>
        <div className="byline">
          <span className="avatar">OL</span>
          <span>By the Orla Loom editors · {dateStr} · Independently curated</span>
        </div>
      </header>

      <div className="article-hero ph" style={(post.cover || cat) ? { backgroundImage: `url(${post.cover || cat.image})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined} />

      <p className="disclosure">
        This post contains affiliate links. If you buy through them, we may earn a small commission at no cost to you.
      </p>

      {post.products && post.products.length > 0 && (
        <section className="picks">
          <span className="eyebrow">The picks</span>
          <h2 className="picks-title">Shop the guide</h2>
          <div className="product-grid">
            {post.products.map((pr, i) => (
              <div className="product-card" key={i}>
                <div
                  className={`product-img ph ${pr.image ? "" : "ph-" + post.category}`}
                  style={pr.image ? { backgroundImage: `url(${pr.image})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                >
                  {pr.badge && <span className="product-badge">{pr.badge}</span>}
                  {!pr.image && <span className="mono">[ {pr.name} ]</span>}
                </div>
                <div className="product-body">
                  <div className="product-name">{pr.name}</div>
                  <div className="product-meta">
                    {pr.brand}{pr.brand && pr.price ? " · " : ""}{pr.price}
                  </div>
                  <p className="product-blurb">{pr.blurb}</p>
                  {pr.caveat && <p className="product-caveat">Heads up: {pr.caveat}</p>}
                  {pr.url && (
                    <a className="btn product-btn" href={pr.url} target="_blank" rel="nofollow sponsored noopener">
                      Shop on {pr.retailer || "site"} →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="prose" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

      <div className="callout" style={{ marginTop: 26 }}>
        Prices and availability change quickly — please confirm current details on the retailer’s site before buying.
      </div>

      {related.length > 0 && (
        <div className="related">
          <span className="eyebrow">Keep reading</span>
          <div className="guides-grid" style={{ marginTop: 16 }}>
            {related.map((p) => (
              <Link className="guide-card" href={`/blog/${p.slug}`} key={p.slug}>
                <div className="ph" style={{ backgroundImage: `url(${p.cover || categoryImage(p.category)})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                <div className="guide-body">
                  <div className="guide-tag">{cat ? cat.name : "Guide"}</div>
                  <div className="guide-title">{p.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
