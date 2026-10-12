# DESIGN.md — "The Marked-Up Spec"

The complete visual, interaction and motion specification for the Vikas Jaiswal portfolio (`vikas794.github.io`).
Give this file plus `PRD.md` to an LLM and it has everything needed to rebuild the site: PRD says **what exists and how it behaves**, this file says **how it looks, moves and sounds**.

Every number in this file (hex values, durations, easings, sizes, class names) is taken from the shipped code in `src/index.css` and `src/components`. Where the code and an older design intention disagreed, the **code wins** and the deviation is listed in §16. If you change one, change both.

---

## 1. Design brief

| Question | Decision | Consequence |
|---|---|---|
| Audience | Hiring managers and recruiters | They skim. Proof lands in the first screen. "Contact" is always one click away. |
| Feel | Bold and expressive, but precise | Big serif type, one loud accent, confident motion. |
| What to avoid | "Looks AI-made": generic copy, too clean, no personality | Specific first-person copy with real numbers. Three memorable signature devices. |
| References | Brittany Chiang, Lee Robinson, Josh Comeau | Developer portfolios with craft. Not corporate, not a template. |
| Colour | Warm paper + near-black ink + ONE rust accent | Never pure black or white, never a second hue. |
| Type | Serif headlines, sans UI, mono details | Newsreader / IBM Plex Sans / IBM Plex Mono. |
| Layout | Varied, asymmetric by column split | Every page has its own composition. |
| Motion | Playful on touch, calm on read | **The page is calm to read and fun to touch.** Body text, tables and code never move. |
| Themes | Light + dark, follows system, user can override | Every rule holds in both. |
| Voice | First person, plain, specific, numbers over adjectives | "I cut report time in half." |

**One-line concept:** the site is an engineer's working document that a reviewer has gone over with a highlighter and a pen.

---

## 2. The three signature devices

Used everywhere and nowhere else. If a new element uses none of these nor the base tokens, it probably doesn't belong.

1. **The highlighter** — `<Mark>` / `.mark`. A soft rust marker swipe behind 1–2 key words per headline. Draws left→right (see §9.1).
2. **The margin number** — `.margin-num`. Oversized mono index (`01`, `02`) hanging beside content like a spec page number; section numbers in `.section-num`.
3. **The solid band** — `.band-accent` (rust) or `.band-ink` (ink). A full-width inverted block; **max one of each per page**. It is the page's single "shout".

---

## 3. Colour

All colours are CSS custom properties on `:root` (light) and `html.dark` (dark), exposed to Tailwind v4 via `@theme inline` so utilities like `bg-paper`, `text-ink-2`, `border-rule`, `text-accent` follow the theme with zero duplication.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#fbfaf8` | `#161310` | Page background |
| `--paper-2` | `#f3f1ec` | `#201c1a` | Raised bands, panels, code header, table header, footer, ticker, hero diagram |
| `--ink` | `#15171a` | `#edeae4` | Main text; `.band-ink` background |
| `--ink-2` | `#3e434b` | `#b6bac0` | Secondary text |
| `--ink-3` | `#5a6068` | `#949aa2` | Metadata, mono labels |
| `--rule` | `#e3dfd7` | `#37302c` | Hairlines, decorative dividers |
| `--rule-interactive` | `#8a8680` | `#6e6661` | Borders of interactive controls (buttons, inputs). Higher contrast than `--rule`. |
| `--accent` | `#b03a16` | `#f0784b` | Highlighter, solid bands, links, key numbers, focus ring, packets |
| `--accent-soft` | `#f8e3d9` | `#4b2616` | Highlighter swipe, active-nav underline, input focus halo |
| `--on-accent` | `#fbfaf8` | `#161310` | Text/icons on a solid accent block |
| `--positive` | `#166534` | `#4ade80` | Availability dot only |
| `--negative` | `#a11c1c` | `#f87171` | Error status only (reserved) |
| `--grain` | `0.035` | `0.06` | Opacity of the paper-grain overlay |
| `--dot` | `#d9d4ca` | `#3a332e` | Background dot-grid colour |
| `--shadow-overlay` | `0 8px 32px rgb(21 23 26 / .16)` | `0 8px 32px rgb(0 0 0 / .45)` | Floating overlays only (defined, effectively unused) |
| `--shadow-dialog` | `0 24px 64px rgb(21 23 26 / .24)` | `0 24px 64px rgb(0 0 0 / .6)` | Dialogs only (defined, effectively unused) |

Other root variables: `--prose-max: 34rem`, `--evidence-max: 55rem`, `color-scheme: light|dark`.

**Browser chrome:** `<meta name="theme-color" content="#b03a16">`, `<meta name="color-scheme" content="light dark">`.

**Rules**
- Accent coverage ≈ 10–15% of a viewport at the loudest point (the home accent band), under 3% elsewhere.
- Text on accent uses `--on-accent`. Text on `--accent-soft` uses `--ink`. Contrast ≥ 4.5:1 text, ≥ 3:1 large text/UI, in both themes.
- Links inside `p`, `li`, `.prose` are accent **and always underlined** (offset `0.18em`, thickness 1px → 2px on hover). Colour alone is never the affordance.
- `::selection`: background `--accent`, colour `--paper`.
- Dark mode is the same design re-tuned. Surfaces/rules are warm (R ≥ G ≥ B). Dark `--ink-2/--ink-3` are slightly cool greys (see §16).
- Never: gradients as decoration, second accent hue, pure `#000`/`#fff` (except print).

---

## 4. Typography

Self-hosted variable fonts via `@fontsource` (imported at the top of `src/index.css`):

```css
@import "@fontsource-variable/newsreader/opsz.css";
@import "@fontsource-variable/newsreader/opsz-italic.css";
@import "@fontsource-variable/ibm-plex-sans";
@import "@fontsource/ibm-plex-mono/latin-400.css";
@import "@fontsource/ibm-plex-mono/latin-500.css";
@import "tailwindcss";
```

Tailwind `@theme`:
```
--font-serif: "Newsreader", "Georgia", serif;
--font-sans:  "IBM Plex Sans", system-ui, -apple-system, sans-serif;
--font-mono:  "IBM Plex Mono", ui-monospace, "SFMono-Regular", monospace;
--text-small: 0.9375rem;   --text-code: 0.8125rem;
--tracking-label: 0.14em;  --leading-display: 1.08;
--container-prose: 34rem;  --container-evidence: 55rem;
```

Three voices, one job each:

| Voice | Font | Used for |
|---|---|---|
| Read | Newsreader (serif, variable, optical size) | h1–h3, long-form prose, big numbers, ticker, nav wordmark, FAQ questions, pull-quote |
| Scan | IBM Plex Sans | Body default, buttons, nav links, table cells, short UI text |
| Look up | IBM Plex Mono | Numbers, periods, tech stack, labels, code, metadata, status |

