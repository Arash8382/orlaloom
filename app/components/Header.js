"use client";
import { useState } from "react";
import Link from "next/link";
import { site, categories } from "../../lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="name">{site.name}</span>
          <span className="tag">Curated home finds</span>
        </Link>

        <nav className="nav-desktop">
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`}>
              {c.name}
            </Link>
          ))}
          <Link href="/about">About</Link>
          <Link className="btn btn-primary nav-cta" href="/category/butter-dishes">
            Shop the trend
          </Link>
        </nav>

        <button
          className="hamburger"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
        </button>
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
