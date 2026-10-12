# PRD — Vikas Jaiswal Portfolio (`vikas794.github.io`)

Product requirements and technical specification, written so an LLM can **recreate the whole site** from this file plus `DESIGN.md`.

- `PRD.md` (this file): scope, architecture, routes, page-by-page behaviour, data model, SEO, build/deploy, tests, content.
- `DESIGN.md`: visual system, components, and every animation with exact values.

When this file says "see DESIGN §x" the exact CSS/motion numbers are there.

---

## 1. Product summary

A statically generated, fully server-rendered personal portfolio for **Vikas Jaiswal**, a Java Spring Boot backend developer in Mumbai, aimed at recruiters and hiring managers. It is a developer-portfolio-as-engineering-document: serif headlines, mono metadata, a rust highlighter accent, measured results with stated methods, and deep case studies that show trade-offs.

**Live URL:** `https://vikas794.github.io/` (GitHub Pages is canonical; a Netlify mirror exists and is `noindex`).

### 1.1 Goals
1. A recruiter understands who Vikas is, what he has measurably shipped, and how to contact him **within the first screen**.
2. Show senior judgement: case studies with constraints, architecture, trade-off tables, honest retrospectives.
3. Be a flawless static site: every route is real prerendered HTML, readable with JavaScript off, instantly loadable.
4. Be discoverable by search engines **and** AI answer engines (rich JSON-LD, `llms.txt`, `ai/*.json`, RSS).
5. Feel crafted: signature highlighter motif, playful but budgeted motion, light/dark themes, directional page transitions.

### 1.2 Non-goals
No CMS, no backend of its own, no auth, no database, no client-side data fetching, no blog, no analytics beyond Cloudflare Web Analytics, no i18n, no photo of the owner, no stock imagery, no third-party UI kit.

### 1.3 Audience and primary journeys
- **Recruiter/hiring manager (primary):** lands on Home → reads hero + proof band → opens a case study or résumé → copies email / uses contact form.
- **Engineer peer:** reads case studies (architecture, code excerpt, decisions).
- **Search / AI crawler:** reads prerendered HTML, JSON-LD, `llms.txt`, sitemap.

### 1.4 Success metrics
- Lighthouse (desktop preset, CI config): performance ≥ 0.85 (error), SEO ≥ 0.95 (error), accessibility ≥ 0.9 (warn), best-practices ≥ 0.9 (warn).
- Every route present in `dist/` as `index.html` with `<title>`, canonical, JSON-LD; sitemap count equals prerendered page count.
- No client-render fallback markers (`data-msg=`) in output.
- Contact: email copy button, mailto, form, 5 social channels all work.

---

## 2. Tech stack (exact)

| Concern | Choice |
|---|---|
| Language | TypeScript ~6.0 (`strict` not set; `jsx: react-jsx`, `moduleResolution: bundler`, `noEmit`, path alias `@/* → ./*`) |
| UI | React 19.3, React DOM 19.3 (uses `react-dom/static` `prerenderToNodeStream`) |
| Router | React Router 7.18.3 (`BrowserRouter` on client, `StaticRouter` at build) |
| Bundler | Vite 6 + `@vitejs/plugin-react` 5, `base: '/'`, dev server `0.0.0.0:5000` |
| Styling | Tailwind CSS v4.3 via `@tailwindcss/vite`; **CSS-first**: tokens in `@theme` in `src/index.css`, no `tailwind.config.js`; plus hand-written CSS primitives |
| Motion | `motion` ^14 (`motion/react`); native View Transitions API; CSS keyframes; SMIL in SVG |
| Icons | `lucide-react` ^0.546 |
| PDF | `react-pdf` ^11 + `pdfjs-dist` 6.3.289 (dynamic import, client-only) |
| Fonts | `@fontsource-variable/newsreader`, `@fontsource-variable/ibm-plex-sans`, `@fontsource/ibm-plex-mono` (400, 500) |
| Utils | `clsx`, `tailwind-merge` (a `lib/utils.ts` exists at repo root), `dotenv`, `express` (listed, not used by the site at runtime) |
| Tests | Vitest 4 + jsdom 30 + Testing Library (`react`, `user-event`, `jest-dom`) |
| Lint | ESLint 10 flat config: `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks` 7, `eslint-plugin-react-refresh` |
| Build helpers | `tsx` (runs the SEO generator), plain Node ESM (prerender, IndexNow) |
| Package manager | pnpm 9 (`pnpm-workspace.yaml`: `packages: ["."]`, `allowBuilds: {esbuild: true}`) |
| Node | 20 (Netlify) / 24 (GitHub Actions) |

### 2.1 Scripts
```
dev            vite --port=5000 --host=0.0.0.0
build:client   vite build
build:server   vite build --ssr src/entry-server.tsx --outDir dist-ssr
build:prerender node scripts/prerender.mjs
build:seo      tsx src/seo/generate.ts
build          client && server && prerender && seo      (in that order)
indexnow       node scripts/indexnow-ping.mjs
preview        vite preview
typecheck      tsc --noEmit
lint           eslint .
test           vitest run
```

---

## 3. Repository layout

```
index.html                 template with <!--ssg-head--> marker, pre-paint theme script, LLM <link rel=alternate>, Cloudflare beacon
netlify.toml               Netlify mirror config (headers, no SPA rewrite)
vite.config.ts  vitest.config.ts  eslint.config.js  tsconfig.json  pnpm-workspace.yaml
DESIGN.md  PRD.md  README.md  SEO_BACKLINK_STRATEGY.md  docs/design-review.md
public/                    favicon.{svg,png,ico}, apple-touch-icon.png, og-image.png,
                           Vikas_Jaiswal_JavaBackendDeveloper.pdf, google55cf…html (Search Console),
                           30d0ff6a…txt (IndexNow key)
scripts/prerender.mjs  scripts/indexnow-ping.mjs
src/
  main.tsx                 hydrateRoot if #root has children, else createRoot
  App.tsx                  <BrowserRouter><AppRoutes/></BrowserRouter>
  entry-server.tsx         render(url) → {head, rootHtml}; exports routePaths
  index.css                ALL tokens + hand-written components + motion CSS (see DESIGN.md)
  routes/                  manifest.tsx (route table + meta), AppRoutes.tsx
  pages/                   Home, AboutPage, ExperiencePage, ProjectsPage, ProjectDetailPage,
                           ResumePage, ContactPage, CustomErrorPage, NotFoundPage
  components/              AppShell, Reveal, HeadlineReveal, Mark, SectionHeading, CountUp, Magnetic,
                           HeroSpotlight, Ticker, CopyEmail, ErrorBoundary, ResumePdfPreview
  components/doc/          SiteHeader, SiteFooter, BackToTop, Hero, ProofStrip, CaseRow, CaseRows,
                           WorkHistory, SkillsLedger, ClosingCta, CaseStudy, CodeBlock, ErrorPage
  diagrams/                HeroFlowDiagram, FanoutDiagram, OauthStrip
  content/                 profile, experience, projects, skills, certifications, education, faq, index
  hooks/                   useTheme, useHydrated, useScroll
  lib/                     viewTransition, routeDirection, prefetchResume, errorCodes
  seo/                     Seo.tsx, site.ts, jsonld.ts, generate.ts
  test/setup.ts            jest-dom + IntersectionObserver/ResizeObserver mocks
.github/workflows/         ci.yml, deploy.yml, seo-health.yml, dependabot-automerge.yml
.github/dependabot.yml  .github/lighthouserc.json
```

`index.html` `<head>` contents: charset, viewport, icons (`/favicon.svg`, `/favicon.png`, `/favicon.ico`, `/apple-touch-icon.png`), `rel=alternate` links to `llms.txt`, `llms-full.txt`, `feed.xml` (RSS, title "Vikas Jaiswal — Case studies"), `ai/summary.json`; the `<!--ssg-head-->` marker; `color-scheme`, `theme-color #b03a16`, `mobile-web-app-capable`, apple status bar meta; the pre-paint theme script; `geo.region IN-MH`, `geo.placename Mumbai`. `<body>`: `<div id="root"></div>`, `<script type="module" src="src/main.tsx">`, and the Cloudflare Web Analytics beacon (`defer type=module`, `static.cloudflareinsights.com/beacon.min.js`, `data-cf-beacon='{"token": "e3949ff07332466a94b8bde21ce49c35"}'`).

