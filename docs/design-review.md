# Design review: make it smooth and premium

Reviewed 2026-10-10 with Impeccable 0.1.14 (`impeccable detect`), the ui-ux-pro-max and design-taste criteria, and a read of the motion and style code.

**Direction (agreed):** keep the "Engineering Document" identity (paper/ink/rust, Newsreader + IBM Plex) and add bold, creative, heavy motion in a few chosen places. This is not a restyle.

**Evidence and limits.** The detector ran on the rendered DOM at 1280px and 390px for every route. A static scan of `src/` reports nothing, because the issues only exist in the rendered output. Visual screenshots were limited: the built-in browser pane was too narrow for a 1440px comp, so one hero screenshot was reviewed by eye and the rest of the visual judgement comes from the detector, the CSS and the component code. A manual desktop and 375px pass in a real browser is still recommended before shipping anything below.

## What is already good (keep)
- One shared entrance primitive (`src/components/Reveal.tsx`), reduced-motion safe, content never depends on an animation firing.
- Route and theme changes use the View Transitions API (`src/lib/viewTransition.ts`, `src/index.css` ~L500-570), with a reduced-motion fallback and skip-in-flight handling.
- Tokenised easing and durations (`--ease-out`, `--dur-1/2/route`), warm dark mode, self-hosted fonts, SSR-safe prerender.
- Strong editorial typography and a clear hierarchy.

The foundations are good. The weakness is **timidity, not quality**: entrances are 10px fades, the route transition is a 320ms fade, and only two files use `motion`.

## Findings from the detector (18 hits, 6 distinct rules)

| # | Finding | Where | Severity | Cost |
|---|---|---|---|---|
| D1 | `hero-eyebrow-chip` / `kicker-above-heading`: tracked uppercase label above every page h1 | all 6 routes; ClosingCta ("Contact"); Projects | Medium (identity tell, repeated everywhere) | Low |
| D2 | `low-contrast` 2.1-2.5:1 on SVG labels ("1 upstream socket", "built here", "wss") from an opacity stack | `src/diagrams/HeroFlowDiagram.tsx` | High (WCAG AA fail, a11y) | Low |
| D3 | `oversized-h1` 88px, 45vh, 56 characters, five lines at 1280px | Home hero (`.t-display`, `src/index.css` L127) | Medium | Low |
| D4 | `wide-tracking` 0.06em on body text (x3) | `.label` style family | Low | Low |
| D5 | `em-dash-overuse` (advisory): 12 em-dashes in home copy | `src/content/*` | Low | Low |

Notes:
- D1 and D3 interact. Dropping the eyebrow and shortening the headline fixes both and lets the hero breathe. The eyebrow content ("Java backend, Mumbai") already appears in the ledger beside it.
- D2 is the only accessibility failure. Fix it first.

## Findings from review (not detector)

| # | Finding | Severity | Cost |
|---|---|---|---|
| R1 | At very narrow widths (~270px) the back-to-top button overlaps the primary hero CTA. | Low | Low |
| R2 | Entrance motion is uniform (same fade-up everywhere) so nothing is a focal moment. | High for the "premium" goal | Medium |
| R3 | `HeroFlowDiagram` animates once and stops (0.28s line draws). It is the best storytelling asset on the site and is under-used. | High | Medium |
| R4 | Hover states are 140-240ms colour and 1.5px translate. No depth, no cursor or magnetic feedback on CTAs. | Medium | Low |
| R5 | `ProofStrip` and hero stat show final numbers instantly. No count-up or reveal of the "measured" claim. | Medium | Low |
| R6 | `SkillsLedger` is static text. | Low | Low |
| R7 | Route transition is a plain fade. No directional or shared-element continuity from a case row to its case-study page. | Medium | Medium |
| R8 | `Reveal` uses `viewport once, amount 0.2` for everything. Nothing is scroll-linked. | Medium | Medium |

## Motion plan (bold, where it matters)

Heavy motion on five places only. The reading pages (About, Experience, case-study body text) stay calm.

1. **Hero (R3, D3).**
   - Kinetic headline: line-by-line mask reveal, about 0.7s, staggered 80ms.
   - `HeroFlowDiagram` becomes the signature moment: packets travel along the connectors on a loop, the "Tick Publish" node pulses, and the counter ticks up toward "1,000s of sessions".
   - Pause the loop when off-screen and under reduced motion.
2. **CaseRows (R2, R4, R8).**
   - Scroll-linked: each row's number and metric scrub in as the row crosses the viewport.
   - On hover the row lifts with a rule-line draw, the arrow slides, and the metric swaps to a larger weight.
   - Use CSS scroll-driven animations (`animation-timeline: view()`) first, `motion` `useScroll` as the fallback.
3. **Route transitions (R7).** Directional slide with a shared-element morph of the case title (View Transitions `view-transition-name` per slug). Keep the existing header and back-to-top exclusions.
4. **ProofStrip / SkillsLedger (R5, R6).** Count-up on enter (once), ledger rows draw their rule then fade in with a 40ms stagger.
5. **ClosingCta.** Magnetic primary button (pointer devices only), the headline reveals by mask, and the paper-2 background does a slow scroll-linked gradient shift.

Global motion system (put it in `index.css` tokens so it stays consistent):
- Two easings only: `--ease-out` (entrances) and one `--ease-in-out` (travel). Four durations: 140 / 240 / 480 / 720ms.
- A per-section "choreography" rule: one primary mover and at most two secondary movers per viewport.

## Tooling decision
1. CSS scroll-driven animations and View Transitions first (compositor-driven, zero JS).
2. `motion` (already a dependency) for stagger, count-up and `useScroll`.
3. GSAP + ScrollTrigger or Lenis only if a pinned or scrubbed sequence cannot be done with 1 and 2. They must be lazy-loaded and client-only, because the site is prerendered.

## Guardrails (hard requirements)
- `prefers-reduced-motion`: calm fallback, no loops, no parallax, content present.
- Lighthouse CI (`.github/lighthouserc.json`): performance >= 0.85 (error), SEO >= 0.95 (error), accessibility and best practices >= 0.9 (warn). Heavy motion has to fit inside a 0.85 performance budget, so no new large JS on first load.
- No layout shift from animations: animate `transform` and `opacity` only, reserve space for count-ups.
- Prerendered HTML must stay complete: `deploy.yml` asserts routes, titles, sitemap count and no `data-msg=` fallback.
- Touch devices: no hover-dependent features, lighter effects.

## Suggested order
**Ship first (low cost, high value):** D2 contrast, D1/D3 hero cleanup, D4 tracking, R1 back-to-top overlap.
**Next (the motion work):** hero kinetic headline and diagram loop, CaseRows scroll-linked reveal, ProofStrip count-up.
**Then:** route-transition shared-element morph, ClosingCta magnetic CTA.
**Maybe:** SkillsLedger rule draws, em-dash copy pass (D5).

## Success check
Impeccable `detect` reports zero findings on every route at 1280 and 390px, Lighthouse CI stays green, and a manual pass at 1440px and 375px (light and dark) feels smooth at 60fps with a clear focal point at each scroll position.

## Housekeeping
- Removed stale Replit leftovers (`.replit`, `replit.md`, `metadata.json`).
- Fixed `pnpm-workspace.yaml`: it listed only `allowBuilds`, which made every `pnpm` command fail with "packages field missing or empty". Added `packages: ["."]`.
- Open items: the `package.json` name is still `react-example`; the `.github/skills/impeccable` copy includes a 19 MB Windows `.exe` (consider un-tracking it and keeping the install in the gitignored `.claude/`).
