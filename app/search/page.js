import SearchClient from "../components/SearchClient";
import { getAllProducts } from "../../lib/posts";
import { categories } from "../../lib/site";

export const metadata = {
  title: "Search — Orla Loom",
  description: "Search every cottagecore home & décor find on Orla Loom by name, brand, or category.",
};

export default function SearchPage() {
  const products = getAllProducts();
  const cats = categories.map((c) => ({ slug: c.slug, name: c.name }));
  return <SearchClient products={products} categories={cats} />;
}