---

## 4. Architecture

### 4.1 Rendering model: SSG with hydration
1. `vite build` → client bundle + `dist/index.html` (template, still containing `<!--ssg-head-->` and `<div id="root"></div>`).
2. `vite build --ssr src/entry-server.tsx --outDir dist-ssr` → server bundle.
3. `scripts/prerender.mjs` imports `dist-ssr/entry-server.js`, reads the built `dist/index.html` template **before** writing anything (the `/` route overwrites it), validates both placeholders exist, then for every path in `routePaths` calls `render(url)` and writes: `/` → `dist/index.html`; `/x/y/` → `dist/x/y/index.html`. Then for error codes `400 401 403 404 500 502 503` it also renders `/error/{code}/` and writes **both** `dist/error/{code}/index.html` and a root `dist/{code}.html` (so `404.html` serves on GitHub Pages/Netlify).
4. `src/seo/generate.ts` (via `tsx`) writes SEO artefacts into `dist/` (§9).

`render(url)` in `entry-server.tsx`: wraps `<StrictMode><div id="root"><StaticRouter location={url}><AppRoutes/></StaticRouter></div></StrictMode>` in `prerenderToNodeStream`, collects the prelude, throws `AggregateError` on any SSR error, splits the output at `<div id="root">` into `head` (hoisted `<title>/<meta>/<link>` produced by React 19 metadata hoisting) and `rootHtml`. It **throws** if: the root marker is missing; anything other than `<title>`, `<meta/>`, `<link/>` precedes `#root`; the markup contains `data-msg=` or `<!--$!-->` (client-render fallback); no `<title>` was emitted. It also exports `routePaths = expandRoutes()`, which feeds both prerender and sitemap.

Client `main.tsx`: if `#root` has child nodes → `hydrateRoot(<StrictMode><App/></StrictMode>)`; otherwise (vite dev) `createRoot().render`.

### 4.2 Hydration safety rules (apply everywhere)
- `useHydrated()` = `useSyncExternalStore(noop, () => true, () => false)`: **false on server and the first client render**, then true. Every animated/enhanced component renders its static, complete version until hydrated so server and client markup match.
- Light theme is the SSR snapshot. A blocking inline script in `<head>` adds `html.dark` before first paint when `localStorage.theme === "dark"`, or when there is no stored value and `prefers-color-scheme: dark`; `"light"` removes it. React then syncs state from the DOM in an effect (never during render).
- `react-pdf`/`pdfjs-dist` touch `DOMMatrix`/`Worker`/canvas, so they are **only ever imported dynamically inside effects**, never at module top level in anything that is server-rendered.
- State that depends on scroll position (`useScroll`) initialises to `false` and reads `window.scrollY` in an effect.

### 4.3 Single route table
`src/routes/manifest.tsx` exports `routes: AppRoute[]` (`{path, element, meta:{title, description, noindex?}}`), `expandRoutes()` (excludes `*` and any `:param` path), and `resolveMeta(path)`. `AppRoutes` renders `<ErrorBoundary><Routes location={displayedLocation}><Route element={<AppShell/>}>{routes…}</Route></Routes></ErrorBoundary>` — used by both client and server so they cannot drift.

### 4.4 State and data flow
There is no global store and no data fetching. All content is typed constants in `src/content/*.ts` imported by pages, JSON-LD builders, the sitemap/llms generator and tests. Local state only: theme (`useTheme`), mobile menu open, form submitted, copy-confirmation, PDF module/width/error, scroll threshold.

---

## 5. Routes

| Path | Page | Indexed | Title |
|---|---|---|---|
| `/` | Home | yes | `Vikas Jaiswal \| Java Spring Boot Backend Developer` (page-level Seo; manifest meta uses `${name} \| ${titleLong}`) |
| `/about/` | About | yes | `About \| Vikas Jaiswal · Java Backend Developer` |
| `/experience/` | Experience | yes | `Experience \| Vikas Jaiswal · Java Developer` |
| `/projects/` | Projects list | yes | `Projects \| Vikas Jaiswal · Case Studies` |
| `/projects/market-ticks-fanout/` | Case study 01 | yes | title = case title, with `\| Vikas Jaiswal` appended only if total ≤ 60 chars |
| `/projects/healthcare-backend-trust/` | Case study 02 | yes | same rule |
| `/projects/sql-injection-surface/` | Case study 03 | yes | same rule |
| `/resume/` | Résumé | yes | `Résumé \| Vikas Jaiswal · Java Developer` |
| `/contact/` | Contact | yes | `Contact \| Vikas Jaiswal · Open to Work` |
| `/error/:code/` | Custom error page | `noindex, follow` | `{title} ({code}) \| Vikas Jaiswal` |
| `*` | 404 (`CustomErrorPage code="404"`) | `noindex, follow` | |

All internal links and canonicals use a **trailing slash**. Prerendered error codes: 400, 401, 403, 404, 500, 502, 503. `ERROR_CODES` also defines 402, 405–410, 429, 501, 504 (client-routable via `/error/:code/`, not prerendered); unknown 4xx/5xx codes get generic copy; anything else → "Unexpected Error"; missing code defaults to `500`.

Nav order (header and route-direction): Home, About, Experience, **Work** (`/projects/`), Résumé, Contact.

### 5.1 Routing behaviours
- **App shell on every route** (`AppShell`): skip link, scroll-progress bar, sticky header, `<main id="main" tabIndex=-1 class="relative isolate">` containing `<HeroSpotlight/>` and `<ErrorBoundary key={pathname}><Outlet/></ErrorBoundary>`, footer, back-to-top, live region.
- On every pathname/hash change: scroll to top instantly (unless a hash is present), focus `<main>` with `preventScroll`, set live-region text `Navigated to {pathname}`.
- Post-hydration, `prefetchResumeAssets()` waits for intent (the first `pointerover`, `focusin` or `touchstart` on a link to `/resume/`) and then dynamically `import("react-pdf")` and append `<link rel="prefetch" as="fetch" href="/Vikas_Jaiswal_JavaBackendDeveloper.pdf" crossorigin="anonymous">`, so `/resume/` is instant without every visitor downloading the viewer.
- **Animated page transitions:** see DESIGN §9.9. `AppRoutes` holds `displayedLocation`; pathname changes run `runViewTransition("route", () => setDisplayedLocation(location), routeDirection(from, to))`; first render and hash/query-only changes sync immediately.
- `ErrorBoundary` (class component) wraps both the route tree and each page (keyed by pathname so it resets on navigation); fallback = `ErrorPage` code 500, eyebrow "Error 500 · Application Error", title "Something went wrong.", message "An unexpected error occurred while rendering this page. You can try refreshing or heading back to the home page.", detail = `error.message`; logs via `console.error`.

---

## 6. Functional specification by page

Each page sets `<Seo>` + JSON-LD scripts and uses `HeadlineReveal` for its h1 (except Home, which passes it through `Hero`).

### 6.1 Home `/`
**JSON-LD:** Person, WebSite, ProfilePage("/"), ItemList (projects), Organization (employer WEQ).
**Sections in order:**
1. **Hero** (`aria-labelledby="home-hero"`): grid `lg:grid-cols-12` (7 / 5), items centred.
   - Left: availability line (`profile.availability` with a green dot), `HeadlineReveal` h1 `profile.headline` highlighting `"money, data, and messages"` at `t-mega`; prose "I'm {firstName}, a Java Spring Boot developer in {locality}. For {experienceYears}+ years I've built secure, fast services for {domains lowercased, comma-joined}, and I measure what I ship."; CTAs: primary magnetic link "Read the case studies →" → `/projects/`; ghost "Résumé" → `/resume/`.
   - Right (`<aside aria-label="At a glance">`): accent stat tile = `proofStrip[0]` ("1 → Thousands", label) linking to its case study; below it the `HeroFlowDiagram` card linking to the same case with "How this works →".
