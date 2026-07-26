# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-07-26)
See also: .planning/AUTHORING-NOTES.md — read this instead of re-reading source files for component APIs, diagram tokens, Pyodide/PyRunner quirks, and the verification workflow. Saves ~15-20% of a chapter's token cost.

**Core value:** Every chapter must contain something a reader cannot get from static prose — something they can run, break, tune, or watch move.
**Current focus:** Phase 1 — Layer 0: Foundations

## Current Position

Phase: 1 of 14 (Layer 0 — Foundations)
Plan: 4 of 10 in current phase (00-03 Modern Python tooling, next up)
Status: Ready to plan
Last activity: 2026-07-26 — 00-02 Async Python published (2 new diagrams: ConcurrencyTimeline, EventLoopDiagram; 4 new glossary terms; verified live in a real browser via Playwright — all 3 PyRunner cells produce correct asyncio output; check/build/manifest/e2e-a11y/lighthouse all green)

Progress: [░░░░░░░░░░] 9% (10/108 plans complete: 7 infra + 00-00 + 00-01 + 00-02)

## Performance Metrics

**Velocity:**
- Total plans completed: 10 (7 infra + 3 chapters)
- Average duration: not yet tracked under GSD (chapters 00-00/00-01 predate this roadmap)
- Total execution time: not tracked pre-GSD

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 0. Foundation infrastructure | 7/7 | - | - |
| 1. Layer 0 — Foundations | 3/10 | - | - |

**Recent Trend:**
- Last 5 plans: not yet tracked
- Trend: N/A — GSD tracking starts now

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Phase 0]: Astro 7 + React 19 islands over Next.js/Docusaurus; Pyodide-in-worker as the core runnable primitive
- [Adopting GSD]: One phase per content Layer, one plan per chapter — mirrors CLAUDE.md's existing "one chapter per session" rule, no re-slicing needed
- [Model routing]: CLAUDE.md §5.1 model/effort table still governs which model runs each chapter — GSD's own model_profile setting does not override it; when planning/executing a chapter, honor §5.1 over any GSD default

### Pending Todos

None yet.

### Blockers/Concerns

- Phase 5 (Layer 4, LLM Application Engineering) plan 05-16 (04-16 Agents) is known to need splitting into 3–4 sub-chapters per CLAUDE.md §10 note — re-run `/gsd-plan-phase 5` when reaching it rather than shipping it as one chapter.
- `.planning/config.json` mirrors CLAUDE.md §13/§15 gates (no placeholder content, no batch-generation, grep gate) but does not replace them — `pnpm check && pnpm lint && pnpm build && pnpm check:manifest` remains mandatory before every commit regardless of what GSD's own gates report.

## Session Continuity

Last session: 2026-07-26 — bootstrapped `.planning/` from CLAUDE.md/PROGRESS.md, then built and shipped chapter 00-02 (Async Python) end to end: 2 new diagrams, 4 new glossary terms, 3 verified PyRunner cells, all quality gates green, committed and pushed.
Stopped at: 00-02 published and deployed. Next up: 00-03 Modern Python tooling.
Resume file: None
