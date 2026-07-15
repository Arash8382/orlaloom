export const site = {
  name: "Orla Loom",
  tagline: "Curated finds for a warm, characterful home.",
  description:
    "Orla Loom is a curated guide to the warm, vintage, cottagecore home — butter dishes, scalloped dinnerware, candles, and colored glassware that make an everyday table feel special.",
  url: "https://orlaloom.com",
  heroImage:
    "https://images.unsplash.com/photo-1745794565783-913db01a89b9?auto=format&fit=crop&w=1400&q=72",
};

// Named authorship — Google's 2026 E-E-A-T guidance rewards a real, named
// person over a faceless "editors" byline. Edit these in one place; the byline,
// About page, and BlogPosting author schema all read from here. Add `image`
// with a real headshot URL for an extra Experience/Expertise signal.
export const author = {
  name: "Arash Tadi",
  role: "Founder & Editor",
  initials: "AT",
  url: `${"https://orlaloom.com"}/about`,
  bio:
    "Arash is the founder and editor of Orla Loom. He started the site to cut through endless scrolling and hand-pick the cottagecore and vintage home pieces actually worth buying — testing the shortlist against real prices, real materials, and who each piece is genuinely for.",
  // image: "https://orlaloom.com/authors/arash.jpg",
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
    slug: "rugs",
    name: "Rugs",
    blurb:
      "Washable cottagecore area rugs — moody florals, vintage Persian, and faded French blooms that bring antique warmth underfoot, pet- and kid-friendly.",
    image:
      "https://lahomedecor.com/cdn/shop/files/LahomeGivernyWashableMaximalismVintageFrenchFloralBlueRug_2_5aa136e4-6f56-48ad-ba20-2ebeb6be1337.webp",
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
  {
    slug: "retro-appliances",
    name: "Retro Appliances",
    blurb:
      "Pastel, vintage-style kitchen appliances — Smeg kettles, retro mixers, mini fridges, and cute small gadgets that double as decor.",
    image:
      "https://images.unsplash.com/photo-1772213559169-9bc881e53df4?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "home-decor",
    name: "Home Décor",
    blurb:
      "Bud vases, vintage arched mirrors, botanical art, and aged terracotta — the finishing touches that make a room feel collected and warm.",
    image:
      "https://images.unsplash.com/photo-1745794565783-913db01a89b9?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "textiles",
    name: "Textiles & Linens",
    blurb:
      "Washed-linen tablecloths, ditsy floral quilts, and scalloped towels that bring softness and a heirloom feel to a cottage home.",
    image:
      "https://images.unsplash.com/photo-1609741893026-6177a6c4ecc7?auto=format&fit=crop&w=900&q=70",
  },
];

export function categoryBySlug(slug) {
  return categories.find((c) => c.slug === slug);
}

export function categoryImage(slug) {
  const c = categoryBySlug(slug);
  return c ? c.image : null;
}
