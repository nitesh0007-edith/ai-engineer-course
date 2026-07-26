# Roadmap: AI Engineer: Zero to Hero (Interactive Tutorial)

## Overview

A static, client-side-only interactive course taking a beginner to production AI engineer across 90 chapters in 11 content layers, a 6-project capstone track, and appendices. Foundation infrastructure (design system, Astro/React/Tailwind scaffold, PyRunner, diagram primitives, chapter template) is already live. From here, one GSD phase = one content Layer from CLAUDE.md §10; one GSD plan = one chapter. Phases execute strictly in manifest order (§11) because later layers assume earlier ones as prerequisites.

## Phases

**Phase Numbering:**
- Integer phases (0, 1, 2...): Planned milestone work, one per content Layer (plus capstone/appendices)
- Decimal phases (e.g. 5.1): Reserved for urgent insertions only — not expected in a fixed-manifest project

- [x] **Phase 0: Foundation infrastructure** - Design system, scaffold, chapter template, shell, PyRunner, diagram primitives, reference chapter 00-00
- [ ] **Phase 1: Layer 0 — Foundations** - Python, async, tooling, APIs, data/storage, containers/Git/CI, maths I & II, data foundations
- [ ] **Phase 2: Layer 1 — Classical Machine Learning** - Regression, trees/ensembles, other core algorithms, unsupervised learning, evaluation, bias-variance, pipelines
- [ ] **Phase 3: Layer 2 — Deep Learning** - Neurons to networks, backprop, PyTorch, training mechanics, regularisation, CNNs, sequences, the wider zoo
- [ ] **Phase 4: Layer 3 — Transformers & LLM Internals** - Tokenisation, attention, transformer block, nanoGPT, decoding, architecture families, training, context limits
- [ ] **Phase 5: Layer 4 — LLM Application Engineering** - Calling LLMs, structured outputs, prompting, context engineering, RAG, agents/MCP
- [ ] **Phase 6: Layer 5 — Evaluation & Observability** - Eval sets, LLM-as-judge, RAG/agent metrics, tracing, online quality
- [ ] **Phase 7: Layer 6 — Model Adaptation** - Fine-tuning decision, datasets, LoRA/QLoRA, SFT, preference optimisation, RFT, distillation
- [ ] **Phase 8: Layer 7 — Inference, Serving & Cost** - Economics, latency, app-layer optimisation, serving engines, quantization, deployment targets
- [ ] **Phase 9: Layer 8 — LLMOps & Production** - Shipping a service, config as code, logging, CI/CD eval gates, ML platform, reference architecture
- [ ] **Phase 10: Layer 9 — Safety, Security & Governance** - Prompt injection, guardrails, hallucination, agent risk, privacy, governance
- [ ] **Phase 11: Layer 10 — Specialisations** - Multimodal, voice, vision, coding agents, search, time series, generative media, AI infra
- [ ] **Phase 12: Capstone track** - 6 full build-alongs ending in deployable artifacts
- [ ] **Phase 13: Appendices** - Glossary, maths reference, notation guide, reading list, job market guide

## Phase Details

### Phase 0: Foundation infrastructure
**Goal**: A live, deployable static site with the design system, content pipeline, and core interactive/diagram infrastructure that every later chapter depends on.
**Depends on**: Nothing (first phase)
**Requirements**: Infra only — precedes REQUIREMENTS.md chapter list
**Success Criteria** (what must be TRUE):
  1. Site builds statically and deploys to GitHub Pages on push to main
  2. `<PyRunner />` runs arbitrary Python in a Web Worker with matplotlib capture, reset, and package-loading states
  3. Chapter schema + `pnpm new:chapter` mechanically enforce the chapter contract (CLAUDE.md §6)
  4. Reference chapter 00-00 is published and meets full definition-of-done
**Plans**: 7 plans (all complete)

Plans:
- [x] 00-01: DESIGN.md — design system
- [x] 00-02: Scaffold Astro + React + Tailwind v4 + MDX + TS; deploy to Pages
- [x] 00-03: Content schema + chapter template + `pnpm new:chapter`
- [x] 00-04: Shell — layout, nav, TOC, search, theme toggle, glossary
- [x] 00-05: `<PyRunner />` end to end
- [x] 00-06: Diagram primitives
- [x] 00-07: Chapter 00-00 written to definition-of-done and deployed