Base: `body` = sans, `1rem / 1.6`, `-webkit-font-smoothing: antialiased`, `text-rendering: optimizeLegibility`, background/colour transition `180ms var(--ease-out)`. `h1,h2,h3` = serif, weight 400, line-height 1.12, tracking `-0.015em`, `text-wrap: balance`. `h1 em/h2 em/h3 em` = italic 400. `p` = `max-width: 34rem`, `text-wrap: pretty` (in `@layer base` so utilities can override).

### Scale — use these classes, never invent sizes

| Class | Size (fluid) | Weight | Tracking | Line-height | Use |
|---|---|---|---|---|---|
| `.t-mega` | `clamp(2.5rem, 1.8rem + 2.8vw, 4rem)` | 500 | −0.035em | 0.98 | Home hero h1 only |
| `.t-display` | `clamp(2.25rem, 1.7rem + 2.4vw, 3.5rem)` | 500 | −0.03em | 1.02 | Page h1, closing CTA |
| `.t-section` | `clamp(1.75rem, 1.4rem + 1.4vw, 2.5rem)` | 500 | −0.025em | 1.05 | Section h2 |
| `.t-title` | `clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem)` | 500 | −0.015em | 1.12 | Row/card titles, panel titles |
| `.prose` | `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)` serif | 400 | normal | 1.65 | Reading text (max 34rem; children spaced `1.25rem`; `strong` = 600) |
| `.t-meta` | `0.75rem` mono | 500 | 0.04em | — | Metadata, colour `--ink-3` |
| `.label` | `0.8125rem` mono | 500 | 0.02em | — | Small mono tag/sub-label, `--ink-3`, not uppercase |
| `.metric-num` | `clamp(1.75rem, 1.4rem + 1.6vw, 2.5rem)` serif | — | −0.02em | 1 | Metric figure |
| `.row-num` | `clamp(2rem, 1.6rem + 2vw, 3.25rem)` | — | — | — | Index number on case rows |
| `.case-metric` | `clamp(1.75rem, 1.4rem + 1.4vw, 2.5rem)` | — | — | — | Accent metric |
| `.ticker-item` | `clamp(1.25rem, 1rem + 1vw, 1.75rem)` serif | — | −0.01em | — | Ticker words |
| Small UI | `text-small` = 0.9375rem | 400 | — | — | Secondary copy, buttons |
| Error code | `clamp(5rem, 3rem + 9vw, 9rem)` serif 500 | 500 | tight | 0.85 | Giant HTTP code, accent |

**Rules**
- Biggest heading ≈ 3.5× body (64px vs 19px). On every page the first screen holds headline + supporting copy + main button. A headline never fills the viewport.
- No tracked-out uppercase label above headings. Section titles are real serif h2s with a margin number.
- Italic serif for one emphasised phrase inside a headline (rare).
- `font-variant-numeric: tabular-nums` (`.tabular`) on all numbers; `font-variant-ligatures: none` on mono.
- Headlines `text-wrap: balance`; body `pretty`. No orphan words. Headline max widths are set in `ch`: `max-w-[14ch]` closing CTA, `[16ch]` Experience/Projects/Contact, `[18ch]` About, `[20ch]` Résumé/case study.
- Body-text letter-spacing: none. Tracking only on mono micro-tags.
- Em-dashes: at most one per page of copy (use a full stop or colon).

---

## 5. Layout, spacing, shape

- **Container:** `mx-auto max-w-6xl` (72rem) with `px-5` (1.25rem) mobile, `md:px-8` (2rem). Reading text caps at `34rem` (`--prose-max`); evidence tables/code at `55rem` (`--evidence-max`, class `max-w-evidence`).
- **Page wrapper:** `mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-24`.
- **Home section padding:** `py-16 md:py-24`; sections separated by `border-b border-rule`.
- 4px spacing base. Never less than 4rem between sections; About/Contact major sections use `mt-24`/`mt-28`.
- **12-column grid** for asymmetry (e.g. hero `lg:grid-cols-12`, 7/5 split). Asymmetry comes from column splits, not from tilted or offset elements.
- **Radius tokens:** `--radius-sm 4px` (inputs, tags, focus ring), `--radius-md 6px` (buttons), `--radius-lg 8px` (panels, hero diagram, stat tile, FAB), `--radius-xl 10px`. Theme toggle is a circle.
- **No** glassmorphism, decorative gradients, drop-shadow cards, pill-everything. Raised = surface change (`--paper-2`) + 1px `--rule` hairline.
- **Icons:** Lucide (`lucide-react`), 14–24px, stroke default (1.5–2), always paired with text or `aria-label`, decorative ones `aria-hidden`.

### Layout helper classes (all in `index.css`)

| Class | Definition |
|---|---|
| `.entry-grid` | grid, gap .75rem; ≥1024px: `5rem minmax(0,1fr) 12rem`, gap 2rem (number / body / stack) |
| `.history-grid` | grid, gap .25rem; ≥1024px: `12rem minmax(0,1fr)`, gap 2rem (period / role) |
| `.strip-grid` | grid, gap .25rem; ≥640px: `2.5rem minmax(0,1fr)`, gap 1rem (step number / content) |
| `.code-line` | grid `2.5rem minmax(0,1fr)` (gutter / code) |
| `.rail` | grid gap 2rem; ≥1024px: `minmax(0,10rem) minmax(0,1fr)`, gap 2.5rem. `.rail-meta` is sticky (`top: 5rem`, right-aligned mono xs) on desktop; on mobile it becomes a wrapped flex row with a bottom hairline |
| `.panel` | `--paper-2` bg, 1px `--rule`, radius 8px, padding 1.5rem (2rem ≥768px) |
| `.section-head` | flex-wrap, baseline, space-between, gap `.75rem 2rem` |
| `.wide-scroll` | `min-width: 36rem` (forces horizontal scroll inside table/code regions) |
| `.ledger` | see §6 |

### Per-page composition (each page must feel different)

| Page | Composition |
|---|---|
| **Home** | Hero (7/5 split, flagship stat tile + diagram right) → **solid-accent proof band** → big ruled project rows → work-history rows → stack ticker + ledger → **solid-ink closing band** |
| **About** | Big h1 → serif pull-quote (8 cols) → 2-col "How I work" grid of 4 numbered principles → credentials ledger → FAQ accordion |
| **Experience** | Vertical timeline: period hangs in a sticky left rail (large accent serif), rust rule + dot runs down the content column |
| **Projects** | h1 + intro → one huge numbered row per project → "Also shipped" ledger |
| **Case study** | Header (big number, h1, summary, ledger) → rail with sticky TOC + calm reading column (counter-numbered h2s) |
| **Résumé** | Most restrained: h1, contact line, download button, PDF preview, then an ATS-friendly HTML version |
| **Contact** | h1 + copy + buttons → 2-col (form panel / channels ledger) → 4 numbered tips → ledger of facts |
| **Error** | Eyebrow label, giant accent status code, h1, message, mono trace line, two buttons |

