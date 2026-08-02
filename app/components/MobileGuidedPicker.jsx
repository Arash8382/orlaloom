"use client";

import { useState } from "react";
import Link from "next/link";

// Mobile-only "guided picker" home experience: one warm question, tap a space,
// get a short curated list of top picks that link straight to /shop/[slug].
// Rendered only under 900px (see .mobile-only in globals.css); desktop keeps
// the room-slider hero.
export default function MobileGuidedPicker({ groups }) {
  const [sel, setSel] = useState(null);
  const group = groups.find((g) => g.key === sel) || null;

  return (
    <div className="mgp">
      <div className="mgp-head">
        <span className="eyebrow">Cosy finds, gently chosen</span>
        <h1 className="mgp-q">{group ? group.label : "What are you making cosier?"}</h1>
        {!group && <p className="mgp-sub">Tap a space and we&rsquo;ll show you our best picks for it.</p>}
      </div>

      {!group && (
        <div className="mgp-tiles">
          {groups.map((g) => (
            <button
              key={g.key}
              className="mgp-tile"
              onClick={() => setSel(g.key)}
              style={g.cover ? { backgroundImage: `url(${g.cover})` } : undefined}
              aria-label={`Show ${g.label} picks`}
            >
              <span className="mgp-tile-scrim" />
              <span className="mgp-tile-label">
                {g.label}
                <small>{g.products.length} picks</small>
              </span>
            </button>
          ))}
        </div>
      )}

      {group && (
        <div className="mgp-picks">
          <button className="mgp-back" onClick={() => setSel(null)}>← All spaces</button>
          <div className="mgp-grid">
            {group.products.map((p) => (
              <Link key={p.slug} href={`/shop/${p.slug}`} className="mgp-card">
                <div
                  className="mgp-card-img"
                  style={p.image ? { backgroundImage: `url(${p.image})` } : undefined}
                />
                <div className="mgp-card-name">{p.name}</div>
                <div className="mgp-card-row">
                  {p.price ? <span className="mgp-price">{p.price}</span> : <span />}
                  <span className="mgp-shop">Shop</span>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/shop" className="mgp-all">Browse the whole shop →</Link>
        </div>
      )}
    </div>
  );
}
