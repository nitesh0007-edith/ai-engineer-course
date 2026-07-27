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
- **Micropip-installing arbitrary pure(ish)-Python PyPI packages works and is genuinely powerful** —
  verified live: both `pytest` and `mypy` (plus its deps `typing-extensions`, `mypy_extensions`,
  `tomli`, `pathspec`) install via micropip and run for real in-browser, producing real terminal
  output (real `FAILED`/`PASSED` pytest output with assertion rewriting; real `mypy` error lines with
  rule codes). Pattern: put `packages={["micropip"]}` on `<PyRunner>` (this maps to
  `pyodide.loadPackage`, which micropip itself needs preloaded), then inside the cell's Python code:
  `import micropip; await micropip.install([...])`. Bare `import micropip` with no `packages` prop
  fails with `ModuleNotFoundError` — micropip is bundled with Pyodide but not auto-imported.
  Each `<PyRunner>` instance gets its own Worker/pyodide instance (not shared across cells on a page),
  so every cell that needs micropip pays its own install cost — don't assume a package installed in
  one cell is available in another.
- **Compiled/CLI tools cannot run in Pyodide at all** — `uv`, `ruff`, and `pre-commit` are Rust
  binaries / process-orchestration tools with no Python-importable API and no Pyodide/wasm build.
  For chapters covering these, use honest, clearly-labeled static terminal transcripts (real command
  output format, not fabricated benchmark claims) rather than a live cell — don't fake it as
  runnable.

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
   This also matters for `pnpm test:e2e` itself: `playwright.config.ts` sets
   `reuseExistingServer: !process.env.CI`, so *locally* it silently reuses whatever's already on
   :4321 — including a stale `astro dev` server — instead of the `astro preview` (built dist) server
   the config comments say it tests against. A stray dev server caused one flaky-looking local test
   failure (theme toggle) that vanished once the port was cleared and Playwright started its own
   `preview` server. Always check `lsof -i :4321` before trusting a local e2e failure.
7. When a `<Figure>` sits deep enough into a long chapter page (multiple thousand px of scrollY), the
   `mcp__claude-in-chrome__computer` screenshot action can intermittently return a **blank frame**
   even though the DOM/CSS is verifiably correct (confirmed via `getBoundingClientRect` +
   `getComputedStyle` + `elementFromPoint` all agreeing real content is painted there) — a capture
   tool quirk at depth, not a rendering bug. Don't chase it by fighting the screenshot tool; verify
   via JS-driven DOM/style inspection instead, and trust one successful screenshot earlier on the
   same page using the same diagram primitives as proof the styling itself is sound.
8. **FastAPI/Pydantic v2 genuinely run in Pyodide** (verified live, not assumed) — `pydantic` (with
   its Rust `pydantic-core`) and `fastapi` both install via micropip and import cleanly. Two non-
   obvious constraints, both confirmed by reproducing the failure first:
   - **Path operations must be `async def`, not plain `def`.** Starlette runs sync handlers through
     `anyio.to_thread.run_sync`, which spawns a real OS thread — unsupported in Pyodide
     (`RuntimeError: can't start new thread`). An `async def` handler never touches the thread pool
     and runs fine.
   - **Don't use `fastapi.testclient.TestClient`** — it also goes through an anyio thread portal and
     hits the same `can't start new thread` error. Instead call the app in-process with
     `httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test")` — genuinely
     no real socket, no thread, and it supports `client.stream(...)` for real Server-Sent-Events
     demos (`StreamingResponse` + an async generator + real `asyncio.sleep` between chunks) with
     real chunk-by-chunk timing. `pyjwt` also installs and runs cleanly for JWT encode/decode/verify
     demos. Give any JWT demo secret ≥32 bytes — a shorter one triggers PyJWT's
     `InsecureKeyLengthWarning` on **stderr**, and `worker.ts` captures stderr into the same visible
     output stream as stdout, so a short secret shows up as scary-looking noise in the cell's output.

## CI gating

`deploy.yml` triggers on `workflow_run` of `Quality` completing, and only proceeds if it concluded
`success` on a push to `main` (fixed 2026-07-26 — previously the two workflows were independent and
a Quality failure did not block Deploy). `workflow_dispatch` still bypasses the gate deliberately,
for manual/emergency re-deploys. Local `pnpm test:e2e` + `pnpm test:lh` before pushing are still
worth running for fast feedback, but CI now genuinely blocks a bad deploy too — use judgment on how
much local verification a given change warrants rather than treating it as mandatory in all cases.
