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


## 2026-09-04 01:46:04

**Project:** Personal
**Branch:** main
**Author:** vikasjaiswal1039

### Commit
```
﻿chore(ci): bump github actions versions and node to 24

- update actions/checkout from v4 to v5 in deploy.yml
- update actions/setup-node from v4 to v5 in deploy.yml
- bump node-version from 20 to 24 in deploy.yml setup-node step
- update actions/configure-pages from v4 to v6 in deploy.yml
- update actions/upload-pages-artifact from v3 to v5 in deploy.yml
- update actions/deploy-pages from v4 to v5 in deploy.yml
- update task.md with new dated project journal entry (2026-09-04) documenting the portfolio SSG rewrite on main

```


## 2026-09-04 01:49:54

**Project:** Personal
**Branch:** main
**Author:** vikasjaiswal1039

### Commit
```
﻿chore(repo): remove pnpm-workspace config and log CI updates in journal

- delete pnpm-workspace.yaml containing the obsolete esbuild allowBuilds entry
- add dated entry (2026-09-04 01:46:04) to task.md capturing the portfolio SSG rewrite on main
- document deploy.yml GitHub Actions version bumps in task.md: actions/checkout v4→v5, actions/setup-node v4→v5, actions/configure-pages v4→v6, actions/upload-pages-artifact v3→v5, actions/deploy-pages v4→v5
- record Node.js runtime bump from 20 to 24 in the deploy.yml setup-node step
- mark the journal entry under the "Personal" project with author vikasjaiswal1039

```


## 2026-09-04 02:12:07

**Project:** Personal
**Branch:** main
**Author:** vikasjaiswal1039

### Commit
```
﻿feat(hero): promote flagship proof stat and polish portfolio chrome

- update theme-color meta in index.html from #6c63ff to #b03a16 to match the new accent
- promote the first proofStrip entry as a flagship metric directly inside the Hero component
- render the hero stat as a Link to the matching project case study via `/projects/<slug>/`
- wrap the hero stat in Reveal/RevealItem so it fades in with the rest of the hero
- tighten hero intro copy to "hard requirements into secure, fast systems"
- add .hero-stat, .hero-stat-num, and .hero-stat-label styles in index.css (serif number, mono label, accent left border)
- drop the "updated <date>" suffix from the Resume download button
- remove the PDF_UPDATED constant in ResumePage.tsx and refresh its rationale comments
- fix the telephone field in personJsonLd by removing the extraneous leading "+" prefix
- append a dated journal entry to task.md recording prior repo/journal changes

```


## 2026-09-04 02:37:21

**Project:** Personal
**Branch:** main
**Author:** vikasjaiswal1039

### Commit
```
﻿feat(portfolio): adopt Reveal animations and update Java/Spring Boot stack

- remove the `limit` prop and child truncation logic from the `Reveal` component so it never hides children regardless of count
- wrap all doc sections and page content in `Reveal`/`RevealItem` for consistent entrance animations across CaseStudy, ClosingCta, SkillsLedger, WorkHistory, AboutPage, ContactPage, ExperiencePage, and ProjectsPage
- update Java version references from Java 17 to Java 8-25 and Spring Boot from 3 to 3/4 across `experience.ts`, `profile.ts`, `skills.ts`, `Home.tsx`, `ContactPage.tsx`, and `routes/manifest.tsx`
- add "Certified" entry to the `skillLedger` in `skills.ts` listing Azure AZ-900, Azure DP-900, and Google Cloud GenAI credentials
- update `skills.ts` accentTags to highlight Java 25 and Spring Boot 4, and refresh accuracy comments
- append Java 8, Java 21, Java 25, and Spring Boot 4 to `personJsonLd().knowsAbout` in `seo/jsonld.ts`
- update `seo/generate.ts` LLM notes to reflect the Java 8-25 breadth and Spring Boot 4 current status
- tighten hero and contact page copy to reference the updated stack and remove the "Java 17" specific mention

```


## 2026-09-04 02:49:50

**Project:** Personal
**Branch:** main
**Author:** vikasjaiswal1039

### Commit
```
﻿feat(portfolio): add reveal animations and enhance UI with icons and navigation updates

- Update Reveal component animations (stagger timing, transitions)
- Add ArrowRight and Mail icons from lucide-react to links and buttons
- Refactor navigation to use NavLink with active state styling
- Implement mobile menu with Menu/X icons and responsive design
- Enhance hover effects and transitions across CaseRows, ClosingCta, Hero, SiteHeader, WorkHistory, and ProjectsPage components

```

