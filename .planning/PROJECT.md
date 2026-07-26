# AI Engineer: Zero to Hero (Interactive Tutorial)

## What This Is

A beginner-friendly, deeply interactive, permanently free web tutorial covering the complete path from zero to production AI engineer — roughly 90 chapters across 11 layers (Layer 0 Foundations through Layer 10 Specialisations), plus a 6-project capstone track and appendices. Static site, no backend, hosted on GitHub Pages. Audience: a smart beginner who can read code and think logically but is assumed to know nothing about maths, ML, or LLMs going in.

## Core Value

Every chapter must contain something a reader cannot get from static prose — something they can run, break, tune, or watch move. If a chapter could be replaced by a Medium post, it has failed.

## Requirements

### Validated

- ✓ Phase 0 — Foundation infra (DESIGN.md, Astro/React/Tailwind/MDX scaffold live on GH Pages, content schema + `pnpm new:chapter`, site shell/nav/TOC/search/theme, `<PyRunner />` end to end, diagram primitives) — shipped
- ✓ 00-00 How to use this course — published 2026-07-24
- ✓ 00-01 Python for AI engineering — published 2026-07-24

### Active

<!-- Full list is the content manifest — see .planning/REQUIREMENTS.md and CLAUDE.md §10 for the authoritative topic list. -->

- [ ] Remaining ~88 chapters across Layers 0–10 (see REQUIREMENTS.md, one requirement per chapter)
- [ ] 6-project capstone track
- [ ] Appendices (glossary, maths reference, notation guide, reading list, UK job market guide)

### Out of Scope

- Next.js — SSR features we can't use on static GitHub Pages; heavier than needed for a content site
- Docusaurus / Nextra — off-the-shelf docs theme conflicts with the "beautifully designed, not generic" brief
- Any backend, database, or hosted API the site depends on to function — must build/run entirely static, client-side
- Any service requiring a paid tier — must stay permanently free
- Third-party images, stock photos, AI-illustration filler, scraped paper figures/screenshots — all visuals are original (SVG components, matplotlib-generated, or D3/canvas)
- Batch-generating multiple chapters in one session — quality collapses; explicitly forbidden by CLAUDE.md §15

## Context

- The full project contract lives in `CLAUDE.md` at the repo root — read it in full every session; this PROJECT.md does not restate it, only indexes against it.
- Design system is decided and approved: `DESIGN.md`.
- A prior planning document, `ai-engineer-roadmap-2026-2027.md`, contains earlier-stage roadmap thinking that predates the CLAUDE.md manifest; CLAUDE.md §10 is authoritative where they differ.
- Current published state, live diagram/widget counts, and per-chapter status live in `PROGRESS.md` — updated in the same commit as any chapter work, per CLAUDE.md §17.
- This is a 6–12 month project at a sustainable pace. Depth per chapter beats coverage; a half-finished excellent course beats a complete mediocre one.

## Constraints

- **Static-only**: No backend, no server, no database, no API keys at runtime — must build to static files for GitHub Pages (CLAUDE.md §2.1)
- **Client-side interactivity**: Python via Pyodide in a Web Worker; ML demos via transformers.js; anything needing a hosted LLM uses committed fixture data plus optional BYOK (§2.2)
- **No secrets in the repo, ever** — no `.env`, no keys in fixtures or code; BYOK values stay in-browser only (§2.3)
- **All images original** — hand-authored SVG/React diagrams or code-generated plots, never third-party (§2.4, §7)
- **No placeholder content in `main`** — no TODO/Lorem ipsum/"coming soon"; a chapter is finished-and-published or not in the nav (§2.5)
- **`main` always deployable** — every merge triggers production deploy; a red build is the only priority (§2.6)
- **Accessibility is a quality floor** — keyboard nav, focus rings, semantic HTML, alt text, `prefers-reduced-motion`, WCAG AA minimum (§2.7)
- **Never invent facts/benchmarks/citations** — omit or mark with `<Caveat>` if uncertain (§2.8)
- **Tech stack is fixed** per CLAUDE.md §3 (Astro 7, React 19, Tailwind v4, TypeScript strict, Pyodide, transformers.js, D3/visx, KaTeX, Shiki, Pagefind, Vitest/Playwright, pnpm) — verify current versions before touching deps, don't swap frameworks
- **Chapter contract is schema-enforced** — Zod schema in `src/content/config.ts` mechanically requires prerequisites, objectives, ≥2 diagrams, ≥1 interactive, ≥2 code examples, ≥3 exercises with solutions, ≥3 resources (§6)
- **One chapter per session** — never batch-generate; `/clear` between chapters (§11, §15)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro 7 + React 19 islands over Next.js | Ships ~zero JS on prose pages, static output fits GH Pages, islands only hydrate where needed | ✓ Good — Phase 0 live |
| Pyodide in a Web Worker as the core runnable-code primitive | ~60 chapters depend on runnable Python; worker keeps main thread responsive | ✓ Good — `<PyRunner />` shipped in Phase 0 |
| Model routing table (CLAUDE.md §5.1): fable/opus for hard infra & conceptually hard layers, sonnet for routine chapters/widgets, haiku for chores | Protects token/time budget across ~88 remaining chapters without sacrificing quality on the dozen hard ones | — Pending (apply per-session) |
| GSD (`gsd-*` skills) adopted to track the 90-chapter, 14-phase roadmap instead of manually re-deriving state each session | Manual CLAUDE.md/PROGRESS.md re-reading each session doesn't scale to months of sessions; GSD's phase/plan model maps 1:1 onto layer/chapter | — Pending (this session) |
| One GSD phase per content Layer (0–10), one GSD plan per chapter within it; capstone track and appendices get their own phases | Matches CLAUDE.md's existing "one chapter per session" rule exactly — no re-slicing of scope needed | — Pending |

---
*Last updated: 2026-07-26 after adopting GSD to manage the 90-chapter manifest*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state
