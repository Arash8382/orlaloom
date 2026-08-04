// Live price + availability from the Amazon Creators API (the PAAPI successor).
//
// DESIGN PRINCIPLE — FAIL SAFE. This module never throws and never blocks a
// page. Every path returns `null`/`{}` on the slightest problem (missing keys,
// no ASIN, network timeout, non-200, access not yet activated, parse error).
// Callers ALWAYS keep their existing hard-coded price/image as the fallback and
// only override when this returns real data. Worst case, the site looks exactly
// as it does today.
//
// 2026-08-04 FIX (verified against official Creators API docs):
//   1. Token scope is "creatorsapi::default" (was "advertising::creator_api").
//      Token endpoint for NA / credential version 3.1 is api.amazon.com/auth/o2/token,
//      and the body is JSON (not form-urlencoded).
//   2. API endpoint is https://creatorsapi.amazon/catalog/v1/getItems
//      (the old webservices.amazon.com/paapi5/* endpoints are PA-API 5 only).
//   3. Request params are lowerCamelCase (itemIds, partnerTag, ...), an
//      x-marketplace header is required, and Offers.* resources were replaced
//      by offersV2.* — response shape: itemsResult.items[].offersV2.listings[0]
//      .price.money.displayAmount + .availability.type ("IN_STOCK" | "OUT_OF_STOCK" | ...).
//
// TEMP DIAGNOSTICS: console.log lines prefixed "[amazon-pricing]" so Vercel
// runtime logs show exactly where a request fails. They never log the secret.
// Remove once live pricing is confirmed working.
//
// Auth: Creators API uses OAuth2 client-credentials (Login with Amazon). We
// exchange the client id + secret for a short-lived bearer token, cache it in
// module memory, then call the product API. Keys come from env vars only —
// never hard-coded, never in the repo:
//   AMAZON_CREATORS_CLIENT_ID   (the "Credential Id", amzn1.application-oa2-client...)
//   AMAZON_CREATORS_SECRET      (the "Secret",        amzn1.oa2-cs...)
//   AMAZON_PARTNER_TAG          (optional; defaults to orlaloom-20)

const TOKEN_URL = "https://api.amazon.com/auth/o2/token"; // NA endpoint, credential version 3.1
const API_ENDPOINT = "https://creatorsapi.amazon/catalog/v1/getItems";
const MARKETPLACE = "www.amazon.com";
const PARTNER_TAG = process.env.AMAZON_PARTNER_TAG || "orlaloom-20";

let _token = null; // { value, exp }

// Small fetch wrapper with a hard timeout so a slow Amazon never stalls a build.
async function fetchTimeout(url, opts = {}, ms = 4000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

// Pull the 10-char ASIN out of an Amazon product URL. Returns null if not found.
export function asinFromUrl(url) {
  if (!url) return null;
  const m = String(url).match(
    /\/dp\/([A-Z0-9]{10})|\/gp\/product\/([A-Z0-9]{10})|[/?&]asin=([A-Z0-9]{10})/i
  );
  return m ? (m[1] || m[2] || m[3]).toUpperCase() : null;
}

async function getToken() {
  const id = process.env.AMAZON_CREATORS_CLIENT_ID;
  const secret = process.env.AMAZON_CREATORS_SECRET;
  if (!id || !secret) {
    console.log("[amazon-pricing] env vars missing — skipping live pricing");
    return null; // not configured yet → silent fallback
  }
  if (_token && _token.exp > Date.now() + 60000) return _token.value;
  try {
    const r = await fetchTimeout(
      TOKEN_URL,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "client_credentials",
          client_id: id,
          client_secret: secret,
          scope: "creatorsapi::default",
        }),
      },
      4000
    );
    if (!r.ok) {
      const errText = await r.text().catch(() => "");
      console.log(
        `[amazon-pricing] token request failed: HTTP ${r.status} ${errText.slice(0, 300)}`
      );
      return null;
    }
    const j = await r.json();
    if (!j.access_token) {
      console.log("[amazon-pricing] token response had no access_token");
      return null;
    }
    console.log("[amazon-pricing] token OK");
    _token = { value: j.access_token, exp: Date.now() + (j.expires_in || 3600) * 1000 };
    return _token.value;
  } catch (e) {
    console.log(`[amazon-pricing] token request threw: ${e && e.name}`);
    return null;
  }
}

// Fetch live pricing/availability for up to 10 ASINs.
// Returns a Map<asin, { price, inStock }>. Empty Map on any failure.
export async function getLivePricing(asins) {
  const out = new Map();
  const ids = [...new Set((asins || []).filter(Boolean))].slice(0, 10);
  if (!ids.length) return out;
  const token = await getToken();
  if (!token) return out; // keys missing or access not active yet
  try {
    const payload = {
      itemIds: ids,
      itemIdType: "ASIN",
      marketplace: MARKETPLACE,
      partnerTag: PARTNER_TAG,
      partnerType: "Associates",
      resources: ["offersV2.listings.price", "offersV2.listings.availability"],
    };
    const r = await fetchTimeout(
      API_ENDPOINT,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-marketplace": MARKETPLACE,
        },
        body: JSON.stringify(payload),
      },
      5000
    );
    if (!r.ok) {
      const errText = await r.text().catch(() => "");
      console.log(
        `[amazon-pricing] getItems failed: HTTP ${r.status} ${errText.slice(0, 300)}`
      );
      return out;
    }
    const j = await r.json();
    // Creators API responses are lowerCamelCase: itemsResult.items[]
    const items = (j && j.itemsResult && j.itemsResult.items) || [];
    console.log(
      `[amazon-pricing] getItems OK: ${items.length}/${ids.length} items returned`
    );
    for (const it of items) {
      const asin = it.asin;
      const listing =
        it.offersV2 && it.offersV2.listings && it.offersV2.listings[0];
      if (!asin || !listing) continue;
      const price =
        listing.price && listing.price.money && listing.price.money.displayAmount; // e.g. "$24.99"
      // availability.type: IN_STOCK, IN_STOCK_SCARCE, OUT_OF_STOCK, UNAVAILABLE, ...
      const availType = listing.availability && listing.availability.type;
      const inStock = availType
        ? availType === "IN_STOCK" || availType === "IN_STOCK_SCARCE"
        : undefined;
      out.set(asin, { price: price || null, inStock });
    }
    return out;
  } catch (e) {
    console.log(`[amazon-pricing] getItems threw: ${e && e.name}`);
    return out;
  }
}

// Convenience for a single product. Returns { price, inStock } or null.
export async function getLivePriceForUrl(url) {
  const asin = asinFromUrl(url);
  if (!asin) return null;
  const map = await getLivePricing([asin]);
  return map.get(asin) || null;
}
