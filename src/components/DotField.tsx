import { useEffect, useRef } from "react";
import { useMotionOk } from "../motion/media";

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

  useEffect(() => {
    const canvas = ref.current;
    const bg = canvas?.parentElement;
    const host = bg?.parentElement;
    if (!canvas || !bg || !host || !motionOk) return;
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
    const ripples: { x: number; y: number; t0: number }[] = [];
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

      // Ripples from the mouse-shake egg: a ring of displaced dots spreading out.
      for (let k = ripples.length - 1; k >= 0; k--) if (now - ripples[k].t0 > 1100) ripples.splice(k, 1);
      if (ripples.length) {
        const origin = host.getBoundingClientRect();
        const ox = origin.left + SPACING / 2;
        const oy = origin.top + SPACING / 2;
        const i0 = Math.floor((0 - ox) / SPACING);
        const i1 = Math.ceil((w - ox) / SPACING);
        const j0 = Math.floor((0 - oy) / SPACING);
        const j1 = Math.ceil((h - oy) / SPACING);
        for (const rp of ripples) {
          const age = now - rp.t0;
          const front = age * 0.7;
          const fade = 1 - age / 1100;
          for (let j = j0; j <= j1; j++) {
            for (let i = i0; i <= i1; i++) {
              const x = ox + i * SPACING;
              const y = oy + j * SPACING;
              const dx = x - rp.x;
              const dy = y - rp.y;
              const d = Math.hypot(dx, dy);
              const band = Math.abs(d - front);
              if (band > 36) continue;
              const t = (1 - band / 36) * fade;
              const push = (9 * t) / (d || 1);
              ctx.globalAlpha = Math.min(1, t * 2);
              ctx.fillStyle = colors.paper;
              ctx.beginPath();
              ctx.arc(x, y, 2.2, 0, 6.2832);
              ctx.fill();
              ctx.globalAlpha = 0.4 + 0.5 * t;
              ctx.fillStyle = colors.accent;
              ctx.beginPath();
              ctx.arc(x + dx * push, y + dy * push, 1.4 + t * 0.8, 0, 6.2832);
              ctx.fill();
            }
          }
        }
        ctx.globalAlpha = 1;
      }

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
      } else if (ripples.length) {
        energy = 0;
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
    const at = (x: number, y: number) => {
      if (!inside) {
        cx = x;
        cy = y;
        readColors();
      }
      tx = x;
      ty = y;
      inside = true;
      kick();
    };
    const onMove = (e: PointerEvent) => at(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) at(t.clientX, t.clientY);
    };
    const onLeave = () => {
      inside = false;
      kick();
    };
    // Scrolling moves the hero under a still pointer without any pointer
    // event: drop the field once the pointer is no longer over the hero.
    const onScroll = () => {
      if (!inside) return;
      const r = host.getBoundingClientRect();
      if (tx < r.left || tx > r.right || ty < r.top || ty > r.bottom) onLeave();
      else kick();
    };
    const onRipple = (e: Event) => {
      const d = (e as CustomEvent<{ x: number; y: number }>).detail;
      readColors();
      ripples.push({ x: d.x, y: d.y, t0: performance.now() });
      kick();
    };
    window.addEventListener("dotfield:ripple", onRipple);
    function stop(degrade: boolean) {
      cancelAnimationFrame(raf);
      raf = 0;
      ctx?.clearRect(0, 0, w, h);
      host?.removeEventListener("pointermove", onMove);
      host?.removeEventListener("pointerleave", onLeave);
      host?.removeEventListener("touchstart", onTouch);
      host?.removeEventListener("touchmove", onTouch);
      host?.removeEventListener("touchend", onLeave);
      host?.removeEventListener("touchcancel", onLeave);
      window.removeEventListener("scroll", onScroll);
      if (degrade && bg) bg.dataset.canvas = "false";
    }

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("touchstart", onTouch, { passive: true });
    host.addEventListener("touchmove", onTouch, { passive: true });
    host.addEventListener("touchend", onLeave, { passive: true });
    host.addEventListener("touchcancel", onLeave, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      stop(false);
      window.removeEventListener("resize", resize);
      window.removeEventListener("dotfield:ripple", onRipple);
      delete bg.dataset.canvas;
    };
  }, [motionOk]);

  if (!motionOk) return null;
  return <canvas ref={ref} className="dot-field" aria-hidden="true" />;
}
