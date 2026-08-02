import Link from "next/link";
import { notFound } from "next/navigation";
import { site, author, categoryBySlug } from "../../../lib/site";
import { getAllProductSlugs, getProductBySlug, getRelatedProducts } from "../../../lib/posts";
import EmailSignup from "../../components/EmailSignup";
import SaveButton from "../../components/SaveButton";
import { getLivePriceForUrl, asinFromUrl } from "../../../lib/amazon-pricing";

export function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

// Re-fetch live Amazon price/stock at most hourly (ISR). Until Creators API
// access activates, getLivePriceForUrl returns null and the static price shows.
export const revalidate = 3600;

export function generateMetadata({ params }) {
  const p = getProductBySlug(params.slug);
  if (!p) return {};
  const title = `${p.name}${p.brand ? ` by ${p.brand}` : ""} — Orla Loom`;
  const description = p.blurb || `Shop the ${p.name} — a cottagecore pick curated by Orla Loom.`;
  const url = `${site.url}/shop/${p.slug}`;
  return {
    title,
    description,
    alternates: { canonical: `/shop/${p.slug}` },
    openGraph: {
      title,
      description,
      url,
      images: p.image ? [{ url: p.image }] : [],
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description, images: p.image ? [p.image] : [] },
  };
}

// Turn a human price string ("$18–24", "~$22") into a schema.org offer so the
// product is rich-result eligible. Affiliate offer → point url at the retailer.
function priceToOffers(price, offerUrl) {
  if (!price) return null;
  const nums = String(price).match(/\d+(?:\.\d+)?/g);
  if (!nums || !nums.length) return null;
  const vals = nums.map(Number).filter((n) => !isNaN(n));
  if (!vals.length) return null;
  const common = { priceCurrency: "USD", availability: "https://schema.org/InStock", ...(offerUrl ? { url: offerUrl } : {}) };
  if (vals.length >= 2) return { "@type": "AggregateOffer", lowPrice: Math.min(...vals), highPrice: Math.max(...vals), ...common };
  return { "@type": "Offer", price: vals[0], ...common };
}

