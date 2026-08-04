import { NextResponse } from "next/server";

// Log visits from AI agents/crawlers so we can watch agentic traffic grow.
// Non-blocking insert to Supabase (anon key, insert-only RLS table).
const SUPABASE_URL = "https://nrvwtckpoaibyjpsdsmw.supabase.co";
const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ydnd0Y2twb2FpYnlqcHNkc213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTUwNzAsImV4cCI6MjA5NTQ3MTA3MH0.mqVVvtHJY-uELnPP1s5BFOdn1E3lKwA58Nq2uPED7s8";

const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ChatGPT",
  "ClaudeBot",
  "Claude-Web",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Gemini",
  "Applebot-Extended",
  "Amazonbot",
  "Meta-ExternalAgent",
  "cohere-ai",
  "Bytespider",
  "AI2Bot",
  "Diffbot",
];

export function middleware(request, event) {
  const ua = request.headers.get("user-agent") || "";
  const bot = AI_BOTS.find((b) => ua.toLowerCase().includes(b.toLowerCase()));
  if (bot) {
    const log = fetch(`${SUPABASE_URL}/rest/v1/orlaloom_ai_agent_hits`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        bot,
        ua: ua.slice(0, 300),
        path: request.nextUrl.pathname.slice(0, 300),
      }),
    }).catch(() => {});
    if (event && typeof event.waitUntil === "function") event.waitUntil(log);
  }
  return NextResponse.next();
}

export const config = {
  // Pages + the machine-readable feed; skip static assets and images.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|thumbnails|scenes|images).*)"],
};
