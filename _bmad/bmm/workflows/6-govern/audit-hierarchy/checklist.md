---
title: "Definition of Done — Audit Hierarchy"
validation-criticality: "HIGH"
---

## Scan Completeness (3 items)

- [ ] All SAFe levels scanned: Theme -> Epic -> Capability -> Feature -> Story
- [ ] Both Beads DB and file system checked for orphans
- [ ] Item count reported per level

## Orphan Detection (2 items)

- [ ] Zero items without valid parent (except root Themes)
- [ ] Zero items with broken parent references (parent doesn't exist)

## AC Validation (2 items)

- [ ] All Capabilities, Features, Stories have Gherkin ACs
- [ ] Gherkin quality rules (gherkin-quality-rules.csv) pass

## WSJF Consistency (3 items)

- [ ] All Epics have WSJF scores
- [ ] All Capabilities inherit WSJF from parent Epic
- [ ] No child has higher WSJF than parent (sanity check)

## Verdict (1 item)

- [ ] Overall verdict issued: PASS / CONCERNS / FAIL
