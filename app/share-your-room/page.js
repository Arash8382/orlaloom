import Link from "next/link";
import { site } from "../../lib/site";

export const metadata = {
  title: "Share Your Room — Reader Rooms at Orla Loom",
  description:
    "Show us your cottagecore corner. Submit photos of products from our guides in your real home — honest owner reports welcome, flattering light optional.",
  alternates: { canonical: "/share-your-room" },
};

export default function ShareYourRoomPage() {
  const h2 = { fontFamily: "var(--serif)", fontSize: "clamp(19px,2.4vw,24px)", color: "var(--head)", margin: "26px 0 8px" };
  const p = { lineHeight: 1.7, color: "var(--ink)", margin: "0 0 12px", maxWidth: "72ch" };
  const mail = `mailto:hello@orlaloom.com?subject=${encodeURIComponent("Reader Room submission")}&body=${encodeURIComponent(
    "Name (or how to credit you):\nWhat's in the photo (products/brands):\nHow long you've owned it:\nOne honest note — what you'd tell a friend before buying:\n\n(Attach 1–5 photos. By submitting you confirm the photos are yours and we may publish them with credit.)"
  )}`;
  return (
    <div className="container" style={{ paddingTop: 18, paddingBottom: 48 }}>
      <div className="breadcrumb"><Link href="/">Home</Link> &nbsp;/&nbsp; Share Your Room</div>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px,3.6vw,38px)", color: "var(--head)", margin: "10px 0 6px" }}>
        Reader Rooms: Show Us Your Cozy Corner
      </h1>
      <p style={p}>
        The prettiest proof a product works isn&apos;t a studio photo — it&apos;s your living room. If you own something we&apos;ve
        featured (or something we should have), we&apos;d love to see it in the wild: real light, real clutter, real life.
        Selected rooms are featured on the site and our Instagram, always with credit.
      </p>
      <h2 style={h2}>What to send</h2>
      <p style={p}>
        One to five photos, where the product actually lives. Tell us what&apos;s in the shot, how long you&apos;ve owned it,
        and one honest note — the thing you&apos;d tell a friend before they buy. Wobbles, fading, and "it&apos;s thinner than
        the photos" reports are exactly as welcome as love letters; owner honesty is the whole point.
      </p>
      <h2 style={h2}>How we label it</h2>
      <p style={p}>
        Published submissions are labeled "Reader-submitted room" or "Owner report" with your credit. We never edit your
        opinion, only trim for length. We don&apos;t label anyone a verified buyer unless they include a receipt.
      </p>
      <p style={{ margin: "20px 0" }}>
        <a href={mail} className="btn" style={{ display: "inline-block", background: "var(--terra, #c4704f)", color: "#fff", padding: "12px 22px", borderRadius: 99, fontWeight: 600 }}>
          Submit your room →
        </a>
      </p>
      <p style={{ ...p, fontSize: 14, color: "var(--muted-2)" }}>
        Or DM photos to <a href="https://www.instagram.com/orlaloom/" target="_blank" rel="noopener noreferrer">@orlaloom on Instagram</a>.
        By submitting you confirm the photos are yours and grant us permission to publish them with credit. Full details in
        our <Link href="/editorial-policy">editorial policy</Link>.
      </p>
    </div>
  );
}
