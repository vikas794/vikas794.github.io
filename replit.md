# Vikas Jaiswal – Developer Portfolio

A statically-generated (SSR + prerendered) portfolio for Vikas Jaiswal, a Java
Backend Developer. Built with React 19 + Vite 6 + TypeScript + Tailwind CSS 4
+ React Router 7.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4 (CSS-first `@theme` config, no `tailwind.config.js`), Motion (Framer Motion)
- **Build tool**: Vite 6
- **Package manager**: pnpm
- **Icons**: Lucide React
- **Rendering**: SSR (`src/entry-server.tsx`) + static prerender (`scripts/prerender.mjs`) for every route

## Project Structure

```
/
├── src/
│   ├── components/doc/   # Hero, SiteHeader, CaseStudy, WorkHistory, etc.
│   ├── content/           # Typed content — single source for routes/SEO/pages
│   ├── pages/              # One page per route
│   ├── seo/                # Seo.tsx, jsonld.ts, generate.ts (sitemap/robots/llms.txt)
│   ├── routes/manifest.tsx # Route table — feeds SSR, prerender, and sitemap
│   ├── entry-server.tsx    # SSR entry
│   └── index.css           # Design tokens & global styles
├── scripts/prerender.mjs  # Writes every route to static HTML at build time
├── public/                 # Static assets
├── vite.config.ts
└── package.json
```

## Development

```bash
pnpm install
pnpm dev   # runs on http://0.0.0.0:5000
```

## Build & Deployment

```bash
pnpm build   # client bundle → SSR bundle → prerender → SEO generation
```

Deployed on Netlify (`netlify.toml`). The Vite dev server binds
`0.0.0.0:5000` with `allowedHosts: true` for Replit's proxy.
