// No-login wishlist, stored in the browser's localStorage. No account, no
// backend. A saved item is identified by its (affiliate) url. Sharing works by
// encoding the compact list into a URL param — see encodeList / decodeList.

const KEY = "orlaloom_wishlist_v1";
const EVENT = "orlaloom-wishlist-change";

export function getWishlist() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWishlist(items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(EVENT));
  } catch {}
}

export function isSaved(url) {
  return getWishlist().some((p) => p.url === url);
}

// Toggle an item in/out of the list. Returns true if it is now saved.
export function toggleItem(item) {
  const list = getWishlist();
  const i = list.findIndex((p) => p.url === item.url);
  if (i >= 0) list.splice(i, 1);
  else list.unshift(pick(item));
  saveWishlist(list);
  return i < 0;
}

export function removeItem(url) {
  saveWishlist(getWishlist().filter((p) => p.url !== url));
}

export function addItems(items) {
  const list = getWishlist();
  const urls = new Set(list.map((p) => p.url));
  items.forEach((it) => {
    if (it && it.url && !urls.has(it.url)) {
      list.push(pick(it));
      urls.add(it.url);
    }
  });
  saveWishlist(list);
}

export function clearWishlist() {
  saveWishlist([]);
}

export const WISHLIST_EVENT = EVENT;

function pick(p) {
  return { name: p.name, image: p.image, price: p.price, url: p.url, brand: p.brand };
}

// --- Share-link encoding (base64url of a compact JSON array) ---
export function encodeList(items) {
  try {
    const compact = items.map((p) => ({ n: p.name, p: p.price, u: p.url, i: p.image, b: p.brand }));
    const json = JSON.stringify(compact);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch {
    return "";
  }
}

export function decodeList(str) {
  try {
    const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(b64)));
    const arr = JSON.parse(json);
    if (!Array.isArray(arr)) return [];
    return arr
      .map((p) => ({ name: p.n, price: p.p, url: p.u, image: p.i, brand: p.b }))
      .filter((p) => p.url && p.name);
  } catch {
    return [];
  }
}
