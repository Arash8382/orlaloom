#!/usr/bin/env node
// Amazon listing harvester -> orlaloom_product_enrichment (Supabase).
//
// WHY THIS EXISTS: guide frontmatter carries ONE image per product. The multi-photo
// gallery on /shop/<slug> comes from the enrichment table, via
// scripts/fetch-enrichment.mjs -> public/product-enrichment.json -> galleryFor().
// A product with no enrichment row renders exactly ONE image, silently, with no error.
// That is what happened to the Aug 13 guides. Run this BEFORE deploying a new guide.
//
// Usage:
//   node scripts/harvest-enrichment.mjs             # every catalogue ASIN missing/thin
//   node scripts/harvest-enrichment.mjs B01ABCDEFG  # specific ASINs
//   node scripts/harvest-enrichment.mjs --all       # re-harvest everything (slow)
//
// Exits NON-ZERO if any ASIN could not be enriched, so a deploy script can stop.
//
// PARSER RULES — do not regress:
//  - colorImages appears with EITHER quote style; match both.
//  - JSON.parse fails on the array (entries hold a "main" map keyed by URL) — walk it
//    with a bracket counter.
//  - Take hiRes, NEVER thumb. There is deliberately no #altImages fallback: storing
//    40-100px thumbnails is worse than failing loudly.
//  - Order MAIN first, then PT01, PT02 ... so trailing marketing infographics fall
//    outside the 6-image cap.

import fs from "fs";
import path from "path";

const SUPABASE_URL = "https://nrvwtckpoaibyjpsdsmw.supabase.co";
const TABLE = "orlaloom_product_enrichment";
const MIN_IMAGES = 2;
// Amazon throttles a residential IP well before it throttles a datacentre one.
// 4s spacing tripped a bot-check after ~4 sequential fetches. 9-15s jittered has
// been stable. Do not lower this to "speed up" a backfill — a tripped bot-check
// costs far more time than the delay saves.
const DELAY_MIN_MS = 9000;
const DELAY_MAX_MS = 15000;
// Once bot-checked, Amazon keeps refusing for a while. Back off in minutes, not seconds.
const BOTCHECK_BACKOFF_MS = 90000;

// Prefer a real service key. Falls back to the anon key already committed in
// fetch-enrichment.mjs, which currently has write access — see the RLS note in
// docs. Once RLS is locked down, set SUPABASE_SERVICE_KEY and this keeps working.
const ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ydnd0Y2twb2FpYnlqcHNkc213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTUwNzAsImV4cCI6MjA5NTQ3MTA3MH0.mqVVvtHJY-uELnPP1s5BFOdn1E3lKwA58Nq2uPED7s8";
const KEY = process.env.SUPABASE_SERVICE_KEY || ANON;

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getPage(asin, attempt = 1) {
  const res = await fetch(`https://www.amazon.com/dp/${asin}`, {
    headers: {
      "User-Agent": UA,
      "Accept-Language": "en-US,en;q=0.9",
      Accept: "text/html,application/xhtml+xml",
    },
  });
  const html = await res.text();
  if (html.includes("api-services-support@amazon.com") || html.includes("Enter the characters")) {
    if (attempt >= 3) throw new Error("bot-check after 3 attempts");
    console.warn(`       bot-check on ${asin}, backing off ${(BOTCHECK_BACKOFF_MS * attempt) / 1000}s`);
    await sleep(BOTCHECK_BACKOFF_MS * attempt);
    return getPage(asin, attempt + 1);
  }
  if (!res.ok) throw new Error("http " + res.status);
  return html;
}

// Anchor on colorImages, then bracket-walk from the first [ that follows.
// Do NOT require the key to be "initial": multi-variant listings key colorImages by
// the colourway (e.g. {"Olive":[...]}) and the old "initial"-only regex silently
// returned ZERO images for every one of them. Confirmed 2026-08-21 on B0F4JWD1HQ,
// B0B4HVN7DZ and 8 others - all had 6 hiRes photos the parser never saw.
function sliceInitial(html) {
  const i = html.indexOf("colorImages");
  if (i === -1) return null;
  const start = html.indexOf("[", i);
  if (start === -1) return null;
  let depth = 0;
  for (let k = start; k < html.length; k++) {
    const c = html[k];
    if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) return html.slice(start, k + 1);
    }
  }
  return null;
}

function variantRank(url) {
  const pt = url.match(/\.PT(\d{2})\./i);
  if (pt) return parseInt(pt[1], 10) + 1;
  return 0;
}

function assetId(url) {
  const m = String(url).match(/\/images\/I\/([A-Za-z0-9+-]+)\./);
  return m ? m[1] : String(url).split("?")[0];
}

