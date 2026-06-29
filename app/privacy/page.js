import { site } from "../../lib/site";

export const metadata = { title: "Privacy Policy" };

export default function Privacy() {
  return (
    <div className="article-wrap">
      <span className="eyebrow">Your privacy</span>
      <h1 style={{ fontSize: 40, margin: "10px 0 18px" }}>Privacy Policy</h1>
      <div className="prose">
        <p>{site.name} respects your privacy. This page describes, in plain terms, what limited data we collect and why.</p>
        <h2>Analytics</h2>
        <p>We may use privacy-friendly analytics to understand which guides are helpful. This data is aggregated and not used to identify you.</p>
        <h2>Affiliate cookies</h2>
        <p>When you click an affiliate link, the retailer or affiliate network may set a cookie so any resulting purchase is credited to us. This does not change your price.</p>
        <h2>Contact</h2>
        <p>Questions? Replace this line with your contact email before launch. This is a starter policy — have it reviewed before relying on it.</p>
      </div>
    </div>
  );
}
