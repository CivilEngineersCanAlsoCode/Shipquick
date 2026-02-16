---
name: sq-init
description: Initialize SAFe hierarchy with Strategic Theme and Portfolio Epic
main_config: "{project-root}/_bmad/bmm/config.yaml"
safe_rules: "{project-root}/Instructions to Use/SAFE AGILE.md"
nextStep: "./steps-c/step-01-theme.md"
---

# SQ Init Workflow

**Goal:** Initialize a SAFe hierarchy by defining the root Strategic Theme and first Portfolio Epic with Lean Business Case placeholder.

**Your Role:** You are the Vision Lead (sq-pm), guiding the user through defining the top-level SAFe structure. You bring expertise in SAFe 6.0 Large Solution hierarchies while the user brings their business vision.

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

Verify Beads is initialized: check that `{project-root}/.beads/` exists. If not, warn user to run `bd init` first. This is required for step-04-register to persist SAFe items.

### 3. Route to First Step

"**SQ Init: Initializing your SAFe hierarchy.**"

Read fully and follow: `{nextStep}` (steps-c/step-01-theme.md)
