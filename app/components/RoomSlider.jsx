"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { roomProducts, rooms as bakedRooms } from "./roomData";

const SB_URL = "https://nrvwtckpoaibyjpsdsmw.supabase.co";
const SB_KEY = "sb_publishable_l9NoZ51YgBK9RYWxUtX7MQ_KtsXfv8u";

const css = `
.rs-wrap{max-width:1180px;margin:0 auto;padding:4px 30px 8px}
.rs-pillswrap{position:relative;margin:0 0 16px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent);mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent)}
.rs-pills{display:flex;gap:7px;overflow-x:auto;padding:4px 6px;width:max-content;max-width:100%;margin:0 auto;scrollbar-width:none}
.rs-pills::-webkit-scrollbar{display:none}
.rs-pill{flex:0 0 auto;font-family:var(--sans,inherit);font-size:13px;font-weight:600;padding:8px 14px;border-radius:22px;border:1px solid var(--line,#e7dbc6);background:#fff;color:var(--muted-2,#6b574e);cursor:pointer;white-space:nowrap;transition:background .15s,color .15s,border-color .15s}
.rs-pill.on{background:var(--terra,#c07a54);border-color:var(--terra,#c07a54);color:#fff}
.rs-stage{position:relative;border-radius:20px;overflow:hidden;box-shadow:0 26px 60px rgba(60,45,35,.30);background:#e7ddcb;aspect-ratio:1200/669;touch-action:pan-y}
.rs-stage.editing{cursor:crosshair}
.rs-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .5s ease}
.rs-img.on{opacity:1}
.rs-spot{position:absolute;transform:translate(-50%,-50%);width:40px;height:40px;border:0;background:none;cursor:pointer;padding:0;z-index:4}
.rs-stage.editing .rs-spot{width:30px;height:30px;cursor:grab}
.rs-dot{position:absolute;inset:0;margin:auto;width:16px;height:16px;border-radius:50%;background:rgba(255,255,255,.96);border:2.5px solid var(--terra,#c07a54);box-shadow:0 2px 10px rgba(0,0,0,.5);transition:transform .16s}
.rs-stage.editing .rs-dot{width:18px;height:18px;background:var(--terra,#c07a54);border-color:#fff}
.rs-pulse{position:absolute;inset:0;margin:auto;width:16px;height:16px;border-radius:50%;background:var(--terra,#c07a54);opacity:.5;animation:rspulse 2.3s infinite}
.rs-stage.editing .rs-pulse{display:none}
@keyframes rspulse{0%{transform:scale(1);opacity:.5}70%{transform:scale(2.9);opacity:0}100%{opacity:0}}
.rs-spot:hover .rs-dot,.rs-spot.on .rs-dot{transform:scale(1.35);background:var(--terra,#c07a54);border-color:#fff}
.rs-elab{position:absolute;left:50%;top:-9px;transform:translate(-50%,-100%);background:#2c231d;color:#fff;font-family:var(--sans,inherit);font-size:10px;font-weight:700;padding:2px 6px;border-radius:6px;white-space:nowrap;pointer-events:none}
.rs-card{position:absolute;width:244px;background:var(--cream,#faf4ea);border:1px solid #e7dbc6;border-radius:16px;padding:16px 18px;box-shadow:0 22px 55px rgba(30,20,12,.5);opacity:0;visibility:hidden;transition:opacity .15s;z-index:10;text-align:left}
.rs-card.on{opacity:1;visibility:visible}
.rs-card .eb{font-family:var(--sans,inherit);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--terra,#c07a54);font-weight:700;margin-bottom:7px}
.rs-card .pn{font-family:var(--serif,Georgia,serif);font-size:19px;font-weight:600;color:var(--head,#4a2e25);line-height:1.2;margin:0 0 6px}
.rs-card .bl{font-family:var(--sans,inherit);font-size:12.5px;color:var(--muted-2,#6b574e);line-height:1.45;margin:0 0 12px}
.rs-card .rw{display:flex;align-items:center;justify-content:space-between;gap:10px}
.rs-card .pr{font-family:var(--serif,Georgia,serif);font-size:17px;font-weight:600;color:var(--head,#4a2e25)}
.rs-card .sh{font-family:var(--sans,inherit);font-size:12.5px;font-weight:700;text-decoration:none;background:var(--terra,#c07a54);color:#fff;padding:8px 15px;border-radius:20px;white-space:nowrap}
.rs-arrow{position:absolute;top:50%;transform:translateY(-50%);width:42px;height:42px;border-radius:50%;border:0;background:rgba(255,255,255,.9);color:var(--head,#4a2e25);font-family:Georgia,serif;font-size:24px;line-height:1;cursor:pointer;z-index:6;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,.22);transition:background .15s}
.rs-arrow:hover{background:#fff}
.rs-prev{left:14px}.rs-next{right:14px}
.rs-hint{position:absolute;left:16px;bottom:14px;background:rgba(52,42,34,.72);color:#fff;font-family:var(--sans,inherit);font-size:12px;padding:6px 13px;border-radius:16px;z-index:5;pointer-events:none}
.rs-count{position:absolute;right:16px;bottom:14px;background:rgba(52,42,34,.72);color:#fff;font-family:var(--sans,inherit);font-size:12px;padding:6px 12px;border-radius:16px;z-index:5;pointer-events:none}
.rs-bar{max-width:1180px;margin:10px auto 0;padding:0 30px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;font-family:var(--sans,inherit);font-size:13px;color:var(--muted-2,#6b574e)}
.rs-bar b{color:var(--head,#4a2e25)}
.rs-bar button,.rs-bar input,.rs-bar select{font-family:var(--sans,inherit);font-size:12.5px;padding:6px 10px;border-radius:8px;border:1px solid #d8c7b4;background:#fff;cursor:pointer}
.rs-bar input{cursor:text;min-width:120px}
@media(max-width:820px){.rs-wrap{padding-left:16px;padding-right:16px}.rs-card{width:min(72vw,220px);padding:13px 14px}.rs-card .pn{font-size:17px}.rs-arrow{width:36px;height:36px;font-size:20px}}
`;

