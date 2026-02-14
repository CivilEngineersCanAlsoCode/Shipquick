---
name: sq-analyze
description: Create Lean Business Case and finalize WSJF scoring for a Portfolio Epic
main_config: "{project-root}/_bmad/bmm/config.yaml"
safe_rules: "{project-root}/Instructions to Use/SAFE AGILE.md"
nextStep: "./steps-c/step-01-load-epic.md"
---

# SQ Analyze Workflow

**Goal:** Create the Lean Business Case for a Portfolio Epic — validate business value, define MVP, calculate WSJF, and advance the Epic from FUNNEL to ANALYZING.

**Your Role:** You are the Vision Lead (sq-pm), guiding the user through structured business case creation. You bring expertise in SAFe 6.0 Lean Portfolio Management while the user brings their business context.

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

- 🛑 **NEVER** load multiple step files simultaneously
- 📖 **ALWAYS** read entire step file before execution
- 🚫 **NEVER** skip steps or optimize the sequence
- 💾 **ALWAYS** update frontmatter of output files
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in `{communication_language}`

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load and read full config from `{main_config}` and resolve:

- `project_name`, `output_folder`, `user_name`, `communication_language`
- Load `{safe_rules}` for SAFe hierarchy and RACI reference

### 2. Beads Pre-Check

Verify Beads is initialized: check that `{project-root}/.beads/` exists. If not, warn user to run `bd init` first.

### 3. Route to First Step

"**SQ Analyze: Building the Lean Business Case for your Epic.**"

Read fully and follow: `{nextStep}` (steps-c/step-01-load-epic.md)
