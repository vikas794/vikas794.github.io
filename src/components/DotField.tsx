import { useEffect, useRef } from "react";
import { useFinePointer, useMotionOk } from "../motion/media";

// Canvas layer over the CSS dot grid. Only the dots near the cursor are
// drawn: they are pushed away and tinted accent, then ease home when the
// pointer leaves. The static CSS grid stays underneath as the prerendered,
// no-JS and touch version. The loop runs only while the pointer is active,
// and if frames run slow it switches itself off and hands back to the plain
// CSS spotlight (see .hero-bg[data-canvas] in index.css).
const SPACING = 24;
const RADIUS = 140;
const PUSH = 10;

export default function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const motionOk = useMotionOk();
  const fine = useFinePointer();

  useEffect(() => {
    const canvas = ref.current;
    const bg = canvas?.parentElement;
    const host = bg?.parentElement;
    if (!canvas || !bg || !host || !motionOk || !fine) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = 1;
    let w = 0;
    let h = 0;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    window.addEventListener("resize", resize);
    bg.dataset.canvas = "true";

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let energy = 0;
    let inside = false;
    let raf = 0;
    let last = 0;
    let slowMs = 0;
    let frames = 0;
    let colors = { dot: "#d9d4ca", accent: "#b03a16", paper: "#f6f3ec" };

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      colors = {
        dot: cs.getPropertyValue("--dot").trim() || colors.dot,
        accent: cs.getPropertyValue("--accent").trim() || colors.accent,
        paper: cs.getPropertyValue("--paper").trim() || colors.paper,
      };
    };

    const draw = (now: number) => {
      raf = 0;
      const dt = last ? now - last : 16;
      last = now;

      // Auto-degrade: sustained slow frames (under ~50fps over one second).
      frames++;
      slowMs += dt;
      if (slowMs >= 1000) {
        if (slowMs / frames > 20) {
          stop(true);
          return;
        }
        slowMs = 0;
        frames = 0;
      }

      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      energy = inside ? Math.min(energy + 0.12, 1) : energy * 0.9;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      if (energy > 0.01) {
        const origin = host.getBoundingClientRect();
        const ox = origin.left + SPACING / 2;
        const oy = origin.top + SPACING / 2;
        const i0 = Math.floor((cx - RADIUS - ox) / SPACING);
        const i1 = Math.ceil((cx + RADIUS - ox) / SPACING);
        const j0 = Math.floor((cy - RADIUS - oy) / SPACING);
        const j1 = Math.ceil((cy + RADIUS - oy) / SPACING);
        for (let j = j0; j <= j1; j++) {
          for (let i = i0; i <= i1; i++) {
            const x = ox + i * SPACING;
            const y = oy + j * SPACING;
            if (x < -4 || y < -4 || x > w + 4 || y > h + 4) continue;
            const dx = x - cx;
            const dy = y - cy;
            const d = Math.hypot(dx, dy);
            if (d >= RADIUS) continue;
            const t = (1 - d / RADIUS) * energy;
            const push = (PUSH * t * t) / (d || 1);
            // Cover the static dot, then draw it displaced and warmed up.
            ctx.globalAlpha = Math.min(1, t * 2);
            ctx.fillStyle = colors.paper;
            ctx.beginPath();
            ctx.arc(x, y, 2.2, 0, 6.2832);
            ctx.fill();
            ctx.globalAlpha = 0.35 + 0.6 * t;
            ctx.fillStyle = t > 0.12 ? colors.accent : colors.dot;
            ctx.beginPath();
            ctx.arc(x + dx * push, y + dy * push, 1.3 + t * 0.7, 0, 6.2832);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
        raf = requestAnimationFrame(draw);
      } else {
        energy = 0;
        last = 0;
        slowMs = 0;
        frames = 0;
      }
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const onMove = (e: PointerEvent) => {
      if (!inside) {
        cx = e.clientX;
        cy = e.clientY;
        readColors();
      }
      tx = e.clientX;
      ty = e.clientY;
      inside = true;
      kick();
    };
    const onLeave = () => {
      inside = false;
      kick();
    };
    function stop(degrade: boolean) {
      cancelAnimationFrame(raf);
      raf = 0;
      ctx?.clearRect(0, 0, w, h);
      host?.removeEventListener("pointermove", onMove);
      host?.removeEventListener("pointerleave", onLeave);
      if (degrade && bg) bg.dataset.canvas = "false";
    }

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      stop(false);
      window.removeEventListener("resize", resize);
      delete bg.dataset.canvas;
    };
  }, [motionOk, fine]);

  if (!motionOk || !fine) return null;
  return <canvas ref={ref} className="dot-field" aria-hidden="true" />;
}
