import Link from "next/link";

// Server-rendered conversion helpers shown near the top of every buyer's guide:
//  1. "Our top pick" hero (the first, best product) with a strong CTA
//  2. A Lahome ORLALOOM20 deal strip (only when the guide features Lahome rugs)
//  3. An at-a-glance comparison table of every product in the guide
// All driven by the existing product frontmatter — no per-post changes needed.
export default function GuideExtras({ products = [], categoryName = "pick" }) {
  if (!products.length) return null;

  const top = products[0];
  const isLahome = products.some(
    (p) =>
      (p.retailer || "").toLowerCase().includes("lahome") ||
      (p.url || "").includes("awin1")
  );
  const noun = (categoryName || "pick").toLowerCase().replace(/s$/, "");

  return (
    <div className="guide-extras">
      {/* 1. TOP PICK */}
      <section className="top-pick">
        <div className="top-pick-media">
          {top.image && (
            top.url ? (
              <a href={top.url} target="_blank" rel="nofollow sponsored noopener" aria-label={top.name}>
                <img src={top.image} alt={`${top.name} — top ${noun} pick`} loading="eager" />
              </a>
            ) : (
              <img src={top.image} alt={`${top.name} — top ${noun} pick`} loading="eager" />
            )
          )}
        </div>
        <div className="top-pick-body">
          <span className="top-pick-flag">★ Our top pick</span>
          <h2 className="top-pick-name">{top.name}</h2>
          <div className="top-pick-meta">
            {top.brand}
            {top.brand && top.price ? " · " : ""}
            {top.price}
          </div>
          {top.blurb && <p className="top-pick-blurb">{top.blurb}</p>}
          {top.url && (
            <a className="btn top-pick-btn" href={top.url} target="_blank" rel="nofollow sponsored noopener">
              Check price on {top.retailer || "site"} →
            </a>
          )}
        </div>
      </section>

      {/* 2. LAHOME DEAL STRIP */}
      {isLahome && (
        <Link href="/lahome-discount-code" className="guide-deal">
          <span className="guide-deal-spark" aria-hidden="true">✦</span>
          <span className="guide-deal-text">
            <strong>Reader deal:</strong> take <strong>20% off</strong> every Lahome rug in this
            guide with code <span className="guide-deal-code">ORLALOOM20</span> (orders $70+).
          </span>
          <span className="guide-deal-cta">Get the code →</span>
        </Link>
      )}

      {/* 3. COMPARISON TABLE */}
      {products.length > 1 && (
        <section className="compare">
          <h2 className="compare-title">At a glance</h2>
          <div className="compare-scroll">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>{categoryName || "Pick"}</th>
                  <th>Best for</th>
                  <th>Price</th>
                  <th aria-label="Shop"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((pr, i) => (
                  <tr key={i}>
                    <td className="compare-name">
                      {pr.image && <span className="compare-thumb"><img src={pr.image} alt="" loading="lazy" /></span>}
                      <span>{pr.name}</span>
                    </td>
                    <td>{pr.badge || "—"}</td>
                    <td className="compare-price">{pr.price || "—"}</td>
                    <td>
                      {pr.url && (
                        <a className="compare-shop" href={pr.url} target="_blank" rel="nofollow sponsored noopener">
                          Shop →
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
