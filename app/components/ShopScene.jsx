"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import SaveButton from "./SaveButton";

const SB_URL = "https://nrvwtckpoaibyjpsdsmw.supabase.co";
const SB_KEY = "sb_publishable_l9NoZ51YgBK9RYWxUtX7MQ_KtsXfv8u";

const css = `
.ss-wrap{max-width:1180px;margin:0 auto;padding:6px 30px 10px}
.ss-stage{position:relative;border-radius:20px;overflow:hidden;box-shadow:0 26px 60px rgba(60,45,35,.30);line-height:0;background:#e7ddcb}
.ss-stage>img{width:100%;display:block}
.ss-spot{position:absolute;transform:translate(-50%,-50%);width:40px;height:40px;border:0;background:none;cursor:pointer;padding:0;z-index:4}
.ss-dot{position:absolute;inset:0;margin:auto;width:16px;height:16px;border-radius:50%;background:rgba(255,255,255,.96);border:2.5px solid var(--terra,#c77a5e);box-shadow:0 2px 10px rgba(0,0,0,.5);transition:transform .16s}
.ss-pulse{position:absolute;inset:0;margin:auto;width:16px;height:16px;border-radius:50%;background:var(--terra,#c77a5e);opacity:.5;animation:sspulse 2.3s infinite}
@keyframes sspulse{0%{transform:scale(1);opacity:.5}70%{transform:scale(2.9);opacity:0}100%{opacity:0}}
.ss-spot:hover .ss-dot,.ss-spot.on .ss-dot{transform:scale(1.35);background:var(--terra,#c77a5e);border-color:#fff}
.ss-card{position:absolute;width:236px;background:var(--cream,#faf4ea);border:1px solid #e7dbc6;border-radius:16px;padding:16px 18px;box-shadow:0 22px 55px rgba(30,20,12,.5);opacity:0;visibility:hidden;transition:opacity .15s;z-index:10;text-align:left;will-change:transform,opacity;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.ss-card .pn,.ss-card .pr,.ss-card .eb{transform:translateZ(0)}
.ss-card.on{opacity:1;visibility:visible}
.ss-card .eb{font-family:var(--sans,inherit);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--terra,#c77a5e);font-weight:700;margin-bottom:7px}
.ss-card .pn{font-family:var(--serif,Georgia,serif);font-size:19px;font-weight:600;color:var(--head,#4a2e25);line-height:1.2;margin:0 0 12px}
.ss-card .rw{display:flex;align-items:center;justify-content:space-between;gap:10px}
.ss-card .pr{font-family:var(--serif,Georgia,serif);font-size:17px;font-weight:600;color:var(--head,#4a2e25)}
.ss-card .sh{font-family:var(--sans,inherit);font-size:12.5px;font-weight:700;text-decoration:none;background:var(--terra,#c77a5e);color:#fff;padding:8px 15px;border-radius:20px;white-space:nowrap}
.ss-hint{position:absolute;left:16px;bottom:14px;background:rgba(52,42,34,.72);color:#fff;font-family:var(--sans,inherit);font-size:12px;padding:6px 13px;border-radius:16px;z-index:5;pointer-events:none}
.ss-stage.editing{cursor:crosshair}.ss-stage.editing .ss-spot{width:30px;height:30px;cursor:grab}
.ss-stage.editing .ss-dot{width:18px;height:18px;background:var(--terra,#c77a5e);border-color:#fff}.ss-stage.editing .ss-pulse{display:none}
.ss-elab{position:absolute;left:50%;top:-9px;transform:translate(-50%,-100%);background:#2c231d;color:#fff;font-family:var(--sans,inherit);font-size:10px;font-weight:700;padding:2px 6px;border-radius:6px;white-space:nowrap;pointer-events:none}
.ss-bar{max-width:1180px;margin:8px auto 0;padding:0 30px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;font-family:var(--sans,inherit);font-size:13px;color:var(--muted-2,#6b574e)}
.ss-bar button,.ss-bar input{font-family:var(--sans,inherit);font-size:12.5px;padding:6px 10px;border-radius:8px;border:1px solid #d8c7b4;background:#fff;cursor:pointer}
.ss-bar input{cursor:text;min-width:110px}
.ss-ed{margin-top:10px}.ss-ed input{display:block;width:100%;margin:5px 0;padding:6px 8px;border:1px solid #e0d3bf;border-radius:8px;font-size:12.5px;font-family:var(--sans,inherit)}
.ss-ed .del{background:#f3dede;border:1px solid #e3b7b7;color:#8a2b2b;border-radius:8px;padding:5px 10px;font-size:12px;cursor:pointer;margin-top:4px}
@media(max-width:820px){.ss-wrap,.ss-bar{padding-left:16px;padding-right:16px}.ss-card{width:min(72vw,220px);padding:13px 14px}.ss-card .pn{font-size:17px}}
.save-btn{position:absolute;top:8px;right:8px;z-index:4;width:34px;height:34px;display:flex;align-items:center;justify-content:center;border:none;border-radius:50%;background:rgba(255,255,255,.92);color:var(--head,#4a2e25);cursor:pointer;box-shadow:0 2px 8px rgba(60,45,35,.18);transition:transform .12s ease,background .15s ease,color .15s ease;padding:0}
.save-btn:hover{transform:scale(1.09);background:#fff}
.save-btn.on{color:var(--terra,#c77a5e)}
.save-btn.on svg path{fill:var(--terra,#c77a5e)}
.ss-card .save-btn.ss-save{position:static;width:32px;height:32px}
`;

