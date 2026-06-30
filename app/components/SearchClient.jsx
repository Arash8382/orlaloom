"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

export default function SearchClient({ products, categories }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  const catName = useMemo(() => {
    const m = {}; categories.forEach((c) => (m[c.slug] = c.name)); return m;
  }, [categories]);

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return products.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (!terms.length) return true;
      const hay = `${p.name} ${p.brand} ${catName[p.category] || p.category} ${p.guideTitle}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [q, cat, products, catName]);

  return (
    <div className="search-page container">
      <h1 className="search-title">Search the shop</h1>
      <p className="search-sub">Find any product by name, brand, or category across {products.length} curated finds.</p>

      <div className="search-bar">
        <span aria-hidden>🔍</span>
        <input
          autoFocus
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try “mushroom butter dish”, “amber glass”, “Smeg”…"
          aria-label="Search products"
        />
        {q && <button className="clear" onClick={() => setQ("")} aria-label="Clear">×</button>}
      </div>

      <div className="search-chips">
        <button className={cat === "" ? "chip on" : "chip"} onClick={() => setCat("")}>All</button>
        {categories.map((c) => (
          <button key={c.slug} className={cat === c.slug ? "chip on" : "chip"} onClick={() => setCat(c.slug)}>{c.name}</button>
        ))}
      </div>

      <div className="search-count">{results.length} {results.length === 1 ? "result" : "results"}</div>

      {results.length === 0 ? (
        <p className="search-empty">No products match “{q}”. Try a different word, or browse a category above.</p>
      ) : (
        <div className="product-grid">
          {results.map((p, i) => (
            <div className="product-card" key={i}>
              <div className="product-img">
                {p.image ? <img src={p.image} alt={p.name} loading="lazy" /> : null}
                {p.badge ? <span className="badge">{p.badge}</span> : null}
              </div>
              <div className="product-body">
                <h3>{p.name}</h3>
                <div className="meta">{[p.brand, p.price].filter(Boolean).join(" · ")}</div>
                <a className="buy" href={p.url} target="_blank" rel="nofollow sponsored noopener">Shop on {p.retailer || "Amazon"} →</a>
                <Link className="from-guide" href={`/blog/${p.guideSlug}`}>Read the guide →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
