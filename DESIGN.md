# DESIGN.md

The single source of truth for how this site looks, moves and sounds. Every page and component follows it. If something here and the code disagree, fix the code, or change this file on purpose.

## 1. Decisions (from the design interview)

| Question | Answer | What it means |
|---|---|---|
| Who is it for | Hiring managers and recruiters | They skim. Proof must land in the first screen, and "contact" must always be one click away. |
| Overall feel | Bold and expressive | Large type, one loud colour, confident motion. |
| What felt AI-made | Generic wording, too clean with no personality | Specific first-person copy with real numbers. Visible, memorable signature devices. |
| Reference sites | Brittany Chiang, Lee Robinson, Josh Comeau | Developer portfolios with personality and craft. Not corporate, not a template. |
| Colour | Warm paper plus one loud accent | Keep the cream paper and ink. The rust accent becomes a big, confident presence. |
| Type | Serif headlines plus mono details | Newsreader for impact. IBM Plex Mono for numbers, metadata, tech names. |
| Layout | Varied and asymmetric | Pages get their own composition. No repeated "label, heading, paragraph" template. |
| Motion | Playful throughout | Hover, scroll and click all respond. Always with a reduced-motion fallback. |
| Visitor should think | Precise, builder, senior and calm | Playful in the interactions, calm and exact in the reading and the words. |
| Copy | First person, plain, specific | "I cut report time in half." Numbers over adjectives. |
| Themes | Light and dark, follow the system | Every rule below holds in both. |

**Resolving the tension.** "Playful" and "senior and calm" can both be true. The rule: **the page is calm to read and fun to touch.** Body text, tables and case-study prose never move. Motion lives in headlines, numbers, buttons, rows and transitions.

## 2. The one big idea: the marked-up spec

The site is an engineer's working document. A reviewer has gone over it with a highlighter and a pen. That gives us three signature devices, used everywhere and nowhere else:

1. **The highlighter.** One or two key words per headline sit on a rust marker swipe (`.mark`). It draws left to right on load. This is the loudest, most recognisable thing on the site.
2. **The margin number.** Oversized mono section and project numbers (`01`, `02`) hang in the margin or behind the content, like page numbers in a spec.
3. **The ink-and-rust block.** Once per page, a full-width block flips to solid accent (or solid ink) with inverted text. It is the "shout" moment.

If a new element does not use one of these or the base tokens, it probably does not belong.

## 3. Colour

Warm paper, near-black ink, one accent. Never pure black, never pure white, never a second accent hue. Tokens live in `src/index.css`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#fbfaf8` | `#161310` | Page background |
| `--paper-2` | `#f3f1ec` | `#201c1a` | Raised bands, code, tables |
| `--ink` | `#15171a` | `#edeae4` | Main text, solid ink blocks |
| `--ink-2` | `#3e434b` | `#b6bac0` | Secondary text |
| `--ink-3` | `#5a6068` | `#949aa2` | Metadata (mono) |
| `--rule` | `#e3dfd7` | `#37302c` | Hairlines |
| `--accent` | `#b03a16` | `#f0784b` | Highlighter, solid blocks, links, key numbers |
| `--on-accent` | `#fbfaf8` | `#161310` | Text and icons placed on a solid accent block |
| `--accent-soft` | `#f8e3d9` | `#4b2616` | Highlighter swipe behind ink text |
| `--positive` / `--negative` | green / red | lighter | Status only (availability dot, form errors) |

Rules:
- **Accent coverage target: about 10 to 15% of a viewport at the loudest point, under 3% elsewhere.** Loud means a few big blocks, not many small ones.
- Text on accent always uses `--on-accent`. Text on `--accent-soft` uses `--ink`. Minimum contrast 4.5:1 for text and 3:1 for large text and UI. Check both themes.
- Accent is never used for body-text links at small sizes without an underline.
- Dark mode is the same design, re-tuned. It stays warm (R ≥ G ≥ B).

## 4. Typography

Three voices. Each has one job.

| Voice | Font | Used for |
|---|---|---|
| Read | Newsreader (serif, variable) | Headlines, long-form prose, big numbers |
| Scan | IBM Plex Sans | Buttons, nav, short UI text, table cells |
| Look up | IBM Plex Mono | Numbers, periods, tech stack, labels, code |

Scale (fluid, use the classes, do not invent sizes):

