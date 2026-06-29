import { site } from "../../lib/site";

export const metadata = { title: "Affiliate Disclosure" };

export default function Disclosure() {
  return (
    <div className="container article">
      <h1>Affiliate Disclosure</h1>
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
  );
}
