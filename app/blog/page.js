import Link from "next/link";
import { site, categories } from "../../lib/site";
import { getAllPosts } from "../../lib/posts";

export const metadata = {
  title: "All Guides — Cottagecore Home & Décor",
  description:
    "Every Orla Loom buying guide in one place — cottagecore kitchen, rugs, glassware, candles, retro appliances, textiles and more. Real products, honest picks.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `All Guides — ${site.name}`,
    description: "Every Orla Loom cottagecore buying guide in one place.",
    url: `${site.url}/blog`,
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const url = `${site.url}/blog`;

  const byCat = categories
    .map((c) => ({ cat: c, posts: posts.filter((p) => p.category === c.slug) }))
    .filter((g) => g.posts.length > 0);
  const uncategorized = posts.filter(
    (p) => !categories.some((c) => c.slug === p.category)
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": url,
        name: `All Guides — ${site.name}`,
        description: metadata.description,
        url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "All Guides", item: url },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: posts.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.title,
          url: `${site.url}/blog/${p.slug}`,
        })),
      },
    ],
  };

  const cardStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "22px 20px",
    marginTop: 16,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container" style={{ paddingTop: 18, paddingBottom: 48 }}>
        <div className="breadcrumb">
          <Link href="/">Home</Link> &nbsp;/&nbsp; All Guides
        </div>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(26px,3.6vw,38px)",
            color: "var(--head)",
            margin: "10px 0 0",
          }}
        >
          All Guides
        </h1>
        <div style={{ marginTop: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--terra, #c4704f)", background: "rgba(196,112,79,.12)", padding: "4px 10px", borderRadius: 999 }}>
            ✦ New finds added daily
          </span>
        </div>
        <p style={{ color: "var(--muted-2)", maxWidth: "72ch", marginTop: 10, lineHeight: 1.65 }}>
          Every buying guide we&apos;ve published — {posts.length} and counting, each built
          around real products we&apos;d put in our own homes. Something new is added every
          single day, so this page keeps growing. Browse by room and style below,
          or jump into a <Link href="/search">search</Link>.
        </p>

        {byCat.map(({ cat, posts: catPosts }) => (
          <section key={cat.slug} style={{ marginTop: 40 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
              <h2
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: "clamp(20px,2.6vw,26px)",
                  color: "var(--head)",
                  margin: 0,
                }}
              >
                {cat.name}
              </h2>
              <Link href={`/category/${cat.slug}`} style={{ fontSize: 14, whiteSpace: "nowrap" }}>
                Shop {cat.name} →
              </Link>
            </div>
            <div style={cardStyle}>
              {catPosts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="catcard">
                  {p.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.cover}
                      alt={p.title}
                      loading="lazy"
                      style={{
                        width: "100%",
                        aspectRatio: "4 / 3",
                        objectFit: "cover",
                        borderRadius: 16,
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "4 / 3",
                        borderRadius: 16,
                        background: "var(--card)",
                      }}
                    />
                  )}
                  <div style={{ marginTop: 10, fontFamily: "var(--serif)", fontSize: 17, color: "var(--head)", lineHeight: 1.35 }}>
                    {p.title}
                  </div>
                  {p.description && (
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 13.5,
                        color: "var(--muted-2)",
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {p.description}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        ))}

        {uncategorized.length > 0 && (
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px,2.6vw,26px)", color: "var(--head)", margin: 0 }}>
              More Guides
            </h2>
            <div style={cardStyle}>
              {uncategorized.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="catcard">
                  {p.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.cover}
                      alt={p.title}
                      loading="lazy"
                      style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: 16, display: "block" }}
                    />
                  ) : (
                    <div style={{ width: "100%", aspectRatio: "4 / 3", borderRadius: 16, background: "var(--card)" }} />
                  )}
                  <div style={{ marginTop: 10, fontFamily: "var(--serif)", fontSize: 17, color: "var(--head)", lineHeight: 1.35 }}>
                    {p.title}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
