# DESIGN.md — "Schematic"

> The design system for *AI Engineer: Zero to Hero*. Written before any component code, per CLAUDE.md §8/§16.
> Status: **awaiting approval** on one open decision (display face, §3.1). Everything else is specified.
> Reference mock: `scratchpad` artifact "Schematic — chapter mock 02-02" (chapter 02-02 stress test: 40-line listing, two KaTeX display equations, full-bleed lab, callout, margin notes, light/dark, 380px).

---

## 1. Concept

The course is a beautifully drawn **engineering datasheet**. The visual language comes from technical drawings: a dot-grid drafting canvas, schematic frames with corner registration marks, leader-line annotations, part numbers, phantom lines. Every diagram, listing, and interactive is a *labelled component mounted on the grid*.

Four principles, in priority order:

1. **The prose is the instrument panel's manual; keep it quiet.** Serif body, generous measure, almost no chrome. All boldness is spent on figures.
2. **Everything significant is a labelled part.** Diagrams, listings, labs, and equations carry machine-set identifiers (`FIG 04-13.2`). Consistency here *is* the brand.
3. **Two working accents, never more.** Blueprint (structure, links, primary) and Annotate (margin notes, cautions, secondary). Every other colour is a semantic derivation.
4. **The grid is always faintly present.** The dot canvas separates this from a generic docs site without ever competing with content.

Decisions already taken with the project owner:
- Direction A ("Schematic") chosen over "Descent" (topographic) and "Instrument" (console).
- The descent-path progress idea is **dropped**. Progress is an **exploded assembly diagram** (§6.2).
- The instrument-readout aesthetic from direction C is **kept, scoped to interactive widgets only** (§6.3).
- IBM Plex Serif (body) + IBM Plex Mono (code/labels) retained for shared vertical metrics; Plex Sans **rejected** as display — replaced by one of three candidates (§3.1).

---

## 2. Colour

All colours are OKLCH design tokens in `src/styles/theme.css` via Tailwind v4 `@theme`. **No hardcoded hex anywhere** — diagrams, plots, and widgets consume the same tokens through CSS variables.

### 2.1 Core tokens

| Token | Light | Dark | Role |
|---|---|---|---|
| `--paper` | `oklch(0.975 0.005 250)` | `oklch(0.21 0.015 255)` | page ground |
| `--paper-raise` | `oklch(0.99 0.003 250)` | `oklch(0.245 0.015 255)` | cards, frames, callout fills |
| `--paper-sink` | `oklch(0.945 0.008 250)` | `oklch(0.175 0.015 255)` | code beds, widget panels |
| `--ink` | `oklch(0.27 0.02 255)` | `oklch(0.90 0.01 250)` | body text |
| `--ink-muted` | `oklch(0.46 0.02 255)` | `oklch(0.67 0.015 252)` | secondary text, captions, gutters |
| `--blueprint` | `oklch(0.48 0.15 245)` | `oklch(0.74 0.12 235)` | primary accent: links, active nav, keywords, info |
| `--annotate` | `oklch(0.58 0.13 70)` | `oklch(0.79 0.13 78)` | secondary accent: margin notes, leader lines, caution |
| `--annotate-text` | `oklch(0.47 0.12 70)` | `oklch(0.79 0.13 78)` | annotate at text-safe contrast (light mode darkens it) |
| `--alert` | `oklch(0.53 0.18 25)` | `oklch(0.72 0.16 25)` | errors, danger callouts, failing states |
| `--grid-dot` | ink @ 10% | ink @ 9% | the dot canvas |
| `--frame` | ink @ 28% | ink @ 30% | schematic frame strokes, corner marks |
| `--hairline` | ink @ 14% | ink @ 15% | rules, borders, dividers |

Contrast policy: every `*-text`-role token on its permitted grounds must clear **WCAG AA 4.5:1** (3:1 for ≥24px display text). This is enforced mechanically — axe-core in CI (§CLAUDE.md 13) plus a token-pair contrast unit test in Vitest — not by eye.

### 2.2 Comparison channels

Every A/B comparison in the course (dense vs sparse, before/after rerank, FP16 vs INT4, naive vs production) uses the same two trace colours, everywhere:

