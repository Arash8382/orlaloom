"use client";

import { useEffect, useState } from "react";

// Source-aware welcome bar. Reads where the visitor came from (referrer / UTM)
// and why (the landing topic) — entirely client-side, no tracking — and shows a
// tailored greeting + a call-to-action matched to their source & intent.
//
// - Pinterest visitors are in "save" mode  -> nudge to the wishlist.
// - Instagram visitors are warm followers  -> nudge to the newsletter.
// - Google/Bing visitors are researching   -> topic-aware line + newsletter.
// Direct / unknown visitors see nothing (keeps the site clean for regulars).

const DISMISS_KEY = "ol_welcome_dismissed_at";
const DISMISS_DAYS = 7;

// Map a landing path to a friendly topic label (the "why").
function topicFromPath(path) {
  const p = (path || "").toLowerCase();
  const has = (...ks) => ks.some((k) => p.includes(k));
  if (has("rug")) return "washable rugs & cottagecore floor style";
  if (has("smeg", "toaster", "fridge", "mixer", "kettle", "microwave", "retro", "appliance"))
    return "retro & pastel kitchen appliances";
  if (has("candle")) return "cozy candles & scents";
  if (has("lamp", "mushroom", "light")) return "cottagecore lighting";
  if (has("curtain", "comforter", "bedding", "bedroom", "quilt")) return "cottagecore bedroom decor";
  if (has("plate", "dish", "glass", "mug", "kitchen", "dinnerware")) return "cottagecore kitchen & tableware";
  if (has("wall", "art", "print")) return "botanical wall art & prints";
  if (has("grandmillennial")) return "grandmillennial decor";
  return null;
}

// Identify the traffic source from UTM param first, then the referrer host.
function detectSource() {
  if (typeof window === "undefined") return null;
  let utm = "";
  try {
    utm = (new URLSearchParams(window.location.search).get("utm_source") || "").toLowerCase();
  } catch {}
  const ref = (document.referrer || "").toLowerCase();
  const from = (...ks) => ks.some((k) => utm.includes(k) || ref.includes(k));

  if (from("pinterest", "pin.it")) return "pinterest";
  if (from("instagram", "ig")) return "instagram";
  if (from("google")) return "google";
  if (from("bing", "duckduckgo", "ecosia", "yahoo")) return "search";
  return null; // direct / unknown -> no bar
}

function buildMessage(source, topic) {
  switch (source) {
    case "pinterest":
      return {
        emoji: "📌",
        text: "Welcome from Pinterest! Tap the ♥ on any find to save it.",
        ctaText: "View your saves →",
        ctaHref: "/wishlist",
      };
    case "instagram":
      return {
        emoji: "✦",
        text: "Straight from Instagram — get our weekly edit of cozy finds.",
        ctaText: "Join the list →",
        ctaHref: "#ol-newsletter",
      };
    case "google":
    case "search":
      return {
        emoji: "✿",
        text: topic
          ? `Looking for ${topic}? You're in the right place.`
          : "Welcome! You're in the right place for cozy cottagecore finds.",
        ctaText: "Get our weekly picks →",
        ctaHref: "#ol-newsletter",
      };
    default:
      return null;
  }
}

export default function WelcomeBar() {
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    // Respect a recent dismissal.
    try {
      const at = Number(localStorage.getItem(DISMISS_KEY) || 0);
      if (at && Date.now() - at < DISMISS_DAYS * 864e5) return;
    } catch {}

    const source = detectSource();
    if (!source) return;
    const topic = topicFromPath(window.location.pathname);
    const m = buildMessage(source, topic);
    if (m) setMsg({ ...m, source });
  }, []);

  if (!msg) return null;

  const dismiss = () => {
    setMsg(null);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
  };

  const onCta = (e) => {
    // Smooth-scroll for in-page anchors (newsletter lives in the footer).
    if (msg.ctaHref.startsWith("#")) {
      e.preventDefault();
      const el = document.getElementById(msg.ctaHref.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const input = el.querySelector('input[type="email"], input');
        if (input) setTimeout(() => input.focus(), 500);
      }
    }
  };

  return (
    <div className="welcome-bar" role="region" aria-label="Welcome">
      <span className="welcome-bar-inner">
        <span className="welcome-bar-emoji" aria-hidden="true">{msg.emoji}</span>
        <span className="welcome-bar-text">{msg.text}</span>
        <a href={msg.ctaHref} className="welcome-bar-cta" onClick={onCta}>
          {msg.ctaText}
        </a>
      </span>
      <button
        type="button"
        className="welcome-bar-close"
        aria-label="Dismiss welcome message"
        onClick={dismiss}
      >
        ✕
      </button>
    </div>
  );
}
