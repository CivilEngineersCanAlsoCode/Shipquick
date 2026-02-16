# SHIPQUICK 4.0 — UNIFIED IMPLEMENTATION BLUEPRINT

> **Status:** WAVE 6 IN PROGRESS — Recovery Phase
> **Date:** 2026-02-17
> **Goal:** Merge BMM (discovery rigor) + SQ (SAFe compliance) + Beads (persistent state) into one end-to-end system

---

## TABLE OF CONTENTS

1. [Design Principles](#1-design-principles)
2. [Unified Numbering Convention](#2-unified-numbering-convention)
3. [Complete Command Registry](#3-complete-command-registry)
4. [Workflow Architecture Standard](#4-workflow-architecture-standard)
5. [Beads Integration Standard](#5-beads-integration-standard)
6. [Quality Gate System](#6-quality-gate-system)
7. [Memory System](#7-memory-system)
8. [Data-Driven Intelligence](#8-data-driven-intelligence)
9. [Checklist System](#9-checklist-system)
10. [Physical File Changes](#10-physical-file-changes)
11. [Config Changes](#11-config-changes)
12. [Migration Execution Plan](#12-migration-execution-plan)
13. [What Changes Summary](#13-what-changes-summary)

---

## 1. DESIGN PRINCIPLES

### Why Unify?

| System  | Strength                                                                                                                             | Weakness                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| **BMM** | Discovery rigor: 12-step PRD, trimodal (Create/Edit/Validate), continuation, checklists (26-item DoD), data CSVs, memory (Gemini.md) | No SAFe hierarchy, no WSJF, flat epics, no Beads                                                     |
| **SQ**  | SAFe compliance: Theme->Epic->Capability->Feature->Story, WSJF at every level, Gherkin ACs, enterprise export                        | Loose enforcement, no continuation, no checklists, no memory, no edit/validate modes, Beads optional |

### Unified System Must Have

1. **BMM's rigor** — trimodal, continuation, checklists, data CSVs, memory
2. **SQ's SAFe structure** — full hierarchy, WSJF, Gherkin ACs, parent-child linking
3. **Beads as backbone** — mandatory persistent state, not optional
4. **Hard quality gates** — prerequisites enforced, not just warned
5. **Clean naming** — verb-first, no cryptic abbreviations, phase-grouped numbering

---

## 2. UNIFIED NUMBERING CONVENTION

### Principles

- **Phase-based grouping** by 10s (000s, 010s, 020s, 030s, 040s, 050s, 060s, 070s)
- **Room to grow** — gaps between numbers for future workflows
- **Clean command names** — `/030-create-theme-and-epic` (no `sq-`, no `bmad-bmm-`)
- **Consistent verb-first** — create, validate, edit, audit, export, run, review

### Phase Map

```
Phase 0 (000s)     Phase 1 (010s)      Phase 2 (020s)       Phase 3 (030s)
DISCOVER       -->  DEFINE         -->  ARCHITECT       -->  STRATEGIZE
(Research)          (Product)           (Technical)          (SAFe Portfolio)

Phase 4 (040s)     Phase 5 (050s)      Phase 6 (060s)       Phase 7 (070s)
DECOMPOSE      -->  EXECUTE        -->  GOVERN          -->  TEST
(SAFe Backlog)      (Sprint)            (Audit/Export)       (Test Architecture)
```

---

## 3. COMPLETE COMMAND REGISTRY

### Phase 0 — DISCOVER (000 series)

| #   | Command (as shown after /) | Agent             | Bundle                |
| --- | -------------------------- | ----------------- | --------------------- |
| 001 | `brainstorming`            | Orchestrator      | 00-bmad-orchestrator  |
| 002 | `market-research`          | Portfolio (Mary)  | 01-portfolio-solution |
| 003 | `domain-research`          | Portfolio (Mary)  | 01-portfolio-solution |
| 004 | `technical-research`       | Architect (Anika) | 03-system-architect   |

### Phase 1 — DEFINE (010 series)

| #   | Command (as shown after /) | Agent               | Bundle             |
| --- | -------------------------- | ------------------- | ------------------ |
| 010 | `create-product-brief`     | Product Manager     | 02-product-manager |
| 011 | `create-prd`               | Product Manager     | 02-product-manager |
| 012 | `validate-prd`             | Product Manager     | 02-product-manager |
| 013 | `edit-prd`                 | Product Manager     | 02-product-manager |
| 014 | `create-ux-design`         | UX Designer (Sally) | 04d-ux-designer    |
| 015 | `create-personas`          | UX Designer (Sally) | 04d-ux-designer    |

### Phase 2 — ARCHITECT (020 series)

| #   | Command (as shown after /) | Agent                    | Bundle              |
| --- | -------------------------- | ------------------------ | ------------------- |
| 020 | `create-architecture`      | System Architect (Anika) | 03-system-architect |
| 021 | `check-readiness`          | System Architect (Anika) | 03-system-architect |
| 022 | `generate-project-context` | System Architect         | 03-system-architect |
| 023 | `document-project`         | Tech Writer (Paige)      | 03-system-architect |

### Phase 3 — STRATEGIZE (030 series) — SAFe Portfolio

| #   | Command (as shown after /) | Old Name          | Agent               | Bundle                |
| --- | -------------------------- | ----------------- | ------------------- | --------------------- |
| 030 | `create-theme-and-epic`    | sq-init           | Vision Lead (Priya) | 01-portfolio-solution |
| 031 | `create-business-case`     | sq-analyze        | Vision Lead (Priya) | 01-portfolio-solution |
| 032 | `run-pi-planning`          | pi_planning       | Portfolio           | 01-portfolio-solution |
| 033 | `run-inspect-and-adapt`    | inspect_and_adapt | Portfolio           | 01-portfolio-solution |

### Phase 4 — DECOMPOSE (040 series) — SAFe Backlog

| #   | Command (as shown after /) | Old Name | Agent                | Bundle                |
| --- | -------------------------- | -------- | -------------------- | --------------------- |
| 040 | `create-capabilities`      | sq-solve | Vision Lead (Priya)  | 01-portfolio-solution |
| 041 | `create-features`          | sq-plan  | Product Manager      | 02-product-manager    |
| 042 | `create-stories`           | sq-exec  | Execution Lead (Dev) | 04c-dev-squad         |

### Phase 5 — EXECUTE (050 series) — Sprint

| #   | Command (as shown after /) | Agent               | Bundle            |
| --- | -------------------------- | ------------------- | ----------------- |
| 050 | `sprint-planning`          | Scrum Master + PO   | 04b-scrum-master  |
| 051 | `daily-standup`            | Scrum Master        | 04b-scrum-master  |
| 052 | `create-story`             | Product Owner       | 04a-product-owner |
| 053 | `dev-story`                | Dev Squad           | 04c-dev-squad     |
| 054 | `code-review`              | Dev Squad           | 04c-dev-squad     |
| 055 | `quick-dev`                | Dev Squad           | 04c-dev-squad     |
| 056 | `quick-spec`               | Dev Squad           | 04c-dev-squad     |
| 057 | `retrospective`            | Scrum Master        | 04b-scrum-master  |
| 058 | `correct-course`           | Scrum Master        | 04b-scrum-master  |
| 059 | `design-handoff`           | UX Designer (Sally) | 04d-ux-designer   |

### Phase 6 — GOVERN (060 series) — Quality Gates

| #   | Command (as shown after /) | Old Name          | Agent               | Bundle                |
| --- | -------------------------- | ----------------- | ------------------- | --------------------- |
| 060 | `audit-hierarchy`          | sq-audit          | Governance (Raj)    | 01-portfolio-solution |
| 061 | `export-csv`               | sq-export         | Governance (Raj)    | 00-bmad-orchestrator  |
| 062 | `usability-testing`        | usability_testing | UX Designer (Sally) | 04d-ux-designer       |

### Phase 7 — TEST (070 series) — Test Architecture

| #   | Command (as shown after /) | Agent       | Bundle            |
| --- | -------------------------- | ----------- | ----------------- |
| 070 | `qa-automate`              | Murat (TEA) | 05-test-architect |
| 071 | `test-framework`           | Murat       | 05-test-architect |
| 072 | `test-design`              | Murat       | 05-test-architect |
| 073 | `test-atdd`                | Murat       | 05-test-architect |
| 074 | `test-automate`            | Murat       | 05-test-architect |
| 075 | `test-ci`                  | Murat       | 05-test-architect |
| 076 | `test-nfr`                 | Murat       | 05-test-architect |
| 077 | `test-review`              | Murat       | 05-test-architect |
| 078 | `test-trace`               | Murat       | 05-test-architect |
| 079 | `teach-me-testing`         | Murat       | 05-test-architect |

### Phase 8 — AGENTS (080 series) — Persona Activations

| #   | Command (as shown after /) |
| --- | -------------------------- |
| 080 | `agent-bmad-master`        |
| 081 | `agent-analyst`            |
| 082 | `agent-tech-writer`        |
| 083 | `agent-ux-designer`        |
| 084 | `agent-tea`                |

### Phase 9 — META (090 series) — Utilities

| #   | Command (as shown after /)   |
| --- | ---------------------------- |
| 090 | `help`                       |
| 091 | `party-mode`                 |
| 092 | `editorial-review-prose`     |
| 093 | `editorial-review-structure` |
| 094 | `review-adversarial`         |
| 095 | `index-docs`                 |
| 096 | `shard-doc`                  |
| 097 | `learn-from-mistakes`        |

### KILLED (Old Commands Removed)

| Old # | Old Name                          | Reason                                                                     |
| ----- | --------------------------------- | -------------------------------------------------------------------------- |
| 013   | bmad-bmm-create-epics-and-stories | Replaced by 040+041+042 (SAFe decomposition with WSJF, hierarchy, Gherkin) |
| 017   | bmad-bmm-sprint-planning          | Duplicate — merged into 050                                                |
| 018   | bmad-bmm-sprint-status            | Duplicate — merged into 051 daily-standup                                  |

---

## 4. WORKFLOW ARCHITECTURE STANDARD

Every workflow in the unified system MUST follow this standard.

### 4A. Mandatory File Structure Per Workflow

```
_bmad/bmm/workflows/{phase}/{workflow-name}/
├── workflow.md                    # Header: config, routing, rules
├── steps-c/                       # CREATE mode steps
│   ├── step-01-{name}.md
│   ├── step-01b-continue.md       # Continuation handler (MANDATORY)
│   ├── step-02-{name}.md
│   └── step-XX-complete.md
├── steps-e/                       # EDIT mode steps (where applicable)
│   ├── step-e-01-load.md
│   └── step-e-XX-save.md
├── steps-v/                       # VALIDATE mode steps (where applicable)
│   ├── step-v-01-discovery.md
│   └── step-v-XX-report.md
├── templates/                     # Output templates
│   └── {artifact}-template.md
├── data/                          # Classification CSVs, lookup data
│   └── {domain}.csv
├── checklist.md                   # Definition of Done checklist
└── memory-hooks.md                # What to capture in memory system
```

### 4B. Trimodal Support Matrix

| Workflow                      | Create | Edit          | Validate      |
| ----------------------------- | ------ | ------------- | ------------- |
| 010 create-product-brief      | Yes    | No            | No            |
| 011 create-prd                | Yes    | Yes           | Yes           |
| 012 validate-prd              | No     | No            | Yes (only)    |
| 013 edit-prd                  | No     | Yes (only)    | No            |
| 014 create-ux-design          | Yes    | Yes           | No            |
| 020 create-architecture       | Yes    | Yes           | No            |
| **030 create-theme-and-epic** | Yes    | **Yes (NEW)** | **Yes (NEW)** |
| **031 create-business-case**  | Yes    | **Yes (NEW)** | **Yes (NEW)** |
| **040 create-capabilities**   | Yes    | **Yes (NEW)** | **Yes (NEW)** |
| **041 create-features**       | Yes    | **Yes (NEW)** | **Yes (NEW)** |
| **042 create-stories**        | Yes    | **Yes (NEW)** | **Yes (NEW)** |
| 050 sprint-planning           | Yes    | No            | No            |
| 053 dev-story                 | Yes    | No            | No            |
| 054 code-review               | No     | No            | Yes (only)    |
| 057 retrospective             | Yes    | No            | No            |
| **060 audit-hierarchy**       | No     | No            | Yes (only)    |
| **061 export-csv**            | Yes    | No            | No            |

### 4C. Mandatory Step File Structure

Every step file MUST contain these sections in this exact order:

```markdown
---
name: "step-XX-name"
description: "What this step does"
nextStepFile: "./step-YY-name.md"
continueStepFile: "./step-01b-continue.md" # Only on step-01
outputFile: "{variable}/file.md"
templateFile: "../templates/template.md" # Only if creating
beadsCommand: "bd create|update|close" # MANDATORY Beads action
qualityGate: "hard|soft" # hard = abort on fail
---

# Step X of Y — {Step Name}

## STEP GOAL

{One-line objective}

## MANDATORY EXECUTION RULES

- NEVER generate content without user input
- CRITICAL: Read complete step file before action
- YOU ARE A FACILITATOR, not a content generator
- ALWAYS speak in configured {communication_language}
- NEVER proceed without user selecting [C] Continue
- NEVER load multiple step files simultaneously
- NEVER skip steps or optimize the sequence
- ALWAYS update frontmatter when writing output
- NEVER create mental todo lists from future steps

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if fail)

{List of mandatory prerequisites with exact checks}
**If ANY hard gate fails -> STOP. Display error. Do NOT proceed.**

### Soft Gates (SHOULD pass — warn if fail)

{List of recommended prerequisites with warnings}

## MANDATORY SEQUENCE

{Numbered instructions — non-negotiable order}

## BEADS INTEGRATION

{Exact bd command to run, what to register/update}

## QUALITY GATE

{Pass/Fail criteria — hard gates abort, soft gates warn}

## MEMORY CAPTURE

{What learning to capture from this step}

## QUALITY GATE

- **PASS:** Epic name and hypothesis provided, Gherkin ACs (min 2 scenarios) present, Beads registered.
- **FAIL:** Missing hypothesis, non-Gherkin ACs, or Beads registration failed.

## MENU OPTIONS

[C] Continue — {description of next step}
{Other options as applicable}

## SUCCESS METRICS

{Checklist of what constitutes success}

## FAILURE MODES

{Checklist of what constitutes failure}
```

### 4D. Mandatory Continuation Support

Every workflow with step files MUST have a `step-01b-continue.md` that:

1. Reads output document frontmatter `stepsCompleted[]`
2. Loads `inputDocuments[]` from frontmatter
3. Finds last completed step -> extracts `nextStepFile` from that step's frontmatter
4. Routes to the correct next step
5. If workflow complete -> offers edit/validate/next-workflow options

**Currently missing from ALL SQ workflows (030-042, 060, 061) — must be created.**

### 4E. Workflow Header Standard

Every `workflow.md` MUST contain:

```markdown
---
name: { workflow-name }
description: "{description}"
main_config: "{project-root}/_bmad/bmm/config.yaml"
safe_rules: "{project-root}/Instructions to Use/SAFE AGILE.md" # For SAFe workflows
nextStep: "./steps-c/step-01-{name}.md"
editStep: "./steps-e/step-e-01-load.md" # If edit mode exists
validateStep: "./steps-v/step-v-01-discovery.md" # If validate mode exists
---

# {Workflow Name}

## WORKFLOW ARCHITECTURE

{Micro-file architecture description}

## INITIALIZATION

### Configuration Loading

Load config from {main_config} and resolve all variables.

### Beads Pre-Check (MANDATORY for Phase 3-6 workflows)

1. Check: Does {project-root}/.beads/ exist?
2. If NO -> HARD FAIL: "Run `bd init` before proceeding."
3. If YES -> `bd sync --status` to verify clean state

### Memory Loading

Load relevant memory sidecar: {memory_sidecar_path}/common-mistakes.md
Apply learnings as AVOID rules for this session.

### Mode Detection

Detect mode based on user intent or existing documents:

- If fresh creation -> Route to {nextStep}
- If existing document found -> Ask: Create new / Edit existing / Validate existing?
- Route to appropriate mode steps

## EXECUTION

- ALWAYS SPEAK in {communication_language}
- Read fully and follow the appropriate first step file
```

---

## 5. BEADS INTEGRATION STANDARD

### Current Problem

Only `sq-init` (now `030-create-theme-and-epic`) step-04 calls `bd create`. Everything else is optional/missing. Beads pre-check is a soft warning.

### New Standard: Beads is MANDATORY

#### 5A. Beads Pre-Check (HARD FAIL)

```markdown
## BEADS PRE-CHECK (MANDATORY)

1. Check: Does {project-root}/.beads/ exist?
2. If NO -> HARD FAIL: "Run `bd init` before proceeding. SAFe tracking requires Beads."
3. If YES -> `bd sync --status` to verify clean state
4. If dirty -> WARN: "Uncommitted beads changes. Run `bd sync` first."
```

**Applies to ALL Phase 3-6 workflows (030-061). Discovery/Define/Architect phases (001-023) do NOT require Beads.**

#### 5B. Beads Commands Per Workflow

| #   | Workflow              | Beads Action                                                                      | When              |
| --- | --------------------- | --------------------------------------------------------------------------------- | ----------------- |
| 030 | create-theme-and-epic | `bd create --type=epic --title="Theme: {name}"`                                   | step-01 (Theme)   |
|     |                       | `bd create --type=epic --title="Epic: {name}" --parent={theme_id}`                | step-02 (Epic)    |
| 031 | create-business-case  | `bd update {epic_id} --status=in_progress --notes="LBC complete, WSJF={score}"`   | step-04 (Commit)  |
| 040 | create-capabilities   | `bd create --type=task --title="Cap: {name}" --parent={epic_id}` per capability   | step-03 (Link)    |
| 041 | create-features       | `bd create --type=task --title="Feat: {name}" --parent={cap_id}` per feature      | step-03 (Link)    |
| 042 | create-stories        | `bd create --type=task --title="Story: {name}" --parent={feat_id}` per story      | step-02 (Stories) |
| 050 | sprint-planning       | `bd list --status=open` to enumerate backlog                                      | step-01 (Load)    |
| 053 | dev-story             | `bd update {story_id} --status=in_progress` start / `bd close {story_id}` end     | start + end       |
| 060 | audit-hierarchy       | `bd list --status=open` to scan + `bd create --type=task --title="Audit: {date}"` | step-01 (Scan)    |
| 061 | export-csv            | `bd list` to enumerate + `bd create --type=task --title="Export: {date}"`         | step-01 (Select)  |

#### 5C. Session Close Protocol

Every workflow's final step MUST include:

```markdown
## SESSION CLOSE

1. bd sync # Commit beads changes
2. git add {output_files} # Stage artifact files
3. git commit -m "{message}" # Commit code changes
4. bd sync # Commit any new beads
5. git push # Push to remote
```

---

## 6. QUALITY GATE SYSTEM

### 6A. Hard Gates (Abort on Failure)

| Gate ID | Gate Name              | Applies To                      | What It Checks                                                 |
| ------- | ---------------------- | ------------------------------- | -------------------------------------------------------------- |
| HG-01   | Beads Initialized      | ALL Phase 3-6 (030-061)         | `.beads/` directory exists                                     |
| HG-02   | PRD Exists             | 020 create-architecture         | `{planning_artifacts}/prd.md` exists with final step completed |
| HG-03   | Architecture Exists    | 021 check-readiness             | Architecture doc exists                                        |
| HG-04   | Parent Epic Exists     | 040 create-capabilities         | Epic bead exists with status >= ANALYZING                      |
| HG-05   | Capabilities Exist     | 041 create-features             | At least 1 Capability bead exists under Epic                   |
| HG-06   | Features Exist         | 042 create-stories              | At least 1 Feature bead exists under Capability                |
| HG-07   | WSJF Calculated        | 040 create-capabilities         | Parent Epic has `wsjf_score` in frontmatter                    |
| HG-08   | Gherkin ACs Present    | Before any item -> IMPLEMENTING | Acceptance Criteria in Given/When/Then format                  |
| HG-09   | Business Case Complete | 040 create-capabilities         | Epic status is ANALYZING (not FUNNEL)                          |

### 6B. Soft Gates (Warn, Don't Block)

| Gate ID | Gate Name                 | Applies To                | Warning Message                                                        |
| ------- | ------------------------- | ------------------------- | ---------------------------------------------------------------------- |
| SG-01   | PRD Recommended           | 030 create-theme-and-epic | "PRD exists? Theme/Epic will be stronger with a PRD."                  |
| SG-02   | UX Recommended            | 042 create-stories        | "UX design exists? Stories will be richer with UX context."            |
| SG-03   | Test Strategy Recommended | 053 dev-story             | "Test design exists for this epic? Consider /072-test-design."         |
| SG-04   | Architecture Recommended  | 040 create-capabilities   | "Architecture doc exists? Capabilities benefit from technical runway." |

### 6C. Gate Enforcement In Step Files

```markdown
## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `ls {project-root}/.beads/` exists
2. [ ] HG-04: Parent Epic exists -> `bd show {parent_id}` returns valid item
3. [ ] HG-07: WSJF calculated -> Parent frontmatter contains `wsjf_score > 0`

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**
**Error format: "GATE FAILED [{gate_id}]: {description}. Run {fix_command} first."**

### Soft Gates (SHOULD pass — warn if fail)

4. [ ] SG-04: Architecture recommended
   - If missing: "No architecture doc found. Capabilities benefit from tech runway. Continue anyway? [Y/N]"
```

---

## 7. MEMORY SYSTEM

### Current State

- BMM has `Gemini.md` with categorized learnings (10 categories, Root Cause/Correction/Prevention format)
- SQ has zero memory
- `_bmad/_memory/` exists but only has storyteller/tech-writer sidecars

### New Unified Memory Architecture

#### 7A. Directory Structure

```
_bmad/_memory/
├── config.yaml                        # Global memory configuration
├── global-learnings.md                # Cross-agent learnings (replaces Gemini.md)
├── portfolio-sidecar/
│   ├── wsjf-calibration.md            # WSJF scoring patterns and calibration notes
│   ├── decomposition-patterns.md      # What decomposition strategies worked
│   └── common-mistakes.md             # Recurring errors in portfolio planning
├── product-manager-sidecar/
│   ├── prd-patterns.md                # PRD writing patterns that worked
│   ├── feature-sizing.md              # Feature sizing learnings
│   └── common-mistakes.md
├── architect-sidecar/
│   ├── adr-patterns.md                # Architecture decision patterns
│   ├── tech-stack-notes.md            # Technology evaluation notes
│   └── common-mistakes.md
├── scrum-master-sidecar/
│   ├── velocity-history.md            # Sprint velocity tracking
│   ├── impediment-patterns.md         # Recurring impediments
│   └── ceremony-notes.md
├── dev-squad-sidecar/
│   ├── implementation-patterns.md     # Code patterns that worked
│   ├── estimation-accuracy.md         # Story point accuracy tracking
│   └── common-mistakes.md
├── ux-designer-sidecar/
│   ├── user-research-findings.md      # Persistent user research
│   ├── design-decisions.md            # Why we chose X over Y
│   └── accessibility-notes.md
├── test-architect-sidecar/
│   ├── test-strategy-evolution.md     # How test strategy evolved
│   ├── flaky-test-patterns.md         # Known flaky test patterns
│   └── coverage-gaps.md
└── governance-sidecar/
    ├── audit-history.md               # Past audit results
    ├── compliance-exceptions.md       # Approved exceptions
    └── export-field-mappings.md       # Custom Jira/Rally field mappings
```

#### 7B. Memory Entry Format (Standardized)

```markdown
### [{Category}]: {Short Description}

- **Date**: {ISO date}
- **Workflow**: {workflow that generated this}
- **Context**: What was the situation
- **Decision**: What was decided and why
- **Outcome**: What happened
- **Learning**: What to do differently next time
- **Prevention**: Actionable rule for future sessions
```

**Categories:** WSJF-Calibration | Decomposition | Estimation | Architecture | Testing | Process | Security | Documentation | Tooling | Integration

#### 7C. Memory Capture Hook (In Every Step File)

```markdown
## MEMORY CAPTURE

After this step completes, check if any of these occurred:

- A decision was made that could inform future sessions
- A mistake was caught and corrected
- User provided feedback that changes how we work
- WSJF scoring required calibration discussion

If yes, append entry to: `{memory_sidecar}/{relevant-file}.md`
```

#### 7D. Memory Load Hook (In Every Workflow Header)

```markdown
## INITIALIZATION

... 3. Load relevant memory sidecar:

- Read: {memory_sidecar}/common-mistakes.md
- Apply learnings as AVOID rules for this session
- If WSJF workflow: also load wsjf-calibration.md
- If decomposition workflow: also load decomposition-patterns.md
```

#### 7E. Learning Workflow (097-learn-from-mistakes)

Replaces old `bmad-bmm-learn-must-follow-rules.md`:

1. LOAD all relevant sidecar files for current session's workflows
2. REVIEW current session for mistakes, corrections, learnings
3. CATEGORIZE each finding
4. APPEND to appropriate sidecar file (not global — agent-specific)
5. Cross-agent learnings -> append to `global-learnings.md`
6. REPORT summary of additions
7. `bd sync` to persist

---

## 8. DATA-DRIVEN INTELLIGENCE

### Current State

- BMM has `data/project-types.csv` (11 types with detection signals, key questions, required sections)
- BMM has `data/domain-complexity.csv`
- SQ has `data/safe-types.yaml` only

### New Data Files for SAFe Workflows

#### 8A. `_bmad/bmm/data/decomposition-patterns.csv`

For 040 create-capabilities and 041 create-features:

```csv
epic_type,typical_capability_count,decomposition_strategy,common_pitfalls,example_capabilities
platform,3-5,horizontal-slice,"Too many enabling capabilities","Infrastructure|API|Frontend|Security"
customer-facing,4-7,user-journey,"Mixing technical and business capabilities","Onboarding|Core-Experience|Notification|Analytics"
integration,2-4,system-boundary,"Over-decomposing simple integrations","Inbound|Outbound|Transformation|Monitoring"
data-migration,3-5,data-lifecycle,"Ignoring rollback capability","Extract|Transform|Load|Validate|Rollback"
compliance,2-4,regulation-domain,"Gold-plating beyond regulatory minimum","Assessment|Implementation|Audit|Reporting"
```

#### 8B. `_bmad/bmm/data/wsjf-reference-scales.csv`

For consistent WSJF scoring across all levels:

```csv
dimension,score_1,score_2,score_3,score_5,score_8,score_13,score_21
user_business_value,"Negligible impact","Minimal - few users","Some users benefit","Moderate business value","Significant revenue/retention","Critical to business","Existential - company depends on it"
time_criticality,"No deadline","Soft deadline >6mo","Soft deadline 3-6mo","Hard deadline 3-6mo","Hard deadline <3mo","Regulatory <1mo","Immediate - blocking other work"
risk_reduction,"No risk addressed","Minor technical debt","Moderate risk reduced","Significant risk mitigated","High compliance/security risk","Critical vulnerability","Existential threat addressed"
job_size,"Trivial ~1 day","Small ~1 week","Medium ~2 weeks","Large ~1 month","XL ~2 months","XXL ~1 quarter","Massive >1 quarter"
```

**WSJF Formula:** `WSJF = (User-Business Value + Time Criticality + Risk Reduction) / Job Size`

#### 8C. `_bmad/bmm/data/gherkin-quality-rules.csv`

For validating Gherkin ACs across all SAFe levels:

```csv
rule_id,rule_name,check_description,example_violation,auto_fixable
GK-01,no-implementation-details,"AC must not reference UI elements, API endpoints, or DB tables","Given the user clicks the blue button",no
GK-02,measurable-then,"Then clause must have observable/measurable outcome","Then the system works correctly",no
GK-03,single-when,"Each scenario should have exactly one When clause","When user logs in and submits form and pays",yes
GK-04,no-conjunction-then,"Then should not combine multiple assertions with AND","Then user sees message and email is sent and DB updated",yes
GK-05,business-language,"Use business domain language not technical jargon","Given the API returns 200",no
GK-06,independent-scenarios,"Each scenario must be independently executable","Given scenario-1 passed",no
GK-07,min-two-scenarios,"Every artifact must have at least 2 Gherkin scenarios","Only 1 scenario provided",no
```

#### 8D. `_bmad/bmm/data/safe-hierarchy-rules.csv`

For audit-hierarchy validation:

```csv
level,parent_required,wsjf_required,gherkin_required,min_children,max_children,valid_statuses
strategic-theme,no,no,no,1,10,"ACTIVE|ARCHIVED"
portfolio-epic,yes(theme),yes,yes,1,12,"FUNNEL|REVIEWING|ANALYZING|BACKLOG|IMPLEMENTING|DONE"
capability,yes(epic),yes(inherited),yes,1,8,"FUNNEL|ANALYZING|BACKLOG|IMPLEMENTING|DONE"
feature,yes(capability),yes(inherited),yes,1,10,"FUNNEL|ANALYZING|BACKLOG|IMPLEMENTING|DONE"
user-story,yes(feature),no,yes,0,20,"NEW|READY|IN-PROGRESS|DONE|BLOCKED"
dev-task,yes(story),no,no,0,0,"TODO|IN-PROGRESS|DONE"
qa-test-case,yes(story),no,yes(format),0,0,"PENDING|PASSED|FAILED"
```

---

## 9. CHECKLIST SYSTEM

### Current State

- BMM has rich checklists: dev-story (26 items), code-review (22 items)
- SQ has ZERO checklists

### New Checklists Required

#### 9A. `030 create-theme-and-epic/checklist.md`

```markdown
---
title: "Definition of Done — Theme & Epic Creation"
validation-criticality: "HIGHEST"
---

## Theme Validation (4 items)

- [ ] Theme has clear strategic objective (not a project name)
- [ ] Time horizon specified (12-24 months typical)
- [ ] Strategic driver identified (market/regulatory/technical/customer)
- [ ] Theme registered in Beads via `bd create`

## Epic Validation (6 items)

- [ ] Epic linked to parent Theme (parentId in frontmatter)
- [ ] Benefit Hypothesis: "If we {action}, then {outcome}, as measured by {metric}"
- [ ] Epic type classified: Business or Enabler
- [ ] Acceptance Criteria in Gherkin format (min 2 scenarios)
- [ ] WSJF calculated with all 4 dimensions scored
- [ ] Epic registered in Beads with parent link

## State Validation (2 items)

- [ ] Theme status = ACTIVE
- [ ] Epic status = FUNNEL (initial)
```

#### 9B. `031 create-business-case/checklist.md`

```markdown
## Lean Business Case (5 items)

- [ ] Problem Statement clearly defined
- [ ] Solution Hypothesis: "If {solution}, then {outcome}, measured by {metric}"
- [ ] Leading Indicators defined (early validation signals)
- [ ] Non-Functional Requirements identified
- [ ] MVP definition: smallest deliverable to validate hypothesis

## WSJF Finalization (2 items)

- [ ] All 4 WSJF dimensions scored using reference scale
- [ ] WSJF score calculated and recorded in frontmatter

## State (1 item)

- [ ] Epic status advanced: FUNNEL -> ANALYZING
```

#### 9C. `040 create-capabilities/checklist.md`

```markdown
## Prerequisites (2 items)

- [ ] Parent Epic has completed Business Case (status >= ANALYZING)
- [ ] WSJF score exists on parent Epic

## Per Capability (5 items each)

- [ ] Capability linked to parent Epic (parentId in frontmatter)
- [ ] WSJF inherited from parent Epic
- [ ] Gherkin ACs present (min 2 scenarios per capability)
- [ ] Capability type classified: Business or Enabler
- [ ] Registered in Beads: `bd create --parent={epic_id}`

## Decomposition Quality (2 items)

- [ ] No capability is both an Enabler AND has user-facing ACs
- [ ] Capability count within recommended range per decomposition-patterns.csv
```

#### 9D. `041 create-features/checklist.md`

```markdown
## Per Feature (6 items each)

- [ ] Feature linked to parent Capability (parentId in frontmatter)
- [ ] Benefit Hypothesis defined
- [ ] WSJF inherited from parent chain
- [ ] Gherkin ACs present (min 2 scenarios per feature)
- [ ] PI target assigned (which Program Increment)
- [ ] Registered in Beads: `bd create --parent={cap_id}`

## Feature Quality (2 items)

- [ ] Each feature is deliverable within 1 PI (not multi-PI)
- [ ] No feature duplicates another feature's scope
```

#### 9E. `042 create-stories/checklist.md`

```markdown
## Per User Story (6 items each)

- [ ] Story format: "As a {role}, I want {goal}, so that {benefit}"
- [ ] Linked to parent Feature (parentId in frontmatter)
- [ ] Gherkin ACs present (min 2 scenarios)
- [ ] Story points estimated (Fibonacci: 1, 2, 3, 5, 8, 13)
- [ ] INVEST criteria met (Independent, Negotiable, Valuable, Estimable, Small, Testable)
- [ ] Registered in Beads: `bd create --parent={feat_id}`

## Dev Tasks (3 items per story)

- [ ] Each story has 1+ dev tasks with descriptions
- [ ] Tasks are implementation-level (not business-level)
- [ ] Estimated hours per task (optional but recommended)

## QA Test Cases (3 items per story)

- [ ] Each story has 1+ QA test cases
- [ ] Test cases in Gherkin format
- [ ] Test cases cover happy path + at least 1 edge case
```

#### 9F. `060 audit-hierarchy/checklist.md`

```markdown
## Scan Completeness (3 items)

- [ ] All SAFe levels scanned: Theme -> Epic -> Capability -> Feature -> Story
- [ ] Both Beads DB and file system checked for orphans
- [ ] Item count reported per level

## Orphan Detection (2 items)

- [ ] Zero items without valid parent (except root Themes)
- [ ] Zero items with broken parent references (parent doesn't exist)

## AC Validation (2 items)

- [ ] All Capabilities, Features, Stories have Gherkin ACs
- [ ] Gherkin quality rules (gherkin-quality-rules.csv) pass

## WSJF Consistency (3 items)

- [ ] All Epics have WSJF scores
- [ ] All Capabilities inherit WSJF from parent Epic
- [ ] No child has higher WSJF than parent (sanity check)

## Verdict (1 item)

- [ ] Overall verdict issued: PASS / CONCERNS / FAIL
```

#### 9G. `061 export-csv/checklist.md`

```markdown
## Field Mapping (3 items)

- [ ] All SAFe fields mapped to target tool schema (Rally/Jira)
- [ ] Parent-child links exported as foreign keys
- [ ] WSJF scores included in export

## CSV Validation (3 items)

- [ ] CSV opens correctly in Excel/Sheets (no encoding issues)
- [ ] All rows have required fields populated
- [ ] Parent references resolve to valid IDs within the export
```

---

## 10. PHYSICAL FILE CHANGES

### 10A. Command Files to RENAME (.claude/commands/)

**Old -> New naming pattern:** `{number}-{clean-name}.md`

```
OLD                                          NEW
.claude/commands/001-bmad-brainstorming.md               -> 001-brainstorming.md
.claude/commands/002-bmad-bmm-market-research.md         -> 002-market-research.md
.claude/commands/003-bmad-bmm-domain-research.md         -> 003-domain-research.md
.claude/commands/004-bmad-bmm-technical-research.md      -> 004-technical-research.md
.claude/commands/005-bmad-bmm-create-product-brief.md    -> 010-create-product-brief.md
.claude/commands/006-bmad-bmm-create-prd.md              -> 011-create-prd.md
.claude/commands/007-bmad-bmm-validate-prd.md            -> 012-validate-prd.md
.claude/commands/008-bmad-bmm-edit-prd.md                -> 013-edit-prd.md
.claude/commands/009-bmad-bmm-create-ux-design.md        -> 014-create-ux-design.md
                                                         -> 015-create-personas.md (NEW)
.claude/commands/010-bmad-sq-init.md                     -> 030-create-theme-and-epic.md
.claude/commands/011-bmad-sq-analyze.md                  -> 031-create-business-case.md
                                                         -> 032-run-pi-planning.md (NEW)
                                                         -> 033-run-inspect-and-adapt.md (NEW)
.claude/commands/012-bmad-bmm-create-architecture.md     -> 020-create-architecture.md
.claude/commands/013-bmad-bmm-create-epics-and-stories.md -> DELETED (replaced by 040+041+042)
.claude/commands/014-bmad-sq-solve.md                    -> 040-create-capabilities.md
.claude/commands/015-bmad-sq-plan.md                     -> 041-create-features.md
.claude/commands/016-bmad-bmm-check-implementation-readiness.md -> 021-check-readiness.md
.claude/commands/017-bmad-bmm-sprint-planning.md         -> DELETED (merged into 050)
.claude/commands/018-bmad-bmm-sprint-status.md           -> DELETED (merged into 051)
.claude/commands/019-bmad-bmm-create-story.md            -> 052-create-story.md
.claude/commands/020-bmad-bmm-dev-story.md               -> 053-dev-story.md
.claude/commands/021-bmad-bmm-qa-automate.md             -> 070-qa-automate.md
.claude/commands/022-bmad-bmm-code-review.md             -> 054-code-review.md
.claude/commands/023-bmad-bmm-retrospective.md           -> 057-retrospective.md
.claude/commands/024-bmad-sq-exec.md                     -> 042-create-stories.md
.claude/commands/025-bmad-sq-audit.md                    -> 060-audit-hierarchy.md
.claude/commands/026-bmad-sq-export.md                   -> 061-export-csv.md
.claude/commands/060-bmad-tea-teach-me-testing.md        -> 079-teach-me-testing.md
.claude/commands/061-bmad-tea-testarch-framework.md      -> 071-test-framework.md
.claude/commands/062-bmad-tea-testarch-ci.md             -> 075-test-ci.md
.claude/commands/063-bmad-tea-testarch-test-design.md    -> 072-test-design.md
.claude/commands/064-bmad-tea-testarch-atdd.md           -> 073-test-atdd.md
.claude/commands/065-bmad-tea-testarch-automate.md       -> 074-test-automate.md
.claude/commands/066-bmad-tea-testarch-test-review.md    -> 077-test-review.md
.claude/commands/067-bmad-tea-testarch-nfr.md            -> 076-test-nfr.md
.claude/commands/068-bmad-tea-testarch-trace.md          -> 078-test-trace.md
.claude/commands/080-bmad-bmm-document-project.md        -> 023-document-project.md
.claude/commands/081-bmad-bmm-generate-project-context.md -> 022-generate-project-context.md
.claude/commands/082-bmad-bmm-quick-spec.md              -> 056-quick-spec.md
.claude/commands/083-bmad-bmm-quick-dev.md               -> 055-quick-dev.md
.claude/commands/084-bmad-bmm-correct-course.md          -> 058-correct-course.md
.claude/commands/090-bmad-agent-bmad-master.md           -> 080-agent-bmad-master.md
.claude/commands/091-bmad-agent-bmm-analyst.md           -> 081-agent-analyst.md
.claude/commands/092-bmad-agent-bmm-tech-writer.md       -> 082-agent-tech-writer.md
.claude/commands/093-bmad-agent-bmm-ux-designer.md       -> 083-agent-ux-designer.md
.claude/commands/094-bmad-agent-tea-tea.md               -> 084-agent-tea.md
.claude/commands/095-bmad-help.md                        -> 090-help.md
.claude/commands/096-bmad-party-mode.md                  -> 091-party-mode.md
.claude/commands/097-bmad-editorial-review-prose.md      -> 092-editorial-review-prose.md
.claude/commands/098-bmad-editorial-review-structure.md  -> 093-editorial-review-structure.md
.claude/commands/099-bmad-review-adversarial-general.md  -> 094-review-adversarial.md
.claude/commands/100-bmad-index-docs.md                  -> 095-index-docs.md
.claude/commands/101-bmad-shard-doc.md                   -> 096-shard-doc.md
                                                         -> 097-learn-from-mistakes.md (NEW)
```

### 10B. Workflow Directories to RENAME (\_bmad/bmm/workflows/)

```
OLD                                          NEW
2-plan-workflows/sq-init/                    -> 2-plan-workflows/create-theme-and-epic/
2-plan-workflows/sq-analyze/                 -> 2-plan-workflows/create-business-case/
3-solutioning/sq-solve/                      -> 3-solutioning/create-capabilities/
3-solutioning/sq-plan/                       -> 3-solutioning/create-features/
4-implementation/sq-exec/                    -> 4-implementation/create-stories/
4-implementation/sq-audit/                   -> 4-implementation/audit-hierarchy/
4-implementation/sq-export/                  -> 4-implementation/export-csv/
```

### 10C. Web-Bundle Workflow Files to RENAME

```
OLD                                                          NEW
web-bundles/01-portfolio-solution/workflow_sq-init.md         -> workflow_create-theme-and-epic.md
web-bundles/01-portfolio-solution/workflow_sq-analyze.md      -> workflow_create-business-case.md
web-bundles/01-portfolio-solution/workflow_sq-solve.md        -> workflow_create-capabilities.md
web-bundles/02-product-manager/workflow_sq-plan.md            -> workflow_create-features.md
web-bundles/04c-dev-squad/workflow_sq-exec.md                 -> workflow_create-stories.md
web-bundles/01-portfolio-solution/workflow_sq-audit.md        -> workflow_audit-hierarchy.md
web-bundles/00-bmad-orchestrator/workflow_sq-export.md        -> workflow_export-csv.md
```

### 10D. Files to CREATE (NEW)

#### Continuation Files (Missing from all SQ workflows)

```
_bmad/bmm/workflows/2-plan-workflows/create-theme-and-epic/steps-c/step-01b-continue.md
_bmad/bmm/workflows/2-plan-workflows/create-business-case/steps-c/step-01b-continue.md
_bmad/bmm/workflows/3-solutioning/create-capabilities/steps-c/step-01b-continue.md
_bmad/bmm/workflows/3-solutioning/create-features/steps-c/step-01b-continue.md
_bmad/bmm/workflows/4-implementation/create-stories/steps-c/step-01b-continue.md
_bmad/bmm/workflows/4-implementation/audit-hierarchy/steps-c/step-01b-continue.md
_bmad/bmm/workflows/4-implementation/export-csv/steps-c/step-01b-continue.md
```

#### Edit Mode Steps (5 workflows x 3 steps = 15 files)

```
For each of: create-theme-and-epic, create-business-case, create-capabilities, create-features, create-stories:
  steps-e/step-e-01-load.md        # Load existing artifact, display current state
  steps-e/step-e-02-modify.md      # Guided modification with validation
  steps-e/step-e-03-save.md        # Save, update Beads, validate checklist
```

#### Validate Mode Steps (5 workflows x 5 steps = 25 files)

```
For each of: create-theme-and-epic, create-business-case, create-capabilities, create-features, create-stories:
  steps-v/step-v-01-discovery.md   # Load artifact and dependencies
  steps-v/step-v-02-structure.md   # Validate structure (frontmatter, required fields)
  steps-v/step-v-03-content.md     # Validate content quality (Gherkin, WSJF, hypotheses)
  steps-v/step-v-04-links.md       # Validate parent-child links and Beads sync
  steps-v/step-v-05-report.md      # Generate validation report with PASS/CONCERNS/FAIL
```

#### Checklists (7 new files)

```
_bmad/bmm/workflows/2-plan-workflows/create-theme-and-epic/checklist.md
_bmad/bmm/workflows/2-plan-workflows/create-business-case/checklist.md
_bmad/bmm/workflows/3-solutioning/create-capabilities/checklist.md
_bmad/bmm/workflows/3-solutioning/create-features/checklist.md
_bmad/bmm/workflows/4-implementation/create-stories/checklist.md
_bmad/bmm/workflows/4-implementation/audit-hierarchy/checklist.md
_bmad/bmm/workflows/4-implementation/export-csv/checklist.md
```

#### Data Files (4 new files)

```
_bmad/bmm/data/decomposition-patterns.csv
_bmad/bmm/data/wsjf-reference-scales.csv
_bmad/bmm/data/gherkin-quality-rules.csv
_bmad/bmm/data/safe-hierarchy-rules.csv
```

#### Memory Sidecar Files (8 directories x 3 files = 24 files)

```
_bmad/_memory/portfolio-sidecar/wsjf-calibration.md
_bmad/_memory/portfolio-sidecar/decomposition-patterns.md
_bmad/_memory/portfolio-sidecar/common-mistakes.md
_bmad/_memory/product-manager-sidecar/prd-patterns.md
_bmad/_memory/product-manager-sidecar/feature-sizing.md
_bmad/_memory/product-manager-sidecar/common-mistakes.md
_bmad/_memory/architect-sidecar/adr-patterns.md
_bmad/_memory/architect-sidecar/tech-stack-notes.md
_bmad/_memory/architect-sidecar/common-mistakes.md
_bmad/_memory/scrum-master-sidecar/velocity-history.md
_bmad/_memory/scrum-master-sidecar/impediment-patterns.md
_bmad/_memory/scrum-master-sidecar/ceremony-notes.md
_bmad/_memory/dev-squad-sidecar/implementation-patterns.md
_bmad/_memory/dev-squad-sidecar/estimation-accuracy.md
_bmad/_memory/dev-squad-sidecar/common-mistakes.md
_bmad/_memory/ux-designer-sidecar/user-research-findings.md
_bmad/_memory/ux-designer-sidecar/design-decisions.md
_bmad/_memory/ux-designer-sidecar/accessibility-notes.md
_bmad/_memory/test-architect-sidecar/test-strategy-evolution.md
_bmad/_memory/test-architect-sidecar/flaky-test-patterns.md
_bmad/_memory/test-architect-sidecar/coverage-gaps.md
_bmad/_memory/governance-sidecar/audit-history.md
_bmad/_memory/governance-sidecar/compliance-exceptions.md
_bmad/_memory/governance-sidecar/export-field-mappings.md
```

#### Memory Hooks Per Workflow (7 new files)

```
_bmad/bmm/workflows/2-plan-workflows/create-theme-and-epic/memory-hooks.md
_bmad/bmm/workflows/2-plan-workflows/create-business-case/memory-hooks.md
_bmad/bmm/workflows/3-solutioning/create-capabilities/memory-hooks.md
_bmad/bmm/workflows/3-solutioning/create-features/memory-hooks.md
_bmad/bmm/workflows/4-implementation/create-stories/memory-hooks.md
_bmad/bmm/workflows/4-implementation/audit-hierarchy/memory-hooks.md
_bmad/bmm/workflows/4-implementation/export-csv/memory-hooks.md
```

### 10E. Files to MODIFY (Add new sections to existing step files)

Every existing SQ step file (~28 files across 7 workflows) needs these sections ADDED:

- `## PREREQUISITES CHECK` (with hard/soft gates per Section 6)
- `## BEADS INTEGRATION` (exact bd commands per Section 5B)
- `## QUALITY GATE` (pass/fail criteria)
- `## MEMORY CAPTURE` (what to log)

Plus update frontmatter to include:

- `beadsCommand:` field
- `qualityGate: hard|soft` field

### 10F. Reference Files to UPDATE

```
_bmad/_config/workflow-manifest.csv      # New names + numbers for all workflows
_bmad/_config/task-manifest.csv          # New names for tasks
_bmad/_config/manifest.yaml              # Master manifest
_bmad/bmm/config.yaml                    # Add memory paths, beads config
_bmad/_memory/config.yaml                # New memory system config
_bmad/bmm/data/safe-types.yaml           # Add memory hooks references

web-bundles/00-bmad-orchestrator/004_agent_routing_table.md  # New workflow names
web-bundles/00-bmad-orchestrator/006_agent_registry.csv      # Verify agent mappings

.agent/workflows/bmad-sq-*.md            # Rename to match new workflow names
.agent/workflows/bmad-bmm-*.md           # Rename to match new command numbers

_npm-package/content/.claude/commands/*   # Mirror all command renames
_npm-package/content/web-bundles/*        # Mirror all web-bundle renames
```

---

## 11. CONFIG CHANGES

### 11A. Updated `_bmad/bmm/config.yaml`

Add these new sections:

```yaml
# Memory System (NEW)
memory:
  enabled: true
  global_learnings: "{project-root}/_bmad/_memory/global-learnings.md"
  sidecar_root: "{project-root}/_bmad/_memory"
  auto_capture: true # Prompt for memory capture after each workflow

# Beads Integration (NEW — MANDATORY)
beads:
  required: true # Hard fail if .beads/ missing
  auto_register: true # Auto-register artifacts in Beads
  sync_on_complete: true # Run bd sync after workflow completion
  pre_check_phases: [3, 4, 5, 6] # Phases that require Beads

# Quality Gates (NEW)
quality_gates:
  enforcement: "hard" # hard = abort on fail
  prerequisites:
    create-capabilities:
      requires: ["create-business-case"]
    create-features:
      requires: ["create-capabilities"]
    create-stories:
      requires: ["create-features"]
    create-architecture:
      requires: ["create-prd"]
    check-readiness:
      requires: ["create-architecture"]
```

### 11B. Updated `_bmad/_memory/config.yaml`

```yaml
# Memory System Configuration
auto_load: true # Load relevant sidecar at workflow start
auto_capture_prompt: true # Prompt for learnings after workflow
max_entries_per_file: 50 # Rotate after 50 entries
categories:
  - WSJF-Calibration
  - Decomposition
  - Estimation
  - Architecture
  - Testing
  - Process
  - Security
  - Documentation
  - Tooling
  - Integration

# Agent -> Sidecar mapping
agent_sidecars:
  sq-pm: "portfolio-sidecar"
  analyst: "portfolio-sidecar"
  pm: "product-manager-sidecar"
  sq-architect: "architect-sidecar"
  sm: "scrum-master-sidecar"
  sq-team: "dev-squad-sidecar"
  ux-designer: "ux-designer-sidecar"
  tea: "test-architect-sidecar"
  sq-rte: "governance-sidecar"
```

---

## 12. MIGRATION EXECUTION PLAN

### Wave 1 — Foundation (Renames Only, No Content Changes)

> **Status:** COMPLETED ✅

**Goal:** New numbering and naming everywhere, zero functionality change.

**Steps:**

1. Rename all `.claude/commands/*.md` files per Section 10A mapping
2. Update content inside each command file to reference new workflow paths
3. Rename `_bmad/bmm/workflows/` directories per Section 10B
4. Rename `web-bundles/` workflow files per Section 10C
5. Update all internal references:
   - `nextStepFile` paths in step files
   - `nextStep` paths in workflow headers
   - Agent routing table references
   - Manifest CSV entries
6. Mirror renames in `_npm-package/content/`
7. Rename `.agent/workflows/` files to match

**Validation:** Every `/XXX-*` command still routes to correct workflow and executes.

### Wave 2 — Beads Mandatory

> **Status:** COMPLETED ✅

**Goal:** Beads becomes backbone, not optional.

**Steps:**

1. Update all Phase 3-6 workflow headers to have HARD Beads pre-check
2. Add `beadsCommand:` to all SAFe step file frontmatter
3. Add `## BEADS INTEGRATION` section to all SAFe step files with exact `bd` commands
4. Add `## PREREQUISITES CHECK` with hard gates to all SAFe step files
5. Update `_bmad/bmm/config.yaml` with beads config

**Validation:** Run `/030-create-theme-and-epic` without `.beads/` -> should HARD FAIL with clear error.

### Wave 3 — Continuation + Edit + Validate

> **Status:** COMPLETED ✅

**Goal:** All SAFe workflows get BMM-level rigor.

**Steps:**

1. Create `step-01b-continue.md` for all 7 SAFe workflows (7 files)
2. Create `steps-e/` (Edit mode) for 5 applicable workflows (15 files)
3. Create `steps-v/` (Validate mode) for 5 applicable workflows (25 files)
4. Update workflow headers to support trimodal routing (mode detection)
5. Update web-bundle workflow files to match

**Validation:** Start `/030-create-theme-and-epic`, stop midway, restart -> should resume from last step.

### Wave 4 — Quality Gates + Checklists + Data

> **Status:** COMPLETED ✅

**Goal:** Hard enforcement of prerequisites, rich validation data.

**Steps:**

1. Create `checklist.md` for all 7 SAFe workflows (7 files)
2. Add `## QUALITY GATE` section to all step files
3. Implement hard gate checks in prerequisite steps
4. Create 4 new data CSVs:
   - `decomposition-patterns.csv`
   - `wsjf-reference-scales.csv`
   - `gherkin-quality-rules.csv`
   - `safe-hierarchy-rules.csv`
5. Wire data files into relevant step files (decomposition steps load CSV, WSJF steps load scale)
6. Update `_bmad/bmm/config.yaml` with quality_gates config

**Validation:** Run `/040-create-capabilities` without analyzed Epic -> should HARD FAIL with "GATE FAILED [HG-09]".

### Wave 5 — Memory System

**Goal:** System learns from every session.

**Steps:**

1. Create all memory sidecar directories and seed files (24 files)
2. Update `_bmad/_memory/config.yaml` with full configuration
3. Add `## MEMORY CAPTURE` section to all step files
4. Add memory load hooks to all workflow headers
5. Create `/097-learn-from-mistakes` command as unified learning workflow
6. Wire up existing `Gemini.md` content -> migrate to `global-learnings.md`

**Validation:** Complete a workflow -> relevant sidecar file should have new entry. Run `/097-learn-from-mistakes` -> should summarize session learnings.

### Wave 6 — Kill Old + End-to-End Validation

**Goal:** Clean house, prove entire pipeline works.

**Steps:**

1. Delete old duplicate/replaced commands (013, 017, 018)
2. Delete old `.agent/workflows/` files that no longer have matching commands
3. Run full command audit: every number maps to correct workflow
4. Run SAFe pipeline end-to-end:
   ```
   /030-create-theme-and-epic
   /031-create-business-case
   /040-create-capabilities
   /041-create-features
   /042-create-stories
   /060-audit-hierarchy
   /061-export-csv
   ```
5. Verify Beads has complete hierarchy: `bd list` shows Theme -> Epic -> Cap -> Feat -> Story
6. Verify `bd stats` shows all items with parent-child links
7. Verify exported CSV has all fields populated
8. Run `/097-learn-from-mistakes` to capture pipeline learnings
9. `bd sync && git push`

---

## 13. WHAT CHANGES SUMMARY

| Aspect             | Before (v3)                                        | After (v4)                                                       |
| ------------------ | -------------------------------------------------- | ---------------------------------------------------------------- |
| **Numbering**      | Mixed (001-101, random gaps, bmad-bmm-sq prefixes) | Phase-based (000s-090s), clean names                             |
| **Command Style**  | `/011-bmad-sq-analyze`                             | `/031-create-business-case`                                      |
| **SAFe Names**     | Cryptic (sq-init, sq-exec, sq-solve)               | Clear (create-theme-and-epic, create-stories)                    |
| **Beads**          | Optional (only sq-init step-04)                    | **Mandatory** at every level, hard fail without                  |
| **Quality Gates**  | Soft warnings only in SQ                           | **Hard gates** that abort on failure                             |
| **Trimodal**       | BMM only (PRD, Architecture)                       | **All SAFe workflows** get Create/Edit/Validate                  |
| **Continuation**   | BMM only (step-01b-continue)                       | **All workflows** have continuation handling                     |
| **Checklists**     | BMM only (dev-story: 26, code-review: 22)          | **Every workflow** has DoD checklist                             |
| **Memory**         | Gemini.md only (BMM, single file)                  | **Per-agent sidecars** + global learnings (24 files)             |
| **Data CSVs**      | BMM only (project-types, domain-complexity)        | **4 new CSVs** for decomposition, WSJF, Gherkin, hierarchy rules |
| **Duplicates**     | 3 duplicated workflows                             | **Zero** — merged or killed                                      |
| **Total Commands** | 51 (messy, overlapping)                            | ~55 (organized, no overlap, room to grow)                        |
| **File Changes**   | —                                                  | ~120 files (rename + create + modify)                            |

---

## FILE COUNT SUMMARY

| Action                             | Count                       |
| ---------------------------------- | --------------------------- |
| Command files to rename            | ~50                         |
| Workflow dirs to rename            | 7                           |
| Web-bundle files to rename         | 7                           |
| Continuation files to CREATE       | 7                           |
| Edit mode step files to CREATE     | 15                          |
| Validate mode step files to CREATE | 25                          |
| Checklist files to CREATE          | 7                           |
| Data CSV files to CREATE           | 4                           |
| Memory sidecar files to CREATE     | 24                          |
| Memory hooks files to CREATE       | 7                           |
| New command files to CREATE        | 5 (015, 032, 033, 051, 097) |
| Existing step files to MODIFY      | ~28                         |
| Reference/config files to UPDATE   | ~12                         |
| **TOTAL FILES TOUCHED**            | **~198**                    |

---

> **Next Step:** Say "bluebox" to begin Wave 4 implementation.
