# Module Brief: sq

**Date:** 2026-02-14
**Author:** Satvik Jain
**Module Code:** `sq`
**Module Type:** Extension (of `bmm`)
**Status:** Ready for Development

---

## Executive Summary

**Shipquick (sq)** is an Enterprise-Grade Large Solution SAFe 6.0 Compliance Engine designed to automate and enforce strict requirement hierarchies within the **Whole ART Execution Team**.

**Module Category:** Compliance & Agile Orchestration
**Target Users:** Solution Train (STE/PM), Agile Release Train (RTE/Product Mgmt), and Agile Teams (Dev/QA).
**Complexity Level:** High (Multi-agent architecture with recursive decomposition and persistent graph-based memory).

---

## Module Identity

### Module Code & Name

- **Code:** `sq`
- **Name:** Shipquick

### Core Concept

Shipquick enforces an unbreakable 1-to-N hierarchy from **Strategic Themes** down to **Dev Tasks**. It uses **Beads (bd)** as a persistent "Digital Memory" to ensure that no orphaned requirements are created and that every story is traceable to a business objective.

### Personality Theme

**Serious Professional**: The agents act like elite corporate consultants or mission control operators—efficient, precise, and focused on audit-readiness.

---

## Module Type

**Type:** Extension (of `bmm`)

Shipquick extends the core `bmm` module by adding SAFe 6.0 specific layers (Capability, Theme) and overriding standard decomposition workflows with gated, hierarchical logic.

---

## Unique Value Proposition

**What makes this module special:**

- **100% Traceability**: Every User Story is guaranteed to have a parent link chain reaching a Strategic Theme.
- **Built-in Quality**: Gherkin ACs are mandated at all levels, and the `sq audit` gate ensures compliance before execution.
- **Recursive Efficiency**: Bulk decomposition speeds up PI Planning from days to minutes.

**Why users would choose this module:**

Users choose Shipquick because it bridges the gap between local development speed and enterprise-level compliance, providing a "Shift-Left" approach to SAFe governance.

---

## User Scenarios

### Target Users

The entire **Agile Release Train (ART)**: PMs for vision, RTEs for governance, Architects for technical guardrails, and Teams for execution.

### Primary Use Case

**The PI Planning Rush**: A PM needs to decompose 5 Portfolio Epics into Capabilities and Features for 3 different ARTs within an hour. Shipquick handles the mapping, WSJF propagation, and Gherkin AC generation in seconds.

### User Journey

1. `sq init`: Define the root **Strategic Theme**.
2. `sq analyze`: Define **Portfolio Epics** and **MVP** with Lean Business Cases.
3. `sq solution`: (STE/Solution Mgmt) Decompose into **Capabilities** (Solution Train level).
4. `sq plan`: (RTE/Product Mgmt) Decompose into **Features** (ART level).
5. `sq exec`: (Agile Team) Decompose into **Stories**, **Tasks**, and **QA Cases**.
6. `sq audit`: Verify compliance and link integrity.
7. `sq export`: Generate Jira/Rally CSV for enterprise sync.

---

## Agent Architecture

### Agent Count Strategy

**Multi-Agent**: SAFe 6.0 roles (PM, Architect, RTE) have distinct separation of concerns and RACI-defined responsibilities, necessitating specialized agent personas.

### Agent Roster

| Agent              | Name            | Role                    | Expertise                          |
| ------------------ | --------------- | ----------------------- | ---------------------------------- |
| **PM Agent**       | Vision Lead     | Portfolio/Solution Mgmt | WSJF, Strategy, Decomposition      |
| **RTE Agent**      | Governance Lead | RTE / STE               | Compliance, `bd list`, Audit Gates |
| **Architect**      | Technical Lead  | Sol/Sys Architect       | Solution Intent, Enablers, NFRs    |
| **Dev/QA Sidecar** | Execution Lead  | Agile Team Support      | Story-to-Task, Gherkin Test Cases  |

### Agent Interaction Model

Agents interact via a shared **Beads Database**, where each agent "signs off" on their layer before the next can proceed. They use a **Context Thread** to propagate business value labels (WSJF/Risk) down the chain.

### Agent Communication Style

Analytical, value-driven, and systematic.

---

## Workflow Ecosystem

### Core Workflows (Essential)

- `sq init`: Initialize Theme/Epic.
- `sq analyze`: Lean Business Case & WSJF analysis.
- `sq solve`: Epic to Capability decomposition.

### Feature Workflows (Specialized)

- `sq plan`: Capability to Feature breakdown.
- `sq exec`: Feature to Story/Task/QA breakdown.

### Utility Workflows (Support)

- `sq audit`: Compliance and orphan check gate.
- `sq export`: Enterprise CSV generation.

---

## Tools & Integrations

### MCP Tools

- **Beads (bd)**: Primary memory and tracking tool.
- **TEA**: Traceability matrix generation.

### External Services

- **Jira/Rally**: CSV-based export (Present) -> API sync (Future).

### Integrations with Other Modules

- **bmm**: Extends the core requirement decomposition logic.
- **Beads**: Native integration for state awareness.

---

## Creative Features

### Personality & Theming

Elite Corporate Consulting vibe with ASCII "Compliance Stamps" upon successful audit.

### Easter Eggs & Delighters

- **PI Progress Bar**: Visual "ART Readiness" tracker.
- **RTE's Wisdom Bits**: Automated pro-tips on SAFe principles.

### Module Lore

The "Safe-Net": A universe where chaos is managed through perfect hierarchy.

---

## Next Steps

1. **Review this brief** — Ensure it aligns with Amex enterprise standards.
2. **Run create-module-sq** — (To be implemented) Build the folder structure.
3. **Register sq in .kilocodemodes** — Enable the specific agent instructions.

---

_brief created on 2026-02-14 by Satvik Jain using the BMAD Module workflow_