| Token | Light | Dark | Meaning |
|---|---|---|---|
| `--ch1` | `oklch(0.48 0.11 215)` | `oklch(0.80 0.11 205)` | series A / forward / "before" |
| `--ch2` | `oklch(0.55 0.12 75)` | `oklch(0.80 0.12 80)` | series B / backward / "after" |

Never encode meaning by hue alone: CH1 is always solid stroke, CH2 always dashed (or otherwise pattern-differentiated) so colour-blind readers get the same information.

### 2.3 Semantic derivations

- **Callouts** (3 variants only): `note` → blueprint border + `--paper-raise` fill; `watch-out` → annotate; `danger` → alert. Label set in mono caps (`◆ NOTE`, `▲ WATCH OUT`, `✕ DANGER`). No green "success" callout — outcomes are shown in labs, not asserted in prose.
- **Code tokens** (Shiki dual theme mapped to variables): keyword → blueprint, string → `oklch(0.47 0.10 150)` / `oklch(0.75 0.10 150)`, number/constant → annotate-text, comment → ink-muted italic, function name → ink at weight 500. Nothing else. Restraint is deliberate: five token colours, all from the system.
- **Diagram palette**: strokes in `--frame`/`--ink`, emphasis in blueprint, annotation in annotate, data series in ch1/ch2, plus a 5-step categorical ramp derived by rotating hue from blueprint (245° → 205° → 165° → 75° → 25°) at fixed L/C per mode — defined once as `--cat-1…5`, used by every chart. Sequential data (heatmaps, attention weights) uses a single-hue blueprint lightness ramp, never rainbow.

---

## 3. Typography

### 3.1 Faces

| Role | Face | Weights shipped | Why |
|---|---|---|---|
| Body (long-form) | **IBM Plex Serif** | 400, 400i, 600 | Designed for screen reading; engineering-house heritage; shares vertical metrics with Plex Mono so inline code sits on the baseline without `vertical-align` hacks |
| Code, labels, numerics | **IBM Plex Mono** | 400, 500 | Same superfamily — the shared-metrics argument is the reason Plex stays |
| Display (headings, kicker, nav headers, wordmark) | **One of three candidates below** | 500, 600 | Plex Sans rejected as too-default; see candidates |

