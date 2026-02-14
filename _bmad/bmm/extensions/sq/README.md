# Shipquick (sq) — SAFe 6.0 Large Solution Extension

**Module Code:** `sq`
**Type:** Extension of `bmm`
**Status:** ✅ Built — 4 agents, 7 workflows, 28 step files

---

## Overview

Shipquick is an Enterprise-Grade SAFe 6.0 Compliance Engine that enforces a strict 1-to-N hierarchy from Strategic Themes to Dev Tasks. It uses Beads (bd) for persistent memory and link integrity.

## Hierarchy

```
Strategic Theme → Portfolio Epic → Capability → Feature → User Story → Task/QA
```

## Agents

| Agent                | File              | Role                                      |
| :------------------- | :---------------- | :---------------------------------------- |
| sq-pm (Priya)        | `sq-pm.md`        | 📊 Vision Lead — Strategy & Decomposition |
| sq-rte (Raj)         | `sq-rte.md`       | 🛡️ Governance Lead — Compliance & Audit   |
| sq-architect (Anika) | `sq-architect.md` | 🏗️ Technical Lead — Enablers & NFRs       |
| sq-team (Dev)        | `sq-team.md`      | ⚡ Execution Lead — Stories & QA          |

## Workflows

| Command       | Purpose                            | Agent   |
| :------------ | :--------------------------------- | :------ |
| `/sq-init`    | Initialize Theme/Epic with WSJF    | sq-pm   |
| `/sq-analyze` | Lean Business Case & WSJF          | sq-pm   |
| `/sq-solve`   | Epic → Capability decomposition    | sq-pm   |
| `/sq-plan`    | Capability → Feature decomposition | sq-pm   |
| `/sq-exec`    | Feature → Story/Task/QA            | sq-team |
| `/sq-audit`   | Compliance & link integrity check  | sq-rte  |
| `/sq-export`  | Jira/Rally CSV generation          | sq-rte  |

## Quick Start

1. **Initialize**: `/sq-init` — Define a theme and create your first epic
2. **Analyze**: `/sq-analyze` — Build the Lean Business Case and score WSJF
3. **Decompose**: `/sq-solve` → `/sq-plan` → `/sq-exec` — Cascade down the hierarchy
4. **Validate**: `/sq-audit` — Check for orphans, broken links, missing ACs
5. **Export**: `/sq-export` — Generate Jira/Rally CSV for bulk import

## Module Structure

```
sq/
├── module.yaml              # Configuration + install variables
├── README.md                # This file
├── TODO.md                  # Development roadmap
├── module-help.csv          # Command registry
├── agents/
│   ├── sq-pm.md             # Vision Lead agent
│   ├── sq-rte.md            # Governance Lead agent
│   ├── sq-architect.md      # Technical Lead agent
│   ├── sq-team.md           # Execution Lead agent
│   └── *.spec.md            # Agent specifications (4 files)
└── workflows/
    ├── sq-init/             # 4 steps
    ├── sq-analyze/          # 4 steps
    ├── sq-solve/            # 4 steps
    ├── sq-plan/             # 3 steps
    ├── sq-exec/             # 4 steps
    ├── sq-audit/            # 5 steps
    └── sq-export/           # 4 steps
```

## Configuration

Key configuration variables in `module.yaml`:

- `safe-hierarchy-depth` — Full (6-level) or Lite (4-level) hierarchy
- `enable-wsjf` — WSJF propagation on/off
- `enable-gherkin-enforcement` — Gherkin ACs required/optional
- `export-format` — Jira, Rally, or both
- `sq-output-folder` — Output location for artifacts

## Reference

- [SAFE AGILE.md](../../../../../../Instructions%20to%20Use/SAFE%20AGILE.md) — Enterprise SAFe rules
- [BEADS_GUIDE.md](../../../../../../Instructions%20to%20Use/BEADS_GUIDE.md) — Beads memory system

---

_Created via BMAD Module workflow on 2026-02-14 | Updated 2026-02-14_
