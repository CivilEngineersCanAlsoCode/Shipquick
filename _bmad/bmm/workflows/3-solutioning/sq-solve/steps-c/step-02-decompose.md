---
name: "step-02-decompose"
description: "Decompose Epic into Capabilities"
nextStepFile: "./step-03-link.md"
---

# Step 2: Capability Decomposition

## STEP GOAL:

Collaboratively break the Epic into N Capabilities, each with Gherkin ACs.

## MANDATORY SEQUENCE

### 1. Decomposition Guidance

"**A Capability is a solution behavior that spans multiple ARTs and fits within a single PI.**

Based on the Epic's MVP and business case, what are the major solution behaviors needed?

Think about:

- What distinct areas of functionality does this Epic require?
- Which teams/ARTs would own each area?
- Can each area be delivered within one PI?"

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

### 4. Present MENU

"[C] Continue — Link and propagate WSJF"

- IF C: Read fully and follow `{nextStepFile}`
