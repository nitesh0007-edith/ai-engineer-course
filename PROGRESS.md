# PROGRESS.md

> Source of truth for what's done. Updated in the same commit as the work (CLAUDE.md §17).

| Metric | Value |
|---|---|
| Chapters published | 0 / 90 |
| Layers complete | 0 / 11 |
| Total diagrams | 0 |
| Total interactive widgets | 0 |
| Live URL | https://nitesh0007-edith.github.io/ai-engineer-course/ |

## Phase 0 — Foundation (CLAUDE.md §11)

| Step | Description | Status |
|---|---|---|
| 1 | `DESIGN.md` — design system | ✅ done (approved) |
| 2 | Scaffold Astro + React + Tailwind v4 + MDX + TS; deploy to Pages | ✅ done (live, green) |
| 3 | Content schema + chapter template + `pnpm new:chapter` | ✅ done |
| 4 | Shell: layout, nav, sidebar, TOC, progress, search, theme toggle, glossary | ⬜ next |
| 5 | `<PyRunner />` end to end | ⬜ pending |
| 6 | Diagram primitive library | ⬜ pending |
| 7 | Write chapter `00-00` to definition-of-done and deploy | ⬜ pending |

Notes:
- Content config lives at `src/content.config.ts` (Astro 7 requires this path; §4 predates the move).
- CI: `deploy.yml` (build + Pages on push to main), `quality.yml` (typecheck, build, manifest, grep gate on PRs). Lint/vitest/playwright/axe/lighthouse/link-check gates land with the tooling they need.

## Chapters

| id | title | layer | status | diagrams | interactives | published |
|---|---|---|---|---|---|---|
| — | _none yet_ | — | — | — | — | — |
