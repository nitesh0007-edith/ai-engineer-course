# AI Engineer: Zero to Hero

A free, interactive course from foundations to production AI engineering. The
site is static, built with Astro, and deployed on GitHub Pages.

Live course: <https://www.learnaiwithnitesh.dev/>

## Published progress

- 22 of 90 lessons published
- Layer 00 — Foundations: complete
- Layer 01 — Classical Machine Learning: complete
- Layer 02 — Deep Learning: in progress

Every published lesson is authored as MDX and rendered through shared,
accessible lesson components. Core text remains semantic HTML; runnable Python
uses Pyodide in a browser worker.

## Local development

```bash
pnpm install
pnpm dev
```

Before publishing a meaningful change:

```bash
pnpm check
pnpm build
pnpm check:manifest
pnpm test:e2e
pnpm test:lh
```

See `CLAUDE.md` for the course manifest and definition of done, `DESIGN.md` for
the visual system, and `PROGRESS.md` for the current source-of-truth status.