---

## 6. Components (visual spec)

All hand-written primitives live in `src/index.css`; React wrappers in `src/components`.

### Button `.btn`
`inline-flex`, `gap .5rem`, `min-height 44px`, padding `.625rem 1.25rem`, `0.9375rem`/500, radius 6px, 1px border `--rule-interactive`. Transition 140ms (`--dur-1`) on bg/colour/border/transform/filter. `:active` → `translateY(1px)`.
- `.btn-primary`: bg + border `--accent`, text `--paper`. Hover: `translateY(-1px)` + `filter: brightness(1.08)`.
- `.btn-ghost`: transparent, text `--ink`. Hover: `--paper-2` bg + lift 1px.
- Trailing `ArrowRight` icon slides `translate-x-1` / `1.5` on `group-hover` (150–200ms ease-out).
- Primary CTAs are wrapped in `<Magnetic>` (§9.6).
- Always `no-underline` when rendered as `<a>`/`<Link>`.
- On `.band-ink`: ghost = paper text + 55% paper border, hover 14% paper fill.
- Forced-colours: primary = ButtonText/ButtonFace.

### Header `.site-header`
Sticky `top:0`, `z-50`, bg `color-mix(in srgb, var(--paper) 92%, transparent)` + `backdrop-filter: blur(10px)` (disabled under `prefers-reduced-transparency`), always `border-b border-rule`. Inner: `max-w-6xl flex items-center justify-between gap-4 px-5 py-4 md:px-8`.
- **Wordmark** "Vikas Jaiswal" serif `text-xl` medium, tracking tight, no underline, followed by an accent dot (`.5rem` circle). On hover (hover-capable) the dot hops up `-0.2rem` over 500ms `--ease-spring`.
- **Nav** (≥768px): Home, About, Experience, Work, Résumé, Contact, gap `1.5rem`, `text-small`, colour `--ink-2` (active `--accent`; hover `--accent`). `.nav-link` has an underline that draws left→right on hover/focus (`scaleX 0→1`, 240ms, origin left, 1px currentColor). The **active** link carries a highlighter underline instead: `::after` height `.5em`, bottom `.05em`, `--accent-soft`, `scaleX(1)`, `z-index:-1` (parent `isolation: isolate`).
- **Theme toggle** `.theme-toggle` 44×44 circle; shows Sun in dark, Moon in light (`data-theme` attr switches which icon is `display:none`); icon wrapper has `transition: transform 600ms var(--ease-spring)`.
- **Mobile** (<768px): theme toggle + 44px bordered menu button (`Menu`/`X`). Opens an inline `<nav aria-label="Mobile">` list below the bar (rows with hairlines, active = accent), closes on link click. No animation.
- Gets `vt-persist-header` class so it stays put during route transitions (§9.9).

### Footer
`bg-paper-2 border-t border-rule`; one compact row `py-5`, `max-w-6xl`. Left: mono xs `--ink-3` "Vikas Jaiswal · Java Spring Boot Backend Developer · Mumbai, India". Right: LinkedIn, GitHub (new tab, `rel="noopener noreferrer"`), Email (mailto) in `text-small`, wrapping `gap-x-5`. Stacks on mobile, row ≥768px. Hidden in print.

### Section heading `<SectionHeading id num action>`
`.section-head` flex row: `h2.t-section` containing `<span.section-num aria-hidden>` (mono `.8125rem`/500, `--accent`, `margin-right .9rem`, `vertical-align .9em`) + title; optional right-aligned action link (small text + arrow that slides 4px on hover).

### Mark `<Mark>` / `.mark`
`<mark>` with `background-image: linear-gradient(var(--accent-soft), var(--accent-soft))`, no-repeat, position `0 88%`, size `0% .46em` → `100% .46em`, `box-decoration-break: clone`, padding `0 .08em` with equal negative margin. Variants inside bands: in `.band-ink` the swipe is `--accent` with `--on-accent` text; in `.band-accent` the swipe is `--on-accent` with `--accent` text. `.mark-view` (see §9.1) is the scroll-driven variant.

### Case row `.case-row` (`<CaseRow>`)
`<article class="entry-grid case-row group py-10 md:py-14">`: col 1 = `.margin-num.row-num` (aria-hidden); col 2 = h2/h3 `.t-title md:text-[1.75rem]` link with title text + a 24px accent `ArrowRight` that starts `-translate-x-2 opacity-0` and goes to `translate-x-0 opacity-100` on group hover (300ms); then a 2-line-clamped summary (`text-small text-ink-2`), then a compact metric (`.metric.metric-sm`: number in accent serif `clamp(1.25rem, 1.1rem + .6vw, 1.5rem)`, label small ink-2); col 3 = mono xs stack, right-aligned ≥1024px.
Hover (hover-capable only): `padding-left` eases to `.5rem` over 450ms; an accent 1px hairline `::after` draws under the row (`scaleX 0→1`, 700ms, origin left); the title gets an accent underline (`decoration-2`, offset 8); the margin number goes accent. **No fill, no tilt.**

### Work-history row
Reuses `.case-row` with `.history-grid py-8`: left mono `text-sm` period, right `t-title` "Role, Company" + a 10px accent dot (`role="img" aria-label="Current role"`) for the current job, then small ink-2 product context.

### Metric `.metric`
Flex column gap `.25rem`: `.metric-num` (serif), `.metric-label` (`.875rem` ink-2), `.metric-method` (mono `.6875rem`, tracking .04em, ink-3). Variant `.metric-lg` (home proof strip): number nowrap; label `.9375rem`; **method is hidden on hover-capable devices (opacity 0, `translateY(-4px)`) and slides in on hover/focus (240ms); always visible on touch.** On hover the number lifts `-3px` (500ms). Inside `.band-accent` all metric text is `--on-accent` (method at 0.88 opacity).

### Hero stat tile `.stat-float`
Solid accent block, `--on-accent` text, radius 8px, padding `1.25rem 1.5rem`. Contains `.hero-stat-num` (serif, `clamp(1.75rem, 1.4rem + 1.4vw, 2.5rem)`, lh 1) and `.hero-stat-label` (mono `.8125rem`, tracking .04em). Hover: `translateY(-2px)` with 500ms spring. Focus ring is `--ink`. (`.hero-stat` — left accent border variant — exists in CSS but is unused.)

### Hero diagram frame `.hero-diagram`
1px `--rule` border, radius 8px, `--paper-2` bg, padding `1.25rem`; hover → border `--rule-interactive` (140ms). Contains the animated SVG (§10) and a "How this works →" link line.

