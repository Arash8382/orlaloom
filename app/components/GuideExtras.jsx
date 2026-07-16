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

      {/* 2. COMPARISON — elegant rows, whole row clicks through to shop */}
      {products.length > 1 && (
        <section className="ge-compare">
          <style dangerouslySetInnerHTML={{ __html: geCss }} />
          <div className="ge-eyebrow">Compare</div>
          <h2 className="ge-compare-title">At a glance</h2>
          <div className="ge-card">
            <div className="ge-row ge-head" aria-hidden="true">
              <span>{categoryName || "Pick"}</span>
              <span className="ge-col-best">Best for</span>
              <span>Price</span>
              <span></span>
              <span></span>
            </div>
            {products.map((pr, i) => (
              <div key={i} className="ge-row">
                {pr.url && (
                  <a
                    className="ge-rowfill"
                    href={pr.url}
                    target="_blank"
                    rel="nofollow sponsored noopener"
                    aria-label={`Shop ${pr.name}`}
                  />
                )}
                <span className="ge-prod">
                  {pr.image && <span className="ge-thumb"><img src={pr.image} alt="" loading="lazy" /></span>}
                  <span className="ge-name">{pr.name}</span>
                </span>
                <span className="ge-col-best">{pr.badge ? <span className="ge-pill">{pr.badge}</span> : <span className="ge-dash">—</span>}</span>
                <span className="ge-price">{pr.price || "—"}</span>
                <span className="ge-shop">{pr.url ? "Shop →" : ""}</span>
                <SaveButton product={pr} className="ge-save" />
              </div>
            ))}
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
.ge-row{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 150px 96px 92px 40px;align-items:center;gap:12px;padding:12px 18px;text-decoration:none;color:inherit;border-top:1px solid var(--line,#f0e6d8);transition:background .15s}
.ge-row:first-child{border-top:0}
.ge-row:hover{background:var(--cream,#faf4ea)}
.ge-rowfill{position:absolute;inset:0;z-index:1}
.ge-prod,.ge-col-best,.ge-price,.ge-shop{position:relative;z-index:2;pointer-events:none}
.ge-card .save-btn.ge-save{position:relative;z-index:3;pointer-events:auto;top:auto;right:auto;justify-self:center;width:32px;height:32px;background:var(--cream,#faf4ea);box-shadow:none}
.ge-card .save-btn.ge-save:hover{background:#fff}
.top-pick-media{position:relative}
.top-pick-media .save-btn.tp-save{position:absolute;top:12px;right:12px;z-index:4}
.ge-head{font-family:var(--sans,inherit);font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted-2,#9a8778);padding-top:13px;padding-bottom:13px;background:var(--cream,#faf4ea)}
.ge-prod{display:flex;align-items:center;gap:12px;min-width:0}
.ge-thumb{flex:0 0 auto;width:46px;height:46px;border-radius:10px;overflow:hidden;background:var(--cream,#faf4ea);border:1px solid var(--line,#f0e6d8)}
.ge-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.ge-name{font-family:var(--serif,Georgia,serif);font-size:15px;color:var(--head,#4a2e25);line-height:1.25;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.ge-pill{display:inline-block;font-family:var(--sans,inherit);font-size:11.5px;font-weight:700;color:var(--terra-ink,#8a4a30);background:var(--terra-tint,#f6e7de);border-radius:20px;padding:4px 11px}
.ge-dash{color:var(--muted-2,#b8a894)}
.ge-price{font-family:var(--serif,Georgia,serif);font-size:15px;color:var(--head,#4a2e25);font-weight:600}
.ge-shop{font-family:var(--sans,inherit);font-size:12px;font-weight:700;color:#fff;background:var(--terra,#c07a54);border-radius:20px;padding:7px 13px;text-align:center;white-space:nowrap;justify-self:end}
a.ge-row:hover .ge-shop{background:var(--terra-dk,#a8623f)}
@media(max-width:640px){
  .ge-row{grid-template-columns:minmax(0,1fr) auto 34px;gap:10px;padding:11px 13px}
  .ge-col-best,.ge-shop{display:none}
  .ge-head{display:none}
  .ge-name{font-size:14px}
}`;
