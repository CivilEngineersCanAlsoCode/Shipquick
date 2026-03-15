# BMAD Deep Architectural Audit

**Auditor:** Sentinel (flex-sentinel)
**Date:** 2026-03-15
**Scope:** BMAD v6.0.4 method, LinkRight _lr/ extensions, SMA gap analysis

---

## 1. BMAD Architecture

### 1.1 Directory Structure (with WHY for each)

```
_bmad/
├── _config/      # WHY: Centralized discovery layer. Runtime manifest loading
│                 #   without pre-loading every agent/workflow into context.
├── _memory/      # WHY: Cross-session persona persistence. Sidecars hold
│                 #   accumulated domain knowledge that survives context resets.
├── core/         # WHY: Foundation layer. Generalist orchestrator + shared
│                 #   utilities (editorial review, adversarial review) all
│                 #   modules can invoke. Priority 0.
├── bmm/          # WHY: Primary product lifecycle. End-to-end from ideation
│                 #   through implementation. 9 agents, 5 workflow phases.
├── bmb/          # WHY: Self-hosting meta-module. BMAD builds BMAD. Encodes
│                 #   all conventions as reference data so builder agents
│                 #   follow them correctly. External package.
├── cis/          # WHY: Demonstrates module extensibility. Creative tools
│                 #   installable alongside BMM without polluting it.
├── gds/          # WHY: Clean parallel to BMM for game dev. Domain-specific
│                 #   terminology/personas without cross-contamination.
└── tea/          # WHY: Testing expertise is deep enough for 40+ knowledge
                  #   fragments and its own specialist agent. Embedding in
                  #   BMM would create an unwieldy monolith.
```

**Design philosophy:** Module independence + global registry. Each module has its own `config.yaml`, agents, workflows, and knowledge. The global `_config/` holds flat CSVs aggregating everything. Modules can be added/removed without breaking siblings, while still enabling cross-module discovery (Party Mode, bmad-help).

### 1.2 Agent Patterns

Every agent is a `.md` file with YAML frontmatter + XML `<agent>` block:

```xml
<agent id="..." name="PersonaName" title="Role Title" icon="..." hasSidecar="true|false">
  <activation critical="MANDATORY">
    <step n="1">Load persona from current file</step>
    <step n="2">Load {project-root}/_bmad/{module}/config.yaml IMMEDIATELY</step>
    <step n="3">If hasSidecar: load _memory/{agent}-sidecar/</step>
    <step n="4">Greet user, show menu</step>
    <step n="5">STOP and WAIT for user input</step>
  </activation>
  <persona>
    <role/> <identity/> <communication_style/> <principles/>
  </persona>
  <menu>
    <item cmd="DS" workflow="path/to/workflow.yaml">[DS] Dev Story</item>
  </menu>
</agent>
```

**WHY this structure:**

- **XML-in-Markdown:** Gives precise parsing semantics for handler routing by file extension type (`.yaml` -> initialize_workflow, `.md` -> load_system_prompt, `.csv` -> load_reference_data).
- **Mandatory activation sequence:** Without explicit "STOP and WAIT" directives, LLMs rush through all steps autonomously. The 5-step sequence forces persona loading before any user interaction.
- **Fuzzy command matching:** Every menu item has both a code (`DS`) and a fuzzy phrase (`dev-story`). Accepts numbers, exact codes, or partial phrase matches — reduces user friction.
- **`.customize.yaml` files:** Empty override scaffolding in `_config/agents/`. Allows users to override persona, add memories, extend menus without modifying base agent files. Separation of concerns.

**Sidecar agents** (Storyteller, Tech Writer): `hasSidecar: true` flag with `_memory/{agent}-sidecar/` containing `memories.md`, `instructions.md`, and domain-specific files. Critical actions instruct the agent to load these on activation, enabling cross-session memory.

### 1.3 Workflow Patterns

#### Tri-Modal Structure (Create / Edit / Validate)

