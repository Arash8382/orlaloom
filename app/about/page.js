import Link from "next/link";
import { site } from "../../lib/site";

export const metadata = {
  title: "About",
  description:
    "Who's behind Orla Loom, how we research and hand-pick every cottagecore home-decor recommendation, and how the site makes money.",
  alternates: { canonical: "/about" },
};

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${site.url}/about#aboutpage`,
        url: `${site.url}/about`,
        name: `About ${site.name}`,
        description: `How ${site.name} researches and chooses its cottagecore home-decor recommendations.`,
      },
      {
        "@type": "Organization",
        "@id": `${site.url}#organization`,
        name: site.name,
        url: site.url,
        description: "A small editorial team publishing hand-picked cottagecore and vintage home-decor guides.",
      },
    ],
  };

  return (
    <div className="article-wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <span className="eyebrow">About</span>
      <h1 style={{ fontSize: 40, margin: "10px 0 18px" }}>About {site.name}</h1>
      <div className="prose">
        <p>
          {site.name} is a curated guide to the warm, vintage, cottagecore home —
          the butter dishes, scalloped dinnerware, candles, and colored glassware
          that make an everyday table feel a little more special.
        </p>
        <p>
          We research and hand-pick every product so you don&apos;t have to scroll
          forever. Each recommendation comes with a real reason it earned its spot,
          who it&apos;s best for, and an honest note on anything to watch out for.
        </p>

        <h2>Who runs this</h2>
        <p>
          Orla Loom is made by a small editorial team. It started as a personal obsession with
          warm, lived-in homes — scalloped edges, colored glass, kitchens that feel like someone
          actually bakes in them — and became a full-time project: finding the pieces that make a
          house feel collected rather than decorated, and being honest about which ones are worth
          the money.
        </p>
        <p>
          We use AI tools to help research products, track prices, and keep every
          link current — and a human makes the final call on every recommendation.
          If we get something wrong, tell us and we&apos;ll fix it.
        </p>

        {/* Orla — the illustrated brand character */}
        <div
          style={{
            display: "flex",
            gap: 18,
            alignItems: "center",
            flexWrap: "wrap",
            background: "var(--card, #fbf7f0)",
            border: "1px solid var(--line, #e7ddcf)",
            borderRadius: 14,
            padding: "16px 18px",
            margin: "22px 0",
          }}
        >
          <img
            src="/orla-portrait.jpg"
            alt="Illustrated portrait of Orla, the Orla Loom brand character, in her cottagecore kitchen"
            style={{ width: 110, height: 110, objectFit: "cover", objectPosition: "top", borderRadius: 12, flexShrink: 0 }}
          />
          <div style={{ flex: "1 1 260px" }}>
            <div style={{ fontWeight: 700, color: "var(--head)" }}>And this is Orla</div>
            <p style={{ margin: "4px 0 0", color: "var(--ink)", lineHeight: 1.55 }}>
              Our illustrated muse — not a real person, but the standard every pick has to meet:
              would it survive in her house? <Link href="/meet-orla">Meet Orla →</Link>
            </p>
          </div>
        </div>

        <h2>How we choose</h2>
        <p>
          Every guide starts with a real search: we look at what people actually want in a
          category, then gather the specific products that fit — not a scraped list of whatever
          ranks. We compare materials and finish, size and fit, print or glaze quality, and price
          against what you get. Then we rank a short list, name the single best pick, and say
          plainly who each one is for. The full process is in our{" "}
          <Link href="/editorial-policy">editorial policy</Link>, and our pricing research is
          public in the <Link href="/data">Cottagecore Home Index</Link>.
        </p>

        <h2>How we make money</h2>
        <p>
          {site.name} is reader-supported. Some links are affiliate links, which means we may earn
          a small commission if you buy through them — at no extra cost to you. It never changes
          which products we recommend or how we rank them. Full details in the{" "}
          <Link href="/disclosure">affiliate disclosure</Link>.
        </p>
      </div>
    </div>
  );
}
