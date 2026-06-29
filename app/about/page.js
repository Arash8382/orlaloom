import { site } from "../../lib/site";

export const metadata = { title: "About" };

export default function About() {
  return (
    <div className="container article">
      <h1>About {site.name}</h1>
      <p>
        {site.name} is a curated guide to the warm, vintage, cottagecore home —
        the butter dishes, scalloped dinnerware, candles, and colored glassware
        that make an everyday table feel a little more special.
      </p>
      <p>
        We research and hand-pick every product so you don’t have to scroll
        forever. Each recommendation comes with a real reason it earned its spot,
        who it’s best for, and an honest note on anything to watch out for.
      </p>
      <p>
        <em>
          Tip: add a founder name, a sentence of personal story, and a photo here.
          Authentic authorship genuinely helps these pages rank.
        </em>
      </p>
    </div>
  );
}
