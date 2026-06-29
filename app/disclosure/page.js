import { site } from "../../lib/site";

export const metadata = { title: "Affiliate Disclosure" };

export default function Disclosure() {
  return (
    <div className="article-wrap">
      <span className="eyebrow">Transparency</span>
      <h1 style={{ fontSize: 40, margin: "10px 0 18px" }}>Affiliate Disclosure</h1>
      <div className="prose">
        <p>
          {site.name} is reader-supported. When you buy through links on our site,
          we may earn an affiliate commission at no extra cost to you. We only
          feature products we genuinely think fit the aesthetic we cover.
        </p>
        <p>
          As an Amazon Associate and a member of other affiliate programs
          (including ShopMy), we earn from qualifying purchases. Prices and
          availability are accurate as of the time of writing but may change.
        </p>
      </div>
    </div>
  );
}
