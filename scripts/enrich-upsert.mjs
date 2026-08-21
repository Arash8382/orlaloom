#!/usr/bin/env node
// Upsert enrichment rows into Supabase from JSON on stdin. NO scraping.
//
// This is the RELIABLE path. Amazon hard-blocks raw fetches from a residential IP
// after a handful of sequential requests (confirmed 2026-08-15: 90s and 180s
// backoffs did not clear it). But the daily-guide agent is ALREADY opening every
// /dp/ASIN page in the logged-in Claude-in-Chrome session to read #landingImage —
// a real browser with real cookies, which does not get bot-checked. So extract the
// whole gallery during that visit and pipe it here.
//
// In the Chrome tab on the /dp/ASIN page, run this JS and keep the result:
//
//   (() => {
//     // Anchor on colorImages only. Do NOT require the key "initial" - multi-variant
//     // listings key it by colourway (e.g. {"Olive":[...]}) and an "initial"-only match
//     // silently returns ZERO images for them (confirmed on 10 ASINs, 2026-08-21).
//     const idx = document.body.innerHTML.indexOf("colorImages");
//     let imgs = [];
//     if (idx > -1) {
//       const s = document.body.innerHTML.indexOf("[", idx);
//       let d = 0, e = s;
//       for (let i = s; i < document.body.innerHTML.length; i++) {
//         const c = document.body.innerHTML[i];
//         if (c === "[") d++; else if (c === "]") { d--; if (!d) { e = i; break; } }
//       }
//       const blk = document.body.innerHTML.slice(s, e + 1);
//       const seen = new Set();
//       imgs = [...blk.matchAll(/["']hiRes["']\s*:\s*["'](https:\/\/m\.media-amazon\.com[^"']+)["']/g)]
//         .map(x => x[1])
//         .filter(u => { const k = u.match(/\/images\/I\/([A-Za-z0-9+-]+)\./)?.[1] || u;
//                        if (seen.has(k)) return false; seen.add(k); return true; })
//         .slice(0, 6);
//     }
//     return JSON.stringify({
//       asin: location.pathname.match(/\/dp\/([A-Z0-9]{10})/)?.[1],
//       images: imgs,
//       price: document.querySelector(".a-price .a-offscreen")?.textContent.trim() || null,
//       rating: document.querySelector("#acrPopover")?.title?.match(/([\d.]+)/)?.[1] || null,
//       in_stock: !/Currently unavailable/i.test(document.body.innerText),
//       bullets: [...document.querySelectorAll("#feature-bullets .a-list-item")]
//                  .map(e => e.innerText.trim()).filter(t => t.length > 20 && t.length < 320).slice(0, 6)
//     });
//   })()
//
// Then:  echo '[{...},{...}]' | node scripts/enrich-upsert.mjs
//
// Rejects any row with fewer than 2 images, so a bad extraction can't quietly
// reintroduce the single-image bug.

const SUPABASE_URL = "https://nrvwtckpoaibyjpsdsmw.supabase.co";
const TABLE = "orlaloom_product_enrichment";
const ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ydnd0Y2twb2FpYnlqcHNkc213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTUwNzAsImV4cCI6MjA5NTQ3MTA3MH0.mqVVvtHJY-uELnPP1s5BFOdn1E3lKwA58Nq2uPED7s8";
const KEY = process.env.SUPABASE_SERVICE_KEY || ANON;
const MIN_IMAGES = 2;

const raw = await new Promise((res) => {
  let b = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (d) => (b += d));
  process.stdin.on("end", () => res(b));
});

let rows;
try {
  rows = JSON.parse(raw.trim());
} catch (e) {
  console.error("stdin is not valid JSON:", e.message);
  process.exit(1);
}
if (!Array.isArray(rows)) rows = [rows];

const good = [];
const bad = [];
for (const r of rows) {
  if (!r || !/^[A-Z0-9]{10}$/.test(r.asin || "")) {
    bad.push([r?.asin || "(no asin)", "missing/invalid asin"]);
  } else if (!Array.isArray(r.images) || r.images.length < MIN_IMAGES) {
    bad.push([r.asin, `only ${r.images?.length || 0} image(s)`]);
  } else {
    good.push({
      asin: r.asin,
      images: r.images.slice(0, 6),
      price: r.price ?? null,
      rating: r.rating ?? null,
      rating_count: r.rating_count ?? null,
      in_stock: r.in_stock ?? true,
      bullets: Array.isArray(r.bullets) ? r.bullets.slice(0, 6) : [],
      specs: r.specs && typeof r.specs === "object" ? r.specs : {},
      checked_at: new Date().toISOString(),
    });
  }
}

if (good.length) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?on_conflict=asin`, {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: "Bearer " + KEY,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(good),
  });
  if (!res.ok) {
    console.error("supabase upsert failed:", res.status, await res.text());
    process.exit(1);
  }
  for (const g of good) console.log(`  ok   ${g.asin}  ${g.images.length} images  ${g.price || "no price"}`);
}

console.log(`[upsert] ${good.length} written, ${bad.length} rejected`);
if (bad.length) {
  for (const [a, why] of bad) console.error(`  REJECTED ${a} — ${why}`);
  console.error("  Re-extract in the browser, or swap the product if the listing is dead.");
  process.exit(1);
}
