// Minimalist line illustrations (no external assets). Inherit color via currentColor.
const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

export function CategoryArt({ slug }) {
  switch (slug) {
    case "butter-dishes":
      return (
        <svg viewBox="0 0 64 64" className="art-ink" {...{}}>
          <g {...S}>
            <path d="M10 44h44" />
            <path d="M16 44c0-9 7-15 16-15s16 6 16 15" />
            <path d="M32 29v-5" />
            <circle cx="32" cy="21" r="3" />
            <path d="M14 49h36" />
          </g>
        </svg>
      );
    case "cottagecore-kitchen":
      return (
        <svg viewBox="0 0 64 64" className="art-ink">
          <g {...S}>
            <path d="M18 28h28v14a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8V28z" />
            <path d="M46 31h5a4 4 0 0 1 0 8h-5" />
            <path d="M24 22c0-3 2-3 2-6M32 22c0-3 2-3 2-6M40 22c0-3 2-3 2-6" />
          </g>
        </svg>
      );
    case "scalloped-dinnerware":
      return (
        <svg viewBox="0 0 64 64" className="art-ink">
          <g {...S}>
            <path d="M32 12c2.2 0 3.2 2.4 5.3 2.9 2.1.5 4-1 5.7.2 1.7 1.2 1.1 3.4 2.4 4.9 1.3 1.5 3.6 1.3 4.4 3.2.8 1.9-.8 3.6-.6 5.7.2 2.1 2 3.5 1.6 5.6-.4 2-2.6 2.2-3.9 3.8-1.3 1.6-1 3.8-2.9 4.9-1.8 1.1-3.7-.1-5.7.6-2 .7-2.7 2.9-4.8 2.9s-2.8-2.2-4.8-2.9c-2-.7-3.9.5-5.7-.6-1.9-1.1-1.6-3.3-2.9-4.9-1.3-1.6-3.5-1.8-3.9-3.8-.4-2.1 1.4-3.5 1.6-5.6.2-2.1-1.4-3.8-.6-5.7.8-1.9 3.1-1.7 4.4-3.2 1.3-1.5.7-3.7 2.4-4.9 1.7-1.2 3.6.3 5.7-.2 2.1-.5 3.1-2.9 5.3-2.9z" />
            <circle cx="32" cy="33" r="9" />
          </g>
        </svg>
      );
    case "candles":
      return (
        <svg viewBox="0 0 64 64" className="art-ink">
          <g {...S}>
            <rect x="24" y="26" width="16" height="26" rx="2" />
            <path d="M32 26v-4" />
            <path d="M32 22c4-2 4-7 0-10-4 3-4 8 0 10z" />
            <path d="M20 52h24" />
          </g>
        </svg>
      );
    case "glassware":
      return (
        <svg viewBox="0 0 64 64" className="art-ink">
          <g {...S}>
            <path d="M22 16h20l-2 14a8 8 0 0 1-16 0L22 16z" />
            <path d="M32 38v10" />
            <path d="M24 50h16" />
            <path d="M22 22h20" />
          </g>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" className="art-ink">
          <g {...S}><circle cx="32" cy="32" r="16" /></g>
        </svg>
      );
  }
}

export function ValueIcon({ name }) {
  switch (name) {
    case "hand":
      return (<svg viewBox="0 0 24 24" {...S}><path d="M7 11V6a2 2 0 0 1 4 0v5M11 11V4a2 2 0 0 1 4 0v7M15 11V7a2 2 0 0 1 4 0v8a6 6 0 0 1-6 6h-2a6 6 0 0 1-5-2.7L4 14a2 2 0 0 1 3-2.6l1 1" /></svg>);
    case "check":
      return (<svg viewBox="0 0 24 24" {...S}><path d="M20 6 9 17l-5-5" /></svg>);
    case "refresh":
      return (<svg viewBox="0 0 24 24" {...S}><path d="M21 12a9 9 0 1 1-2.6-6.4M21 4v5h-5" /></svg>);
    default:
      return null;
  }
}

export function Arrow() {
  return (<svg viewBox="0 0 24 24" width="14" height="14" style={{ display: "inline-block", verticalAlign: "-2px" }} {...S}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
}
