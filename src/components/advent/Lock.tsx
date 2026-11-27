// Placeholder lock graphic: swap for the real lock photo when provided.
export function Lock({ state }: { state: "idle" | "wrong" | "open" }) {
  return (
    <svg viewBox="0 -30 120 180" overflow="visible" className="h-44 w-28 overflow-visible drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)] sm:h-52 sm:w-36"
      style={{ animation: state === "wrong" ? "lock-shudder .4s ease" : undefined }}>
      <defs>
        <linearGradient id="body" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#F1D98A" /><stop offset=".5" stopColor="#C9A24A" /><stop offset="1" stopColor="#8E6B25" />
        </linearGradient>
        <linearGradient id="shk" x1="0" x2="1"><stop offset="0" stopColor="#A9ABB4" /><stop offset=".5" stopColor="#F5F1EB" /><stop offset="1" stopColor="#8A8D99" /></linearGradient>
      </defs>
      <g style={{ transformOrigin: "88px 60px", transformBox: "view-box", animation: state === "open" ? "shackle-open 1s cubic-bezier(.3,.7,.3,1) forwards" : undefined }}>
        <path d="M32 66 V42 a28 28 0 0 1 56 0 V66" fill="none" stroke="url(#shk)" strokeWidth="11" strokeLinecap="round" />
      </g>
      <rect x="14" y="62" width="92" height="80" rx="16" fill="url(#body)" />
      <rect x="20" y="68" width="80" height="68" rx="12" fill="none" stroke="#F5E3A8" strokeOpacity=".5" />
      <circle cx="60" cy="96" r="9" fill="#5A4214" />
      <path d="M56 100 h8 l-2 18 h-4z" fill="#5A4214" />
    </svg>
  );
}
