// Server-rendered conversion helpers shown near the top of every buyer's guide:
//  1. "Our top pick" hero (the first, best product) with a strong CTA
//  2. An at-a-glance comparison table of every product in the guide
// The Lahome ORLALOOM20 deal is surfaced by the site-wide top banner, so it is
// intentionally NOT repeated here. Driven by existing product frontmatter.
import SaveButton from "./SaveButton";

export default function GuideExtras({ products = [], categoryName = "pick" }) {
  if (!products.length) return null;

  const top = products[0];
  const noun = (categoryName || "pick").toLowerCase().replace(/s$/, "");

  return (
    <div className="guide-extras">
      {/* 1. TOP PICK */}
      <section className="top-pick">
        <div className="top-pick-media">
          <style dangerouslySetInnerHTML={{ __html: geCss }} />
          {top.image && (
            top.url ? (
              <a href={top.url} target="_blank" rel="nofollow sponsored noopener" aria-label={top.name}>
                <img src={top.image} alt={`${top.name} — top ${noun} pick`} loading="eager" />
              </a>
            ) : (
              <img src={top.image} alt={`${top.name} — top ${noun} pick`} loading="eager" />
            )
          )}
          <SaveButton product={top} className="tp-save" />
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

      {/* 2. COMPARISON — semantic <table> so Google + AI answer engines can
          extract it cleanly, styled to match the site. */}
      {products.length > 1 && (
        <section className="ge-compare">
          <style dangerouslySetInnerHTML={{ __html: geCss }} />
          <div className="ge-eyebrow">Compare</div>
          <h2 className="ge-compare-title">{categoryName || "Picks"} compared at a glance</h2>
          <div className="ge-card">
            <table className="ge-table">
              <caption className="ge-sr">Comparison of {products.length} {(categoryName || "picks").toLowerCase()}: product, what it's best for, and price.</caption>
              <thead>
                <tr>
                  <th scope="col">{categoryName || "Pick"}</th>
                  <th scope="col" className="ge-col-best">Best for</th>
                  <th scope="col">Price</th>
                  <th scope="col"><span className="ge-sr">Shop link</span></th>
                  <th scope="col"><span className="ge-sr">Save</span></th>
                </tr>
              </thead>
              <tbody>
                {products.map((pr, i) => (
                  <tr key={i}>
                    <th scope="row" className="ge-prod">
                      {pr.image && <span className="ge-thumb"><img src={pr.image} alt="" loading="lazy" /></span>}
                      {pr.url ? (
                        <a className="ge-name" href={pr.url} target="_blank" rel="nofollow sponsored noopener">{pr.name}</a>
                      ) : (
                        <span className="ge-name">{pr.name}</span>
                      )}
                    </th>
                    <td className="ge-col-best">{pr.badge ? <span className="ge-pill">{pr.badge}</span> : <span className="ge-dash">—</span>}</td>
                    <td className="ge-price">{pr.price || "—"}</td>
                    <td className="ge-shop-cell">{pr.url && <a className="ge-shop" href={pr.url} target="_blank" rel="nofollow sponsored noopener">Shop →</a>}</td>
                    <td className="ge-save-cell"><SaveButton product={pr} className="ge-save" /></td>
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

const geCss = `
.ge-compare{margin:30px 0 8px}
.ge-eyebrow{font-family:var(--sans,inherit);letter-spacing:.18em;font-size:11px;font-weight:700;color:var(--terra,#c07a54);text-transform:uppercase;margin-bottom:6px}
.ge-compare-title{font-family:var(--serif,Georgia,serif);font-size:clamp(22px,2.6vw,28px);color:var(--head,#4a2e25);font-weight:500;margin:0 0 14px}
.ge-card{background:#fff;border:1px solid var(--line,#ecdfce);border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(60,45,35,.08)}
.ge-sr{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.ge-table{width:100%;border-collapse:collapse}
.ge-table thead th{font-family:var(--sans,inherit);font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted-2,#9a8778);background:var(--cream,#faf4ea);text-align:left;padding:13px 18px;white-space:nowrap}
.ge-table tbody tr{border-top:1px solid var(--line,#f0e6d8);transition:background .15s}
.ge-table tbody tr:hover{background:var(--cream,#faf4ea)}
.ge-table td,.ge-table tbody th{padding:12px 18px;text-align:left;vertical-align:middle;font-weight:400}
.top-pick-media{position:relative}
.top-pick-media .save-btn.tp-save{position:absolute;top:12px;right:12px;z-index:4}
.ge-prod{display:flex;align-items:center;gap:12px;min-width:0}
.ge-thumb{flex:0 0 auto;width:46px;height:46px;border-radius:10px;overflow:hidden;background:var(--cream,#faf4ea);border:1px solid var(--line,#f0e6d8)}
.ge-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.ge-name{font-family:var(--serif,Georgia,serif);font-size:15px;color:var(--head,#4a2e25);line-height:1.25;text-decoration:none;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
a.ge-name:hover{text-decoration:underline}
.ge-pill{display:inline-block;font-family:var(--sans,inherit);font-size:11.5px;font-weight:700;color:var(--terra-ink,#8a4a30);background:var(--terra-tint,#f6e7de);border-radius:20px;padding:4px 11px}
.ge-dash{color:var(--muted-2,#b8a894)}
.ge-price{font-family:var(--serif,Georgia,serif);font-size:15px;color:var(--head,#4a2e25);font-weight:600;white-space:nowrap}
.ge-shop-cell{white-space:nowrap;text-align:right}
.ge-shop{display:inline-block;font-family:var(--sans,inherit);font-size:12px;font-weight:700;color:#fff;background:var(--terra,#c07a54);border-radius:20px;padding:7px 13px;text-decoration:none;white-space:nowrap}
.ge-shop:hover{background:var(--terra-dk,#a8623f)}
.ge-save-cell{width:44px;text-align:center}
.ge-card .save-btn.ge-save{position:relative;top:auto;right:auto;width:32px;height:32px;background:var(--cream,#faf4ea);box-shadow:none}
.ge-card .save-btn.ge-save:hover{background:#fff}
@media(max-width:640px){
  .ge-table td,.ge-table tbody th,.ge-table thead th{padding:11px 13px}
  .ge-col-best,.ge-shop-cell,.ge-table thead th.ge-col-best,.ge-table thead th:nth-child(4){display:none}
  .ge-name{font-size:14px}
}`;
