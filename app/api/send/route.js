export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import webpush from "web-push";

const VAPID_PUBLIC = "BMFrRniEPt8xo69_csB0ZZV7r8MtstUAiwDurfjAmkd4ZyXSQjJITTCNFNgdvZqlB5KWkm7nbP1gWX3qxyFkjso";

async function kv(cmd) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const tok = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !tok) return null;
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error("kv " + r.status);
  return r.json();
}

// Sends ONE push per guide, at most once ever (deduped via the Redis set
// `orlaloom_pushed`). Triggered two ways:
//   - daily-guide agent after publishing: /api/send?slug=<exact-new-slug>  (authoritative)
//   - Vercel cron (vercel.json): /api/send  -> picks newest guide dated <= today
export async function GET(req) {
  try {
    if (!process.env.VAPID_PRIVATE || !(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL)) {
      return Response.json({ ok: false, error: "not-configured" }, { status: 503 });
    }
    webpush.setVapidDetails("mailto:arashtadi@gmail.com", VAPID_PUBLIC, process.env.VAPID_PRIVATE);

    const res = await fetch("https://www.orlaloom.com/control-status.json?t=" + Date.now(), { cache: "no-store" });
    const data = await res.json();
    const recent = data.recent || [];
    if (!recent.length) return Response.json({ ok: true, sent: 0, note: "no guides" });

    // Decide which guide to (maybe) announce
    const url = new URL(req.url);
    const wanted = url.searchParams.get("slug");
    let target;
    if (wanted) {
      target = recent.find((g) => g.slug === wanted) || { slug: wanted, title: data.recentTitleBySlug?.[wanted] || "A new cottagecore guide" };
    } else {
      const today = new Date().toISOString().slice(0, 10);
      const eligible = recent.filter((g) => (g.date || "0") <= today);
      target = (eligible[0] || recent[0]);
    }
    if (!target) return Response.json({ ok: true, sent: 0, note: "no target" });

    // Dedup: never announce the same slug twice
    const already = (await kv(["SISMEMBER", "orlaloom_pushed", target.slug]))?.result;
    if (already === 1) return Response.json({ ok: true, sent: 0, note: "already pushed " + target.slug });

    const all = (await kv(["HGETALL", "orlaloom_subs"]))?.result || [];
    const subs = [];
    for (let i = 1; i < all.length; i += 2) { try { subs.push({ member: all[i - 1], sub: JSON.parse(all[i]) }); } catch (e) {} }

    const payload = JSON.stringify({
      title: "New on Orla Loom 🌿",
      body: target.title,
      url: "https://www.orlaloom.com/blog/" + target.slug,
      tag: "guide-" + target.slug,
    });

    let sent = 0, pruned = 0;
    await Promise.all(subs.map(async ({ member, sub }) => {
      try { await webpush.sendNotification(sub, payload); sent++; }
      catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) { await kv(["HDEL", "orlaloom_subs", member]); pruned++; }
      }
    }));

    await kv(["SADD", "orlaloom_pushed", target.slug]);
    return Response.json({ ok: true, sent, pruned, guide: target.slug });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
