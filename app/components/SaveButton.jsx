"use client";
import { useEffect, useState } from "react";
import { getWishlist, toggleItem, WISHLIST_EVENT } from "../../lib/wishlist";

// A heart toggle that saves a product to the no-login wishlist. Renders as an
// overlay on product cards. `product` needs name/image/price/url (brand optional).
export default function SaveButton({ product, className = "" }) {
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const sync = () => setSaved(getWishlist().some((p) => p.url === product.url));
    sync();
    window.addEventListener(WISHLIST_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(WISHLIST_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [product.url]);

  return (
    <button
      type="button"
      className={"save-btn" + (saved ? " on" : "") + (className ? " " + className : "")}
      aria-label={saved ? "Remove from your saved list" : "Save to your list"}
      aria-pressed={mounted ? saved : undefined}
      title={saved ? "Saved — tap to remove" : "Save for later"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const now = toggleItem({
          name: product.name,
          image: product.image,
          price: product.price,
          url: product.url,
          brand: product.brand,
        });
        setSaved(now);
      }}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M12 20.4S4.6 16 2.3 11.6C1.1 9.3 1.9 6 4.9 5.3c2-.5 3.8.5 7.1 3.4 3.3-2.9 5.1-3.9 7.1-3.4 3 .7 3.8 4 2.6 6.3C19.4 16 12 20.4 12 20.4z"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
