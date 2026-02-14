---
agentName: "sq-pm, sq-rte, sq-architect, sq-team"
hasSidecar: false (all 4)
module: "sq"
validationDate: "2026-02-14"
stepsCompleted:
  - v-01-load-review.md
  - v-02a-validate-metadata.md
  - v-02b-validate-persona.md
  - v-02c-validate-menu.md
  - v-02d-validate-structure.md
  - v-02e-validate-sidecar.md
  - v-03-summary.md
---

# Validation Report: SQ Agents (Batch — All 4)

## Agent Overview

| Agent        | Name            | Title                          | Icon | Lines | Module |
| :----------- | :-------------- | :----------------------------- | :--: | ----: | :----: |
| sq-pm        | Vision Lead     | SAFe Product/Solution Manager  |  📊  |    77 |   sq   |
| sq-rte       | Governance Lead | SAFe RTE / STE                 |  🛡️  |    76 |   sq   |
| sq-architect | Technical Lead  | SAFe Solution/System Architect |  🏗️  |    77 |   sq   |
| sq-team      | Execution Lead  | SAFe Agile Team Agent          |  ⚡  |    77 |   sq   |

**Configuration:** All 4 agents WITHOUT sidecar
**Format:** XML-in-Markdown (`.md` with embedded `<agent>` XML in fenced code block)

---

## Validation Findings

### Metadata Validation

**Status:** ⚠️ WARNING

| Field                 |         sq-pm         |         sq-rte         |         sq-architect         |         sq-team         |
| :-------------------- | :-------------------: | :--------------------: | :--------------------------: | :---------------------: |
| `id` (kebab-case)     | ✅ `sq-pm.agent.yaml` | ✅ `sq-rte.agent.yaml` | ✅ `sq-architect.agent.yaml` | ✅ `sq-team.agent.yaml` |
| `name` (display)      |    ✅ Vision Lead     |   ✅ Governance Lead   |      ✅ Technical Lead       |    ✅ Execution Lead    |
| `title` (description) |          ✅           |           ✅           |              ✅              |           ✅            |
| `icon` (emoji)        |         ✅ 📊         |         ✅ 🛡️          |            ✅ 🏗️             |          ✅ ⚡          |
| `module` field        |      ❌ Missing       |       ❌ Missing       |          ❌ Missing          |       ❌ Missing        |
| `hasSidecar` field    |      ❌ Missing       |       ❌ Missing       |          ❌ Missing          |       ❌ Missing        |

**Findings:**

_PASSING:_

- All 4 agents have id, name, title, icon in the `<agent>` tag
- IDs use kebab-case appended with `.agent.yaml` suffix
- Names are clear and role-specific
- Icons are visually representative

_WARNINGS:_

- ⚠️ `id` values include `.agent.yaml` suffix — standard expects just the kebab-case name (e.g. `sq-pm` not `sq-pm.agent.yaml`)
- ⚠️ No `module` attribute on `<agent>` tag (should be `module="sq"`)
- ⚠️ No `hasSidecar` attribute on `<agent>` tag (should be `hasSidecar="false"`)

---

### Persona Validation

**Status:** ✅ PASS

| Field                                   | sq-pm  | sq-rte | sq-architect | sq-team |
| :-------------------------------------- | :----: | :----: | :----------: | :-----: |
| `role` — specific                       |   ✅   |   ✅   |      ✅      |   ✅    |
| `identity` — defines character          |   ✅   |   ✅   |      ✅      |   ✅    |
| `communication_style` — speech patterns |   ✅   |   ✅   |      ✅      |   ✅    |
| `principles` — actionable, 3-7 count    | ✅ (5) | ✅ (5) |    ✅ (5)    | ✅ (5)  |
| Consistency across fields               |   ✅   |   ✅   |      ✅      |   ✅    |

**Findings:**

_PASSING:_

- All roles are specific and SAFe-aligned (not generic "assistant")
- Identities are unique per agent with clear character definition
- Communication styles are distinct: value-driven (PM), systematic (RTE), analytical (Architect), task-oriented (Team)
- First principle activates domain knowledge in each agent
- Principles are actionable, not vague platitudes
- 5 principles each — within recommended 3-7 range
- No contradictions between persona elements

_WARNINGS:_

- ⚠️ Principles are formatted as a single hyphen-separated string rather than a YAML array — parseable but not ideal for tooling

---

### Menu Validation

**Status:** ⚠️ WARNING

**Summary per agent:**

| Agent        | Items | MH/CH/PM/DA |        Custom Cmds | Has `exec` | Issues |
| :----------- | ----: | :---------: | -----------------: | ---------: | -----: |
| sq-pm        |     8 |     ✅      | 4 (SI, SA, SS, SP) |          4 |      1 |
| sq-rte       |     7 |     ✅      |     3 (AU, ST, EX) |          2 |      2 |
| sq-architect |     8 |     ✅      | 4 (IN, EN, NF, AD) |          0 |      4 |
| sq-team      |     8 |     ✅      | 4 (SE, GT, SB, DD) |          1 |      3 |

**Findings:**

_PASSING:_

