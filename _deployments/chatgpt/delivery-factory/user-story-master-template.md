# User Story Master Template (Gherkin Enforced)

---

**ID**: [US-XXXX]
**Status**: DRAFT
**Feature Parent**: [Feature-ID]
**Portfolio Epic**: [Epic-ID]

---

## 1. User Voice

**As a** [Persona Name]
**I want** [Specific Action/Ability]
**So that** [Business Value/Benefit]

## 2. Description & Context

[Provide a deep-dive into the requirement. Explain WHY this is needed and what the technical background is.]

## 3. Acceptance Criteria (Gherkin)

```gherkin
Scenario: [Happy Path Scenario Name]
  Given [Initial Context]
  And [Additional Context]
  When [Action Performed]
  Then [Expected Result]

Scenario: [Edge Case Scenario Name]
  Given [Context with Boundary Condition]
  When [Action Performed]
  Then [Expected Failure or Specific Handling]
```

## 4. Technical Implementation Notes

- **API Endpoints**: [List affected endpoints]
- **Data Model**: [List database fields/changes]
- **UX Tokens**: [Colors, Typography, Layout Constants]
- **Logic Constraints**: [Algorithms, Validations]

## 5. Metadata for Rally/Jira

- **Estimate (Points)**: [1, 2, 3, 5, 8]
- **Priority**: [Critical, High, Medium, Low]
- **Blocked By**: [Link IDs]
- **Ready for Dev**: [YES/NO]