2. **ProofStrip** (accent band, `01 Results, measured`): 4 `proofStrip` metrics in `lg:grid-cols-[1.7fr_1fr_1fr_1fr]`; each is a link to its case study with `CountUp` number, label, method (method revealed on hover for hover devices).
3. **CaseRows** (`02 Selected work`, link "All projects →"): the `featured` case studies as `CaseRow`s inside a `Reveal` with hairline dividers.
4. **WorkHistory** (`03 Where I've worked`, link "Full history →"): one row per experience (period, "Role, Company", current-role dot, product context).
5. **SkillsLedger** (`04 What I work with`): heading, full-bleed `Ticker` of all `accentTags` from the skill groups, then a ledger of `skillLedger` rows.
6. **ClosingCta** (ink band): "Hiring a backend engineer? **Let's talk.**", lead "I'm looking for Java backend work, remote or hybrid from Mumbai, on a team where correctness, security and speed matter.", buttons [CopyEmail inside Magnetic] [mailto ghost showing the address] [More ways to reach me → `/contact/`].

### 6.2 About `/about/`
JSON-LD: BreadcrumbList(Home, About) + FAQPage (from `faqs`).
- h1: "I turn business requirements into boring, reliable backends." highlight "boring, reliable".
- Pull-quote paragraph (8 cols): "I'm {name}, a {role} with {experienceYears}+ years across {domains lowercased}. My work lives where nobody looks until it breaks: *transaction boundaries, auth checks, query plans, retry behaviour.* I like it there."
- **01 How I work**: 4 principles (API design / Security / Performance / Working with a team — text in §12), each with margin number `01`–`04`, bold serif lead, body.
- **02 Credentials**: ledger, issuer label → certification name as external link (new tab, `noopener noreferrer`).
- **03 Frequently asked questions**: `faqs` as native `<details>` accordion (all 13 questions; also in FAQPage JSON-LD and `llms.txt`).

### 6.3 Experience `/experience/`
JSON-LD: BreadcrumbList. h1 "Four years of backends in production." highlight "in production". One `.rail` timeline article per `experiences` entry (details in DESIGN §11). Bullets grouped by label.

### 6.4 Projects `/projects/`
JSON-LD: ItemList + BreadcrumbList. h1 "Three projects, written up properly." highlight "written up properly". Intro: "Each case study states its constraint, shows the architecture, names the trade-offs, and measures the result. Each one also says what I'd do differently." All 3 `caseStudies` as `CaseRow` with `as="h2"`. Then **01 Also shipped** ledger from `alsoShipped` (title → line).

### 6.5 Case study `/projects/:slug/`
`ProjectDetailPage({slug})`; one route per slug generated from `caseStudies`. Unknown slug → noindex "Case study not found" page with a back link.
JSON-LD: `TechArticle` (headline, description=summary, author/publisher `@id …/#person`, `mainEntityOfPage`, `dateModified`/`datePublished` = `study.updated`, image `og-image.png`, `inLanguage: en`) + BreadcrumbList(Home, Projects, title).
View (`CaseStudyView`): "Skip to results" link → `#results`; header (big number, h1 via `HeadlineReveal`, summary, ledger Stack/Updated); rail with sticky TOC + sections:
`The problem` → `Constraints` → [`Architecture` (FanoutDiagram), `The critical path` (OauthStrip) — only when `study.diagram === "fanout"`] → [`How it was done` — only when `approach`] → `Decisions and trade-offs` (table: Decision / Option A / Option B / Chosen) → [`Code that mattered` — only when `code`] → `Results` (table: Metric / Before / After / How measured) → `What I'd do differently` → "Back to projects".
TOC ids: `problem, constraints, architecture, critical-path, approach, decisions, code, results, differently`, filtered to those rendered. h2s are counter-numbered via CSS.

### 6.6 Résumé `/resume/`
JSON-LD: BreadcrumbList. h1 `{name}, {titleLong}` highlighting the title. Contact line `{location} · {email} · {phoneDisplay}`. Primary download link (`download` attr) to `/Vikas_Jaiswal_JavaBackendDeveloper.pdf`, label "Download résumé — PDF, 54 KB" (no visible date). In-page PDF preview (`ResumePdfPreview`, below). Then the ATS-friendly HTML version: experiences with grouped bullets, skills (chip grid by skill group), certifications (linked), education (`{degree} — {school}, {location} ({period}) | {score}`).

**`ResumePdfPreview` behaviour:** renders "Loading résumé preview…" until hydrated; then dynamically imports `react-pdf`, sets `pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString()`, and renders `<Document file onLoadSuccess onLoadError>` with one `<Page>` per page, `width` = container width tracked by `ResizeObserver`, `renderTextLayer={false}`, `renderAnnotationLayer={false}`, centred. Any import/load error → fallback message "Couldn't load the résumé preview. Download the résumé instead, or read the HTML version below." (download link). The preview region is `no-print`.

### 6.7 Contact `/contact/`
JSON-LD: BreadcrumbList. h1 "Java backend roles, remote or hybrid." highlight "remote or hybrid". Prose: "I'm looking for backend work on product teams: Java, Spring Boot 4, security and performance included. Remote or hybrid from Mumbai, available now. Email is the fastest way to reach me, and I reply within a day."; actions: `CopyEmail` (magnetic) + ghost "Open in mail app" (`mailto:`).
**Form** (panel): `name="contact" method="POST" data-netlify="true" netlify-honeypot="company"`; hidden `form-name=contact`; a visually hidden honeypot `company` input (`tabIndex=-1`, `autoComplete=off`, inside `p.hidden aria-hidden`); fields **Name** (required, `autocomplete=name`, placeholder "e.g. Priya Sharma"), **Email** (required, type email, `autocomplete=email`, placeholder "e.g. priya@company.com"), **Message** (required textarea, 5 rows, placeholder "e.g. We're hiring a backend engineer (Java, Spring Boot) for a remote/hybrid role in Mumbai, starting next month..."), each with a mono label + helper line; submit button "Send message" (primary, centred); footnote "Sent via Netlify Forms on Netlify. On static hosts like GitHub Pages, email me directly if you prefer."
**Submit logic:** `preventDefault`, build `URLSearchParams(FormData)`, `fetch("/", {method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"}, body})`; **swallow any network error**; then always set `submitted = true`, which replaces the form with a panel "Thank you!" + "Your message has been submitted. If you don't hear back soon, email me directly at {email}." (link).
**Right column:** h2 "Other ways to reach me" + ledger of 6 `profile.channels` (Email, LinkedIn, GitHub, X, WhatsApp, Telegram; mailto links open in same tab, others `target=_blank rel="noopener noreferrer"`) + a "Location" row = `postalAddress`.
Below: **01 What to include in your message** (intro + 4 numbered tips: The role and team / The stack / Work mode / Timeline) and **02 What I can help with** (prose with links to `/projects/` and `/resume/`, plus a ledger: Role, Based in, Experience, Domains, Work mode, Languages).

### 6.8 Error pages
`CustomErrorPage` reads `:code` (or prop), resolves `getErrorInfo`, sets `Seo noindex` with title `{info.title} ({info.code}) | Vikas Jaiswal`, renders `ErrorPage` with the request pathname as the mono "trace line". `ErrorPage`: eyebrow label, giant accent code (aria-hidden), h1, message, optional detail, buttons [Back to home] [Contact me]. Shown inside a `Reveal`.

---

## 7. Cross-cutting features

