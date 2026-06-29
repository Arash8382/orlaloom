import { site, categories } from "../lib/site";
import { getAllPosts } from "../lib/posts";

export default function sitemap() {
  const base = site.url.replace(/\/$/, "");
  const staticPages = ["", "/about", "/disclosure", "/privacy"].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
  }));
  const catPages = categories.map((c) => ({
    url: `${base}/category/${c.slug}`,
    lastModified: new Date(),
  }));
  const postPages = getAllPosts().map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
  }));
  return [...staticPages, ...catPages, ...postPages];
}