function parseImages(html) {
  const block = sliceInitial(html);
  if (!block) return [];
  const seen = new Set();
  const out = [];
  const entries = [...block.matchAll(/["']hiRes["']\s*:\s*["'](https:\/\/m\.media-amazon\.com[^"']+)["']/g)].map(
    (m) => m[1]
  );
  entries.sort((a, b) => variantRank(a) - variantRank(b));
  for (const u of entries) {
    const k = assetId(u);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(u);
  }
  return out.slice(0, 6);
}

function parsePrice(html) {
  const m =
    html.match(/<span class="a-offscreen">\s*(\$[\d,]+\.\d{2})\s*<\/span>/) ||
    html.match(/"priceAmount"\s*:\s*([\d.]+)/);
  if (!m) return null;
  return m[1].startsWith("$") ? m[1] : "$" + Number(m[1]).toFixed(2);
}

function parseBullets(html) {
  const fb = html.match(/id="feature-bullets"[\s\S]{0,6000}?<\/div>/);
  if (!fb) return [];
  return [...fb[0].matchAll(/<span class="a-list-item">([\s\S]*?)<\/span>/g)]
    .map((m) => m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim())
    .filter((t) => t.length > 20 && t.length < 320)
    .slice(0, 6);
}

function parseSpecs(html) {
  const specs = {};
  const table = html.match(/id="productDetails_techSpec_section_1"[\s\S]*?<\/table>/);
  if (table) {
    for (const row of table[0].matchAll(/<th[^>]*>([\s\S]*?)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/g)) {
      const k = row[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      const v = row[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      if (k && v && v.length < 120) specs[k] = v;
    }
  }
  return specs;
}

async function harvest(asin) {
  const html = await getPage(asin);
  const images = parseImages(html);
  if (images.length < MIN_IMAGES) throw new Error(`only ${images.length} hiRes image(s) parsed`);
  const r = html.match(/([\d.]+)\s+out of 5 stars/);
  const c = html.match(/([\d,]+)\s+ratings/);
  return {
    asin,
    images,
    price: parsePrice(html),
    rating: r ? r[1] : null,
    rating_count: c ? c[1] : null,
    // "Currently unavailable" appears on live pages for out-of-stock VARIANTS, which
    // produced false "dead listing" calls on 2026-08-15. Trust the buy box instead.
    in_stock: /id="add-to-cart-button"/.test(html),
    bullets: parseBullets(html),
    specs: parseSpecs(html),
    checked_at: new Date().toISOString(),
  };
}

async function upsert(rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?on_conflict=asin`, {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: "Bearer " + KEY,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(rows),
  });
  if (!res.ok) throw new Error("supabase upsert " + res.status + " " + (await res.text()));
}

async function existing() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?select=asin,images&limit=5000`, {
    headers: { apikey: KEY, Authorization: "Bearer " + KEY },
  });
  if (!res.ok) throw new Error("supabase read " + res.status);
  const map = {};
  for (const r of await res.json()) map[r.asin] = (r.images || []).length;
  return map;
}

function catalogueAsins() {
  const dir = path.join(process.cwd(), "content", "posts");
  const byAsin = {};
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith(".md"))) {
    const txt = fs.readFileSync(path.join(dir, f), "utf8");
    for (const m of txt.matchAll(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/g)) {
      (byAsin[m[1]] ||= []).push(f.replace(/\.md$/, ""));
    }
  }
  return byAsin;
}

async function main() {
  const args = process.argv.slice(2);
  const all = args.includes("--all");
  const explicit = args.filter((a) => /^[A-Z0-9]{10}$/.test(a));
  const catalogue = catalogueAsins();
  const have = await existing();

  const targets = explicit.length
    ? explicit
    : all
    ? Object.keys(catalogue)
    : Object.keys(catalogue).filter((a) => (have[a] || 0) < MIN_IMAGES);

  console.log(`[harvest] ${targets.length} ASIN(s) to process`);
  const failed = [];
  let ok = 0;

  for (const asin of targets) {
    try {
      const row = await harvest(asin);
      await upsert([row]);
      ok++;
      console.log(`  ok   ${asin}  ${row.images.length} images  ${row.price || "no price"}`);
    } catch (e) {
      failed.push({ asin, reason: e.message, posts: catalogue[asin] || [] });
      console.warn(`  FAIL ${asin}  ${e.message}`);
    }
    await sleep(DELAY_MIN_MS + Math.random() * (DELAY_MAX_MS - DELAY_MIN_MS));
  }

  console.log(`[harvest] ${ok} ok, ${failed.length} failed`);
  if (failed.length) {
    for (const f of failed) {
      console.error(`  unenriched: ${f.asin} (${f.posts.join(", ") || "not in catalogue"}) — ${f.reason}`);
    }
    console.error("  A dead listing needs the product SWAPPED in the guide, not re-harvested.");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("[harvest] fatal:", e.message);
  process.exit(1);
});
