# Memory Hooks: Features Decomposition

## Sidecar Integration

- **Primary Sidecar**: `portfolio-sidecar` (ART Tier)
- **Sidecar Root**: `_bmad/_memory/portfolio-sidecar`

## Capture Strategy

- **Mistake Tracking**: Track "Feature bloat" and "Ambiguous Gherkin ACs" in `common-mistakes.md`.
- **WSJF Calibration**: Log WSJF logic for Features to `wsjf-calibration.md`.
- **Inter-ART Dependencies**: Log discovered dependencies to a new file `dependencies.md` if significant.

## Loading Hook

- Load `common-mistakes.md` and `wsjf-calibration.md`.
