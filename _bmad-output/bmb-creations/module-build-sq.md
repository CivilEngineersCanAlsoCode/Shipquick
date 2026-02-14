---
moduleCode: sq
moduleName: Shipquick
moduleType: Extension
baseModule: bmm
briefFile: "_bmad-output/bmb-creations/module-brief-sq.md"
stepsCompleted:
  [
    "step-01-load-brief",
    "step-02-structure",
    "step-03-config",
    "step-04-agents",
    "step-05-workflows",
    "step-06-docs",
    "step-07-help",
    "step-08-agent-implementations",
    "step-09-workflow-implementations",
    "step-10-validation-fixes",
    "step-11-registration-integration",
  ]
created: 2026-02-14
updated: 2026-02-14
status: COMPLETE
targetLocation: "_bmad/bmm/extensions/sq/"
---

# Module Build: Shipquick (sq)

## Build Progress

- [x] Step 1: Load Brief & Validate
- [x] Step 2: Directory Structure
- [x] Step 3: module.yaml
- [x] Step 4: Agent Specs (4 agents) → Promoted to full implementations
- [x] Step 5: Workflow Specs (7 workflows) → Promoted to full implementations
- [x] Step 6: README & TODO
- [x] Step 7: Help CSV
- [x] Step 8: Agent Implementations (4 agents with personas, menus, activation)
- [x] Step 9: Workflow Implementations (7 entry points + 28 step files)
- [x] Step 10: Validation & Fixes (entry points expanded, exec paths corrected)
- [x] Step 11: Integration (Beads schema, config, TEA link, spec cleanup)

## Files Created

### Root

- `module.yaml`
- `README.md`
- `TODO.md`
- `module-help.csv`
- `data/safe-types.yaml` — Beads schema for SAFe types

### Agents (4 full implementations)

- `agents/sq-pm.md`
- `agents/sq-rte.md`
- `agents/sq-architect.md`
- `agents/sq-team.md`

### Workflows (7 workflows, 28 step files)

- `workflows/sq-init/workflow-sq-init.md` + 4 steps
- `workflows/sq-analyze/workflow-sq-analyze.md` + 4 steps
- `workflows/sq-solve/workflow-sq-solve.md` + 4 steps
- `workflows/sq-plan/workflow-sq-plan.md` + 3 steps
- `workflows/sq-exec/workflow-sq-exec.md` + 4 steps
- `workflows/sq-audit/workflow-sq-audit.md` + 5 steps
- `workflows/sq-export/workflow-sq-export.md` + 4 steps

## Cleanup

- Removed 11 `.spec.md` files (4 agent + 7 workflow) — superseded by full implementations
