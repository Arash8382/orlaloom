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

// Editorial category cards: one clean lifestyle image per category (consistent,
// magazine-style). Server + first render use a stable order (SEO-safe, no
// hydration mismatch); after mount we reshuffle the card order so repeat
// visitors still get a fresh-feeling homepage.
export default function RotatingCategories({ cats }) {
  const [ordered, setOrdered] = useState(cats);

  useEffect(() => {
    setOrdered(shuffle(cats));
  }, [cats]);

  return (
    <div className="catcard-grid">
      {ordered.map((c) => (
        <Link className="catcard" href={`/category/${c.slug}`} key={c.slug}>
          <span className="catcard-hero">
            <img src={c.fallback} alt={`${c.name} — cottagecore finds`} loading="lazy" />
          </span>
          <div className="catcard-foot">
            <div className="catcard-name">{c.name}</div>
            <div className="catcard-cta">
              {c.guideCount > 0
                ? `${c.guideCount} guide${c.guideCount > 1 ? "s" : ""}`
                : "New finds"}{" "}
              <span className="arrow">→</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