| Class | Size | Weight | Tracking | Use |
|---|---|---|---|---|
| `.t-mega` | clamp 2.5rem to 4rem | 500 | -0.035em | Home hero headline only |
| `.t-display` | clamp 2.25rem to 3.5rem | 500 | -0.03em | Page h1, closing CTA |
| `.t-section` | clamp 1.75rem to 2.5rem | 500 | -0.025em | Section h2 |
| `.t-title` | clamp 1.25rem to 1.625rem | 500 | -0.015em | Row and card titles |
| `.prose` | 1.0625 to 1.1875rem | 400 | normal | Reading text, max 34rem wide |
| `.t-small` | 0.9375rem | 400 | normal | UI text, secondary copy |
| `.t-meta` | 0.75rem mono | 500 | 0.04em | Metadata. Not uppercase unless it is a tiny status tag. |

Rules:
- **The biggest heading is at most about 3.5x body text (64px against 19px), and on every page the first screen must hold the headline, the supporting copy and the main button.** Never let a headline fill the viewport.
- **No tracked-out uppercase label above every heading.** Section titles are real serif headings with a margin number, not small caps labels.
- **Italic serif for emphasis** inside headlines (one phrase), loaded from Newsreader italic.
- Numbers always use `font-variant-numeric: tabular-nums`.
- Headlines use `text-wrap: balance`, body uses `text-wrap: pretty`. Never let a headline wrap to a single orphan word.
- Letter-spacing on body text: none. Tracking is only for mono micro-tags.
- Em-dashes: at most one per page of copy. Use a full stop or a colon.

## 5. Layout and space

- Container: `max-w-6xl` (72rem), side padding `1.25rem` mobile and `2rem` desktop. Reading text caps at `34rem`, evidence tables at `55rem`.
- Space is on a 4px base. Section padding: `5rem` mobile, `8rem` desktop. Never less than `4rem` between sections.
- **Linear flow first.** Content reads top to bottom in ruled rows, one clear next step per section. No staggered offsets, no tilted elements. Asymmetry comes from the split of columns, not from things jumping around.
- **Asymmetry in layout, not in position.** Use a 12-column grid. Offset content: headline in columns 1 to 9, supporting block in 8 to 12 overlapping. Avoid centring text blocks. Avoid three equal cards in a row.
- **Per-page composition** (each page must feel different, not just re-skinned):
  - **Home**: giant headline, a floating stat that overlaps the headline's end, a solid-accent proof band, big project rows, a stack ticker, an ink closing block.
  - **About**: a two-column editorial page, big pull-quote of the opening line, numbered "how I work" principles in a staggered layout.
  - **Experience**: a vertical timeline with the period in oversized mono in the margin.
  - **Projects**: one huge numbered row per project, hover fills the row.
  - **Case study**: sticky table of contents, a hero metric above the fold, calm reading column.
  - **Résumé**: the most restrained page. Ink on paper, print-friendly.
  - **Contact**: the form on a raised panel next to a big "how to reach me" list. The email is a one-tap copy button.
- Corners: `4px` for inputs and tags, `8px` for panels. No pill-shaped everything. No glassmorphism, no gradients as decoration, no drop shadows on cards (hairline plus surface change only). Shadows only for floating overlays.
- Icons: Lucide, 1.5 stroke, 16 to 20px, always with text or an `aria-label`.

## 6. Components

Everything hand-written lives in `src/index.css` (tokens and shared devices) and `src/components`. New UI reuses these.

| Component | Rule |
|---|---|
| **Mark** (`<Mark>`, `.mark`) | The highlighter. Max two per headline. Draws in over 700ms. Static when motion is reduced. |
| **Section heading** (`<SectionHeading>`) | Margin number (`01`) in mono, then a `.t-section` serif h2, optional right-aligned link. Replaces the small uppercase label. |
| **Button** (`.btn`) | 44px min height. Primary: solid accent, `--on-accent` text. Ghost: ink border. Hover: lifts 1px and the arrow slides. Primary buttons are magnetic on pointer devices. |
| **Row** (`.case-row`) | Big margin number, serif title, one metric, mono stack. On hover a rust hairline draws under the row, the number turns accent, the arrow slides in. No fill, no tilt. |
| **Metric** (`.metric`) | Number in serif, label in sans, method in mono. Counts up once when scrolled into view. The final value is always in the HTML. |
| **Ledger** (`.ledger`) | Hairline key/value list. The label is mono, not uppercase-tracked. |
| **Band** (`.band-accent`, `.band-ink`) | Full-width solid block with inverted text. Max one accent band and one ink band per page. |
| **Ticker** (`<Ticker>`) | A slow scrolling line of stack names. Decorative (`aria-hidden`). Pauses on hover and when motion is reduced. |
| **Copy button** (`<CopyEmail>`) | Click copies the email, label changes to "Copied" for 2 seconds. |
| **Header** | Wordmark left, nav right. Active link has the highlighter underline. Sticky, with a hairline that appears on scroll. |
| **Footer** | One compact row (about 70px): identity left, links right. No big email, no extra padding. |

