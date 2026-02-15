# Handoff Registry: The Factory Communication Map

This document defines exactly WHICH agent provides WHAT to WHOM.

| Source Factory           | Target Factory       | Artifact(s)                   | Template To Use                   |
| :----------------------- | :------------------- | :---------------------------- | :-------------------------------- |
| **Bmad Master**          | Vision Factory       | Strategic Intent, Constraints | `context-bridge-template.md`      |
| **Vision Factory**       | Architecture Factory | PRD, Portfolio Epic (LBC)     | `prd-master-template.md`          |
| **Architecture Factory** | Delivery Factory     | Tech Spec, ADR, Wireframes    | `adr-master-template.md`          |
| **Delivery Factory**     | Quality Factory      | User Stories (Gherkin), Code  | `user-story-master-template.md`   |
| **Quality Factory**      | Bmad Master          | Verification Report, Manuals  | `traceability-matrix-template.md` |

### Missing Detail Flags:

If an artifact is received without the following, it must be FLAGGED:

- **PRD**: Missing Success Metrics or Personas.
- **ADR**: Missing Considered Options.
- **Story**: Missing Gherkin Acceptance Criteria.
- **Test Plan**: Missing Traceability Link to User Story.