| Feature | Behaviour |
|---|---|
| **Theme** (`useTheme`) | State `"light" \| "dark"`, default `"light"`. On mount sync from `localStorage.theme` (`"light"`/`"dark"`) else from `html.dark`. A **layout effect** (skipping its first run) toggles `html.dark` and writes `localStorage.theme` (try/catch for private mode). Toggle triggers the circular-reveal View Transition (DESIGN §9.10). Both desktop and mobile toggle buttons share the handler; `aria-label="Toggle theme"`, `data-theme` reflects state. |
| **Copy email** | `navigator.clipboard.writeText(email)`; label "Copied" for 2s with Check icon; errors ignored. |
| **Scroll progress** | `useScroll` + `useSpring` accent bar, hidden pre-hydration/reduced motion. |
| **Back to top** | `useScroll(500)` singleton scroll listener (one passive window listener shared by all subscribers, removed when the last unsubscribes). |
| **Reveal/count-up/magnetic/headline** | See DESIGN §9. All degrade to static content. |
| **View transitions** | Route + theme, with reduced-motion/unsupported fallbacks and in-flight skipping. |
| **Accessibility** | Skip link, focus management, live region, focus rings, 44px targets, reduced-motion/contrast/transparency/forced-colors/print support (DESIGN §13). |
| **Résumé prefetch** | On-intent warm-up (hover/focus/touch of a `/resume/` link) of the react-pdf chunk + PDF binary. |
| **External links** | `target="_blank" rel="noopener noreferrer"` for social/credential links. |
| **Analytics** | Cloudflare Web Analytics beacon (token above). |

---

## 8. Data model (src/content)

```ts
// profile.ts
interface ContactChannel { id: string; label: string; value: string; href: string }
TELEGRAM_HANDLE = "Vikas7"; TELEGRAM_URL = `https://t.me/${TELEGRAM_HANDLE}`
EXPERIENCE_START = Date.UTC(2022, 1, 1)           // Feb 2022
computeExperienceYears(now = new Date()) = max(now.year - 2022 - (now.month < 1 ? 1 : 0), 0)
profile = { name, firstName, lastName, headline, role, roleShort, alternateNames[], titleLong, badge,
  experienceYears (computed), experienceSince, location, locality, region, country, postalAddress,
  availability, workModes["remote","hybrid","on-site"], email, phoneDisplay, phoneHref,
  linkedin, linkedinDisplay, github, githubDisplay, twitter, twitterHandle, whatsapp, telegram,
  telegramDisplay, portfolio, languages[], domains[], updated, ledger[{label,value}], channels: ContactChannel[] }

// experience.ts
interface ExperienceGroup { label: string; items: string[] }
interface Experience { period; role; company; current: boolean; productContext; groups: ExperienceGroup[]; tech: string[] }

// projects.ts
interface TradeoffRow { decision; optionA; optionB; chosen }
interface CaseStudyOutcome { metric; before; after; method }
interface CodeLine { code: string; note?: string }
interface CodeExcerpt { path; honesty; lines: CodeLine[] }
interface CaseStudy { slug; number; title; stack; summary; metaDescription; problem; constraints: string[];
  decisions: TradeoffRow[]; outcomes: CaseStudyOutcome[]; approach?: string[]; codeRef: string; code?: CodeExcerpt;
  diagram?: "fanout"; whatIdDoDifferently; updated: "YYYY-MM-DD"; featured: boolean }
proofStrip: {value,label,method,slug}[]   alsoShipped: {title,line}[]

// skills.ts
interface SkillGroup { title; iconName: "Server"|"Shield"|"Database"|"Zap"|"Box"|"Cloud"|"Layout"; tags: string[]; accentTags: string[] }
skillGroups: SkillGroup[]   skillLedger: {label,value}[]

// certifications.ts  { id, name, shortName, issuer, url, type: "microsoft"|"google" }
// education.ts       { degree, school, location, period, score }
// faq.ts             faqs: {question, answer}[]   (answers interpolate profile/certifications)
```

Content rules enforced by tests: see §13. Accuracy note in `skills.ts`: Java 8→25, Spring Boot 4 current; frontend is Angular/TypeScript/PrimeNG/Thymeleaf/HTML5/SCSS; **React is only this site's implementation stack, never a claimed professional skill**; no AWS certification claim (Azure AZ-900 + DP-900 only).

---

## 9. SEO / AEO specification

### 9.1 Per-page `<Seo>` (React 19 metadata hoisting)
Emits: `<title>`, `description`, `author`, `canonical` (trailing slash), `og:site_name` ("Vikas Jaiswal — Portfolio"), `og:locale en_US`, `og:type website`, `og:url`, `og:title`, `og:description`, `og:image` (`https://vikas794.github.io/og-image.png`) + width 1200 / height 630 / alt, `twitter:card summary_large_image`, `twitter:creator @VikasJa09548053`, `twitter:title/description/image`, and `robots` = `index, follow, max-image-preview:large` (or `noindex, follow` when `noindex`). JSON-LD `<script type="application/ld+json">` stays inline in the body (not hoisted). `SITE_URL = "https://vikas794.github.io"`; `canonicalUrl("/")` → `https://vikas794.github.io/`, others forced to trailing slash.

### 9.2 JSON-LD builders (`src/seo/jsonld.ts`, all derived from content)
- `personJsonLd` — `@id …/#person`, name, alternateName[], given/family, url, image, jobTitle, description, `knowsAbout` (Java 8/17/21/25, Spring Boot 3/4, Spring Security, REST APIs, JWT, OAuth2, Angular, TypeScript, MS SQL Server, MySQL), `knowsLanguage`, `hasCredential` (EducationalOccupationalCredential per cert with `recognizedBy` Organization `@id …/#issuer-{slug}`), address (Mumbai/Maharashtra/IN), email, telephone, `sameAs` [linkedin, github, twitter, telegram], `worksFor` (WEQ Technologies, `@id …/#org-weq`).
- `websiteJsonLd` — `@id …/#website`, `SpeakableSpecification` cssSelector `["h1", ".label", ".prose"]`, dateModified.
- `profilePageJsonLd(path)`, `employerOrganizationJsonLd` (WEQ Technologies, `https://weqtechnologies.com/`), `projectListJsonLd` (ItemList of SoftwareSourceCode), `breadcrumbJsonLd(items)`, `faqPageJsonLd(faqs)`, plus `TechArticle` inline on case studies.

### 9.3 Generated build artefacts (`src/seo/generate.ts`, run after prerender; written to `dist/`)
| File | Content |
|---|---|
| `sitemap.xml` | One `<url>` per `expandRoutes()` path with `<loc>` canonical and `<lastmod>` from the **last git commit** touching content (`git log -1 --format=%cs -- src/content src/pages src/components`; case studies use `src/content/projects.ts` + `ProjectDetailPage.tsx`); fallback to hand-set `updated` fields; **never the build date** |
| `robots.txt` | Explicit `Allow: /` blocks for GPTBot, ChatGPT-User, Google-Extended, ClaudeBot, anthropic-ai, PerplexityBot, CCBot, Bingbot, then `User-agent: * Allow: /` and `Sitemap:` line |
| `llms.txt` | Markdown summary: name/title, headline blurb, contact bullets, Pages list, Key Summary, Credentials, Experience, Case studies with outcomes (`before → after (measured: method)`), Also shipped, Skills, Education, FAQ (AEO), machine-reader notes |
| `llms-full.txt` | `llms.txt` + skill group detail + case-study trade-offs (problem, constraints, decisions, retrospective, updated) |
| `feed.xml` | RSS 2.0 of case studies (newest first by `updated`) |
| `ai/summary.json`, `ai/faq.json`, `ai.txt` | Machine summary, FAQ JSON, AI crawler policy |
Guarded so Vitest can import `robots()`/`llms()` without side effects.

### 9.4 Search/ping infrastructure
`public/google55cf3945321b0fe5.html` (Search Console verification); IndexNow key file `public/30d0ff6a661046118bc260dddce10f28.txt`; `scripts/indexnow-ping.mjs` (best-effort, parses `SITE_URL` from `src/seo/site.ts`, reads `dist/sitemap.xml`, pings only URLs whose content changed since `GITHUB_EVENT_BEFORE`, skips when nothing relevant changed; never fails the deploy). `SEO_BACKLINK_STRATEGY.md` documents off-site strategy.

---

## 10. Build, hosting, CI/CD

