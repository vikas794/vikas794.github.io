export const SITE_URL = "https://vikas794.github.io";
export const SITE_NAME = "Vikas Jaiswal — Portfolio";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

// Trailing-slash canonicals: both hosts 301 /about → /about/,
// so every internal link + <loc> uses the slash and avoids a hop.
export function canonicalUrl(path: string): string {
  if (path === "/") return `${SITE_URL}/`;
  const withSlash = path.endsWith("/") ? path : `${path}/`;
  return `${SITE_URL}${withSlash}`;
}
