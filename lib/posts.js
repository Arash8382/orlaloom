import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { enrichProduct } from "./enrichment";

const postsDir = path.join(process.cwd(), "content", "posts");

// Guides consolidated into stronger pages on 2026-08-08 (see INDEXING-FIX-PLAN.md).
// Their .md files stay in the repo for reference, but they are excluded from every
// listing, the sitemap, and related-guide links, and next.config.js 301s the old
// URLs to their destinations. Treat this list as "deleted".
const MERGED_SLUGS = new Set([
  "mushroom-butter-dishes",
  "vintage-style-enamelware",
  "vintage-farmhouse-mixing-bowls",
  "speckled-stoneware-mugs",
  "smeg-vs-haden-toaster",
  "pastel-small-appliances",
  "amber-fluted-glassware",
]);

export function getPostSlugs() {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .filter((s) => !MERGED_SLUGS.has(s));
}

export function getPostMeta(slug) {
  const fullPath = path.join(postsDir, `${slug}.md`);
  const file = fs.readFileSync(fullPath, "utf8");
  const { data } = matter(file);
  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    category: data.category || "",
    date: data.date || "2026-06-01",
    updated: data.updated || null,
    cover: data.cover || null,
  };
}

function extractFaqs(content) {
  const idx = content.indexOf("## FAQ");
  if (idx === -1) return [];
  let section = content.slice(idx + 6);
  const nextH2 = section.indexOf("\n## ");
  if (nextH2 !== -1) section = section.slice(0, nextH2);
  const faqs = [];
  const re = /\*\*(.+?)\*\*\s*\n+([\s\S]*?)(?=\n\s*\*\*|$)/g;
  let m;
  while ((m = re.exec(section)) !== null) {
    const q = m[1].trim();
    const a = m[2].replace(/\s+/g, " ").trim();
    if (q && a) faqs.push({ q, a });
  }
  return faqs;
}

export async function getPost(slug) {
  const fullPath = path.join(postsDir, `${slug}.md`);
  const file = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(file);
  const processed = await remark().use(html).process(content);
  return {
    ...getPostMeta(slug),
    products: (data.products || []).map(enrichProduct),
    contentHtml: processed.toString(),
    faqs: extractFaqs(content),
  };
}

export function getAllPosts() {
  return getPostSlugs()
    .map(getPostMeta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostsByCategory(categorySlug) {
  return getAllPosts().filter((p) => p.category === categorySlug);
}

// Flat list of every product across a category's guides (annotated with the
// guide it came from) — powers the shop-style product grid on category pages.
export function getCategoryProducts(categorySlug) {
  const out = [];
  for (const p of getPostsByCategory(categorySlug)) {
    const { data } = matter(fs.readFileSync(path.join(postsDir, `${p.slug}.md`), "utf8"));
    (data.products || []).forEach((pr) => {
      if (pr && pr.name) out.push({ ...enrichProduct(pr), guideSlug: p.slug, guideTitle: p.title });
    });
  }
  return out;
}

// Flat list of EVERY product across the whole site — powers site search.
export function getAllProducts() {
  const out = [];
  for (const p of getAllPosts()) {
    const { data } = matter(fs.readFileSync(path.join(postsDir, `${p.slug}.md`), "utf8"));
    (data.products || []).forEach((pr) => {
      if (pr && pr.name) {
        out.push({
          name: pr.name, brand: pr.brand || "", price: (enrichProduct(pr).price) || "",
          image: pr.image || "", url: pr.url || "", badge: pr.badge || "",
          retailer: pr.retailer || "",
          category: p.category, guideSlug: p.slug, guideTitle: p.title,
        });
      }
    });
  }
  return out;
}

// Collect a few real product thumbnails for a category (round-robin across its
// guides for variety) — used for the Amazon-style category cards on the homepage.
export function getCategoryThumbs(categorySlug, limit = 4) {
  const slugs = getPostsByCategory(categorySlug).map((p) => p.slug);
  const perGuide = slugs.map((slug) => {
    const { data } = matter(fs.readFileSync(path.join(postsDir, `${slug}.md`), "utf8"));
    return (data.products || []).map((pr) => pr.image).filter(Boolean);
  });
  const out = [];
  let i = 0;
  while (out.length < limit) {
    let added = false;
    for (const arr of perGuide) {
      if (arr[i]) {
        out.push(arr[i]);
        added = true;
        if (out.length >= limit) break;
      }
    }
    if (!added) break;
    i++;
  }
  return out.slice(0, limit);
}

// Every product thumbnail image for a category (the full pool) — the homepage
// category cards shuffle this per visit so repeat visitors see fresh picks.
export function getCategoryThumbPool(categorySlug) {
  const slugs = getPostsByCategory(categorySlug).map((p) => p.slug);
  const imgs = [];
  for (const slug of slugs) {
    const { data } = matter(fs.readFileSync(path.join(postsDir, `${slug}.md`), "utf8"));
    (data.products || []).forEach((pr) => {
      if (pr && pr.image) imgs.push(pr.image);
    });
  }
  return imgs;
}

// Stable, URL-safe slug for a single product (used for /shop/[slug] landing pages).
export function productSlug(pr) {
  return String(pr && pr.name ? pr.name : "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['"’.,()/]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

// Deduped map of every product across the site, keyed by product slug. Each
// entry carries the product fields plus the guide(s) it appears in and its
// category — the data behind the per-product /shop landing pages.
export function getProductMap() {
  const map = new Map();
  for (const p of getAllPosts()) {
    const { data } = matter(fs.readFileSync(path.join(postsDir, `${p.slug}.md`), "utf8"));
    (data.products || []).forEach((pr) => {
      if (!pr || !pr.name) return;
      let slug = productSlug(pr);
      if (!slug) return;
      if (map.has(slug)) {
        const existing = map.get(slug);
        if (existing.url && pr.url && existing.url === pr.url) {
          existing.guides.push({ slug: p.slug, title: p.title });
          return;
        }
        // Different product, same name-slug → disambiguate with the brand.
        const b = String(pr.brand || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        slug = `${slug}-${b}`.replace(/-+$/, "").slice(0, 80);
        if (map.has(slug)) {
          map.get(slug).guides.push({ slug: p.slug, title: p.title });
          return;
        }
      }
      map.set(slug, { ...enrichProduct(pr), slug, category: p.category, guides: [{ slug: p.slug, title: p.title }] });
    });
  }
  return map;
}

export function getAllProductSlugs() {
  return [...getProductMap().keys()];
}

export function getProductBySlug(slug) {
  return getProductMap().get(slug) || null;
}

// A few other products to show at the bottom of a landing page — same category
// first, then fill from the rest, so every landing page cross-links to more.
export function getRelatedProducts(slug, category, limit = 8) {
  const all = [...getProductMap().values()].filter((p) => p.slug !== slug);
  const same = all.filter((p) => p.category === category);
  const others = all.filter((p) => p.category !== category);
  return [...same, ...others].slice(0, limit);
}

// Same-category guides first, then fill with other recent guides, so every
// post links out to several others (internal linking for SEO + discovery).
export function getRelatedPosts(slug, categorySlug, limit = 4) {
  const all = getAllPosts().filter((p) => p.slug !== slug);
  const sameCat = all.filter((p) => p.category === categorySlug);
  const others = all.filter((p) => p.category !== categorySlug);
  return [...sameCat, ...others].slice(0, limit);
}
