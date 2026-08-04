import Link from "next/link";

export const metadata = {
  title: "Meet Orla — the Character Behind Orla Loom",
  description:
    "Orla is our illustrated brand muse — not a real person, but the feeling this whole site chases. Meet the character who gives Orla Loom its name and its standard.",
  alternates: { canonical: "/meet-orla" },
};

export default function MeetOrlaPage() {
  const p = { lineHeight: 1.75, color: "var(--ink)", margin: "0 0 14px", maxWidth: "68ch", fontSize: 16.5 };
  const h2 = { fontFamily: "var(--serif)", fontSize: "clamp(19px,2.4vw,24px)", color: "var(--head)", margin: "28px 0 10px" };
  return (
    <div className="container" style={{ paddingTop: 18, paddingBottom: 48 }}>
      <div className="breadcrumb"><Link href="/">Home</Link> &nbsp;/&nbsp; Meet Orla</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "flex-start", marginTop: 10 }}>
        <div style={{ flex: "1 1 300px", maxWidth: 420 }}>
          <img
            src="/orla-portrait.jpg"
            alt="Illustrated oil-painting style portrait of Orla, the Orla Loom brand character, standing in her cottagecore kitchen"
            style={{ width: "100%", borderRadius: 16, boxShadow: "0 4px 18px rgba(74,52,40,.18)" }}
          />
          <p style={{ fontSize: 12.5, color: "var(--muted-2)", marginTop: 8, lineHeight: 1.5 }}>
            Orla, as our illustrator imagines her. She isn&apos;t a real person — but her house is real everywhere.
          </p>
        </div>
        <div style={{ flex: "1 1 340px" }}>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px,3.6vw,38px)", color: "var(--head)", margin: "0 0 14px" }}>
            Meet Orla
          </h1>
          <p style={p}>
            Every family has a house like hers. Maybe it was a grandmother&apos;s, maybe a great-aunt&apos;s, maybe just a
            neighbor whose kitchen you never wanted to leave.
          </p>
          <p style={p}>
            Orla&apos;s house had a butter dish shaped like a mushroom and nobody thought that was strange. It had scalloped
            plates that didn&apos;t match and somehow always matched. Copper pots that were actually used, gingham curtains
            that filtered the morning light into something softer than it had any right to be, and a rug that had survived
            four decades of dogs, spills, and dancing — because things were chosen once, chosen well, and loved forever.
          </p>
          <p style={p}>
            She&apos;s in her late thirties in our imagination — old enough to know that a home isn&apos;t decorated,
            it&apos;s <em>collected</em>; young enough to mix her grandmother&apos;s pressed glass with a washable rug and
            see no contradiction. She&apos;d tell you that the prettiest table setting is the one that makes people stay
            for one more cup of tea. That &quot;too many florals&quot; isn&apos;t a real thing. That you should buy the good
            candlesticks because Tuesday deserves candlelight too.
          </p>
          <h2 style={h2}>The honest part</h2>
          <p style={p}>
            Orla isn&apos;t a real person — she&apos;s an illustrated character, and the feeling this whole site chases. We
            named Orla Loom after her: the loom that weaves old warmth into new homes. When we test a rug, write a guide,
            or argue about whether a toaster is <em>truly</em> cream or secretly beige, the question is always the same:
            <strong> would this survive in Orla&apos;s house?</strong> If the answer is yes, it earns a place here.
          </p>
          <p style={p}>
            The real humans doing the choosing are on our <Link href="/about">About page</Link>, and how we work is spelled
            out in our <Link href="/editorial-policy">editorial policy</Link>. Orla never &quot;tests&quot; or endorses
            products — she just sets the bar.
          </p>
        </div>
      </div>
    </div>
  );
}
