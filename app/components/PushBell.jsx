"use client";
import { useEffect, useState } from "react";

// Public VAPID key — safe to expose. The private key lives only in Vercel env.
const VAPID_PUBLIC = "BMFrRniEPt8xo69_csB0ZZV7r8MtstUAiwDurfjAmkd4ZyXSQjJITTCNFNgdvZqlB5KWkm7nbP1gWX3qxyFkjso";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export default function PushBell() {
  const [state, setState] = useState("hidden"); // hidden, idle, busy, done, denied

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setState("hidden");
      return;
    }
    if (Notification.permission === "denied") { setState("denied"); return; }
    navigator.serviceWorker.getRegistration("/sw-push.js").then((reg) => {
      if (reg) {
        reg.pushManager.getSubscription().then((sub) => setState(sub ? "done" : "idle"));
      } else {
        setState("idle");
      }
    }).catch(() => setState("idle"));
  }, []);

  async function subscribe() {
    setState("busy");
    try {
      const reg = await navigator.serviceWorker.register("/sw-push.js");
      await navigator.serviceWorker.ready;
      const perm = await Notification.requestPermission();
      if (perm !== "granted") { setState(perm === "denied" ? "denied" : "idle"); return; }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
      });
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
      setState("done");
    } catch (e) {
      setState("idle");
    }
  }

  if (state === "hidden") return null;

  const base = {
    display: "inline-flex", alignItems: "center", gap: "8px",
    border: "1px solid var(--line, #e3d8cf)", background: "var(--card, #fffdfb)",
    color: "var(--ink, #4a3a2e)", borderRadius: "999px", padding: "9px 16px",
    font: "inherit", fontSize: "14px", cursor: "pointer", transition: "all .2s",
  };

  if (state === "done")
    return <span style={{ ...base, cursor: "default", color: "#5a7d54", borderColor: "#cfe0c8" }}>🔔 You're subscribed — we'll ping you with new finds</span>;
  if (state === "denied")
    return <span style={{ ...base, cursor: "default", opacity: 0.7 }}>🔕 Notifications are blocked in your browser settings</span>;
  if (state === "busy")
    return <span style={{ ...base, cursor: "wait", opacity: 0.7 }}>… setting up</span>;

  return (
    <button style={base} onClick={subscribe}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent, #b08968)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line, #e3d8cf)")}>
      🔔 Notify me of new cottagecore finds
    </button>
  );
}
