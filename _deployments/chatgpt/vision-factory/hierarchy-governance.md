# Hierarchy Governance: SAFe 6.0 Alignment Tree

This document enforces the structural integrity of the Shipquick factory.

### 1. The Parent-Child Rule

- **Strategic Theme** -> Parent of **Portfolio Epics**.
- **Portfolio Epic** -> Parent of **Features**.
- **Feature** -> Parent of **User Stories**.
- **User Story** -> Parent of **Technical Tasks**.

### 2. ID Convention

- **Theme**: `[ST-XXXX]`
- **Epic**: `[E-XXXX]`
- **Feature**: `[F-XXXX]`
- **Story**: `[US-XXXX]`

### 3. Orphan Prevention

Any artifact found without a valid parent link in its metadata MUST be flagged by the **Bmad Master** as an "Orphan Artifact."

### 4. Definition of Ready (DoR) Tree

- An Epic is ready for Solutioning when it has a **Lean Business Case** and **WSJF Score**.
- A Feature is ready for Program Increment when it has a **Description** and **Value Proposition**.
- A Story is ready for Development when it has **Gherkin ACs** and **Technical Notes**.
