---
title: "Definition of Done — Capability Creation"
validation-criticality: "HIGH"
---

## Prerequisites (2 items)

- [ ] Parent Epic has completed Business Case (status >= ANALYZING)
- [ ] WSJF score exists on parent Epic

## Per Capability (5 items each)

- [ ] Capability linked to parent Epic (parentId in frontmatter)
- [ ] WSJF inherited from parent Epic
- [ ] Gherkin ACs present (min 2 scenarios per capability)
- [ ] Capability type classified: Business or Enabler
- [ ] Registered in Beads: `bd create --parent={epic_id}`

## Decomposition Quality (2 items)

- [ ] No capability is both an Enabler AND has user-facing ACs
- [ ] Capability count within recommended range per decomposition-patterns.csv
