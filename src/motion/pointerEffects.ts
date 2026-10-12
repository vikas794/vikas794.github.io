import { showToast } from "../components/Toast";

// Pointer-only effects, all delegated from the document so no component has
// to know about them. Opt in with attributes:
//   data-tilt     card leans toward the cursor (max 6 degrees) with a highlight
//   data-cursor   label shown in the cursor ring ("Open", "Copy", "Scroll")
// The native cursor is never hidden; the ring only adds to it.

export function initPointerEffects(): () => void {
  const cleanups: (() => void)[] = [];

  // ---------- cursor ring ----------
  const dot = document.createElement("div");
  const ring = document.createElement("div");
  dot.className = "cursor-dot";
  ring.className = "cursor-ring";
  dot.setAttribute("aria-hidden", "true");
  ring.setAttribute("aria-hidden", "true");
  document.body.append(dot, ring);

  let tx = -100;
  let ty = -100;
  let rx = tx;
  let ry = ty;
  let raf = 0;
  let shown = false;

  const loop = () => {
    rx += (tx - rx) * 0.2;
    ry += (ty - ry) * 0.2;
    dot.style.transform = `translate3d(${tx}px,${ty}px,0)`;
    ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
    raf = Math.abs(tx - rx) + Math.abs(ty - ry) > 0.3 ? requestAnimationFrame(loop) : 0;
  };

  const setRing = (target: EventTarget | null) => {
    const el = target instanceof Element ? target : null;
    const labelled = el?.closest<HTMLElement>("[data-cursor]");
    const interactive = el?.closest("a, button, [role='tab'], summary");
    const text = el?.closest("input, textarea");
    ring.dataset.state = text ? "text" : labelled ? "label" : interactive ? "link" : "idle";
    ring.dataset.label = labelled?.dataset.cursor ?? "";
    ring.textContent = labelled?.dataset.cursor ?? "";
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    tx = e.clientX;
    ty = e.clientY;
    if (!shown) {
      shown = true;
      rx = tx;
      ry = ty;
      dot.dataset.on = ring.dataset.on = "true";
    }
    if (!raf) raf = requestAnimationFrame(loop);
  };
  const onOver = (e: PointerEvent) => setRing(e.target);
  const onLeaveDoc = () => {
    shown = false;
    delete dot.dataset.on;
    delete ring.dataset.on;
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerover", onOver, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeaveDoc);
  cleanups.push(() => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerover", onOver);
    document.documentElement.removeEventListener("pointerleave", onLeaveDoc);
    dot.remove();
    ring.remove();
  });

  // ---------- tilt + specular highlight ----------
  let tilted: HTMLElement | null = null;
  const resetTilt = (el: HTMLElement) => {
    el.style.transition = "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)";
    el.style.transform = "";
    el.style.removeProperty("--hx");
    el.style.removeProperty("--hy");
  };
  const onTilt = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = (e.target as Element | null)?.closest<HTMLElement>("[data-tilt]") ?? null;
    if (tilted && tilted !== el) resetTilt(tilted);
    tilted = el;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transition = "transform 80ms linear";
    el.style.transform = `perspective(900px) rotateX(${((0.5 - py) * 12).toFixed(2)}deg) rotateY(${((px - 0.5) * 12).toFixed(2)}deg)`;
    el.style.setProperty("--hx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--hy", `${(py * 100).toFixed(1)}%`);
  };
  document.addEventListener("pointermove", onTilt, { passive: true });
  cleanups.push(() => {
    document.removeEventListener("pointermove", onTilt);
    if (tilted) resetTilt(tilted);
  });

  // ---------- ghost-button fill enters from the side the cursor came from ----------
  const onBtn = (e: PointerEvent) => {
    const btn = (e.target as Element | null)?.closest<HTMLElement>(".btn-ghost");
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    btn.dataset.from = e.clientX < r.left + r.width / 2 ? "left" : "right";
  };
  document.addEventListener("pointerover", onBtn, { passive: true });
  cleanups.push(() => document.removeEventListener("pointerover", onBtn));

  // ---------- mouse shake easter egg ----------
  // 5+ horizontal direction reversals inside 700ms at over 1200px/s.
  const turns: number[] = [];
  let lastX = 0;
  let lastT = 0;
  let lastDir = 0;
  let lastFire = 0;
  const onShake = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const now = performance.now();
    const dx = e.clientX - lastX;
    const dt = now - lastT;
    const dir = Math.sign(dx);
    if (lastT && dt > 0 && Math.abs(dx) > 3 && Math.abs(dx / dt) * 1000 > 1200 && dir !== 0 && dir !== lastDir && lastDir !== 0) {
      turns.push(now);
      while (turns.length && now - turns[0] > 700) turns.shift();
      if (turns.length >= 5 && now - lastFire > 10000) {
        lastFire = now;
        turns.length = 0;
        window.dispatchEvent(new CustomEvent("dotfield:ripple", { detail: { x: e.clientX, y: e.clientY } }));
        showToast("429 Too Many Requests. Easy there.");
      }
    }
    if (Math.abs(dx) > 3) lastDir = dir;
    lastX = e.clientX;
    lastT = now;
  };
  window.addEventListener("pointermove", onShake, { passive: true });
  cleanups.push(() => window.removeEventListener("pointermove", onShake));

  return () => cleanups.forEach((fn) => fn());
}
