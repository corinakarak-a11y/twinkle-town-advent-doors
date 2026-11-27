import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SONGS, songHue, type Song } from "@/lib/songs";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const FAKE_LENGTH = 180; // used while a song has no audio file yet

function Cover({ song, index, className = "" }: { song: Song; index: number; className?: string }) {
  const hue = songHue(index);
  if (song.cover) return <img src={song.cover} alt={`${song.title} cover`} draggable={false} className={`h-full w-full object-cover ${className}`} />;
  return (
    <div className={`flex h-full w-full flex-col justify-between p-3 text-left ${className}`}
      style={{ background: `linear-gradient(145deg, oklch(0.55 0.14 ${hue}), oklch(0.25 0.08 ${(hue + 40) % 360}))` }}>
      <span className="font-ui text-[10px] uppercase tracking-[0.3em] text-snow/60">No. {index + 1}</span>
      <span className="font-display text-xl font-semibold uppercase leading-none text-snow/90">{song.title}</span>
    </div>
  );
}

export function SongsGift() {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [length, setLength] = useState(FAKE_LENGTH);
  const [lyrics, setLyrics] = useState(false);
  const [drag, setDrag] = useState<{ x: number; y: number; dx: number; dy: number } | null>(null);
  const [overPlayer, setOverPlayer] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const start = useRef({ x: 0, y: 0 });
  const lastTap = useRef(0);

  const go = useCallback((d: number) => setCurrent((c) => (c + d + SONGS.length) % SONGS.length), []);
  const song = SONGS[current]!;
  const loadedSong = loaded !== null ? SONGS[loaded] : undefined;
  const bgHue = songHue(loaded !== null && drag === null ? current : current);

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [go]);

  const load = (i: number) => {
    audioRef.current?.pause();
    setPlaying(false); setTime(0); setLoading(true); setLoaded(i);
    setLength(FAKE_LENGTH);
    setTimeout(() => setLoading(false), 1100);
  };

  // Fake progress for songs with no audio file yet
  useEffect(() => {
    if (!playing || loadedSong?.audio) return;
    const t = setInterval(() => setTime((s) => { if (s + 1 >= FAKE_LENGTH) { setPlaying(false); return 0; } return s + 1; }), 1000);
    return () => clearInterval(t);
  }, [playing, loadedSong]);

  const toggle = () => {
    if (loaded === null || loading) return;
    const a = audioRef.current;
    if (loadedSong?.audio && a) { if (playing) a.pause(); else void a.play(); }
    setPlaying((p) => !p);
  };
  const seek = (v: number) => { setTime(v); if (audioRef.current && loadedSong?.audio) audioRef.current.currentTime = v; };
  const skip = (d: number) => { if (loaded === null) return; const n = (loaded + d + SONGS.length) % SONGS.length; setCurrent(n); load(n); };

  const isOver = (x: number, y: number) => {
    const r = playerRef.current?.getBoundingClientRect();
    return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };
  const onDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: e.clientX, y: e.clientY, dx: 0, dy: 0 });
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag) return;
    setDrag({ x: e.clientX, y: e.clientY, dx: e.clientX - start.current.x, dy: e.clientY - start.current.y });
    setOverPlayer(isOver(e.clientX, e.clientY));
  };
  const onUp = (e: React.PointerEvent) => {
    if (!drag) return;
    const { dx, dy } = drag;
    const tap = Math.hypot(dx, dy) < 8;
    if (tap && Date.now() - lastTap.current < 350) { lastTap.current = 0; load(current); }
    else if (tap) lastTap.current = Date.now();
    else if (isOver(e.clientX, e.clientY)) load(current);
    else if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    setDrag(null); setOverPlayer(false);
  };
  const lifted = drag && Math.hypot(drag.dx, drag.dy) > 12 && Math.abs(drag.dy) > Math.abs(drag.dx) * 0.6;

  return (
    <main className="relative min-h-dvh overflow-hidden text-snow">
      {/* Background follows the selected song */}
      <div className="absolute inset-0 transition-[background-color] duration-1000" style={{ backgroundColor: `oklch(0.34 0.09 ${bgHue})` }} />
      {song.cover && <img src={song.cover} alt="" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-50 blur-3xl transition-opacity duration-1000" />}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,transparent,var(--wine-deep))] opacity-40" />
      <div className="grain" /><div className="vignette" />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col px-5 pb-40 pt-10 lg:pb-10">
        <header className="text-center">
          <Link to="/calendar" className="font-ui text-xs uppercase tracking-[0.35em] text-snow/60 hover:text-snow">← December 1</Link>
          <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.9] tracking-wide sm:text-7xl">Songs that remind me of you</h1>
          <p className="mx-auto mt-4 max-w-xl font-ui text-sm leading-relaxed text-snow/75 sm:text-base">
            It is difficult not to find details of you in every song I listen to, so these are just some of the ones I could pick up.
          </p>
        </header>

        <div className="mt-8 flex flex-1 flex-col items-center gap-8 lg:flex-row lg:items-center">
          {/* Library */}
          <section className="flex w-full flex-1 flex-col items-center" aria-label="Song library">
            <div className="relative h-64 w-full select-none sm:h-80" style={{ perspective: "1100px" }}
              onWheel={(e) => { if (Math.abs(e.deltaX) + Math.abs(e.deltaY) > 25) go((e.deltaX || e.deltaY) > 0 ? 1 : -1); }}>
              {SONGS.map((s, i) => {
                const N = SONGS.length;
                const o = ((i - current + N + N / 2) % N) - N / 2;
                if (Math.abs(o) > 4) return null;
                const center = o === 0;
                const dragging = center && drag;
                const tx = dragging ? drag.dx : o * 58 + Math.sign(o) * 70;
                const ty = dragging ? drag.dy : Math.abs(o) * 6;
                return (
                  <button key={i} type="button" aria-label={`${s.title} by ${s.artist}`}
                    onClick={() => !center && setCurrent(i)}
                    onPointerDown={center ? onDown : undefined} onPointerMove={center ? onMove : undefined}
                    onPointerUp={center ? onUp : undefined} onPointerCancel={() => setDrag(null)}
                    className={`absolute left-1/2 top-1/2 aspect-square w-48 touch-none overflow-hidden rounded-lg shadow-[0_30px_60px_-20px_oklch(0_0_0/.7)] ring-1 ring-snow/15 sm:w-60 ${center ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"} ${dragging ? "" : "transition-[transform,opacity,filter] duration-700 [transition-timing-function:cubic-bezier(.2,.8,.2,1)]"}`}
                    style={{
                      transform: `translate(-50%,-50%) translate3d(${tx}%, ${ty}%, ${center ? (lifted ? 80 : 0) : -Math.abs(o) * 120}px) rotateY(${center ? 0 : o > 0 ? -48 : 48}deg) rotateZ(${dragging ? drag.dx / 25 : o * 4}deg) scale(${lifted ? (overPlayer ? 0.6 : 0.85) : 1})`,
                      zIndex: 50 - Math.abs(o), opacity: Math.abs(o) > 3 ? 0 : 1,
                      filter: center ? "none" : `brightness(${1 - Math.abs(o) * 0.15})`,
                    }}>
                    <Cover song={s} index={i} />
                  </button>
                );
              })}
            </div>
            <div key={current} className="mt-4 text-center animate-rise-in [animation-duration:.6s]">
              <p className="font-display text-3xl font-semibold uppercase leading-none">{song.title}</p>
              <p className="mt-1 font-ui text-sm text-snow/70">{song.artist}</p>
            </div>
            <div className="mt-4 flex items-center gap-4 font-ui text-sm">
              <button onClick={() => go(-1)} className="rounded-full bg-snow/10 px-4 py-2 backdrop-blur hover:bg-snow/20 disabled:opacity-30" aria-label="Previous song">←</button>
              <span className="tabular-nums text-snow/60">{current + 1} / {SONGS.length}</span>
              <button onClick={() => go(1)} className="rounded-full bg-snow/10 px-4 py-2 backdrop-blur hover:bg-snow/20 disabled:opacity-30" aria-label="Next song">→</button>
            </div>
            <p className="mt-3 font-ui text-xs uppercase tracking-[0.25em] text-snow/55">
              Drag the cover onto the player — or double tap it
            </p>
          </section>

          {/* Player: side on desktop, bottom on phone */}
          <aside ref={playerRef}
            className={`fixed inset-x-3 bottom-3 z-40 rounded-3xl border bg-wine-deep/40 p-4 backdrop-blur-xl transition lg:static lg:w-80 lg:p-6 ${overPlayer ? "scale-[1.03] border-gold shadow-[0_0_40px_-5px_var(--gold)]" : "border-snow/15"}`}>
            {loadedSong?.audio && (
              <audio ref={audioRef} src={loadedSong.audio} key={loadedSong.audio}
                onLoadedMetadata={(e) => setLength(e.currentTarget.duration || FAKE_LENGTH)}
                onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)} onEnded={() => setPlaying(false)} />
            )}
            <div className="flex items-center gap-4 lg:flex-col">
              <div className="relative h-16 w-16 shrink-0 lg:h-56 lg:w-56">
                <div className={`vinyl absolute inset-0 rounded-full ${playing ? "vinyl-spin" : ""} ${loading ? "vinyl-drop" : ""}`} key={loaded ?? "empty"}>
                  {loaded !== null && loadedSong && (
                    <div className="absolute inset-[30%] overflow-hidden rounded-full ring-2 ring-wine-deep"><Cover song={loadedSong} index={loaded} /></div>
                  )}
                </div>
                {loaded === null && <p className="absolute inset-0 hidden items-center justify-center text-center font-ui text-xs uppercase tracking-widest text-snow/50 lg:flex">Drop a cover here</p>}
              </div>
              <div className="min-w-0 flex-1 lg:w-full lg:text-center">
                <p className="truncate font-display text-xl font-semibold uppercase">{loading ? "Loading…" : loadedSong?.title ?? "Nothing playing"}</p>
                <p className="truncate font-ui text-xs text-snow/60">{loadedSong ? loadedSong.artist + (loadedSong.audio ? "" : " · music coming soon") : "Drag a cover onto the player"}</p>
              </div>
            </div>

            <div className="mt-3 lg:mt-5">
              <input type="range" min={0} max={length} step={1} value={time} disabled={loaded === null || loading}
                onChange={(e) => seek(Number(e.target.value))} aria-label="Song position" className="w-full accent-gold" />
              <div className="flex justify-between font-ui text-[11px] tabular-nums text-snow/55"><span>{fmt(time)}</span><span>{fmt(length)}</span></div>
            </div>
            <div className="mt-2 flex items-center justify-center gap-3">
              <button onClick={() => skip(-1)} className="rounded-full p-2 text-xl hover:bg-snow/10" aria-label="Previous track">⏮</button>
              <button onClick={toggle} disabled={loaded === null || loading} aria-label={playing ? "Pause" : "Play"}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-snow text-xl text-wine-deep transition hover:scale-105 disabled:opacity-40">
                {playing ? "❚❚" : "▶"}
              </button>
              <button onClick={() => skip(1)} className="rounded-full p-2 text-xl hover:bg-snow/10" aria-label="Next track">⏭</button>
              <button onClick={() => setLyrics((l) => !l)} className={`ml-2 rounded-full px-3 py-1.5 font-ui text-xs uppercase tracking-widest ${lyrics ? "bg-snow/25" : "bg-snow/10 hover:bg-snow/20"}`}>Lyrics</button>
            </div>
            {lyrics && (
              <div className="mt-3 max-h-40 overflow-y-auto rounded-xl bg-wine-deep/40 p-3 font-ui text-sm leading-relaxed text-snow/80 whitespace-pre-line">
                {loadedSong?.lyrics ?? (loadedSong ? "Lyrics coming soon." : "Load a song to see its lyrics.")}
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