export default async function ProductPage({ params }) {
  const p = getProductBySlug(params.slug);
  if (!p) return notFound();

  const cat = categoryBySlug(p.category);
  const guide = (p.guides && p.guides[0]) || null;
  const related = getRelatedProducts(p.slug, p.category, 8);
  const url = `${site.url}/shop/${p.slug}`;
  const isAmazon = /amazon\./i.test(p.url || "");
  const buyLabel = isAmazon ? "Shop on Amazon" : `Shop${p.retailer ? ` at ${p.retailer}` : ""}`;

  // Live price/stock from Amazon Creators API (fail-safe: null → static price).
  const live = await getLivePriceForUrl(p.url);
  const displayPrice = (live && live.price) || p.price;
  const outOfStock = live && live.inStock === false;
  const offers = priceToOffers(displayPrice, p.url);

  // One-tap "Add to Amazon cart": pre-fills the shopper's Amazon cart with our
  // associate tag attached (commission preserved). Only for Amazon items whose
  // ASIN we can read; checkout still completes on Amazon.
  const asin = isAmazon ? asinFromUrl(p.url) : null;
  const cartUrl = asin
    ? `https://www.amazon.com/gp/aws/cart/add.html?AssociateTag=orlaloom-20&ASIN.1=${asin}&Quantity.1=1`
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: p.name,
        ...(p.image ? { image: [p.image] } : {}),
        ...(p.blurb ? { description: p.blurb } : {}),
        ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
        ...(p.url ? { url: p.url } : {}),
        ...(offers ? { offers } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Shop", item: `${site.url}/shop` },
          { "@type": "ListItem", position: 3, name: p.name, item: url },
        ],
      },
    ],
  };

  return (
    <article className="article-wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="breadcrumb">
        <Link href="/">Home</Link> &nbsp;/&nbsp;{" "}
        <Link href="/shop">Shop</Link> &nbsp;/&nbsp;{" "}
        {cat && <><Link href={`/category/${cat.slug}`}>{cat.name}</Link> &nbsp;/&nbsp;{" "}</>}
        <span style={{ color: "var(--ink)" }}>{p.name}</span>
      </div>

      <div className="product-hero" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 28, alignItems: "start", margin: "8px 0 10px" }}>
        <div
          style={{
            position: "relative",
            background: "var(--card, #fbf7f0)",
            border: "1px solid var(--line, #e7ddcf)",
            borderRadius: 16,
            overflow: "hidden",
            aspectRatio: "1 / 1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {p.image ? (
            <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : null}
          <SaveButton product={{ name: p.name, image: p.image, price: p.price, url: p.url, brand: p.brand }} />
        </div>

        <div>
          {cat && <Link className="eyebrow" href={`/category/${cat.slug}`}>{cat.name}</Link>}
          <h1 style={{ margin: "6px 0 4px", lineHeight: 1.15 }}>{p.name}</h1>
          {p.brand && <div style={{ color: "var(--muted, #7a6f60)", fontWeight: 600, marginBottom: 10 }}>{p.brand}</div>}

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", margin: "6px 0 14px" }}>
            {displayPrice && <span style={{ fontSize: 22, fontWeight: 700, color: "var(--head)" }}>{displayPrice}</span>}
            {outOfStock && (
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "#a15", background: "#fbeaea", borderRadius: 999, padding: "4px 10px" }}>
                Currently unavailable
              </span>
            )}
            {p.badge && (
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--head)", background: "var(--card,#f3ece0)", border: "1px solid var(--line,#e7ddcf)", borderRadius: 999, padding: "4px 10px" }}>
                {p.badge}
              </span>
            )}
          </div>

          {p.blurb && <p style={{ color: "var(--ink)", lineHeight: 1.6, margin: "0 0 14px" }}>{p.blurb}</p>}

          {p.url && (
            <a
              href={p.url}
              target="_blank"
              rel="sponsored noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                width: "100%",
                maxWidth: 360,
                background: "var(--head)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                padding: "14px 22px",
                borderRadius: 999,
                textDecoration: "none",
              }}
            >
              {buyLabel} →
            </a>
          )}
          {cartUrl && (
            <a
              href={cartUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                width: "100%",
                maxWidth: 360,
                marginTop: 10,
                background: "#fff",
                color: "var(--head)",
                border: "1.5px solid var(--head)",
                fontWeight: 700,
                fontSize: 15,
                padding: "12px 22px",
                borderRadius: 999,
                textDecoration: "none",
              }}
            >
              + Add to Amazon cart
            </a>
          )}
          {p.retailer && (
            <div style={{ fontSize: 12, color: "var(--muted,#7a6f60)", marginTop: 8 }}>
              Sold by {p.retailer}. Price &amp; availability change quickly — confirm on the retailer&rsquo;s site.
            </div>
          )}

          {p.caveat && (
            <p style={{ fontSize: 14, color: "var(--muted,#7a6f60)", lineHeight: 1.55, marginTop: 14 }}>
              <strong style={{ color: "var(--ink)" }}>Good to know:</strong> {p.caveat}
            </p>
          )}

          {guide && (
            <p style={{ fontSize: 14, marginTop: 16 }}>
              As featured in our guide{" "}
              <Link href={`/blog/${guide.slug}`} style={{ color: "var(--head)", fontWeight: 600 }}>{guide.title}</Link>.
            </p>
          )}

          <div className="byline" style={{ marginTop: 14 }}>
            <span className="avatar">{author.initials}</span>
            <span>Curated by <a href="/about" style={{ color: "var(--head)", fontWeight: 600 }}>{author.name}</a> · Independently chosen</span>
          </div>
        </div>
      </div>

      <div style={{ margin: "18px 0" }}>
        <EmailSignup
          variant="compact"
          heading="Save this pick for later"
          sub="Get new cottagecore finds in your inbox — a couple of times a month, no spam."
        />
      </div>

      {related.length > 0 && (
        <div className="related">
          <span className="eyebrow">More cottagecore finds</span>
          <div className="album-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 14, marginTop: 16 }}>
            {related.map((r) => (
              <Link href={`/shop/${r.slug}`} key={r.slug} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: "var(--card,#fbf7f0)", border: "1px solid var(--line,#e7ddcf)", borderRadius: 12, overflow: "hidden", aspectRatio: "1 / 1" }}>
                  {r.image && <img src={r.image} alt={r.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginTop: 6, lineHeight: 1.3 }}>{r.name}</div>
                {r.price && <div style={{ fontSize: 12, color: "var(--muted,#7a6f60)" }}>{r.price}</div>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
