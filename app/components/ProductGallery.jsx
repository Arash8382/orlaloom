"use client";

import { useCallback, useRef, useState } from "react";
import SaveButton from "./SaveButton";

// Horizontal travel (px) before a drag counts as a page turn.
const SWIPE_THRESHOLD = 45;
// Travel before we decide the gesture is horizontal (swipe) or vertical (page scroll).
const DIRECTION_LOCK = 10;

export default function ProductGallery({ images = [], name, product }) {
  const [i, setI] = useState(0);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef(null);

  const count = images.length;
  const many = count > 1;
  const src = images[i] || (product && product.image) || "";

  // Functional update + a delta, so a fast flick can never act on a stale index.
  const step = useCallback(
    (delta) => {
      if (!count) return;
      setI((prev) => (((prev + delta) % count) + count) % count);
    },
    [count]
  );

  const onPointerDown = (e) => {
    if (!many) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    // Never hijack a tap that starts on the save heart.
    if (e.target && e.target.closest && e.target.closest(".save-btn")) return;
    start.current = { x: e.clientX, y: e.clientY, axis: null, id: e.pointerId, dx: 0 };
  };

  const onPointerMove = (e) => {
    const s = start.current;
    if (!s || e.pointerId !== s.id) return;
    const mx = e.clientX - s.x;
    const my = e.clientY - s.y;
    if (!s.axis && Math.abs(mx) + Math.abs(my) > DIRECTION_LOCK) {
      // Lock the axis once, so a vertical flick scrolls the page instead of
      // fighting it, and a horizontal one owns the gesture from then on.
      s.axis = Math.abs(mx) > Math.abs(my) ? "x" : "y";
      if (s.axis === "x") {
        setDragging(true);
        try {
          e.currentTarget.setPointerCapture(s.id);
        } catch (err) {
          /* capture is a nicety, not required */
        }
      }
    }
    if (s.axis === "x") {
      // Keep the authoritative travel on the ref; state is only for the visual
      // follow, and React may batch it away before pointerup runs.
      s.dx = mx;
      setDx(mx);
    }
  };

  const finish = (e) => {
    const s = start.current;
    if (!s || (e && e.pointerId !== s.id)) return;
    start.current = null;
    const moved = s.dx || 0;
    setDx(0);
    setDragging(false);
    if (s.axis !== "x") return;
    if (moved <= -SWIPE_THRESHOLD) step(1);
    else if (moved >= SWIPE_THRESHOLD) step(-1);
  };

  const onKeyDown = (e) => {
    if (!many) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  const arrowStyle = (side) => ({
    position: "absolute",
    [side]: 8,
    top: "50%",
    transform: "translateY(-50%)",
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    lineHeight: 1,
    fontSize: 20,
    borderRadius: 999,
    border: "1px solid var(--line, #e7ddcf)",
    background: "rgba(255,255,255,.92)",
    color: "var(--head)",
    cursor: "pointer",
    boxShadow: "0 1px 4px rgba(0,0,0,.08)",
  });

  return (
    <div>
      <div
        role={many ? "group" : undefined}
        aria-roledescription={many ? "carousel" : undefined}
        aria-label={many ? name + " images" : undefined}
        tabIndex={many ? 0 : undefined}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finish}
        onPointerCancel={finish}
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
          // pan-y lets the page scroll vertically while we keep horizontal drags.
          touchAction: many ? "pan-y" : "auto",
          cursor: many ? (dragging ? "grabbing" : "grab") : "default",
          userSelect: "none",
        }}
      >
        <img
          src={src}
          alt={name}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: 14,
            boxSizing: "border-box",
            // Follow the finger a little so the swipe feels connected.
            transform: dx ? "translateX(" + dx * 0.35 + "px)" : "none",
            transition: dragging ? "none" : "transform .18s ease-out",
            pointerEvents: "none",
          }}
        />

        {many && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => step(-1)}
              style={arrowStyle("left")}
            >
              &#8249;
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => step(1)}
              style={arrowStyle("right")}
            >
              &#8250;
            </button>
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: 8,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 5,
              }}
            >
              {images.map((_, n) => (
                <span
                  key={n}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: n === i ? "var(--head)" : "var(--line, #e7ddcf)",
                  }}
                />
              ))}
            </div>
          </>
        )}

        <SaveButton product={product} />
      </div>

      {many && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(" + count + ", 1fr)",
            gap: 8,
            marginTop: 10,
          }}
        >
          {images.map((thumb, n) => (
            <button
              key={n}
              type="button"
              aria-label={"View image " + (n + 1) + " of " + name}
              aria-current={n === i ? "true" : undefined}
              onClick={() => setI(n)}
              style={{
                padding: 0,
                cursor: "pointer",
                background: "#fff",
                border:
                  n === i ? "2px solid var(--head)" : "1px solid var(--line,#e7ddcf)",
                borderRadius: 10,
                overflow: "hidden",
                aspectRatio: "1 / 1",
              }}
            >
              <img
                src={thumb}
                alt=""
                draggable={false}
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

      <span
        aria-live="polite"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
        }}
      >
        {many ? "Image " + (i + 1) + " of " + count : ""}
      </span>
    </div>
  );
}
