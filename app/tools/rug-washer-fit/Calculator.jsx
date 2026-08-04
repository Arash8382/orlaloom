"use client";
import { useState } from "react";

const RUG_SIZES = {
  "3x5": { area: 15, dryLb: 6 },
  "4x6": { area: 24, dryLb: 9 },
  "5x7": { area: 35, dryLb: 14 },
  "6x9": { area: 54, dryLb: 20 },
  "8x10": { area: 80, dryLb: 28 },
  "9x12": { area: 108, dryLb: 38 },
};
const MATERIALS = { "Polyester / chenille (typical washable)": 1.0, "Cotton / flatweave": 0.8, "Microfiber / shag": 1.35 };

export default function Calculator() {
  const [size, setSize] = useState("5x7");
  const [material, setMaterial] = useState("Polyester / chenille (typical washable)");
  const [capacity, setCapacity] = useState("4.5");
  const [type, setType] = useState("front");

  const rug = RUG_SIZES[size];
  const dry = Math.round(rug.dryLb * MATERIALS[material]);
  const wet = Math.round(dry * 2.5);
  const cap = parseFloat(capacity);
  // Practical rule: needed cu ft ≈ area(sqft) / 12 for foldable washables, front-loaders handle ~15% more than top-loaders with agitators.
  const needed = rug.area / (type === "front" ? 12 : 10);
  const fits = cap >= needed;
  const marginal = !fits && cap >= needed * 0.85;

  const box = { padding: "16px 18px", borderRadius: 14, background: "var(--card)", maxWidth: 640 };
  const label = { display: "block", fontSize: 13, fontWeight: 600, color: "var(--head)", margin: "12px 0 4px" };
  const sel = { width: "100%", padding: "9px 10px", borderRadius: 9, border: "1px solid #d8c9bb", fontSize: 15, background: "#fff", color: "var(--head)" };

  return (
    <div style={box}>
      <label style={label}>Rug size</label>
      <select style={sel} value={size} onChange={(e) => setSize(e.target.value)}>
        {Object.keys(RUG_SIZES).map((s) => <option key={s}>{s}</option>)}
      </select>
      <label style={label}>Rug material</label>
      <select style={sel} value={material} onChange={(e) => setMaterial(e.target.value)}>
        {Object.keys(MATERIALS).map((m) => <option key={m}>{m}</option>)}
      </select>
      <label style={label}>Your washer capacity (cu ft)</label>
      <select style={sel} value={capacity} onChange={(e) => setCapacity(e.target.value)}>
        {["3.5", "4.0", "4.5", "5.0", "5.5", "6.0+"].map((c) => <option key={c} value={parseFloat(c)}>{c}</option>)}
      </select>
      <label style={label}>Washer type</label>
      <select style={sel} value={type} onChange={(e) => setType(e.target.value)}>
        <option value="front">Front-loader (no agitator)</option>
        <option value="top">Top-loader with agitator</option>
      </select>

      <div style={{ marginTop: 18, padding: "14px 16px", borderRadius: 10, background: fits ? "#edf6ed" : marginal ? "#fdf6e3" : "#fdeeee" }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "var(--head)", marginBottom: 6 }}>
          {fits ? "✓ Should fit your machine" : marginal ? "△ Tight — possible but risky" : "✗ Take it to a laundromat"}
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink)" }}>
          A {size} {material.split(" ")[0].toLowerCase()} rug needs roughly <strong>{needed.toFixed(1)} cu ft</strong> of drum
          ({type === "front" ? "front-loader" : "top-loader — agitators are harder on rugs and need extra room"}).
          Estimated dry weight ~<strong>{dry} lb</strong>, soaked ~<strong>{wet} lb</strong>.{" "}
          {fits
            ? "Wash cold, gentle cycle, mild detergent, no bleach or fabric softener; run an extra spin before you lift it out, and air-dry flat."
            : marginal
            ? "It may physically fit, but cramming reduces cleaning and strains bearings. If you try: cold gentle cycle, solo load, extra spin. A commercial front-loader is the safer call."
            : `Look for a commercial washer of ${Math.ceil(needed)}+ cu ft at a laundromat (usually the 40–60 lb machines). Bring quarters and a cart — ${wet} lb of wet rug is a two-arm job.`}
        </div>
      </div>
    </div>
  );
}
