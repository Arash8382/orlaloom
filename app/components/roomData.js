// Homepage "Shop the Room" — all-cottagecore rooms built from REAL product photos.
// Every dot links to the actual buyable product pictured in the scene.
export const roomProducts = {
  celeste:    { eb: "Washable rugs", prod: "Celeste Vintage Floral Beige Rug", price: "From $79.99", blurb: "Machine-washable vintage florals that hide every spill.", url: "https://app.partnerboost.com/track/3836rlkmIu1FVPcffB_awyM7KJX8pxJkJaBunO5r9ZOXeYVuFA74qJ7jnJpoc0bXSdrtRhtGtATBVFgvGRrKSR2Rw" },
  giverny:    { eb: "Washable rugs", prod: "Giverny French Floral Blue Rug", price: "From $39.99", blurb: "Soft blue French-country florals, fully washable.", url: "https://app.partnerboost.com/track/b2f2Rto0JPm6YYvR19UFzK6g_bF0obixDtxwKbEUjhganeKM_aGVlRaGVwCFS9cM6ALygoIFyKYvfELABxR3N169Ph" },
  quilt:      { eb: "Textiles", prod: "Blooming Prairie Patchwork Quilt", price: "From $60", blurb: "Soft floral patchwork for a lived-in sofa.", url: "https://www.amazon.com/Greenland-Home-Blooming-Prairie-Quilt/dp/B003G2ZVT4?tag=orlaloom-20" },
  smegkettle: { eb: "Appliances", prod: "Smeg 50s Retro Electric Kettle", price: "From $200", blurb: "The pastel kettle that's basically décor.", url: "https://www.amazon.com/SMEG-CUP-Kettle-Pastel-Blue/dp/B077PJF9DF?tag=orlaloom-20" },
  kitchenaid: { eb: "Appliances", prod: "KitchenAid Artisan Stand Mixer", price: "From $400", blurb: "The workhorse that happens to look this good.", url: "https://www.amazon.com/dp/B07QJR3W3V?tag=orlaloom-20" },
  dutch:      { eb: "Kitchen", prod: "Le Creuset Round Dutch Oven", price: "From $300", blurb: "Enameled cast-iron — a lifetime piece.", url: "https://www.amazon.com/dp/B00VA5HG0Q?tag=orlaloom-20" },
  tablecloth: { eb: "Linens", prod: "Solino Hemstitch Tablecloth", price: "From $25", blurb: "Washed cotton-linen with a hemstitch edge.", url: "https://www.amazon.com/Solino-Home-Hemstitch-Cotton-Tablecloth/dp/B096S77X26?tag=orlaloom-20" },
  amberglass: { eb: "Glassware", prod: "Vintage Amber Ribbed Glasses", price: "From $28", blurb: "Sunlit amber for an everyday table.", url: "https://www.amazon.com/Ribbed-Glassware-Vintage-Drinking-Glasses/dp/B0BTVMFWQN?tag=orlaloom-20" },
  butter:     { eb: "Butter dishes", prod: "Fungi Fun Mushroom Butter Dish", price: "From $25", blurb: "The toadstool detail that finishes a table.", url: "https://www.amazon.com/Fungi-Fun-Mushroom-Butter-Countertop/dp/B0CPM8Y9LQ?tag=orlaloom-20" },
  art:        { eb: "Home décor", prod: "Wildflower Wall Art, Set of 3", price: "From $40", blurb: "Soft botanical prints for a calm wall.", url: "https://www.amazon.com/Wildflower-Botanical-Pictures-Cottagecore-Painting/dp/B0GXF8ZX36?tag=orlaloom-20" },
  mirror:     { eb: "Home décor", prod: "Scalloped Arch Wall Mirror", price: "From $90", blurb: "A wavy gold scallop that lifts a hallway.", url: "https://www.amazon.com/Kate-Laurel-Scalloped-Decorative-Glamorous/dp/B09RSM9W8S?tag=orlaloom-20" },
  baskets:    { eb: "Home décor", prod: "Scalloped Wicker Wall Baskets", price: "From $60", blurb: "Handwoven texture for a warm corner.", url: "https://www.amazon.com/dp/B0D7PLDGPD?tag=orlaloom-20" },
  coralie:    { eb: "Washable rugs", prod: "Coralie Cottagecore Floral Rose Pink Rug", price: "From $36.99", blurb: "Scalloped rose-pink florals, fully washable.", url: "https://app.partnerboost.com/track/c20eyntccwGQzqaTttDAIIDOoG1aaq8NF7a90SX1FyyhQACPCFfc5lyaOnN_b5h_aJhGmtSwMPkESRZikgRKBXrGTT" },
  vaseset:    { eb: "Home décor", prod: "White Ceramic Bud Vase Set", price: "From $20", blurb: "A cluster of matte bud vases for dried stems.", url: "https://www.amazon.com/dp/B0GK2P622Z?tag=orlaloom-20" },
  arendahl:   { eb: "Home décor", prod: "Kate & Laurel Arendahl Arch Mirror", price: "$82.99", blurb: "A traditional gold arch mirror that opens a wall.", url: "https://www.amazon.com/Kate-Laurel-Arendahl-Traditional-Inspired/dp/B087GCPXBP?tag=orlaloom-20" }
};

export const rooms = [
  { key: "living", label: "Cosy Living", spots: [
    { k: "celeste", cx: 28, cy: 62 },
    { k: "giverny", cx: 50, cy: 85 },
    { k: "quilt", cx: 78, cy: 55 }
  ]},
  { key: "kitchen", label: "The Kitchen", spots: [
    { k: "smegkettle", cx: 28, cy: 50 },
    { k: "kitchenaid", cx: 48, cy: 45 },
    { k: "dutch", cx: 72, cy: 60 }
  ]},
  { key: "table", label: "The Table", spots: [
    { k: "tablecloth", cx: 30, cy: 72 },
    { k: "amberglass", cx: 40, cy: 45 },
    { k: "butter", cx: 56, cy: 55 }
  ]},
  { key: "decor", label: "Shelf & Décor", spots: [
    { k: "art", cx: 24, cy: 28 },
    { k: "mirror", cx: 55, cy: 28 },
    { k: "baskets", cx: 82, cy: 28 }
  ]},
  { key: "bedroom", label: "The Bedroom", spots: [
    { k: "coralie", cx: 30, cy: 80 },
    { k: "quilt", cx: 65, cy: 48 }
  ]},
  { key: "nook", label: "Reading Nook", spots: [
    { k: "celeste", cx: 35, cy: 82 },
    { k: "amberglass", cx: 72, cy: 45 },
    { k: "art", cx: 62, cy: 18 }
  ]},
  { key: "console", label: "The Console", spots: [
    { k: "arendahl", cx: 50, cy: 18 },
    { k: "vaseset", cx: 50, cy: 60 }
  ]}
];
