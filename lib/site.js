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
    intro:
      "A good butter dish keeps butter soft, spreadable, and off a bare plate — and the cottagecore versions turn that everyday job into counter décor. Below you'll find our hand-picked favourites, from figural mushroom dishes and scalloped stoneware to the classic French butter bell (a beurrier) that keeps butter fresh at room temperature without refrigeration. Every pick links through to a full guide with sizing, materials, and who each one is genuinely best for.",
    image:
      "https://images.unsplash.com/photo-1719148162837-63d2f256231f?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "cottagecore-kitchen",
    name: "Cottagecore Kitchen",
    blurb:
      "Moody, vintage, candle-lit kitchen style — colors, decor, and the small finds that pull the dark cottagecore look together.",
    intro:
      "Cottagecore kitchen style is about warmth over polish — vintage colours, open shelves of mismatched crockery, candlelight, and small handmade touches. This category gathers the finds that pull that look together, from moody dark-cottagecore accents to sunny grandmillennial colour and the practical pieces that still earn their counter space. Follow any piece through to a guide with real product picks and styling notes.",
    image:
      "https://images.unsplash.com/photo-1609741893026-6177a6c4ecc7?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "scalloped-dinnerware",
    name: "Scalloped Dinnerware",
    blurb:
      "The defining silhouette of the aesthetic table — scalloped plates, platters, bowls, and serveware.",
    intro:
      "Scalloped edges are the signature silhouette of the aesthetic table — the soft, wavy rim that makes a plain plate look hand-finished. Here you'll find scalloped plates, platters, bowls, and serveware in stoneware, pressed glass, and vintage-style ceramic. Each links to a buyer's guide covering set sizes, dishwasher-safety, and how to mix them without it looking fussy.",
    image:
      "https://images.unsplash.com/photo-1759753865666-a6bd3da8971d?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "rugs",
    name: "Rugs",
    blurb:
      "Washable cottagecore area rugs — moody florals, vintage Persian, and faded French blooms that bring antique warmth underfoot, pet- and kid-friendly.",
    intro:
      "Washable cottagecore rugs give you the faded-floral, antique-Persian look without the dry-clean bill — most are machine-washable, non-slip, and safe around pets and kids. This category collects our favourite florals, French-country blooms, and scalloped borders across bedroom, kitchen, and living-room sizes. Every rug links to a guide with sizing help and the current Lahome discount code where it applies.",
    image:
      "https://lahomedecor.com/cdn/shop/files/LahomeGivernyWashableMaximalismVintageFrenchFloralBlueRug_2_5aa136e4-6f56-48ad-ba20-2ebeb6be1337.webp",
  },
  {
    slug: "candles",
    name: "Candles & Fragrance",
    blurb:
      "Cozy, grandmacore-scented candles and home fragrance to make the whole kitchen feel like a cottage.",
    intro:
      "The right candle makes a whole room feel like a cottage — grandmacore scents like honey, beeswax, fig, and pressed herbs, set in fluted holders that catch the light. This category brings together our scent picks and the ribbed, vintage-style holders to show them off. Each links through to a guide with burn-time, scent-throw, and gifting notes.",
    image:
      "https://images.unsplash.com/photo-1605651707963-01c2baf9adee?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "glassware",
    name: "Glassware",
    blurb:
      "Colored, fluted, and vintage glassware that catches the light on a beautifully set table.",
    intro:
      "Coloured, fluted, and vintage-style glassware is the easiest way to make a table feel considered — amber tumblers, pressed-glass goblets, and depression-era hues that glow in afternoon light. Here you'll find our favourite everyday and entertaining pieces. Each links to a guide covering set sizes, dishwasher-safety, and how to mix colours without them clashing.",
    image:
      "https://images.unsplash.com/photo-1691403970049-d9ec6b27117f?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "retro-appliances",
    name: "Retro Appliances",
    blurb:
      "Pastel, vintage-style kitchen appliances — Smeg kettles, retro mixers, mini fridges, and cute small gadgets that double as decor.",
    intro:
      "Pastel, vintage-style appliances let a modern kitchen borrow a 1950s mood — Smeg-look kettles and toasters, retro mini fridges, and mixers pretty enough to leave out on the counter. This category gathers the pieces worth the space, plus the more affordable dupes that nail the look for less. Each links to a guide with colours, real prices, and how the budget versions compare to the originals.",
    image:
      "https://images.unsplash.com/photo-1772213559169-9bc881e53df4?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "home-decor",
    name: "Home Décor",
    blurb:
      "Bud vases, vintage arched mirrors, botanical art, and aged terracotta — the finishing touches that make a room feel collected and warm.",
    intro:
      "The finishing touches are what make a room read as collected rather than merely furnished — bud vases, arched mirrors, pressed-botanical art, and aged terracotta. This category holds the small, high-impact pieces that tie a cottagecore space together. Each links through to a guide with styling ideas and tested picks across a range of prices.",
    image:
      "https://images.unsplash.com/photo-1745794565783-913db01a89b9?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "textiles",
    name: "Textiles & Linens",
    blurb:
      "Washed-linen tablecloths, ditsy floral quilts, and scalloped towels that bring softness and a heirloom feel to a cottage home.",
    intro:
      "Soft goods carry the cosiness — washed-linen tablecloths, ditsy-floral quilts, waffle-weave towels, and scalloped napkins with an heirloom feel. This category gathers the layers that make a cottage home feel lived-in and warm. Each links to a guide covering fabric, care, and how to mix patterns without it looking busy.",
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
