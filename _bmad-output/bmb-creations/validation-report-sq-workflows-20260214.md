---
validationDate: 2026-02-14
workflows: sq-init, sq-analyze, sq-solve, sq-plan, sq-exec, sq-audit, sq-export
workflowPath: _bmad/bmm/extensions/sq/workflows/
validationStatus: COMPLETE
---

# Validation Report: All 7 SQ Workflows

**Validation:** 2026-02-14 | **Validator:** BMAD Workflow Validation System
**Total Files:** 42 (7 entry points + 7 specs + 28 step files)

---

## 1. File Structure & Size

**Status: ✅ PASS**

### Folder Structure

| Workflow   |         Entry Point         | Spec |   Steps    | Step Count | Has `data/` | Has `templates/` |
| :--------- | :-------------------------: | :--: | :--------: | ---------: | :---------: | :--------------: |
| sq-init    |  ✅ `workflow-sq-init.md`   |  ✅  | `steps-c/` |          4 |     ❌      |        ❌        |
| sq-analyze | ✅ `workflow-sq-analyze.md` |  ✅  | `steps-c/` |          4 |     ❌      |        ❌        |
| sq-solve   |  ✅ `workflow-sq-solve.md`  |  ✅  | `steps-c/` |          4 |     ❌      |        ❌        |
| sq-plan    |  ✅ `workflow-sq-plan.md`   |  ✅  | `steps-c/` |          3 |     ❌      |        ❌        |
| sq-exec    |  ✅ `workflow-sq-exec.md`   |  ✅  | `steps-c/` |          4 |     ❌      |        ❌        |
| sq-audit   |  ✅ `workflow-sq-audit.md`  |  ✅  | `steps-c/` |          5 |     ❌      |        ❌        |
| sq-export  | ✅ `workflow-sq-export.md`  |  ✅  | `steps-c/` |          4 |     ❌      |        ❌        |

- ✅ All 7 have `workflow-sq-*.md` entry points
- ✅ All 7 use `steps-c/` folder (consistent naming)
- ✅ Sequential step numbering (no gaps)
- ⚠️ No `data/` or `templates/` folders — acceptable since these workflows generate output from user input

### File Sizes

All 42 files are **under 200 lines** (PASS threshold):

| Range         | Count | Status  |
| :------------ | ----: | :-----: |
| 1-50 lines    |    30 | ✅ Good |
| 51-100 lines  |    10 | ✅ Good |
| 101-200 lines |     2 | ✅ Good |
| 200-250 lines |     0 |    —    |
| 250+ lines    |     0 |    —    |

**Largest:** `sq-init/steps-c/step-02-epic.md` (102 lines)
**Smallest:** `sq-audit/workflow-sq-audit.md` (17 lines)

---

## 2. Workflow Entry Point Validation

**Status: ⚠️ WARNING — 6 of 7 entry points are structurally incomplete**

### Finding: Inconsistent Entry Point Depth

| Workflow   | Lines | Has Architecture | Has Core Principles | Has Step Rules | Has Critical Rules |
| :--------- | ----: | :--------------: | :-----------------: | :------------: | :----------------: |
| sq-init    |    57 |        ✅        |         ✅          |       ✅       |         ✅         |
| sq-analyze |    37 |        ❌        |         ❌          |       ❌       |         ❌         |
| sq-solve   |    27 |        ❌        |         ❌          |       ❌       |         ❌         |
| sq-plan    |    17 |        ❌        |         ❌          |       ❌       |         ❌         |
| sq-exec    |    17 |        ❌        |         ❌          |       ❌       |         ❌         |
| sq-audit   |    17 |        ❌        |         ❌          |       ❌       |         ❌         |
| sq-export  |    17 |        ❌        |         ❌          |       ❌       |         ❌         |

**Issue:** `sq-init` is the gold standard with full BMAD step-file architecture documentation (micro-file design, JIT loading, state tracking, processing rules, critical rules). The other 6 workflows have only a minimal 2-section entry point (frontmatter + initialization).

**Impact:** LLMs loading these workflows won't receive the step-file architecture instructions, potentially causing them to deviate from the disciplined sequential processing pattern.

---

## 3. Frontmatter Validation

**Status: ⚠️ WARNING**

### Entry Point Frontmatter (All 7)

| Field         | sq-init | sq-analyze | sq-solve | sq-plan | sq-exec | sq-audit | sq-export |
| :------------ | :-----: | :--------: | :------: | :-----: | :-----: | :------: | :-------: |
| `name`        |   ✅    |     ✅     |    ✅    |   ✅    |   ✅    |    ✅    |    ✅     |
| `description` |   ✅    |     ✅     |    ✅    |   ✅    |   ✅    |    ✅    |    ✅     |
| `main_config` |   ✅    |     ✅     |    ✅    |   ✅    |   ✅    |    ✅    |    ✅     |
| `safe_rules`  |   ✅    |     ✅     |    ✅    |   ✅    |   ✅    |    ✅    |    ✅     |
| `nextStep`    |   ✅    |     ✅     |    ✅    |   ✅    |   ✅    |    ✅    |    ✅     |

