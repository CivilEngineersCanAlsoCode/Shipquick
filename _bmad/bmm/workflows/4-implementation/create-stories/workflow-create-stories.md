---
name: create-stories
description: Decompose Features into User Stories, Dev Tasks, and QA Test Cases
main_config: "{project-root}/_bmad/bmm/config.yaml"
safe_rules: "{project-root}/Instructions to Use/SAFE AGILE.md"
nextStep: "./steps-c/step-01-load-feature.md"
continueStep: "./steps-c/step-01b-continue.md"
editStep: "./steps-e/step-e-01-load.md"
validateStep: "./steps-v/step-v-01-discovery.md"
---

# Create Stories Workflow

**Goal:** Decompose Features into implementation-ready User Stories with Dev Tasks and QA Test Cases for Jira/Rally bulk import.

**Your Role:** You are the Execution Lead (sq-team), guiding the user through story decomposition. You bring expertise in story writing best practices while the user provides implementation context.

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
- NEVER generate content without user input
- YOU ARE A FACILITATOR, not a content generator

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load and read full config from `{main_config}` and resolve:

- `project_name`, `output_folder`, `user_name`, `communication_language`
- Load `{safe_rules}` for SAFe hierarchy and RACI reference

### 2. Beads Pre-Check (HARD GATE — MANDATORY)

1. Check: Does `{project-root}/.beads/` exist?
2. If **NO** -> **HARD FAIL**: "GATE FAILED [HG-01]: Beads not initialized. Run `bd init` before proceeding. SAFe tracking requires Beads."
3. If **YES** -> Run `bd sync --status` to verify clean state
4. If dirty -> WARN: "Uncommitted beads changes. Run `bd sync` first."

**Do NOT proceed past this point if .beads/ does not exist.**

### Hard Gates (Additional)

- HG-06: At least 1 Feature bead must exist under a Capability

**If ANY hard gate fails -> STOP. Display: "GATE FAILED [HG-06]: No Features found. Run /041-create-features first."**

### Soft Gates

- SG-02: UX design exists? "Stories will be richer with UX context."

### 3. Memory Loading

Load relevant memory sidecar(s):

- Read: `{project-root}/_bmad/_memory/dev-squad-sidecar/common-mistakes.md`
- Read: `{project-root}/_bmad/_memory/dev-squad-sidecar/implementation-patterns.md`
- Read: `{project-root}/_bmad/_memory/global-learnings.md`
- Apply learnings as AVOID rules and best practices for this session.

### 4. Mode Detection & Continuation

Detect mode based on user intent or existing documents:

1. **Check for Continuation**:
   - If an existing draft document is found AND it contains `stepsCompleted` array in frontmatter:
   - Ask: "I've found an interrupted session for {project_name}. Would you like to **[C] Resume progress** or start fresh?"
   - If user chooses [C] -> Route to `{continueStep}`

2. **Fresh Creation**:
   - If no existing document OR user chooses to start fresh -> Route to `{nextStep}`

3. **Existing Artifact found**:
   - If a completed artifact is found:
   - Ask: "Existing Stories found. Would you like to **[E] Edit existing**, **[V] Validate existing**, or **[N] Create new**?"
   - If [E] -> Route to `{editStep}`
   - If [V] -> Route to `{validateStep}`
   - If [N] -> Route to `{nextStep}`

### 5. Execution

Read fully and follow the step file determined during Mode Detection.
