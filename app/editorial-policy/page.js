import Link from "next/link";
import { site, author } from "../../lib/site";

export const metadata = {
  title: "Editorial Policy — How Orla Loom Works",
  description:
    "How Orla Loom selects products, uses AI, handles corrections, and makes money. Our editorial standards in plain language.",
  alternates: { canonical: "/editorial-policy" },
};

export default function EditorialPolicyPage() {
  const url = `${site.url}/editorial-policy`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    name: "Editorial Policy — Orla Loom",
    url,
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };
  const h2 = { fontFamily: "var(--serif)", fontSize: "clamp(19px,2.4vw,24px)", color: "var(--head)", margin: "28px 0 8px" };
  const p = { lineHeight: 1.7, color: "var(--ink)", margin: "0 0 12px", maxWidth: "72ch" };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container" style={{ paddingTop: 18, paddingBottom: 48 }}>
        <div className="breadcrumb"><Link href="/">Home</Link> &nbsp;/&nbsp; Editorial Policy</div>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px,3.6vw,38px)", color: "var(--head)", margin: "10px 0 6px" }}>
          How Orla Loom Works
        </h1>
        <p style={p}>
          Plain answers about how we choose products, how we use AI, how we make money, and what we do when we get
          something wrong. Responsibility for everything published here rests with {author?.name || "our editor"}.
        </p>

        <h2 style={h2}>How we choose products</h2>
        <p style={p}>
          Every product we recommend is a real, currently sold item we have looked up ourselves — real brand, real
          price range, real listing. We shortlist by style fit (cottagecore, grandmillennial, vintage warmth), owner
          feedback across retailers, materials and care requirements, and value at its price point. Every guide names a
          top pick, a budget pick, and where it matters, a splurge — and we note drawbacks, because everything has one.
          We never accept payment for a ranking, and no brand sees or approves a guide before it is published.
        </p>

        <h2 style={h2}>Evidence behind recommendations</h2>
        <p style={p}>
          Today most of our recommendations are research-based: manufacturer specifications, verified owner experiences,
          and comparison across competing products. We are building a hands-on testing program ("Orla Loom Tested") —
          when a product has been physically tested by us, the guide will say so explicitly, with photos and
          measurements. Until a product carries that label, you should read our recommendation as diligent research,
          not first-hand testing.
        </p>

        <h2 style={h2}>How we use AI</h2>
        <p style={p}>
          Orla Loom uses AI tools heavily and openly: for product research, price tracking, drafting, image creation
          for lifestyle scenes, and keeping hundreds of links current. AI does the legwork; a human sets the standards,
          reviews the output, and owns the result. Product photos on product cards are real retailer images, never AI
          renderings. If an AI-assisted process introduces an error, that is our error and we will fix it.
        </p>

        <h2 style={h2}>How we make money</h2>
        <p style={p}>
          Orla Loom earns affiliate commissions: when you buy through our links, the retailer pays us a small
          percentage at no extra cost to you. We are an Amazon Associate, and we have a direct partnership with Lahome
          (our shared discount code is ORLALOOM20) — pages featuring Lahome products carry a specific note about that
          relationship. Commissions never change a ranking: where two products are equally good we may prefer the one
          that pays better, but we will not rank a worse product above a better one for money.
        </p>

        <h2 style={h2}>Prices and availability</h2>
        <p style={p}>
          Prices are shown as ranges because retailers change them constantly. We verify links and stock weekly with an
          automated checker and replace discontinued products. If you find a dead link or a wrong price, tell us.
        </p>

        <h2 style={h2}>Corrections</h2>
        <p style={p}>
          If we get a fact, price, spec, or claim wrong, we correct the page promptly and update its "Updated" date.
          Requests: reach us via the contact options on our <Link href="/about">About page</Link>. We would rather be
          corrected than be comfortable.
        </p>
      </div>
    </>
  );
}
