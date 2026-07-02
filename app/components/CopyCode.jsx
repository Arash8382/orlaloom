"use client";

import { useState } from "react";

export default function CopyCode({ code = "ORLALOOM20" }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="deal-code-box">
      <span className="deal-code">{code}</span>
      <button
        type="button"
        className="deal-copy-btn"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          } catch {}
        }}
      >
        {copied ? "Copied!" : "Copy code"}
      </button>
    </div>
  );
}
