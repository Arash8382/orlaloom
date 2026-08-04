import Link from "next/link";
import { site } from "../../../lib/site";
import Matcher from "./Matcher";

export const metadata = {
  title: "Retro Appliance Color Matcher — Which Retro Colors Work in Your Kitchen?",
  description:
    "Free tool: pick your kitchen's cabinet and counter colors and see which retro appliance colors (cream, mint, pink, sage, red) will look collected — not chaotic — with real pairing guidance.",
  alternates: { canonical: "/tools/retro-color-matcher" },
};

export default function RetroColorMatcherPage() {
  const url = `${site.url}/tools/retro-color-matcher`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebApplication", name: "Retro Appliance Color Matcher", url, applicationCategory: "UtilityApplication",
        operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: site.name, url: site.url } },
      { "@type": "FAQPage", mainEntity: [
        { "@type": "Question", name: "What retro appliance color goes with white kitchen cabinets?",
          acceptedAnswer: { "@type": "Answer", text: "White cabinets are the easiest base — nearly every retro color works. Mint, pastel pink, and cream read softest; red or black read boldest. Pick one hero color and repeat it 2-3 times (kettle + toaster + canister) rather than mixing several pastels." } },
        { "@type": "Question", name: "Can I mix different retro appliance colors in one kitchen?",
          acceptedAnswer: { "@type": "Answer", text: "Stick to one hero color plus cream or white as a neutral. Two saturated pastels (say mint and pink) compete unless the rest of the kitchen is very plain. Cream pairs with everything, which is why it's the most-bought retro appliance color." } },
        { "@type": "Question", name: "Do Smeg and KitchenAid colors match each other?",
          acceptedAnswer: { "@type": "Answer", text: "Not exactly — each brand's cream, mint, and pink differ slightly in tone. Colors read close enough across brands if separated on the counter, but appliances that will sit side by side are safest bought from the same brand line." } },
      ] },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container" style={{ paddingTop: 18, paddingBottom: 48 }}>
        <div className="breadcrumb"><Link href="/">Home</Link> &nbsp;/&nbsp; Tools &nbsp;/&nbsp; Retro Color Matcher</div>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px,3.6vw,38px)", color: "var(--head)", margin: "10px 0 6px" }}>
          Which Retro Appliance Color Fits Your Kitchen?
        </h1>
        <p style={{ lineHeight: 1.7, maxWidth: "72ch", color: "var(--ink)", marginBottom: 20 }}>
          A cream Smeg kettle and a pink KitchenAid are both beautiful — but not necessarily in the same kitchen. Pick your
          cabinet and counter colors below and we&apos;ll tell you which retro colors will look collected, which get risky,
          and how many colors to stop at. Guidance is based on classic 50s palette pairings and the combinations we see
          working in real cottagecore kitchens.
        </p>
        <Matcher />
        <p style={{ lineHeight: 1.7, maxWidth: "72ch", color: "var(--muted-2)", marginTop: 26, fontSize: 14 }}>
          Found your color? Browse our <Link href="/category/retro-appliances">retro appliance guides</Link> to find the
          kettles, toasters, and mixers that come in it. Tones vary slightly between brands — check product photos before
          pairing side-by-side pieces.
        </p>
      </div>
    </>
  );
}
