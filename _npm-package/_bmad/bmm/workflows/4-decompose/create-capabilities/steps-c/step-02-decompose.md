---
name: "step-02-decompose"
description: "Decompose Epic into Capabilities"
nextStepFile: "./step-03-link.md"
beadsCommand: 'bd create --type=task --title="Cap: {name}" --parent={epic_bead_id}'
qualityGate: hard
---

# Step 2: Capability Decomposition

## STEP GOAL:

Collaboratively break the Epic into N Capabilities, each with Gherkin ACs.

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
2. [ ] Epic loaded successfully from step-01

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

## MANDATORY SEQUENCE

### 1. Decomposition Guidance

"**A Capability is a solution behavior that spans multiple ARTs and fits within a single PI.**

**[DATA LOADED]** Loading `decomposition-patterns.csv` for PI-sizing strategy...

Based on the Epic's MVP and business case, what are the major solution behaviors needed?
"

### 2. For Each Capability

Gather from user:

- **Capability Name**: Solution-level behavior description
- **Description**: What this capability enables
- **Acceptance Criteria** (Gherkin):
  ```gherkin
  Given [context]
  When [action]
  Then [measurable outcome]
  ```

Create capability document:

```markdown
---
type: capability
id: CAP-{N}
parentId: { epic_id }
wsjf: { inherited_wsjf }
status: IDENTIFIED
---

# Capability: {name}

## Parent Epic

[{epic_name}]({epic_path})

## Description

{description}

## Acceptance Criteria

{gherkin_acs}

## Children

- _(Features will be linked here)_
```

### 3. Review All Capabilities

"**Created {N} Capabilities:**
{list with names and IDs}

Does this cover all aspects of the Epic? Want to add or modify any?"

## BEADS INTEGRATION

For each capability created:

- Run: `bd create --type=task --title="Cap: {capability_name}" --parent={epic_bead_id}`
- Store returned bead ID in capability document frontmatter as `beadId`
- These IDs will be used as parents when creating Features

## MEMORY CAPTURE

After this step completes, check if any of these occurred:

- New decomposition pattern identified
- Difficulty in sizing capabilities for PI

If yes, append entry to: `portfolio-sidecar/decomposition-patterns.md`

### 4. Present MENU

"## QUALITY GATE

- **PASS:** Capabilities have Gherkin ACs, 2-7 items created (per decomposition-patterns.csv), WSJF inherited.
- **FAIL:** Non-Gherkin ACs or capability count outside recommended range.

[C] Continue — Link and propagate WSJF
"

- IF C: Read fully and follow `{nextStepFile}`
