import "./globals.css";
import Link from "next/link";
import { site, categories } from "../lib/site";

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
    url: site.url,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="bar">
            <Link href="/" className="brand">
              {site.name}
              <small>Curated home finds</small>
            </Link>
            <nav className="nav">
              {categories.map((c) => (
                <Link key={c.slug} href={`/category/${c.slug}`}>
                  {c.name}
                </Link>
              ))}
              <Link href="/about">About</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div>
            <Link href="/about">About</Link>
            <Link href="/disclosure">Affiliate Disclosure</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
          <p>
            © {new Date().getFullYear()} {site.name}. As an Amazon Associate and
            affiliate partner, we earn from qualifying purchases.
          </p>
        </footer>
      </body>
    </html>
  );
}
