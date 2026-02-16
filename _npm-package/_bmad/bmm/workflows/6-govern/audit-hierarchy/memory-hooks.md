# Memory Hooks: Hierarchy Audit

## Sidecar Integration

- **Primary Sidecar**: `governance-sidecar`
- **Sidecar Root**: `_bmad/_memory/governance-sidecar`

## Capture Strategy

- **Audit Findings**: Append summaries of audit failures to `audit-history.md`.
- **Mistake Tracking**: Log common hierarchy errors (orphan stories, missing ACs) to `common-mistakes.md` to prevent them in future decomposition steps.
- **Compliance Exceptions**: Log any approved deviations from SAFe standards to `compliance-exceptions.md`.

## Loading Hook

- Load `audit-history.md` and `common-mistakes.md`.
