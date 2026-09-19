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

// Warms the résumé PDF viewer (react-pdf chunk + PDF binary) from idle time
// on any page, so /resume/ has both already cached by the time it's visited.
// Must only run client-side, post-hydration — react-pdf touches DOMMatrix/
// Worker/canvas, which don't exist during SSR/prerendering.
export function prefetchResumeAssets() {
  if (started || typeof window === "undefined") return;
  started = true;

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(warm);
  } else {
    setTimeout(warm, 200);
  }
}
