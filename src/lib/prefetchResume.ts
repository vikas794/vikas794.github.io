import { PDF_PATH } from "../pages/ResumePage";
import { loadResume } from "./resumeStore";

let started = false;

function warm() {
  // Viewer code first, then the file; both are shared with the /resume/
  // page, so visiting it later finds everything already in hand.
  import("react-pdf").catch(() => {});
  loadResume(PDF_PATH).catch(() => {});
}

// Warms the résumé (react-pdf chunk + PDF bytes, stored in Cache Storage)
// once the page has fully loaded and the browser is idle, so it never
// competes with what the visitor is looking at. Runs once per tab; route
// changes do not trigger another fetch. Must only run client-side,
// post-hydration: react-pdf touches DOMMatrix/Worker/canvas, which don't
// exist during SSR/prerendering.
export function prefetchResumeAssets() {
  if (started || typeof window === "undefined") return;
  started = true;

  const whenIdle = () => {
    if ("requestIdleCallback" in window) window.requestIdleCallback(warm, { timeout: 4000 });
    else setTimeout(warm, 500);
  };

  if (document.readyState === "complete") whenIdle();
  else window.addEventListener("load", whenIdle, { once: true });
}
