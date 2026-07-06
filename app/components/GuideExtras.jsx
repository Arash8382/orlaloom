// Server-rendered conversion helpers shown near the top of every buyer's guide:
//  1. "Our top pick" hero (the first, best product) with a strong CTA
//  2. An at-a-glance comparison table of every product in the guide
// The Lahome ORLALOOM20 deal is surfaced by the site-wide top banner, so it is
// intentionally NOT repeated here. Driven by existing product frontmatter.
export default function GuideExtras({ products = [], categoryName = "pick" }) {
  if (!products.length) return null;

  const top = products[0];
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

      {/* 2. COMPARISON TABLE */}
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
