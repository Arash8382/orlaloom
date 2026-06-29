export const site = {
  name: "Orla Loom",
  tagline: "Curated finds for a warm, characterful home.",
  description:
    "Orla Loom is a curated guide to the warm, vintage, cottagecore home — butter dishes, scalloped dinnerware, candles, and colored glassware that make an everyday table feel special.",
  url: "https://orlaloom.com",
  heroImage:
    "https://images.unsplash.com/photo-1745794565783-913db01a89b9?auto=format&fit=crop&w=1400&q=72",
};

export const categories = [
  {
    slug: "butter-dishes",
    name: "Butter Dishes",
    blurb:
      "The tabletop obsession of 2026 — mushroom, scalloped, figural, and classic French butter dishes worth a spot on your counter.",
    image:
      "https://images.unsplash.com/photo-1719148162837-63d2f256231f?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "cottagecore-kitchen",
    name: "Cottagecore Kitchen",
    blurb:
      "Moody, vintage, candle-lit kitchen style — colors, decor, and the small finds that pull the dark cottagecore look together.",
    image:
      "https://images.unsplash.com/photo-1609741893026-6177a6c4ecc7?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "scalloped-dinnerware",
    name: "Scalloped Dinnerware",
    blurb:
      "The defining silhouette of the aesthetic table — scalloped plates, platters, bowls, and serveware.",
    image:
      "https://images.unsplash.com/photo-1759753865666-a6bd3da8971d?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "candles",
    name: "Candles & Fragrance",
    blurb:
      "Cozy, grandmacore-scented candles and home fragrance to make the whole kitchen feel like a cottage.",
    image:
      "https://images.unsplash.com/photo-1605651707963-01c2baf9adee?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "glassware",
    name: "Glassware",
    blurb:
      "Colored, fluted, and vintage glassware that catches the light on a beautifully set table.",
    image:
      "https://images.unsplash.com/photo-1691403970049-d9ec6b27117f?auto=format&fit=crop&w=900&q=70",
  },
];

export function categoryBySlug(slug) {
  return categories.find((c) => c.slug === slug);
}

export function categoryImage(slug) {
  const c = categoryBySlug(slug);
  return c ? c.image : null;
}
