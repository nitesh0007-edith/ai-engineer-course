# AI Engineer: Zero to Hero (2026–2027)

**Built for:** someone with a data engineering background (ADF / Databricks / PySpark / Snowflake) doing an MSc in Data Science, targeting UK AI/ML engineering roles.

---

## Read this first: how to use this list

You asked for "don't miss any topic." Here's the complete map — but a complete map is only useful if you know which roads to drive and which to just recognise on a sign. Every topic below is tagged:

- **[BUILD]** — you must be able to build this from scratch, unassisted, under time pressure. Interviewers will probe it.
- **[USE]** — you must be able to use the tool/technique correctly and explain the trade-offs. You don't need to implement it from first principles.
- **[KNOW]** — you need to know it exists, what problem it solves, and roughly how. Enough to not look lost when a senior engineer mentions it.

Trying to hit [BUILD] depth on everything is the single most common way people spend 18 months and end up unhireable. Depth in the right places beats breadth everywhere.

**What the job actually is in 2026:** the market has moved past "AI-curious." Companies aren't hiring people to demo wrappers; they're hiring people who ship AI systems that stay up, stay cheap, and stay correct. Reliability, evaluation, observability and cost now matter as much as accuracy. Roughly 40% of things labelled "agents" in production are a single LLM call with structured output — knowing when *not* to build the complicated thing is a senior skill.

**Your unfair advantage:** most people entering AI engineering cannot build a data pipeline. You can. Retrieval quality, chunking, incremental indexing, freshness, lineage, and cost control are all data engineering problems wearing an AI hat. Lean into this hard — it's what separates a demo builder from someone who ships.

---

# LAYER 0 — Foundations

## 0.1 Software engineering (non-negotiable)

You're an engineer first. Most rejected candidates fail here, not on ML.