### Ledger `.ledger`
Hairline key/value list: `border-top 1px --rule`; each `div`/`li` is `flex justify-between gap 2rem`, padding `.625rem 0`, `border-bottom 1px --rule`, font `.9375rem`. Label (`dt`/`.ledger-label`): mono `.75rem`/500, tracking .02em, `--ink-3`, `padding-top .2em`, no-shrink. Value (`dd`/`.ledger-value`): right-aligned, `--ink`.

### Ticker `<Ticker>`
Full-bleed strip: `border-block 1px --rule`, `--paper-2`, edges masked with `linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)`. `.ticker-track` is `flex`, `width: max-content`, `gap 2.5rem`, `padding 1.1rem 0`, `animation: ticker 52s linear infinite`; keyframe `to { transform: translateX(calc(-50% - 1.25rem)) }` (the item list is rendered twice for a seamless loop). Each item is serif, `--ink-2`, followed by a `.45rem` accent dot. Pauses on `:hover`. `aria-hidden` (decorative). Animation disabled under reduced motion.

### Copy-email button `<CopyEmail>`
`.btn.btn-primary` with a `Copy` icon (16px) and label "Copy email"; on click writes to clipboard, swaps to `Check` icon + "Copied" for 2000ms, label in `aria-live="polite"`. If the clipboard is blocked nothing breaks (adjacent mailto link is the fallback).

### Form fields `.field`, `.field-label`
Label: mono `.8125rem`/500 `--ink-2`; helper text `text-xs --ink-3` below the label. Input: `margin-top .5rem`, full width, `min-height 2.75rem`, 1px `--rule-interactive`, radius 4px, `--paper` bg, padding `.5rem .75rem`, `.9375rem`. `:focus-visible` → border `--accent` + `0 0 0 3px var(--accent-soft)` halo (140ms).

### FAQ accordion `.facts`
Native `<details>`; summary is serif `text-xl` ink with the default marker hidden and `::after` content `" +"` in accent (`" −"` when open). Answer `prose text-small text-ink-2`. Rows divided by hairlines.

### Code block `<CodeBlock>`
No fake IDE chrome. A mono xs path label in a `--paper-2` header bar, a focusable scroll region (`role="region"`, `tabIndex=0`, `aria-label="Code excerpt from …"`) containing numbered lines in a `.code-line` grid (gutter right-aligned `--ink-3`, `select-none`, `aria-hidden`; comment lines `--ink-3`, code `--ink`; rows separated by `border-rule/60`). Below, a `--paper-2` footer lists per-line notes (`L{n}` in accent mono + text, 2-col grid ≥640px) and a mono xs "honesty" disclaimer. Font `.8125rem / leading-6`.

### Data tables (decisions, results)
Wrapped in a focusable scroll region (`max-w-evidence overflow-x-auto border border-rule`, `role="region"`, labelled). `<table class="wide-scroll w-full text-left text-small">` with an `sr-only` caption; header row `--paper-2`, mono xs `--ink-3`, `px-4 py-3`; body rows `divide-y divide-rule`; first column medium weight, middle columns `--ink-2`, "How measured" column mono xs `--ink-3`.

### Scroll progress `.scroll-progress`
`position: fixed; inset: 0 0 auto 0; height: 2px; z-index: 60; background: var(--accent); transform-origin: left; pointer-events: none`. `scaleX` driven by `useSpring(scrollYProgress, {stiffness: 120, damping: 28, restDelta: 0.001})`. Rendered only after hydration and not under reduced motion.

### Back-to-top FAB
Appears once `scrollY > 500` (no entrance animation). `fixed bottom-6 right-6 z-40`, 44×44 min, `rounded-lg`, `border-rule-strong`, `bg-paper text-ink`, `ArrowUp` 18px, `aria-label="Back to top"`, smooth-scrolls to top. Has `vt-persist-fab` so it doesn't fade during route changes.

### Skip link `.skip-link`
Off-screen (`left:-9999px`), `z-100`, `min-height 44px`, ink bg / paper text; on focus slides to `top:.5rem; left:.5rem`.

### Bands
`.band-accent` (`--accent` bg, `--on-accent` text) and `.band-ink` (`--ink` bg, `--paper` text). Their links inherit colour; focus rings invert (`--on-accent` / `--paper`). Max one of each per page.

---

## 7. Backgrounds & texture

1. **Paper grain** — `body::before`: fixed, `inset:0`, `z-index:90`, `pointer-events:none`, `opacity: var(--grain)`, an inline SVG `feTurbulence` (fractalNoise, baseFrequency .8, 2 octaves, 160×160, tiled) data-URI. No network request. Hidden in `print` and `forced-colors`.
2. **Dot grid on every page** — `<HeroSpotlight/>` renders `.hero-bg` as the first child of `<main class="relative isolate">`: `position:absolute; inset:0; z-index:-1; pointer-events:none; overflow:hidden`. Layer 1 `.hero-dots`: `radial-gradient(circle, var(--dot) 1.2px, transparent 1.6px)`, size `24px 24px`. Layer 2 `.hero-dots-hot`: same grid in `--accent` (1.4px→1.9px), `opacity:0`, masked by `radial-gradient(circle 150px at var(--mx) var(--my), #000, transparent)`; when `data-active="true"` opacity `.9`, fading over 400ms. Pointer devices only (`(hover: hover) and (pointer: fine)`), not under reduced motion. Touch/reduced-motion get the static grid.
3. **Never:** gradients/glows, particles, video, WebGL, stock photos, blobs.

---

## 8. Motion principles

- **Calm to read, fun to touch.** Headlines, numbers, buttons, rows, transitions move. Body text, tables and code never move.
- **Budget:** one main mover and at most two secondary movers per viewport.
- **Properties:** only `transform`, `opacity`, `background-size`, `clip-path`/mask, `stroke-dashoffset`/`pathLength`. No layout-shifting animation.
- **Content first:** every animated element is fully present in the prerendered HTML and with JS off. Animation only decorates. Components gate on `useHydrated()` (false on server/first client render) and `useReducedMotion()`.
- **Tooling order:** CSS first (+ View Transitions, scroll-driven CSS), `motion` (v14, `motion/react`) second. No GSAP/Lenis.
- **Reduced motion** (`prefers-reduced-motion: reduce`): no loops, no magnetic, no count-up, no ticker, no packets, no scroll bar, no view-transition animation (instant swap), final state shown, `scroll-behavior: auto`; global guard sets `animation-duration/transition-duration: 0.01ms !important`, `animation-iteration-count: 1`.
- **Touch:** no hover-dependent information.
- **Performance:** Lighthouse performance ≥ 0.85 (CI error threshold).

### Tokens
```
--ease-out:    cubic-bezier(0.22, 1, 0.36, 1)    /* entrances, hovers */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1) /* playful overshoot */
--dur-1: 140ms   /* hover */
--dur-2: 240ms   /* small */
--dur-route: 320ms (token; actual route animation uses 220/260ms, §9.9)
```
Frequently used literals: `[0.16, 1, 0.3, 1]` (expo-out) for `motion` entrances; `cubic-bezier(0.4, 0, 0.2, 1)` for the theme reveal.

