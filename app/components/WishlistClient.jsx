"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import EmailSignup from "./EmailSignup";
import { getWishlist, removeItem, clearWishlist, addItems, encodeList, decodeList, WISHLIST_EVENT } from "../../lib/wishlist";

const css = `
.wl-wrap{max-width:1000px;margin:0 auto;padding:26px 24px 60px}
.wl-h1{font-family:var(--serif,Georgia,serif);font-size:clamp(26px,3.4vw,38px);color:var(--head,#4a2e25);margin:6px 0 6px}
.wl-lead{color:var(--muted-2,#7c6a5f);font-size:15px;margin:0 0 20px;max-width:60ch}
.wl-bar{display:flex;flex-wrap:wrap;gap:10px;margin:0 0 22px}
.wl-btn{font-family:var(--sans,inherit);font-size:13px;font-weight:700;border-radius:22px;padding:9px 16px;cursor:pointer;border:1px solid var(--line,#e7ddcf);background:#fff;color:var(--head,#4a2e25)}
.wl-btn.primary{background:var(--head,#4a2e25);color:#fff;border-color:var(--head,#4a2e25)}
.wl-btn:hover{filter:brightness(1.04)}
.wl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px}
.wl-card{position:relative;background:#fff;border:1px solid var(--line,#e7ddcf);border-radius:14px;overflow:hidden;box-shadow:0 5px 16px rgba(60,45,35,.08);display:flex;flex-direction:column}
.wl-card img{width:100%;aspect-ratio:1/1;object-fit:cover;display:block}
.wl-body{padding:12px 13px 14px;display:flex;flex-direction:column;gap:8px;flex:1}
.wl-name{font-family:var(--serif,Georgia,serif);color:var(--head,#4a2e25);font-size:14px;line-height:1.3}
.wl-brand{font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:var(--terra,#c07a54);font-weight:700}
.wl-foot{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:8px}
.wl-price{font-family:var(--serif,Georgia,serif);color:var(--ink,#4a3d34);font-size:14px}
.wl-shop{font-family:var(--sans,inherit);font-size:12px;font-weight:700;color:#fff;background:var(--terra,#c07a54);border-radius:20px;padding:6px 12px;text-decoration:none;white-space:nowrap}
.wl-x{position:absolute;top:8px;right:8px;width:30px;height:30px;border:none;border-radius:50%;background:rgba(255,255,255,.92);color:var(--head,#4a2e25);cursor:pointer;font-size:16px;line-height:1;box-shadow:0 2px 8px rgba(60,45,35,.16)}
.wl-x:hover{background:#fff}
.wl-empty{text-align:center;padding:40px 16px;border:1px dashed var(--line,#e7ddcf);border-radius:16px;background:var(--card,#fbf7f0)}
.wl-empty h2{font-family:var(--serif,Georgia,serif);color:var(--head,#4a2e25);font-size:22px;margin:0 0 8px}
.wl-empty p{color:var(--muted-2,#7c6a5f);margin:0 auto 16px;max-width:46ch}
.wl-share-note{background:var(--card,#fbf7f0);border:1px solid var(--line,#e7ddcf);border-left:4px solid var(--terra,#c07a54);border-radius:12px;padding:12px 16px;margin:0 0 18px;color:var(--ink,#4a3d34);font-size:14px}
.wl-toast{display:inline-block;margin-left:10px;color:var(--terra,#c07a54);font-weight:700;font-size:13px}
`;

export default function WishlistClient({ shared = "" }) {
  const [mine, setMine] = useState([]);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [addedShared, setAddedShared] = useState(false);

  const sharedItems = shared ? decodeList(shared) : [];
  const viewingShared = sharedItems.length > 0;

  useEffect(() => {
    setReady(true);
    const sync = () => setMine(getWishlist());
    sync();
    window.addEventListener(WISHLIST_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(WISHLIST_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const shareMyList = async () => {
    const url = `${window.location.origin}/wishlist?list=${encodeList(mine)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "My Orla Loom wishlist", url });
        return;
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copy your shareable wishlist link:", url);
    }
  };

  const Card = ({ p, onRemove }) => (
    <div className="wl-card">
      {onRemove && (
        <button className="wl-x" aria-label={`Remove ${p.name}`} onClick={() => onRemove(p.url)}>
          ×
        </button>
      )}
      {p.image && <img src={p.image} alt={p.name} loading="lazy" />}
      <div className="wl-body">
        {p.brand && <div className="wl-brand">{p.brand}</div>}
        <div className="wl-name">{p.name}</div>
        <div className="wl-foot">
          <span className="wl-price">{p.price}</span>
          <a className="wl-shop" href={p.url} target="_blank" rel="nofollow sponsored noopener">
            Shop →
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="wl-wrap">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {viewingShared ? (
        <>
          <span className="eyebrow">A shared list</span>
          <h1 className="wl-h1">Someone shared their cottagecore picks with you</h1>
          <div className="wl-share-note">
            These are hand-picked cottagecore finds. Tap <strong>Shop</strong> on any piece, or save the whole list to your own so you can come back to it.
          </div>
          <div className="wl-bar">
            <button
              className="wl-btn primary"
              onClick={() => {
                addItems(sharedItems);
                setAddedShared(true);
              }}
            >
              {addedShared ? "✓ Saved to your list" : "Save all to my list"}
            </button>
            <Link className="wl-btn" href="/wishlist">
              View my saved picks
            </Link>
          </div>
          <div className="wl-grid">
            {sharedItems.map((p, i) => (
              <Card key={i} p={p} />
            ))}
          </div>
        </>
      ) : (
        <>
          <span className="eyebrow">Your list</span>
          <h1 className="wl-h1">Your saved picks</h1>
          <p className="wl-lead">
            Everything you&rsquo;ve hearted, in one place — saved right on this device, no account needed. Share the list with a friend, or send yourself a reminder.
          </p>

          {ready && mine.length === 0 ? (
            <div className="wl-empty">
              <h2>Nothing saved yet</h2>
              <p>Tap the ♥ on any product to save it here. Build a gift list, a room refresh, or a someday wishlist.</p>
              <Link className="wl-btn primary" href="/category/home-decor">
                Browse the guides
              </Link>
            </div>
          ) : (
            <>
              <div className="wl-bar">
                <button className="wl-btn primary" onClick={shareMyList} disabled={mine.length === 0}>
                  Share my list
                </button>
                {copied && <span className="wl-toast">Link copied ✓</span>}
                {mine.length > 0 && (
                  <button className="wl-btn" onClick={() => clearWishlist()}>
                    Clear all
                  </button>
                )}
              </div>
              <div className="wl-grid">
                {mine.map((p, i) => (
                  <Card key={i} p={p} onRemove={removeItem} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      <div style={{ marginTop: 34 }}>
        <EmailSignup
          variant="card"
          heading="Want a reminder about your list?"
          sub="Pop in your email and we'll send your saved cottagecore picks to your inbox — plus new finds a couple of times a month."
        />
      </div>
    </div>
  );
}
