# CLAUDE.md — AI Engineer: Zero to Hero (Interactive Tutorial)

> This file is the contract for this repository. Read it fully at the start of every session.
> If anything you are about to do contradicts this file, stop and ask.

---

## 1. Mission

Build **the best free interactive AI engineering course on the internet** — a beginner-friendly, deeply interactive, beautifully designed, permanently free web tutorial covering the complete path from zero to production AI engineer, based on the content manifest in §10.

**Audience:** a smart beginner. Assume they can read code and think logically. Assume **nothing** about their maths, ML, or LLM knowledge. Every concept is built from the ground up.

**The bar:** if a chapter could be replaced by a Medium post, it has failed. Every chapter must contain something a reader cannot get from static prose — a thing they can *run*, *break*, *tune*, or *watch move*.

**This is a long project.** ~88 chapters across 11 layers. Roughly 6–12 months at a sustainable pace. Do **not** try to scaffold all of it at once. Depth per chapter beats coverage. A half-finished excellent course is worth more than a complete mediocre one.

---

## 2. Non-negotiables

These are hard constraints. Violating any of them is a bug.

1. **Static-only.** The site must build to static files and run with **no backend, no server, no database, no API keys**. It is hosted on GitHub Pages.
2. **Every interactive demo runs client-side.** Python runs via Pyodide in a Web Worker. ML demos run via `transformers.js` (WebGPU/WASM). Anything that genuinely needs a hosted LLM uses **committed fixture data** (pre-recorded request/response JSON) plus an optional bring-your-own-key mode.
3. **No secrets in the repo. Ever.** No `.env` committed, no keys in fixtures, no keys in code. BYOK values live in the browser only and are never sent anywhere except the user's chosen provider.
4. **All images are original.** Author diagrams as SVG/React components or generate plots with code committed to the repo. **Never** hotlink, scrape, download, or reproduce third-party images, figures from papers, book excerpts, or screenshots of other products. If a concept needs a famous figure, redraw it in our own visual language from the underlying idea.
5. **No placeholder content in `main`.** No `TODO`, no `Lorem ipsum`, no "content coming soon", no stub chapters listed in navigation. A chapter is either finished and published or not in the nav.
6. **`main` is always deployable.** Every merge to `main` triggers a production deploy. If the build is red, fixing it is the only priority.
7. **Accessibility is a quality floor, not a feature.** Keyboard navigable, visible focus rings, semantic HTML, alt text on every visual, `prefers-reduced-motion` respected, WCAG AA contrast minimum.
8. **Never invent facts, numbers, benchmarks, citations, or paper titles.** If you are not certain, either omit it or mark it explicitly in a `<Caveat>` component. Fabricated technical claims are the worst possible failure mode for a teaching resource.

---

## 3. Tech stack

**Before scaffolding, check the actual current versions** (`npm view <pkg> version`). The versions below were correct in July 2026 — verify, don't assume, and pin exact versions in `package.json`.

| Concern | Choice | Why |
|---|---|---|
| Framework | **Astro 7** | Content-first, islands architecture, ships ~zero JS on prose pages, first-class MDX, static output for GitHub Pages |
| Interactive islands | **React 19** (`@astrojs/react`) | Only hydrated where a widget actually needs it |
| Content | **MDX + Astro Content Layer API** (`glob` loader), Zod schemas | Type-safe frontmatter; schema validation mechanically enforces the chapter contract |
| Styling | **Tailwind CSS v4** via `@tailwindcss/vite` | CSS-first config with `@theme`, OKLCH tokens. Do **not** use the deprecated `@astrojs/tailwind` integration |
| Components | **shadcn/ui** (selectively) + custom | Use as a base, restyle to our design system. Do not ship stock shadcn look |
| Language | **TypeScript**, `strict: true` | No `any` without a comment justifying it |
| Python in browser | **Pyodide** (in a Web Worker) | numpy, pandas, scikit-learn, matplotlib all work. This is the backbone of runnable examples |
| ML in browser | **transformers.js** | Real tokenizers, real embeddings, small models, WebGPU where available |
| Charts / viz | **D3** for bespoke visualisations, **visx** or Recharts for standard charts | Prefer bespoke SVG where the visual *is* the explanation |
| Math rendering | **KaTeX** via `rehype-katex` | Fast, static, no runtime cost |
| Code highlighting | **Shiki** (Astro built-in) with dual themes | Static, no client JS |
| Diagrams | **Hand-authored SVG React components** (primary); Mermaid only for throwaway flowcharts | See §7 |
| Animation | **Motion** (`motion/react`) | Sparingly. See §8 |
| Search | **Pagefind** | Static full-text search, indexes at build time, zero infra |
| Testing | **Vitest** (unit), **Playwright** (e2e + visual regression) | |
| Linting | **ESLint 9** flat config, **Prettier**, `astro check` | |
| Package manager | **pnpm** | |
| CI/CD | **GitHub Actions → GitHub Pages** | |

