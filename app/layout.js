import "./globals.css";
import Link from "next/link";
import { site, categories } from "../lib/site";
import Header from "./components/Header";

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
  other: {
    "p:domain_verify": "87d27c8f399f63674350a5857c26c182",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="page-shell">
          <Header />
          <main>{children}</main>
          <footer className="footer">
            <div className="container footer-grid">
              <div>
                <div className="name">{site.name}</div>
                <p>{site.description}</p>
              </div>
              <div>
                <h4>Categories</h4>
                <ul>
                  {categories.map((c) => (
                    <li key={c.slug}><Link href={`/category/${c.slug}`}>{c.name}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Orla Loom</h4>
                <ul>
                  <li><Link href="/about">About</Link></li>
                  <li><Link href="/disclosure">Affiliate Disclosure</Link></li>
                  <li><Link href="/privacy">Privacy</Link></li>
                </ul>
              </div>
            </div>
            <div className="container footer-bottom">
              <span>© {new Date().getFullYear()} {site.name}. Affiliate-supported — we may earn from qualifying purchases.</span>
              <span>Gentle finds for a warmer home</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