---

## 9. Motion catalogue (every animation, with exact values)

### 9.1 Highlighter draw — `Mark` / `.mark`
- CSS keyframe `mark-draw` animates `background-size` from `0% .46em` → `100% .46em`.
- `animation: mark-draw 760ms var(--ease-out) 520ms forwards` (starts 520ms after paint so it lands after the headline words rise).
- Works with no JS (pure CSS, in prerendered HTML).
- **Below-the-fold marks** use class `mark-view` (`<Mark scroll>`): where `animation-timeline: view()` is supported, `animation: mark-draw linear both; animation-timeline: view(); animation-range: entry 15% entry 100%` — it scrubs as it enters the viewport. Elsewhere it keeps the timed draw. Only inside `@media (prefers-reduced-motion: no-preference)`.
- Reduced motion: `animation: none; background-size: 100% .46em` (final state).

### 9.2 Headline word rise — `<HeadlineReveal>`
Page h1 with an optional highlighted phrase. After hydration (and not reduced motion) the text is split on whitespace; every word is wrapped in `.word-mask` (`inline-block; overflow:hidden; vertical-align:top; padding-bottom:.12em; margin-bottom:-.12em`) containing a `motion.span.inline-block` going `y: "110%" → "0%"`, `duration .9s`, `delay .07s × wordIndex`, `ease [0.16, 1, 0.3, 1]`. The highlighted phrase's words are wrapped in `<Mark>`. The `h1` gets `aria-label={text}` so the accessible name is the original sentence. Server render / no-JS / reduced motion: a plain `<h1>` with the same `<Mark>` (still draws via CSS).

### 9.3 Scroll entrance — `<Reveal>` + `<RevealItem>`
The one shared entrance primitive, used on every page.
- Parent `Reveal`: `motion.div`, `initial="hidden" whileInView="show"`, `viewport {once: true, amount: 0.15}`; variants `show: {transition: {staggerChildren: .09, delayChildren: .04}}`.
- Child `RevealItem`: `hidden {opacity:0, y:28}` → `show {opacity:1, y:0, transition {duration .8, ease [0.16, 1, 0.3, 1]}}`.
- Server / pre-hydration / reduced motion: renders a plain `div` (content present, never "fast-faded"). `RevealItem` must only be used inside `Reveal`. Stagger is fixed (never `delay: i * 0.1`, which grows with list length).

### 9.4 Count-up — `<CountUp value>`
Applies only to values matching `^([+\-−]?)(\d[\d,]*)([%x×]?)$` (e.g. `+30%`, `−80%`). When the number is ≥ 60% in view (`useInView once`), animates `0 → target` over `1.1s` with ease `[0.22, 1, 0.36, 1]`, writing `sign + rounded toLocaleString("en-US") + suffix` into the span's `textContent`; on complete restores the exact `value`. Zero (`"0"`) and phrases (`"1 → Thousands"`) are left alone. The server-rendered text is the final value, so no-JS / reduced motion show the real number. Numbers are `tabular-nums` and nowrap so width doesn't jump.

### 9.5 Ticker marquee — see §6 (52s linear infinite, pauses on hover, off under reduced motion).

### 9.6 Magnetic buttons — `<Magnetic>`
Wrapper span `.magnetic` (`display:inline-block; transition: transform 380ms var(--ease-spring); will-change: transform`). On `pointermove` (fine pointer + hover only, not reduced motion) it sets `transform: translate(dx*6px, dy*4px)` where `dx,dy` are the cursor offset from the element centre normalised to `[-1,1]`; `pointerleave` clears it (spring back). Reduced motion forces `transform: none`.

### 9.7 Hero background spotlight — see §7.2 (rAF-throttled pointer tracking, 400ms fade).

### 9.8 Hero diagram — draw-in + flowing packets (`HeroFlowDiagram`) — see §10.1.

### 9.9 Route transition (View Transitions API)
Driven by `runViewTransition("route", mutate, direction)` (`src/lib/viewTransition.ts`):
1. Skips if reduced motion or `document.startViewTransition` is missing (instant swap).
2. Skips any in-flight transition (`skipTransition()`), clears both `vt-theme`/`vt-route` classes, adds `vt-route` to `<html>`, sets `html[data-vt-dir]`.
3. Calls `document.startViewTransition(() => flushSync(mutate))`; on `finished` removes the class + dir (only if it is still the active transition).

CSS (inside `prefers-reduced-motion: no-preference`):
- `html.vt-route { --vt-shift: 8% }`; `html.vt-route[data-vt-dir="back"] { --vt-shift: -8% }`.
- `::view-transition-old(root)` → `route-old-out 220ms var(--ease-out) both`: to `opacity 0; translateX(calc(var(--vt-shift) * -1))`.
- `::view-transition-new(root)` → `route-new-in 260ms var(--ease-out) both`: from `opacity 0; translateX(var(--vt-shift))`.
- Both pages move at once: forward = new enters from the right, back = from the left.
- Header and back-to-top get their own named groups only while `vt-route` is active (`.vt-persist-header { view-transition-name: site-header }`, `.vt-persist-fab { view-transition-name: back-to-top }`) with `animation: none; mix-blend-mode: normal` on their old/new pseudos, so they stay put.
- **Direction** (`routeDirection(from, to)`): section order `["", "about", "experience", "projects", "resume", "contact"]` (matches nav). Later section = forward, earlier = back. Same section: deeper path (e.g. `/projects/` → `/projects/slug/`) = forward, shallower = back. Unknown sections sort last.
- Triggered from `AppRoutes`: it keeps `displayedLocation` state; when `location.pathname` changes (not on first render, not for hash/query-only changes) it runs the transition and swaps `displayedLocation` inside it.

### 9.10 Theme-toggle circular reveal (View Transitions API)
On click, `SiteHeader` measures the button centre `(x, y)` and the radius to the farthest corner of the **whole document** (`hypot(max(x, scrollWidth − x), max(y, scrollHeight − y))`) and writes `--theme-x`, `--theme-y`, `--theme-r` on `<html>`, then `runViewTransition("theme", toggleTheme)`.
CSS (no-preference only):
- `@property --theme-reveal { syntax: "<length>"; inherits: false; initial-value: 0px }` so the radius is animatable.
- `html.vt-theme::view-transition-old(root) { animation: none; mix-blend-mode: normal }`.
- `html.vt-theme::view-transition-new(root)`: `--theme-feather: 280px`; `mix-blend-mode: normal`; `mask-image: radial-gradient(circle at var(--theme-x, 50%) var(--theme-y, 50%), #000 max(calc(var(--theme-reveal) - var(--theme-feather)), 0px), transparent var(--theme-reveal))` (+ `-webkit-` prefix); `animation: theme-reveal 1400ms cubic-bezier(0.4, 0, 0.2, 1) both`.
- `@keyframes theme-reveal { from { --theme-reveal: 0px } to { --theme-reveal: calc(var(--theme-r, 150%) + 280px) } }` (reaches the farthest corner plus the feather so the mask is fully opaque at the end).
- The soft feathered edge makes the new theme spread like a shade, not a hard wipe.
- Technical requirement: the theme state change must be a **layout effect** (not passive) so it lands inside the transition's `flushSync`; otherwise the reveal flashes between two identical frames (`useTheme`).

