// Live price + availability from the Amazon Creators API (the PAAPI successor).
//
// DESIGN PRINCIPLE — FAIL SAFE. This module never throws and never blocks a
// page. Every path returns `null`/`{}` on the slightest problem (missing keys,
// no ASIN, network timeout, non-200, access not yet activated, parse error).
// Callers ALWAYS keep their existing hard-coded price/image as the fallback and
// only override when this returns real data. Worst case, the site looks exactly
// as it does today.
//
// Auth: Creators API uses OAuth2 client-credentials (Login with Amazon). We
// exchange the client id + secret for a short-lived bearer token, cache it in
// module memory, then call the product API. Keys come from env vars only —
// never hard-coded, never in the repo:
//   AMAZON_CREATORS_CLIENT_ID   (the "Credential Id", amzn1.application-oa2-client...)
//   AMAZON_CREATORS_SECRET      (the "Secret",        amzn1.oa2-cs...)
//   AMAZON_PARTNER_TAG          (optional; defaults to orlaloom-20)

const TOKEN_URL = "https://api.amazon.com/auth/o2/token";
const PAAPI_ENDPOINT = "https://webservices.amazon.com/paapi5/getitems";
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
  if (!id || !secret) return null; // not configured yet → silent fallback
  if (_token && _token.exp > Date.now() + 60000) return _token.value;
  try {
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: id,
      client_secret: secret,
      scope: "advertising::creator_api",
    });
    const r = await fetchTimeout(
      TOKEN_URL,
      { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body },
      4000
    );
    if (!r.ok) return null;
    const j = await r.json();
    if (!j.access_token) return null;
    _token = { value: j.access_token, exp: Date.now() + (j.expires_in || 3600) * 1000 };
    return _token.value;
  } catch {
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
      ItemIds: ids,
      Resources: ["Offers.Listings.Price", "Offers.Listings.Availability.Message"],
      PartnerTag: PARTNER_TAG,
      PartnerType: "Associates",
      Marketplace: "www.amazon.com",
    };
    const r = await fetchTimeout(
      PAAPI_ENDPOINT,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
      5000
    );
    if (!r.ok) return out;
    const j = await r.json();
    const items = (j && j.ItemsResult && j.ItemsResult.Items) || [];
    for (const it of items) {
      const asin = it.ASIN;
      const listing = it.Offers && it.Offers.Listings && it.Offers.Listings[0];
      if (!asin || !listing) continue;
      const price = listing.Price && listing.Price.DisplayAmount; // e.g. "$24.99"
      const avail = listing.Availability && listing.Availability.Message; // e.g. "In Stock"
      const inStock = avail ? /in stock/i.test(avail) : undefined;
      out.set(asin, { price: price || null, inStock });
    }
    return out;
  } catch {
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
