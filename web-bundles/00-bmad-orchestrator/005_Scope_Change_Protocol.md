# Handoff & Communication Registry

This document links the factories and defines the "Stateful Bridges".

---

## 1. Factory Communication Map

| Source Factory           | Target Factory       | Artifact(s)         | Template To Use        |
| :----------------------- | :------------------- | :------------------ | :--------------------- |
| **Bmad Master**          | Vision Factory       | Strategic Intent    | `Context_Bridge.md`    |
| **Vision Factory**       | Architecture Factory | PRD, Portfolio Epic | `PRD_Master.md`        |
| **Architecture Factory** | Delivery Factory     | ADR, Tech Spec      | `ADR_Master.md`        |
| **Delivery Factory**     | Quality Factory      | User Stories        | `User_Story_Master.md` |

## 2. The Context Bridge Template

The Context Bridge is the **ONLY** way to transfer state between different ChatGPT chat sessions. It must contain:

- **Project Status**: Current Phase (Planning/Solutioning/Execution).
- **Decisions Made**: Key choices from previous agents.
- **Open Risks**: Blockers for the next agent.
- **Artifact Links**: Paths to generated .md files.
