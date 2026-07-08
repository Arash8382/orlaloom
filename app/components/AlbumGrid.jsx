const css = `
.al-sec{max-width:1180px;margin:0 auto;padding:20px 30px 46px}
.al-head{display:flex;align-items:baseline;gap:10px;margin:0 0 4px}
.al-eyebrow{font-family:var(--sans,inherit);letter-spacing:.18em;font-size:11px;font-weight:700;color:var(--terra,#c07a54);text-transform:uppercase;margin-bottom:6px}
.al-title{font-family:var(--serif,Georgia,serif);font-size:clamp(24px,3vw,32px);color:var(--head,#4a2e25);font-weight:500;margin:0}
.al-count{font-family:var(--sans,inherit);font-size:13px;color:#fff;background:var(--terra,#c07a54);border-radius:20px;padding:2px 10px}
.al-sub{font-family:Lora,Georgia,serif;font-style:italic;color:var(--muted-2,#7c6a5f);font-size:14px;margin:2px 0 18px}
.al-grid{column-count:4;column-gap:14px}
.al-tile{display:block;break-inside:avoid;margin:0 0 14px;position:relative;border-radius:14px;overflow:hidden;text-decoration:none;background:#fff;box-shadow:0 6px 18px rgba(60,45,35,.10)}
.al-tile img{width:100%;display:block;transition:transform .5s ease}
.al-tile:hover img{transform:scale(1.045)}
.al-cap{position:absolute;left:0;right:0;bottom:0;padding:28px 13px 12px;background:linear-gradient(to top,rgba(40,28,20,.85),rgba(40,28,20,0));opacity:0;transition:opacity .18s}
.al-tile:hover .al-cap{opacity:1}
.al-name{font-family:var(--serif,Georgia,serif);color:#fff;font-size:14px;line-height:1.25}
.al-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:6px}
.al-price{font-family:var(--serif,Georgia,serif);color:#f3e4d8;font-size:13px}
.al-shop{font-family:var(--sans,inherit);font-size:11px;font-weight:700;color:var(--head,#4a2e25);background:#fff;border-radius:20px;padding:4px 10px;white-space:nowrap}
.al-badge{position:absolute;top:10px;left:10px;font-family:var(--sans,inherit);font-size:10.5px;font-weight:700;letter-spacing:.02em;color:var(--head,#4a2e25);background:rgba(255,255,255,.92);border-radius:20px;padding:4px 10px;z-index:2}
@media(max-width:1000px){.al-grid{column-count:3}}
@media(max-width:680px){.al-grid{column-count:2}.al-sec{padding:16px 16px 40px}}
@media(hover:none){.al-cap{opacity:1;background:linear-gradient(to top,rgba(40,28,20,.72),rgba(40,28,20,0))}}
`;

export default function AlbumGrid({ products = [], catName = "the collection", eyebrow = "The finds", title, sub = "Just the pieces — tap any image to shop it.", showCount = true }) {
  const items = products.filter((p) => p && p.image && p.url);
  if (items.length === 0) return null;
  const heading = title || `Shop all ${catName.toLowerCase()}`;
  return (
    <section className="al-sec">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="al-eyebrow">{eyebrow}</div>
      <div className="al-head">
        <h2 className="al-title">{heading}</h2>
        {showCount && <span className="al-count">{items.length}</span>}
      </div>
      <p className="al-sub">{sub}</p>
      <div className="al-grid">
        {items.map((p, i) => (
          <a key={i} className="al-tile" href={p.url} target="_blank" rel="nofollow sponsored noopener" aria-label={`Shop ${p.name}`}>
            {p.badge && <span className="al-badge">{p.badge}</span>}
            <img src={p.image} alt={p.name} loading="lazy" />
            <div className="al-cap">
              <div className="al-name">{p.name}</div>
              <div className="al-row">
                <span className="al-price">{p.price}</span>
                <span className="al-shop">Shop →</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
