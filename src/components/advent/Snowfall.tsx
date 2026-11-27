import { useEffect, useRef } from "react";

type Flake = { x: number; y: number; r: number; vy: number; phase: number; sway: number; rot: number; vr: number; shape: boolean; a: number };

export function Snowfall({ count = 140 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let w = 0, h = 0, raf = 0, t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const n = w < 640 ? Math.round(count * 0.6) : count;
    const make = (top: boolean): Flake => {
      const depth = Math.random();
      const shape = depth > 0.72;
      return {
        x: Math.random() * w, y: top ? -20 : Math.random() * h,
        r: shape ? 4 + depth * 6 : 0.8 + depth * 2.4,
        vy: 0.25 + depth * 1.1, phase: Math.random() * Math.PI * 2,
        sway: 0.3 + Math.random() * 1.2, rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.02,
        shape, a: 0.35 + depth * 0.6,
      };
    };
    const flakes = Array.from({ length: n }, () => make(false));
    const drawFlake = (f: Flake) => {
      ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.rot);
      ctx.strokeStyle = `rgba(245,241,235,${f.a})`; ctx.lineWidth = Math.max(0.8, f.r / 6); ctx.lineCap = "round";
      for (let i = 0; i < 6; i++) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -f.r);
        ctx.moveTo(0, -f.r * 0.55); ctx.lineTo(f.r * 0.28, -f.r * 0.8);
        ctx.moveTo(0, -f.r * 0.55); ctx.lineTo(-f.r * 0.28, -f.r * 0.8);
        ctx.stroke();
      }
      ctx.restore();
    };
    const loop = () => {
      t += 0.01;
      ctx.clearRect(0, 0, w, h);
      const wind = Math.sin(t * 0.4) * 0.6 + Math.sin(t * 1.3) * 0.25;
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i]!;
        f.phase += 0.01 + f.sway * 0.006;
        f.x += Math.sin(f.phase) * f.sway * 0.5 + wind * (f.vy * 0.6);
        f.y += f.vy; f.rot += f.vr;
        if (f.y > h + 20 || f.x < -30 || f.x > w + 30) { flakes[i] = make(true); continue; }
        if (f.shape) drawFlake(f);
        else { ctx.beginPath(); ctx.fillStyle = `rgba(245,241,235,${f.a})`; ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill(); }
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [count]);
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />;
}