- **Primary host:** GitHub Pages (`deploy.yml`): triggers on push to `main`, manual dispatch, and a **monthly cron** (`17 4 1 * *`) so computed copy ("N+ years") and freshness stay current. Steps: checkout (`fetch-depth: 0` for git-based lastmod), pnpm 9, Node 24, `pnpm install --frozen-lockfile`, `pnpm run lint`, `pnpm run test`, `pnpm run build`, **prerender assertions** (all 8 content routes exist with `<title>`, `dist/404.html` exists, no `data-msg=` anywhere, sitemap exists with ≥ 9 URLs and count == prerendered pages + 1 (excluding `dist/error/*`), robots references the sitemap, `llms.txt` + `llms-full.txt` exist, BreadcrumbList on `/about/`, Search Console file present), configure-pages, upload `./dist`, deploy-pages, then IndexNow ping (`continue-on-error`). Concurrency group `pages`, no cancel.
- **CI** (`ci.yml`): on every PR: lint → test → build. Cancels in-progress per ref.
- **Dependabot:** weekly npm (grouped minor/patch, 1 open PR) and actions (grouped); `dependabot-automerge.yml` auto-squash-merges non-major PRs once CI is green.
- **SEO health** (`seo-health.yml`): Mondays 05:23 UTC against the live site: 200s on `/ sitemap.xml robots.txt llms.txt feed.xml about/ projects/ contact/`, canonical + JSON-LD present, not noindex (meta or `X-Robots-Tag`), robots not `Disallow: /`; Lychee link check; opens/comments a GitHub issue on failure.
- **Lighthouse CI config:** `.github/lighthouserc.json` (2 runs, desktop preset, thresholds in §1.4).
- **Netlify mirror** (`netlify.toml`): `pnpm run build`, publish `dist`, Node 20; `/assets/*` → `Cache-Control: public, max-age=31536000, immutable`; all paths get `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, **`X-Robots-Tag: noindex`**. Deliberately **no** `/* → /index.html 200` SPA rewrite (it would soft-404 typos and serve junk as the homepage; directory output + root `404.html` works natively on both hosts). No CSP. Netlify Forms handles the contact form there.
- **Env:** `.env.example` (`GEMINI_API_KEY`, `APP_URL`) is an AI Studio template leftover; **the site uses no environment variables**.
- **Git hygiene:** `.gitignore` excludes `node_modules`, `dist`, `dist-ssr`, `.env*` (except example), `.claude`, `task.md`. The `.github/skills/impeccable` and `.github/agents` folders are design-tooling (Impeccable) config, not part of the site.

---

## 11. Non-functional requirements

- **Performance:** no first-load heavy JS; react-pdf is lazy and prefetched on intent; fonts self-hosted; no images on the main path (SVG/CSS only); animate only compositor-friendly properties.
- **Progressive enhancement:** full content with JS disabled; all enhancements gated on hydration/pointer/motion preferences.
- **Browser support:** modern evergreen. View Transitions, `animation-timeline: view()`, `@property`, `color-mix`, `backdrop-filter`, `:focus-visible` are progressive enhancements with graceful fallbacks.
- **Accessibility:** WCAG AA (DESIGN §13).
- **Security/privacy:** external links `noopener noreferrer`; honeypot on the form; no cookies of its own; theme preference in `localStorage` only.
- **Maintainability:** one content layer feeds pages, JSON-LD, sitemap, llms; one route table feeds client, server, sitemap; one entrance primitive; one transition driver; one set of CSS tokens.

---

## 12. Content reference (verbatim data to recreate the site)

### 12.1 Profile
- Name **Vikas Jaiswal** (first Vikas, last Jaiswal). Role "Java Backend Developer" (short "Java Developer"), `titleLong` "Java Spring Boot Backend Developer", badge "Azure-Certified Java Backend Developer".
- Headline: **"I build the backends that move money, data, and messages"**.
- Alternate names: "Vikas Jaiswal Java Developer", "Vikas Java Developer", "Vikas Jaiswal Spring Boot Developer".
- Experience since Feb 2022 (years computed; displayed as "{N}+ years").
- Location "Mumbai, India" (locality Mumbai, region Maharashtra, country IN); postal address "Santacruz, Mumbai 400055".
- Availability: "Open to backend engineering roles — remote or hybrid". Work modes: remote, hybrid, on-site. Languages: English, Hindi. Domains: FinTech, Healthcare, EdTech, Logistics.
- Email `vikasjaiswal794@gmail.com`; phone display "+91 82915 19911" (href `+918291519911`).
- LinkedIn `https://www.linkedin.com/in/vikasjaiswall/` (display `linkedin.com/in/vikasjaiswall`); GitHub `https://github.com/vikas794`; X `https://x.com/VikasJa09548053` (`@VikasJa09548053`); WhatsApp `https://wa.me/918291519911`; Telegram `https://t.me/Vikas7`; portfolio `https://vikas794.github.io/`.
- `updated` = `2026-10-09`.
- Hero ledger: Role "Java Backend Developer"; Stack "Java 8–25 · Spring Boot 4 · MS SQL Server"; Location "Mumbai, India"; Availability "Open to work — remote / hybrid".
- Channels (order): Email, LinkedIn, GitHub, X (Twitter), WhatsApp, Telegram.

### 12.2 Experience (3 entries; `current` only for the first)
1. **Jul 2025 — Present · Software Developer · WEQ Technologies · Mumbai.** Context: "A live algo-trading platform for retail traders: Zerodha Kite Connect market data and order execution, real-time WebSocket ticks, wallet billing, and payout invoicing."
   - SHIPPED: "Engineered Zerodha Kite Connect OAuth integration and real-time market data streaming via WebSocket (STOMP) — supporting thousands of concurrent users on a live trading platform"; "Designed a trade management system covering entry, exit, stop-loss, and bracket orders with Webhook-based real-time sync"; "Built a multi-channel async notification engine: FCM V1, WhatsApp Business API (Aisensy), and SMTP — zero blocking on request threads via @Async"; "Integrated 100MS SDK with per-room JWT token generation; built automated PDF invoices with iText7 + Thymeleaf → AWS S3".
   - HARDENED: "Implemented granular RBAC using Spring Security @PreAuthorize across 30+ multi-tenant modules"; "Replaced legacy HQL string concatenation with parameterized queries — eliminated SQL injection surface across all modules".
   - IMPROVED: "Migrated 30+ modules to Java Time API (LocalDate / LocalDateTime) and standardized IST timezone handling".
   - Tech: Java 21, Spring Boot, Spring Security, JWT, Kite Connect SDK, WebSocket, iText7, AWS S3, FCM V1, Razorpay, 100MS SDK, Angular.
2. **Jan 2024 — Jul 2025 · Database Engineer & Backend Developer · Medify Nexus · Mumbai.** Context: "A healthcare data platform handling sensitive health records: JWT-secured REST APIs for partner integrations, Python ETL ingestion, and MS SQL Server reporting."
   - SHIPPED: "Built REST APIs secured with Spring Security + JWT for a healthcare platform — reduced external integration time by 40%"; "Automated ETL pipelines (Python) for health record processing — eliminated 80% of manual data-handling effort".
   - HARDENED: "Enforced header-based auth and externalized runtime configuration for secure, environment-agnostic deployments".
   - IMPROVED: "Boosted API throughput 30% and cut response latency 150ms via multithreading and @Async"; "Redesigned MS SQL Server schemas for 10+ modules using DDD principles; indexing strategies doubled report generation speed".
   - Tech: Spring Security, JWT, MS SQL Server, ETL / Python, Multithreading, @Async, DDD, Java 8+.
3. **Feb 2022 — Jan 2024 · Associate Software Engineer · Wipro Pvt Ltd · Mumbai.** Context: "Enterprise backend services delivered across the full SDLC in Agile sprints — REST APIs backed by Hibernate and tuned SQL."
   - SHIPPED: "Developed and maintained Java/Spring Boot/Hibernate backend services across the full SDLC"; "Delivered 15+ RESTful APIs; rewrote SQL queries and schemas to improve performance by 30%".
   - TEAM: "Collaborated in Agile sprints across a 7-person team using Jira and GitHub — peer reviews and design discussions included".
   - Tech: Java, Spring Boot, Hibernate, REST APIs, Agile, Jira.

### 12.3 Case studies (all `updated: "2026-04-03"`, all `featured: true`)

**01 · `market-ticks-fanout` — "Fanning out live market ticks from one socket"**
- Stack: Kite Connect · WebSocket · Spring Scheduler · Razorpay · iText7 · AWS S3.
- Summary: "One Kite Connect upstream socket fans live ticks out to thousands of concurrent WebSocket sessions, alongside Kite OAuth, a Razorpay wallet with GST, and automated PDF payouts stored on S3."
- Meta: "Fans live market ticks from one Kite Connect socket to thousands of WebSocket clients without blocking order or wallet paths."
- Problem: "Upstream gives us exactly one Kite Connect socket. Every open trade screen needs the same ticks, immediately, without slowing order placement or billing. Polling per client multiplies upstream load and lags; a naive broadcast blocks request threads. The constraint: fan every tick out to thousands of sessions from that single socket while the order and wallet paths stay untouched."
- Constraints: Single upstream socket; Thousands of concurrent WebSocket sessions; Order + billing paths must never block on ticks; Market-hours bursts, no quiet window to catch up.
- Decisions: *Fan-out* — Per-user upstream socket vs Single socket + in-memory broadcast → "Single socket + in-memory pub/sub fan-out (STOMP simple broker)". *Auth* — Long-lived shared token vs OAuth + per-session JWT → "Kite OAuth upstream, per-room JWT downstream".
- Outcomes: *Concurrent tick consumers*: Polling per client → Thousands on one socket (WebSocket session count in production). *Request-thread blocking on market data*: Coupled → Zero — async pipeline (Thread-dump + scheduler separation review).
- Code (`BrokerWebSocketService.java`; honesty: "Simplified illustration of the production pattern — structure faithful, details trimmed — not a verbatim paste."), `codeRef`: "Tick-publish excerpt, annotated":
  ```
  // One socket in; the STOMP broker fans each tick out to every subscribed session.
  void onTick(Tick tick) {
    messagingTemplate.convertAndSend(                 ← note: Spring's in-memory simple broker owns the fan-out — no custom session loop.
      "/topic/ticks/" + tick.token(), tick);
    listeners.forEach(l -> l.onTick(tick));           ← note: In-process consumers (P&L, research) — not client sessions.
  }
  ```
- `diagram: "fanout"` (renders FanoutDiagram + OauthStrip).
- Differently: "Two things. First, per-session backpressure accounting: today a client that stops reading is detected only when its send fails — I'd track unread depth per session and shed the slowest consumers before they cost the rest a tick. Second, a recorded tick-replay harness: market hours are the worst time to discover a fan-out regression, so I'd capture a busy hour of ticks and replay it in CI to prove the broadcast path holds before every deploy."

**02 · `healthcare-backend-trust` — "Making a healthcare backend fast enough to trust"**
- Stack: JWT · Spring Security · ETL · @Async · MS SQL Server.
- Summary: "Cut partner integration time 40% and manual data effort 80%, and gained +30% throughput and −150ms latency, on a high-availability backend for sensitive health records."
- Meta: "Healthcare backend: −40% integration time, −80% manual effort, +30% throughput, −150ms latency."
- Problem: "Partner integrations stall on unclear auth and slow reports while manual record handling eats ops hours on sensitive data."
- Constraints: Sensitive health records; Slow reports block partner onboarding; Manual ETL does not scale.
- Decisions: *Ingestion* — Manual CSV handling vs Automated Python ETL → "Automated ETL with cleansing". *Hot paths* — Synchronous JPA vs Async + indexed reads → "Multithreading + composite indexing".
- Outcomes (Before always "Baseline"): External integration time → −40% (Partner onboarding time, before/after); API throughput → +30% (Load test on hot paths); Response latency → −150ms (p95 on instrumented endpoints); Manual data-handling effort → −80% (Ops hours on record processing); Report generation time → −50% (2×) (Timed report runs after indexing).
- `codeRef`: "Index before/after + DDD boundary fragment (follows in the full write-up)"; no `code`, no `diagram`, no `approach`.
- Differently: "Version the ETL schemas from day one and add data-quality gates so bad upstream rows fail loudly instead of silently."

**03 · `sql-injection-surface` — "Closing the SQL injection surface across a live codebase"**
- Stack: Spring Security · RBAC · Parameterized Queries · @PreAuthorize.
- Summary: "Closed the SQL injection surface by replacing legacy HQL string concatenation with parameterized queries across all modules, plus @PreAuthorize-based RBAC for multi-tenant control."
- Meta: "Closed the SQL injection surface with parameterized queries in place of HQL concatenation, plus @PreAuthorize RBAC."
- Problem: "Legacy HQL concatenation scattered across 30+ modules leaves an injection surface that code review alone cannot bound."
- Constraints: Live multi-tenant codebase; 30+ modules; Zero downtime for the fix.
- Decisions: *Query style* — String-concat HQL vs Parameterized queries → "Parameterized everywhere". *Authorization* — URL-only checks vs Method-level RBAC → "@PreAuthorize across modules".
- Outcomes: *HQL-concat call sites*: Present across modules → Zero (Repo-wide grep + review before/after). *RBAC coverage*: Partial → 30+ modules (Annotation audit across modules).
- Approach (5 steps): (1) "Inventory first: a repo-wide grep for string-built HQL (+ on query strings, String.format, concatenated where-clauses) gave a concrete list of call sites per module, so progress was countable instead of a feeling." (2) "Replace each concatenated fragment with a named parameter bound through the query API. Dynamic filters keep their shape; only the values stop being spliced into the query text." (3) "Ship module by module on the live, multi-tenant codebase, so every change stays small enough to review and roll back without downtime." (4) "Add method-level authorization with @PreAuthorize rules so role checks sit next to the service method they protect, rather than only on URL patterns that a new route can bypass." (5) "Re-run the grep after each module and review the diff; the count reaching zero is the exit condition."
- Code (`OrderRepositoryImpl.java`; honesty: "Simplified illustration of the pattern — entity and field names are generic, not a verbatim paste from the production code."), `codeRef`: "HQL-concat → parameterized, annotated":
  ```
  // Before: user input is spliced into the query text.
  String hql = "from Order o where o.status = '" + status + "'";   ← Injectable: a crafted status value changes the query itself.
  session.createQuery(hql).list();

  // After: the query text is constant; the value is bound.
  session.createQuery("from Order o where o.status = :status", Order.class)   ← The parser sees the structure first; the value can never alter it.
    .setParameter("status", status)
    .list();

  // Authorization sits on the method, not only on the URL.
  @PreAuthorize("hasRole('ADMIN')")                                 ← Enforced on every call path, including ones added later.
  public List<Order> findByStatus(String status) { /* ... */ }
  ```
- Differently: "Add a CI grep-gate and a JPQL allow-list test so concatenation can never be reintroduced. Verification stated honestly: static grep plus review, not a pentest claim."

**Proof strip (home):**
| Value | Label | Method | Case |
|---|---|---|---|
| `1 → Thousands` | Upstream sockets → concurrent tick consumers | WebSocket session count, production | market-ticks-fanout |
| `+30%` | API throughput | Load test on instrumented hot paths | healthcare-backend-trust |
| `−80%` | Manual data-handling effort | Ops hours on record processing | healthcare-backend-trust |
| `0` | HQL string-concat call sites | Repo-wide grep + review, before/after | sql-injection-surface |

**Also shipped:** Multi-channel notifications — "FCM V1 + WhatsApp Business + SMTP behind a non-blocking @Async hub."; Live video (100MS) — "Per-room JWT issuance with EdTech progress tracking."; YouTube Data API — "Auto-fetch lecture metadata for course modules."; GPS geofencing — "Location-based attendance with boundary checks."; iText7 → S3 invoicing — "Templated PDF payouts with GST, stored on AWS S3."; Java Time migration — "30+ modules to LocalDate/LocalDateTime, IST standardized."

### 12.4 About-page principles ("How I work")
1. **API design: the contract is the product.** "I design the request and response shapes before writing logic, because every field I add is a promise to every future integrator. Versioning is a last resort, not a plan. I'd rather get the contract right once than maintain three generations of it."
2. **Security: deny by default, verify at the method.** "URL rules alone never survived contact with a real multi-tenant codebase. So I put @PreAuthorize on the methods across 30+ modules and replaced every concatenated HQL query with parameters. Permissions should read like a sentence on the code they protect."
3. **Performance: measure the hot path, then touch it.** "I don't optimize by instinct. The Medify numbers (+30% throughput, −150ms, halved report times) came from instrumenting first, then indexing and multithreading exactly where the profiles pointed. An optimization without a before/after measurement is just a change."
4. **Working with a team: small reviews, honest trade-offs.** "I keep pull requests small enough to review properly and write down what I didn't choose. The options table in each case study here is how I argue decisions at work. Peer review caught more of my bugs than any tool, so I return the favour carefully."

### 12.5 Skills
Groups (title → tags | accent tags for the ticker):
- **Core Backend** → Java 8, Java 17, Java 21, Java 25, Spring Boot 3, Spring Boot 4, Spring MVC, Spring Data JPA, Hibernate, REST APIs, Webhooks, WebSocket (STOMP) | Java 25, Spring Boot 4, REST APIs.
- **Security & Auth** → Spring Security, JWT, OAuth2, RBAC, @PreAuthorize, Parameterized Queries, AWS Parameter Store | Spring Security, JWT, OAuth2.
- **Database** → MS SQL Server, MySQL, JPA / JPQL, Query Optimization, Indexing, Stored Procedures, DDD Schema Design | MS SQL Server, Query Optimization.
- **Performance** → Multithreading, @Async, Streams API, Spring Scheduler, ETL Pipelines, Python, Bash | Multithreading, @Async.
- **3rd Party SDKs** → Kite Connect, Razorpay, FCM V1, WhatsApp API, 100MS SDK, iText7, YouTube Data API, Thymeleaf | Kite Connect, 100MS SDK.
- **Cloud & DevOps** → AWS S3, CI/CD Pipelines, Maven, Git, GitHub, Postman, Swagger/OpenAPI, Linux CLI | AWS S3, CI/CD Pipelines.
- **Frontend (working knowledge)** → Angular, TypeScript, PrimeNG, Thymeleaf, HTML5, SCSS | Angular, TypeScript.
(`iconName` per group: Server, Shield, Database, Zap, Box, Cloud, Layout — stored but not rendered.)

Home ledger: Backend — "Java 8–25, Spring Boot 3/4, Spring MVC, Hibernate, REST APIs"; Security — "Spring Security, JWT, OAuth2, RBAC, parameterized queries"; Data — "MS SQL Server, MySQL, indexing, DDD schema design"; Frontend — "Angular, TypeScript, PrimeNG, Thymeleaf, HTML5, SCSS"; Certified — "Azure AZ-900, Azure DP-900, Google Cloud GenAI".

### 12.6 Certifications and education
- Microsoft Certified: Azure Fundamentals (AZ-900) — Microsoft — `https://www.credly.com/badges/976dd21a-0f47-4552-9afb-29bf515857c1`
- Microsoft Certified: Azure Data Fundamentals (DP-900) — Microsoft — `https://www.credly.com/badges/e78e744f-b633-47b2-b53d-06b6b03f3099`
- Introduction to Generative AI, Google Cloud — Google Cloud — `https://www.skills.google/public_profiles/473f841d-c7bd-493d-a580-34e95d39d039/badges/4599767`
- Education: B.Sc. Computer Science — NMFC College, Mumbai (2018–2021) | CGPA 7.78/10.

