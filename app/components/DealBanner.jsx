"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Site-wide announcement bar. Rotates gently between the Lahome discount
// (ORLALOOM20) and the "new finds daily" freshness message — same bar, same
// height, no layout change. Dismissible; remembers dismissal via localStorage.
export default function DealBanner() {
  const [hidden, setHidden] = useState(false);
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem("ol_deal_dismissed") === "orlaloom20") setHidden(true);
    } catch {}
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % 2);
        setFade(true);
      }, 350);
    }, 6500);
    return () => clearInterval(t);
  }, []);

  if (hidden) return null;

  const messages = [
    {
      href: "/lahome-discount-code",
      body: (
        <>
          <strong>20% OFF Lahome washable rugs</strong> with code{" "}
          <span className="deal-banner-code">ORLALOOM20</span>
          <span className="deal-banner-cta">— shop the deal →</span>
        </>
      ),
    },
    {
      href: "/blog",
      body: (
        <>
          <strong>New finds added every day</strong>
          <span className="deal-banner-cta">— see what&apos;s new →</span>
        </>
      ),
    },
  ];
  const m = messages[idx];

  return (
    <div className="deal-banner" role="region" aria-label="Site announcements">
      <Link href={m.href} className="deal-banner-link" style={{ opacity: fade ? 1 : 0, transition: "opacity .35s ease" }}>
        <span className="deal-banner-spark" aria-hidden="true">✦</span>
        <span className="deal-banner-text">{m.body}</span>
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
