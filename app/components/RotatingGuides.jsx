"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Renders the "Loved by the Loom community" grid. Server + first client render
// show a stable set (good for SEO + no hydration mismatch); after mount we
// reshuffle so repeat visitors see a fresh mix of guides every time.
export default function RotatingGuides({ guides, count = 6 }) {
  const [items, setItems] = useState(guides.slice(0, count));

  useEffect(() => {
    setItems(shuffle(guides).slice(0, count));
  }, [guides, count]);

  return (
    <div className="guides-grid">
      {items.map((p) => (
        <Link className="guide-card" href={`/blog/${p.slug}`} key={p.slug}>
          <div className="ph">
            <img src={p.cover} alt={p.title} loading="lazy" />
          </div>
          <div className="guide-body">
            <div className="guide-tag">{p.catName}</div>
            <div className="guide-title">{p.title}</div>
            <div className="guide-meta">Buyer’s guide · updated 2026</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