### 9.11 Micro-interactions
| Element | Behaviour |
|---|---|
| Wordmark dot | hops `-0.2rem`, 500ms spring, on hover |
| Theme icon | wrapper `transition: transform 600ms var(--ease-spring)` |
| Nav link | underline draws left→right 240ms; active = highlighter underline |
| Button | lift `-1px` hover, `+1px` press, brightness 1.08, arrow slides 4–6px |
| Hero stat tile | lifts `-2px`, 500ms spring on hover |
| Case row | pad-left → `.5rem` 450ms; accent hairline draws 700ms; arrow fades/slides in 300ms; number → accent |
| Metric (`metric-lg`) | number lifts `-3px` 500ms; method slides in 240ms (hover devices) |
| Hero diagram frame | border → `--rule-interactive` 140ms |
| Section links | arrow `translate-x-1` 150ms on hover |
| Form field | border + 3px accent-soft halo 140ms on focus |
| Margin number | `transition: color 240ms, transform 500ms spring`; accent on row hover |
| Body colours | `transition: background-color 180ms, color 180ms` (theme swap fallback) |
| Smooth scroll | `scroll-behavior: smooth` on `html` (no-preference only); route changes use `scrollTo({behavior:"instant"})` |

### 9.12 Motion not present (do not add)
Parallax, cursor-following blobs, page-load spinners, skeletons, particles, confetti, auto-playing video, scroll-jacking, GSAP/Lenis, entrance animations on the back-to-top FAB or mobile menu.

---

## 10. Diagrams

All diagrams are hand-authored inline SVG (never runtime Mermaid), use **only `currentColor` + `var(--accent)`**, stroke `1.5`, mono labels, orthogonal routing, every edge labelled with its protocol, and **exactly one accented element: the thing that was built**. They have `role="img"`, `aria-label`, `aria-describedby` → `<desc>`.

### 10.1 `HeroFlowDiagram` (home hero, `viewBox 0 0 400 132`)
Three nodes left→right: **Kite Connect** (rect 4,40 112×52; "1 upstream socket") → wire `wss` → **Tick Publish / STOMP Broker** (rect 144,34 128×64, accent stroke 2, "built here") → wire `wss` → **1,000s of sessions** (rect 300,40 96×52). Rect radius 6; labels 12px/10px mono (`fill-current` / `fill-ink-2` for secondary — solid colour, not opacity, to hold contrast).
Motion (post-hydration, not reduced motion): on scroll-in (`whileInView once, amount .5`) the SVG staggers its groups (`staggerChildren .22`, `delayChildren .1`); each group `fadeUp` (`opacity 0→1, y 6→0`, `.32s`, ease `[0.16,1,0.3,1]`); wire lines draw via `pathLength 0→1`, `.28s easeOut`. Then **4 accent packets** (r 2.5, `fill var(--accent)`) loop forever along the wires using SMIL `<animateMotion dur="1.6s" repeatCount="indefinite">` + opacity `0;1;1;0` (keyTimes `0;.15;.85;1`): one in (`M116 66 H144`, begin 0s) and three fanning out (`M272 66 L300 52` 0.4s, `M272 66 H300` 0.7s, `M272 66 L300 80` 1.0s). The packet group calls `svg.pauseAnimations()` / `unpauseAnimations()` via `useInView(amount .3)` so it only runs on screen. Static fallback: plain SVG, all nodes visible, no packets.

### 10.2 `FanoutDiagram` (case study 01 only, `viewBox 0 0 680 460`)
3 rows × 3 nodes, static. Row 1 ingest: Kite Connect (upstream socket) → Tick Handler (`publishTick()`) → **STOMP Broker (accent stroke 2; "built here · in-proc pub/sub")**. Row 2: Order API (entry · exit · SL), Wallet + GST (Razorpay billing), Session Registry (session → instruments). Row 3: Browser A / B / C ("trade screen"). Edge labels: `wss`, `in-proc`, `lookup`, `WS/STOMP · filtered ticks`, `REST · orders`, `in-proc`. Figure caption mono xs `--ink-3`. Container `figure.my-8.max-w-evidence`.

### 10.3 `OauthStrip` (case study 01 only)
A plain HTML ordered list (not SVG, so it stays selectable/translatable) of 5 sequence steps, each in `.strip-grid` with an accent mono step number and "From → To", a mono `via` line and a one-line description; caption states the critical-path rule. Steps: Browser→Backend `REST · GET /oauth/start`; Backend→Kite `OAuth2 · redirect`; Kite→Backend `OAuth2 · request_token`; Backend→Kite `REST · server-side exchange`; Backend→Browser `WS/STOMP · subscribe`.

---

## 11. Page-level design notes

**Home (`/`)** — Order: Hero → ProofStrip (accent band) → CaseRows ("02 Selected work") → WorkHistory ("03 Where I've worked") → SkillsLedger ("04 What I work with", ticker above the ledger) → ClosingCta (ink band). Section numbers run 01–04. Hero: availability line (mono xs + 8px `--positive` dot), `t-mega` headline "I build the backends that move money, data, and messages" with "money, data, and messages" highlighted, intro paragraph, CTAs [Read the case studies (primary, magnetic, arrow)] [Résumé (ghost)]; right column: accent stat tile "1 → Thousands / Upstream sockets → concurrent tick consumers" linking to case 01, then the diagram frame with "How this works →". Proof band: heading "Results, measured", grid `lg:grid-cols-[1.7fr_1fr_1fr_1fr]` of 4 metrics (first is the widest). Closing band: `t-display max-w-[14ch]` "Hiring a backend engineer? **Let's talk.**" (scroll-driven mark), serif lead sentence, buttons [Copy email (magnetic)] [email ghost] [More ways to reach me →].

**About** — h1 "I turn business requirements into boring, reliable backends." (highlight "boring, reliable", `max-w-[18ch]`). Pull-quote paragraph: serif `text-xl`/`lg:text-[1.75rem]`, 8 columns, with one italic phrase. "01 How I work": 2-col grid (`gap-x-16 gap-y-12`) of 4 principles, each with a top hairline, a `text-4xl` margin number, a serif bold lead and body. "02 Credentials": ledger (issuer → linked cert name). "03 Frequently asked questions": `.facts` accordion rows.

