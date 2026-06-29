export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stores a Web Push subscription in Vercel KV (Upstash Redis REST).
// Env (auto-injected when a KV store is connected to the project):
//   KV_REST_API_URL, KV_REST_API_TOKEN
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

export async function POST(req) {
  try {
    const sub = await req.json();
    if (!sub || !sub.endpoint) return Response.json({ ok: false, error: "bad subscription" }, { status: 400 });
    if (!process.env.KV_REST_API_URL) return Response.json({ ok: false, error: "storage-not-configured" }, { status: 503 });
    const member = Buffer.from(sub.endpoint).toString("base64url");
    await kv(["HSET", "orlaloom_subs", member, JSON.stringify(sub)]);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
