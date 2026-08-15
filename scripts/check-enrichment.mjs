#!/usr/bin/env node
// Build-time audit. Runs AFTER fetch-enrichment.mjs. Lists any catalogue product
// that will render a single image, so the gap shows up in the Vercel build log
// instead of only being visible on the live page.
// Exits 0 by default; set ENRICHMENT_STRICT=1 to fail the build instead.

import fs from "fs";
import path from "path";

const MIN_IMAGES = 2;

function catalogue() {
  const dir = path.join(process.cwd(), "content", "posts");
  const byAsin = {};
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith(".md"))) {
    const txt = fs.readFileSync(path.join(dir, f), "utf8");
    for (const m of txt.matchAll(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/g)) {
      (byAsin[m[1]] ||= new Set()).add(f.replace(/\.md$/, ""));
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
  if (process.env.ENRICHMENT_STRICT === "1") process.exit(1);
}
