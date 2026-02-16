# SAFe 6.0 & BMad Governance Master

This document defines the structural and procedural rules for the Shipquick Factory.

---

## 1. SAFe 6.0 Core Rules

- **Hierarchy**: Strategic Themes -> Portfolio Epics -> Capabilities -> Features -> User Stories.
- **WSJF (Weighted Shortest Job First)**: Cost of Delay / Job Size.
- **Kanban Flow**: Funnel -> Review -> Analysis -> Backlog -> Implementing -> Done.

## 2. Hierarchy Governance

- **ID Convention**: `[ST-XXXX]`, `[E-XXXX]`, `[F-XXXX]`, `[US-XXXX]`.
- **Orphan Prevention**: Every artifact MUST have a parent link.

## 3. BMad methodology (Stateful Memory)

- **Recursive Execution**: Agents must read the `bd` (Brain Dump) before starting work.
- **Manifest-driven**: Every handoff must be validated against the `Agent_Registry.csv`.

## 4. Quality Gate Checklist

### Gate 1: Vision -> Architecture

- PRD must have North Star Metrics and User Personas.

### Gate 2: Architecture -> Delivery

- ADR must document 'Why' and 'Considered Options'.

### Gate 3: Delivery -> Quality

- Stories must have Gherkin (Given/When/Then) Acceptance Criteria.