```
workflow-name/
├── workflow.yaml        # Machine config: inputs, validation ref, template ref
├── workflow.md          # Human guide: entry point + mode router
├── data/                # SHARED reference standards (prevents doc drift)
├── steps-c/             # Create mode: full execution path
│   ├── step-01-init.md
│   ├── step-01b-continue.md   # Resume interrupted workflow
│   ├── step-02-*.md ... step-N-complete.md
├── steps-e/             # Edit mode: apply user feedback
│   ├── step-01-assess.md
│   └── step-02-apply-edit.md
├── steps-v/             # Validate mode: quality gates
│   └── step-01-validate.md
├── templates/           # Output document templates
└── checklist.md         # Validation criteria
```

**WHY tri-modal:** Any workflow that creates a document needs corresponding edit and validate modes. The three modes are self-contained (no shared step files between them) but share `data/` (preventing documentation drift). This is the "quality triangle" pattern.

**WHY step files are micro-sized (< 200 lines):**

1. **Context window management:** LLM loads only the current step, never all instructions simultaneously.
2. **Resumability:** `stepsCompleted[]` in output frontmatter records progress. `step-01b` uses this to restore exact position.
3. **Testability:** Atomic steps can be individually validated and replaced.

#### Step File Anatomy (Strict Schema)

```markdown
---
name: 'step-N-name'
description: 'what it does'
nextStepFile: './step-N+1.md'
outputFile: '{planning_artifacts}/doc.md'
---

# Step N: Name

## STEP GOAL: [Single sentence]

## MANDATORY EXECUTION RULES (READ FIRST):
### Universal Rules:
- NEVER generate content without user input
- YOU ARE A FACILITATOR, not a content generator

### Step-Specific Rules: [...]

## EXECUTION PROTOCOLS: [...]

## Sequence of Instructions: [1-N actions]

### N. Present MENU OPTIONS [A/P/C]
- C: Save, update frontmatter, load nextStepFile
- A: Advanced elicitation, redisplay menu
- P: Party mode, redisplay menu

## SYSTEM SUCCESS/FAILURE METRICS:
Master Rule: Skipping steps FORBIDDEN.
```

**WHY "facilitator, not content generator":** Core interaction model — LLM guides structured discovery, user brings domain expertise. Together they produce better artifacts than either alone.

#### Resume/Continue Pattern (step-01b)

**Problem:** Complex workflows (11+ steps) span multiple sessions. Without resume, users must restart from scratch.

**Solution:** Output documents track their own creation state in YAML frontmatter:

```yaml
stepsCompleted: ['step-01-init.md', 'step-02-discovery.md']
lastStep: 'step-02-discovery.md'
lastContinued: '2025-01-02'
inputDocuments: ['path/to/brief.md']
```

Step-01 detects existing output with `stepsCompleted`. Routes to step-01b, which:
1. Reads output frontmatter
2. Parses `stepsCompleted` array
3. Extracts `nextStepFile` from last completed step
4. Reloads tracked `inputDocuments`
5. Shows "Welcome back" progress dashboard
6. Routes to exact next incomplete step

**Two variants:** BMM uses `stepsCompleted` array; TEA uses `lastStep` with explicit routing table.

**WHY frontmatter-as-state-machine:** Documents become self-describing and resumable without external state storage. No database needed.

### 1.4 Manifest System

| File | Purpose | WHY |
|---|---|---|
| `manifest.yaml` | System identity: modules, versions, install dates, sources | Package lockfile for BMAD. Tracks what's installed and from where. |
| `agent-manifest.csv` | 29 agents across all modules with capabilities, roles, paths | Runtime discovery. Party Mode and bmad-help read this CSV to find agents without pre-loading them. |
| `workflow-manifest.csv` | 75+ workflows with module, path, description | Same lazy-load discovery for workflows. |
| `bmad-help.csv` | Phase-aware navigation: module, phase, sequence, required flag, outputs | Drives the "what to do next" advisor. `required: true` enforces dependency chains. |
| `task-manifest.csv` | Standalone tasks: editorial review, shard-doc, etc. | Tasks are cross-cutting — any agent can invoke them. |
| `tool-manifest.csv` | Reserved for tool extensions | Future extensibility. |
| `files-manifest.csv` | Full file inventory | Integrity verification. |

