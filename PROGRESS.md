# PROGRESS.md

> Source of truth for what's done. Updated in the same commit as the work (CLAUDE.md §17).

| Metric | Value |
|---|---|
| Chapters published | 8 / 90 |
| Layers complete | 0 / 11 |
| Total diagrams | 17 |
| Total interactive widgets | 4 (PyRunner, QuizCard, FlashcardDeck, LessonChecklist) |
| Live URL | https://nitesh0007-edith.github.io/ai-engineer-course/ |

## Phase 0 — Foundation (CLAUDE.md §11)

| Step | Description | Status |
|---|---|---|
| 1 | `DESIGN.md` — design system | ✅ done (approved) |
| 2 | Scaffold Astro + React + Tailwind v4 + MDX + TS; deploy to Pages | ✅ done (live, green) |
| 3 | Content schema + chapter template + `pnpm new:chapter` | ✅ done |
| 4 | Shell: layout, nav, TOC rail, top bar + progress readout, search, theme toggle, glossary, MDX components | ✅ done |
| 5 | `<PyRunner />` end to end (Pyodide in a worker) | ✅ done |
| 6 | Diagram primitives (`Figure`/schematic frame + `CourseAssembly`, `DepthTiers`) | ✅ done (core; library grows per chapter, §9) |
| 7 | Chapter `00-00` written to definition-of-done and deployed | ✅ done |

**Phase 0 complete.** The reference chapter is live; later chapters are judged against it.

Notes:
- Content config lives at `src/content.config.ts` (Astro 7 requires this path; §4 predates the move).
- CI: `quality.yml` (on PRs and push to main) — typecheck, build, manifest, grep gate, **Playwright e2e + axe-core (zero violations, both themes), and Lighthouse CI (perf ≥95 / a11y 100 / best-practices ≥95, median of 3)**. Every published page currently scores 100/100/100. `deploy.yml` now triggers on Quality's `workflow_run` completing and only proceeds if it concluded `success` (2026-07-26) — a red Quality run no longer ships to production. `workflow_dispatch` still bypasses the gate for manual/emergency re-deploys.
- Search: Pagefind indexes at build (`postbuild`), UI island loads it lazily; degrades gracefully in dev.
- Diagram primitive library is intentionally minimal — built per §9 ("the first time a chapter needs it, then reuse") rather than all of §7 up front.
- Remaining §13 gates still to add: eslint/prettier, vitest, external link-check.

## Chapters

| id | title | layer | status | diagrams | interactives | published |
|---|---|---|---|---|---|---|
| 00-00 | How to use this course | 0 | published | 2 | 1 | 2026-07-24 |
| 00-01 | Python for AI engineering | 0 | published | 2 | 3 | 2026-07-24 |
| 00-02 | Async Python | 0 | published | 2 | 3 | 2026-07-26 |
| 00-03 | Modern Python tooling | 0 | published | 2 | 2 | 2026-07-27 |
| 00-04 | APIs & services | 0 | published | 3 | 4 | 2026-07-28 |
| 00-05 | Data & storage | 0 | published | 2 | 4 | 2026-07-28 |
| 00-06 | Containers, Git & CI | 0 | published | 2 | 4 | 2026-07-28 |
| 00-07 | Maths I: linear algebra & calculus | 0 | published | 2 | 4 | 2026-07-28 |
