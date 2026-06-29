import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDir = path.join(process.cwd(), "content", "posts");

export function getPostSlugs() {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
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
    products: data.products || [],
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

// Same-category guides first, then fill with other recent guides, so every
// post links out to several others (internal linking for SEO + discovery).
export function getRelatedPosts(slug, categorySlug, limit = 4) {
  const all = getAllPosts().filter((p) => p.slug !== slug);
  const sameCat = all.filter((p) => p.category === categorySlug);
  const others = all.filter((p) => p.category !== categorySlug);
  return [...sameCat, ...others].slice(0, limit);
}
