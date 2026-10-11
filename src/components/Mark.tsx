import type { ReactNode } from "react";

// The highlighter (DESIGN.md section 2). Max two per headline. Pure CSS draw
// animation, so it also works on the prerendered page and is static under
// reduced motion. Use `scroll` for marks below the fold so the draw happens
// when they come into view.
export default function Mark({ children, scroll = false }: { children: ReactNode; scroll?: boolean }) {
  return <mark className={scroll ? "mark mark-view" : "mark"}>{children}</mark>;
}
