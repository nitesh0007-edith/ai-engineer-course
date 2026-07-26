# Requirements: AI Engineer: Zero to Hero (Interactive Tutorial)

**Defined:** 2026-07-26
**Core Value:** Every chapter must contain something a reader cannot get from static prose — something they can run, break, tune, or watch move.

Requirement IDs reuse the chapter ids from CLAUDE.md §10 directly (e.g. `04-13`) so this file, `PROGRESS.md`, and the actual `src/content/chapters/` paths never drift out of sync. Capstones use `CAP-0N`, appendices use `APP-0N`.

## v1 Requirements

Every requirement below must satisfy the full chapter contract in CLAUDE.md §6 (frontmatter schema, hook → prerequisites → objectives → intuition → diagram → mechanics → worked example → PyRunner/Interactive → production reality → common mistakes → exercises → checkpoint → key takeaways → resources → next up) before being marked complete.

### Layer 0 — Foundations

- [x] **00-00**: How to use this course — the map, depth tiers, how to practise
- [x] **00-01**: Python for AI engineering [B] — types/hints, dataclasses, decorators, context managers, generators, comprehensions, error handling, logging, project layout
- [x] **00-02**: Async Python [B] — async/await, asyncio, event loop, concurrent API calls, semaphores, timeouts, cancellation
- [ ] **00-03**: Modern Python tooling [B] — uv, ruff, mypy, pytest, pre-commit, virtual environments, dependency pinning
- [ ] **00-04**: APIs & services [B] — REST, FastAPI, Pydantic v2, streaming, auth, rate limiting, retries, idempotency
- [ ] **00-05**: Data & storage [B/U] — SQL, Postgres, transactions, indexing, pgvector, Redis, TTLs, message queues, background jobs
- [ ] **00-06**: Containers, Git & CI [U/K] — Git workflow, Docker, multi-stage builds, GitHub Actions, IaC basics, Kubernetes concepts
- [ ] **00-07**: Maths I: linear algebra & calculus [B] — vectors, matrices, matmul, SVD, eigendecomposition; derivatives, gradients, chain rule, Jacobians
- [ ] **00-08**: Maths II: probability, statistics & optimisation [B/U] — distributions, Bayes, MLE, sampling, hypothesis testing, gradient descent/Adam, entropy/cross-entropy/KL, numerical stability
- [ ] **00-09**: Data foundations [B/U] — NumPy/pandas/Polars, cleaning, leakage detection, EDA, data versioning, data contracts, PII handling

### Layer 1 — Classical Machine Learning

- [ ] **01-01**: What learning from data means [B] — supervised/unsupervised/RL, the fitting loop, generalisation
- [ ] **01-02**: Linear & logistic regression [B] — least squares, gradient descent by hand, decision boundaries
- [ ] **01-03**: Trees & ensembles [B] — decision trees, entropy/Gini, random forests, bagging, boosting, XGBoost/LightGBM/CatBoost, stacking
- [ ] **01-04**: Other core algorithms [B/U] — k-NN, SVM and kernels, Naive Bayes
- [ ] **01-05**: Unsupervised learning [B] — k-means, hierarchical, DBSCAN, PCA, t-SNE, UMAP
- [ ] **01-06**: Evaluation done properly [B] — cross-validation, precision/recall/F1, ROC-AUC vs PR-AUC, calibration, MAE/RMSE/MAPE
- [ ] **01-07**: The bias–variance trade-off & regularisation [B] — over/underfitting, L1/L2/elastic net, class imbalance, hyperparameter tuning
- [ ] **01-08**: Pipelines, interpretability & adjacent problems [U/K] — sklearn pipelines, SHAP/LIME/PDP, time series, recommenders, causal inference basics

### Layer 2 — Deep Learning

