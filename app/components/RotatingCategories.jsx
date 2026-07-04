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

function firstFour(cat) {
  const out = cat.thumbs.slice(0, 4);
  while (out.length < 4) out.push(cat.fallback);
  return out;
}

function randomFour(cat) {
  const out = shuffle(cat.thumbs).slice(0, 4);
  while (out.length < 4) out.push(cat.fallback);
  return out;
}

// Amazon-style category cards. Server + first render use a stable order and the
// first 4 thumbnails (SEO-safe, no hydration mismatch). After mount we shuffle
// the card order AND each card's 4 product thumbnails, so the homepage looks
// fresh on every repeat visit.
export default function RotatingCategories({ cats }) {
  const [ordered, setOrdered] = useState(cats);
  const [thumbMap, setThumbMap] = useState(() => {
    const m = {};
    for (const c of cats) m[c.slug] = firstFour(c);
    return m;
  });

  useEffect(() => {
    setOrdered(shuffle(cats));
    const m = {};
    for (const c of cats) m[c.slug] = randomFour(c);
    setThumbMap(m);
  }, [cats]);

  return (
    <div className="catcard-grid">
      {ordered.map((c) => (
        <Link className="catcard" href={`/category/${c.slug}`} key={c.slug}>
          <div className="catcard-thumbs">
            {(thumbMap[c.slug] || []).map((src, i) => (
              <span className="cct" key={i}>
                <img src={src} alt={`${c.name} pick`} loading="lazy" />
              </span>
            ))}
          </div>
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