### Phase 1: Layer 0 — Foundations
**Goal**: Every reader has the Python, tooling, API, data, maths, and stats foundation the rest of the course assumes.
**Depends on**: Phase 0
**Requirements**: 00-00, 00-01, 00-02, 00-03, 00-04, 00-05, 00-06, 00-07, 00-08, 00-09
**Success Criteria** (what must be TRUE):
  1. All 10 Layer 0 chapters are published and pass `pnpm check:manifest`
  2. Every chapter has ≥2 diagrams, ≥1 interactive, ≥2 runnable code examples, all verified to execute
  3. `PROGRESS.md` shows Layer 0 at 10/10 and a `v0.0.x`-style layer milestone is tagged per CLAUDE.md §11 "Layer completion"
**Plans**: 10 plans (3 complete)

Plans:
- [x] 01-01: 00-00 How to use this course
- [x] 01-02: 00-01 Python for AI engineering
- [x] 01-03: 00-02 Async Python
- [ ] 01-04: 00-03 Modern Python tooling
- [ ] 01-05: 00-04 APIs & services
- [ ] 01-06: 00-05 Data & storage
- [ ] 01-07: 00-06 Containers, Git & CI
- [ ] 01-08: 00-07 Maths I: linear algebra & calculus
- [ ] 01-09: 00-08 Maths II: probability, statistics & optimisation
- [ ] 01-10: 00-09 Data foundations

### Phase 2: Layer 1 — Classical Machine Learning
**Goal**: Readers can fit, evaluate, and reason about classical ML models before deep learning is introduced.
**Depends on**: Phase 1
**Requirements**: 01-01, 01-02, 01-03, 01-04, 01-05, 01-06, 01-07, 01-08
**Success Criteria** (what must be TRUE):
  1. All 8 Layer 1 chapters published, `check:manifest` green
  2. Evaluation chapter (01-06) correctly teaches when ROC-AUC lies vs PR-AUC, verified against real imbalanced-data examples
  3. `ConfusionMatrixLab`-style interactive exists and is reused, not rebuilt, across chapters that need it
**Plans**: 8 plans

Plans:
- [ ] 02-01: 01-01 What learning from data means
- [ ] 02-02: 01-02 Linear & logistic regression
- [ ] 02-03: 01-03 Trees & ensembles
- [ ] 02-04: 01-04 Other core algorithms
- [ ] 02-05: 01-05 Unsupervised learning
- [ ] 02-06: 01-06 Evaluation done properly
- [ ] 02-07: 01-07 The bias–variance trade-off & regularisation
- [ ] 02-08: 01-08 Pipelines, interpretability & adjacent problems

### Phase 3: Layer 2 — Deep Learning
**Goal**: Readers can build and train a neural network from scratch and in PyTorch, and understand why attention eventually replaced RNNs.
**Depends on**: Phase 2
**Requirements**: 02-01, 02-02, 02-03, 02-04, 02-05, 02-06, 02-07, 02-08
**Success Criteria** (what must be TRUE):
  1. All 8 Layer 2 chapters published, `check:manifest` green
  2. Backprop chapter (02-02) includes a hand-derived worked example, not just autograd-does-it-for-you
  3. `<BackpropTracer>` and `<TrainingLoopVisualizer>` widgets exist and pass Playwright smoke tests
**Plans**: 8 plans

Plans:
- [ ] 03-01: 02-01 From neurons to networks
- [ ] 03-02: 02-02 Backpropagation from scratch
- [ ] 03-03: 02-03 PyTorch
- [ ] 03-04: 02-04 Training mechanics
- [ ] 03-05: 02-05 Regularisation & normalisation
- [ ] 03-06: 02-06 CNNs & computer vision basics
- [ ] 03-07: 02-07 Sequences before transformers
- [ ] 03-08: 02-08 The wider zoo

### Phase 4: Layer 3 — Transformers & LLM Internals
**Goal**: Readers understand and can build a transformer from first principles, culminating in a working nanoGPT.
**Depends on**: Phase 3
**Requirements**: 03-01, 03-02, 03-03, 03-04, 03-05, 03-06, 03-07, 03-08, 03-09
**Success Criteria** (what must be TRUE):
  1. All 9 Layer 3 chapters published, `check:manifest` green
  2. 03-05 (Build nanoGPT) actually trains a working GPT on a small corpus in-browser/Colab, verified end to end — this is the highest-leverage chapter in the course, do not ship it thin
  3. `<AttentionVisualizer>` and `<TokenizerLab>` use real transformers.js tokenizers/attention weights, not mocked data
