### [Architecture]: Beads Hierarchy Depth Constraint

- **Date**: 2026-02-16
- **Workflow**: Wave 6 Cleanup & Validation
- **Context**: Attempting to implement a 5-level SAFe hierarchy (Theme -> Epic -> Capability -> Feature -> Story) in Beads.
- **Decision**: Initially followed the blueprint strictly, but hit a "maximum hierarchy depth (3) exceeded" error at the Story level.
- **Outcome**: The User Story could not be registered as a child of the Feature if the Theme was the root (Level 0).
- **Learning**: Beads (v0.49.6) enforces a limit of 3 levels of nesting (0, 1, 2, 3).
- **Prevention**: Combine Strategic Theme and Portfolio Epic into a single Bead Level 0 for future SAFe implementations, or use a flatter hierarchy if Beads tracking is required for all levels.

### [Process]: Workflow Manifest Naming Discrepancies

- **Date**: 2026-02-16
- **Workflow**: Wave 6 Cleanup & Validation
- **Context**: Auditing `.claude/commands/` against `_bmad/_config/workflow-manifest.csv`.
- **Decision**: Discovered that many command names are numbered (e.g., `030-create-theme-and-epic`) while the manifest entries are un-numbered (e.g., `create-theme-and-epic`).
- **Outcome**: The audit script reported 25 missing entries.
- **Learning**: Manifest naming should remain the "canonical" logical name, while command files use the numbered prefix for IDE sorting.
- **Prevention**: Ensure future audits account for this mapping (prefix removal) to avoid false positives.
