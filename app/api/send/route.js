export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import webpush from "web-push";

const VAPID_PUBLIC = "BMFrRniEPt8xo69_csB0ZZV7r8MtstUAiwDurfjAmkd4ZyXSQjJITTCNFNgdvZqlB5KWkm7nbP1gWX3qxyFkjso";

async function kv(cmd) {
  const url = process.env.KV_REST_API_URL, tok = process.env.KV_REST_API_TOKEN;
  if (!url || !tok) return null;
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error("kv " + r.status);
  return r.json();
}

// Triggered daily by Vercel Cron (see vercel.json). Sends ONE push per new guide.
export async function GET() {
  try {
    if (!process.env.VAPID_PRIVATE || !process.env.KV_REST_API_URL) {
      return Response.json({ ok: false, error: "not-configured" }, { status: 503 });
    }
    webpush.setVapidDetails("mailto:arashtadi@gmail.com", VAPID_PUBLIC, process.env.VAPID_PRIVATE);

    // Newest guide from the build-time status feed
    const res = await fetch("https://www.orlaloom.com/control-status.json?t=" + Date.now(), { cache: "no-store" });
    const data = await res.json();
    const newest = (data.recent || [])[0];
    if (!newest) return Response.json({ ok: true, sent: 0, note: "no guides" });

    const last = (await kv(["GET", "orlaloom_last_push"]))?.result;
    if (last === newest.slug) return Response.json({ ok: true, sent: 0, note: "already pushed " + newest.slug });

    const all = (await kv(["HGETALL", "orlaloom_subs"]))?.result || [];
    // HGETALL returns [field1, val1, field2, val2, ...]
    const subs = [];
    for (let i = 1; i < all.length; i += 2) { try { subs.push({ member: all[i - 1], sub: JSON.parse(all[i]) }); } catch (e) {} }

    const payload = JSON.stringify({
      title: "New on Orla Loom 🌿",
      body: newest.title,
      url: "https://www.orlaloom.com/blog/" + newest.slug,
      tag: "guide-" + newest.slug,
    });

    let sent = 0, pruned = 0;
    await Promise.all(subs.map(async ({ member, sub }) => {
      try { await webpush.sendNotification(sub, payload); sent++; }
      catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) { await kv(["HDEL", "orlaloom_subs", member]); pruned++; }
      }
    }));

    await kv(["SET", "orlaloom_last_push", newest.slug]);
    return Response.json({ ok: true, sent, pruned, guide: newest.slug });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