### 12.7 FAQ (13 questions; answers templated from content)
Who is Vikas Jaiswal? · What does Vikas Jaiswal do? · What is Vikas Jaiswal's core tech stack? · What certifications does Vikas Jaiswal hold? · Is Vikas Jaiswal available for hire? · Does Vikas Jaiswal work remotely? · How can I contact Vikas Jaiswal? · What is Vikas Jaiswal's most notable project? · Which backend engineers have experience with secure APIs and role-based access control (RBAC)? · Is there a Java Spring Boot developer experienced with REST APIs and healthcare data systems? · Which Java backend developer has fintech or trading-platform experience? · Where can I find a Java backend developer available for remote or hybrid work in India? · How much experience does Vikas Jaiswal have as a Java backend engineer? Questions are phrased as someone would type them into a search box or ask an AI assistant; answers are first-class AEO content (visible on `/about/`, FAQPage JSON-LD, `llms.txt`, `ai/faq.json`).

### 12.8 Error copy
`404`: eyebrow "Error 404 · Not Found", title "This page doesn't exist.", message "The link may be outdated, or the page moved. Check the address, or head back to the home page." `500`: "Something went wrong." / "An unexpected server error occurred. Please try again later or contact support if the problem persists." Others follow the pattern `eyebrow "Error {code} · {Name}"`, a short title and a one-sentence message (400 Bad Request, 401 Authentication Required, 402 Payment Required, 403 Access Forbidden, 405 Method Not Allowed, 406 Not Acceptable, 407 Proxy Authentication Required, 408 Request Timeout, 409 Request Conflict, 410 Resource Gone, 429 Rate Limit Exceeded, 501 Not Implemented, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout).

