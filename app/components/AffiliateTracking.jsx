"use client";
import { useEffect } from "react";
import { track } from "@vercel/analytics";

// Site-wide affiliate-click tracking. Listens (via event delegation) for clicks
// on any outbound affiliate link (rel includes "sponsored") — product images,
// "Shop on…" buttons, search results — and logs which product + retailer was
// clicked to Vercel Analytics, so we can see what actually converts.
export default function AffiliateTracking() {
  useEffect(() => {
    function onClick(e) {
      const a = e.target.closest && e.target.closest('a[rel*="sponsored"]');
      if (!a || !a.href) return;
      let retailer = "other";
      try {
        const h = a.href;
        if (h.includes("amazon.")) retailer = "Amazon";
        else if (h.includes("lahomedecor.com") || h.includes("partnerboost.com")) retailer = "Lahome";
        else retailer = new URL(h).hostname.replace(/^www\./, "");
      } catch (_) {}
      const product =
        a.getAttribute("aria-label") ||
        a.querySelector("img")?.getAttribute("alt") ||
        (a.textContent || "").trim().slice(0, 80) ||
        "unknown";
      try {
        track("affiliate_click", { retailer, product, path: location.pathname });
      } catch (_) {}
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