## 7. Motion

Playful, but with a budget.

**Tokens:** easing `--ease-out` for entrances, `--ease-spring` for playful overshoot (buttons, tags). Durations: 140ms (hover), 240ms (small), 480ms (reveal), 800ms (hero, marker).

**Playful behaviours (all on):**
- Headline words rise out of a mask, then the `.mark` swipe draws.
- Numbers count up once on entering the viewport.
- Primary buttons are magnetic (follow the pointer within 12px). Pointer devices only.
- Rows fill and shift on hover. The wordmark has a small wiggle. The theme toggle spins.
- The stack ticker scrolls slowly.
- Route changes slide in the direction of travel. Theme change is the circular reveal.
- The scroll progress line under the header.

**Limits:**
- Animate `transform`, `opacity`, `background-size`, `clip-path` only. No layout-shifting animation.
- One main mover and at most two secondary movers per viewport.
- **Never move body text, tables or code.**
- Content must be fully present in the prerendered HTML and with JavaScript off. Animation only decorates.
- `prefers-reduced-motion: reduce`: no loops, no magnetic, no count-up, no ticker movement, instant transitions, the final state shown.
- Touch devices: no hover-dependent information.
- Performance budget: Lighthouse performance stays at 0.85 or higher. No new heavy libraries. Use CSS first, `motion` second.

### Backgrounds
- **Paper grain** on the whole page: inline SVG noise, opacity 3.5% light and 6% dark (`--grain`). Off in print and forced-colours.
- **Dot grid on every page** (all of `main`, from `AppShell`): an even, faint dot grid (`--dot`). On pointer devices a layer of accent dots appears around the cursor. Touch and reduced motion get the static grid.
- **Flowing packets** along the hero diagram's wires are the one autonomous mover on the home screen. They pause when scrolled away and do not render under reduced motion.
- **Never:** gradients or glows, particles, video, WebGL, stock photos. Text contrast must stay at 4.5:1 or better over any background.

## 8. Voice and copy

- **First person, plain, specific.** "I cut report generation time in half" beats "Delivers high-performance solutions".
- Lead with the number and say how it was measured.
- Short sentences. One idea per sentence.
- Banned words: leverage, seamless, robust, cutting-edge, passionate, synergy, "turning requirements into solutions", "in today's".
- No lists of three adjectives. No rhetorical questions as headings.
- Section headings are statements of fact: "Three projects, written up properly." not "Featured Projects".
- Buttons say what happens: "Read the case studies", "Copy email", "Download résumé (PDF)".
- Personality shows as a dry aside once in a while, never a joke in every section.

## 9. Accessibility and quality gates

- WCAG AA contrast in both themes. Focus rings always visible (2px accent outline, 2px offset).
- Everything works by keyboard. Skip link stays. Touch targets are 44px.
- Semantic headings: one h1 per page, h2 for sections.
- Reduced-motion, reduced-transparency, high-contrast and forced-colours media queries stay respected.
- Print: the résumé prints as a clean one-pager.
- SEO and prerender are unchanged: titles, descriptions, JSON-LD and the routes in `src/routes/manifest.tsx` are not part of a visual redesign.

## 10. How to apply this (checklist for any new page or component)

1. Does it use only the tokens above for colour, type, space?
2. Does the page have a different composition from its neighbours?
3. Is there exactly one "shout" (a mark, a band, or a giant number) and not three?
4. Is every claim specific, first person, with a number or a name?
5. Does it work with motion off, in dark mode, at 375px and at 1440px?
6. Does the prerendered HTML still contain the full content?

## 11. Anti-patterns (the "looks AI-made" list)

Do not add: gradient text, purple/blue gradients, glass cards, three identical feature cards, centred hero with two buttons and a badge, emoji as icons, uppercase eyebrow above every h1, stock illustrations, "Trusted by" logo strips, fake testimonials, floating decorative blobs, drop-shadow cards, generic copy that could belong to anyone.
