"use client";
import { useState } from "react";
import SaveButton from "./SaveButton";

// Multi-image product gallery. Falls back to a plain single image when enrichment
// only found one photo, so the layout is identical to the pre-gallery version.
//
// objectFit is "contain", not "cover": retailer product photos come in every aspect
// ratio, and cropping them to a square sliced the top and bottom off wide shots
// (the Smeg toaster lost its lid and feet). Showing the whole product matters more
// than filling the box, so the box gets a soft card background and letterboxes.
export default function ProductGallery({ images = [], name, product }) {
  const [i, setI] = useState(0);
  const list = images.filter(Boolean);
  const active = list[i] || list[0];

  return (
    <div>
      <div
        style={{
          position: "relative",
          background: "#fff",
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
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: 14, boxSizing: "border-box" }}
          />
        ) : null}
        {product ? <SaveButton product={product} /> : null}
      </div>

      {list.length > 1 && (
        <div
          style={{
            display: "grid",
            // Always a single row: auto-fill wrapped a 6th thumbnail onto its own line.
            gridTemplateColumns: `repeat(${Math.min(list.length, 6)}, 1fr)`,
            gap: 8,
            marginTop: 10,
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
                background: "#fff",
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
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  padding: 4,
                  boxSizing: "border-box",
                  display: "block",
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
