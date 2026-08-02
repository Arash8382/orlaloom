"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SaveButton from "./SaveButton";

// Storefront (Amazon-style), used on every screen size: one chip menu on top
// that swaps a category banner (with dot indicators) and filters the product
// grid below. Each card links to /shop/[slug].
export default function MobileGuidedPicker({ chips, products }) {
  const [sel, setSel] = useState("all");
  const [n, setN] = useState(24);

  const cur = chips.find((c) => c.key === sel) || chips[0];
  const list = sel === "all" ? products : products.filter((p) => p.group === sel);
  const shown = list.slice(0, n);

  const pick = (k) => {
    setSel(k);
    setN(24);
  };

  // Infinite scroll: when the sentinel near the bottom scrolls into view, load
  // the next batch automatically (no "Show more" click needed).
  const sentinel = useRef(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setN((prev) => prev + 24);
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [sel, list.length]);

  return (
    <div className="mgp">
      <div className="mgp-head2">
        <span className="eyebrow">Cosy finds, gently chosen</span>
        <h1 className="mgp-q2">Shop the collection</h1>
        <p className="mgp-sub2">Pick a space, then scroll the finds.</p>
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

      {cur && cur.banner && (
        <div className="mgp-banner" style={{ backgroundImage: `url(${cur.banner})` }}>
          <span className="mgp-banner-scrim" />
          <span className="mgp-banner-label">{cur.label}</span>
          <div className="mgp-dots">
            {chips.map((c) => (
              <button
                key={c.key}
                className={"mgp-dot" + (sel === c.key ? " is-on" : "")}
                onClick={() => pick(c.key)}
                aria-label={`Show ${c.label}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mgp-grid2">
        {shown.map((p) => (
          <Link key={p.slug} href={`/shop/${p.slug}`} className="mgp-card">
            <div className="mgp-card-imgw">
              <img src={p.image} alt={p.name} loading="lazy" />
              <SaveButton product={{ name: p.name, image: p.image, price: p.price, url: p.url || `${p.slug}`, brand: p.brand }} />
            </div>
            <div className="mgp-card-name">{p.name}</div>
            <div className="mgp-card-row">
              {p.price ? <span className="mgp-price">{p.price}</span> : <span />}
              <span className="mgp-shop">Shop</span>
            </div>
          </Link>
        ))}
      </div>

      {n < list.length && <div ref={sentinel} className="mgp-sentinel" aria-hidden="true" />}
    </div>
  );
}
