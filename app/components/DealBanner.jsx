"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Site-wide announcement bar for the exclusive Lahome discount (ORLALOOM20).
// Dismissible; remembers dismissal for the session via localStorage.
export default function DealBanner() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("ol_deal_dismissed") === "orlaloom20") setHidden(true);
    } catch {}
  }, []);

  if (hidden) return null;

  return (
    <div className="deal-banner" role="region" aria-label="Discount offer">
      <Link href="/lahome-discount-code" className="deal-banner-link">
        <span className="deal-banner-spark" aria-hidden="true">✦</span>
        <span className="deal-banner-text">
          <strong>20% OFF Lahome washable rugs</strong> with code{" "}
          <span className="deal-banner-code">ORLALOOM20</span>
          <span className="deal-banner-cta">— shop the deal →</span>
        </span>
      </Link>
      <button
        type="button"
        className="deal-banner-close"
        aria-label="Dismiss offer"
        onClick={() => {
          setHidden(true);
          try {
            localStorage.setItem("ol_deal_dismissed", "orlaloom20");
          } catch {}
        }}
      >
        ✕
      </button>
    </div>
  );
}
