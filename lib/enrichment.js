import fs from "fs";
import path from "path";

// Product enrichment harvested from live retailer listings (public/product-enrichment.json).
// Gives us real prices, extra photography, spec tables and feature bullets that the
// hand-written frontmatter can't keep current. Every accessor fails safe: if the file is
// missing, malformed, or has no row for this ASIN, callers just get null and the page
// renders exactly as it did before enrichment existed.

let CACHE = null;

function load() {
  if (CACHE) return CACHE;
  try {
    const p = path.join(process.cwd(), "public", "product-enrichment.json");
    const raw = JSON.parse(fs.readFileSync(p, "utf8"));
    CACHE = raw && raw.items ? raw.items : {};
  } catch (e) {
    CACHE = {};
  }
  return CACHE;
}

// Amazon URLs come in several shapes: /dp/ASIN, /gp/product/ASIN, /Some-Title/dp/ASIN/ref=...
export function asinFromUrl(url) {
  if (!url) return null;
  const m = String(url).match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})/i);
  return m ? m[1].toUpperCase() : null;
}

export function getEnrichment(asinOrUrl) {
  if (!asinOrUrl) return null;
  const asin = /^[A-Z0-9]{10}$/i.test(asinOrUrl) ? asinOrUrl.toUpperCase() : asinFromUrl(asinOrUrl);
  if (!asin) return null;
  const row = load()[asin];
  return row || null;
}

// Amazon serves the SAME photo at many sizes: .../I/51jPDlCsWVL._AC_SY355_.jpg and
// .../I/51jPDlCsWVL._AC_SL1300_.jpg are one asset. Deduping on the full URL let the
// hero photo appear twice in the gallery. Key on the asset id instead.
function imageKey(u) {
  const m = String(u).match(/\/images\/I\/([A-Za-z0-9+-]+)\./);
  return m ? m[1] : String(u).split("?")[0];
}

// Images: enrichment gallery first (deduped), falling back to the single static image.
export function galleryFor(product, enrichment) {
  const out = [];
  const seen = new Set();
  const push = (u) => {
    if (!u || typeof u !== "string") return;
    const key = imageKey(u);
    if (seen.has(key)) return;
    seen.add(key);
    out.push(u);
  };
  if (product && product.image) push(product.image);
  if (enrichment && Array.isArray(enrichment.images)) enrichment.images.forEach(push);
  return out.slice(0, 7);
}

// Specs worth showing to a shopper. Amazon dumps a lot of registry noise into the detail
// table; keep the dimensional / material / brand facts and drop the housekeeping rows.
const SPEC_DENY = /(asin|best sellers rank|date first available|customer review|manufacturer part|country of origin|item model number|department|is discontinued|global trade|upc|ean|batteries)/i;

export function usefulSpecs(enrichment, limit = 8) {
  if (!enrichment || !enrichment.specs) return [];
  return Object.entries(enrichment.specs)
    .filter(([k, v]) => k && v && !SPEC_DENY.test(k) && String(v).length < 120)
    .slice(0, limit);
}

export function usefulBullets(enrichment, limit = 5) {
  if (!enrichment || !Array.isArray(enrichment.bullets)) return [];
  return enrichment.bullets
    .map((b) => String(b).trim())
    .filter((b) => b.length > 20 && b.length < 320)
    .slice(0, limit);
}

// "$169.00" -> 169. Used to decide whether the live price contradicts our static range.
export function priceNumber(str) {
  if (!str) return null;
  const m = String(str).replace(/,/g, "").match(/\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
}

// Overlay harvested data onto a frontmatter product object. Used wherever product
// cards render (guides, category grids, search) so a stale hand-written range never
// contradicts what a reader sees at the retailer. Fails safe: no enrichment -> unchanged.
export function enrichProduct(pr) {
  if (!pr || !pr.url) return pr;
  const e = getEnrichment(pr.url);
  if (!e) return pr;
  const next = { ...pr };
  if (e.price) {
    next.price = e.price;
    next.priceObserved = true;
    next.priceCheckedAt = e.checked_at || null;
  }
  if (Array.isArray(e.images) && e.images.length) {
    next.images = e.images.slice(0, 6);
    if (!next.image) next.image = e.images[0];
  }
  if (e.in_stock === false) next.outOfStock = true;
  return next;
}

export function checkedAtLabel(enrichment) {
  if (!enrichment || !enrichment.checked_at) return null;
  try {
    return new Date(enrichment.checked_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (e) {
    return null;
  }
}