- [ ] **02-01**: From neurons to networks [B] — perceptron, forward pass, activations, initialisation, universal approximation
- [ ] **02-02**: Backpropagation from scratch [B] — loss functions, chain rule as computation graph, autograd from first principles
- [ ] **02-03**: PyTorch [B] — tensors, autograd, nn.Module, Dataset/DataLoader, training loops, checkpointing, mixed precision
- [ ] **02-04**: Training mechanics [B] — batch size, LR warmup/decay, gradient clipping/accumulation, early stopping, debugging non-convergence
- [ ] **02-05**: Regularisation & normalisation [B] — dropout, batch/layer/RMSNorm, weight decay, augmentation
- [ ] **02-06**: CNNs & computer vision basics [U] — convolutions, pooling, receptive fields, ResNet/skip connections, transfer learning
- [ ] **02-07**: Sequences before transformers [U] — RNNs, LSTMs, GRUs, the bottleneck problem, why attention won
- [ ] **02-08**: The wider zoo [K/U] — embeddings, autoencoders/VAEs/GANs, diffusion, GNNs, RL foundations, distributed training

### Layer 3 — Transformers & LLM Internals

- [ ] **03-01**: Tokenisation [B] — BPE, WordPiece, SentencePiece, tiktoken, why token ≠ word
- [ ] **03-02**: Attention [B] — query/key/value, scaled dot-product, self vs cross attention, causal masking
- [ ] **03-03**: Multi-head attention & position [B] — heads, sinusoidal → learned → RoPE → ALiBi
- [ ] **03-04**: The transformer block [B] — residuals, pre/post-norm, FFN, stacking, parameter counting
- [ ] **03-05**: Build nanoGPT [B] — implement a working GPT end to end, train on a small corpus ⭐ highest-leverage chapter
- [ ] **03-06**: Decoding & sampling [B] — greedy, beam search, temperature/top-k/top-p/min-p, constrained decoding
- [ ] **03-07**: Architecture families & efficiency [U] — BERT/GPT/T5, KV cache, GQA/MQA, FlashAttention, MoE
- [ ] **03-08**: How models are trained [U] — pretraining, SFT, RLHF/DPO, RL on verifiable rewards, scaling laws
- [ ] **03-09**: Context, limits & alternatives [U/K] — context rot, state space models/Mamba, multimodal architectures

### Layer 4 — LLM Application Engineering

**4A · Working with models**
- [ ] **04-01**: Calling LLMs properly [B] — messages format, streaming, token counting, cost, retries, error taxonomy
- [ ] **04-02**: Structured outputs [B] — JSON mode/schema, function/tool calling, Pydantic validation ⭐
- [ ] **04-03**: Prompt engineering [B] — zero/few-shot, CoT, ReAct, self-consistency, versioning
- [ ] **04-04**: Choosing and routing models [U] — latency/cost/quality triangle, cascading, prompt caching, batch APIs
- [ ] **04-05**: Open-weight models & local inference [U] — HF Hub, transformers, Ollama, LM Studio
- [ ] **04-06**: Multimodal inputs [K/U] — images, PDFs, audio, document understanding

**4B · Context engineering**
- [ ] **04-07**: Context engineering fundamentals [B] — select, compress, order, isolate ⭐
- [ ] **04-08**: Memory [B] — short/long-term stores, episodic vs semantic, compaction triggers
- [ ] **04-09**: Context economics & anti-patterns [U] — token budget allocation, prompt-cache-aware design, lost-in-the-middle

**4C · RAG**
- [ ] **04-10**: Why RAG exists & why naive RAG fails [B]
- [ ] **04-11**: Ingestion & chunking [B] — parsing, fixed→recursive→semantic→structure-aware→agentic chunking, contextual retrieval
- [ ] **04-12**: Embeddings & vector search [B] — bi-encoders, MTEB, HNSW/IVF, pgvector/Qdrant/Weaviate/Pinecone
- [ ] **04-13**: Hybrid search & reranking [B] — BM25 + dense fusion with RRF, cross-encoder rerankers ⭐⭐ single biggest quality lever
- [ ] **04-14**: Query understanding & retrieval evaluation [B] — query rewriting, HyDE, Recall@K/MRR/nDCG@K
- [ ] **04-15**: Advanced RAG patterns [U/K] — agentic RAG, Self-RAG, corrective RAG, GraphRAG, ColBERT/SPLADE

