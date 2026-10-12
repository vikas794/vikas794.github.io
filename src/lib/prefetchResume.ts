import { PDF_PATH } from "../pages/ResumePage";

let started = false;

function warm() {
  import("react-pdf").catch(() => {});

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = "fetch";
  link.href = PDF_PATH;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}

// Warms the résumé PDF viewer (react-pdf chunk + PDF binary) on intent: the
// first time a visitor hovers, focuses or touches a link to /resume/, so the
// page is instant when they arrive without every visitor paying for ~210 KB
// of viewer code they may never open. Must only run client-side,
// post-hydration: react-pdf touches DOMMatrix/Worker/canvas, which don't
// exist during SSR/prerendering.
const EVENTS = ["pointerover", "focusin", "touchstart"] as const;

export function prefetchResumeAssets() {
  if (started || typeof window === "undefined") return;
  started = true;

  const onIntent = (e: Event) => {
    const target = e.target instanceof Element ? e.target : null;
    if (!target?.closest('a[href="/resume/"]')) return;
    EVENTS.forEach((type) => document.removeEventListener(type, onIntent));
    warm();
  };
  EVENTS.forEach((type) => document.addEventListener(type, onIntent, { passive: true }));
}
