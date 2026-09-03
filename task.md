# Task Log


## 2026-09-03 23:18:13

**Project:** Personal
**Branch:** main
**Author:** vikasjaiswal1039

### Commit
```
(deploy): migrate CI pipeline from npm to pnpm

Migrate the deployment workflow to use pnpm instead of npm to improve installation speed and ensure lockfile integrity.

- Add pnpm/action-setup@v4 step with version 9 to initialize pnpm
- Update actions/setup-node@v4 cache configuration from npm to pnpm
- Replace npm install with pnpm install --frozen-lockfile for deterministic dependency installation
- Change build command from npm run build to pnpm run build

```


## 2026-09-04 01:37:02

**Project:** Personal
**Branch:** main
**Author:** vikasjaiswal1039

### Commit
```
﻿feat(portfolio): rewrite as editorial SSG site with case studies

- add react-router-dom v7 with BrowserRouter and StaticRouter for client and prerender parity
- add entry-server.tsx using React 19 prerenderToNodeStream and split hoistable head
- add scripts/prerender.mjs to emit one static HTML per route and 404.html
- add src/main.tsx hydration fallback when no prerendered content is present
- add src/routes/manifest.tsx as single source of truth for routes, meta, and sitemap paths
- add src/routes/AppRoutes.tsx and src/components/AppShell.tsx with Outlet, skip link, focus, and live region
- add src/content/profile.ts, skills.ts, experience.ts, projects.ts, certifications.ts, education.ts as the canonical content layer
- add src/pages/Home, AboutPage, ExperiencePage, ProjectsPage, ProjectDetailPage, ResumePage, ContactPage, NotFoundPage
- add src/components/doc/CaseStudy template with nine fixed sections (problem, constraints, architecture, critical path, decisions, code, results, differently) and a sticky TOC rail
- add src/components/doc/Hero, ProofStrip, CaseRows, WorkHistory, SkillsLedger, ClosingCta as the editorial home composition
- add src/components/doc/SiteHeader, SiteFooter, BackToTop and shared Reveal/RevealItem primitives honoring reduced-motion and useHydrated
- add src/components/doc/CodeBlock with line-annotated excerpts and an honesty note
- add src/diagrams/FanoutDiagram as a hand-authored inline SVG and OauthStrip as an accessible HTML sequence
- add src/seo/Seo.tsx using React 19 native metadata hoisting and src/seo/site.ts canonical helper
- add src/seo/jsonld.ts deriving Person, WebSite, ProfilePage, and ItemList from src/content to eliminate five-way drift
- add src/seo/generate.ts to write sitemap.xml, robots.txt, llms.txt, llms-full.txt at build from content
- rewrite src/index.css to a Tailwind v4 @theme token layer (paper, ink, rule, accent) with serif/sans/mono fonts, print stylesheet, prefers-reduced-motion, prefers-contrast, and forced-colors support
- rewrite src/hooks/useTheme.ts to be SSR-safe with a pre-paint <head> script and localStorage sync via effect
- simplify src/hooks/useScroll.ts to a hydration-safe false default
- add src/hooks/useHydrated.ts backed by useSyncExternalStore
- add lib/utils.ts cn() helper (clsx + tailwind-merge)
- add separate build:client, build:server, build:prerender, build:seo scripts wired into `build`
- add dependencies: react-router-dom 7.18.3, clsx, tailwind-merge, @fontsource-variable/newsreader, @fontsource-variable/ibm-plex-sans, @fontsource/ibm-plex-mono
- add pnpm-workspace.yaml and update pnpm-lock.yaml
- add CI typecheck and test steps, plus prerender assertions (titles, sitemap URL count, robots, llms.txt, search-console file) in .github/workflows/deploy.yml
- add netlify.toml mirror config with security headers and X-Robots-Tag noindex
- delete favicon.ico, favicon.png, public/404.html, public/robots.txt, public/sitemap.xml, public/llms.txt (now generated)
- add public/Vikas_Jaiswal_JavaBackendDeveloper.pdf and an <object> preview in ResumePage
- strip inline JSON-LD, FAQ HTML, and Google Fonts links from index.html; add <!--ssg-head--> placeholder and pre-paint theme script
- delete single-page components About, BackToTop, Certifications, Contact, Cursor, Experience, Footer, Hero, Highlights, LoadingSpinner, MapLoadingFallback, MapSection, Modal, Navbar, OtherProjects, Skills and their tests
- delete src/data/experiences.ts (replaced by src/content/experience.ts)

BREAKING CHANGE: The site is now a multi-page SSR/SSG application. The previous single-page anchor-scroll layout has been replaced with route-based pages (/, /about/, /experience/, /projects/, /projects/:slug/, /resume/, /contact/). All SEO metadata, JSON-LD, sitemap, robots.txt, and llms.txt are now generated at build time from src/content.

```

