---
name: "step-01-scan"
description: "Traverse and scan the full hierarchy"
nextStepFile: "./step-02-orphan-check.md"
beadsCommand: "bd list --status=open"
qualityGate: hard
---

# Step 1: Hierarchy Scan

## STEP GOAL:

Traverse all items from Theme to Task and catalog them for audit.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
   - If FAIL: "GATE FAILED [HG-01]: Beads not initialized. Run `bd init` before proceeding."

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

## TRIMODAL_ROUTING

- **IF mode=CREATE** -> Proceed to Section 1 (Scan Sources)
- **IF mode=EDIT** -> Route to `../steps-e/step-e-01-load.md` (if exists) or restart CREATE
- **IF mode=VALIDATE** -> Route to `../steps-v/step-v-01-discovery.md` (if exists) or restart CREATE

## MANDATORY SEQUENCE

### 1. Scan Sources

Scan both Beads DB and file system for all SAFe items:

- Strategic Themes
- Portfolio Epics
- Capabilities
- Features
- User Stories
- Dev Tasks
- QA Test Cases

### 2. Build Hierarchy Map

Construct a tree showing all items and their parent-child relationships.

### 3. Present Scan Results

"**Hierarchy Scan Complete**

| Level        | Count |
| ------------ | ----- |
| Themes       | {n}   |
| Epics        | {n}   |
| Capabilities | {n}   |
| Features     | {n}   |
| Stories      | {n}   |
| Tasks        | {n}   |
| QA Cases     | {n}   |

**Total Items:** {total}

## MEMORY CAPTURE

After this step completes, check if any of these occurred:

- A decision was made that could inform future sessions
- A mistake was caught and corrected

If yes, append entry to: `governance-sidecar/audit-history.md`

## BEADS INTEGRATION

- Run: `bd list --status=open` to enumerate all tracked items
- Run: `bd create --type=task --title="Audit: {date}"` to track this audit
- Cross-reference beads with file system artifacts for completeness

- IF C: Read fully and follow `{nextStepFile}`
