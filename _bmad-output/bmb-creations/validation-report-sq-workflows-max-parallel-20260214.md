---
validationDate: 2026-02-14
workflowName: SQ Module Workflows (All 7)
workflowPath: _bmad/bmm/extensions/sq/workflows/
validationStatus: COMPLETE
completionDate: 2026-02-14
mode: MAX-PARALLEL
---

# Validation Report: SQ Module Workflows (Max-Parallel)

**Validation Started:** 2026-02-14 | **Mode:** MAX-PARALLEL (11 checks)
**Validator:** BMAD Workflow Validation System
**Scope:** 7 workflows, 42 files (7 entry points + 7 specs + 28 step files)

---

## Table of Contents

- [File Structure & Size](#file-structure--size)
- [Frontmatter Validation](#frontmatter-validation)
- [Critical Path Violations](#critical-path-violations)
- [Menu Handling Validation](#menu-handling-validation)
- [Step Type Validation](#step-type-validation)
- [Output Format Validation](#output-format-validation)
- [Validation Design Check](#validation-design-check)
- [Instruction Style Check](#instruction-style-check)
- [Collaborative Experience Check](#collaborative-experience-check)
- [Subprocess Optimization Opportunities](#subprocess-optimization-opportunities)
- [Cohesive Review](#cohesive-review)
- [Summary](#summary)

---

## File Structure & Size

**Status: ✅ PASS**

### Folder Structure

All 7 workflows follow identical structure:

```
sq-{name}/
├── workflow-sq-{name}.md    (entry point)
├── sq-{name}.spec.md        (specification)
└── steps-c/
    ├── step-01-*.md
    ├── step-02-*.md
    ├── step-03-*.md
    └── step-04-*.md (or step-05 for sq-audit)
```

- ✅ All entry points named `workflow-sq-*.md`
- ✅ All step folders named `steps-c/` (consistent)
- ✅ Sequential numbering, no gaps
- ✅ No `data/` or `templates/` needed (SAFe output is generated from user input)

### File Size Analysis

| Range         |    Count | Status  |
| :------------ | -------: | :-----: |
| 1-50 lines    | 30 files | ✅ Good |
| 51-100 lines  | 10 files | ✅ Good |
| 101-200 lines |  2 files | ✅ Good |
| 200+ lines    |  0 files |    —    |

**All 42 files under 200-line limit.** Largest: `step-02-epic.md` (102 lines).

---

## Frontmatter Validation

**Status: ✅ PASS**

### Entry Points (7 files)

All 7 entry points have identical frontmatter structure:

| Field         | Present |     Used in Body      |
| :------------ | :-----: | :-------------------: |
| `name`        |   ✅    |  ✅ (document title)  |
| `description` |   ✅    | ✅ (role description) |
| `main_config` |   ✅    |  ✅ (config loading)  |
| `safe_rules`  |   ✅    |  ✅ (rules loading)   |
| `nextStep`    |   ✅    |     ✅ (routing)      |

- ✅ No unused frontmatter variables
- ✅ `{project-root}` used correctly for external config references
- ✅ `./` used for internal step references
- ✅ No forbidden `workflow_path` patterns

### Step Files (28 files)

**Two frontmatter patterns observed:**

**Pattern A — Rich (sq-init only, 4 steps):**

- `name`, `description`, `nextStepFile`, `outputFile`, `safeRules`, `parentTheme`, `epicFile`, `themeFile`
- ✅ All variables used in step body

**Pattern B — Minimal (other 6 workflows, 24 steps):**

- `name`, `description`, `nextStepFile` (or none for final steps)
- ✅ All variables used
- ⚠️ References to session variables (`{feat_name}`, `{theme_name}`, `{epic_id}`, `{sq_output_folder}`) used in body but not declared in frontmatter — these are runtime context variables, acceptable but undocumented

---

## Critical Path Violations

**Status: ✅ PASS (1 exception noted)**

### Config Variables (Exceptions)

From entry point `main_config` and `safe_rules`, the following are valid external references:

- `{project-root}/_bmad/bmm/config.yaml`
- `{project-root}/Instructions to Use/SAFE AGILE.md`

### Content Path Violations

| File                               | Line | Issue                                            |                Verdict                 |
| :--------------------------------- | ---: | :----------------------------------------------- | :------------------------------------: |
| `sq-init/steps-c/step-01-theme.md` |    7 | `safeRules: "{project-root}/..."` in frontmatter | ✅ EXCEPTION (external SAFe reference) |

- ✅ No hardcoded `{project-root}` in step body content
- ✅ All internal step-to-step references use `./step-XX.md`

### Dead Links

All 21 `nextStepFile` references resolve to existing files:

| Chain      |                Steps | All Exist |
| :--------- | -------------------: | :-------: |
| sq-init    |    4 → `01→02→03→04` |    ✅     |
| sq-analyze |    4 → `01→02→03→04` |    ✅     |
| sq-solve   |    4 → `01→02→03→04` |    ✅     |
| sq-plan    |       3 → `01→02→03` |    ✅     |
| sq-exec    |    4 → `01→02→03→04` |    ✅     |
| sq-audit   | 5 → `01→02→03→04→05` |    ✅     |
| sq-export  |    4 → `01→02→03→04` |    ✅     |

### Module Awareness

- ✅ Workflows are in `sq` module (not bmb)
- ✅ No bmb-specific path assumptions found

---

## Menu Handling Validation

**Status: ⚠️ WARNING**

### Menu Presence

| Step Type            |  Count |  Has `[C]` Menu  | Has Handler |
| :------------------- | -----: | :--------------: | :---------: |
| Init steps (step-01) |      7 |      ✅ 7/7      |  ⚠️ Inline  |
| Middle steps         |     15 |     ✅ 15/15     |  ⚠️ Inline  |
| Final steps          |      6 | ❌ 0/6 (correct) |     N/A     |
| **Total**            | **28** |    **22/22**     |      —      |

### Menu Pattern Analysis

All 22 menus follow this pattern:

```
"**✓ {item} created/complete:** {name}

[C] Continue — {next action description}"

- IF C: Update frontmatter, read fully and follow `{nextStepFile}`
```

**Checks:**

- ✅ All non-final steps have `[C] Continue` option
- ✅ All `[C]` handlers include "read fully and follow `{nextStepFile}`"
- ✅ No inappropriate A/P (Advanced/Party) options on init steps
- ✅ No A/P on any steps (appropriate — these are SAFe data-gathering workflows, not creative content)
- ⚠️ No explicit handler sections — menus are inline within MANDATORY SEQUENCE (acceptable for simple C-only menus, but not BMAD standard)
- ⚠️ No EXECUTION RULES sections — standard requires "halt and wait" instruction

---

## Step Type Validation

**Status: ✅ PASS**

| Step Type              | Count | Pattern Match | Notes                                  |
| :--------------------- | ----: | :-----------: | :------------------------------------- |
| Init (Non-Continuable) |     7 |      ✅       | Load context, gather input, C-continue |
| Middle (Simple C-only) |    15 |      ✅       | Gather data, create output, C-continue |
| Final                  |     6 |      ✅       | No nextStepFile, completion message    |
| Continuation (01b)     |     0 |      N/A      | Not used (no resumable workflows)      |
| Branch                 |     0 |      N/A      | Not used (linear flows only)           |

- ✅ Step-01 files correctly serve as init steps
- ✅ Final steps (step-04/05) have no `nextStepFile` — correct termination
- ✅ All middle steps are simple C-only (appropriate for SAFe data gathering)
- ✅ Step numbering sequential within each workflow

---

## Output Format Validation

**Status: ⚠️ WARNING**

### Document Production

| Workflow   | Produces Documents | Template Type                   | Has Template File |
| :--------- | :----------------: | :------------------------------ | :---------------: |
| sq-init    |         ✅         | Structured (theme, epic)        |     ❌ Inline     |
| sq-analyze |         ✅         | Structured (business case)      |     ❌ Inline     |
| sq-solve   |         ✅         | Structured (capabilities)       |     ❌ Inline     |
| sq-plan    |         ✅         | Structured (features)           |     ❌ Inline     |
| sq-exec    |         ✅         | Structured (stories, tasks, QA) |     ❌ Inline     |
| sq-audit   |         ✅         | Structured (audit report)       |     ❌ Inline     |
| sq-export  |         ✅         | Strict (CSV)                    |     ❌ Inline     |

**Findings:**

- ✅ All workflows produce well-structured output with YAML frontmatter
- ✅ Output includes `type`, `id`, `parentId`, `status` fields consistently
- ⚠️ Templates are embedded inline in step files rather than in a `templates/` folder — functional but harder to maintain
- ⚠️ No final polish step in any workflow — acceptable since outputs are structured data (not free-form prose)
- ✅ Output saved before loading next step (C handler pattern)

---

## Validation Design Check

**Status: ✅ N/A (by design)**

**Is validation critical for these workflows?** Partially.

- `sq-audit` IS a validation workflow itself — it runs compliance checks
- Other 6 workflows are interactive data-gathering, not compliance-bound
- ✅ `sq-audit` contains validation steps (orphan check, AC validation, WSJF check)
- ✅ `sq-solve/step-04-validate.md` includes inline validation (no orphans, all ACs present)
- Separate `steps-v/` folder not needed — validation is integrated into the flow where required

---

## Instruction Style Check

**Status: ✅ PASS**

**Domain:** SAFe Agile facilitation — **Intent-based** style appropriate.

| Indicator                        | Present | Examples                                             |
| :------------------------------- | :-----: | :--------------------------------------------------- |
| Goal-oriented instructions       |   ✅    | "Guide user to define…"                              |
| Open-ended discovery             |   ✅    | "Tell me: What is the initiative?"                   |
| Context-setting before questions |   ✅    | SAFe concept explanations before each input          |
| Progressive questioning          |   ✅    | 3-4 items per step, not laundry lists                |
| Flexible language                |   ✅    | "Gather from user:" not "Ask exactly:"               |
| Prescriptive where needed        |   ✅    | Gherkin format requirement is correctly prescriptive |

- ✅ All 28 step files use intent-based instructions (appropriate for interactive facilitation)
- ✅ No inappropriate prescriptive patterns
- ✅ Gherkin format requirement is the only prescriptive element (correctly so — it's a SAFe standard)

---

## Collaborative Experience Check

**Status: ✅ GOOD (⭐⭐⭐⭐)**

### Step-by-Step Facilitation Quality

| Pattern                                         |     Assessment     |
| :---------------------------------------------- | :----------------: |
| Questions asked progressively (1-3 at a time)   |         ✅         |
| SAFe concepts explained before asking for input |         ✅         |
| Concrete examples provided                      |         ✅         |
| Clear progress indicators                       | ⚠️ Only in sq-init |
| Menu options describe what's next               |         ✅         |
| Natural, conversational tone                    |         ✅         |
| User knows where they are in the process        |         ⚠️         |

### Strengths

- Each step explains the SAFe concept (e.g., "A Portfolio Epic is a significant initiative that requires a Lean Business Case")
- Concrete examples help users understand expectations
- Progressive data gathering (3-5 items per step, not dumps)
- Completion confirmations after each step ("✓ Created: {name}")

### Areas for Improvement

- ⚠️ Only `sq-init` has "Step X of Y" progress indicators — other workflows lack this
- ⚠️ No error handling for invalid input
- ⚠️ No "go back" option — all workflows are forward-only

### User Experience Assessment

- [x] A collaborative partner working WITH the user
- [ ] A form collecting data FROM the user

**Rating:** ⭐⭐⭐⭐ (Good)

---

## Subprocess Optimization Opportunities

**Status: ⚠️ 3 opportunities identified**

### Pattern Analysis

| Pattern                 | Current                                           | Opportunity                                                          | Priority |
| :---------------------- | :------------------------------------------------ | :------------------------------------------------------------------- | :------: |
| **Per-file subprocess** | sq-audit loads all items in main context          | Each audit check (orphan, AC, WSJF) could run in parallel subprocess |  MEDIUM  |
| **Data operations**     | sq-export format step loads format rules inline   | Could load Jira/Rally mappings from `data/` folder via subprocess    |   LOW    |
| **Parallel execution**  | sq-exec generates stories, tasks, QA sequentially | Stories could be validated in parallel after bulk generation         |   LOW    |

**Note:** These workflows are small (3-5 steps, <100 lines each) — subprocess optimization would provide marginal benefit. The BMAD subprocess patterns are more valuable for larger workflows with 10+ steps.

---

## Cohesive Review

**Status: ✅ GOOD**

### Overall Workflow Family Assessment

The 7 SQ workflows form a **cohesive SAFe decomposition pipeline:**

```
sq-init → sq-analyze → sq-solve → sq-plan → sq-exec
                                                 ↓
                                            sq-audit
                                                 ↓
                                           sq-export
```

| Dimension            |   Rating   | Notes                                                               |
| :------------------- | :--------: | :------------------------------------------------------------------ |
| Goal Clarity         | ⭐⭐⭐⭐⭐ | Each workflow has a clear, specific SAFe purpose                    |
| Logical Flow         | ⭐⭐⭐⭐⭐ | Natural top-down decomposition: Theme→Epic→Capability→Feature→Story |
| Facilitation Quality |  ⭐⭐⭐⭐  | Good concept explanations, progressive questioning                  |
| User Experience      |  ⭐⭐⭐⭐  | Clear menus, completion confirmations                               |
| Goal Achievement     | ⭐⭐⭐⭐⭐ | Produces complete SAFe hierarchy with Gherkin ACs, WSJF, and export |

### Strengths

1. **Complete SAFe hierarchy coverage** — from Strategic Theme to QA Test Cases
2. **Consistent parent-child linking** — every item links back to its parent
3. **Gherkin ACs at every level** — enforced SAFe 6.0 best practice
4. **WSJF propagation** — scores flow from Epic down through hierarchy
5. **Enterprise tool export** — Jira/Rally CSV output closes the loop

### Weaknesses

1. No inter-workflow linking (user must manually chain init→analyze→solve→plan→exec)
2. No resume/recovery mechanism if workflow is interrupted
3. No batch mode for creating multiple items (e.g., 5 Capabilities at once)

**Recommendation:** ✅ **GOOD — Ready for use.** Minor improvements possible (progress indicators, inter-workflow linking).

---

## Summary

**Validation Completed:** 2026-02-14 | **Mode:** MAX-PARALLEL (11 checks)

### Overall Results

| Check                    |       Status       | Issues |
| :----------------------- | :----------------: | -----: |
| File Structure & Size    |      ✅ PASS       |      0 |
| Frontmatter Validation   |      ✅ PASS       |      0 |
| Critical Path Violations |      ✅ PASS       |      0 |
| Menu Handling            |     ⚠️ WARNING     |      2 |
| Step Type Validation     |      ✅ PASS       |      0 |
| Output Format            |     ⚠️ WARNING     |      2 |
| Validation Design        |       ✅ N/A       |      0 |
| Instruction Style        |      ✅ PASS       |      0 |
| Collaborative Experience |      ✅ GOOD       |      2 |
| Subprocess Optimization  | ⚠️ 3 opportunities |      0 |
| Cohesive Review          |      ✅ GOOD       |      0 |

### Critical Issues: 0

### Warnings: 6

|   # | Warning                                            | Impact                                   |
| --: | :------------------------------------------------- | :--------------------------------------- |
|   1 | Inline menu handlers (no separate handler section) | Minor — still functional                 |
|   2 | No EXECUTION RULES sections in step menus          | Minor — C-only menus don't need them     |
|   3 | Templates inline in steps (no `templates/` folder) | Harder to maintain                       |
|   4 | No final polish step                               | Acceptable for structured data output    |
|   5 | Progress indicators only in sq-init                | Users of other workflows lack context    |
|   6 | No error handling for invalid input                | Edge case — SAFe-literate users expected |

### Recommendation

**✅ GOOD — Ready for use with minor improvements.**

The SQ workflow suite is a well-designed, cohesive SAFe decomposition pipeline. All critical checks pass. The 6 warnings are minor and don't affect functionality. The workflows produce complete, linked SAFe hierarchies with Gherkin ACs and enterprise export.

**Suggested next steps:**

1. Add "Step X of Y" progress indicators to all workflows
2. Extract inline templates to `templates/` folders for maintainability
3. Consider an orchestrator workflow that chains init→analyze→solve→plan→exec automatically

---

**[R] Review Detailed Findings | [F] Fix Issues | [X] Exit Validation**