**WHY flat CSVs:** Progressive disclosure. CSVs are cheap to load (small context footprint) and give the LLM enough info to decide whether to load the full agent/workflow file. The alternative — loading every `.md` file at startup — would exhaust the context window.

### 1.5 IDE Configs

19 IDE YAML files in `_config/ides/`: antigravity, auggie, claude-code, cline, codebuddy, codex, crush, cursor, gemini, github-copilot, iflow, kilo, kiro, opencode, qwen, roo, rovo-dev, trae, windsurf.

**WHY 19 configs:** BMAD is IDE-agnostic by design. Each AI coding tool handles agent system prompts differently — `.roomodes`, `.cursorrules`, `CLAUDE.md`, etc. The installer generates integration files per IDE. These YAML files are **post-installation receipts** confirming configuration is done (`_noConfigNeeded: true`).

**Design rationale:** Single agent/workflow definition format + installer handles IDE-specific deployment. 19 configs, one codebase.

### 1.6 v6 vs Legacy

| Aspect | Legacy (pre-v6) | v6 |
|---|---|---|
| Module system | Monolithic `core` + optional `tea` | Independent modules with global CSV registry |
| Source | All built-in | `core`/`bmm` built-in; `bmb`/`cis`/`gds`/`tea` external (npm) |
| Workflows | Single file or flat list | Tri-modal directories (steps-c/e/v) with micro-steps |
| Agent format | Markdown persona only | XML-in-Markdown with typed activation, handler routing |
| Discovery | Pre-loaded | Lazy via CSVs (agent-manifest, workflow-manifest, bmad-help) |
| IDE support | Single IDE | 19 IDEs via installer + config receipts |
| Knowledge | Inline in agents | Indexed fragments with tiered loading (core/extended/specialized) |
| Resume | Not built-in | Universal step-01b with frontmatter state tracking |
| Self-hosting | Manual | BMB meta-module builds new agents/workflows/modules |

**Key v6 design decisions:**

- **Subprocess optimization:** 4 explicit patterns (Grep/Regex 1000:1, Per-file 10:1, Data ops 100:1, Parallel). Every validation step includes "DO NOT BE LAZY" directives for parallel subprocess launch, plus graceful fallback for LLMs without subprocess support.
- **Intent vs prescriptive spectrum:** Most workflows are intent-based (goal + trust LLM to adapt). Only regulated/compliance workflows use prescriptive scripted dialogue. Maximizes LLM adaptability.
- **TEA knowledge tiering:** 40+ fragments indexed by `tea-index.csv` with `tier: core/extended/specialized`. Agent loads only relevant 2-5 fragments per task instead of all 40+.

---

## 2. LinkRight Additions

### 2.1 Memory Sidecars

**BMAD base:** Only 2 agents have sidecars (tech-writer, storyteller). `_memory/` exists but is minimal.

**LR extension:** Every agent (29 of 31) gets a `_memory/{agent}-sidecar/` with:
- `memories.md` — accumulated domain knowledge and milestones
- `instructions.md` — persistent operating protocol
- Optional typed data (e.g., `core-signals.json`)

**Governed by `_memory/config.yaml`:**
```yaml
layers:
  - id: "sidecar-core"
    type: "json"
    persist: true
    ttl: null           # permanent
  - id: "sidecar-insights"
    type: "markdown"
    persist: true
    ttl: "90d"          # expires
vector_settings:
  collection: "lr-signals"
  distance_metric: "cosine"
  dimensions: 1536
```

Plus `_config/custom/persistent-memories.yaml` defining module-level retention: `core/lrb` = permanent, `sync` = project-cycle, `flex` = campaign-cycle.