- ✅ All frontmatter variables are used in body
- ✅ `{project-root}` used for external references (correct)
- ✅ `./` used for internal step references (correct)
- ✅ No forbidden `workflow_path` patterns

### Step File Frontmatter

**Sampled 8 step files across 4 workflows:**

- ✅ `nextStepFile` consistently uses `./step-XX-name.md` (correct relative path)
- ✅ `outputFile` uses `{sq_output_folder}` template variable (correct)
- ⚠️ Some step files reference variables not declared in frontmatter (e.g., `{feat_name}`, `{feat_id}`, `{theme_id}`, `{epic_id}`) — these are runtime session variables from prior steps, which is acceptable but undocumented
- ⚠️ `step-05-report.md` (sq-audit) references `{sq_output_folder}` in body but doesn't declare it in frontmatter
- ✅ No `thisStepFile` or `workflowFile` forbidden patterns found

---

## 4. Step Type & Design Validation

**Status: ✅ PASS**

All step files follow consistent BMAD patterns:

- ✅ Every step has `## STEP GOAL:` section
- ✅ Every step has `## MANDATORY SEQUENCE` section
- ✅ Steps use `### N.` numbered sections (sequential)
- ✅ Menu-presenting steps use `[C] Continue` convention
- ✅ Final steps produce output documents or reports
- ✅ Steps reference `{nextStepFile}` for chaining (except final steps)

### Step Type Distribution

| Type                      | Count | Pattern                          |
| :------------------------ | ----: | :------------------------------- |
| Load/Scan (input steps)   |     7 | Load parent item, gather context |
| Generate (creation steps) |    14 | Create documents from user input |
| Validate (check steps)    |     4 | Run compliance checks            |
| Report (output steps)     |     3 | Compile audit/export reports     |

---

## 5. Output Format Validation

**Status: ✅ PASS**

All output-generating steps produce well-structured markdown with:

- ✅ YAML frontmatter with `type`, `id`, `parentId`, `status`
- ✅ SAFe item types: `strategic-theme`, `portfolio-epic`, `capability`, `feature`, `user-story`, `audit-report`
- ✅ Gherkin AC format used consistently at Epic, Capability, Feature, Story levels
- ✅ Parent linking via markdown links `[{parent_name}]({parent_path})`
- ✅ Children sections for forward linking

---

## 6. Collaborative Experience

**Status: ✅ PASS**

- ✅ All steps start with context-setting messages to the user
- ✅ Steps explain SAFe concepts before asking for input
- ✅ User is asked open-ended discovery questions (not just form-filling)
- ✅ Menu options are clear with single-letter triggers
- ✅ Progress indicators: "Step X of Y" shown in sq-init steps

---

## 7. Missing `workflow-plan.md`

**Status: ⚠️ WARNING**

No `workflow-plan.md` files exist in any of the 7 workflow folders. These files are referenced by the validation workflow (step-01) for verifying completeness against design.

---

## Summary

| Category                 |   Status   |       Issues |
| :----------------------- | :--------: | -----------: |
| File Structure           |  ✅ PASS   |            0 |
| File Sizes               |  ✅ PASS   |            0 |
| Entry Point Completeness | ⚠️ WARNING | 6 incomplete |
| Frontmatter Compliance   | ⚠️ WARNING |      2 minor |
| Step Chaining            |  ✅ PASS   |            0 |
| Step Design              |  ✅ PASS   |            0 |
| Output Formats           |  ✅ PASS   |            0 |
| Collaborative UX         |  ✅ PASS   |            0 |
| workflow-plan.md         | ⚠️ WARNING |    7 missing |

**Overall: ⚠️ WARNINGS — Workflows are functional but 6 entry points need architecture sections**

---

## Recommendations

### Priority 1 — High (6 entry points)

1. **Expand 6 minimal workflow entry points** to match `sq-init`'s standard — add step-file architecture section with core principles, step processing rules, and critical rules

### Priority 2 — Medium

2. Add undeclared session variables as comments in step file frontmatter for clarity
3. Create `workflow-plan.md` files for design traceability (optional but recommended)

### Priority 3 — Low

4. Add `data/` folders for SAFe templates (Theme, Epic, Capability, Feature templates)
5. Add progress indicators ("Step X of Y") to all workflows (currently only sq-init has them)

---

**What would you like to do?**

- **[F]ix** — Expand the 6 incomplete entry points to match sq-init standard
- **[S]ave & Exit** — Keep this report

---

**Validation Completed:** 2026-02-14T22:34+05:30
