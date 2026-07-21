import Link from "next/link";
import { notFound } from "next/navigation";
import { site, author, categoryBySlug, categoryImage } from "../../../lib/site";
import { getPostSlugs, getPost, getPostMeta, getRelatedPosts } from "../../../lib/posts";
import EmailSignup from "../../components/EmailSignup";
import GuideExtras from "../../components/GuideExtras";
import ShopScene from "../../components/ShopScene";
import AlbumGrid from "../../components/AlbumGrid";

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

  // Answer-first "Quick answer" box — a concise TL;DR at the top of each guide.
  // Humans skim it; AI answer engines (ChatGPT, Perplexity) quote it. Derived
  // automatically from the guide's top pick, so it works for every guide.
  const topPick =
    (post.products || []).find((p) => /top pick|statement|our pick|best overall|editor/i.test(p.badge || "")) ||
    (post.products || [])[0];
  const firstSentence = (s) => {
    if (!s) return "";
    const m = String(s).match(/^.*?[.!?](\s|$)/);
    return (m ? m[0] : String(s)).trim();
  };

  // Turn a human price string ("$18–24", "~$22", "$15–40 each") into valid
  // schema.org offers so Google treats each Product as rich-result-eligible and
  // AI answer engines can quote a real price. No fabricated ratings.
  const priceToOffers = (price) => {
    if (!price) return null;
    const nums = String(price).match(/\d+(?:\.\d+)?/g);
    if (!nums || !nums.length) return null;
    const vals = nums.map(Number).filter((n) => !isNaN(n));
    if (!vals.length) return null;
    const common = { priceCurrency: "USD", availability: "https://schema.org/InStock" };
    if (vals.length >= 2) {
      return { "@type": "AggregateOffer", lowPrice: Math.min(...vals), highPrice: Math.max(...vals), ...common };
    }
    return { "@type": "Offer", price: vals[0], ...common };
  };

  const modifiedStr = new Date(post.updated || post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const wasUpdated = post.updated && post.updated !== post.date;

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
        dateModified: post.updated || post.date,
        author: { "@type": "Person", name: author.name, url: `${site.url}/about`, jobTitle: author.role, ...(author.sameAs ? { sameAs: author.sameAs } : {}) },
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
      // Product entities with our editorial take — gives Google and AI answer
      // engines clean, citable facts per product. No fabricated star ratings or
      // prices: just name, brand, image, and our honest one-line assessment.
      ...(post.products && post.products.length
        ? post.products.map((pr) => {
            const offers = priceToOffers(pr.price);
            return {
              "@type": "Product",
              name: pr.name,
              ...(pr.image ? { image: pr.image } : {}),
              ...(pr.url ? { url: pr.url } : {}),
              ...(pr.brand ? { brand: { "@type": "Brand", name: pr.brand } } : {}),
              ...(pr.blurb ? { description: pr.blurb } : {}),
              ...(offers ? { offers } : {}),
            };
          })
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
          <span className="avatar">{author.initials}</span>
          <span>By <a href="/about" style={{ color: "var(--head)", fontWeight: 600 }}>{author.name}</a> · {wasUpdated ? `Updated ${modifiedStr}` : dateStr} · Independently curated</span>
        </div>
      </header>

      <p className="disclosure">
        This post contains affiliate links. If you buy through them, we may earn a small commission at no cost to you.
      </p>

      {topPick && (
        <div
          style={{
            background: "var(--card, #fbf7f0)",
            border: "1px solid var(--line, #e7ddcf)",
            borderLeft: "4px solid var(--head)",
            borderRadius: 12,
            padding: "14px 18px",
            margin: "0 0 20px",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--head)", marginBottom: 4 }}>
            Quick answer
          </div>
          <p style={{ margin: 0, color: "var(--ink)", lineHeight: 1.55 }}>
            The best {cat ? cat.name.toLowerCase().replace(/&/g, "and") : "pick"} in this guide is{" "}
            <strong>{topPick.name}</strong>
            {topPick.price ? ` (${topPick.price})` : ""}. {firstSentence(topPick.blurb)}{" "}
            {topPick.url && (
              <a href={topPick.url} target="_blank" rel="sponsored noopener noreferrer" style={{ whiteSpace: "nowrap" }}>
                Check price →
              </a>
            )}
          </p>
        </div>
      )}

      {/* Shoppable scene hero — matches the category/home style (self-hides if no scene) */}
      {cat && <ShopScene scene={cat.slug} title={`Shop the ${cat.name}`} subtitle="Tap any piece to shop it." />}

      <GuideExtras products={post.products} categoryName={cat ? cat.name : ""} />

      {/* Album grid — image-only picks, hover reveals name/price, click → retailer */}
      <AlbumGrid products={post.products} eyebrow="The picks" title="Shop the guide" sub="Tap any piece to shop it." showCount={false} />

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