**Experience** — h1 "Four years of backends in production." (highlight "in production"). Each job = `.rail` article: left sticky meta (period in accent serif `text-2xl lg:text-3xl`, company, first 4 tech tags joined by ` · `); right column has `border-l-2 border-accent pl-6 md:pl-10`, a 12px accent dot straddling the rule (`absolute -left-[0.45rem] top-2`), role `t-title` (+ current-role dot), product-context `.prose`, then grouped bullet lists (mono `.label` group name SHIPPED/HARDENED/IMPROVED/TEAM, `list-disc marker:text-accent`). Entries separated by `gap-24`.

**Projects** — h1 "Three projects, written up properly." (highlight "written up properly"), intro prose, 3 `CaseRow`s (as `h2`), then "01 Also shipped" ledger.

**Case study (`/projects/:slug/`)** — "Skip to results" link; header with a `text-4xl md:text-5xl` margin number, `HeadlineReveal` h1 (`t-display max-w-[20ch]`), prose summary, ledger (Stack / Updated); then `.rail` with sticky TOC (`aria-label="On this page"`, mono links that go accent on hover) and a `.sec-scope` column: counter-numbered `.sec-title` h2s (`01`…, accent mono counter via `::before`): The problem → Constraints (bullets) → Architecture (diagram, case 01 only) → The critical path (OAuth strip, case 01 only) → How it was done (numbered list, only if `approach`) → Decisions and trade-offs (table) → Code that mattered (only if `code`) → Results (before/after table) → What I'd do differently (prose). Footer link "Back to projects". TOC items are filtered to the sections that exist.

**Résumé** — h1 `{name}, {titleLong}` (highlight the title), mono-ish contact line, primary download button "Download résumé — PDF, 54 KB", a bordered PDF preview region (`no-print`), then an HTML version (`sec-scope`): experience sections (`h3.t-title`, mono period, context, grouped bullets), skills grid (3-col, chips `rounded-sm border bg-paper-2 px-2 py-1`), certifications list (linked), education list. Print stylesheet makes it a one-pager.

**Contact** — h1 "Java backend roles, remote or hybrid." (highlight "remote or hybrid"), prose, [Copy email][Open in mail app]; grid `lg:grid-cols-[1.15fr_1fr]`: form `.panel` (or "Thank you!" panel after submit) | "Other ways to reach me" ledger of 6 channels + location; then "01 What to include in your message" (4 numbered tips in a 2-col grid) and "02 What I can help with" (prose + 6-row `dl.ledger`).

**Error / 404** — `label` eyebrow ("Error 404 · Not Found"), giant accent code, `t-display max-w-[16ch]` h1, prose message, optional mono trace line (`/` gutter + path), buttons [Back to home (primary, magnetic)] [Contact me (ghost, Mail icon)].

---

## 12. Voice and copy rules

- First person, plain, specific. Lead with the number and say how it was measured.
- Short sentences, one idea each. Section headings are statements of fact ("Three projects, written up properly.") not categories ("Featured Projects").
- Buttons say what happens: "Read the case studies", "Copy email", "Download résumé — PDF, 54 KB".
- Banned: leverage, seamless, robust, cutting-edge, passionate, synergy, "turning requirements into solutions", "in today's". No lists of three adjectives, no rhetorical-question headings.
- Dry asides occasionally, never a joke per section.
- Every metric has a **method** ("Load test on instrumented hot paths"). A number without a method reads invented.
- Honesty markers: code excerpts state they are simplified; "static grep plus review, not a pentest claim".

---

## 13. Accessibility

- WCAG AA contrast both themes; `:focus-visible` outline `2px solid var(--accent)`, offset 2px, radius 4px (plain `:focus` has `outline:none`). Primary buttons/theme toggle use a paper outline + 4px accent box-shadow ring so the ring is visible on accent.
- Skip link; `<main id="main" tabIndex={-1}>` receives focus on every route change (`preventScroll`), `window.scrollTo({top:0, behavior:"instant"})` unless a hash is present; a polite live region (`role="status" aria-live="polite" class="sr-only"`) announces `Navigated to {pathname}`.
- One `h1` per page; `h2` sections via `aria-labelledby`; decorative numbers/arrows/dots `aria-hidden`; informational dots have `role="img"` + label.
- Scrollable regions (tables, code) are keyboard-focusable and labelled; tables have `sr-only` captions and `scope="col"`.
- Touch targets ≥ 44px (`min-h-11`).
- Media queries respected: `prefers-reduced-motion`, `prefers-reduced-transparency` (kills backdrop-filter), `prefers-contrast: more` (`--rule-interactive` → `#55504a` light / `#8b9098` dark, link underline 2px), `forced-colors: active` (primary button uses ButtonText/ButtonFace, focus ring `Highlight` 3px, grain hidden).
- Print: hides skip link, `nav`, `footer`, theme toggle, `.no-print`; white bg/black text at 11pt; links show their URL via `a[href^="http"]::after { content: " (" attr(href) ")" }`; prose max-width 100%.
- Component error boundary shows the styled 500 page instead of a white screen.

---

## 14. Design checklist for any new page or component

1. Uses only tokens above for colour, type, space?
2. Different composition from its neighbours?
3. Exactly one "shout" (a mark, a band or a giant number)?
4. Every claim specific, first person, with a number or name and a method?
5. Works with motion off, in dark mode, at 375px and 1440px, and with JS off?
6. Prerendered HTML contains the full content?
7. Animates only transform/opacity/background-size/mask? One main mover?
8. Hover-only info also available on touch? Focus ring visible?

---

## 15. Anti-patterns (the "looks AI-made" list)

No gradient text, purple/blue gradients, glass cards, three identical feature cards, centred hero with two buttons and a badge, emoji as icons, uppercase eyebrow above every h1, stock illustrations, "Trusted by" logo strips, fake testimonials, floating blobs, drop-shadow cards, generic copy that could belong to anyone. No second accent colour.

---

## 16. Known deviations between intent and code (code wins)

An earlier DESIGN.md described intentions that the shipped code does not follow. Rebuild from the code:

| Earlier intent | What the code actually does |
|---|---|
| Magnetic follows pointer "within 12px" | Max translate is `6px` horizontally and `4px` vertically |
| Hero stat "overlaps the headline's end" | The stat tile sits in the right column above the diagram; no overlap |
| Header "hairline appears on scroll" | The `border-b border-rule` is always present; there is a 10px backdrop blur |
| Wordmark "wiggle" | The accent dot hops up `0.2rem` on hover |
| Theme toggle "spins" | The icon wrapper has a 600ms spring `transform` transition, but no rotation is defined (icons swap) |
| Dark mode "stays warm (R ≥ G ≥ B)" | True for surfaces/rules; dark `--ink-2` `#b6bac0` and `--ink-3` `#949aa2` are slightly cool |
| Rows "fill" on hover | No fill: pad-left shift + hairline draw + arrow + accent number |
| `.hero-stat` left-border style | Defined but unused (the filled `.stat-float` tile replaced it) |
| `--tracking-label`, `--shadow-overlay/dialog`, `--radius-xl`, `--leading-display` | Defined as tokens, little or no use |
| `docs/design-review.md` motion plan items (shared-element title morph, scroll-linked row reveals, ClosingCta gradient shift, SkillsLedger rule draws) | **Not implemented**; do not assume them |


