---
name: audit-hierarchy
description: Validate compliance, link integrity, and Gherkin AC presence across the SAFe hierarchy
main_config: "{project-root}/_bmad/bmm/config.yaml"
safe_rules: "{project-root}/Instructions to Use/SAFE AGILE.md"
nextStep: "./steps-c/step-01-scan.md"
continueStep: "./steps-c/step-01b-continue.md"
---

# Audit Hierarchy Workflow

**Goal:** Validate the entire SAFe hierarchy for compliance — check orphans, parent-child links, Gherkin AC quality, and WSJF consistency. Issue verdict: PASS / CONCERNS / FAIL.

**Your Role:** You are the Governance Lead (sq-rte), performing a systematic compliance audit. You bring expertise in SAFe 6.0 governance while identifying every gap and inconsistency.

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution:

### Core Principles

- **Micro-file Design**: Each step is a self-contained instruction file
- **Just-In-Time Loading**: Only the current step file is in memory
- **Sequential Enforcement**: Steps completed in order, no skipping
- **State Tracking**: Document progress in output file frontmatter using `stepsCompleted` array

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order
3. **WAIT FOR INPUT**: If a menu is presented, halt and wait for user selection
4. **CHECK CONTINUATION**: Only proceed to next step when user selects 'C'
5. **SAVE STATE**: Update `stepsCompleted` in frontmatter before loading next step
6. **LOAD NEXT**: When directed, read fully and follow the next step file

### Critical Rules (NO EXCEPTIONS)

- NEVER load multiple step files simultaneously
- ALWAYS read entire step file before execution
- NEVER skip steps or optimize the sequence
- ALWAYS update frontmatter of output files
- YOU MUST ALWAYS SPEAK OUTPUT in `{communication_language}`

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load and read full config from `{main_config}` and resolve:

- `project_name`, `output_folder`, `user_name`, `communication_language`
- Load `{safe_rules}` for SAFe hierarchy and RACI reference
- Load `{project-root}/_bmad/bmm/data/safe-hierarchy-rules.csv` for validation rules
- Load `{project-root}/_bmad/bmm/data/gherkin-quality-rules.csv` for AC validation

### 2. Beads Pre-Check (HARD GATE — MANDATORY)

1. Check: Does `{project-root}/.beads/` exist?
2. If **NO** -> **HARD FAIL**: "GATE FAILED [HG-01]: Beads not initialized. Run `bd init` before proceeding. SAFe tracking requires Beads."
3. If **YES** -> Run `bd sync --status` to verify clean state

**Do NOT proceed past this point if .beads/ does not exist.**

### 3. Memory Loading

Load relevant memory sidecar(s):

- Read: `{project-root}/_bmad/_memory/governance-sidecar/audit-history.md`
- Read: `{project-root}/_bmad/_memory/global-learnings.md`
- Apply learnings as reference and best practices for this audit.

### 4. Mode Detection & Continuation

Detect mode based on user intent or existing audit state:

1. **Check for Continuation**:
   - If an existing draft audit report is found AND it contains `stepsCompleted` array in frontmatter:
   - Ask: "I've found an interrupted audit session. Would you like to **[C] Resume progress** or start fresh?"
   - If user chooses [C] -> Route to `{continueStep}`

2. **Fresh Scan**:
   - If no existing document OR user chooses to start fresh -> Route to `{nextStep}`

### 5. Execution

Read fully and follow the step file determined during Mode Detection.
