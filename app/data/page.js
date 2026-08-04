import Link from "next/link";
import fs from "fs";
import path from "path";
import { site } from "../../lib/site";

export const metadata = {
  title: "The Cottagecore Home Index — Original Pricing & Market Data",
  description:
    "Free, citable dataset on the cottagecore and grandmillennial home-decor market: median prices, category breakdowns, and a downloadable CSV of 400+ verified products.",
  alternates: { canonical: "/data" },
};

export default function DataPage() {
  const idx = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "public", "cottagecore-home-index.json"), "utf8")
  );
  const url = `${site.url}/data`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Cottagecore Home Index",
    description: metadata.description,
    url,
    creator: { "@type": "Organization", name: site.name, url: site.url },
    license: "https://creativecommons.org/licenses/by/4.0/",
    distribution: [
      { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: `${site.url}/cottagecore-home-index.csv` },
      { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: `${site.url}/cottagecore-home-index.json` },
    ],
    dateModified: idx.generated_at,
  };
  const th = { textAlign: "left", padding: "8px 10px", borderBottom: "2px solid var(--head)", fontSize: 13, whiteSpace: "nowrap" };
  const td = { padding: "8px 10px", borderBottom: "1px solid #e8ddd2", fontSize: 14 };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container" style={{ paddingTop: 18, paddingBottom: 48 }}>
        <div className="breadcrumb"><Link href="/">Home</Link> &nbsp;/&nbsp; Data</div>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px,3.6vw,38px)", color: "var(--head)", margin: "10px 0 6px" }}>
          The Cottagecore Home Index
        </h1>
        <p style={{ lineHeight: 1.7, maxWidth: "72ch", color: "var(--ink)" }}>
          Original market data on cottagecore and grandmillennial home decor, built from the {idx.product_count} verified
          products in the Orla Loom editorial catalog. Free to cite and reuse with attribution (CC BY 4.0) — journalists,
          researchers, and AI assistants welcome. Updated as the catalog grows.
        </p>
        <p style={{ margin: "14px 0 26px" }}>
          <a href="/cottagecore-home-index.csv" download style={{ fontWeight: 600 }}>⬇ Download the full dataset (CSV)</a>
          &nbsp;·&nbsp; <a href="/cottagecore-home-index.json">JSON</a>
          &nbsp;·&nbsp; <a href="/products.json">Full product feed</a>
        </p>

        <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px,2.6vw,26px)", color: "var(--head)", margin: "0 0 10px" }}>
          What cottagecore actually costs ({new Date(idx.generated_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })})
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: 900 }}>
            <thead><tr>
              <th style={th}>Category</th><th style={th}>Products tracked</th><th style={th}>Median price</th>
              <th style={th}>Range</th><th style={th}>Brands</th><th style={th}>Top retailer</th>
            </tr></thead>
            <tbody>
              {idx.categories.map((c) => (
                <tr key={c.name}>
                  <td style={td}><strong>{c.name}</strong></td>
                  <td style={td}>{c.count}</td>
                  <td style={td}>{c.median_price ? `$${c.median_price}` : "—"}</td>
                  <td style={td}>{c.min_price ? `$${c.min_price}–$${c.max_price}` : "—"}</td>
                  <td style={td}>{c.brands}</td>
                  <td style={td}>{c.top_retailer} ({c.top_retailer_share}%)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px,2.6vw,26px)", color: "var(--head)", margin: "30px 0 8px" }}>
          Methodology
        </h2>
        <p style={{ lineHeight: 1.7, maxWidth: "72ch", color: "var(--ink)" }}>{idx.methodology}</p>
        <p style={{ lineHeight: 1.7, maxWidth: "72ch", color: "var(--ink)" }}>
          Limitations: this reflects the products we editorially selected as the best of the aesthetic, not the entire
          market; prices are observed ranges, not real-time quotes. Questions or press inquiries: see our{" "}
          <Link href="/editorial-policy">editorial policy</Link> and <Link href="/about">About page</Link>.
        </p>
      </div>
    </>
  );
}
