# Module Brief: bmm-safe (BMAD Method with SAFe & UX Research)

**Date:** 2026-01-31
**Author:** Satvik
**Module Code:** bmm-safe
**Module Type:** Scaled Method (SAFe 6.0.1 + Enhanced UX Research)
**Status:** In Design

---

## 1. Executive Summary

The `bmm-safe` module extends the core BMAD Method to support **Large Solution SAFe** and **behavior-driven UX Research**. It replicates the full original `bmm` and `core` structure while adding capabilities for multi-train orchestration and deep user insight discovery.

**Module Category:** Enterprise Scaling Framework with UX Research
**Target Users:** RTEs, STEs, Solution Managers, Product Managers, Architects, Scrum Masters, Developers, UX Researchers, QA Engineers.
**Complexity Level:** Very High (Multi-train, hierarchical backlogs, behavior-based discovery)

---

## 2. SAFe Principles & Best Practices

1. **Hierarchy:** Theme → Epic → Capability → Feature → Story → Task.
2. **Hierarchical Derivation:** Lower-level items are **derived from the Acceptance Criteria (AC)** of the higher-level item.
   - Capability AC → Drive Feature breakdown.
   - Feature AC → Drive User Story breakdown.
   - Story AC → Drive Technical Tasks.
3. **AC Format (Enhanced Gherkin):** Mandatory **Given / When / Then** format. Every groomed item must cover:
   - **Happy Paths:** Successful interactions.
   - **Sad Paths:** Intentional failures/input errors.
   - **Error Paths:** System errors/exception handling.
   - **Edge Cases:** Low-frequency boundary conditions.
   - **NFRs:** Non-functional needs.
4. **Economic View:** All Epics/Features/Capabilities require **WSJF Score** (User/Business Value + Time Criticality + RR/OE / Job Size).
5. **Naming Convention:** Capabilities MUST start with `MVP#` or `Release Name/# (TBD)`.
6. **Capacity Allocation:** Balance work across Features, Enablers, and Tech Debt.
7. **CDP:** Follow the Continuous Delivery Pipeline steps.

---

## 3. Agent Philosophy

### 3.1 Helper-not-Doer Protocol

All agents operate under a strict **"Specialist Helper"** protocol:

- **No Assumptions:** Agents must never assume the user, scope, or details of a requirement.
- **Supportive Drafting:** Agents help _draft_ and _refine_, but they do not _finalize_ without direct user confirmation.
- **Collaborative Suggestion:** Agents roleplay as consultants who suggest the "Best Approach" but wait for user input before proceeding.
- **User Validation:** Every scope boundary or assumption must be explicitly flagged for user approval.

### 3.2 Agent Output Format (Mandatory)

Every agent MUST prefix their output with their name for clear identification:

```
Mary : Whatever Mary wants to say
John : Whatever John wants to say
Quinn : Whatever Quinn wants to say
```

### 3.3 Knowledge-Driven Expertise

- Agents reference dedicated **Knowledge Folders** (or NotebookLM links) for domain expertise.
- Agent instructions reference the knowledge folder path, NOT book titles.
- Core instructions explain HOW to find and apply knowledge from these folders.

---

## 4. Agent Roster (Complete)

### 4.1 Original BMAD Agents (Retained)

| Agent                 | Name    | Role                       | Knowledge Folder                 |
| --------------------- | ------- | -------------------------- | -------------------------------- |
| `analyst`             | Mary    | Business Analyst           | `knowledge/analyst/`             |
| `pm`                  | John    | Product Manager            | `knowledge/pm/`                  |
| `architect`           | Winston | Architect                  | `knowledge/architect/`           |
| `sm`                  | Bob     | Scrum Master               | `knowledge/sm/`                  |
| `dev`                 | Amelia  | Developer                  | `knowledge/dev/`                 |
| `ux-designer`         | Sally   | UX/UI Designer             | `knowledge/ux-designer/`         |
| `quick-flow-solo-dev` | Solo    | Rapid Prototype Dev        | `knowledge/quick-flow-solo-dev/` |
| `quinn`               | Quinn   | QA & Automation Specialist | `knowledge/quinn/`               |
| `tech-writer`         | Tech    | Technical Documentation    | `knowledge/tech-writer/`         |

### 4.2 New SAFe Roles

| Agent                | Name       | SAFe Role               | Knowledge Folder                |
| -------------------- | ---------- | ----------------------- | ------------------------------- |
| `solution-manager`   | Mary Sr    | Solution Management     | `knowledge/solution-manager/`   |
| `ste`                | Bob Sr     | Solution Train Engineer | `knowledge/ste/`                |
| `rte`                | Bob Jr     | Release Train Engineer  | `knowledge/rte/`                |
| `solution-architect` | Winston Sr | Solution Architect      | `knowledge/solution-architect/` |
| `system-architect`   | Winston Jr | System Architect        | `knowledge/system-architect/`   |
| `po`                 | John Jr    | Product Owner           | `knowledge/po/`                 |

### 4.3 New UX Research Role

| Agent           | Name | Role                   | Knowledge Folder           |
| --------------- | ---- | ---------------------- | -------------------------- |
| `ux-researcher` | Maya | UX Research Specialist | `knowledge/ux-researcher/` |

---

## 5. Workflow Ecosystem

### 5.1 Phase 1: Analysis (Original + Enhanced)