**4D · Agents** *(note: CLAUDE.md §10 flags this manifest entry must ship as 3–4 separate chapters — split when this phase is planned)*
- [ ] **04-16**: Agents: the loop, tools, and MCP [B] — perceive/plan/act/observe, tool schema design, MCP, orchestration patterns, anti-patterns ⭐

### Layer 5 — Evaluation & Observability

- [ ] **05-01**: Why evals decide whether you ship [B]
- [ ] **05-02**: Building an eval set [B] — golden datasets, coverage, regression suites as CI gates
- [ ] **05-03**: LLM-as-judge [B] — rubric design, pairwise comparison, position/self-preference bias ⭐
- [ ] **05-04**: RAG & agent metrics [B] — faithfulness/groundedness, tool selection accuracy, task completion
- [ ] **05-05**: Tracing & observability [B] — spans, OpenTelemetry GenAI conventions, LangSmith/Langfuse/Phoenix/Braintrust/Weave
- [ ] **05-06**: Online quality [U/K] — drift, A/B tests, shadow deployment, public benchmarks and contamination

### Layer 6 — Model Adaptation

- [ ] **06-01**: Should you fine-tune? [B] — Prompt → RAG → Fine-tune → Distill; form not facts
- [ ] **06-02**: Datasets for fine-tuning [B] — instruction formatting, dedup, contamination checks, synthetic data
- [ ] **06-03**: LoRA & QLoRA [B] — rank/alpha, target layers, 4-bit NF4, VRAM budgeting ⭐
- [ ] **06-04**: SFT in practice [B] — trl, peft, Unsloth, Axolotl; failure modes
- [ ] **06-05**: Preference optimisation [U] — RLHF, DPO, ORPO, IPO
- [ ] **06-06**: Reinforcement fine-tuning [U] — GRPO/RFT, verifiable rewards
- [ ] **06-07**: Distillation & evaluation [U] — frontier→synthetic→small model, model merging, embedding fine-tuning ⭐

### Layer 7 — Inference, Serving & Cost

- [ ] **07-01**: The economics of inference [B] — cost per completed task, not per call ⭐
- [ ] **07-02**: Latency [B] — TTFT, inter-token latency, P50/P95/P99
- [ ] **07-03**: Application-layer optimisation [B] — prompt caching, context compression, routing/cascading, batching
- [ ] **07-04**: Serving engines [U] — vLLM, SGLang, TensorRT-LLM, LMDeploy
- [ ] **07-05**: Quantization [U] — AWQ, GPTQ, FP8/INT8/GGUF, speculative decoding
- [ ] **07-06**: Deployment targets [U/K] — Ollama/llama.cpp/MLX, GPU selection, Modal/Replicate/Runpod, Bedrock/Vertex

### Layer 8 — LLMOps & Production

- [ ] **08-01**: Shipping an AI service [B] — health checks, graceful degradation, fallback chains
- [ ] **08-02**: Prompts and config as code [B] — versioning, review, rollback, feature flags
- [ ] **08-03**: Logging & structured traces [B] — privacy-aware capture of input/context/tools/output
- [ ] **08-04**: CI/CD with eval gates [B] — no prompt/model change ships without passing evals ⭐
- [ ] **08-05**: The ML platform layer [U] — MLflow, W&B, model registry, feature stores, orchestration
- [ ] **08-06**: Reference architecture [U/K] — orchestration + observability + eval harness + MCP tooling, K8s for ML

### Layer 9 — Safety, Security & Governance

- [ ] **09-01**: Prompt injection [B] — direct/indirect, defence in depth ⭐
- [ ] **09-02**: Guardrails [B] — input/output validation, PII redaction, Guardrails AI/NeMo/Llama Guard
- [ ] **09-03**: Hallucination & grounding [B] — citation enforcement, abstention, confidence signals
- [ ] **09-04**: Agent-specific risk [U] — excessive agency, cost-bombing, OWASP Top 10 for LLM Apps
- [ ] **09-05**: Privacy & data protection [U] — GDPR/UK GDPR, DPIAs, red teaming, jailbreak taxonomies
- [ ] **09-06**: Governance [K] — EU AI Act, UK sector-led approach, ISO/IEC 42001, NIST AI RMF