function cardPos(s) {
  if (!s) return {};
  const below = s.cy < 42;
  return { left: Math.max(5, Math.min(s.cx, 72)) + "%", top: (below ? s.cy + 7 : s.cy - 7) + "%", transform: below ? "translate(-50%,0)" : "translate(-50%,-100%)" };
}

const bakedByRoom = () => {
  const m = {};
  for (const r of bakedRooms) m[r.key] = r.spots.map((s) => ({ pkey: s.pkey || s.k, cx: s.cx, cy: s.cy }));
  return m;
};

export default function RoomSlider() {
  const [idx, setIdx] = useState(0);
  const [cur, setCur] = useState(-1);
  const [byRoom, setByRoom] = useState(bakedByRoom);
  const [edit, setEdit] = useState(false);
  const [pass, setPass] = useState("");
  const [status, setStatus] = useState("");
  const [addKey, setAddKey] = useState(Object.keys(roomProducts)[0]);
  const touch = useRef(null);
  const stageRef = useRef(null);
  const dragRef = useRef(null);

  const room = bakedRooms[idx];
  const key = room.key;
  const spots = byRoom[key] || [];

  // Pull any admin-saved room dots from Supabase (falls back to baked).
  useEffect(() => {
    let on = true;
    fetch(`${SB_URL}/rest/v1/orlaloom_hotspots?scene=like.home-room-*&order=sort.asc`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((rows) => {
        if (!on || !Array.isArray(rows) || rows.length === 0) return;
        const grouped = {};
        for (const row of rows) {
          const k = String(row.scene).replace("home-room-", "");
          (grouped[k] = grouped[k] || []).push({ pkey: row.pkey, cx: row.cx, cy: row.cy });
        }
        setByRoom((prev) => ({ ...prev, ...grouped }));
      })
      .catch(() => {});
    return () => { on = false; };
  }, []);

  const go = (n) => { setIdx((i) => (i + n + bakedRooms.length) % bakedRooms.length); setCur(-1); };
  const pick = (i) => { setIdx(i); setCur(-1); };

  useEffect(() => {
    const onKey = (e) => {
      const tag = (document.activeElement || {}).tagName || "";
      if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "e" || e.key === "E") {
        setEdit((v) => !v);
        setCur(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pass]);

  const pct = useCallback((e) => {
    const r = stageRef.current.getBoundingClientRect();
    return {
      cx: Math.max(0, Math.min(100, Math.round(((e.clientX - r.left) / r.width) * 1000) / 10)),
      cy: Math.max(0, Math.min(100, Math.round(((e.clientY - r.top) / r.height) * 1000) / 10)),
    };
  }, []);

  useEffect(() => {
    const move = (e) => {
      if (dragRef.current == null) return;
      const p = pct(e);
      setByRoom((prev) => ({ ...prev, [key]: prev[key].map((sp, i) => (i === dragRef.current ? { ...sp, cx: p.cx, cy: p.cy } : sp)) }));
    };
    const up = () => { dragRef.current = null; };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [pct, key]);

  const onTouchStart = (e) => { if (!edit) touch.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (edit || touch.current == null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
    touch.current = null;
  };

  async function save() {
    setStatus("Saving…");
    const items = (byRoom[key] || []).map((s, i) => {
      const p = roomProducts[s.pkey] || {};
      return { pkey: s.pkey, eb: p.eb, name: p.prod, price: p.price, url: p.url, cx: s.cx, cy: s.cy, sort: i };
    });
    try {
      const res = await fetch(`${SB_URL}/rest/v1/rpc/save_orlaloom_hotspots`, {
        method: "POST",
        headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ p_scene: `home-room-${key}`, p_items: items, p_pass: pass }),
      });
      const txt = (await res.text()).replace(/"/g, "");
      setStatus(txt === "ok" ? "Saved ✓ (live for everyone)" : txt === "unauthorized" ? "Wrong passcode" : "Error");
    } catch { setStatus("Network error"); }
    setTimeout(() => setStatus(""), 3500);
  }

  const active = spots[cur] && roomProducts[spots[cur].pkey];

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="rs-wrap">
        <div className="rs-pillswrap">
          <div className="rs-pills">
            {bakedRooms.map((r, i) => (
              <button key={r.key} className={"rs-pill" + (i === idx ? " on" : "")} onClick={() => pick(i)}>{r.label}</button>
            ))}
          </div>
        </div>

        <div className={"rs-stage" + (edit ? " editing" : "")} ref={stageRef}
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onMouseLeave={() => !edit && setCur(-1)}>
          {bakedRooms.map((r, i) => (
            <img key={r.key} className={"rs-img" + (i === idx ? " on" : "")} src={`/rooms/${r.key}.webp`}
              alt={`${r.label} cottagecore room — tap a piece to shop it`} loading={i === 0 ? "eager" : "lazy"} draggable="false" />
          ))}

          {spots.map((s, i) => {
            const p = roomProducts[s.pkey];
            if (!p && !edit) return null;
            return (
              <button key={s.pkey + i} className={"rs-spot" + (cur === i ? " on" : "")} style={{ left: s.cx + "%", top: s.cy + "%" }}
                onMouseEnter={() => !edit && setCur(i)}
                onPointerDown={(e) => { if (edit) { e.preventDefault(); e.stopPropagation(); if (e.shiftKey) { setByRoom((prev) => ({ ...prev, [key]: prev[key].filter((_, j) => j !== i) })); return; } dragRef.current = i; setCur(i); } }}
                onClick={(e) => { if (!edit) { e.stopPropagation(); setCur(i); } }} aria-label={p ? p.prod : s.pkey}>
                <span className="rs-pulse" /><span className="rs-dot" />
                {edit && <span className="rs-elab">{s.pkey}</span>}
              </button>
            );
          })}

          <div className={"rs-card" + (cur >= 0 && !edit ? " on" : "")} style={cardPos(spots[cur])}>
            {active && !edit && (
              <>
                <div className="eb">{roomProducts[spots[cur].pkey].eb}</div>
                <div className="pn">{roomProducts[spots[cur].pkey].prod}</div>
                <p className="bl">{roomProducts[spots[cur].pkey].blurb}</p>
                <div className="rw">
                  <span className="pr">{roomProducts[spots[cur].pkey].price}</span>
                  <a className="sh" href={roomProducts[spots[cur].pkey].url}>Shop &rarr;</a>
                </div>
              </>
            )}
          </div>

          <button className="rs-arrow rs-prev" onClick={() => go(-1)} aria-label="Previous style">&lsaquo;</button>
          <button className="rs-arrow rs-next" onClick={() => go(1)} aria-label="Next style">&rsaquo;</button>
          {!edit && <div className="rs-hint">✦ Tap a glowing dot to shop it</div>}
          <div className="rs-count">{idx + 1} / {bakedRooms.length} · {room.label}</div>
        </div>
      </div>

      {edit && (
        <div className="rs-bar">
          <b>Editing “{room.label}”</b>
          <span>drag dots onto items · shift-click a dot to delete</span>
          <select value={addKey} onChange={(e) => setAddKey(e.target.value)}>
            {Object.entries(roomProducts).map(([k, p]) => <option key={k} value={k}>{p.prod}</option>)}
          </select>
          <button onClick={() => setByRoom((prev) => ({ ...prev, [key]: [...(prev[key] || []), { pkey: addKey, cx: 50, cy: 50 }] }))}>+ add dot</button>
          <input type="password" placeholder="admin passcode" value={pass} onChange={(e) => setPass(e.target.value)} />
          <button onClick={save} style={{ background: "var(--terra,#c07a54)", color: "#fff", borderColor: "var(--terra,#c07a54)" }}>Save this room (live)</button>
          <span>{status}</span>
        </div>
      )}
    </div>
  );
}
