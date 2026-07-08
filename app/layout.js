import "./globals.css";
import Link from "next/link";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { site, categories } from "../lib/site";
import Header from "./components/Header";
import DealBanner from "./components/DealBanner";
import PushBell from "./components/PushBell";
import HomepagePrompt from "./components/HomepagePrompt";
import AffiliateTracking from "./components/AffiliateTracking";
import EmailSignup from "./components/EmailSignup";

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
      <head>
        <meta name="impact-site-verification" value="ec108d73-6a15-4614-89f9-45f00ed63e80" content="ec108d73-6a15-4614-89f9-45f00ed63e80" />
      </head>
      <body>
        <div className="page-shell">
          <DealBanner />
          <Header />
          <main>{children}</main>
          <footer className="footer">
            <div className="container" style={{ paddingBottom: "8px" }}>
              <EmailSignup variant="card" />
            </div>
            <div className="container footer-grid">
              <div>
                <div className="name">{site.name}</div>
                <p>{site.description}</p>
                <div style={{ marginTop: "14px", display: "flex", flexWrap: "wrap", gap: "10px" }}><PushBell /><HomepagePrompt /></div>
                <div className="social-row">
                  <a href="https://www.instagram.com/orlaloom/" target="_blank" rel="noopener noreferrer" aria-label="Orla Loom on Instagram">Instagram</a>
                  <a href="https://www.pinterest.com/orlaloom/" target="_blank" rel="noopener noreferrer" aria-label="Orla Loom on Pinterest">Pinterest</a>
                </div>
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
                  <li><Link href="/lahome-discount-code">Lahome Discount Code</Link></li>
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
        <Script
          src="https://s.skimresources.com/js/305443X1793648.skimlinks.js"
          strategy="afterInteractive"
        />
        <Analytics />
        <AffiliateTracking />
      </body>
    </html>
  );
}