**WHY LR needs this but base BMAD doesn't:** Career signal processing is stateful across weeks/months. The agent needs to remember past extractions, user-specific vocabulary, and historical alignment scores. Without sidecars, every session starts cold and asks the user to repeat themselves.

### 2.2 Module System

LR has 7 modules vs BMAD's 6, each branded away from BMAD ("Zero BMAD identity"):

| Module | Priority | Purpose | BMAD Equivalent |
|---|---|---|---|
| core | 0 | Governance, orchestration | core |
| sync | 1 | Signal processing, resume optimization | None (domain-specific) |
| flex | 2 | Social brand, viral amplification | None (domain-specific) |
| squick | 3 | Enterprise rapid delivery | bmm |
| lrb | 0 | Meta-programming, self-evolution | bmb |
| cis | 4 | Narrative craft | cis |
| tea | 5 | Test engineering | tea |

**Key structural additions over BMAD:**

- **`files-manifest.csv` with SHA256 hashes** — integrity ledger for all 170+ files. BMAD has no file integrity checking.
- **`docs/adrs/`** — 5 formal Architecture Decision Records documenting deviation rationale. BMAD has no ADR system.
- **Explicit state machine** (`agent-state-machine.md`) with conditional branching (low score -> inquisitor loop -> retry). BMAD state is implicit.
- **Zero Local Handoff rule** — no temp files between agents, always through shared data layer (MongoDB/ChromaDB/Beads).

### 2.3 Commands

LR has no dedicated `commands/` directory. Instead:

- `_config/lr-help.csv` — global commands
- `{module}/module-help.csv` — module-level commands
- `lrb/scripts/install-stubs.sh` — generates 760+ command stubs across 33 IDEs x (agents + workflows)

**Multi-IDE portability layer:** Each of 20 `_config/ides/` YAML files declares:
```yaml
name: antigravity
startup:
  load: [lr-config.yaml, manifest.yaml]
  agent: lr-orchestrator
  greeting: "Linkright ready. Type [M] for menu."
```

Combined with stub generation, any of 31 agents or 28 workflows is accessible from any supported IDE.

### 2.4 Sync as Gold Standard

The `jd-optimize` workflow is LR's most sophisticated artifact: 64 steps in `steps-c/`, organized into named phases:

| Phase | Steps | Focus |
|---|---|---|
| Bootstrap | 01, 01b | Session load, resume if interrupted |
| A | 03-06 | Keyword extraction, competitive moat, adversarial review |
| B | 08-10 | Persona scoring (abbreviated) |
| B-Extended | 41-43 | Full persona scoring: init, weight, validate |
| E | 44-47 | Signal query, extraction, ranking, validation |
| F | 48-49 | Baseline scoring, gap identification |
| G | 50 | Gap categorization (fillable/positioning/compensation/negotiation/dealbreaker) |
| H | 51 | Inquisitor question generation |
| I-J | 52-53 | Narrative structure, bullet drafting |
| K-L | 54-55 | Layout check, styling |
| M | 56-64 | Final scoring, enrichment, portfolio assembly, delivery prep |

**Reference YAML patterns** in `data/reference/` (13 files):
- `ats-keyword-weights.yaml` — p0_exact: 1.0, p1_synonym: 0.7, p2_contextual: 0.4
- `branded-vocabulary.yaml` — curated action verbs + impact modifiers
- `seniority-markers.yaml` — vocabulary clusters per level
- `jd-ontology.yaml` — tech stack + metrics extraction schema
- Also: compensation-bands, cultural-tokens, follow-up-cadence, industry-signals, interview-patterns, metric-patterns, networking-hooks, resume-formatting, role-taxonomy

**WHY 64 steps:** Career optimization is a multi-dimensional, high-stakes process. Each step is a single responsibility (extract signals -> score alignment -> identify gaps -> generate questions -> draft content -> validate layout -> assemble portfolio). Breaking this into 64 atomic steps means:
1. Context window is never overwhelmed
2. Any step can be individually improved without regression
3. Resume-from-interruption works at fine granularity
4. Quality gates can inspect each step's output independently

