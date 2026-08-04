import { site } from "../../lib/site";

export const metadata = { title: "About" };

export default function About() {
  return (
    <div className="article-wrap">
      <span className="eyebrow">About</span>
      <h1 style={{ fontSize: 40, margin: "10px 0 18px" }}>About {site.name}</h1>
      <div className="prose">
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
          Orla Loom is run by <strong>Arash Tadi</strong>, founder and editor. What
          started as a personal obsession with warm, lived-in homes — scalloped
          edges, colored glass, kitchens that feel like someone actually bakes in
          them — became a full-time project: finding the pieces that make a house
          feel collected rather than decorated, and being honest about which ones
          are worth the money.
        </p>
        <p>
          We use AI tools to help research products, track prices, and keep every
          link current — and a human makes the final call on every recommendation.
          If we get something wrong, tell us and we&apos;ll fix it.
        </p>
      </div>
    </div>
  );
}
