import Link from "next/link";
import { site } from "../../lib/site";
import CopyCode from "../components/CopyCode";

const CODE = "ORLALOOM20";
const SHOP_URL = "https://app.partnerboost.com/track/17d5bycoQ5Q3R7ugY1EPOrtoNix4AqJdZea1Uco35s5ixck6zTSsERs_a3jM_ba9AMM2C7sFQSOVLpFajHva7XCj8C?url=https%3A%2F%2Flahomedecor.com%2Fcollections%2Fwashable-rugs";

// Evaluated at build time. The site redeploys near-daily, so this keeps the
// "verified <Month Year>" freshness signal current without manual edits.
const BUILD_DATE = new Date();
const VERIFIED_MONTH = BUILD_DATE.toLocaleString("en-US", {
  month: "long",
  year: "numeric",
});
// Short form for the <title>, which Google truncates around 60 characters.
const VERIFIED_MONTH_SHORT = BUILD_DATE.toLocaleString("en-US", {
  month: "short",
  year: "numeric",
});
const VERIFIED_ISO = BUILD_DATE.toISOString().slice(0, 10);

export const metadata = {
  title: `Lahome Discount Code: 20% Off with ORLALOOM20 (${VERIFIED_MONTH_SHORT})`,
  description: `ORLALOOM20 takes 20% off cottagecore rugs at Lahome — exclusive to Orla Loom readers and verified working in ${VERIFIED_MONTH}. $70 minimum, clearance excluded.`,
  alternates: { canonical: "/lahome-discount-code" },
  openGraph: {
    title: `Lahome Discount Code — 20% Off with ORLALOOM20 (${VERIFIED_MONTH})`,
    description:
      "Our exclusive Lahome coupon: ORLALOOM20 for 20% off washable rugs (min. $70, through Dec 31, 2026). Tested and working.",
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
  {
    q: "Does the Lahome code actually work?",
    a: "Yes. ORLALOOM20 is an exclusive code Lahome issued to Orla Loom directly — it isn't scraped from a coupon aggregator, so it isn't one of the expired codes you end up pasting five of at checkout. We re-check it before every update to this page.",
  },
  {
    q: "Is there a Lahome free shipping code?",
    a: "Lahome already ships free on US orders over its own threshold, so there's no separate shipping code to stack. ORLALOOM20 is the discount to use, and it applies to the order total before shipping is calculated.",
  },
  {
    q: "Can you stack the Lahome coupon with a sale?",
    a: "It applies to full-price items only — clearance and already-discounted items are excluded, and codes can't be combined. In practice the 20% off full price often beats the sale section on rugs.",
  },
  {
    q: "Is Lahome a legit company?",
    a: "Yes. Lahome (lahomedecor.com) is an established online rug retailer specialising in one-piece machine-washable area rugs, best known for vintage florals and scalloped borders. We've bought and reviewed their rugs across several of our guides.",
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
      {
        "@type": "WebPage",
        "@id": `${site.url}/lahome-discount-code`,
        name: `Lahome Discount Code: 20% Off with ${CODE}`,
        description: `Exclusive Lahome coupon code ${CODE} for 20% off washable cottagecore rugs, verified ${VERIFIED_MONTH}.`,
        dateModified: VERIFIED_ISO,
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
        <p className="deal-terms" style={{ marginTop: "4px" }}>
          ✓ Checked and working as of {VERIFIED_MONTH} — this is an exclusive code, not a
          scraped one.
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
        <h2>Why this code works when coupon-site codes don&apos;t</h2>
        <p>
          If you&apos;ve already tried a few Lahome codes from the big coupon aggregators
          and watched every one bounce at checkout, here&apos;s the reason: those sites
          scrape and crowdsource codes, so most of what they list is expired, regional, or
          was never public in the first place.
        </p>
        <p>
          <strong>{CODE} is different.</strong> Lahome issued it to Orla Loom directly as a
          reader offer, with a fixed 20% value and an end date we know
          (Dec 31, 2026). There is one code on this page rather than a list of twelve,
          because one is all that works — and we re-check it whenever we update the page.
        </p>
      </section>

      <section className="deal-section">
        <h2>What&apos;s worth buying at Lahome</h2>
        <p>
          Lahome&apos;s niche is the <strong>one-piece machine-washable rug</strong> — the
          non-slip backing is built in, so the whole rug goes in the washer with no
          separate pad to buy and no cover to wrestle back on. Their strongest category by
          far is faded vintage florals and scalloped borders, which is exactly the corner
          of the market the bigger washable-rug brands under-serve.
        </p>
        <p>
          On price, a 5×7 typically runs about $60–$120 before this code, against roughly
          $230–$280 for a two-piece cover-and-pad system from Ruggable. Applying{" "}
          {CODE} to a 5×7 or larger widens that gap further — and since the $70 minimum is
          below almost every rug above a 2×3, the code applies to most orders you&apos;d
          realistically place. We compare the two formats properly in{" "}
          <Link href="/blog/washable-rugs-like-ruggable">washable rugs like Ruggable</Link>.
        </p>
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
          <Link className="deal-guide-card" href="/blog/washable-rugs-like-ruggable">
            <b>Washable Rugs Like Ruggable</b>
            <span>How Lahome compares to Ruggable, and what you actually save.</span>
          </Link>
          <Link className="deal-guide-card" href="/blog/green-cottagecore-rugs">
            <b>Green Cottagecore Rugs</b>
            <span>Sage, moss and botanical greens for the garden end of the look.</span>
          </Link>
          <Link className="deal-guide-card" href="/blog/scalloped-floral-rugs">
            <b>Scalloped Floral Rugs</b>
            <span>The wavy scalloped borders Lahome does better than anyone.</span>
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
