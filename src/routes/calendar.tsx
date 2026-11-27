import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { StarField } from "@/components/advent/StarField";
import { DOOR_ORDER, GATE_KEY, PREVIEW_KEY, SPECIAL_DAYS, countdown, isUnlocked, nextLockedDay } from "@/lib/advent";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Advent Calendar · A Day Closer to Christmas 2026" },
      { name: "description", content: "Twenty-five little doors, one each morning until Christmas." },
      { property: "og:title", content: "A Day Closer to Christmas 2026" },
      { property: "og:description", content: "Twenty-five little doors, one each morning until Christmas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CalendarPage,
});

function useNow() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function CalendarPage() {
  const navigate = useNavigate();
  const now = useNow();
  const [preview, setPreview] = useState(false);
  const [peek, setPeek] = useState<number | null>(null);
  const [opening, setOpening] = useState<number | null>(null);
  const [shaking, setShaking] = useState<number | null>(null);
  const taps = useRef<number[]>([]);

  useEffect(() => {
    if (sessionStorage.getItem(GATE_KEY) !== "1") navigate({ to: "/" });
    setPreview(localStorage.getItem(PREVIEW_KEY) === "1");
  }, [navigate]);

  // Hidden owner toggle: tap "2026" five times quickly.
  const secretTap = () => {
    const t = Date.now();
    taps.current = [...taps.current.filter((x) => t - x < 2000), t];
    if (taps.current.length >= 5) {
      taps.current = [];
      const next = !preview;
      setPreview(next);
      localStorage.setItem(PREVIEW_KEY, next ? "1" : "0");
    }
  };

  const clickDoor = (day: number) => {
    if (now === null || opening) return;
    if (isUnlocked(day, now, preview)) {
      setOpening(day);
      setTimeout(() => navigate({ to: "/day/$day", params: { day: String(day) } }), 850);
    } else {
      setShaking(day);
      setTimeout(() => { setShaking(null); setPeek(day); }, 450);
    }
  };

  const next = now === null ? null : nextLockedDay(now);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[radial-gradient(ellipse_at_top,var(--wine),var(--wine-deep))]">
      <StarField />
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 pb-16 pt-12 sm:pt-16">
        <header className="animate-rise-in max-w-xl text-center">
          <h1 className="font-display text-4xl font-semibold uppercase leading-none tracking-[0.08em] sm:text-6xl">
            A Day Closer to Christmas <span onClick={secretTap} className="cursor-default select-none text-gold">2026</span>
          </h1>
          <p className="parchment mx-auto mt-6 max-w-lg rotate-[-0.6deg] px-6 py-5 text-left font-ui text-sm italic leading-relaxed text-wine-deep sm:px-8 sm:text-base">
            Even a little Grinch like you, who insists on hating Christmas, deserves a little joy and attention this time of year, if only because you are so terribly adored by me that I simply cannot allow you to miss out on being reminded of it.
          </p>
          {preview && <p className="mt-3 font-ui text-xs uppercase tracking-widest text-gold">Preview mode · all doors open</p>}
        </header>

        <House>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {DOOR_ORDER.map((day) => {
              const open = now !== null && isUnlocked(day, now, preview);
              const special = SPECIAL_DAYS.has(day);
              return (
                <button key={day} onClick={() => clickDoor(day)} aria-label={`December ${day}${open ? "" : ", locked"}`}
                  className={`group relative aspect-[3/4] rounded-t-[40%] rounded-b-md bg-wine-deep ${opening === day ? "door-open" : ""} ${shaking === day ? "animate-shake" : ""}`}>
                  <span className="absolute inset-0 flex items-center justify-center text-2xl">✨</span>
                  <span className={`door-flap absolute inset-0 flex flex-col items-center justify-center rounded-t-[40%] rounded-b-md border shadow-[inset_0_-6px_12px_-6px_rgba(0,0,0,0.25)] transition-transform group-hover:-translate-y-0.5 ${special ? "border-festive bg-snow" : "border-midnight/10 bg-parchment"}`}>
                    <span className={`font-display text-2xl font-semibold leading-none sm:text-4xl ${special ? "text-festive" : "text-wine-deep"}`}>{day}</span>
                    {special && <span className="mt-0.5 text-[10px] text-festive sm:text-xs">{day === 13 ? "♥" : "★"}</span>}
                    {!open && <span className="absolute bottom-1 right-1.5 text-[9px] text-wine-deep/40 sm:text-[11px]">🔒</span>}
                    <span className="absolute right-[12%] top-1/2 h-1.5 w-1.5 rounded-full bg-gold/80" />
                  </span>
                </button>
              );
            })}
          </div>
        </House>

        {next && now !== null && (
          <p className="mt-8 text-center font-ui text-sm text-snow/80">
            Next door opens at 8:00 AM · <Countdown day={next} now={now} inline />
          </p>
        )}
      </div>

      {peek !== null && now !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-wine-deep/70 p-6 backdrop-blur-sm animate-in fade-in" onClick={() => setPeek(null)}>
          <div className="w-full max-w-sm rounded-3xl bg-parchment p-8 text-center text-wine-deep shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <p className="font-ui text-xs uppercase tracking-[0.3em] text-wine-deep/60">Sneak peek</p>
            <h2 className={`mt-2 font-display text-5xl font-semibold uppercase ${SPECIAL_DAYS.has(peek) ? "text-festive" : ""}`}>December {peek}</h2>
            <p className="mt-2 font-ui text-sm text-wine-deep/70">{peek === 13 ? "Something very special is waiting…" : peek === 25 ? "The biggest door of them all." : "No peeking past the door just yet."}</p>
            <div className="mt-6"><Countdown day={peek} now={now} /></div>
            <p className="mt-4 font-ui text-xs text-wine-deep/60">Unlocks at 8:00 AM</p>
            <button onClick={() => setPeek(null)} className="mt-6 rounded-full bg-wine px-6 py-2.5 font-display text-lg uppercase tracking-widest text-snow">Patience</button>
          </div>
        </div>
      )}
    </main>
  );
}

