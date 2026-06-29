export const site = {
  name: "Orla Loom",
  tagline: "Curated finds for a warm, characterful home.",
  description:
    "Orla Loom is a curated guide to the warm, vintage, cottagecore home — butter dishes, scalloped dinnerware, candles, and colored glassware that make an everyday table feel special.",
  // Update this to https://orlaloom.com once the domain is connected.
  url: "https://orlaloom.com",
};

export const categories = [
  {
    slug: "butter-dishes",
    name: "Butter Dishes",
    blurb:
      "The tabletop obsession of 2026 — mushroom, scalloped, figural, and classic French butter dishes worth a spot on your counter.",
  },
  {
    slug: "cottagecore-kitchen",
    name: "Cottagecore Kitchen",
    blurb:
      "Moody, vintage, candle-lit kitchen style — colors, decor, and the small finds that pull the dark cottagecore look together.",
  },
  {
    slug: "scalloped-dinnerware",
    name: "Scalloped Dinnerware",
    blurb:
      "The defining silhouette of the aesthetic table — scalloped plates, platters, bowls, and serveware.",
  },
  {
    slug: "candles",
    name: "Candles & Fragrance",
    blurb:
      "Cozy, grandmacore-scented candles and home fragrance to make the whole kitchen feel like a cottage.",
  },
  {
    slug: "glassware",
    name: "Glassware",
    blurb:
      "Colored, fluted, and vintage glassware that catches the light on a beautifully set table.",
  },
];

export function categoryBySlug(slug) {
  return categories.find((c) => c.slug === slug);
}
