import Link from "next/link";
import { site } from "../../lib/site";
import CopyCode from "../components/CopyCode";

const CODE = "ORLALOOM20";
const SHOP_URL = "https://app.partnerboost.com/track/17d5bycoQ5Q3R7ugY1EPOrtoNix4AqJdZea1Uco35s5ixck6zTSsERs_a3jM_ba9AMM2C7sFQSOVLpFajHva7XCj8C?url=https%3A%2F%2Flahomedecor.com%2Fcollections%2Fwashable-rugs";

export const metadata = {
  title: "Lahome Discount Code: ORLALOOM20 for 20% Off Washable Rugs (2026)",
  description:
    "Exclusive Lahome coupon code: use ORLALOOM20 for 20% off washable cottagecore rugs at Lahome (min. $70, valid through Dec 31, 2026). Verified & updated.",
  alternates: { canonical: "/lahome-discount-code" },
  openGraph: {
    title: "Lahome Discount Code — 20% Off with ORLALOOM20",
    description:
      "Our exclusive Lahome coupon: ORLALOOM20 for 20% off washable rugs (min. $70, through Dec 31, 2026).",
    url: `${site.url}/lahome-discount-code`,
    type: "article",
  },
};

const faqs = [
  {
    q: "What is the current Lahome discount code?",
    a: "Use code ORLALOOM20 at checkout for 20% off your order at Lahome (lahomedecor.com). It's an exclusive code we arranged for Orla Loom readers.",
  },
  {
    q: "How much do you save with the Lahome coupon?",
    a: "ORLALOOM20 takes 20% off, with a minimum purchase of $70. It applies to full-price items (clearance excluded).",
  },
  {
    q: "When does the Lahome promo code expire?",
    a: "The code is valid through December 31, 2026. We keep this page updated whenever the offer changes.",
  },
  {
    q: "How do I use the code?",
    a: "Add Lahome rugs to your cart, head to checkout, and paste ORLALOOM20 into the promo/discount code box. The 20% discount applies before payment.",
  },
];

export default function LahomeDealPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Lahome Discount Code",
            item: `${site.url}/lahome-discount-code`,
          },
        ],
      },
    ],
  };

  return (
    <div className="deal-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="deal-hero">
        <span className="eyebrow">Exclusive Orla Loom × Lahome offer</span>
        <h1>Lahome Discount Code: 20% Off Washable Rugs</h1>
        <p className="sub">
          We teamed up with Lahome to get you an exclusive code. Copy it, shop their
          washable cottagecore rugs, and take <strong>20% off orders of $70 or more</strong>{" "}
          at checkout.
        </p>

        <CopyCode code={CODE} />

        <p
          className="deal-terms"
          style={{ fontWeight: 700, color: "var(--head)", fontSize: "1.05rem" }}
        >
          20% off orders of <strong>$70 or more</strong>
        </p>
        <p className="deal-terms" style={{ marginTop: "4px" }}>
          Full-price items only (clearance excluded) · valid through Dec 31, 2026
        </p>

        <div>
          <a
            className="deal-shop-btn"
            href={SHOP_URL}
            target="_blank"
            rel="sponsored noopener noreferrer"
          >
            Shop Lahome rugs &amp; apply the code →
          </a>
        </div>
      </div>

      <section className="deal-section">
        <h2>How to use your Lahome coupon</h2>
        <ol className="deal-steps">
          <li>
            <span className="n">1</span>
            <span className="t">
              Browse Lahome&apos;s washable rugs (or start from one of our guides below).
            </span>
          </li>
          <li>
            <span className="n">2</span>
            <span className="t">Add your favorites to the cart and head to checkout.</span>
          </li>
          <li>
            <span className="n">3</span>
            <span className="t">
              Paste <strong>{CODE}</strong> into the promo code box — 20% comes off before
              you pay.
            </span>
          </li>
        </ol>
      </section>

      <section className="deal-section">
        <h2>Shop our favorite Lahome rugs</h2>
        <div className="deal-guides">
          <Link className="deal-guide-card" href="/blog/cottagecore-washable-rugs">
            <b>Cottagecore Washable Rugs</b>
            <span>Soft florals, vintage borders &amp; woodland prints — all washable.</span>
          </Link>
          <Link className="deal-guide-card" href="/blog/floral-bedroom-rugs">
            <b>Floral Bedroom Rugs</b>
            <span>Romantic rose-garden and blossom rugs to warm up a bedroom.</span>
          </Link>
          <Link className="deal-guide-card" href="/blog/dark-cottagecore-rugs">
            <b>Dark Cottagecore Rugs</b>
            <span>Moody, dark-floral picks for a candle-lit, vintage look.</span>
          </Link>
        </div>
      </section>

      <section className="deal-section">
        <h2>Lahome coupon FAQ</h2>
        <div className="deal-faq">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
        <p className="deal-terms" style={{ marginTop: "18px" }}>
          Orla Loom is affiliate-supported: if you buy through our links we may earn a
          commission (at no extra cost to you), and you still get 20% off with {CODE}.
        </p>
      </section>
    </div>
  );
}
