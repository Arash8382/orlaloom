"use client";
import { useRef, useState } from "react";
import { track } from "@vercel/analytics";

// Native Orla Loom newsletter signup wired to MailerLite via its JSONP
// embedded-form endpoint (no server, no secret, no CORS). Subscribers land in
// the "Newsletter" group; MailerLite double opt-in sends the confirmation email.
const ML_ACCOUNT = "2479851";
const ML_FORM = "191676388976101009";
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function EmailSignup({ variant = "card", heading, sub }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const hpRef = useRef(null); // honeypot

  function submit(e) {
    e.preventDefault();
    if (hpRef.current && hpRef.current.value) return; // bot trap
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setStatus("error");
      return;
    }
    setStatus("loading");

    const cb = "mlcb_" + Math.random().toString(36).slice(2);
    let settled = false;
    const finish = (ok) => {
      if (settled) return;
      settled = true;
      try { delete window[cb]; } catch (_) {}
      if (script && script.parentNode) script.parentNode.removeChild(script);
      setStatus(ok ? "done" : "error");
      if (ok) {
        setEmail("");
        try { track("newsletter_signup", { path: location.pathname }); } catch (_) {}
      }
    };

    window[cb] = (data) => finish(!data || data.success !== false);

    const guid =
      (window.crypto && window.crypto.randomUUID && window.crypto.randomUUID()) ||
      Date.now() + "-" + Math.random().toString(36).slice(2);
    const params = new URLSearchParams({
      callback: cb,
      "fields[email]": value,
      "ml-submit": "1",
      anticsrf: "true",
      ajax: "1",
      guid,
      _: Date.now().toString(),
    });

    const script = document.createElement("script");
    script.src = `https://assets.mailerlite.com/jsonp/${ML_ACCOUNT}/forms/${ML_FORM}/subscribe?${params.toString()}`;
    script.onerror = () => finish(false);
    document.body.appendChild(script);

    // JSONP can resolve opaquely; assume success if the callback hasn't fired.
    setTimeout(() => finish(true), 4500);
  }

  const isCompact = variant === "compact";
  const title = heading || "Join the Orla Loom letter";
  const subtitle =
    sub || "New cottagecore finds, gentle gift ideas, and quiet home inspiration — a couple of times a month. No spam, unsubscribe anytime.";

  if (status === "done") {
    return (
      <div className={`newsletter newsletter-${variant} is-done`}>
        <div className="nl-check" aria-hidden>✓</div>
        <div>
          <strong>You're on the list 🤍</strong>
          <p>Check your inbox to confirm — your first letter is on its way soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`newsletter newsletter-${variant}`}>
      {!isCompact && <span className="nl-eyebrow">The Orla Loom letter</span>}
      <h3 className="nl-title">{title}</h3>
      <p className="nl-sub">{subtitle}</p>
      <form className="nl-form" onSubmit={submit} noValidate>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
          placeholder="you@example.com"
          aria-label="Your email address"
          required
        />
        {/* honeypot — hidden from humans, catches bots */}
        <input ref={hpRef} type="text" name="b_orlaloom" tabIndex={-1} autoComplete="off" aria-hidden className="nl-hp" />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Joining…" : "Subscribe"}
        </button>
      </form>
      {status === "error" && (
        <p className="nl-error">Please enter a valid email address and try again.</p>
      )}
    </div>
  );
}