| Workflow               | Code | Agent           | Description                                   |
| ---------------------- | ---- | --------------- | --------------------------------------------- |
| Brainstorm Project     | BP   | `analyst`       | Expert guided facilitation.                   |
| Market Research        | MR   | `analyst`       | Market analysis and trends.                   |
| Domain Research        | DR   | `analyst`       | Industry domain deep dive.                    |
| Technical Research     | TR   | `analyst`       | Technical feasibility analysis.               |
| Create Brief           | CB   | `analyst`       | Nail down product idea.                       |
| Validate Brief         | VB   | `analyst`       | Validates completeness.                       |
| Document Project       | DP   | `analyst`       | Analyze existing project.                     |
| **User Discovery**     | UD   | `ux-researcher` | **NEW:** Gap identification, context capture. |
| **Interview Prep**     | IP   | `ux-researcher` | **NEW:** Behavior-based interview guide.      |
| **Research Synthesis** | RS   | `ux-researcher` | **NEW:** Convert insights to JTBD/Metrics.    |

### 5.2 Phase 2: Planning (Original + Enhanced)

| Workflow         | Code | Agent         | Description                    |
| ---------------- | ---- | ------------- | ------------------------------ |
| Create PRD       | CP   | `pm`          | Product Requirements Document. |
| Validate PRD     | VP   | `pm`          | Validates PRD.                 |
| Create UX        | CU   | `ux-designer` | UX design guidance.            |
| Validate UX      | VU   | `ux-designer` | Validates UX deliverables.     |
| Create Diagrams  | CED  | `ux-designer` | Excalidraw diagrams.           |
| **WSJF Scoring** | WS   | `pm`          | **SAFe:** Prioritization.      |

### 5.3 Phase 3: Solutioning (Original + SAFe)

| Workflow                       | Code | Agent                | Description                                 |
| ------------------------------ | ---- | -------------------- | ------------------------------------------- |
| Create Architecture            | CA   | `architect`          | Technical decisions.                        |
| Validate Architecture          | VA   | `architect`          | Validates architecture.                     |
| Create Epics & Stories         | CE   | `pm`                 | Backlog breakdown.                          |
| Validate Epics & Stories       | VE   | `pm`                 | Validates completeness.                     |
| Check Implementation Readiness | IR   | `architect`          | Alignment check.                            |
| **Solution Intent**            | SI   | `solution-architect` | **SAFe:** Large-scale guardrails.           |
| **Capability Breakdown**       | CB   | `solution-manager`   | **SAFe:** Capability to Feature derivation. |

### 5.4 Phase 4: Implementation (Original + SAFe)

| Workflow            | Code | Agent   | Description                                 |
| ------------------- | ---- | ------- | ------------------------------------------- |
| Sprint Planning     | SP   | `sm`    | Generate sprint plan.                       |
| Sprint Status       | SS   | `sm`    | Status summary.                             |
| Create Story        | CS   | `sm`    | Story preparation.                          |
| Validate Story      | VS   | `sm`    | Story readiness.                            |
| Dev Story           | DS   | `dev`   | Execute implementation.                     |
| Code Review         | CR   | `dev`   | Review and approval.                        |
| Retrospective       | ER   | `sm`    | Lessons learned.                            |
| Automate Tests      | QA   | `quinn` | Automated testing.                          |
| Correct Course      | CC   | `sm`    | Navigate changes.                           |
| **PI Planning**     | PP   | `rte`   | **SAFe:** 3-mode session.                   |
| **ART Sync**        | AS   | `rte`   | **SAFe:** Cross-team dependencies.          |
| **Inspect & Adapt** | IA   | `rte`   | **SAFe:** PI System Demo + Problem Solving. |

### 5.5 Anytime Workflows (Original)

| Workflow   | Code | Agent                 | Description              |
| ---------- | ---- | --------------------- | ------------------------ |
| Quick Spec | TS   | `quick-flow-solo-dev` | Quick one-off specs.     |
| Quick Dev  | QD   | `quick-flow-solo-dev` | Quick implementation.    |
| Party Mode | PM   | `bmad-master`         | Multi-agent discussions. |

---

## 6. Knowledge Folder Structure

Each agent has a dedicated knowledge folder with a `prompt.md` file containing detailed expertise.

```
_bmad-safe/bmm-safe/knowledge/
├── analyst/prompt.md
├── pm/prompt.md
├── architect/prompt.md
├── sm/prompt.md
├── dev/prompt.md
├── ux-designer/prompt.md
├── ux-researcher/prompt.md
├── quinn/prompt.md
├── tech-writer/prompt.md
├── quick-flow-solo-dev/prompt.md
├── solution-manager/prompt.md
├── ste/prompt.md
├── rte/prompt.md
├── solution-architect/prompt.md
├── system-architect/prompt.md
└── po/prompt.md
```

**Usage Protocol:** Core agent instructions must reference the knowledge folder path and explain how to extract relevant best practices from `prompt.md`.

---

## 7. Rally Integration Standards

### Mandatory Fields (Mapping)

- **Features:** PI Start/Finish Name, WSJF Score, State, Commitment, BRD Link.
- **Stories:** Schedule State, Plan Estimate, Parent Feature Link.
- **Risks:** ROAM category mapping (Resolved, Owned, Accepted, Mitigated).

---

## Next Steps

1. Create `prompt.md` files for each agent's knowledge folder.
2. Design new SAFe agent specs (RTE, STE, etc.).
3. Build new SAFe workflows (PI Planning, ART Sync, I&A).
4. Design UX Research workflows.

---

_brief created on 2026-01-31 by Satvik following SAFe 6.0 and BMAD Method_
