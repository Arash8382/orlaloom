"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { site, categories } from "../../lib/site";
import { getWishlist, WISHLIST_EVENT } from "../../lib/wishlist";

const navLinks = [
  { href: "/category/butter-dishes", label: "Butter Dishes" },
  { href: "/category/scalloped-dinnerware", label: "Dinnerware" },
  { href: "/category/rugs", label: "Rugs" },
  { href: "/category/candles", label: "Candles" },
  { href: "/category/glassware", label: "Glassware" },
  { href: "/category/retro-appliances", label: "Appliances" },
  { href: "/category/home-decor", label: "Décor" },
  { href: "/category/textiles", label: "Linens" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const sync = () => setSavedCount(getWishlist().length);
    sync();
    window.addEventListener(WISHLIST_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(WISHLIST_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="wordmark" onClick={() => setOpen(false)}>
          {site.name}
        </Link>

        <nav className="nav-desktop">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
        </nav>

        <div className="header-right">
          <Link className="search-link" href="/search" aria-label="Search products">🔍 Search</Link>
          <Link className="saved-link" href="/wishlist" aria-label="Your saved picks" title="Your saved picks" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={savedCount > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 20.4S4.6 16 2.3 11.6C1.1 9.3 1.9 6 4.9 5.3c2-.5 3.8.5 7.1 3.4 3.3-2.9 5.1-3.9 7.1-3.4 3 .7 3.8 4 2.6 6.3C19.4 16 12 20.4 12 20.4z" />
            </svg>
            Saved{savedCount > 0 ? (
              <span style={{ background: "var(--terra,#c07a54)", color: "#fff", borderRadius: 999, fontSize: 11, fontWeight: 700, padding: "1px 7px", lineHeight: 1.5 }}>{savedCount}</span>
            ) : null}
          </Link>
          <a className="ig-link" href="https://www.instagram.com/orlaloom/" target="_blank" rel="noopener noreferrer" aria-label="Follow Orla Loom on Instagram" title="Follow @orlaloom">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5.5" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <Link className="search-pill" href="/category/butter-dishes">Shop the trend</Link>
          <button
            className="hamburger"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <Link href="/search" onClick={() => setOpen(false)}>🔍 Search</Link>
        <Link href="/wishlist" onClick={() => setOpen(false)}>♥ Saved picks{savedCount > 0 ? ` (${savedCount})` : ""}</Link>
        {categories.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} onClick={() => setOpen(false)}>
            {c.name}
          </Link>
        ))}
        <Link href="/about" onClick={() => setOpen(false)}>About</Link>
        <a href="https://www.instagram.com/orlaloom/" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Follow us on Instagram →</a>
      </div>
    </header>
  );
}