**The 10-agent pipeline:** sync-parser (ingest) -> sync-scout (research) -> sync-linker (alignment) -> sync-inquisitor (gap-fill) -> sync-refiner (polish) -> sync-sizer (layout) -> sync-styler (design) -> sync-publicist (outreach) -> sync-narrator (memory) -> sync-tracker (success). The state machine has conditional loops (low alignment score -> inquisitor -> retry linking).

---

## 3. Patterns SMA Should Adopt

### 3.1 From BMAD (missing in SMA)

| Pattern | What's Missing | Impact | Effort |
|---|---|---|---|
| **`data/reference/` per workflow** | `workflow.yaml` files reference `data/reference/briefs.yaml`, `scoring-config.yaml`, etc. but directories don't exist | HIGH — workflows reference phantom files | Medium |
| **`manifest.yaml` (system identity)** | No system-level manifest with module version, install date, source tracking | Medium — no version governance | Low |
| **`task-manifest.csv`** | No standalone task registry (editorial review, adversarial review, etc.) | Low — SMA doesn't have standalone tasks yet | Low |
| **`files-manifest.csv`** | No file integrity ledger | Low — useful for QA but not blocking | Low |
| **`_memory/config.yaml`** | No memory governance config (TTL, retention policies, vector settings) | Medium — sidecars exist but ungoverned | Low |
| **Knowledge indexing (TEA pattern)** | No indexed knowledge fragments with tiered loading | Medium — frameworks/ exists but no index for selective loading | Medium |
| **Subprocess optimization directives** | Step files don't include explicit subprocess patterns or fallback | Low — current steps are short enough | Low |

### 3.2 From LR (missing in SMA)

| Pattern | What's Missing | Impact | Effort |
|---|---|---|---|
| **Populated sidecar files** | All 14 files (7 agents x instructions.md + memories.md) are empty placeholders | HIGH — cross-session memory is non-functional | Medium |
| **`_config/` subdirectory** | Manifests at project root instead of `_config/` | Low — organizational, not functional | Low |
| **State machine documentation** | No explicit state machine for the A->B->F->C->D->E pipeline | Medium — implicit in CONTEXT.md but not formalized | Medium |
| **Reference YAML per workflow** | No domain-specific reference data (scoring weights, vocabulary, platform rules) | HIGH — workflows lack grounding data | High |
| **ADRs** | No formal Architecture Decision Records | Low — CONTEXT.md partially covers this | Low |
| **Module-level retention policies** | No `persistent-memories.yaml` defining when memories expire | Low — sidecars are empty anyway | Low |
| **Multi-IDE stub generation** | No `install-stubs.sh` equivalent | Low — SMA is Claude Code only currently | Low |
| **`module-help.csv` consistency** | Stale agent IDs (`flex-content-strategist` etc.) don't match actual agent-manifest.csv entries | Medium — confusing for help system | Low |

### 3.3 SMA Innovations (keep these)

| Pattern | What SMA Does | Why It's Good |
|---|---|---|
| **CONTEXT.md** | Single comprehensive governance doc with 16 rules, full pipeline, webhooks, schemas, paths | More self-contained than BMAD's distributed manifest approach. One file tells an agent everything it needs. |
| **Central `validation/` directory** | QA reports in one place, not scattered per-workflow | Easier to audit and compare across workflows. |
| **`frameworks/` directory** | 11 framework CSV/XML files for scoring, content rules, platform specs | Domain knowledge at project level, not buried in workflow `data/`. More reusable. |
| **ChatGPT integration** | `chatgpt/` with system-prompt + knowledge files + OpenAPI schema | Multi-platform distribution (not just IDE agents). |
| **Paired QA agents** | 3 dedicated QA agents (Lens, Grid, Sentinel) paired to workflow groups | More granular than BMAD's single QA agent. Each QA agent specializes. |
| **Pipeline-as-status-flow** | A->B->F->C->D->E with explicit status transitions (Draft->Reviewed->Published) | Clearer than BMAD's phase numbering for content workflows. |
| **Webhook mapping in workflow.md** | Each workflow.md includes webhook table with method, step, and purpose | Explicit integration surface. BMAD workflows don't track external integrations. |
| **`plans/` directory** | Pipeline implementation plans at project level | Separates planning from execution artifacts. |

