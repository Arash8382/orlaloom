import { site } from "../lib/site";

// Explicitly welcome general search engines AND the major AI/LLM crawlers, so
// ChatGPT, Claude, Perplexity, Google AI Overviews, etc. can read and cite us.
const aiBots = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Amazonbot",
  "Meta-ExternalAgent",
];

export default function robots() {
  const base = site.url.replace(/\/$/, "");
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...aiBots.map((ua) => ({ userAgent: ua, allow: "/" })),
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
