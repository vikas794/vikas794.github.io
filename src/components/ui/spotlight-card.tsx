import { useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../../lib/utils";

// Card with a cursor-following spotlight and a lit border (styles: the
// [data-glow] block in index.css). Adapted from the spotlight-card recipe:
//  - pointer position is stored relative to the card, so it stays correct
//    inside transformed containers (the pinned track) and while content moves
//    under a still pointer (scroll listener, capture phase, covers inner
//    scrollers such as the swipe row);
//  - no `background-attachment: fixed` and no `touch-action: none`, so touch
//    can still scroll and swipe;
//  - touch lights the card while pressed (data-hover) because there is no :hover.
// Without JavaScript, or before the first pointer event, the card is plain.

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
  rust: { base: 12, spread: 40 }, // the site accent
} as const;

const sizeMap = {
  sm: "w-48 h-64",
  md: "w-64 h-80",
  lg: "w-80 h-96",
} as const;

interface GlowCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode;
  glowColor?: keyof typeof glowColorMap;
  size?: keyof typeof sizeMap;
  width?: string | number;
  height?: string | number;
  /** When true, ignores `size` and lets className / width / height decide. */
  customSize?: boolean;
}

export function GlowCard({
  children,
  className,
  glowColor = "rust",
  size = "md",
  width,
  height,
  customSize = true,
  style,
  ...rest
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    let x = 0;
    let y = 0;
    let have = false;
    let frame = 0;
    let release = 0;

    const paint = () => {
      frame = 0;
      if (!have) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--x", (x - r.left).toFixed(1));
      el.style.setProperty("--y", (y - r.top).toFixed(1));
      el.style.setProperty("--xp", Math.min(Math.max((x - r.left) / (r.width || 1), 0), 1).toFixed(3));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // touch events below keep firing while scrolling
      x = e.clientX;
      y = e.clientY;
      have = true;
      schedule();
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      window.clearTimeout(release);
      x = t.clientX;
      y = t.clientY;
      have = true;
      const r = el.getBoundingClientRect();
      const on = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
      el.dataset.hover = on ? "true" : "false";
      schedule();
    };
    const onTouchEnd = () => {
      window.clearTimeout(release);
      release = window.setTimeout(() => {
        el.dataset.hover = "false";
      }, 350);
    };
    const onScroll = () => {
      if (have) schedule();
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("touchstart", onTouch, { passive: true });
    document.addEventListener("touchmove", onTouch, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(release);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("touchstart", onTouch);
      document.removeEventListener("touchmove", onTouch);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("scroll", onScroll, { capture: true });
    };
  }, []);

  const { base, spread } = glowColorMap[glowColor];
  const vars = {
    "--base": base,
    "--spread": spread,
    ...(width !== undefined && { width: typeof width === "number" ? `${width}px` : width }),
    ...(height !== undefined && { height: typeof height === "number" ? `${height}px` : height }),
    ...style,
  } as CSSProperties;

  return (
    <div
      {...rest}
      ref={ref}
      data-glow
      style={vars}
      className={cn("glow-card", !customSize && sizeMap[size], !customSize && "aspect-[3/4]", className)}
    >
      <span data-glow aria-hidden="true" />
      {children}
    </div>
  );
}