**Plans**: 9 plans

Plans:
- [ ] 04-01: 03-01 Tokenisation
- [ ] 04-02: 03-02 Attention
- [ ] 04-03: 03-03 Multi-head attention & position
- [ ] 04-04: 03-04 The transformer block
- [ ] 04-05: 03-05 Build nanoGPT
- [ ] 04-06: 03-06 Decoding & sampling
- [ ] 04-07: 03-07 Architecture families & efficiency
- [ ] 04-08: 03-08 How models are trained
- [ ] 04-09: 03-09 Context, limits & alternatives

### Phase 5: Layer 4 — LLM Application Engineering
**Goal**: Readers can ship real LLM features — structured outputs, context engineering, production RAG, and agents — which is the core of the AI engineering job.
**Depends on**: Phase 4
**Requirements**: 04-01, 04-02, 04-03, 04-04, 04-05, 04-06, 04-07, 04-08, 04-09, 04-10, 04-11, 04-12, 04-13, 04-14, 04-15, 04-16
**Success Criteria** (what must be TRUE):
  1. All 4A/4B/4C chapters published; 04-16 (Agents) is split into 3–4 separately-published chapters per the manifest note, not shipped as one
  2. `<RetrievalLab>` demonstrates dense vs BM25 vs hybrid+RRF vs reranked results on a fixed corpus with visibly different rankings
  3. `<ContextBudgetVisualizer>` and `<ChunkingLab>` exist and are reused across the 4B/4C chapters that reference them
**Plans**: 16 plans (04-16 will expand to 18-19 when split — re-run `/gsd-plan-phase 5` at that point)

Plans:
- [ ] 05-01: 04-01 Calling LLMs properly
- [ ] 05-02: 04-02 Structured outputs
- [ ] 05-03: 04-03 Prompt engineering
- [ ] 05-04: 04-04 Choosing and routing models
- [ ] 05-05: 04-05 Open-weight models & local inference
- [ ] 05-06: 04-06 Multimodal inputs
- [ ] 05-07: 04-07 Context engineering fundamentals
- [ ] 05-08: 04-08 Memory
- [ ] 05-09: 04-09 Context economics & anti-patterns
- [ ] 05-10: 04-10 Why RAG exists & why naive RAG fails
- [ ] 05-11: 04-11 Ingestion & chunking
- [ ] 05-12: 04-12 Embeddings & vector search
- [ ] 05-13: 04-13 Hybrid search & reranking
- [ ] 05-14: 04-14 Query understanding & retrieval evaluation
- [ ] 05-15: 04-15 Advanced RAG patterns
- [ ] 05-16: 04-16 Agents: the loop, tools, and MCP (split into sub-chapters at planning time)

### Phase 6: Layer 5 — Evaluation & Observability
**Goal**: Readers can build eval sets, judge LLM outputs, and instrument a system for tracing — the biggest gap in the market per CLAUDE.md.
**Depends on**: Phase 5
**Requirements**: 05-01, 05-02, 05-03, 05-04, 05-05, 05-06
**Success Criteria** (what must be TRUE):
  1. All 6 Layer 5 chapters published, `check:manifest` green
  2. `<EvalRubricBuilder>` lets a reader score sample outputs and compare against human labels with visible judge agreement
  3. `<TraceExplorer>` renders a realistic waterfall of spans with cost/latency attribution from committed fixture data
**Plans**: 6 plans

Plans:
- [ ] 06-01: 05-01 Why evals decide whether you ship
- [ ] 06-02: 05-02 Building an eval set
- [ ] 06-03: 05-03 LLM-as-judge
- [ ] 06-04: 05-04 RAG & agent metrics
- [ ] 06-05: 05-05 Tracing & observability
- [ ] 06-06: 05-06 Online quality

