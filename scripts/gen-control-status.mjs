// Generates public/control-status.json at build time so the online /control.html
// dashboard always reflects the latest deploy. Runs before `next build`.
import fs from "fs";
import path from "path";

const dir = "content/posts";
const CATS = {
  "butter-dishes": "Butter Dishes",
  "cottagecore-kitchen": "Cottagecore Kitchen",
  "scalloped-dinnerware": "Scalloped Dinnerware",
  "candles": "Candles & Fragrance",
  "glassware": "Glassware",
  "retro-appliances": "Retro Appliances",
  "home-decor": "Home Décor",
  "textiles": "Textiles & Linens",
};

const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md")) : [];
let posts = [];
let totalProducts = 0;
const catCount = {}, catProd = {};

for (const f of files) {
  const s = fs.readFileSync(path.join(dir, f), "utf8");
  const fm = s.split("---\n")[1] || "";
  const title = (fm.match(/title:\s*"([^"]*)"/) || [])[1] || f.replace(/\.md$/, "");
  const category = (fm.match(/category:\s*"([^"]*)"/) || [])[1] || "";
  const date = (fm.match(/date:\s*"([^"]*)"/) || [])[1] || "";
  const prod = (fm.match(/\n {2}- name:/g) || []).length;
  totalProducts += prod;
  catCount[category] = (catCount[category] || 0) + 1;
  catProd[category] = (catProd[category] || 0) + prod;
  posts.push({ slug: f.replace(/\.md$/, ""), title, category, date, prod });
}
posts.sort((a, b) => (a.date < b.date ? 1 : -1));

const categories = Object.keys(CATS).map((slug) => ({
  slug, name: CATS[slug], guides: catCount[slug] || 0, products: catProd[slug] || 0,
}));

const agents = [
  { id: "daily-guide", name: "📝 Daily guide writer", sched: "Every day · 7:08 AM", h: 7, m: 8, dow: null },
  { id: "pinterest", name: "📌 Pinterest promoter", sched: "Every day · 10:04 AM", h: 10, m: 4, dow: null },
  { id: "progress", name: "✅ Daily progress check", sched: "Every day · 8:01 AM", h: 8, m: 1, dow: null },
  { id: "seo", name: "📈 SEO optimizer", sched: "Tuesdays · 8:04 AM", h: 8, m: 4, dow: 2 },
  { id: "traffic", name: "📊 Weekly traffic report", sched: "Mondays · 8:08 AM", h: 8, m: 8, dow: 1 },
  { id: "trend", name: "🔭 Trend scout", sched: "Sundays · 6:03 PM", h: 18, m: 3, dow: 0 },
];

const out = {
  buildTime: new Date().toISOString(),
  totalGuides: posts.length,
  totalProducts,
  categories,
  recent: posts.slice(0, 8).map((p) => ({ title: p.title, slug: p.slug, date: p.date, category: p.category, catName: CATS[p.category] || p.category, products: p.prod })),
  agents,
};

fs.mkdirSync("public", { recursive: true });
fs.writeFileSync("public/control-status.json", JSON.stringify(out));
console.log("control-status.json:", out.totalGuides, "guides,", totalProducts, "products");
