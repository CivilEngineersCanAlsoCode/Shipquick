---
validationDate: 2026-02-14T22:20:02+05:30
targetType: Full Module
moduleCode: sq
targetPath: _bmad/bmm/extensions/sq/
status: COMPLETE
---

# SQ Module Validation Report

**Validate Mode: Full compliance check on BMAD module `sq` (Shipquick)**
**Module Location:** `_bmad/bmm/extensions/sq/`
**Module Type:** Extension of `bmm`

---

## File Structure Validation

**Status:** ⚠️ WARNINGS

| Check                       | Result | Notes                                 |
| :-------------------------- | :----: | :------------------------------------ |
| `module.yaml` exists        |   ✅   | Present, 52 lines                     |
| `README.md` exists          |   ✅   | Present, 52 lines                     |
| `agents/` folder exists     |   ✅   | 8 files (4 specs + 4 implementations) |
| `workflows/` folder exists  |   ✅   | 7 workflow directories                |
| Extension code matches base |   ✅   | `code: bmm` matches base module       |
| Extension folder unique     |   ✅   | `sq` doesn't conflict                 |
| `docs/` folder              |   ❌   | Missing                               |
| `TODO.md` exists            |   ✅   | Present but stale                     |

---

## module.yaml Validation

**Status:** ⚠️ WARNINGS

| Check                       |  Result  |
| :-------------------------- | :------: |
| `code:` valid               | ✅ `bmm` |
| `name:` present             |    ✅    |
| `header:` present           |    ✅    |
| `subheader:` present        |    ✅    |
| `default_selected:` boolean |    ✅    |

**Custom Variables:** 5 — all have `prompt:`, `default:`, `result:`

**Issues:**

- ⚠️ Variable names use `snake_case` — convention is `kebab-case`
- ⚠️ Boolean vars lack `single-select:` with true/false options

---

## Agent Specs Validation

**Status:** ⚠️ WARNINGS

| Agent        | Spec | Built | Format                  |
| :----------- | :--: | :---: | :---------------------- |
| sq-pm        |  ✅  |  ✅   | `.md` (XML-in-Markdown) |
| sq-rte       |  ✅  |  ✅   | `.md` (XML-in-Markdown) |
| sq-architect |  ✅  |  ✅   | `.md` (XML-in-Markdown) |
| sq-team      |  ✅  |  ✅   | `.md` (XML-in-Markdown) |

**Issues:**

- ⚠️ Uses `.md` not `.agent.yaml` — may not be parseable by BMAD installer
- ⚠️ Spec files redundant after build
- ⚠️ `hasSidecar` not documented in specs

---

## Workflow Specs Validation

**Status:** ✅ PASS

All 7 workflows built with proper frontmatter, step-file chains, and menu handling.

| Workflow   | Steps | Entry Point | Step Chain |
| :--------- | ----: | :---------: | :--------: |
| sq-init    |     4 |     ✅      |     ✅     |
| sq-analyze |     4 |     ✅      |     ✅     |
| sq-solve   |     4 |     ✅      |     ✅     |
| sq-plan    |     3 |     ✅      |     ✅     |
| sq-exec    |     4 |     ✅      |     ✅     |
| sq-audit   |     5 |     ✅      |     ✅     |
| sq-export  |     4 |     ✅      |     ✅     |

---

## Documentation Validation

**Status:** ❌ FAIL

- ❌ README says "Scaffolded" — should say "Built"
- ❌ TODO.md all `[ ]` — agents/workflows ARE done
- ❌ No `docs/` folder
- ❌ No usage examples

---

## Installation Readiness

**Status:** ❌ FAIL

- ❌ `module-help.csv` wrong format (5 columns vs required 13)
- ❌ Not in `manifest.yaml`
- ❌ Not in `agent-manifest.csv`
- ❌ Not in `workflow-manifest.csv`
- ❌ Not in `bmad-help.csv`
- ❌ No `.customize.yaml` files
- ❌ No IDE slash commands

---

## Overall Summary

**Status:** ⚠️ WARNINGS — **Not install-ready**

| Section                | Status |
| :--------------------- | :----: |
| File Structure         |   ⚠️   |
| module.yaml            |   ⚠️   |
| Agent Specs            |   ⚠️   |
| Workflow Specs         |   ✅   |
| Documentation          |   ❌   |
| Installation Readiness |   ❌   |

---

## Recommendations

### Priority 1 — Critical

1. Reformat `module-help.csv` to 13-column BMM standard
2. Register in `manifest.yaml`, `agent-manifest.csv`, `workflow-manifest.csv`, `bmad-help.csv`
3. Create 4 `customize.yaml` files

### Priority 2 — High

4. Update README.md status + structure
5. Update TODO.md checkboxes
6. Fix variable naming to kebab-case

### Priority 3 — Medium

7. Create `docs/` folder
8. Add `hasSidecar` to specs
9. Create IDE slash commands
10. Clean up redundant `.spec.md` files

---

**What would you like to do?**

- **[F]ix issues** — Start fixing identified problems
- **[S]ub-process** — Deep validate individual agents/workflows
- **[D]one** — Complete validation

---

**Validation Completed:** 2026-02-14T22:20+05:30
