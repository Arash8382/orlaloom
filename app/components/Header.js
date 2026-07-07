"use client";
import { useState } from "react";
import Link from "next/link";
import { site, categories } from "../../lib/site";

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
          <Link className="saved" href="/about">Journal</Link>
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
