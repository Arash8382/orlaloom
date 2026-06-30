import Link from "next/link";
import { site } from "../../lib/site";
import { getAllProducts } from "../../lib/posts";

export const metadata = {
  title: "Support Orla Loom",
  description: "A little way to help Orla Loom grow — shop on Amazon through our links at no extra cost to you.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/support" },
};

const AMAZON_HOME = "https://www.amazon.com/?tag=orlaloom-20";

export default function SupportPage() {
  const all = getAllProducts();
  // A handful of real, image-backed Amazon picks to make the page feel curated.
  const seen = new Set();
  const picks = all
    .filter((p) => p.image && /amazon\./i.test(p.url || ""))
    .filter((p) => {
      const k = p.name;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .slice(0, 8);

  return (
    <div className="support-page container">
      <section className="support-hero">
        <span className="eyebrow">A small favour 🤎</span>
        <h1>Help Orla Loom grow</h1>
        <p className="support-lede">
          Orla Loom is a brand-new, independent little shop of cottagecore home finds.
          If you were going to buy something on Amazon anyway, you can give us a real boost — at
          <strong> no extra cost to you</strong>.
        </p>
        <ol className="support-steps">
          <li>Tap the button below to open Amazon.</li>
          <li>Buy whatever you were already planning to (anything qualifies).</li>
          <li>As long as it’s within 24 hours of tapping, it helps us. That’s it!</li>
        </ol>
        <a className="support-cta" href={AMAZON_HOME} target="_blank" rel="nofollow sponsored noopener">
          Shop on Amazon →
        </a>
        <p className="support-fine">
          It costs you nothing — Amazon simply gives us a small thank-you for sending you their way.
        </p>
      </section>

      {picks.length > 0 && (
        <section className="support-picks">
          <span className="eyebrow">…or grab one of our favourite finds</span>
          <div className="product-grid">
            {picks.map((p, i) => (
              <div className="product-card" key={i}>
                <div className="product-img">
                  <a className="img-link" href={p.url} target="_blank" rel="nofollow sponsored noopener" aria-label={p.name}>
                    <img src={p.image} alt={p.name} loading="lazy" />
                  </a>
                </div>
                <div className="product-body">
                  <h3>{p.name}</h3>
                  <div className="meta">{[p.brand, p.price].filter(Boolean).join(" · ")}</div>
                  <a className="buy" href={p.url} target="_blank" rel="nofollow sponsored noopener">Shop on Amazon →</a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="support-back">
        <Link href="/">← Explore the full {site.name} shop</Link>
      </p>
    </div>
  );
}
