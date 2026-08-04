"use client";
import { useState } from "react";

// Pairing scores: 2 = beautiful, 1 = workable with care, 0 = skip.
// Keyed by cabinet base -> appliance color. Based on classic 50s palettes
// (cream+mint, cream+pink, sage+cream) and what reads well in real kitchens.
const BASES = {
  "White cabinets": { Cream: 2, Mint: 2, "Pastel pink": 2, "Sage / pistachio": 2, "Seafoam blue": 2, Red: 2, Black: 1 },
  "Cream / off-white cabinets": { Cream: 1, Mint: 2, "Pastel pink": 2, "Sage / pistachio": 2, "Seafoam blue": 2, Red: 2, Black: 1 },
  "Sage or green cabinets": { Cream: 2, Mint: 1, "Pastel pink": 1, "Sage / pistachio": 0, "Seafoam blue": 0, Red: 1, Black: 1 },
  "Navy or blue cabinets": { Cream: 2, Mint: 1, "Pastel pink": 1, "Sage / pistachio": 1, "Seafoam blue": 0, Red: 1, Black: 1 },
  "Natural wood": { Cream: 2, Mint: 2, "Pastel pink": 1, "Sage / pistachio": 2, "Seafoam blue": 1, Red: 1, Black: 1 },
  "Dark / black cabinets": { Cream: 2, Mint: 1, "Pastel pink": 1, "Sage / pistachio": 1, "Seafoam blue": 1, Red: 2, Black: 0 },
};
const NOTES = {
  Cream: "the workhorse — warms every base and pairs with any second color later",
  Mint: "classic 50s diner; keep counters simple so it stays fresh, not clinical",
  "Pastel pink": "sweetest with brass or copper hardware nearby",
  "Sage / pistachio": "the most 'grown-up' retro green; loves wood and linen textures",
  "Seafoam blue": "coastal-leaning — beautiful against white, muddy against green or blue",
  Red: "high contrast; one red piece is a statement, three is a fire station",
  Black: "technically retro (deco), but reads modern — use only as an accent",
};
const SWATCH = { Cream: "#f3e9d2", Mint: "#b8dcc8", "Pastel pink": "#f2c4c4", "Sage / pistachio": "#b7c4a1", "Seafoam blue": "#b5d6d6", Red: "#c0392b", Black: "#2b2b2b" };

export default function Matcher() {
  const [base, setBase] = useState("White cabinets");
  const [counter, setCounter] = useState("White / light stone");
  const [pieces, setPieces] = useState("2-3");

  const scores = BASES[base];
  const busyCounter = counter === "Patterned / busy";
  const great = Object.keys(scores).filter((c) => scores[c] === 2);
  const ok = Object.keys(scores).filter((c) => scores[c] === 1);
  const maxColors = busyCounter ? 1 : pieces === "1" ? 1 : 2;

  const box = { padding: "16px 18px", borderRadius: 14, background: "var(--card)", maxWidth: 680 };
  const label = { display: "block", fontSize: 13, fontWeight: 600, color: "var(--head)", margin: "12px 0 4px" };
  const sel = { width: "100%", padding: "9px 10px", borderRadius: 9, border: "1px solid #d8c9bb", fontSize: 15, background: "#fff", color: "var(--head)" };
  const chip = (c) => (
    <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", border: "1px solid #e2d6c8", borderRadius: 99, padding: "6px 12px", margin: "0 8px 8px 0", fontSize: 14, color: "var(--head)" }}>
      <span style={{ width: 14, height: 14, borderRadius: "50%", background: SWATCH[c], border: "1px solid rgba(0,0,0,.12)" }} />
      {c}
    </span>
  );

  return (
    <div style={box}>
      <label style={label}>Cabinet color</label>
      <select style={sel} value={base} onChange={(e) => setBase(e.target.value)}>
        {Object.keys(BASES).map((b) => <option key={b}>{b}</option>)}
      </select>
      <label style={label}>Counter style</label>
      <select style={sel} value={counter} onChange={(e) => setCounter(e.target.value)}>
        {["White / light stone", "Butcher block / wood", "Dark stone", "Patterned / busy"].map((c) => <option key={c}>{c}</option>)}
      </select>
      <label style={label}>How many retro pieces are you planning?</label>
      <select style={sel} value={pieces} onChange={(e) => setPieces(e.target.value)}>
        <option value="1">Just one statement piece</option>
        <option value="2-3">2–3 (kettle + toaster + one more)</option>
        <option value="4+">4 or more (full set)</option>
      </select>

      <div style={{ marginTop: 18, padding: "14px 16px", borderRadius: 10, background: "#f6efe6" }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "var(--head)", marginBottom: 8 }}>Best colors for {base.toLowerCase()}:</div>
        <div>{great.map(chip)}</div>
        {ok.length > 0 && (
          <>
            <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--head)", margin: "6px 0 6px" }}>Workable with care:</div>
            <div>{ok.map(chip)}</div>
          </>
        )}
        <div style={{ fontSize: 14, lineHeight: 1.65, color: "var(--ink)", marginTop: 8 }}>
          {great.length > 0 && (
            <p style={{ margin: "0 0 8px" }}>
              <strong>Our lean:</strong> {great[0]} — {NOTES[great[0]]}.
            </p>
          )}
          <p style={{ margin: 0 }}>
            Rule of thumb: stop at <strong>{maxColors === 1 ? "one hero color" : "one hero color plus cream/white"}</strong>
            {busyCounter ? " — your counters are already doing a lot, so let one color repeat quietly." : pieces === "4+" ? " — with a full set, buy every piece in the same brand line so tones match exactly." : " — repeat it 2–3 times so it looks collected, not accidental."}
          </p>
        </div>
      </div>
    </div>
  );
}