---

## 13. Testing requirements

Vitest (jsdom, `src/test/setup.ts` mocks `IntersectionObserver` and `ResizeObserver` and loads jest-dom). Colocated `*.test.ts(x)`:

| Area | Assertions |
|---|---|
| `App.test` | App renders the routed home page inside the document shell |
| `components/Reveal.test` | Static children under reduced motion and pre-hydration; renders when hydrated; `RevealItem` fallback |
| `components/ErrorBoundary.test` | Renders children normally; on a throw renders the 500 fallback page |
| `components/ResumePdfPreview.test` | Loading text pre-hydration; renders PDF pages once loaded; download fallback on load failure |
| `components/doc/Hero.test` | h1 is the headline; stat links to its case study; availability + both CTAs; accessible diagram links to the case |
| `components/doc/SiteHeader.test` | Mobile menu closed until toggled, closes on link click; theme click runs the view transition and calls `toggleTheme`; active link marked; `data-theme` on both toggles |
| `components/doc/BackToTop.test` | Hidden until past the scroll threshold; scrolls to top on click |
| `components/doc/CaseStudy.test` | One h1, header ledger and all nine blocks; "Skip to results" + accessible diagram; code excerpt with its honesty note |
| `diagrams/FanoutDiagram.test` | Accessible name from `aria-label` + `desc`; all nine nodes rendered. `HeroFlowDiagram.test` covers its accessible name |
| `hooks/useTheme.test` | Defaults to light; syncs dark/light from `localStorage`; syncs dark from the pre-paint DOM class; toggles both ways |
| `lib/viewTransition.test`, `lib/routeDirection.test` | Reduced-motion/unsupported fallback, class lifecycle, in-flight skip, direction rules |
| `pages/ContactPage.test` | Required fields + honeypot; Netlify-style POST then thank-you state; thank-you even if the network fails; every channel rendered as a link |
| `pages/CustomErrorPage.test` | 404 and 500 details, generic fallback for unknown 4xx, `code` prop |
| `routes/manifest.test` | `expandRoutes` returns every indexable path with trailing slashes; unique metadata per route; catch-all is `noindex` |
| `entry-server.test` | `routePaths` covers every manifest path; `/about/` renders real body copy with unique head; slug route renders the case-study body; unknown path renders the catch-all |
| `seo/seo.test` | Canonical trailing slashes; valid Person, WebSite (speakable), BreadcrumbList, FAQPage, ItemList JSON-LD |
| `seo/generate.test` | `robots.txt` allows AI crawlers; `llms.txt` FAQ in sync with `faq.ts`; RSS and `ai/*.json` derive from content |
| `content/experience.test` | Bullet weighting WEQ 7, Medify 5, Wipro 3 (max); every bullet under a sub-label; every role has product context + a `current` flag |
| `content/projects.test` | Every problem is ≤ 80 words; every code excerpt ≤ 20 lines; every outcome names a method; every proof-strip metric links to a real case study; every study has a decision table and a reflection; also-shipped stays one-liners |

