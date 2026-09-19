# [VJ] Vikas Jaiswal — Portfolio

<div align="center">
  <h3>
    <a href="https://vikas794.github.io/">View live portfolio</a>
  </h3>
  <p>
    <strong>Java Backend Developer | Spring Boot Specialist | AWS & Azure Certified</strong>
  </p>
</div>

---

## Overview

A statically-generated developer portfolio — full SSR + prerendering, no
client-side data fetching, every page shipped as real HTML with per-route SEO
metadata, JSON-LD, and an `llms.txt` for AI/AEO crawlers.

## Tech stack

- **Framework**: [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/), routed with [React Router 7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), CSS-first config via `@theme` in `src/index.css` (no `tailwind.config.js`) — semantic design tokens for color, type, spacing, and radius, resolved per light/dark theme
- **Type**: self-hosted variable fonts via `@fontsource` — Newsreader (serif, headings/prose), IBM Plex Sans (body), IBM Plex Mono (labels/code)
- **Motion**: [Motion](https://motion.dev/) (Framer Motion's successor), used through one shared primitive (`src/components/Reveal.tsx`) for scroll-triggered entrances; theme toggle and route transitions use the native View Transitions API instead (`src/lib/viewTransition.ts`)
- **Rendering**: full SSR (`src/entry-server.tsx`) + static prerendering (`scripts/prerender.mjs`) — every route is written to disk as real HTML at build time
- **SEO**: generated at build time (`src/seo/generate.ts`) — `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`, plus per-page `<title>`/description/canonical/OG/Twitter tags and JSON-LD (Person, WebSite, ProfilePage, ItemList, Breadcrumb)
- **Content**: a single typed content layer (`src/content/*.ts`) feeds routes, page bodies, sitemap, and `llms.txt` — no data duplicated across the app
- **Testing**: [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)
- **Deployment**: [Netlify](https://www.netlify.com/) (`netlify.toml`)

## Key features

- **Fully static output**: every route is server-rendered and prerendered to HTML — no loading spinners, no hydration-dependent content.
- **Design system**: an "engineering document" aesthetic — serif for reading, sans for scanning, mono for lookup — with hand-written primitives (`.ledger`, `.metric`, `.hero-diagram`, `.prose`) layered on Tailwind v4 tokens.
- **Accessibility**: skip link, managed focus and a live-region route announcer, `:focus-visible` rings everywhere, accessible SVG diagrams (`role="img"` + `aria-labelledby`), and dedicated `prefers-reduced-motion` / `prefers-contrast` / `forced-colors` handling.
- **Theme + route transitions**: circular-reveal theme toggle and a soft page-turn route transition, both built on the View Transitions API with instant-swap fallbacks when unsupported or reduced motion is requested.
- **Case studies**: in-depth project write-ups (`src/components/doc/CaseStudy.tsx`) covering problem, constraints, architecture, critical path, decisions, code, results, and retrospective.
- **Custom error pages**: styled 400/401/403/404/500/502/503 pages (`src/pages/CustomErrorPage.tsx`) plus a route-level `ErrorBoundary`.

## Local development

This project uses [pnpm](https://pnpm.io/).

```bash
git clone https://github.com/vikas794/vikas794.github.io.git
cd vikas794.github.io
pnpm install
pnpm dev
```

### Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Full production build: client bundle → SSR bundle → prerender every route → generate SEO files |
| `pnpm preview` | Preview the production build locally |
| `pnpm test` | Run the Vitest suite |
| `pnpm typecheck` | Type-check with `tsc --noEmit` |
| `pnpm lint` | Lint with ESLint |

## License

No license file is currently published in this repository — all rights reserved by default.

---
<div align="center">
  Crafted by Vikas Jaiswal
</div>
