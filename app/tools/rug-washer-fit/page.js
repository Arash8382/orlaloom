import Link from "next/link";
import { site } from "../../../lib/site";
import Calculator from "./Calculator";

export const metadata = {
  title: "Rug Washer-Fit Calculator — Will Your Washable Rug Fit in Your Machine?",
  description:
    "Free tool: enter your rug size and washer capacity to see if a washable rug will actually fit in your washing machine — with wet-weight estimates and laundromat guidance.",
  alternates: { canonical: "/tools/rug-washer-fit" },
};

export default function RugWasherFitPage() {
  const url = `${site.url}/tools/rug-washer-fit`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebApplication", name: "Rug Washer-Fit Calculator", url, applicationCategory: "UtilityApplication",
        operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: site.name, url: site.url } },
      { "@type": "FAQPage", mainEntity: [
        { "@type": "Question", name: "Can I wash an 8x10 washable rug in a home washing machine?",
          acceptedAnswer: { "@type": "Answer", text: "Usually not. An 8x10 polyester washable rug typically needs a 5.0+ cu ft drum and can exceed 25 lb soaking wet. Most 8x10 rugs need a commercial front-loader at a laundromat. 5x7 and smaller usually fit a standard 4.5 cu ft home machine." } },
        { "@type": "Question", name: "How much does a washable rug weigh when wet?",
          acceptedAnswer: { "@type": "Answer", text: "Roughly 2 to 3 times its dry weight. A 15 lb 5x7 rug can weigh 35+ lb soaked, which strains both the machine bearings and your back — spin twice before moving it." } },
      ] },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container" style={{ paddingTop: 18, paddingBottom: 48 }}>
        <div className="breadcrumb"><Link href="/">Home</Link> &nbsp;/&nbsp; Tools &nbsp;/&nbsp; Rug Washer-Fit</div>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px,3.6vw,38px)", color: "var(--head)", margin: "10px 0 6px" }}>
          Will That Washable Rug Fit in Your Washer?
        </h1>
        <p style={{ lineHeight: 1.7, maxWidth: "72ch", color: "var(--ink)", marginBottom: 20 }}>
          "Machine washable" only helps if the machine is yours. Enter the rug and your washer below — we&apos;ll estimate
          drum fit, wet weight, and whether you&apos;re looking at a home wash or a laundromat trip. Rules of thumb are based
          on manufacturer care guides (Ruggable, Lahome, Tumble) and standard US washer capacities.
        </p>
        <Calculator />
        <p style={{ lineHeight: 1.7, maxWidth: "72ch", color: "var(--muted-2)", marginTop: 26, fontSize: 14 }}>
          Ready to pick a rug? Start with our <Link href="/blog/cottagecore-washable-rugs">washable rug guide</Link> or the{" "}
          <Link href="/blog/rug-size-guide">rug size guide</Link>. Estimates are guidance, not a guarantee — always check the
          care label and your washer manual.
        </p>
      </div>
    </>
  );
}
