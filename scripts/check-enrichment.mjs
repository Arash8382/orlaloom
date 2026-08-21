#!/usr/bin/env node
// Build-time audit. Runs AFTER fetch-enrichment.mjs. Lists any catalogue product
// that will render a single image, so the gap shows up in the Vercel build log
// instead of only being visible on the live page.
// Exits 0 by default; set ENRICHMENT_STRICT=1 to fail the build instead.

import fs from "fs";
import path from "path";

const MIN_IMAGES = 2;

// Per-ASIN `added:` date, so we can tell an old single-photo listing (fine) from a
// product added today that nobody enriched (a process failure).
const addedDate = {};

function catalogue() {
  const dir = path.join(process.cwd(), "content", "posts");
  const byAsin = {};
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith(".md"))) {
    const txt = fs.readFileSync(path.join(dir, f), "utf8");
    // Walk product blocks so `added:` can be tied to the ASIN in the same block.
    for (const block of txt.split(/\n  - name: /).slice(1)) {
      const asin = (block.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/) || [])[1];
      if (!asin) continue;
      (byAsin[asin] ||= new Set()).add(f.replace(/\.md$/, ""));
      const added = (block.match(/\n\s+added:\s*['"]?([\d-]+)/) || [])[1];
      if (added && added > (addedDate[asin] || "")) addedDate[asin] = added;
    }
  }
  return byAsin;
}

let items = {};
try {
  items = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public", "product-enrichment.json"), "utf8")).items || {};
} catch {}

const cat = catalogue();
const thin = [];
for (const [asin, posts] of Object.entries(cat)) {
  const n = (items[asin]?.images || []).length;
  if (n < MIN_IMAGES) thin.push({ asin, n, posts: [...posts] });
}

const total = Object.keys(cat).length;
console.log(`[enrichment-check] ${total - thin.length}/${total} products have a gallery`);

if (thin.length) {
  console.warn(`[enrichment-check] ${thin.length} product(s) will render a SINGLE image:`);
  const byPost = {};
  for (const t of thin) for (const p of t.posts) (byPost[p] ||= []).push(`${t.asin} (${t.n} img)`);
  for (const [post, list] of Object.entries(byPost)) console.warn(`  ${post}: ${list.join(", ")}`);
  console.warn("  Fix: node scripts/harvest-enrichment.mjs   (or swap the product if the listing is dead)");
}

// A product added TODAY with no gallery means the run that added it SKIPPED the
// enrichment step. That is the bug that shipped glass-pantry-canisters and
// plug-in-wall-sconces with one image each on 2026-08-13, and it recurred on 08-21
// with four products. An old single-photo listing is a fact of life; a brand-new one
// is a process failure, so it fails the build regardless of ENRICHMENT_STRICT.
const today = new Date().toISOString().slice(0, 10);
const freshThin = thin.filter((t) => (addedDate[t.asin] || "") >= today);
if (freshThin.length) {
  console.error(`\n[enrichment-check] FAIL: ${freshThin.length} product(s) added TODAY have no gallery:`);
  for (const t of freshThin) console.error(`  ${t.asin}  ${t.posts.join(", ")}`);
  console.error("  Enrich BEFORE deploying, then rebuild. Do not ship single-image products.\n");
  process.exit(1);
}

if (thin.length && process.env.ENRICHMENT_STRICT === "1") process.exit(1);