---

## 17. Interaction layer ("The Request")

Added on top of the system above without changing colour, type or content. Everything here is a progressive enhancement: the prerendered HTML is the complete plain page, and each effect switches on only after hydration, gated by `useMotionOk()` (no `prefers-reduced-motion`) and, for pointer effects, `useFinePointer()`.

**Concept.** The home page is one request travelling through a system. A thin wire runs down the left edge; scrolling draws it in accent colour and a pulse rides its head. Sections are hops: `gateway` (hero), `auth` (proof band), `services` (selected work), `database` (work history), `queue` (stack), `response` (closing CTA). Scrolling up rewinds it.

| Piece | File | Behaviour |
|---|---|---|
| Request wire | `components/RequestWire.tsx`, `.request-wire` | Fixed rail (20px, 56px from 1280px). Travelled stroke `scaleY` by scroll progress; pulse tail `24px + velocity*0.04` capped 140px, trails behind the direction of travel. Nodes come from `[data-hop]` sections, light when a section top crosses 60% of the viewport, pulse once (500ms), and are real `<a href="#id">` links. Other pages get the plain progress line. Rendered after the page in the DOM so its links are not tab stops before content. Replaces the old scroll-progress bar |
| Shared scroll store | `motion/scrollState.ts` | One passive listener + rAF decay; gives `{y, velocity, direction}`. Everything scroll-linked subscribes here and writes to the DOM directly (no React re-render per frame) |
| Smooth scroll | `motion/SmoothScroll.tsx`, `lenisInstance.ts` | Lenis (`lerp 0.09`, `wheelMultiplier 0.9`), lazy, fine pointer + motion-ok only; touch keeps native scroll. `scrollToTarget()` falls back to native smooth scroll. `html.lenis-active` turns off CSS `scroll-behavior` |
| Hero headline | `HeadlineReveal` (`reactive`, `introOnce`) | Letters gain a `-webkit-text-stroke` (max 1.1px, radius 160px) near the cursor. A text-stroke is used instead of a weight change so the line never reflows. Touch: one sweep after the intro. Intro plays once per session (`sessionStorage intro-played`); click or key skips it |
| Dot field | `components/DotField.tsx` | Canvas over the CSS dot grid; draws only dots within 140px of the cursor, pushes them up to 10px and tints them accent. The loop runs only while the pointer is active; it disables itself below ~50fps and falls back to the CSS spotlight. Listens for `dotfield:ripple` |
| Project track | `doc/CaseRows.tsx`, `CaseTrack.tsx`, `CaseCard.tsx` | Rows are the prerendered/no-JS/reduced-motion form. After hydration: >=1024px a sticky-pinned horizontal track (wrapper height `100vh + travel`, `translateX` from scroll progress, number drifts at 0.85), progress bar and "n of 3"; arrow keys and focus move the page, never the stage. Below 1024px a native `scroll-snap` swipe row with 88% slots (next card peeks) and dots |
| Ticker | `components/Ticker.tsx` | 40px/s (28px/s under 768px); speed `base + abs(v)*0.6`; scrolling up reverses; eased ~600ms; pauses on hover and off-screen. CSS drift is the fallback |
| Header | `doc/SiteHeader.tsx` | Hides (`translateY(-120%)`, 280ms) after 80px of downward scroll, returns on any upward scroll; never hidden at the top, with the menu open, or while focus is inside. One sliding highlighter (`.nav-slider`) replaces the per-link active style once measured |
| Skill tabs | `doc/SkillTabs.tsx` | `tablist` of the 7 `skillGroups`; pill slides via shared layout (spring); panel travels in the direction of the move (24px, 180ms); chips stagger 24ms capped 400ms; arrows/Home/End. Replaces the ledger after hydration only |
| Timeline | `motion/ScrollWipe.tsx` | `DrawLine`: the rail draws down its block and the dot fills when it arrives. `WipeLine`: bullets reveal by `clip-path` wipe. Both reverse. `/experience/` only |
| Title scrub | `motion/useTitleScrub.ts` | Section titles thicken (text-stroke up to 0.6px) as they cross the middle of the screen |
| Buttons | `index.css` `.btn*`, `components/Roll.tsx` | Primary: darker fill wipes up on hover, label rolls (`Roll`), press `scale(.97)` 90ms, 3px accent focus glow. Ghost: fill enters from the side the cursor came from (`data-from`). Disabled 50% |
| Toast | `components/Toast.tsx` | `showToast(text)`; mono, bottom right, `aria-live="polite"`, 2.4s |
| Pointer effects | `motion/Enhancements.tsx` -> lazy `pointerEffects.ts` | Loaded at idle, mouse only, not under forced colours. Cursor dot + ring (states: idle, link, label, text; labels from `data-cursor`). Tilt (`data-tilt`, max 6deg, specular highlight). Decode (`data-decode`, 320ms, accessible name preserved). Ghost-fill direction. Mouse-shake egg: 5+ reversals in 700ms at >1200px/s, once per 10s, ripples the dot grid and toasts `429 Too Many Requests. Easy there.` |
| Form | `pages/ContactPage.tsx` | An invalid field shakes (±6px, 3 cycles, 360ms) via `onInvalidCapture`; the native message still shows |
| Diagram draw-in | `diagrams/FanoutDiagram.tsx` | Strokes draw (`pathLength=1`) the first time it is 25% visible, then stay |
| Closing band | `doc/ClosingCta.tsx` | A small mono `200 OK` line above the headline (decorative, `aria-hidden`) |

**Deviations from the original spec (deliberate).** The native cursor is never hidden (the ring only adds to it). The project track label says "Scroll", not "Drag". Hero reactivity is a text-stroke, not a font-weight change. Pinning uses CSS `position: sticky` + `motion`, not GSAP ScrollTrigger. Palette and fonts stay as in sections 3 and 4.

**Budgets (enforced).** `pnpm budget` (`scripts/check-budget.mjs`) fails if first-load JS exceeds 180 KB gzipped or CSS exceeds 20 KB. CI also runs Lighthouse (desktop, home) and `scripts/check-lighthouse.mjs`: performance >= 0.9, accessibility >= 0.95, SEO >= 0.95, LCP < 2000ms, CLS < 0.05. Last local run: performance 0.99, accessibility 1.00, best-practices 0.96, SEO 1.00, LCP 0.8s, CLS 0.
