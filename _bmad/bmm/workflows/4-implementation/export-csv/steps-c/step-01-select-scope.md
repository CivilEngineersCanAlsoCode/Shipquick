---
name: "step-01-select-scope"
description: "Select which items and levels to export"
nextStepFile: "./step-02-format.md"
beadsCommand: "bd list"
qualityGate: hard
---

# Step 1: Select Export Scope

## STEP GOAL:

Let the user choose which hierarchy levels and items to include in the CSV export.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
   - If FAIL: "GATE FAILED [HG-01]: Beads not initialized. Run `bd init` before proceeding."

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

## TRIMODAL_ROUTING

- **IF mode=CREATE** -> Proceed to Section 1 (Scope Options)
- **IF mode=EDIT** -> Route to `../steps-e/step-e-01-load.md` (if exists) or restart CREATE
- **IF mode=VALIDATE** -> Route to `../steps-v/step-v-01-discovery.md` (if exists) or restart CREATE

## MANDATORY SEQUENCE

### 1. Scope Options

"**What would you like to export?**

- **[A] All** — Full hierarchy from Theme to Task
- **[E] Epic down** — Specific Epic and all its children
- **[C] Capability down** — Specific Capability and all children
- **[F] Features only** — Just Features (flat list)
- **[S] Stories only** — Just Stories (flat list)"

### 2. Handle Selection

- IF A: Mark all items for export
- IF E/C: Ask for ID, load that subtree
- IF F/S: Load flat list of that level

### 3. Confirm Scope

"**Exporting {count} items across {levels} levels.**

## MEMORY CAPTURE

After this step completes, check if any of these occurred:

- A decision was made that could inform future sessions
- A mistake was caught and corrected

If yes, append entry to: `governance-sidecar/export-field-mappings.md`

## BEADS INTEGRATION

- Run: `bd list` to enumerate all tracked items for export scope
- Run: `bd create --type=task --title="Export: {date}"` to track this export task

- IF C: Read fully and follow `{nextStepFile}`