**Explicitly rejected:** Next.js (SSR features we can't use on Pages, heavier for a content site), Docusaurus/Nextra (we want a custom design, not a docs theme), any service requiring a paid tier or a backend.

---

## 4. Repository structure

```
/
├── CLAUDE.md                    ← this file
├── DESIGN.md                    ← design system, written in session 1, then obeyed
├── PROGRESS.md                  ← chapter-by-chapter status. Update EVERY session
├── CONTRIBUTING.md
├── README.md                    ← project overview + live link
├── astro.config.mjs
├── tailwind.config / src/styles/theme.css
├── .github/workflows/
│   ├── deploy.yml               ← build + deploy to Pages on push to main
│   └── quality.yml              ← lint, typecheck, test, a11y, link check on PRs
├── src/
│   ├── content/
│   │   ├── config.ts            ← Zod schemas (the enforcement mechanism)
│   │   ├── layers/              ← layer-00.mdx … layer-10.mdx (layer overviews)
│   │   ├── chapters/
│   │   │   ├── 00-foundations/
│   │   │   │   ├── 00-01-how-to-use-this-course.mdx
│   │   │   │   └── …
│   │   │   ├── 01-classical-ml/
│   │   │   └── …
│   │   ├── glossary/            ← one file per term, hover-cards pull from here
│   │   └── resources/           ← curated links, per chapter
│   ├── components/
│   │   ├── mdx/                 ← components auto-available in MDX (§6)
│   │   ├── interactive/         ← the widget library (§9)
│   │   ├── diagrams/            ← one component per diagram (§7)
│   │   └── ui/                  ← layout, nav, sidebar, TOC, theme toggle
│   ├── layouts/
│   ├── lib/
│   │   ├── pyodide/             ← worker, package preloading, output capture
│   │   ├── transformers/        ← model loading, caching, WebGPU detection
│   │   └── fixtures/            ← recorded LLM traces, embeddings, eval runs
│   ├── pages/
│   └── styles/
├── public/
│   ├── fixtures/                ← large JSON fixtures (traces, corpora)
│   └── corpora/                 ← small text corpora for retrieval demos
├── scripts/
│   ├── generate-plots.py        ← matplotlib → committed SVG
│   ├── record-fixtures.ts       ← run ONCE with a local key, commit output, never in CI
│   └── check-manifest.ts        ← fails if a manifest topic has no chapter
└── tests/
```

---

## 5. Commands

```bash
pnpm install
pnpm dev                 # local dev server
pnpm build               # production build — MUST pass before any commit
pnpm preview             # preview the production build locally
pnpm check               # astro check + tsc --noEmit
pnpm lint                # eslint + prettier
pnpm test                # vitest
pnpm test:e2e            # playwright
pnpm test:a11y           # axe accessibility pass
pnpm check:links         # internal + external link validation
pnpm check:manifest      # every manifest topic has a chapter; every chapter meets schema
pnpm new:chapter         # scaffold a chapter from the template
```

**Before every commit, run:** `pnpm check && pnpm lint && pnpm build && pnpm check:manifest`.
Never commit a red build. Never use `--no-verify`.

---

## 5.1 Model & effort selection

This project has three distinct kinds of work with very different difficulty profiles. Match the model to the work — it protects quota on the ~88 routine sessions and buys real capability on the dozen hard ones.

**Repo default:** `opusplan` at `xhigh` effort. Plan mode reasons on Opus, execution runs on Sonnet — which is exactly the shape of the per-session protocol in §11.

### Which model for which task

| Task | Model | Effort |
|---|---|---|
| `DESIGN.md`, design critique pass | `fable` | `xhigh` |
| Astro/Tailwind/MDX scaffolding, deploy pipeline, base-path debugging | `opusplan` | `xhigh` |
| **`<PyRunner />`** — Pyodide in a worker, package preloading, matplotlib capture | `fable` | `ultracode` |
| `<RetrievalLab />`, `<AttentionVisualizer />`, `<EmbeddingExplorer />` — the transformers.js widgets | `fable` | `xhigh` |
| Standard interactive widgets, diagram components | `sonnet` | `high` |
| Chapter prose against the §6 template | `sonnet` | `high` |
| Chapters for Layers 3, 5 and 6 (transformers, evals, fine-tuning — the conceptually hardest) | `opus` | `xhigh` |
| Cross-cutting refactors, a build failure you can't localise, anything spanning >5 files | `fable` | `xhigh` |
| `PROGRESS.md`, link fixes, test scaffolds, file moves, dependency bumps | `haiku` | `medium` |

### Settings

`.claude/settings.json` (commit this — it's project config, not personal preference):

```json
{
  "model": "opusplan",
  "effortLevel": "xhigh",
  "fallbackModel": ["opus", "sonnet"],
  "env": {
    "CLAUDE_CODE_SUBAGENT_MODEL": "haiku"
  }
}
```

Switch mid-session with `/model fable` or `/effort ultracode`. Both revert when you start a fresh session unless saved.

### Rules

- **Escalate on the second failure, not the fifth.** If a session stalls twice on the same problem, switch up a model rather than re-prompting the same one. Re-prompting a model that has already failed twice on a problem almost never works and burns more quota than the switch would have.
- **De-escalate deliberately.** Once a widget pattern is established, subsequent widgets of the same type drop to `sonnet`. Chapter 04-11 does not need what chapter 04-13 needed.
- **Prompting Fable differently matters.** Describe the *outcome*, not the steps — hand it "PyRunner works end to end including matplotlib figures and a package-loading state" rather than a numbered plan. Do not add "remember to test this" reminders; it verifies its own work without them. Give it whole tasks you would otherwise split across sessions.
- **`/clear` between chapters.** Chapter N's context is noise for chapter N+1. The exceptions are `DESIGN.md` and the chapter template, which should be re-read at the start of every authoring session anyway.
- **Requires Claude Code v2.1.197 or later.** Run `claude update` if `/model` doesn't list Sonnet 5 or Fable 5.

---

## 6. Content model & the chapter contract

### Frontmatter schema (`src/content/config.ts`)

This schema is how "don't miss anything" is enforced mechanically. Make the required fields genuinely required — a chapter that doesn't meet the contract must fail the build.

```ts
const chapter = z.object({
  layer: z.number().min(0).max(10),
  order: z.number(),
  title: z.string(),
  slug: z.string(),
  subtitle: z.string(),
  depth: z.enum(['build', 'use', 'know']),        // from the roadmap tiers
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  readingTime: z.number(),                         // minutes, honest estimate
  prerequisites: z.array(z.string()),              // chapter slugs
  objectives: z.array(z.string()).min(3),          // "By the end you can…"
  concepts: z.array(z.string()).min(3),            // glossary term ids introduced
  diagrams: z.array(z.string()).min(2),            // component names — MIN 2
  interactives: z.array(z.string()).min(1),        // widget names — MIN 1
  codeExamples: z.number().min(2),
  exercises: z.array(z.object({
    prompt: z.string(),
    difficulty: z.enum(['warmup', 'core', 'stretch']),
    solution: z.string(),                          // every exercise has a solution
  })).min(3),
  resources: z.array(z.object({
    title: z.string(), url: z.string().url(), type: z.enum(['paper','docs','video','course','blog','repo']),
  })).min(3),
  status: z.enum(['draft', 'review', 'published']),
  updated: z.date(),
});
```

### Required chapter structure

Every chapter MDX file follows this shape, in this order:

1. **The hook** — a concrete problem, a surprising result, or a broken thing. Never open with a definition. Never open with "In this chapter, we will…"
2. **`<Prerequisites />`** — auto-rendered from frontmatter, with links.
3. **`<Objectives />`** — what the reader will be able to *do*.
4. **The intuition** — the idea in plain English with a real-world analogy, **before** any notation or code. A reader must be able to explain the concept to a friend after this section alone.
5. **The diagram** — a visual of the concept. Minimum two per chapter.
6. **The mechanics** — how it actually works. Maths only after intuition, and every symbol defined the first time it appears.
7. **Worked example** — a small concrete case computed step by step, by hand where feasible, with real numbers.
8. **`<PyRunner />` / `<Interactive />`** — the reader runs, tunes, and breaks it. Minimum one per chapter.
9. **Production reality** — how this is actually used in real systems, what breaks, what it costs, what the trade-offs are. **This section is what separates this course from every free tutorial.** Never skip it.
10. **`<CommonMistakes />`** — at least three real failure modes with the fix for each.
11. **`<Exercises />`** — warmup, core, stretch. Every one has a worked solution behind a disclosure.
12. **`<Checkpoint />`** — 3–5 retrieval questions.
13. **`<KeyTakeaways />`** — no more than five bullets.
14. **`<Resources />`** — curated, with a one-line note on why each is worth reading.
15. **`<NextUp />`** — what comes next and why it follows.

### Definition of done

A chapter is `published` only when **all** of these hold:

- [ ] Schema validates; `pnpm check:manifest` passes
- [ ] Every manifest subtopic for the chapter is genuinely covered (not just name-dropped)
- [ ] ≥2 original diagrams, ≥1 working interactive, ≥2 runnable code examples
- [ ] All code examples actually execute — verified, not assumed
- [ ] Production-reality section is present and specific
- [ ] ≥3 exercises with solutions
- [ ] All prose read once for the "would a beginner follow this?" test
- [ ] No unexplained jargon; every term either defined inline or in the glossary
- [ ] Dark mode checked, mobile checked, keyboard checked, reduced-motion checked
- [ ] Lighthouse ≥95 performance / 100 accessibility on the chapter page
- [ ] `PROGRESS.md` updated

---

## 7. Diagrams & images

The request is for "lots of images." That means **lots of purpose-built explanatory visuals**, not decoration.

**How to make them:**

- **Primary: hand-authored SVG as React/Astro components** in `src/components/diagrams/`. One component per diagram. Themeable via CSS variables so dark mode works. Animatable. Zero image requests.
- **Data plots:** written in `scripts/generate-plots.py` (matplotlib), output SVG committed to the repo, generation script committed alongside. Reproducible.
- **Live/derived visuals:** D3 or canvas, computed in the browser (loss surfaces, attention heatmaps, embedding projections).
- **Never:** stock photos, AI-generated illustrations as filler, screenshots of other people's products, figures lifted from papers or blogs.

**Rules:**

- Every diagram has a caption explaining what to look at, and meaningful `alt` text describing what it *shows*, not what it *is*.
- Diagrams use the design system's colour tokens — never hardcoded hex.
- Prefer progressive diagrams: a `<DiagramStepper />` that reveals a complex figure one labelled step at a time beats one dense figure.
- Every layer gets a hero diagram; every chapter gets ≥2.

**Target:** ~250+ original diagrams across the course. Build a reusable primitive library early (`<Box>`, `<Arrow>`, `<Matrix>`, `<TokenStream>`, `<VectorSpace>`, `<Pipeline>`, `<Timeline>`, `<Annotation>`) so diagram #100 is fast to author.

---

## 8. Design system

**Session 1 deliverable: `DESIGN.md`.** Do the work properly — two passes, brainstorm then critique — before writing component code.

**Brief:** a serious, technical, beautiful learning environment for engineers. Long reading sessions. Dense information. Code, maths, and interactive machinery sitting comfortably next to prose. It should feel like a well-made instrument, not a marketing site.

**Ground the visual language in the subject's own world:** matrices and grids, token streams, gradients and descent paths, attention weights, signal traces, latency waterfalls, embedding space. The design language should come from *that*, not from generic tech-startup vocabulary.

**Forbidden defaults.** These three looks are what AI-generated design converges on. Do not ship any of them:
1. Cream/off-white background (~`#F4F1EA`) + high-contrast serif display + terracotta accent (~`#D97757`)
2. Near-black background + a single acid-green or vermilion accent
3. Broadsheet layout: hairline rules, zero border-radius, dense newspaper columns

**Required in `DESIGN.md`:**
- **Colour:** 4–6 named tokens in OKLCH, with light + dark values, plus semantic tokens (code, math, callout variants, diagram palette). Contrast-checked.
- **Type:** a display face, a body face optimised for long-form reading, and a mono face for code and numerics. Deliberately paired — not Inter + JetBrains Mono by reflex. Full type scale with weights and line heights. Long-form body copy: 65–75 characters per line.
- **Layout:** three-column at desktop (nav / content / TOC + progress), collapsing gracefully. Content column must accommodate full-bleed diagrams and interactive widgets without feeling cramped.
- **Signature element:** one memorable thing the site is remembered by. Spend your boldness here and keep everything else quiet.
- **Motion:** deliberate and minimal. Motion is for *explanation* (a gradient descending, a token being consumed, data flowing through a pipeline), not for delight. All motion respects `prefers-reduced-motion`.

Then critique the plan: if any part reads like the default you'd produce for any technical site, revise it and note what changed and why.

---

## 9. Interactive component library

Build these as reusable islands in `src/components/interactive/`. Build a widget the first time a chapter needs it, then reuse. Each ships with its own Vitest tests and a Playwright smoke test.

### Core infrastructure

| Component | What it does |
|---|---|
| `<PyRunner />` | Editable Python cell, executes in a Pyodide Web Worker. Preloaded numpy/pandas/sklearn/matplotlib. Captures stdout, errors, and matplotlib figures. Reset button, "reveal solution", package loading indicator. **The workhorse of the whole course** |
| `<JsRunner />` | Same idea for JS/TS via Sandpack or a sandboxed worker |
| `<Quiz />` `<Checkpoint />` | Multiple choice + free-response with explanations for *why* wrong answers are wrong |
| `<DiagramStepper />` | Reveals a diagram one labelled step at a time |
| `<Compare />` | Side-by-side A/B (naive vs production approach) with a diff highlight |
| `<CostMeter />` | Live token/cost/latency readout attached to any demo |
| `<Fixture />` | Renders a committed LLM trace; optional BYOK mode to re-run live |

### Concept-specific widgets

**Maths & ML (Layers 0–1):** `<VectorPlayground>` (2D/3D vector ops, dot product, cosine similarity) · `<MatrixMultiplier>` (animated, cell-by-cell) · `<GradientDescentLab>` (loss surface, LR slider, watch it diverge) · `<BiasVarianceDemo>` · `<ConfusionMatrixLab>` (threshold slider → precision/recall/F1/ROC live) · `<DecisionBoundaryExplorer>` · `<ClusteringPlayground>` · `<OverfittingDemo>` · `<SHAPExplorer>`

**Deep learning (Layer 2):** `<NeuronBuilder>` (drag weights, watch output) · `<BackpropTracer>` (step through the chain rule on a tiny graph) · `<ActivationComparer>` · `<TrainingLoopVisualizer>` (live loss curve, adjustable hyperparameters) · `<ConvolutionLab>` (drag a kernel over an image) · `<RegularizationDemo>`

**Transformers (Layer 3):** `<TokenizerLab>` (real BPE via transformers.js — paste text, see tokens, costs, and why "strawberry" breaks) · `<BPEStepper>` (watch merges happen) · `<AttentionVisualizer>` (real attention weights, head + layer selector, heatmap + arc view) · `<PositionalEncodingViz>` (sinusoidal vs RoPE) · `<EmbeddingExplorer>` (real embeddings, UMAP projection, nearest neighbours, analogy arithmetic) · `<DecodingSampler>` ⭐ (fixed logit distribution; temperature / top-k / top-p / min-p sliders reshape it live — the clearest way to teach sampling) · `<KVCacheViz>` (memory growth over a generation) · `<MoERouter>`

**LLM apps (Layer 4):** `<PromptLab>` (variants against committed fixture outputs) · `<StructuredOutputBuilder>` (design a Pydantic schema, see the JSON Schema and a validated/failing response) · `<ContextBudgetVisualizer>` ⭐ (stacked bar of system prompt / tools / retrieved docs / history / input; drag to reallocate, watch what gets evicted) · `<CompactionDemo>` · `<ChunkingLab>` ⭐ (paste a document, compare fixed / recursive / semantic / structure-aware chunking side by side) · `<RetrievalLab>` ⭐⭐ (fixed corpus; run dense vs BM25 vs hybrid+RRF, then add a cross-encoder reranker and watch the ranking change — this single widget teaches the most important lesson in RAG) · `<RerankerDemo>` · `<QueryTransformLab>` · `<AgentLoopVisualizer>` (step through a recorded trace: thought → tool call → observation → repeat) · `<ToolSchemaDesigner>` · `<MCPExplorer>` (inspect a real MCP server's tool manifest) · `<MultiAgentTopology>`

**Evals & production (Layers 5–9):** `<EvalRubricBuilder>` ⭐ (write a rubric, score sample outputs, compare against human labels, see judge agreement) · `<MetricsDashboard>` (faithfulness, relevance, tool accuracy on a fixture run) · `<TraceExplorer>` (waterfall view of spans with cost + latency attribution) · `<LoRACalculator>` (rank/alpha → trainable params, VRAM, training time estimate) · `<QuantizationExplorer>` (FP16 → FP8 → INT8 → INT4: VRAM, throughput, quality trade-off) · `<BatchingVisualizer>` (static vs continuous batching, GPU utilisation) · `<SpeculativeDecodingViz>` · `<CostModeler>` ⭐ (build an agent workflow, model cost-per-task at scale — the number that gets projects cancelled) · `<PromptInjectionSandbox>` (recorded attack/defence pairs, layered defences toggleable) · `<PIIRedactionDemo>` · `<GuardrailPipeline>`

⭐ = high priority, teaches something genuinely hard to convey in prose.

---

## 10. Content manifest

**This is the authoritative topic list. Nothing here may be dropped.** `pnpm check:manifest` cross-references this section against published chapters and fails if anything is missing.

Depth tags: **[B]** build from scratch · **[U]** use correctly and explain trade-offs · **[K]** know it exists and what problem it solves.

### Layer 0 — Foundations (9 chapters)

- `00-00` **How to use this course** — the map, depth tiers, how to practise, how to not tutorial-hop
- `00-01` **Python for AI engineering [B]** — types/hints, dataclasses, decorators, context managers, generators, comprehensions, error handling, logging, project layout
- `00-02` **Async Python [B]** — `async`/`await`, `asyncio`, event loop, concurrent API calls, semaphores, timeouts, cancellation. *Agents are I/O-bound: this matters more than people expect*
- `00-03` **Modern Python tooling [B]** — uv, ruff, mypy, pytest, pre-commit, virtual environments, dependency pinning
- `00-04` **APIs & services [B]** — REST, FastAPI, Pydantic v2, request/response models, streaming (SSE, WebSockets), auth (OAuth2, JWT), rate limiting, retries with exponential backoff, idempotency
- `00-05` **Data & storage [B/U]** — SQL, Postgres, transactions, indexing, pgvector, Redis caching, TTLs, cache invalidation, message queues, background jobs
- `00-06` **Containers, Git & CI [U/K]** — Git workflow, Docker, multi-stage builds, GitHub Actions, IaC basics, Kubernetes concepts
- `00-07` **Maths I: linear algebra & calculus [B]** — vectors, matrices, matmul, dot products, norms, cosine similarity, SVD, eigendecomposition, rank, projections; derivatives, partial derivatives, gradients, chain rule, Jacobians
- `00-08` **Maths II: probability, statistics & optimisation [B/U]** — distributions, conditional probability, Bayes, expectation, variance, MLE; sampling, confidence intervals, hypothesis testing, A/B testing, multiple comparisons; gradient descent, SGD, momentum, Adam/AdamW, LR schedules, convexity; entropy, cross-entropy, KL divergence, perplexity; numerical stability, log-sum-exp, floating point
- `00-09` **Data foundations [B/U]** — NumPy, pandas, Polars, cleaning, missing values, outliers, **leakage detection**, train/test hygiene, feature engineering, EDA, data versioning (DVC/Delta), data contracts, schema evolution, PII handling

### Layer 1 — Classical Machine Learning (8 chapters)

- `01-01` **What learning from data means [B]** — supervised/unsupervised/reinforcement, the fitting loop, generalisation
- `01-02` **Linear & logistic regression [B]** — least squares, gradient descent by hand, decision boundaries, odds and logits
- `01-03` **Trees & ensembles [B]** — decision trees, entropy/Gini, random forests, bagging, boosting, XGBoost/LightGBM/CatBoost, stacking
- `01-04` **Other core algorithms [B/U]** — k-NN, SVM and kernels, Naive Bayes
- `01-05` **Unsupervised learning [B]** — k-means, hierarchical, DBSCAN, PCA, t-SNE, UMAP
- `01-06` **Evaluation done properly [B]** — train/val/test, cross-validation, accuracy/precision/recall/F1, ROC-AUC vs **PR-AUC** and when each lies, confusion matrices, calibration curves, MAE/RMSE/MAPE
- `01-07` **The bias–variance trade-off & regularisation [B]** — overfitting/underfitting, L1/L2, elastic net, class imbalance (SMOTE, class weights, threshold tuning), hyperparameter tuning (grid/random/Bayesian, Optuna)
- `01-08` **Pipelines, interpretability & adjacent problems [U/K]** — sklearn pipelines, ColumnTransformer, custom transformers; feature importance, SHAP, LIME, PDP; time series (ARIMA, Prophet, temporal splits, backtesting); recommenders (collaborative filtering, matrix factorisation, two-tower); causal inference basics, confounders, uplift modelling

### Layer 2 — Deep Learning (8 chapters)

- `02-01` **From neurons to networks [B]** — perceptron, forward pass, activations (ReLU, GELU, SwiGLU), initialisation, universal approximation intuition
- `02-02` **Backpropagation from scratch [B]** — loss functions, the chain rule as computation graph, manual derivation, autograd from first principles
- `02-03` **PyTorch [B]** — tensors, autograd, `nn.Module`, Dataset/DataLoader, training loops, checkpointing, devices, mixed precision
- `02-04` **Training mechanics [B]** — batch size, epochs, LR warmup/decay, gradient clipping, gradient accumulation, early stopping, debugging a training run that won't converge
- `02-05` **Regularisation & normalisation [B]** — dropout, batch norm, layer norm, RMSNorm, weight decay, augmentation
- `02-06` **CNNs & computer vision basics [U]** — convolutions, pooling, receptive fields, ResNet/skip connections, transfer learning
- `02-07` **Sequences before transformers [U]** — RNNs, LSTMs, GRUs, the bottleneck problem, why attention won
- `02-08` **The wider zoo [K/U]** — embeddings (word2vec, GloVe, sentence embeddings); autoencoders, VAEs, GANs; diffusion models (forward/reverse, U-Net, latent diffusion); graph neural networks; RL foundations (MDPs, Q-learning, policy gradients, PPO — the prerequisite for RLHF); distributed training (DDP, FSDP, ZeRO)

### Layer 3 — Transformers & LLM Internals (9 chapters)

- `03-01` **Tokenisation [B]** — characters vs words vs subwords, BPE, WordPiece, SentencePiece, tiktoken, vocabulary, special tokens, why token ≠ word, why tokenisation causes arithmetic/spelling/multilingual failures
- `03-02` **Attention [B]** — the intuition, query/key/value, scaled dot-product, why √d exists, self vs cross attention, causal masking
- `03-03` **Multi-head attention & position [B]** — heads, what different heads learn, positional encodings: sinusoidal → learned → **RoPE** → ALiBi
- `03-04` **The transformer block [B]** — residuals, normalisation, pre-norm vs post-norm, FFN, stacking, parameter counting
- `03-05` **Build nanoGPT [B]** ⭐ — implement a working GPT end to end, train it on a small corpus in the browser/Colab. *The single highest-leverage chapter in the course*
- `03-06` **Decoding & sampling [B]** — greedy, beam search, temperature, top-k, top-p, min-p, repetition penalty, constrained/structured decoding, logit bias
- `03-07` **Architecture families & efficiency [U]** — encoder-only (BERT), decoder-only (GPT/Llama/Qwen), encoder-decoder (T5); KV cache, prefix caching, GQA/MQA, FlashAttention, sliding window attention, Mixture of Experts (routing, active vs total params)
- `03-08` **How models are trained [U]** — pretraining, data curation, SFT, preference optimisation (RLHF/DPO), RL on verifiable rewards, what "reasoning models" actually do (extended thinking, test-time compute), scaling laws (Chinchilla), emergent abilities debate
- `03-09` **Context, limits & alternatives [U/K]** — what limits context windows, lost-in-the-middle, context rot; state space models/Mamba, linear attention, hybrid architectures; multimodal architectures (vision encoders, CLIP, cross-attention fusion, native multimodal)

### Layer 4 — LLM Application Engineering (16 chapters) — *the core of the job*

**4A · Working with models**
- `04-01` **Calling LLMs properly [B]** — messages format, system prompts, streaming, token counting, cost calculation, rate limits, retries, timeouts, error taxonomy
- `04-02` **Structured outputs [B]** ⭐ — JSON mode, JSON Schema, function/tool calling, Pydantic validation, retry-on-failure loops. *A huge share of shipped AI features are one call plus a schema — teach this before agents*
- `04-03` **Prompt engineering [B]** — zero-shot, few-shot, chain-of-thought, ReAct, self-consistency, system prompt design, delimiters, output formatting, prompt templates, versioning, what stopped working as models improved
- `04-04` **Choosing and routing models [U]** — frontier vs mid vs small, the latency/cost/quality triangle, cascading and escalation, open-weight vs API, prompt caching, batch APIs, streaming UX
- `04-05` **Open-weight models & local inference [U]** — Llama/Qwen/Mistral/Gemma/DeepSeek families, Hugging Face Hub, `transformers`, Ollama, LM Studio, when local beats API
- `04-06` **Multimodal inputs [K/U]** — images, PDFs, audio; document understanding pipelines

**4B · Context engineering**
- `04-07` **Context engineering fundamentals [B]** ⭐ — why most agent failures are context failures not model failures; the context window as a per-turn budget; **select, compress, order, isolate**
- `04-08` **Memory [B]** — short-term buffers, long-term stores, episodic vs semantic memory, write/read policies, compaction triggers, summarisation without losing decisions; mem0/Letta and why teams still roll their own
- `04-09` **Context economics & anti-patterns [U]** — token budget allocation, prompt-cache-aware design (stable prefix, volatile suffix), context distraction, tool-definition bloat, lost-in-the-middle, long context vs RAG economics

**4C · RAG**
- `04-10` **Why RAG exists & why naive RAG fails [B]** — the knowledge problem, the honest limits of embeddings, what "naive RAG" is and why it's a prototype
- `04-11` **Ingestion & chunking [B]** — document parsing (PDFs are genuinely hard), tables, HTML, DOCX, OCR, layout-aware parsing; fixed-size → recursive → **semantic** → structure-aware → agentic chunking; parent-document and small-to-big retrieval; contextual retrieval; metadata design and filtering; incremental indexing, freshness, deletion, re-embedding
- `04-12` **Embeddings & vector search [B]** — bi-encoders, dimensionality, similarity metrics, model selection, MTEB, domain-specific embeddings; HNSW, IVF, ANN vs exact, filtered search; pgvector, Qdrant, Weaviate, Pinecone, Milvus, Chroma, Azure AI Search
- `04-13` **Hybrid search & reranking [B]** ⭐⭐ — BM25/sparse retrieval, dense + sparse fusion with **Reciprocal Rank Fusion**, cross-encoder rerankers, the retrieve-20-rerank-5-send-3 pattern. *The single biggest quality lever in production RAG*
- `04-14` **Query understanding & retrieval evaluation [B]** — query rewriting, expansion, HyDE, multi-query, decomposition, conversational rewriting; **Recall@K, MRR, nDCG@K**, measuring retrieval separately from generation
- `04-15` **Advanced RAG patterns [U/K]** — agentic RAG, adaptive/routed RAG, Self-RAG, corrective RAG, GraphRAG and knowledge graphs, multimodal RAG, ColBERT/late interaction, SPLADE; the decision tree for which pattern fits which query

**4D · Agents**
- `04-16` **Agents: the loop, tools, and MCP [B]** ⭐ — perceive/plan/act/observe, termination conditions; tool schema design, descriptions, validation, recoverable error messages, idempotency, tool-count discipline; ReAct, plan-and-execute, reflection; **MCP** (JSON-RPC over stdio/HTTP/SSE, tool registration, capability negotiation, build your own server); human-in-the-loop approval, checkpointing, resumption; the four orchestration patterns (graph, role, handoff, hierarchical); frameworks (LangGraph, Claude Agent SDK, OpenAI Agents SDK, Pydantic AI, Microsoft Agent Framework, Mastra, LlamaIndex Workflows); multi-agent supervisor/worker patterns and when they're worse; durable execution, replay, failure recovery; A2A protocol; computer-use/browser/coding agents; anti-patterns — **and when not to build an agent at all**

> *Split `04-16` into 3–4 chapters when you write it. It is listed as one manifest entry for coherence; it must not ship as one chapter.*

### Layer 5 — Evaluation & Observability (6 chapters) — *the biggest gap in the market*

- `05-01` **Why evals decide whether you ship [B]** — quality as the #1 barrier to production; observability adoption far ahead of eval adoption; the eval-first mindset
- `05-02` **Building an eval set [B]** — golden datasets, test case design, coverage, offline vs online, regression suites as CI gates
- `05-03` **LLM-as-judge [B]** ⭐ — rubric design, pairwise comparison, position bias, self-preference bias, calibrating a judge against human labels, when judges fail
- `05-04` **RAG & agent metrics [B]** — faithfulness/groundedness, answer relevance, context precision/recall (RAGAS, DeepEval); **tool selection accuracy, planning quality, step-level faithfulness, reasoning coherence, task completion**
- `05-05` **Tracing & observability [B]** — spans, instrumenting every LLM/tool/retrieval call, cost and latency attribution, OpenTelemetry GenAI conventions; LangSmith, Langfuse, Arize Phoenix, Braintrust, W&B Weave
- `05-06` **Online quality [U/K]** — drift, feedback loops, error taxonomy, incident triage, A/B tests, shadow deployment, multi-turn simulation; public benchmarks (MMLU, GPQA, SWE-bench, HumanEval, MT-Bench, LMArena), contamination, and why benchmark ≠ your use case

### Layer 6 — Model Adaptation (7 chapters)

- `06-01` **Should you fine-tune? [B]** — Prompt → RAG → Fine-tune → Distill; fine-tuning is for **form, not facts**; the legitimate reasons and the bad ones; be able to argue both sides
- `06-02` **Datasets for fine-tuning [B]** — instruction formatting, quality over quantity, dedup, contamination checks, splits, synthetic data generation
- `06-03` **LoRA & QLoRA [B]** ⭐ — low-rank adaptation intuition and maths, rank/alpha, target layers, 4-bit NF4, paged optimizers, VRAM budgeting, adapter hot-swapping
- `06-04` **SFT in practice [B]** — trl, peft, Unsloth, Axolotl; hyperparameters that matter; the failure modes that quietly ruin a first run
- `06-05` **Preference optimisation [U]** — RLHF (reward model → PPO), **DPO** as the practical default, ORPO, IPO
- `06-06` **Reinforcement fine-tuning [U]** — GRPO/RFT, verifiable rewards, why this is the one place fine-tuning beats prompting decisively (reasoning, maths, code)
- `06-07` **Distillation & evaluation [U]** ⭐ — frontier model → synthetic dataset → small fine-tuned model → fraction of the cost; evaluating a fine-tune (baseline, task metrics, general-ability regression, catastrophic forgetting); full fine-tuning and why it's rarely right; continued pretraining; model merging (SLERP, TIES); fine-tuning embedding models

### Layer 7 — Inference, Serving & Cost (6 chapters)

- `07-01` **The economics of inference [B]** ⭐ — inference has overtaken training as the compute driver; **cost per completed task, not per call**; why agentic loops turn cheap tokens into expensive workflows
- `07-02` **Latency [B]** — TTFT, inter-token latency, tokens/sec, P50/P95/P99, streaming to hide latency, perceived vs actual performance
- `07-03` **Application-layer optimisation [B]** — prompt caching, context compression, model routing and cascading, semantic response caching, batching
- `07-04` **Serving engines [U]** — vLLM (continuous batching, PagedAttention, prefix caching, chunked prefill, tensor parallelism); SGLang, TensorRT-LLM, LMDeploy
- `07-05` **Quantization [U]** — AWQ, GPTQ, FP8, INT8, GGUF; VRAM vs quality; calibration; KV cache management and compression; speculative decoding and draft models
- `07-06` **Deployment targets [U/K]** — local/edge (Ollama, llama.cpp, MLX); GPU selection; autoscaling, cold starts; Modal, Replicate, Runpod, Baseten; Azure ML endpoints, Databricks Model Serving, Bedrock, Vertex

### Layer 8 — LLMOps & Production (6 chapters)

- `08-01` **Shipping an AI service [B]** — containerised FastAPI, health checks, graceful degradation, fallback model chains, timeouts and circuit breakers
- `08-02` **Prompts and config as code [B]** — versioning, review, rollback, environment separation, feature flags for model changes
- `08-03` **Logging & structured traces [B]** — capturing input, retrieved context, tool calls, output, cost, latency; privacy-aware logging
- `08-04` **CI/CD with eval gates [B]** ⭐ — no prompt or model change ships without passing the eval suite; canary and blue/green for AI systems
- `08-05` **The ML platform layer [U]** — MLflow, W&B, experiment tracking, model registry, feature stores, drift monitoring; orchestration (Airflow, Dagster, Prefect, ADF)
- `08-06` **Reference architecture [U/K]** — one orchestration framework + one observability stack + one eval harness + MCP-based tooling; Kubernetes for ML, KServe, Ray Serve, Kubeflow; cost governance

### Layer 9 — Safety, Security & Governance (6 chapters)

- `09-01` **Prompt injection [B]** ⭐ — direct and indirect, why it is unsolved, defence in depth: input filtering, output validation, privilege separation, tool allow-lists, sandboxing
- `09-02` **Guardrails [B]** — input/output validation, PII detection and redaction, content filtering, refusal handling; Guardrails AI, NeMo Guardrails, Llama Guard
- `09-03` **Hallucination & grounding [B]** — grounding, citation enforcement, abstention as a valid output, confidence signals, uncertainty communication
- `09-04` **Agent-specific risk [U]** — excessive agency, unbounded tool access, cost-bombing loops, data exfiltration through tools, sandboxing execution; **OWASP Top 10 for LLM Applications**
- `09-05` **Privacy & data protection [U]** — GDPR/UK GDPR, data residency, zero-retention settings, on-prem vs cloud, DPIAs, red teaming and jailbreak taxonomies
- `09-06` **Governance [K]** — EU AI Act (risk tiers, GPAI obligations, timelines), the UK's sector-led approach, AI Security Institute, ISO/IEC 42001, NIST AI RMF, model cards, datasheets, bias and fairness metrics

### Layer 10 — Specialisations (8 chapters, `[K]` depth with one deep dive each)

- `10-01` Multimodal & document AI — VLMs, OCR pipelines, chart/table understanding, video
- `10-02` Voice AI — ASR/Whisper, TTS, realtime APIs, turn-taking, sub-500ms latency budgets
- `10-03` Computer vision — detection (YOLO, DETR), segmentation (SAM), video analytics
- `10-04` Coding agents — repo-scale retrieval, AST-aware chunking, sandboxed execution, SWE-bench-style evals
- `10-05` Search & ranking — learning to rank, query understanding, personalisation
- `10-06` Time series & forecasting — foundation models for time series, anomaly detection
- `10-07` Generative media — diffusion, ControlNet, LoRAs, video generation
- `10-08` AI infrastructure — GPU kernels, Triton, CUDA, distributed training

### Capstone track (6 project walkthroughs)

Full build-alongs, each ending in a deployable artifact and a written engineering post:
1. Structured extraction service (deliberately not an agent)
2. Production RAG with hybrid search + reranking + incremental ingestion
3. Standalone eval harness with CI gating
4. Agent with custom MCP tools, HITL, tracing and a cost ceiling
5. Fine-tune + distillation case study with a published comparison table
6. End-to-end AI product with auth, streaming UI, observability and a cost budget

### Appendices

- Glossary (every term, hover-cards site-wide)
- Maths reference sheet
- Notation guide
- Curated reading list
- UK job market & interview guide — role definitions, portfolio expectations, system design for AI systems, how to talk about trade-offs

---

## 11. Build order & session protocol

### Phase 0 — Foundation (sessions 1–6, do not skip)

1. Write `DESIGN.md` (§8). Get the design system right before writing 88 chapters against it.
2. Scaffold Astro + React + Tailwind v4 + MDX + TypeScript. Verify a static build deploys to GitHub Pages, base path and all.
3. Build the content schema (§6), the chapter template, and `pnpm new:chapter`.
4. Build the shell: layout, nav, sidebar, TOC, progress tracking, search (Pagefind), theme toggle, glossary hover-cards.
5. Build `<PyRunner />` end to end. This is the hardest piece of infrastructure — Pyodide in a worker, package preloading, matplotlib capture, error handling. Get it right early because ~60 chapters depend on it.
6. Build the diagram primitive library (§7).
7. **Write chapter `00-00` completely, to the full definition of done, and deploy it live.** This is the reference implementation. Every later chapter is judged against it.

### Phase 1+ — Content

Then, layer by layer, in manifest order. **One chapter per session.** Never batch-generate chapters — quality collapses and you produce exactly the shallow content this project exists to beat.

### Per-session protocol

1. Read `PROGRESS.md`. Identify the single next chapter. Set the model for it per §5.1.
2. Re-read the manifest entry for that chapter. List every subtopic. **Every one must be genuinely taught, not name-dropped.**
3. Plan the chapter: hook, analogy, diagrams needed, interactive needed, worked example, exercises. Write the plan down before writing prose.
4. Build any new diagram or widget components first, with tests.
5. Write the chapter following the §6 structure.
6. **Verify every code example actually runs.** Execute them. Do not assume.
7. Run the definition-of-done checklist (§6). Honestly.
8. `pnpm check && pnpm lint && pnpm test && pnpm build && pnpm check:manifest`
9. Update `PROGRESS.md`.
10. Commit (conventional commits: `feat(04-13): hybrid search and reranking chapter`), push, verify the deploy went green and the page renders in production.

### Layer completion

When a layer is done: tag it (`v0.4.0` for Layer 4), write a GitHub Release with what's covered, update the README and the landing page, and post the milestone. Each layer is a shippable unit.

---

## 12. Deployment

- **Host:** GitHub Pages, `gh-pages` via GitHub Actions (`actions/deploy-pages`).
- **Config:** `output: 'static'`, `site` and `base` set correctly for a project page, `.nojekyll` in the output.
- **Trigger:** push to `main`. PRs get a build check but do not deploy.
- **Custom domain:** optional, via `CNAME`. Document it in the README.
- **Assets:** models and Pyodide load from CDN with integrity checks and a graceful fallback message if blocked; large fixtures are committed under `public/fixtures/` and lazy-loaded per chapter.
- **Performance budget:** prose-only pages ship <50KB JS. Interactive islands load on interaction or when scrolled into view — never on page load. Pyodide (~10MB) loads only when a `<PyRunner />` is actually used, with a clear loading state.
- **Analytics:** privacy-respecting only (Plausible/Umami self-hosted, or none). No third-party trackers.

---

## 13. Quality gates (CI)

`quality.yml` runs on every PR and must pass:

- `astro check` + `tsc --noEmit`
- ESLint + Prettier
- Vitest unit tests
- Playwright e2e + visual regression on interactive widgets
- **axe-core accessibility scan — zero violations**
- Lighthouse CI: performance ≥95, accessibility 100, best practices ≥95
- Internal + external link check
- `check:manifest` — every manifest topic maps to a published chapter; every published chapter satisfies the schema
- **Grep gate:** fails if `TODO`, `FIXME`, `Lorem ipsum`, `coming soon`, or `XXX` appear in `src/content/`

---

## 14. Writing voice

- **Second person, present tense.** "You call the API and get back…" not "One would call…"
- **Concrete before abstract.** A real example, then the general rule. Never the reverse.
- **Short sentences.** Long, comma-spliced explanatory sentences are where beginners get lost.
- **Define every term on first use.** If it's in the glossary, wrap it in `<Term>` for a hover-card.
- **Analogies must be technically honest.** A wrong analogy that feels clarifying causes more damage than no analogy. Where an analogy breaks down, say so explicitly.
- **Show the failure.** Broken code and wrong output teach more than working code. Every chapter should show something failing before it shows it working.
- **Be honest about difficulty.** "This is genuinely hard and takes most people a few attempts" builds trust. Never say "simply", "just", "obviously", or "as you can see".
- **No hype.** No "revolutionary", no "game-changing", no exclamation marks in technical prose.
- **Trade-offs, always.** Every technique gets its cost stated. A tutorial that only shows upsides produces engineers who ship bad systems.

---

## 15. Never do this

- Batch-generate multiple chapters in one session
- Ship a chapter without running its code
- Use placeholder or filler content anywhere in `main`
- Add a topic to the nav before the chapter is finished
- Invent a benchmark number, a paper, a citation, or a quote
- Download, scrape, or embed third-party images, figures, or screenshots
- Commit an API key, or add a feature that requires one to work
- Add a dependency without justifying it in the PR description
- Use `localStorage` for anything except user preferences (theme, progress, BYOK) — never for content state
- Skip the accessibility or mobile check because "it's just a text page"
- Skip the "production reality" section because the chapter is already long
- Rewrite the design system mid-project without updating `DESIGN.md` first
- Mark a chapter `published` when you know a subtopic is thin. Mark it `draft` and come back

---

## 16. First session

Do exactly this, in order, and nothing else:

0. Set your model per §5.1 — design work runs on `fable` at `xhigh`. Do this before anything else.
1. Confirm you have read this file, and summarise the mission and the non-negotiables back in three sentences.
2. Check current versions of every dependency in §3.
3. Write `DESIGN.md` — two passes, brainstorm then critique, per §8. **Show it to me before writing any component code.**
4. Wait for approval on the design direction.

Then scaffold. Do not start writing chapters until Phase 0 (§11) is complete and chapter `00-00` is live.

---

## 17. Progress tracking

Maintain `PROGRESS.md` with a row per chapter: `id | title | layer | status | diagrams | interactives | published date`. It is the source of truth for what's done. Update it in the same commit as the work — never separately, never retroactively.

Include a header block with: chapters published / total, layers complete, total diagrams, total interactive widgets, and the current live URL.
