export type RouteDirection = "forward" | "back";

// Order matches the header nav (SiteHeader NAV_LINKS), so a route change
// slides the way the nav reads: later sections enter from the right.
const SECTION_ORDER = ["", "about", "experience", "projects", "resume", "contact"];

function segments(pathname: string): string[] {
  return pathname.split("/").filter(Boolean);
}

function sectionIndex(parts: string[]): number {
  const i = SECTION_ORDER.indexOf(parts[0] ?? "");
  return i === -1 ? SECTION_ORDER.length : i;
}

export function routeDirection(from: string, to: string): RouteDirection {
  const a = segments(from);
  const b = segments(to);
  const ai = sectionIndex(a);
  const bi = sectionIndex(b);
  if (ai !== bi) return bi > ai ? "forward" : "back";
  // Same section (e.g. /projects/ <-> /projects/slug/): deeper is forward.
  return b.length >= a.length ? "forward" : "back";
}
