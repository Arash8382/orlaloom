import Link from "next/link";
import { notFound } from "next/navigation";
import { site, categoryBySlug, categoryImage } from "../../../lib/site";
import { getPostSlugs, getPost, getPostMeta, getRelatedPosts } from "../../../lib/posts";
import EmailSignup from "../../components/EmailSignup";
import GuideExtras from "../../components/GuideExtras";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  try {
    const meta = getPostMeta(params.slug);
    const img = meta.cover || categoryImage(meta.category);
    const url = `${site.url}/blog/${params.slug}`;
    return {
      title: meta.title,
      description: meta.description,
      alternates: { canonical: `/blog/${params.slug}` },
      openGraph: {
        title: meta.title,
        description: meta.description,
        url,
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
  const related = getRelatedPosts(post.slug, post.category, 4);
  const dateStr = new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const url = `${site.url}/blog/${post.slug}`;
  const heroImg = post.cover || (cat && cat.image) || site.heroImage;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description,
        image: heroImg ? [heroImg] : undefined,
        datePublished: post.date,
        dateModified: post.date,
        author: { "@type": "Organization", name: "Orla Loom editors", url: site.url },
        publisher: {
          "@type": "Organization",
          name: site.name,
          logo: { "@type": "ImageObject", url: `${site.url}/orla-loom-logo.png` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          ...(cat ? [{ "@type": "ListItem", position: 2, name: cat.name, item: `${site.url}/category/${cat.slug}` }] : []),
          { "@type": "ListItem", position: cat ? 3 : 2, name: post.title, item: url },
        ],
      },
      ...(post.products && post.products.length
        ? [{
            "@type": "ItemList",
            name: `${post.title} — top picks`,
            itemListElement: post.products.map((pr, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: pr.name,
              ...(pr.url ? { url: pr.url } : {}),
            })),
          }]
        : []),
      ...(post.faqs && post.faqs.length
        ? [{
            "@type": "FAQPage",
            mainEntity: post.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }]
        : []),
    ],
  };

  return (
    <article className="article-wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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

      <p className="disclosure">
        This post contains affiliate links. If you buy through them, we may earn a small commission at no cost to you.
      </p>

      <GuideExtras products={post.products} categoryName={cat ? cat.name : ""} />

      {post.products && post.products.length > 0 && (
        <section className="picks">
          <span className="eyebrow">The picks</span>
          <h2 className="picks-title">Shop the guide</h2>
          <div className="product-grid">
            {post.products.map((pr, i) => (
              <div className="product-card" key={i}>
                <div className={`product-img ph ${pr.image ? "" : "ph-" + post.category}`}>
                  {pr.image && (() => {
                    const _img = (
                      <img
                        src={pr.image}
                        alt={`${pr.name}${pr.brand && !pr.name.includes(pr.brand) ? " by " + pr.brand : ""} — ${cat ? cat.name : "cottagecore"} pick`}
                        loading="lazy"
                      />
                    );
                    return pr.url ? (
                      <a className="img-link" href={pr.url} target="_blank" rel="nofollow sponsored noopener" aria-label={pr.name}>{_img}</a>
                    ) : _img;
                  })()}
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

      {post.products && post.products.length > 0 && (
        <div style={{ margin: "6px 0 8px" }}>
          <EmailSignup
            variant="compact"
            heading="Save these picks for later"
            sub="Get new cottagecore finds in your inbox — a couple of times a month, no spam."
          />
        </div>
      )}

      <div className="prose" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

      <div className="callout" style={{ marginTop: 26 }}>
        Prices and availability change quickly — please confirm current details on the retailer’s site before buying.
      </div>

      {related.length > 0 && (
        <div className="related">
          <span className="eyebrow">Related guides</span>
          <div className="guides-grid" style={{ marginTop: 16 }}>
            {related.map((p) => {
              const pcat = categoryBySlug(p.category);
              return (
                <Link className="guide-card" href={`/blog/${p.slug}`} key={p.slug}>
                  <div className="ph">
                    <img src={p.cover || categoryImage(p.category)} alt={p.title} loading="lazy" />
                  </div>
                  <div className="guide-body">
                    <div className="guide-tag">{pcat ? pcat.name : "Guide"}</div>
                    <div className="guide-title">{p.title}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}