- All agents include standard MH, CH, PM, DA items ✅
- Trigger format follows `XX or fuzzy match on command` pattern ✅
- Descriptions start with `[XX]` code matching trigger ✅
- Codes are unique within each agent ✅
- PM and DA reserved codes used correctly for standard functions ✅
- Fuzzy match alternatives are meaningful and discoverable ✅

_CRITICAL — Menu exec paths point to `.spec.md` instead of `workflow-_.md`:\*

| Agent   | Menu Item | Current `exec` Path             | Should Be                           |
| :------ | :-------- | :------------------------------ | :---------------------------------- |
| sq-pm   | [SI]      | `sq-init/sq-init.spec.md`       | `sq-init/workflow-sq-init.md`       |
| sq-pm   | [SA]      | `sq-analyze/sq-analyze.spec.md` | `sq-analyze/workflow-sq-analyze.md` |
| sq-pm   | [SS]      | `sq-solve/sq-solve.spec.md`     | `sq-solve/workflow-sq-solve.md`     |
| sq-pm   | [SP]      | `sq-plan/sq-plan.spec.md`       | `sq-plan/workflow-sq-plan.md`       |
| sq-rte  | [AU]      | `sq-audit/sq-audit.spec.md`     | `sq-audit/workflow-sq-audit.md`     |
| sq-rte  | [EX]      | `sq-export/sq-export.spec.md`   | `sq-export/workflow-sq-export.md`   |
| sq-team | [SE]      | `sq-exec/sq-exec.spec.md`       | `sq-exec/workflow-sq-exec.md`       |

_WARNINGS — Menu items missing `exec` attribute:_

- sq-rte: `[ST]` ART Status — no exec/workflow path (inline only)
- sq-architect: `[IN]`, `[EN]`, `[NF]`, `[AD]` — all 4 custom items have no exec path
- sq-team: `[GT]`, `[SB]`, `[DD]` — 3 custom items have no exec path

---

### Structure Validation

**Status:** ⚠️ WARNING

| Check                     | Result | Notes                                           |
| :------------------------ | :----: | :---------------------------------------------- |
| XML parses without errors |   ✅   | All 4 agents parse correctly                    |
| Consistent indentation    |   ✅   | 6-space indent within XML                       |
| No duplicate tags         |   ✅   | Clean structure                                 |
| Frontmatter present       |   ✅   | YAML frontmatter with name + description        |
| `<activation>` section    |   ✅   | 8-step activation in all 4                      |
| `<persona>` section       |   ✅   | role, identity, communication_style, principles |
| `<menu>` section          |   ✅   | Properly structured items                       |
| `<rules>` section         |   ✅   | SAFe-specific rules per agent                   |
| `<menu-handlers>` section |   ✅   | exec + workflow handlers                        |
| Size under ~250 lines     |   ✅   | All under 80 lines                              |
| No sidecar references     |   ✅   | Correct for hasSidecar=false                    |

_WARNINGS:_

- ⚠️ `<activation>` and `<persona>` are on the same line (line 59 in each) — `</activation>  <persona>` should be on separate lines
- ⚠️ The XML is inside a markdown fenced code block — not standard `.agent.yaml` format but functionally equivalent for LLM parsing

---

### Sidecar Validation

**Status:** ✅ N/A

All 4 agents have hasSidecar: false (implicit — no hasSidecar attribute present).

- [x] No sidecar-folder path in metadata ✅
- [x] No sidecar references in menu handlers ✅
- [x] No sidecar references in critical_actions ✅
- [x] No sidecar file paths ✅

---

## Overall Summary

| Check     | sq-pm | sq-rte | sq-architect | sq-team |
| :-------- | :---: | :----: | :----------: | :-----: |
| Metadata  |  ⚠️   |   ⚠️   |      ⚠️      |   ⚠️    |
| Persona   |  ✅   |   ✅   |      ✅      |   ✅    |
| Menu      |  ⚠️   |   ⚠️   |      ⚠️      |   ⚠️    |
| Structure |  ⚠️   |   ⚠️   |      ⚠️      |   ⚠️    |
| Sidecar   |  N/A  |  N/A   |     N/A      |   N/A   |

**Overall: ⚠️ WARNINGS — Agents are functional but need path fixes**

---

## Recommendations

### Priority 1 — Critical (7 broken exec paths)

1. **Fix all 7 menu `exec` paths** from `.spec.md` to `workflow-*.md` entry points — these will fail at runtime

### Priority 2 — High

2. Add `module="sq"` and `hasSidecar="false"` attributes to all 4 `<agent>` tags
3. Clean up `id` values — remove `.agent.yaml` suffix (use just `sq-pm`, `sq-rte`, etc.)
4. Fix line 59 — separate `</activation>` and `<persona>` onto their own lines

### Priority 3 — Medium

5. Add `exec` paths for inline-only menu items (IN, EN, NF, AD, GT, SB, DD, ST) or mark as `action="#prompt-id"`
6. Convert principles from single string to proper array format

---

**What would you like to do?**

- **[F]ix in Place** — Fix all issues directly in the agent files
- **[S]ave & Exit** — Save this report
- **[R]etry** — Run validation again after changes

---

**Validation Completed:** 2026-02-14T22:30+05:30
