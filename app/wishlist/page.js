import WishlistClient from "../components/WishlistClient";

export const metadata = {
  title: "Your Saved Picks",
  description:
    "Your saved cottagecore finds, all in one place — no account needed. Save products, build a gift list, and share it with a friend.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/wishlist" },
};

export default function WishlistPage({ searchParams }) {
  const shared = typeof searchParams?.list === "string" ? searchParams.list : "";
  return (
    <div className="page-pad">
      <WishlistClient shared={shared} />
    </div>
  );
}
