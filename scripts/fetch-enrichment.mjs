import fs from "fs";
import path from "path";

// Build-time enrichment fetch.
//
// Real prices, extra product photos, spec tables and feature bullets are harvested
// from live retailer listings into Supabase (table orlaloom_product_enrichment).
// Supabase is the source of truth; this script snapshots it into
// public/product-enrichment.json so the rest of the build can read it synchronously
// (lib/enrichment.js, _genfeed.js). Running it on every deploy means prices refresh
// themselves without anyone committing a data file by hand.
//
// FAIL-SAFE: any error here must NOT break the build. If the fetch fails we keep
// whatever snapshot is already committed (or write an empty one), log, and exit 0.
// Every consumer treats "no enrichment" as "use the hand-written frontmatter".

const URL_BASE = "https://nrvwtckpoaibyjpsdsmw.supabase.co/rest/v1/orlaloom_product_enrichment";
// Public anon key — already shipped to the browser in middleware.js. Row-level
// security governs what it can read; there is nothing secret about it.
const ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ydnd0Y2twb2FpYnlqcHNkc213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTUwNzAsImV4cCI6MjA5NTQ3MTA3MH0.mqVVvtHJY-uELnPP1s5BFOdn1E3lKwA58Nq2uPED7s8";

const OUT = path.join(process.cwd(), "public", "product-enrichment.json");

async function main() {
  const res = await fetch(URL_BASE + "?select=*&limit=2000", {
    headers: { apikey: ANON, Authorization: "Bearer " + ANON },
  });
  if (!res.ok) throw new Error("supabase " + res.status);
  const rows = await res.json();
  if (!Array.isArray(rows)) throw new Error("unexpected payload");

  const items = {};
  for (const r of rows) {
    if (!r || !r.asin) continue;
    items[r.asin] = {
      price: r.price || null,
      in_stock: r.in_stock,
      rating: r.rating || null,
      rating_count: r.rating_count || null,
      images: Array.isArray(r.images) ? r.images.slice(0, 6) : [],
      specs: r.specs || {},
      bullets: Array.isArray(r.bullets) ? r.bullets.slice(0, 6) : [],
      checked_at: r.checked_at || null,
    };
  }

  fs.writeFileSync(
    OUT,
    JSON.stringify({ generated: new Date().toISOString(), count: Object.keys(items).length, items })
  );
  console.log("[enrichment] wrote " + Object.keys(items).length + " products");
}

main().catch((err) => {
  console.warn("[enrichment] skipped:", err.message);
  if (!fs.existsSync(OUT)) {
    try {
      fs.writeFileSync(OUT, JSON.stringify({ generated: null, count: 0, items: {} }));
    } catch (e) {}
  }
  process.exit(0);
});