export default function ShopScene({ scene, image, title, eyebrow = "Shop the scene", subtitle = "Tap any piece to see it and shop it." }) {
  const [spots, setSpots] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [imgOk, setImgOk] = useState(true);
  const [cur, setCur] = useState(-1);
  const [edit, setEdit] = useState(false);
  const [pass, setPass] = useState("");
  const [status, setStatus] = useState("");
  const stageRef = useRef(null);
  const dragRef = useRef(null);
  const src = image || `/scenes/${scene}.webp`;

  useEffect(() => {
    let on = true;
    fetch(`${SB_URL}/rest/v1/orlaloom_hotspots?scene=eq.${encodeURIComponent(scene)}&order=sort.asc`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => { if (on) { setSpots(Array.isArray(d) ? d : []); setLoaded(true); } })
      .catch(() => { if (on) setLoaded(true); });
    return () => { on = false; };
  }, [scene]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === "e" || e.key === "E") && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || "")) {
        setEdit((v) => {
          const nv = !v;
          if (nv && !pass) { const p = window.prompt("Admin passcode to save edits:"); if (p != null) setPass(p); }
          return nv;
        });
        setCur(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pass]);

  const pct = useCallback((e) => {
    const r = stageRef.current.querySelector("img").getBoundingClientRect();
    return {
      cx: Math.max(0, Math.min(100, Math.round(((e.clientX - r.left) / r.width) * 1000) / 10)),
      cy: Math.max(0, Math.min(100, Math.round(((e.clientY - r.top) / r.height) * 1000) / 10)),
    };
  }, []);

  useEffect(() => {
    const move = (e) => {
      if (dragRef.current == null) return;
      const p = pct(e);
      setSpots((s) => s.map((sp, i) => (i === dragRef.current ? { ...sp, cx: p.cx, cy: p.cy } : sp)));
    };
    const up = () => { dragRef.current = null; };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [pct]);

  async function save() {
    setStatus("Saving…");
    const items = spots.map((s, i) => ({ pkey: s.pkey || "item" + i, eb: s.eb, name: s.name, price: s.price, url: s.url, cx: s.cx, cy: s.cy, sort: i }));
    try {
      const res = await fetch(`${SB_URL}/rest/v1/rpc/save_orlaloom_hotspots`, {
        method: "POST",
        headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ p_scene: scene, p_items: items, p_pass: pass }),
      });
      const txt = (await res.text()).replace(/"/g, "");
      setStatus(txt === "ok" ? "Saved ✓ (live for everyone)" : txt === "unauthorized" ? "Wrong passcode" : "Error");
    } catch { setStatus("Network error"); }
    setTimeout(() => setStatus(""), 3500);
  }

  if (loaded && spots.length === 0 && !edit) return null;
  if (!imgOk && !edit) return null;

  const setField = (i, k, v) => setSpots((s) => s.map((sp, j) => (j === i ? { ...sp, [k]: v } : sp)));

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="ss-wrap">
        {title && (
          <div style={{ textAlign: "center", margin: "6px 0 10px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 14, letterSpacing: ".18em", fontSize: 11, color: "var(--terra,#c77a5e)", fontWeight: 700, textTransform: "uppercase" }}>{eyebrow}</div>
            <h2 style={{ fontFamily: "var(--serif,Georgia,serif)", fontSize: "clamp(24px,3vw,34px)", fontWeight: 500, color: "var(--head,#4a2e25)", margin: "4px 0 4px", letterSpacing: "-.01em" }}>{title}</h2>
            <p style={{ fontFamily: "Lora,Georgia,serif", fontStyle: "italic", color: "var(--muted-2,#6b574e)", margin: 0, fontSize: 14 }}>{subtitle}</p>
          </div>
        )}
        <div className={"ss-stage" + (edit ? " editing" : "")} ref={stageRef} onMouseLeave={() => !edit && setCur(-1)}>
          <img src={src} alt={(title || scene) + " shoppable scene"} loading="lazy" decoding="async" onError={() => setImgOk(false)} />
          {spots.map((s, i) => (
            <button key={i} className={"ss-spot" + (cur === i ? " on" : "")} style={{ left: s.cx + "%", top: s.cy + "%" }}
              onMouseEnter={() => !edit && setCur(i)}
              onPointerDown={(e) => { if (edit) { e.preventDefault(); e.stopPropagation(); if (e.shiftKey) { setSpots((sp) => sp.filter((_, j) => j !== i)); return; } dragRef.current = i; setCur(i); } }}
              onClick={(e) => { if (!edit) { e.stopPropagation(); setCur(i); } }}>
              <span className="ss-pulse" /><span className="ss-dot" />
              {edit && <span className="ss-elab">{s.pkey || s.name || "item"}</span>}
            </button>
          ))}
          <div className={"ss-card" + (cur >= 0 && !edit ? " on" : "")} style={cardPos(spots[cur])}>
            {cur >= 0 && spots[cur] && !edit && (
              <>
                <div className="eb">{spots[cur].eb}</div>
                <div className="pn">{spots[cur].name}</div>
                <div className="rw"><span className="pr">{spots[cur].price}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <SaveButton product={{ name: spots[cur].name, url: spots[cur].url, price: spots[cur].price, brand: spots[cur].eb }} className="ss-save" />
                    <a className="sh" href={spots[cur].url} target="_blank" rel="nofollow sponsored noopener">Shop &rarr;</a>
                  </span></div>
              </>
            )}
          </div>
          {!edit && <div className="ss-hint">✦ Tap a glowing dot to shop it</div>}
        </div>
      </div>
      {edit && (
        <div className="ss-bar">
          <b style={{ color: "var(--head,#4a2e25)" }}>Editing “{scene}”</b>
          <span>drag a dot onto its item · shift-click a dot to delete · click a dot to edit its fields below</span>
          <button onClick={() => setSpots((s) => [...s, { pkey: "item" + s.length, eb: "", name: "New product", price: "", url: "", cx: 50, cy: 50, sort: s.length }])}>+ add dot</button>
          <input type="password" placeholder="admin passcode" value={pass} onChange={(e) => setPass(e.target.value)} />
          <button onClick={save} style={{ background: "var(--terra,#c77a5e)", color: "#fff", borderColor: "var(--terra,#c77a5e)" }}>Save (live)</button>
          <span>{status}</span>
          {cur >= 0 && spots[cur] && (
            <div className="ss-ed" style={{ width: "100%", marginTop: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--terra,#c77a5e)", marginBottom: 2 }}>Editing dot: {spots[cur].pkey || spots[cur].name || "item"}</div>
              <input value={spots[cur].eb || ""} placeholder="Eyebrow (e.g. Washable rugs)" onChange={(e) => setField(cur, "eb", e.target.value)} />
              <input value={spots[cur].name || ""} placeholder="Product name" onChange={(e) => setField(cur, "name", e.target.value)} />
              <input value={spots[cur].price || ""} placeholder="Price (e.g. From $34)" onChange={(e) => setField(cur, "price", e.target.value)} />
              <input value={spots[cur].url || ""} placeholder="Buy/guide URL" onChange={(e) => setField(cur, "url", e.target.value)} />
              <button className="del" onClick={() => { setSpots((sp) => sp.filter((_, j) => j !== cur)); setCur(-1); }}>Delete dot</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function cardPos(s) {
  if (!s) return {};
  const below = s.cy < 42;
  return { left: Math.max(4, Math.min(s.cx, 74)) + "%", top: (below ? s.cy + 7 : s.cy - 7) + "%", transform: below ? "translate(-50%,0)" : "translate(-50%,-100%)" };
}
