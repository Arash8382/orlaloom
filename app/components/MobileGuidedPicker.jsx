"use client";

import { useState } from "react";
import Link from "next/link";

// Mobile-only storefront (Amazon-style): category filter chips pinned on top,
// a scrollable grid of ALL products below. Default shows everything so shoppers
// can just scroll; tapping a chip filters in place. Each card links to
// /shop/[slug]. Rendered only under 900px (see .mobile-only in globals.css).
export default function MobileGuidedPicker({ chips, products }) {
  const [sel, setSel] = useState("all");
  const [n, setN] = useState(24);

  const list = sel === "all" ? products : products.filter((p) => p.group === sel);
  const shown = list.slice(0, n);

  const pick = (k) => {
    setSel(k);
    setN(24);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <div className="mgp">
      <div className="mgp-head2">
        <span className="eyebrow">Cosy finds, gently chosen</span>
        <h1 className="mgp-q2">Shop the collection</h1>
      </div>

      <div className="mgp-chips" role="tablist" aria-label="Shop by space">
        {chips.map((c) => (
          <button
            key={c.key}
            className={"mgp-chip" + (sel === c.key ? " is-on" : "")}
            onClick={() => pick(c.key)}
            aria-pressed={sel === c.key}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mgp-grid2">
        {shown.map((p) => (
          <Link key={p.slug} href={`/shop/${p.slug}`} className="mgp-card">
            <div className="mgp-card-imgw">
              <img src={p.image} alt={p.name} loading="lazy" />
            </div>
            <div className="mgp-card-name">{p.name}</div>
            <div className="mgp-card-row">
              {p.price ? <span className="mgp-price">{p.price}</span> : <span />}
              <span className="mgp-shop">Shop</span>
            </div>
          </Link>
        ))}
      </div>

      {n < list.length && (
        <button className="mgp-more" onClick={() => setN(n + 24)}>
          Show more ({list.length - n})
        </button>
      )}
    </div>
  );
}