### Layer 10 — Specialisations

- [ ] **10-01**: Multimodal & document AI — VLMs, OCR pipelines, chart/table understanding, video
- [ ] **10-02**: Voice AI — ASR/Whisper, TTS, realtime APIs, turn-taking
- [ ] **10-03**: Computer vision — YOLO/DETR, SAM, video analytics
- [ ] **10-04**: Coding agents — repo-scale retrieval, AST-aware chunking, SWE-bench-style evals
- [ ] **10-05**: Search & ranking — learning to rank, query understanding, personalisation
- [ ] **10-06**: Time series & forecasting — foundation models for time series, anomaly detection
- [ ] **10-07**: Generative media — diffusion, ControlNet, LoRAs, video generation
- [ ] **10-08**: AI infrastructure — GPU kernels, Triton, CUDA, distributed training

### Capstone track

- [ ] **CAP-01**: Structured extraction service (deliberately not an agent)
- [ ] **CAP-02**: Production RAG with hybrid search + reranking + incremental ingestion
- [ ] **CAP-03**: Standalone eval harness with CI gating
- [ ] **CAP-04**: Agent with custom MCP tools, HITL, tracing and a cost ceiling
- [ ] **CAP-05**: Fine-tune + distillation case study with a published comparison table
- [ ] **CAP-06**: End-to-end AI product with auth, streaming UI, observability and a cost budget

### Appendices

- [ ] **APP-01**: Glossary (every term, hover-cards site-wide)
- [ ] **APP-02**: Maths reference sheet
- [ ] **APP-03**: Notation guide
- [ ] **APP-04**: Curated reading list
- [ ] **APP-05**: UK job market & interview guide

## v2 Requirements

None — this is a fixed, fully-scoped manifest (CLAUDE.md §10 is authoritative and `pnpm check:manifest` enforces it mechanically). There is no deferred/v2 tier; everything above ships in v1 or the project isn't done.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Any topic not in CLAUDE.md §10 | Manifest is closed; additions require updating CLAUDE.md §10 first, which requires deliberate discussion (it's the enforcement mechanism for `pnpm check:manifest`) |
| Reordering layers to chase trends (e.g. jumping to agents before foundations) | CLAUDE.md §11 mandates manifest order — later layers assume earlier ones as prerequisites |
| Publishing a chapter before all its subtopics are genuinely taught | CLAUDE.md §15 — "mark it draft and come back" |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| 00-00 | Phase 1 | Complete |
| 00-01 | Phase 1 | Complete |
| 00-02 | Phase 1 | Complete |
| 00-03 | Phase 1 | Pending |
| 00-04 | Phase 1 | Pending |
| 00-05 | Phase 1 | Pending |
| 00-06 | Phase 1 | Pending |
| 00-07 | Phase 1 | Pending |
| 00-08 | Phase 1 | Pending |
| 00-09 | Phase 1 | Pending |
| 01-01..01-08 | Phase 2 | Pending |
| 02-01..02-08 | Phase 3 | Pending |
| 03-01..03-09 | Phase 4 | Pending |
| 04-01..04-16 | Phase 5 | Pending |
| 05-01..05-06 | Phase 6 | Pending |
| 06-01..06-07 | Phase 7 | Pending |
| 07-01..07-06 | Phase 8 | Pending |
| 08-01..08-06 | Phase 9 | Pending |
| 09-01..09-06 | Phase 10 | Pending |
| 10-01..10-08 | Phase 11 | Pending |
| CAP-01..CAP-06 | Phase 12 | Pending |
| APP-01..APP-05 | Phase 13 | Pending |

**Coverage:**
- v1 requirements: 101 total (90 chapters + 6 capstone projects + 5 appendices)
- Mapped to phases: 101
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-26*
*Last updated: 2026-07-26 after adopting GSD for roadmap tracking*
