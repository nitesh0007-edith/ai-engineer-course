# Authoring notes — read this instead of re-reading 10 source files per chapter

A compact reference for writing chapters, distilled from actually building 00-00/00-01/00-02.
Re-derive only what's genuinely new for the chapter at hand; everything below is stable.

## Scaffolding a chapter

```bash
pnpm new:chapter <id> "<Title>"     # e.g. pnpm new:chapter 00-03 "Modern Python tooling"
```

Writes `src/content/chapters/<NN-layerslug>/<id>-<slug>.mdx` from `scripts/templates/chapter.mdx.tmpl`.
`id` must already be in the CLAUDE.md §10 manifest (`scripts/lib/manifest.mjs` reads it) — refuses to
overwrite. Layer→directory slugs are fixed: 0 foundations, 1 classical-ml, 2 deep-learning,
3 transformers, 4 llm-apps, 5 evals, 6 model-adaptation, 7 inference, 8 llmops, 9 safety,
10 specialisations.

## MDX component APIs (exact, from working chapters — don't guess)

```
<Prerequisites data={frontmatter} />
<Objectives data={frontmatter} />
<Exercises data={frontmatter} />
<Resources data={frontmatter} />

<Figure id="NN-NN.k" label="WHAT IT SHOWS" caption="— explains what to look at.">
  <YourDiagram />
</Figure>

<Callout type="watch-out">…</Callout>          {/* note | watch-out | danger */}

<CommonMistakes items={[{ mistake: '…', fix: '…' }, …]} />       {/* ≥3 */}
<Checkpoint questions={[{ q: '…', a: '…' }, …]} />                {/* 3–5 */}
<KeyTakeaways points={['…', …]} />                                {/* ≤5 */}
<NextUp slug="next-chapter-slug" title="Next Chapter" why="one sentence" />

<Term id="glossary-id">phrase in the flow</Term>   {/* hover-card, must exist in src/content/glossary/ */}
```

`<PyRunner client:idle id="NN-NN.X" label="LABEL" code={`python here`} />` — needs the
`import PyRunner from '../../../components/interactive/PyRunner.tsx';` (relative depth from
`src/content/chapters/<layer-dir>/` is 3 levels up). Same relative-import pattern for diagrams
from `src/components/diagrams/*.astro`.

## Pyodide / PyRunner — non-obvious runtime behavior (verified, not assumed)

- `PyRunner` runs `pyodide.runPythonAsync(code)` directly in a worker — **top-level `await` just
  works**, no `asyncio.run(...)` wrapper needed or wanted. Calling `asyncio.run(main())` inside a
  cell raises `RuntimeError: cannot be called from a running event loop`, because one already is.
  Say this explicitly in a `<Callout type="watch-out">` any time a chapter introduces `asyncio.run`.
- Real `asyncio.sleep`, `asyncio.gather`, `asyncio.wait_for`, `.cancel()` all behave with genuine
  wall-clock timing in-browser (confirmed via a real headless-browser run, not just docs) — safe to
  build timing-sensitive demos (1–2s waits) around them.
- `time.sleep` really blocks the worker thread (it's off the main thread, so the page doesn't
  freeze, but it does block that cell's own execution) — useful for contrasting blocking vs.
  non-blocking I/O honestly.
- matplotlib figures are auto-captured as base64 PNGs after the run; no special code needed beyond
  drawing to the current figure.

## Diagram style (`src/components/diagrams/*.astro`)

Plain hand-authored SVG, `viewBox` sized to content, `role="img"` + a full descriptive `aria-label`
(state what it shows, not what it is). Color tokens (never hardcode hex) — defined in
`src/styles/theme.css`, light+dark pairs:

- `--paper`, `--paper-raise`, `--paper-sink` — backgrounds
- `--ink`, `--ink-muted` — text
- `--frame`, `--hairline` — neutral borders/lines
- `--blueprint` — primary/structural accent (loops, wrappers, the "main" element)
- `--ch1`, `--ch2` — the only two semantic accent colors so far (used as a contrasting pair: e.g.
  eager/lazy, sequential/concurrent, running/parked). Add a `--ch3` to theme.css only if a diagram
  genuinely needs a third distinct semantic color — don't reuse ch1/ch2 for unrelated meanings.

Two-panel comparison diagrams (before/after, A vs B) use a `<line stroke="var(--hairline)">` divider
between panels — see `GeneratorStream.astro`, `ConcurrencyTimeline.astro`.

## Verification workflow that actually caught real bugs

1. `pnpm check:manifest` — fast, confirms id/status/layer wiring.
2. `pnpm check && pnpm build` — typecheck + static build.
3. **Run the actual interactive code in a real browser**, not just read it. `pnpm dev` (or build +
   `pnpm preview`), then a throwaway Playwright script (chromium headless) that clicks each
   `.lab-frame` button[▶ Run] and reads back `.py-out`/`.py-err`/`.lab-status` — this is what caught
   that the async examples produce the exact timings claimed in the prose. Delete the throwaway
   script after; don't commit it.
4. Add the new route to `tests/e2e/routes.ts` (axe + layout/mobile/keyboard/reduced-motion checks
   run automatically for anything in that list) and to `lighthouserc.json`'s `url` array.
5. Run `pnpm test:e2e` and `pnpm test:lh` **locally, before pushing** — see the CI note below, this
   is not optional.
6. If a test fails unexpectedly and looks unrelated to your change, check for a stray leftover dev
   server first (`lsof -i :4321`) before re-running the test repeatedly. `pkill -f "astro dev"`
   does **not** match the real process name (`astro.mjs dev`) — kill by PID from `lsof`/`ps` instead.

## CI gating — important, don't assume otherwise

`deploy.yml` and `quality.yml` are **independent** workflows, both triggered on `push: [main]`, with
no `needs:` or `workflow_run:` link between them (confirmed by reading both files, 2026-07-26).
**A Quality failure (e2e, axe, Lighthouse) does not stop Deploy from shipping to production.**
Local `pnpm test:e2e` + `pnpm test:lh` before pushing are therefore the *only* real gate — do not
skip them to save tokens/time. (Wiring `deploy` to actually wait on `quality` via `workflow_run`
would fix this properly; that's a CI/CD pipeline change and needs sign-off before touching it —
raise it, don't just do it.)