### Phase 7: Layer 6 — Model Adaptation
**Goal**: Readers can decide whether to fine-tune, and if so, do it with LoRA/QLoRA, SFT, and preference optimisation correctly.
**Depends on**: Phase 6
**Requirements**: 06-01, 06-02, 06-03, 06-04, 06-05, 06-06, 06-07
**Success Criteria** (what must be TRUE):
  1. All 7 Layer 6 chapters published, `check:manifest` green
  2. `<LoRACalculator>` correctly computes trainable params/VRAM/training time from rank/alpha/target-layer inputs
  3. 06-01 can argue both the legitimate and the bad reasons to fine-tune, not just advocate for it
**Plans**: 7 plans

Plans:
- [ ] 07-01: 06-01 Should you fine-tune?
- [ ] 07-02: 06-02 Datasets for fine-tuning
- [ ] 07-03: 06-03 LoRA & QLoRA
- [ ] 07-04: 06-04 SFT in practice
- [ ] 07-05: 06-05 Preference optimisation
- [ ] 07-06: 06-06 Reinforcement fine-tuning
- [ ] 07-07: 06-07 Distillation & evaluation

### Phase 8: Layer 7 — Inference, Serving & Cost
**Goal**: Readers understand inference economics, latency, serving engines, and quantization trade-offs.
**Depends on**: Phase 7
**Requirements**: 07-01, 07-02, 07-03, 07-04, 07-05, 07-06
**Success Criteria** (what must be TRUE):
  1. All 6 Layer 7 chapters published, `check:manifest` green
  2. `<QuantizationExplorer>` shows the VRAM/throughput/quality trade-off across FP16→FP8→INT8→INT4 with honest quality costs, not just savings
  3. `<CostModeler>` lets a reader build an agent workflow and see cost-per-task at scale
**Plans**: 6 plans

Plans:
- [ ] 08-01: 07-01 The economics of inference
- [ ] 08-02: 07-02 Latency
- [ ] 08-03: 07-03 Application-layer optimisation
- [ ] 08-04: 07-04 Serving engines
- [ ] 08-05: 07-05 Quantization
- [ ] 08-06: 07-06 Deployment targets

### Phase 9: Layer 8 — LLMOps & Production
**Goal**: Readers can ship an AI service with prompts-as-code, logging, and CI/CD eval gates.
**Depends on**: Phase 8
**Requirements**: 08-01, 08-02, 08-03, 08-04, 08-05, 08-06
**Success Criteria** (what must be TRUE):
  1. All 6 Layer 8 chapters published, `check:manifest` green
  2. 08-04 demonstrates a real CI/CD eval gate pattern (not just describes one) consistent with this repo's own `quality.yml`
  3. 08-06's reference architecture is internally consistent with the actual stack choices made elsewhere in the course
**Plans**: 6 plans

Plans:
- [ ] 09-01: 08-01 Shipping an AI service
- [ ] 09-02: 08-02 Prompts and config as code
- [ ] 09-03: 08-03 Logging & structured traces
- [ ] 09-04: 08-04 CI/CD with eval gates
- [ ] 09-05: 08-05 The ML platform layer
- [ ] 09-06: 08-06 Reference architecture

### Phase 10: Layer 9 — Safety, Security & Governance
**Goal**: Readers understand prompt injection, guardrails, hallucination mitigation, agent risk, privacy, and governance obligations.
**Depends on**: Phase 9
**Requirements**: 09-01, 09-02, 09-03, 09-04, 09-05, 09-06
**Success Criteria** (what must be TRUE):
  1. All 6 Layer 9 chapters published, `check:manifest` green
  2. `<PromptInjectionSandbox>` uses recorded attack/defence pairs with toggleable layered defences, no live/uncontrolled injection demos
  3. 09-06 states EU AI Act / NIST AI RMF / ISO 42001 facts only where verifiably accurate — no invented obligations or dates (CLAUDE.md §2.8)
**Plans**: 6 plans

Plans:
- [ ] 10-01: 09-01 Prompt injection
- [ ] 10-02: 09-02 Guardrails
- [ ] 10-03: 09-03 Hallucination & grounding
- [ ] 10-04: 09-04 Agent-specific risk
- [ ] 10-05: 09-05 Privacy & data protection
- [ ] 10-06: 09-06 Governance

