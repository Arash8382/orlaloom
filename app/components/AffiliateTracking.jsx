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
      // Also log to Supabase (Vercel custom events are Pro-only) — fire and forget.
      try {
        fetch("https://nrvwtckpoaibyjpsdsmw.supabase.co/rest/v1/orlaloom_outbound_clicks", {
          method: "POST",
          keepalive: true,
          headers: {
            apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ydnd0Y2twb2FpYnlqcHNkc213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTUwNzAsImV4cCI6MjA5NTQ3MTA3MH0.mqVVvtHJY-uELnPP1s5BFOdn1E3lKwA58Nq2uPED7s8",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ydnd0Y2twb2FpYnlqcHNkc213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTUwNzAsImV4cCI6MjA5NTQ3MTA3MH0.mqVVvtHJY-uELnPP1s5BFOdn1E3lKwA58Nq2uPED7s8",
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ retailer, product: String(product).slice(0, 200), path: location.pathname.slice(0, 200) }),
        }).catch(() => {});
      } catch (_) {}
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
