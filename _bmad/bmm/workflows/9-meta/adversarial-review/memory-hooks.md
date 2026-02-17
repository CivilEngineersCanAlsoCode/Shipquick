# Memory Hooks: Adversarial Review

## Sidecar Integration

- **Primary Sidecar**: `global-learnings`
- **Sidecar Root**: `_bmad/_memory/global-learnings`

## Capture Strategy

- **Mistake Tracking**: Append any user-corrected assumptions or agent errors to `common-mistakes.md`.
- **Finding Categories**: Log frequent logical flaws detected to `adversarial-patterns.md`.

## Loading Hook

- Always read `common-mistakes.md` during the "Critical Audit" phase.
