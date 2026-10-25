import { showToast } from "../components/Toast";

// Pointer-only effects, all delegated from the document so no component has
// to know about them. Opt in with attributes:
//   data-tilt     card leans toward the cursor (max 6 degrees) with a highlight
//   data-cursor   label shown in the cursor ring ("Open", "Copy", "Scroll")
// The native cursor is never hidden; the ring only adds to it.

export function initPointerEffects(fine = true): () => void {
  const cleanups: (() => void)[] = [];
  // Last known mouse position. Scrolling moves content under a still cursor
  // without firing pointermove, so scroll re-runs the effects from here.
  let mouseX = -1;
  let mouseY = -1;
  let haveMouse = false;
  let setRing: (target: EventTarget | null) => void = () => {};

  // ---------- cursor ring (mouse only) ----------
  if (fine) {
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

  setRing = (target) => {
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
    mouseX = e.clientX;
    mouseY = e.clientY;
    haveMouse = true;
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
  }

  // ---------- tilt + specular highlight ----------
  let tilted: HTMLElement | null = null;
  const resetTilt = (el: HTMLElement) => {
    el.style.transition = "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)";
    el.style.transform = "";
    el.style.removeProperty("--hx");
    el.style.removeProperty("--hy");
  };
  const tiltAt = (target: Element | null, x: number, y: number) => {
    const el = target?.closest<HTMLElement>("[data-tilt]") ?? null;
    if (tilted && tilted !== el) {
      resetTilt(tilted);
      delete tilted.dataset.hover;
    }
    tilted = el;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (x - r.left) / r.width;
    const py = (y - r.top) / r.height;
    el.style.transition = "transform 80ms linear";
    el.style.transform = `perspective(900px) rotateX(${((0.5 - py) * 12).toFixed(2)}deg) rotateY(${((px - 0.5) * 12).toFixed(2)}deg)`;
    el.style.setProperty("--hx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--hy", `${(py * 100).toFixed(1)}%`);
    // Touch has no :hover, so the hover look is driven by this attribute.
    el.dataset.hover = "true";
  };
  const onTilt = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    tiltAt(e.target as Element | null, e.clientX, e.clientY);
  };
  document.addEventListener("pointermove", onTilt, { passive: true });

  // Touch: the card under the finger leans and shows its hover state until
  // the finger lifts. Touch events keep firing while the page scrolls.
  let releaseTimer = 0;
  const onTouch = (e: TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    window.clearTimeout(releaseTimer);
    tiltAt(document.elementFromPoint(t.clientX, t.clientY), t.clientX, t.clientY);
  };
  const onTouchEnd = () => {
    window.clearTimeout(releaseTimer);
    releaseTimer = window.setTimeout(() => {
      if (!tilted) return;
      resetTilt(tilted);
      delete tilted.dataset.hover;
      tilted = null;
    }, 350);
  };
  document.addEventListener("touchstart", onTouch, { passive: true });
  document.addEventListener("touchmove", onTouch, { passive: true });
  document.addEventListener("touchend", onTouchEnd, { passive: true });
  document.addEventListener("touchcancel", onTouchEnd, { passive: true });

  // Mouse + scroll: re-resolve what is under the stationary cursor.
  let scrollFrame = 0;
  const onScroll = () => {
    if (!fine || !haveMouse || scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      const el = document.elementFromPoint(mouseX, mouseY);
      setRing(el);
      tiltAt(el, mouseX, mouseY);
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  cleanups.push(() => {
    cancelAnimationFrame(scrollFrame);
    window.clearTimeout(releaseTimer);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("pointermove", onTilt);
    document.removeEventListener("touchstart", onTouch);
    document.removeEventListener("touchmove", onTouch);
    document.removeEventListener("touchend", onTouchEnd);
    document.removeEventListener("touchcancel", onTouchEnd);
    if (tilted) {
      resetTilt(tilted);
      delete tilted.dataset.hover;
    }
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