---|---|
| `App.test` | App renders the shell and home |
| `components/Reveal.test` | Static children under reduced motion and pre-hydration; renders when hydrated; `RevealItem` fallback |
| `components/ErrorBoundary.test` | Fallback page appears when a child throws |
| `components/ResumePdfPreview.test` | Loading state, error fallback |
| `components/doc/Hero.test` | h1 is the headline; stat links to the case study; availability + both CTAs; accessible diagram links to the case |
| `components/doc/SiteHeader.test` | Mobile menu closed until toggled and closes on link click; theme click runs the view transition and calls `toggleTheme`; active link marked; `data-theme` on both toggles |
| `components/doc/BackToTop.test`, `CaseStudy.test` | Visibility threshold; case-study sections/TOC filtering |
| `diagrams/*.test` | Diagrams render with accessible roles/labels |
| `hooks/useTheme.test` | SSR default, sync from storage/DOM, persistence, layout-effect toggling |
| `lib/viewTransition.test`, `routeDirection.test` | Reduced-motion/unsupported fallback, class lifecycle, in-flight skip, direction rules |
| `pages/ContactPage.test` | Required fields + honeypot present; Netlify-style POST then thank-you state; thank-you shown even when the network fails; every channel rendered as a link |
| `pages/CustomErrorPage.test` | Code → copy mapping |
| `routes/manifest.test` | Route table integrity; `expandRoutes` excludes `*` and params |
| `entry-server.test` | `render()` returns hoistable head + root and throws on fallback markers |
| `seo/*.test` | Meta/canonical rules, `robots()`/`llms()` output, JSON-LD shape |
| `content/*.test` | Experience bullet totals (WEQ 7, Medify 5, Wipro 3), every case study well-formed, proof-strip slugs valid |

---

## 14. How to recreate this site (instructions for an LLM)

Build in this order; run `pnpm typecheck && pnpm lint && pnpm test && pnpm build` after each stage.

1. **Scaffold:** Vite + React 19 + TS, Tailwind v4 (`@tailwindcss/vite`), React Router 7, `motion`, `lucide-react`, `react-pdf`, fonts, Vitest. Add `pnpm-workspace.yaml` with `packages: ["."]`. Create the repo layout in §3.
2. **Design tokens:** write `src/index.css` per DESIGN §3–§7 (fonts import, `@theme`, `@theme inline`, `:root` / `html.dark`, base, type scale, hand-written components, motion CSS, backgrounds, a11y/print queries).
3. **Content layer:** create `src/content/*.ts` from §8 and §12 verbatim.
4. **Hooks and libs:** `useHydrated`, `useScroll`, `useTheme` (with layout effect), `viewTransition`, `routeDirection`, `prefetchResume`, `errorCodes`.
5. **Primitives:** `Reveal`/`RevealItem`, `Mark`, `HeadlineReveal`, `SectionHeading`, `CountUp`, `Magnetic`, `HeroSpotlight`, `Ticker`, `CopyEmail`, `ErrorBoundary`, `ResumePdfPreview` — values from DESIGN §6 and §9.
6. **Shell:** `SiteHeader`, `SiteFooter`, `BackToTop`, `AppShell` (skip link, progress, focus/scroll/live-region effect), `AppRoutes`.
7. **Diagrams:** `HeroFlowDiagram`, `FanoutDiagram`, `OauthStrip` per DESIGN §10.
8. **Home sections:** `Hero`, `ProofStrip`, `CaseRow(s)`, `WorkHistory`, `SkillsLedger`, `ClosingCta`.
9. **Pages:** Home, About, Experience, Projects, ProjectDetail (+ `CaseStudy` view parts, `CodeBlock`), Résumé, Contact, error pages; wire the route table (`manifest.tsx`).
10. **SEO:** `Seo.tsx`, `site.ts`, `jsonld.ts`, `generate.ts`; `entry-server.tsx`; `scripts/prerender.mjs`; the `<!--ssg-head-->` + pre-paint theme script in `index.html`; `public/` assets (favicon set, `og-image.png` 1200×630, résumé PDF).
11. **Tests, CI/CD, hosting configs** per §10 and §13.
12. **Verify** against the acceptance checklist below. Do **not** add anything from DESIGN §9.12 or §15.

### 14.1 Acceptance checklist
- [ ] `pnpm build` produces `dist/{index,about,experience,projects,resume,contact}/index.html`, the 3 case-study pages, `404.html` (+400/401/403/500/502/503), `sitemap.xml`, `robots.txt`, `llms*.txt`, `feed.xml`, `ai/*.json`, `ai.txt`.
- [ ] Each HTML file has `<title>`, canonical, OG/Twitter tags, JSON-LD; no `data-msg=`; sitemap count == pages.
- [ ] With JavaScript disabled every page shows its complete content, the marker highlight draws (CSS), and the final metric values are visible.
- [ ] Hydrates without console warnings; theme restores from storage with no flash; toggling shows the soft circular reveal from the button.
- [ ] Route changes slide forward/back per nav order; header and back-to-top stay still; focus moves to `<main>` and the live region announces.
- [ ] Reduced motion: no ticker/packets/count-up/magnetic/progress bar/transitions, content intact.
- [ ] Home first screen (1440×900 and 375×812) shows availability, headline, intro, primary CTA, stat tile.
- [ ] Contact: copy button works; form posts (or silently fails) and shows the thank-you panel; honeypot hidden; 6 channels linked.
- [ ] Résumé: PDF preview loads (or shows the fallback); download works; HTML version present; print gives a clean one-pager.
- [ ] Lighthouse desktop: perf ≥ 0.85, SEO ≥ 0.95, a11y ≥ 0.9, BP ≥ 0.9.
- [ ] Dark and light both pass contrast; keyboard-only navigation works everywhere; 44px touch targets.

---

## 15. Known quirks and open items (don't "fix" while recreating unless asked)

- `package.json` name is still `react-example`; `.env.example` is an unused AI Studio template; `express`/`dotenv`/`clsx`/`tailwind-merge` are present but not used by the shipped site runtime.
- The home route's page-level `<Seo>` title ("Vikas Jaiswal | Java Spring Boot Backend Developer") differs from the manifest meta title (`${name} | ${titleLong}`, same string today); the manifest meta feeds `llms.txt`/sitemap, `<Seo>` feeds the HTML.
- `SkillGroup.iconName` is stored but never rendered; the Résumé page uses `skillGroups` for chips.
- `RevealItem` must stay inside `Reveal` (it only reads variants from its parent).
- The résumé file size label "54 KB" is a hard-coded constant (`PDF_SIZE` in `ResumePage.tsx`); update it when the PDF changes.
- Contact form only works end-to-end on Netlify; on GitHub Pages the POST fails silently and the thank-you panel still appears (by design, with an email fallback sentence).
- `docs/design-review.md` lists motion ideas (shared-element title morph, scroll-linked row reveals, ClosingCta gradient shift, ledger rule draws) that are **not** implemented.
- The `.github/skills/impeccable` Windows `.exe` is gitignored/untracked design tooling.


---

## 16. Interaction layer requirements

Full spec in `DESIGN.md` section 17. Requirements:

| ID | Requirement |
|---|---|
| I1 | Prerendered HTML is the complete plain page. No enhancement (wire, pinned/swipe track, tabs, cursor, dot canvas) may appear in the prerender output. Guarded by `entry-server.test.ts` |
| I2 | Home has six `data-hop` sections (`gateway auth services database queue response`) with matching ids; the request wire derives its nodes from them |
| I3 | Every effect is gated on hydration + `prefers-reduced-motion: no-preference`; pointer effects also on `(hover: hover) and (pointer: fine)` and not forced colours. Touch never gets scroll hijacking, custom cursor or tilt |
| I4 | The pinned track keeps every card reachable by keyboard (Tab and arrow keys move the page, never the stage) and falls back to rows (reduced motion) or a snap swipe row (<1024px) |
| I5 | Skill tabs expose `tablist`/`tab`/`tabpanel`, one tab in the tab order, arrows/Home/End; the prerender keeps the plain ledger |
| I6 | Budgets: first-load JS <= 180 KB gz and CSS <= 20 KB (`pnpm budget`); Lighthouse desktop home: performance >= 0.9, accessibility >= 0.95, SEO >= 0.95, LCP < 2s, CLS < 0.05 (CI job `lighthouse`) |
| I7 | New dependency: `lenis` (lazy chunk, ~5.7 KB gz). No GSAP |