---

## 4. Recommendations

Priority-ordered by impact and effort:

### P0 — Critical (fix now)

1. **Create `data/reference/` files for each workflow.** `workflow.yaml` files already reference `briefs.yaml`, `scoring-config.yaml`, `experiences.yaml`, etc. These phantom references mean workflows operate without grounding data. Create the actual YAML files with SMA-specific domain data:
   - Scoring weights (engagement, reach, conversion formulas)
   - Platform rules (LinkedIn character limits, hashtag limits, formatting constraints)
   - Content vocabulary (branded terms, prohibited terms)
   - Scheduling patterns (optimal post times, frequency caps)

2. **Populate sidecar `instructions.md` files.** Each agent's instructions.md should contain persistent operating protocols — what the agent has learned, standard procedures, edge cases. Without these, the `hasSidecar=true` flag in agent definitions is a lie; activation step 3 loads empty files.

3. **Fix `module-help.csv` inconsistency.** Replace stale agent IDs (`flex-content-strategist`, `flex-formatter`, `flex-reviewer`) with actual IDs from `agent-manifest.csv` (`flex-ideator`, `flex-crafter`, `flex-publisher`). One CSV, correct names.

### P1 — High (next sprint)

4. **Add `_memory/config.yaml`.** Define retention policies: which sidecar data persists permanently vs expires after a campaign cycle. Model after LR's layered approach (permanent core instructions, 90-day insights).

5. **Formalize the state machine.** Create `docs/pipeline-state-machine.md` documenting A->B->F->C->D->E with:
   - Entry/exit conditions per state
   - Error states and recovery paths
   - Conditional loops (e.g., C rejects -> back to B for rework)
   - This is partially in CONTEXT.md but deserves a dedicated, formal document.

6. **Create `frameworks/index.csv`.** Index the 11 framework files with `id, name, description, tags, used_by_workflows`. Mirrors TEA's `tea-index.csv` pattern — allows agents to selectively load only relevant frameworks instead of guessing.

7. **Add missing plans (C, D, F).** `plans/` has A, B, E only. Complete the set for content-review (C), content-publishing (D), and content-formatting (F).

### P2 — Medium (backlog)

8. **Add `manifest.yaml` (system identity).** Track SMA version, install date, module source, configured IDEs. Low effort, high governance value.

9. **Start populating `memories.md` files.** As agents execute workflows, capture learned patterns: "LinkedIn posts with 3 hashtags outperform 5+", "User prefers data-driven hooks over storytelling". This is the long-term memory that makes agents improve over time.

10. **Create ADR for key decisions.** Document: (a) why 3 paired QA agents instead of 1, (b) why A->B->F->C->D->E ordering instead of alphabetical, (c) why ChatGPT integration alongside Claude agents. Future maintainers will thank you.

11. **Add `files-manifest.csv` with SHA256 hashes.** Enables integrity verification during QA sweeps. Low effort (one `sha256sum` run), useful for detecting accidental file corruption.

### P3 — Low (nice to have)

12. **Consider a `steps/` shared directory** alongside `steps-c/` for cross-cutting steps (load-session-context, resume-if-interrupted). Currently `step-01-load-session-context.md` and `step-01b-resume-if-interrupted.md` are duplicated in every workflow's `steps-c/`. A shared `steps/` directory would be DRY.

13. **Add subprocess optimization directives** to validation steps. Not critical at current scale (steps are short), but would future-proof for when step complexity grows.