- **[BUILD]** Python: typing/type hints, dataclasses, decorators, context managers, generators, comprehensions, `async`/`await`, `asyncio` (agents are I/O-bound — this matters), error handling, logging
- **[BUILD]** Modern tooling: `uv` (now the default over pip/poetry), `ruff`, `mypy`, `pytest`, pre-commit hooks
- **[BUILD]** Git: branching, rebase, PR workflow, code review etiquette
- **[BUILD]** APIs: REST, FastAPI, Pydantic v2 (critical — it's the backbone of structured outputs), streaming responses (SSE, WebSockets), auth (OAuth2, JWT), rate limiting, retries with exponential backoff, idempotency
- **[BUILD]** Databases: SQL (you have this), Postgres specifically, transactions, indexing, `pgvector`
- **[USE]** Docker + docker-compose; multi-stage builds; image size discipline
- **[USE]** Linux/CLI, bash scripting, `make`
- **[USE]** Caching: Redis, TTLs, cache invalidation strategies
- **[USE]** Message queues / background jobs: Celery, RQ, or Azure Service Bus
- **[KNOW]** Kubernetes basics, Terraform / IaC, CI/CD pipelines (GitHub Actions, Azure DevOps)
- **[KNOW]** System design: load balancing, horizontal scaling, CAP theorem, idempotency, backpressure, circuit breakers
- **[KNOW]** TypeScript/Node — increasingly common for AI product front-ends and TS agent frameworks

> **Your shortcut:** you likely have SQL, Git, Docker, orchestration and cloud already. Spend your time on FastAPI, Pydantic, async Python and testing. Two weeks, not two months.

## 0.2 Mathematics

Enough to reason about models, not enough to write a paper.

- **[BUILD]** Linear algebra: vectors, matrices, matrix multiplication, dot products, norms, cosine similarity, matrix decomposition (SVD, eigendecomposition), rank, projections
- **[BUILD]** Calculus: derivatives, partial derivatives, gradients, chain rule (this *is* backpropagation), Jacobians
- **[BUILD]** Probability: distributions (Bernoulli, Gaussian, categorical), conditional probability, Bayes' theorem, expectation, variance, MLE
- **[BUILD]** Statistics: sampling, confidence intervals, hypothesis testing, p-values, A/B testing, multiple-comparison correction
- **[USE]** Optimisation: gradient descent, SGD, momentum, Adam/AdamW, learning rate schedules, convexity
- **[USE]** Information theory: entropy, cross-entropy, KL divergence, perplexity
- **[KNOW]** Numerical stability: floating-point precision, log-sum-exp trick, vanishing/exploding gradients

**Resources:** 3Blue1Brown (Linear Algebra + Neural Networks series), *Mathematics for Machine Learning* (Deisenroth), StatQuest.

## 0.3 Data foundations

- **[BUILD]** NumPy, pandas (and Polars — increasingly the default for medium data)
- **[BUILD]** Data cleaning, missing values, outliers, leakage detection, train/test hygiene
- **[BUILD]** Feature engineering: encoding, scaling, binning, interaction terms
- **[USE]** EDA and visualisation: matplotlib, seaborn, plotly
- **[USE]** Data versioning: DVC, LakeFS, or Delta Lake time travel
- **[KNOW]** Data contracts, schema evolution, PII handling, GDPR-compliant data design

> You already own most of this layer. Skip to Layer 1.

---

# LAYER 1 — Classical Machine Learning

Still asked about in almost every UK interview, even for GenAI roles. Don't skip it because it's "old."

- **[BUILD]** Supervised learning: linear regression, logistic regression, decision trees, random forests, gradient boosting (XGBoost / LightGBM / CatBoost), k-NN, SVM, Naive Bayes
- **[BUILD]** Unsupervised: k-means, hierarchical clustering, DBSCAN, PCA, t-SNE/UMAP
- **[BUILD]** Model evaluation: train/val/test splits, cross-validation, accuracy/precision/recall/F1, ROC-AUC, PR-AUC (and when PR-AUC beats ROC-AUC), MAE/RMSE/MAPE, confusion matrices, calibration curves
- **[BUILD]** Bias–variance trade-off, overfitting/underfitting, regularisation (L1/L2, elastic net), class imbalance (SMOTE, class weights, threshold tuning)
- **[USE]** Hyperparameter tuning: grid/random search, Bayesian optimisation, Optuna
- **[USE]** Ensembling: bagging, boosting, stacking
- **[USE]** scikit-learn pipelines, ColumnTransformer, custom transformers
- **[USE]** Interpretability: feature importance, SHAP, LIME, partial dependence plots
- **[KNOW]** Time series: ARIMA, Prophet, feature-based forecasting, backtesting with proper temporal splits
- **[KNOW]** Recommender systems: collaborative filtering, matrix factorisation, two-tower models
- **[KNOW]** Causal inference basics: correlation vs causation, confounders, uplift modelling

**Milestone:** end-to-end tabular project with proper validation, deployed behind an API, with a written analysis of what you'd monitor in production.

---

# LAYER 2 — Deep Learning

- **[BUILD]** Neural network fundamentals: perceptron, forward pass, loss functions, backpropagation (derive it by hand at least once), activation functions (ReLU, GELU, SwiGLU), initialisation
- **[BUILD]** PyTorch: tensors, autograd, `nn.Module`, DataLoader/Dataset, training loops, checkpointing, GPU/device management, mixed precision
- **[BUILD]** Training mechanics: batch size, epochs, learning rate warmup/decay, gradient clipping, gradient accumulation, early stopping
- **[BUILD]** Regularisation: dropout, batch norm, layer norm, RMSNorm, weight decay, data augmentation
- **[USE]** CNNs: convolutions, pooling, ResNet/skip connections, transfer learning
- **[USE]** RNNs/LSTMs/GRUs — mostly historical now, but you need them to understand *why* transformers won
- **[USE]** Embeddings: word2vec, GloVe, and modern sentence embeddings
- **[USE]** Distributed training basics: data parallel, DDP, FSDP, ZeRO
- **[KNOW]** Autoencoders, VAEs, GANs, diffusion models (forward/reverse process, U-Net, latent diffusion)
- **[KNOW]** Graph neural networks
- **[KNOW]** Reinforcement learning: MDPs, Q-learning, policy gradients, PPO — needed to understand RLHF

**Compute:** Google Colab / Kaggle free tiers → Lightning AI or Modal for anything bigger. You do not need to buy a GPU.

**Milestone:** train an image classifier and a text classifier from scratch in PyTorch. Then implement a tiny transformer (below).

---

# LAYER 3 — Transformers & LLM Internals

This is where "AI engineer" starts. You don't need to train a frontier model, but you must understand what's happening inside the box or you'll debug by superstition.

- **[BUILD]** Attention mechanism: query/key/value, scaled dot-product attention, why the √d scaling exists
- **[BUILD]** Multi-head attention, positional encodings (sinusoidal → learned → **RoPE**, which is what modern models use), ALiBi
- **[BUILD]** Transformer block: attention → residual → norm → FFN → residual → norm; pre-norm vs post-norm
- **[BUILD]** Tokenisation: BPE, WordPiece, SentencePiece, tiktoken; why token counts ≠ word counts; why tokenisation causes weird failures (arithmetic, spelling, non-English)
- **[BUILD]** Decoding strategies: greedy, beam search, temperature, top-k, top-p/nucleus, repetition penalty, min-p; constrained/structured decoding
- **[BUILD]** **Karpathy's "Let's build GPT" / nanoGPT** — implement it yourself, line by line. This is the single highest-leverage exercise in this entire document.
- **[USE]** Architectures: encoder-only (BERT), decoder-only (GPT/Llama/Qwen), encoder-decoder (T5); when each applies
- **[USE]** KV cache — what it is, why it dominates memory at inference, prefix/prompt caching
- **[USE]** Grouped-query attention (GQA), multi-query attention, FlashAttention, sliding window attention
- **[USE]** Mixture of Experts (MoE): routing, active vs total parameters, why MoE models are cheap to serve relative to size
- **[USE]** Context windows: what limits them, "lost in the middle," context rot at long lengths
- **[USE]** Training stages: pretraining → SFT → preference optimisation (RLHF/DPO) → RL on verifiable rewards; what "reasoning models" actually do (extended thinking, test-time compute)
- **[KNOW]** Scaling laws (Chinchilla), emergent abilities debate, tokenizer-free / byte-level models
- **[KNOW]** State space models / Mamba, linear attention, hybrid architectures
- **[KNOW]** Multimodal architectures: vision encoders, CLIP, cross-attention fusion, native multimodal models

**Resources:** Karpathy's *Zero to Hero* series, *The Illustrated Transformer* (Jay Alammar), *Attention Is All You Need*, Hugging Face NLP course, *3Blue1Brown* transformer visualisation.

---

# LAYER 4 — LLM Application Engineering

**This is 70% of the actual day job.** Everything above is the foundation; this is the building.

## 4.1 Working with models

- **[BUILD]** LLM APIs: OpenAI, Anthropic, Google — messages format, system prompts, streaming, token counting, cost calculation, rate limits, retries, timeouts
- **[BUILD]** Structured outputs: JSON mode, JSON Schema, function/tool calling, Pydantic-validated outputs, retry-on-validation-failure loops. **This is the most underrated skill on this list** — a huge share of production "AI features" are one call plus a schema
- **[BUILD]** Prompt engineering: zero-shot, few-shot, chain-of-thought, ReAct, self-consistency, role/system prompt design, delimiters, output formatting, negative instructions, prompt templates and versioning
- **[USE]** Model selection and routing: frontier vs mid vs small models, latency/cost/quality triangle, cascading (cheap model first, escalate on low confidence), open-weight vs API
- **[USE]** Open-weight models: Llama, Qwen, Mistral, Gemma, DeepSeek families; Hugging Face Hub, `transformers`, Ollama / LM Studio for local runs
- **[USE]** Prompt caching, batch APIs, streaming UX patterns
- **[KNOW]** Multimodal inputs: images, PDFs, audio; document understanding pipelines

## 4.2 Context engineering ⭐

The discipline that replaced "prompt engineering." Most agent failures are context failures, not model failures — the model is fine, the information you fed it wasn't. Treat the context window as a **per-turn budget**, not a bucket.

- **[BUILD]** The four moves: **select** (what goes in), **compress** (summarise/trim), **order** (position matters), **isolate** (separate concerns into sub-agents/tools)
- **[BUILD]** Context compaction: when to trigger, how to summarise history without losing decisions
- **[BUILD]** Memory: short-term (conversation buffer), long-term (vector or key-value store), episodic vs semantic memory, memory write/read policies
- **[USE]** Token budget allocation across system prompt / tools / retrieved docs / history / user input
- **[USE]** Prompt-cache-aware context design (stable prefix, volatile suffix)
- **[USE]** Anti-patterns: dumping everything in, context distraction, tool-definition bloat, lost-in-the-middle
- **[KNOW]** mem0, Letta, and why most teams still build a thin custom memory layer instead
- **[KNOW]** Long context vs RAG economics — bigger windows reduce pressure, they don't remove it

## 4.3 RAG (Retrieval-Augmented Generation)

Naive RAG — dump PDFs in a vector DB, cosine similarity, ship — is a prototype at best in 2026. Know the full ladder.

**Ingestion**
- **[BUILD]** Document parsing: PDFs (this is genuinely hard), tables, HTML, DOCX; OCR; layout-aware parsing (unstructured.io, LlamaParse, Docling)
- **[BUILD]** Chunking strategies: fixed-size + overlap → recursive → **semantic chunking** (split where meaning shifts) → structure-aware (split on headings, per-function for code) → agentic chunking; parent-document and small-to-big retrieval; contextual retrieval (prepend chunk-level context before embedding)
- **[BUILD]** Metadata design and filtering — the cheapest accuracy win most people skip
- **[USE]** Incremental indexing, freshness, deletion, re-embedding on model change *(your data engineering background is a real edge here)*

**Retrieval**
- **[BUILD]** Embeddings: bi-encoders, dimensionality, similarity metrics, model choice, MTEB leaderboard, domain-specific embeddings
- **[BUILD]** Vector search: HNSW, IVF, ANN vs exact, filtering; vector DBs — pgvector, Qdrant, Weaviate, Pinecone, Milvus, Chroma, Azure AI Search
- **[BUILD]** **Hybrid search: dense + BM25/sparse, fused with Reciprocal Rank Fusion.** This is the production default
- **[BUILD]** **Reranking with cross-encoders** (Cohere Rerank, BGE-reranker, ms-marco models). Rule of thumb: retrieve ~20–100, rerank to ~5, send 3–5 to the model. Rerankers are the single biggest quality lever in most RAG systems
- **[USE]** Query transformation: rewriting, expansion, HyDE, multi-query, decomposition, conversational query rewriting for multi-turn
- **[USE]** Retrieval metrics: Recall@K, MRR, nDCG@K, hit rate — measure retrieval *separately* from generation

**Advanced patterns**
- **[USE]** Agentic RAG: agent plans → retrieves → evaluates sufficiency → re-retrieves → synthesises
- **[USE]** Adaptive/routed RAG: match pipeline complexity to query complexity (cheap path for easy questions)
- **[USE]** Self-RAG, corrective RAG (CRAG)
- **[KNOW]** GraphRAG and knowledge graphs — for relationship-heavy, multi-hop queries
- **[KNOW]** Multimodal RAG, ColBERT/late interaction, SPLADE

**Decision tree:** single-chunk answer → naive RAG + reranker. 2–3 documents → hybrid + rerank + query transform. Relationships → GraphRAG. Multi-step reasoning → agentic RAG. Mixed → adaptive routing.

## 4.4 Agents

- **[BUILD]** The core loop: perceive → plan → act (tool call) → observe → repeat, with termination conditions
- **[BUILD]** Tool/function design: schemas, descriptions, argument validation, error messages the model can recover from, idempotency, tool-count discipline
- **[BUILD]** ReAct, plan-and-execute, reflection/self-critique patterns
- **[BUILD]** **MCP (Model Context Protocol)** — the standard for agent↔tool interop; JSON-RPC over stdio/HTTP/SSE, tool registration, capability negotiation. Build your own MCP server. Every major framework now supports it natively
- **[BUILD]** Human-in-the-loop: approval gates, interrupts, checkpointing, resumption
- **[USE]** Orchestration patterns — the four that actually ship: **graph-based** (LangGraph, Microsoft Agent Framework), **role-based** (CrewAI, Agno), **handoff-based** (OpenAI Agents SDK), **hierarchical** (Google ADK)
- **[USE]** Multi-agent: supervisor/worker, specialist agents, shared state, when multi-agent is genuinely better vs just slower and more expensive (usually the latter)
- **[USE]** Frameworks — pick **one** and go deep, then read the others' docs:
  - **LangGraph** — the safest bet for UK enterprise roles; stateful graphs, durable execution, checkpointing, LangSmith observability
  - **Claude Agent SDK** — Anthropic-native, strong on subagents and tool use
  - **OpenAI Agents SDK** — cleanest handoff primitive, tight Responses API integration
  - **Pydantic AI** — type-safe Python, great if you already love Pydantic
  - **Microsoft Agent Framework** — the Semantic Kernel + AutoGen merger; matters if you're targeting Azure shops (**relevant to your ADF/Azure background**)
  - **Mastra** — the TypeScript pick
  - **LlamaIndex Workflows** — RAG-grounded agents
- **[USE]** Agent state: durable execution, replay, failure recovery
- **[KNOW]** A2A (Agent-to-Agent) protocol — cross-framework interop, early but coming
- **[KNOW]** Computer-use agents, browser agents, coding agents (SWE-bench, Terminal-Bench)
- **[KNOW]** Agent design anti-patterns: agent when a function would do, unbounded loops, no cost ceiling, no timeout

> **Reality check to keep saying out loud in interviews:** most "agent" problems are solved by one LLM call with structured output. Reach for an agent when the number of steps is genuinely unknown ahead of time.

---

# LAYER 5 — Evaluation & Observability ⭐⭐

**This is the highest-ROI, lowest-competition area in the entire market.** Around 89% of teams have agent observability but only ~52% have evals — and quality is the #1 barrier stopping agents reaching production. If you can walk into an interview and talk fluently about eval design, you will stand out immediately, because almost no junior candidate can.

- **[BUILD]** Eval fundamentals: golden datasets, test case design, offline vs online eval, regression suites as CI gates
- **[BUILD]** LLM-as-judge: rubric design, pairwise comparison, position bias, judge calibration against human labels, when judges fail
- **[BUILD]** RAG-specific metrics: faithfulness/groundedness, answer relevance, context precision, context recall (RAGAS, DeepEval)
- **[BUILD]** Agent-specific metrics: **tool selection accuracy, planning quality, step-level faithfulness, reasoning coherence, task completion rate** — standard text metrics are necessary but nowhere near sufficient for agents
- **[BUILD]** Tracing and spans: instrument every LLM call, tool call and retrieval; latency, token, and cost attribution per span
- **[USE]** Tooling: LangSmith, Langfuse, Arize Phoenix, Braintrust, DeepEval/Confident AI, Weights & Biases Weave, OpenTelemetry GenAI semantic conventions
- **[USE]** Multi-turn simulation — synthetic user-agent conversations with branching paths, to test future behaviour rather than only past logs
- **[USE]** Online monitoring: drift, user feedback loops, thumbs-up/down capture, error taxonomy, incident triage
- **[USE]** A/B testing and shadow deployment for prompt/model changes
- **[KNOW]** Benchmarks and their limits: MMLU, GPQA, SWE-bench, HumanEval, MT-Bench, LMArena; contamination; why benchmark ≠ your use case

**Milestone:** take any RAG or agent project you've built and add a real eval harness that fails your CI when quality regresses. Put this in your portfolio. Very few candidates have it.

---

# LAYER 6 — Model Adaptation (Fine-tuning, PEFT, Distillation)

The correct order in 2026 is: **Prompt → RAG → Fine-tune → Distill.** Most teams should not fine-tune. Fine-tuning is for *form*, not *facts* — style, format, tone, tool-call schemas, refusal behaviour. It is not a database write.

- **[BUILD]** When to fine-tune vs not — be able to argue both sides in an interview. Legitimate reasons: style/format pinning, closed tasks with thousands of labels, distillation for cost, custom tool-calling schemas, weak-language/domain coverage
- **[BUILD]** Dataset construction: instruction formatting, quality > quantity, dedup, contamination checks, train/eval splits
- **[BUILD]** **LoRA** — low-rank adapters, rank `r` and `alpha`, which layers to target, typical ranks 8–64
- **[BUILD]** **QLoRA** — 4-bit NF4 base + LoRA adapters, paged optimizers; makes single-GPU fine-tuning realistic
- **[USE]** SFT (supervised fine-tuning), and the preference stage: **DPO** (now the practical default), ORPO, IPO
- **[USE]** RLHF conceptually: reward model → PPO; why DPO largely displaced it for product teams
- **[USE]** **GRPO / Reinforcement Fine-Tuning (RFT)** — reward verifiable outcomes rather than imitating references. This is the one place fine-tuning shows a genuine step change over prompting, especially for reasoning, maths and code
- **[USE]** Tooling: Hugging Face `trl` + `peft` (canonical), **Unsloth** (2–5× faster, much lower VRAM), **Axolotl** (declarative YAML), DeepSpeed / FSDP for scale
- **[USE]** **Distillation** — use a frontier model to generate 50–100k high-quality examples, fine-tune a small open model to match on your narrow task, serve at a fraction of the cost. This is one of the most commercially valuable skills on this list
- **[USE]** Evaluating a fine-tune: baseline first, task metrics, regression on general ability, catastrophic forgetting checks
- **[KNOW]** Full fine-tuning and why it's almost never right; continued pretraining; model merging (SLERP, TIES); adapter hot-swapping
- **[KNOW]** Embedding model fine-tuning — often higher ROI than fine-tuning the generator

---

# LAYER 7 — Inference, Serving & Cost Engineering

Inference has overtaken training as the main driver of compute spend. API prices fell dramatically, but agentic workflows making 50–200 calls per task turn cheap tokens into expensive tasks. Cost engineering is now a first-class skill.

- **[BUILD]** Cost modelling: track **tokens per completed unit of work**, not per request. Cost per task, not cost per call
- **[BUILD]** Latency: TTFT (time to first token), inter-token latency, tokens/sec, P50/P95/P99; streaming to hide latency
- **[BUILD]** Application-layer levers (the ones you control on hosted APIs): **prompt caching, context compression, model routing/cascading, batching, semantic caching of responses**
- **[USE]** **vLLM** — the reliable default for self-hosting: continuous batching, PagedAttention, prefix caching, chunked prefill, tensor parallelism
- **[USE]** Quantization: **AWQ, GPTQ, FP8** (cleanest on H100-class hardware), INT8, GGUF for llama.cpp; VRAM vs quality trade-offs; calibration datasets
- **[USE]** KV cache management and compression; why it dominates long-context memory
- **[USE]** Speculative decoding, draft models
- **[USE]** Local/edge: Ollama, llama.cpp, MLX (Apple Silicon); sub-10B models are genuinely competitive on narrow tasks now
- **[KNOW]** SGLang, TensorRT-LLM, LMDeploy; prefill/decode disaggregation; GPU selection (A100 vs H100 vs L40S vs consumer)
- **[KNOW]** Autoscaling GPU workloads, cold starts, Modal / Replicate / Runpod / Baseten; Azure ML endpoints and Databricks Model Serving *(closest to your existing stack)*

---

# LAYER 8 — LLMOps / Production

- **[BUILD]** Deployment: containerised FastAPI service, health checks, graceful degradation, fallback model chains
- **[BUILD]** Prompt and config versioning; treat prompts as code with review and rollback
- **[BUILD]** Structured logging of full traces (input, retrieved context, tool calls, output, cost, latency)
- **[BUILD]** CI/CD with eval gates — no prompt or model change ships without passing the eval suite
- **[USE]** Experiment tracking and registries: MLflow (native in Databricks — **use your advantage**), Weights & Biases
- **[USE]** Feature stores, model registry, model/data drift monitoring
- **[USE]** Orchestration: Airflow, Dagster, Prefect, Azure Data Factory *(you have this)*
- **[USE]** Cloud AI platforms — pick one and go deep: **Azure AI Foundry + Databricks** is the highest-leverage choice given your background; alternatives are AWS Bedrock/SageMaker and GCP Vertex AI
- **[USE]** Secrets management, environment separation, blue/green and canary deploys
- **[KNOW]** Kubernetes for ML, KServe, Ray Serve, Kubeflow
- **[KNOW]** The reference architecture that's stabilising: one orchestration framework + one observability stack + one eval harness + MCP-based tooling

---

# LAYER 9 — Safety, Security & Governance

Increasingly a hard requirement in UK financial services, healthcare and public sector — three of the biggest UK AI employers.

- **[BUILD]** Prompt injection and indirect prompt injection; why it's unsolved; defence in depth (input filtering, output validation, privilege separation, tool allow-lists, sandboxing)
- **[BUILD]** Guardrails: input/output validation, PII detection and redaction, content filtering, refusal handling; tools like Guardrails AI, NeMo Guardrails, Llama Guard
- **[BUILD]** Hallucination mitigation: grounding, citation enforcement, abstention ("I don't know" as a valid output), confidence signals
- **[USE]** **OWASP Top 10 for LLM Applications** — learn the list, it comes up in interviews
- **[USE]** Data privacy: GDPR/UK GDPR, data residency (matters a lot for EU/UK deployments), zero-retention API settings, on-prem vs cloud decisions
- **[USE]** Red teaming and adversarial testing; jailbreak taxonomies
- **[USE]** Agent-specific risks: excessive agency, unbounded tool access, cost-bombing loops, data exfiltration through tools
- **[KNOW]** **EU AI Act** — risk tiers, obligations for high-risk and GPAI systems, timelines; the UK's more sector-led, principles-based approach and the role of the AI Security Institute
- **[KNOW]** Bias, fairness metrics, model cards, datasheets, algorithmic transparency, ISO/IEC 42001, NIST AI RMF

---

# LAYER 10 — Specialisations (pick one, later)

Don't touch these until Layers 0–9 are solid. Then pick **one** to differentiate.

- **Multimodal / document AI** — VLMs, OCR pipelines, chart/table understanding, video. Huge enterprise demand
- **Voice AI** — Whisper/ASR, TTS, realtime APIs, turn-taking, latency budgets under 500ms
- **Computer vision** — detection (YOLO, DETR), segmentation (SAM), OCR, video analytics
- **Coding agents** — repo-scale retrieval, AST-aware chunking, sandboxed execution, SWE-bench-style evals
- **Search & ranking** — learning to rank, query understanding, personalisation
- **Time series & forecasting** — foundation models for time series, anomaly detection
- **Diffusion / generative media** — Stable Diffusion, ControlNet, LoRAs, video generation
- **AI infrastructure** — GPU kernels, Triton, CUDA, distributed training. Highest ceiling, steepest slope

---

# Portfolio: what to actually build

Six projects, in order. Each one should be deployed, documented, and have a README that reads like an engineering write-up — not a tutorial dump. **Depth on three beats shallow on ten.**

1. **Structured extraction service** — FastAPI + Pydantic + function calling. Extract structured records from messy documents at scale, with validation, retries, and a cost dashboard. Deliberately *not* an agent. Demonstrates you know when the simple thing wins.

2. **Production RAG over a real corpus** — hybrid search + RRF + cross-encoder reranking + metadata filtering, with an incremental ingestion pipeline (Databricks/PySpark — play to your strengths). Include a retrieval eval harness reporting Recall@K and nDCG. Write up the before/after numbers for each technique you added.

3. **Eval harness as a standalone project** — LLM-as-judge with calibration against human labels, regression gating in GitHub Actions, tracked in Langfuse or LangSmith. This is the project that will get you interviews, because almost nobody has one.

4. **Agent with MCP tools** — LangGraph (or Microsoft Agent Framework if you're targeting Azure shops), custom MCP server, human-in-the-loop approval, checkpointing, full tracing, hard cost ceiling. Document the failure modes you found and fixed.

5. **Fine-tune + distillation case study** — take a narrow task, establish a frontier-model baseline, generate training data, QLoRA a small open model with Unsloth, and publish the quality/latency/cost comparison table. Very few candidates can show this.

6. **End-to-end AI product** — pick a real domain, ship a small full-stack app with auth, streaming UI, observability, evals and a cost budget. Something a stranger can use without you explaining it.

**Rules:** every repo gets a proper README (problem, architecture diagram, decisions and trade-offs, what you'd do differently at 100× scale, measured results). Write a short post about each. Ship, don't polish forever.

---

# UK market notes (mid-2026)

- UK AI hiring recovered strongly: specialist AI job postings rose about 61% year-on-year to roughly 180,000, and specialist AI roles now make up about 2.2% of the whole job market — while overall vacancies fell around 6.6%. AI is one of very few areas growing while the broader tech market contracts.
- The UK has the highest share of AI-mentioning job postings of 30 countries surveyed (~5.6% of all postings, per Indeed Hiring Lab).
- Median ML engineer pay sits near **£67k** (ITJobsWatch, to mid-2026); the wider field spans roughly £47k–£106k, with senior/principal/head-of-AI reaching £130k–£250k+. Trainee AI engineer roles start around £36k — well above the ~£29k average graduate starting salary.
- Clusters: **London** (roughly half of all UK AI vacancies), then Cambridge, **Manchester**, Edinburgh, Bristol. Manchester being a named cluster is good news for you — but London still dominates, so decide early whether you'll relocate or commute.
- Active employers: Google DeepMind, BAE Systems, Barclays, HSBC, NHS, Rolls-Royce, Faculty, plus the AI Security Institute on the public side. Financial services is the fastest-accelerating second mover — and your Azure/Databricks/Snowflake stack maps directly onto UK banking and insurance.
- Hiring has shifted to **applied AI in production**. Employers want people who work with APIs, understand model limitations, and translate business requirements into AI-appropriate solutions — not people who've read papers.
- Entry-level tech roles overall are shrinking, so generic "I did the Coursera specialisation" profiles are being filtered out hard. Shipped, measured, deployed work is what gets you through.

**Positioning advice for you specifically:** don't market yourself as "aspiring AI engineer." Market yourself as **a data engineer who builds production LLM systems**. That's a rarer and more credible profile than a fresh MSc graduate with a chatbot demo, and it maps onto the actual bottleneck in most enterprises — the retrieval and data layer, not the model.

**Timing note:** since Summer 2026 is already underway, your realistic targets are autumn 2026 grad schemes, Summer 2027 internships (applications typically open Sept–Dec 2026 — put reminders in your calendar now), and direct-entry junior/associate AI engineer roles, which increasingly hire year-round rather than on a graduate cycle.

---

# Suggested schedule (~9 months, part-time alongside your MSc)

Adjust aggressively — if you already know a block, skip it.

| Months | Focus | Output |
|---|---|---|
| 1 | Layer 0 gaps (FastAPI, Pydantic, async, testing) + Layer 1 refresher | Project 1 |
| 2 | Layer 2 (PyTorch, deep learning) | Trained classifiers |
| 3 | Layer 3 (transformers, nanoGPT from scratch) | Your own mini-GPT |
| 4 | Layer 4.1–4.2 (APIs, structured outputs, context engineering) | Refactor Project 1 |
| 5 | Layer 4.3 (RAG, properly) | Project 2 |
| 6 | Layer 5 (evals + observability) | Project 3 |
| 7 | Layer 4.4 (agents + MCP) | Project 4 |
| 8 | Layers 6–7 (fine-tuning, distillation, serving) | Project 5 |
| 9 | Layers 8–9 (production, safety) + specialisation + applications | Project 6 + CV/portfolio |

Run interview prep in parallel from month 5: LeetCode-easy/medium in Python, ML fundamentals, system design for AI systems (design a RAG service, design an agent platform), and be ready to defend every technical decision in your projects.

---

# Core resources

**Courses / structured**
- Karpathy — *Neural Networks: Zero to Hero* (free, essential)
- Hugging Face — NLP Course, Deep RL Course, Agents Course (free)
- fast.ai — *Practical Deep Learning for Coders*
- DeepLearning.AI short courses — quick, current, free
- Full Stack Deep Learning / LLM Bootcamp materials

**Books**
- *Hands-On Machine Learning* — Géron
- *Deep Learning with PyTorch* — Stevens et al.
- *Designing Machine Learning Systems* — Chip Huyen
- *AI Engineering* — Chip Huyen (the closest thing to a textbook for this exact role)
- *Build a Large Language Model (From Scratch)* — Sebastian Raschka

**Staying current (matters more here than in any other field)**
- Anthropic and OpenAI engineering blogs; LangChain blog and their State of Agent Engineering survey
- Sebastian Raschka's *Ahead of AI*, Chip Huyen's blog, Simon Willison's blog
- Papers: read abstracts widely, read 1–2 properly per month
- LMArena and MTEB leaderboards for model/embedding selection

---

# Ten things people get wrong

1. Spending six months on maths before writing any code. Learn maths *as needed*, driven by what you're building.
2. Tutorial-hopping. Build, break, debug, deploy. Nothing else compounds.
3. Skipping software engineering. AI engineering is 70% software engineering.
4. Building agents for everything. Most tasks are one call with a schema.
5. Ignoring evals. This is the #1 gap in the market and your biggest opportunity.
6. Chasing every new framework. Pick one, go deep, then read the others' docs in an afternoon.
7. Fine-tuning before prompting and RAG are exhausted. Almost always wrong.
8. Ignoring cost and latency. In 2026 these are product requirements, not afterthoughts.
9. Naive RAG. Hybrid + rerank is the floor, not the ceiling.
10. Ten shallow portfolio projects instead of three deep, deployed, measured ones.

---

*Compiled July 2026. This field moves fast — re-check specific tool and model recommendations quarterly. The layer structure and the fundamentals will hold; the tool names won't.*

**Sources for market and tooling claims:** PwC 2026 AI Jobs Barometer; ITJobsWatch (to 1 June 2026); Indeed Hiring Lab; LangChain *State of Agent Engineering*; framework and RAG practitioner surveys, mid-2026.
