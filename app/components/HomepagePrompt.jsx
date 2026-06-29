"use client";
import { useState } from "react";

const URL = "https://www.orlaloom.com";

export default function HomepagePrompt() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function copy() {
    try {
      navigator.clipboard.writeText(URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  }

  const link = {
    display: "inline-flex", alignItems: "center", gap: "8px",
    border: "1px solid var(--line, #e3d8cf)", background: "var(--card, #fffdfb)",
    color: "var(--ink, #4a3a2e)", borderRadius: "999px", padding: "9px 16px",
    font: "inherit", fontSize: "14px", cursor: "pointer",
  };

  return (
    <>
      <button style={link} onClick={() => setOpen(true)}>🏠 Make Orla Loom your homepage</button>

      {open && (
        <div onClick={() => setOpen(false)} style={{
          position: "fixed", inset: 0, background: "rgba(40,30,22,.45)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: "var(--card, #fffdfb)", color: "var(--ink, #4a3a2e)",
            borderRadius: "18px", maxWidth: "440px", width: "100%", maxHeight: "85vh",
            overflowY: "auto", padding: "26px 26px 22px", boxShadow: "0 24px 60px rgba(40,30,22,.3)",
            font: "inherit", lineHeight: 1.5,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
              <h3 style={{ margin: 0, fontFamily: "Georgia, serif", fontSize: "20px" }}>Make us your homepage 🌿</h3>
              <button onClick={() => setOpen(false)} aria-label="Close" style={{
                border: "none", background: "transparent", fontSize: "22px", cursor: "pointer",
                color: "var(--ink, #4a3a2e)", lineHeight: 1, padding: "0 2px",
              }}>×</button>
            </div>

            <p style={{ fontSize: "14px", color: "var(--muted, #7a6a5c)", marginTop: "6px" }}>
              See our newest cottagecore finds every time you open your browser. Copy the link, then follow the steps for your browser.
            </p>

            <div style={{
              display: "flex", alignItems: "center", gap: "10px", margin: "14px 0 18px",
              border: "1px solid var(--line, #e3d8cf)", borderRadius: "10px", padding: "10px 12px",
              background: "var(--bg, #faf6f1)",
            }}>
              <code style={{ flex: 1, fontSize: "13.5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{URL}</code>
              <button onClick={copy} style={{
                border: "none", background: "var(--accent, #b08968)", color: "#fff",
                borderRadius: "8px", padding: "7px 13px", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap",
              }}>{copied ? "Copied ✓" : "Copy"}</button>
            </div>

            <Section title="🖥️ Chrome (computer)">
              <Step>Click the <b>⋮</b> menu (top-right) → <b>Settings</b></Step>
              <Step>Choose <b>On startup</b> → <b>Open a specific page or set of pages</b></Step>
              <Step>Click <b>Add a new page</b>, paste the link, click <b>Add</b></Step>
              <Step><i>Optional:</i> Settings → <b>Appearance</b> → turn on <b>Show home button</b> and paste the link</Step>
            </Section>

            <Section title="🧭 Safari (Mac)">
              <Step>Menu bar: <b>Safari</b> → <b>Settings</b> (or Preferences)</Step>
              <Step>Open the <b>General</b> tab</Step>
              <Step>In <b>Homepage</b>, paste the link</Step>
              <Step>Set <b>New windows open with</b> and <b>New tabs open with</b> → <b>Homepage</b></Step>
            </Section>

            <Section title="📱 On your phone">
              <Step><b>iPhone (Safari):</b> tap <b>Share</b> → <b>Add to Home Screen</b></Step>
              <Step><b>Android (Chrome):</b> tap <b>⋮</b> → <b>Add to Home screen</b></Step>
              <Step style={{ color: "var(--muted, #7a6a5c)" }}>Phones don't have a "homepage," but this puts an Orla Loom icon right on your screen.</Step>
            </Section>

            <p style={{ fontSize: "12px", color: "var(--muted, #7a6a5c)", marginTop: "16px", marginBottom: 0 }}>
              Browsers don't let websites change this for you (a good safety rule!) — these quick steps do it in seconds.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "7px" }}>{title}</div>
      <ol style={{ margin: 0, paddingLeft: "20px", fontSize: "13.5px", display: "grid", gap: "5px" }}>{children}</ol>
    </div>
  );
}
function Step({ children, style }) {
  return <li style={style}>{children}</li>;
}