### Phase 11: Layer 10 — Specialisations
**Goal**: Readers get a `[K]`-depth survey with one deep dive each across the major AI specialisations.
**Depends on**: Phase 10
**Requirements**: 10-01, 10-02, 10-03, 10-04, 10-05, 10-06, 10-07, 10-08
**Success Criteria** (what must be TRUE):
  1. All 8 Layer 10 chapters published, `check:manifest` green
  2. Each chapter's "one deep dive" is genuinely deep (runnable/interactive), not just another survey paragraph
  3. No chapter duplicates content already fully covered in Layers 0–9 — each adds specialisation-specific material only
**Plans**: 8 plans

Plans:
- [ ] 11-01: 10-01 Multimodal & document AI
- [ ] 11-02: 10-02 Voice AI
- [ ] 11-03: 10-03 Computer vision
- [ ] 11-04: 10-04 Coding agents
- [ ] 11-05: 10-05 Search & ranking
- [ ] 11-06: 10-06 Time series & forecasting
- [ ] 11-07: 10-07 Generative media
- [ ] 11-08: 10-08 AI infrastructure

### Phase 12: Capstone track
**Goal**: Six full build-alongs, each ending in a deployable artifact and a written engineering post, that let readers demonstrate everything learned.
**Depends on**: Phase 11
**Requirements**: CAP-01, CAP-02, CAP-03, CAP-04, CAP-05, CAP-06
**Success Criteria** (what must be TRUE):
  1. Each capstone produces a genuinely deployable (static-compatible) artifact, not a described-only project
  2. Each capstone's written engineering post states real trade-offs made, not just a happy-path walkthrough
  3. All 6 capstones published, `check:manifest` green
**Plans**: 6 plans

Plans:
- [ ] 12-01: CAP-01 Structured extraction service
- [ ] 12-02: CAP-02 Production RAG with hybrid search + reranking + incremental ingestion
- [ ] 12-03: CAP-03 Standalone eval harness with CI gating
- [ ] 12-04: CAP-04 Agent with custom MCP tools, HITL, tracing and a cost ceiling
- [ ] 12-05: CAP-05 Fine-tune + distillation case study with a published comparison table
- [ ] 12-06: CAP-06 End-to-end AI product with auth, streaming UI, observability and a cost budget

### Phase 13: Appendices
**Goal**: Reference material that supports every chapter — glossary hover-cards, maths reference, notation, reading list, job market guide.
**Depends on**: Phase 12 (in practice, the glossary grows incrementally across all phases — this phase is where it's finalized and the remaining static references are written)
**Requirements**: APP-01, APP-02, APP-03, APP-04, APP-05
**Success Criteria** (what must be TRUE):
  1. Every glossary term referenced via `<Term>` hover-cards across the whole site resolves to a real glossary entry — no dead links
  2. Maths reference sheet and notation guide are internally consistent with notation actually used in Layers 0–3
  3. All 5 appendices published, `check:manifest` green
**Plans**: 5 plans

Plans:
- [ ] 13-01: APP-01 Glossary
- [ ] 13-02: APP-02 Maths reference sheet
- [ ] 13-03: APP-03 Notation guide
- [ ] 13-04: APP-04 Curated reading list
- [ ] 13-05: APP-05 UK job market & interview guide

## Progress

**Execution Order:**
Phases execute in numeric order: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 0. Foundation infrastructure | 7/7 | Complete | 2026-07-24 |
| 1. Layer 0 — Foundations | 3/10 | In progress | - |
| 2. Layer 1 — Classical ML | 0/8 | Not started | - |
| 3. Layer 2 — Deep Learning | 0/8 | Not started | - |
| 4. Layer 3 — Transformers & LLM Internals | 0/9 | Not started | - |
| 5. Layer 4 — LLM Application Engineering | 0/16 | Not started | - |
| 6. Layer 5 — Evaluation & Observability | 0/6 | Not started | - |
| 7. Layer 6 — Model Adaptation | 0/7 | Not started | - |
| 8. Layer 7 — Inference, Serving & Cost | 0/6 | Not started | - |
| 9. Layer 8 — LLMOps & Production | 0/6 | Not started | - |
| 10. Layer 9 — Safety, Security & Governance | 0/6 | Not started | - |
| 11. Layer 10 — Specialisations | 0/8 | Not started | - |
| 12. Capstone track | 0/6 | Not started | - |
| 13. Appendices | 0/5 | Not started | - |