Display candidates (all OFL, all evaluated in the reference mock's live switcher):

- **A — Barlow Semi Condensed** (recommended). DIN-adjacent industrial-signage voice — the lettering language of actual title blocks and panel engravings. Slightly condensed, so long chapter titles ("Hybrid Search & Reranking") set on one line. Quietest of the three; lets figures carry the boldness, which is principle 1.
- **B — Big Shoulders.** American industrial signage; the most assertive and most memorable. Risk: at 44px it reads slightly "poster," and at small kicker sizes its condensation costs legibility a little.
- **C — Bricolage Grotesque.** Warm contemporary grotesque with real character. Risk: reads editorial/startup rather than schematic; weakest fit to the concept, included as the deliberate outsider.

**Final selection: pending owner review of the mock.** Whichever wins, the loser families are removed from the repo — we ship exactly three families.

Fonts are self-hosted woff2, latin subset, `font-display: swap`, preloaded on chapter pages. Budget: ≤ 120KB total font transfer per page.

### 3.2 Scale

Base 17px desktop / 15.5px under 700px. Body line-height 1.68. Measure: **66ch** (within CLAUDE.md's 65–75 target).

| Step | Size / line-height | Face & weight | Used for |
|---|---|---|---|
| `display` | 44 / 1.08 (31 mobile) | Display 600 | chapter `h1` |
| `h2` | 26 / 1.2 | Display 600 | sections (with `§n` marker in ink-muted) |
| `h3` | 21 / 1.3 | Display 600 | subsections |
| `subtitle` | 19 / 1.5 italic | Serif 400i | chapter subtitle |
| `body` | 17 / 1.68 | Serif 400 | prose |
| `secondary` | 15.5 / 1.6 | Serif 400 | callout bodies, exercise text |
| `caption` | 13.5 / 1.5 italic | Serif 400i | figure captions |
| `code` | 13 / 1.62 | Mono 400 | listings (12 mobile) |
| `note` | 12.5 / 1.55 | Serif 400 | margin notes |
| `label` | 10.5–12 / 1 caps +0.06em | Mono 500 | frame labels, meta chips, kickers use Display |

Numerics in readouts and tables: `font-variant-numeric: tabular-nums`.

### 3.3 Mathematics

KaTeX, statically rendered via `rehype-katex` — zero client JS. Display equations sit in an `.equation` wrapper: horizontally scrollable inner container (`overflow-x: auto`), equation number `(layer.n)` in mono, absolutely positioned right and **outside** the scroll container. KaTeX base size 1.16em against 17px body (verified comfortable in the mock); 1.02em under 700px. KaTeX fonts self-hosted with the same preload policy. Inline math inherits body size.

---

## 4. Layout

### 4.1 Desktop (≥ 1280px): three columns

```
| nav 208px | canvas: content 66ch + gutter 46px + rail 240px | 
```

- **Left nav**: sticky, full-height scroll. Layer headers in display caps; chapter links in 11.5px mono. Current chapter: blueprint text + 2px left rule + wash background.
- **Content column ("the canvas")**: carries the dot grid — `radial-gradient` dots, 26px pitch, `--grid-dot`. The grid renders on the main area only, never behind nav or top bar.
- **Annotation rail (240px)**: sticky "On this page" TOC at top; margin notes positioned below it, top-aligned to their anchors (JS alignment with collision push-down, min 28px gap; notes never intrude into the sticky TOC zone).

Top bar: wordmark (display), breadcrumb (mono caps), search stub (`⌘K`, Pagefind), course progress readout. Sticky, hairline bottom border, no shadow.

### 4.2 Width tiers

| Range | Behaviour |
|---|---|
| ≥ 1280 | Full three-column |
| 960–1279 | Nav collapses into a drawer behind `☰`; content + rail remain |
| < 960 | **Rail dissolves** (see 4.3); single column; nav stays in drawer |

Implemented with container queries on the page container (so widgets embedded in other contexts degrade the same way).

### 4.3 The rail at small widths — the fold rules

Decided against hiding annotations on mobile; they fold into the flow:

1. **TOC** becomes a collapsed `<details>` disclosure ("On this page") directly under the chapter meta block.
2. **Margin notes re-enter the flow** as inline asides placed immediately after the paragraph containing their anchor: 2px annotate left border, 13px note text, `◈ n` mono label. **The leader line folds into the border**: the horizontal leader + terminal dot become a short top tick on the border. Same ink, same meaning, different geometry.
3. Anchors keep their dotted-annotate underline and `◈n` superscript mark in both layouts, so the cross-reference reads identically.
4. Full-bleed elements span the viewport minus 16px padding; listings and equations scroll horizontally *inside their frames* — the page body never scrolls sideways.

### 4.4 Full-bleed grammar

Three content widths, used intentionally:

- **measure** (66ch): prose, equations, callouts.
- **bleed**: breaks the measure, stops before the rail — listings, most figures.
- **full**: runs under the rail to the canvas edge — labs and hero diagrams only. Rule: a `full` element must be self-contained (no margin note may anchor inside the text adjacent to it).

### 4.5 Spacing

4px base unit. Section rhythm: `h2` margin-top 52px; frames 34–44px top margin, captions 8px below their frame. Vertical rhythm is kept loose on purpose — dense figures need air.

---

## 5. The annotation system

The schematic's distinguishing prose feature. Two kinds of aside, with a bright-line rule:

- **Margin note** (rail): *optional* context — history, cross-references, forward pointers, memory-cost asides. The chapter must read complete if every margin note is skipped.
- **Callout** (in flow): *required* reading — warnings, honest caveats (`<Caveat>`), notation traps. If skipping it would harm the reader, it goes in the flow, not the margin.

Anatomy of a margin note: annotate top rule → horizontal leader line (46px) running toward the prose → 6px terminal dot at the content edge → `◈ n · MARGIN NOTE` mono label → 12.5px body. The anchor phrase in prose gets a dotted annotate underline + superscript `◈n`. Max ~2 notes per viewport-height of prose; collisions push down.

---

## 6. Signature elements

### 6.1 The figure-label system (primary signature)

Every significant artifact is a numbered part with a machine-set label on its frame:

| Prefix | Applies to | Example |
|---|---|---|
| `FIG` | diagrams | `FIG 04-13.2 · CROSS-ENCODER RERANK` |
| `LST` | code listings | `LST 02-02.3 · THE BACKWARD PASS, BY HAND` |
| `LAB` | interactive widgets | `LAB 02-02.A · BACKPROP TRACER` (letters, not numbers — labs are apparatus, not figures) |
| `(l.n)` | display equations | `(2.2)` |

Numbering is `{layer}-{chapter}.{counter}`, assigned in document order, stable once published (labels are anchor links; renumbering breaks citations). The **schematic frame** carries the label: 1px `--frame` border, label tab knocked out of the top-left border in mono caps with the prefix+number in blueprint, and four corner registration dots just outside the corners. Captions below frames: 13.5px italic serif, starting with the label reference.

This system is the site's memory hook, it compounds across ~250 figures, and it gives the whole course citable structure for free.

### 6.2 Progress: the exploded assembly diagram

Course/layer progress is drawn as an **exploded assembly**, in standard drafting grammar:

- A vertical **centerline** (long-dash-dot stroke, classic drawing convention) is the explode axis.
- Each **layer is a subassembly** — a row of part outlines exploded off the axis, labelled with its layer number in the title-block style.
- Each **chapter is a part**: completed chapters render **solid** (filled `--blueprint-wash`, full-strength `--frame` stroke); the chapter in progress renders half-toned; unread chapters render in **phantom line** (dashed 2-3, stroke at 40% alpha) — exactly the drafting convention for parts not yet in place. Unpublished chapters simply don't exist in the drawing (CLAUDE.md: nothing stubbed).
- Callout balloons (circled part numbers on thin leaders) link to chapters on the full version.
- Placements: full drawing on the landing page and each layer overview (the layer's subassembly enlarged); a compact readout in the top bar (`11/88` + a micro-assembly glyph).
- Built from the same primitives as every other diagram (§7) — no bespoke rendering path.
- Motion: on load the current layer's parts translate 8px apart along the axis (420ms ease-out, once). Reduced-motion: rendered already-exploded, static.

### 6.3 Instrument readouts (widgets only)

Interactive widgets — and only widgets — borrow the instrument aesthetic: readout blocks (label in 9.5px mono caps, value in 19px mono 500 tabular), control buttons in mono, CH1/CH2 trace colours, panel beds in `--paper-sink`. The `<CostMeter />` is this pattern verbatim. Prose, nav, and figures never use readout styling; the contrast between quiet paper and live instrument is the point.

---

## 7. Diagram grammar

All diagrams are hand-authored SVG components (`src/components/diagrams/`), drawn on the dot grid, consuming only tokens.

- **Strokes**: 1px structure (`--frame`), 1.4px emphasis/flows (blueprint or ch1), 1.2px dashed 4-3 for backward/derived flows (ch2/annotate). Arrowheads: small closed triangles, one size.
- **Nodes/boxes**: 3px corner radius, `--paper` fill on the raised frame bed; labels in 11px mono, sub-values in 9.5px mono ink-muted.
- **Dimension/leader lines**: 1px annotate with terminal dots — the same grammar as margin notes, so annotation reads identically in prose and figures.
- **Primitive library** (built early, per CLAUDE.md §7): `<Box>`, `<Arrow>`, `<Matrix>`, `<TokenStream>`, `<VectorSpace>`, `<Pipeline>`, `<Timeline>`, `<Annotation>`, plus `<SchematicFrame>` and `<CalloutBalloon>` for the label system and assembly drawing.
- Every figure: caption stating *what to look at*, and alt text describing what the figure *shows* (the relationship, not "a diagram of").
- Progressive disclosure preferred: `<DiagramStepper />` reveals labelled states; each step change is announced to screen readers via a live region.
- Data plots (matplotlib → SVG via `scripts/generate-plots.py`) use a committed style sheet mapping to the same palette; light/dark exported as CSS-variable-driven SVG where feasible, or paired exports where not.

---

## 8. Motion

Motion explains or it doesn't exist. The complete catalogue:

| Effect | Where | Spec |
|---|---|---|
| Leader/dimension lines draw in | figures entering viewport | 420ms ease-out, once, stroke-dashoffset |
| Assembly explode | progress drawing on load | 420ms ease-out, once |
| Stepper state change | `<DiagramStepper />`, labs | 250ms ease-in-out on stroke/fill |
| Readout tick | widget values updating | 180ms; numbers never animate through intermediate fake values |
| Focus/hover | links, buttons, nav | 120ms |

No parallax, no scroll-jacking, no entrance animations on prose, no looping ambient motion. Everything above is disabled (final state rendered directly) under `prefers-reduced-motion: reduce`, tested in CI.

---

## 9. Dark mode

Dark is a first-class theme, not an inversion: paper lifts to `L 0.21` (never near-black), accents brighten and desaturate slightly, grid dots drop to 9% alpha, code beds sink below paper. Theme = system preference + manual toggle persisted in `localStorage` (an allowed preference use). Every diagram, plot, KaTeX block, and widget must be checked in both modes before a chapter ships — it's in the definition of done.

## 10. Accessibility floor

Beyond CLAUDE.md §2.7: visible 2px blueprint focus ring with 2px offset on every interactive element; all frame labels are real text (never SVG-only); widgets fully keyboard-operable with the step/run controls in tab order; SVG diagrams get `role="img"` + substantive `aria-label` (or `<title>/<desc>`); live regions for lab readout changes; hit targets ≥ 40px on touch; the dot grid and leader lines are decorative (`aria-hidden`) — meaning is always carried by text.

---

## 11. Critique pass — what changed from the default instincts

Per CLAUDE.md §8, the parts of the first draft that read like autopilot, and what replaced them:

1. **Display face.** First instinct was Plex Sans (complete the superfamily) — that's the "IBM docs" default. Replaced with a distinct display voice (§3.1 candidates); the superfamily argument only genuinely applies to serif/mono baseline alignment, so that's all we kept.
2. **Descent-path progress** was a cross-metaphor contamination (topography inside a schematic). Replaced with the exploded assembly (§6.2), which uses the system's own drafting grammar — solid vs phantom line is a real convention, not an invented one.
3. **Callout rainbow.** The reflex is 5–6 coloured callout variants (info/tip/warning/success/danger). Cut to three, on the two working accents plus alert, and "success" removed entirely — a teaching site shouldn't assert success in a box; it should demonstrate it in a lab.
4. **Card look.** The shadcn default (8–12px radius, drop shadows, borderless cards) is replaced by the schematic frame: 1px border, ≤4px radius, corner registration dots, no shadows anywhere except the theme-independent mock chrome. Elevation is done by paper raise/sink, not shadow.
5. **Dot grid restraint.** Grid-paper backgrounds are themselves becoming a cliché. Ours survives because it's confined to the canvas column, sits at ≤10% alpha, sets the *coordinate system that diagrams actually align to* (26px pitch = diagram spacing unit), and disappears entirely behind frames.
6. **Mono discipline.** The failure mode of "technical" designs is mono everywhere. Mono is reserved for code, labels, numerics, and machine-set metadata. Prose is always serif; headings always display. If a string a human wrote for humans is in mono, that's a bug.
7. **Forbidden-defaults check** (CLAUDE.md §8): no cream/serif-display/terracotta (cool blue-grey paper, grotesque display, blue+amber accents); no near-black + single acid accent (dark paper at L 0.21, two accents); no broadsheet hairline-and-columns look (frames and canvas, 4px radii, no newspaper rules).

## 12. Open items

1. **Display face** — owner picks A/B/C from the live mock (recommendation: A, Barlow Semi Condensed).
2. Categorical ramp (`--cat-1…5`) exact values to be contrast-tuned when the first multi-series chart is built — the derivation rule is fixed (§2.3), the constants may shift.
3. Sticky-TOC/margin-note interaction on very short chapters (rail shorter than TOC): fall back to inline-fold behaviour below a note-count threshold. Decide when the first short chapter exists.