function Countdown({ day, now, inline }: { day: number; now: number; inline?: boolean }) {
  const c = countdown(day, now);
  const parts: [number, string][] = [[c.days, "Days"], [c.hours, "Hours"], [c.minutes, "Min"], [c.seconds, "Sec"]];
  if (inline) return <span className="font-display text-base tracking-wider text-gold">{c.days}d {c.hours}h {c.minutes}m {c.seconds}s</span>;
  return (
    <div className="grid grid-cols-4 gap-2">
      {parts.map(([v, l]) => (
        <div key={l} className="rounded-xl bg-wine py-3 text-snow">
          <div className="font-display text-3xl font-semibold tabular-nums">{String(v).padStart(2, "0")}</div>
          <div className="font-ui text-[10px] uppercase tracking-widest text-snow/70">{l}</div>
        </div>
      ))}
    </div>
  );
}

function House({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-10 w-full max-w-[560px] animate-rise-in" style={{ animationDelay: ".3s" }}>
      {/* Gable */}
      <div className="relative mx-auto w-[62%]">
        {/* Chimney with smoke */}
        <div className="absolute bottom-[38%] right-[14%] z-0 h-[34%] w-[9%] rounded-t-sm bg-wine-deep">
          <div className="absolute -top-1 left-[-15%] h-2 w-[130%] rounded-sm bg-snow" />
          <span className="smoke absolute -top-4 left-1/2 h-3 w-3 rounded-full bg-snow/60" />
          <span className="smoke absolute -top-4 left-1/2 h-4 w-4 rounded-full bg-snow/40" style={{ animationDelay: "1.2s" }} />
          <span className="smoke absolute -top-4 left-1/2 h-2.5 w-2.5 rounded-full bg-snow/50" style={{ animationDelay: "2.4s" }} />
        </div>
        <div className="relative z-10 mx-auto mb-[-6px] w-14 text-center text-3xl text-gold drop-shadow-[0_0_12px_var(--gold)]">★</div>
        <div className="relative z-10 aspect-[2/1] bg-wine [clip-path:polygon(50%_0,100%_70%,100%_100%,0_100%,0_70%)]">
          {/* Roof tiles */}
          <div className="absolute inset-0 opacity-40 [background-image:repeating-linear-gradient(0deg,transparent_0_10px,var(--wine-deep)_10px_12px),repeating-linear-gradient(90deg,transparent_0_16px,var(--wine-deep)_16px_17px)]" />
          {/* Snow cap */}
          <div className="absolute inset-x-0 top-0 h-[22%] bg-snow [clip-path:polygon(50%_0,62%_60%,56%_100%,50%_75%,44%_100%,38%_60%)]" />
          {/* Round window with wreath */}
          <div className="absolute left-1/2 top-[30%] flex h-[42%] aspect-square -translate-x-1/2 items-center justify-center rounded-full border-[5px] border-dotted border-gold/80 bg-parchment shadow-[0_0_20px_var(--gold)]">
            <span className="text-xl sm:text-2xl">🕯️</span>
          </div>
        </div>
        {/* Fairy lights along the eaves */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex justify-between px-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="twinkle-light h-2 w-2 rounded-full" style={{ background: i % 3 === 0 ? "var(--gold)" : i % 3 === 1 ? "var(--festive)" : "var(--snow)", animationDelay: `${i * 0.25}s` }} />
          ))}
        </div>
      </div>
      <div className="relative mx-auto flex h-4 w-[70%] items-center justify-center rounded-sm bg-snow">
        <span className="font-display text-[10px] uppercase tracking-[0.4em] text-wine sm:text-xs">Advent · MMXXVI</span>
      </div>
      {/* Body */}
      <div className="rounded-b-lg rounded-t-sm border-x-4 border-b-4 border-snow bg-parchment p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] sm:p-5">
        {children}
        <div className="mt-3 flex items-end justify-center gap-3 border-t-2 border-wine/20 pt-3">
          <div className="h-8 w-16 rounded-t-full bg-wine/20" />
          <div className="h-12 w-10 rounded-t-md bg-wine" />
          <div className="h-8 w-16 rounded-t-full bg-wine/20" />
        </div>
      </div>
    </div>
  );
}
