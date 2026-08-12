"use client";
import { useState } from "react";
import SaveButton from "./SaveButton";

// Multi-image product gallery. Falls back to a plain single image when enrichment
// only found one photo, so the layout is identical to the pre-gallery version.
export default function ProductGallery({ images = [], name, product }) {
  const [i, setI] = useState(0);
  const list = images.filter(Boolean);
  const active = list[i] || list[0];

  return (
    <div>
      <div
        style={{
          position: "relative",
          background: "var(--card, #fbf7f0)",
          border: "1px solid var(--line, #e7ddcf)",
          borderRadius: 16,
          overflow: "hidden",
          aspectRatio: "1 / 1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {active ? (
          <img
            src={active}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}
        {product ? <SaveButton product={product} /> : null}
      </div>

      {list.length > 1 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(list.length, 6)}, 1fr)`,
            gap: 8,
            marginTop: 8,
          }}
        >
          {list.slice(0, 6).map((src, idx) => (
            <button
              key={src}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`View image ${idx + 1} of ${name}`}
              style={{
                padding: 0,
                cursor: "pointer",
                background: "var(--card,#fbf7f0)",
                border: idx === i ? "2px solid var(--head)" : "1px solid var(--line,#e7ddcf)",
                borderRadius: 10,
                overflow: "hidden",
                aspectRatio: "1 / 1",
              }}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