14. **Explore tiered knowledge loading** for `frameworks/`. If the framework count grows beyond 15-20, agents will need selective loading. Pre-build the index now (see P1.6) so the pattern is ready.

---

## Appendix A: Key File Paths

### BMAD Reference
- Global manifest: `_bmad/_config/manifest.yaml`
- Agent registry: `_bmad/_config/agent-manifest.csv`
- Workflow registry: `_bmad/_config/workflow-manifest.csv`
- Help navigation: `_bmad/_config/bmad-help.csv`
- Step file rules: `_bmad/bmb/workflows/workflow/data/step-file-rules.md`
- Tri-modal structure: `_bmad/bmb/workflows/workflow/data/trimodal-workflow-structure.md`
- Agent architecture: `_bmad/bmb/workflows/agent/data/agent-architecture.md`
- Subprocess patterns: `_bmad/bmb/workflows/workflow/data/subprocess-optimization-patterns.md`
- TEA knowledge index: `_bmad/tea/testarch/tea-index.csv`
- Resume pattern: `_bmad/bmm/workflows/2-plan-workflows/create-prd/steps-c/step-01b-continue.md`

### LinkRight Reference
- System config: `_lr/lr-config.yaml`
- Memory governance: `_lr/_memory/config.yaml`
- Retention policies: `_lr/_config/custom/persistent-memories.yaml`
- Signal taxonomy: `_lr/core/knowledge/signal-taxonomy.json`
- State machine: `_lr/lrb/workflows/agent/agent-state-machine.md`
- Handoff protocol: `_lr/lrb/workflows/agent/agent-handoff-protocol.md`
- Gold standard workflow: `_lr/sync/workflows/jd-optimize/workflow.md`
- JD reference YAMLs: `_lr/sync/workflows/jd-optimize/data/reference/`

### SMA Current
- Governance: `social-media-agency/CONTEXT.md`
- Config: `social-media-agency/config.yaml`
- Agents: `social-media-agency/agents/`
- Workflows: `social-media-agency/workflows/`
- Frameworks: `social-media-agency/frameworks/`
- Sidecars: `social-media-agency/_memory/`
- Validation: `social-media-agency/validation/`

## Appendix B: Pattern Comparison Matrix

| Pattern | BMAD | LinkRight | SMA | SMA Status |
|---|---|---|---|---|
| XML agent activation | Yes | Yes | Yes | Complete |
| Tri-modal CEV workflows | Yes | Yes | Yes | Complete |
| step-01b resume | Yes | Yes (Beads-backed) | Yes | Complete |
| Manifest CSVs | 7 types | 7 types | 2 types | Partial |
| Memory sidecars | 2 agents | 29 agents | 7 agents (empty) | Scaffolded |
| Memory governance | None | config.yaml + policies | None | Missing |
| Reference data per workflow | data/ dirs | data/reference/ YAMLs | Referenced but missing | Gap |
| Knowledge indexing | TEA tea-index.csv | signal-taxonomy.json | frameworks/ (no index) | Partial |
| State machine docs | Implicit | Explicit .md | Implicit in CONTEXT.md | Partial |
| IDE configs | 19 | 20 + 760 stubs | None (single IDE) | N/A |
| ADRs | None | 5 ADRs | None | Missing |
| File integrity | None | SHA256 manifest | None | Missing |
| Subprocess directives | Explicit in BMB | Inherited | None | Missing |
| Checklist per workflow | Yes | Yes | Yes | Complete |
| Templates per workflow | Yes (multi) | Yes | Yes (1 each) | Complete |
| Central QA reports | No (per-workflow) | No | Yes (validation/) | SMA innovation |
| CONTEXT.md governance | No | Partial | Yes (comprehensive) | SMA innovation |
| Paired QA agents | 1 QA agent | 3 TEA agents | 3 paired QA agents | SMA innovation |
| ChatGPT distribution | No | No | Yes | SMA innovation |
| Webhook mapping | No | No | Yes (per workflow) | SMA innovation |
