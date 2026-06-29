"use client";
import { useState } from "react";
import Link from "next/link";
import { site, categories } from "../../lib/site";

const navLinks = [
  { href: "/category/butter-dishes", label: "Butter Dishes" },
  { href: "/category/scalloped-dinnerware", label: "Dinnerware" },
  { href: "/category/candles", label: "Candles" },
  { href: "/category/glassware", label: "Glassware" },
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
          <Link className="saved" href="/about">Journal</Link>
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
        {categories.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} onClick={() => setOpen(false)}>
            {c.name}
          </Link>
        ))}
        <Link href="/about" onClick={() => setOpen(false)}>About</Link>
      </div>
    </header>
  );
}
