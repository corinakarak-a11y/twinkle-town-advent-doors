import { useEffect, useState } from "react";

type Star = { x: number; y: number; s: number; d: number; dur: number; kind: "star" | "dot" };

export function StarField({ count = 70 }: { count?: number }) {
  const [stars, setStars] = useState<Star[]>([]);
  useEffect(() => {
    setStars(Array.from({ length: count }, () => {
      const star = Math.random() > 0.55;
      return { x: Math.random() * 100, y: Math.random() * 100, s: star ? 8 + Math.random() * 14 : 2 + Math.random() * 3, d: Math.random() * 4, dur: 2 + Math.random() * 3, kind: star ? "star" : "dot" };
    }));
  }, [count]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {stars.map((st, i) => (
        <span key={i} className="absolute text-gold" style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s, animation: `twinkle ${st.dur}s ease-in-out ${st.d}s infinite`, filter: "drop-shadow(0 0 6px var(--gold))" }}>
          {st.kind === "star" ? (
            <svg viewBox="0 0 20 20" className="h-full w-full fill-current"><path d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0Z" /></svg>
          ) : (
            <span className="block h-full w-full rounded-full bg-gold" />
          )}
        </span>
      ))}
    </div>
  );
}
