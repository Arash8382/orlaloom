/** @type {import('next').NextConfig} */

// 301s for guides consolidated on 2026-08-08 after the Search Console audit
// (see INDEXING-FIX-PLAN.md). Each source was either thin on its own or
// competing with its destination for the same query, so the equity is better
// spent on one strong page than split across two weak ones. lib/posts.js also
// excludes these slugs from every listing and the sitemap.
const mergedGuides = [
  ["mushroom-butter-dishes", "aesthetic-butter-dishes"],
  ["vintage-style-enamelware", "vintage-kitchen-accessories"],
  ["vintage-farmhouse-mixing-bowls", "vintage-kitchen-accessories"],
  ["speckled-stoneware-mugs", "vintage-kitchen-accessories"],
  ["smeg-vs-haden-toaster", "retro-toasters"],
  ["pastel-small-appliances", "best-retro-kitchen-appliances"],
  ["amber-fluted-glassware", "best-colored-glassware"],
];

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return mergedGuides.map(([from, to]) => ({
      source: `/blog/${from}`,
      destination: `/blog/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
