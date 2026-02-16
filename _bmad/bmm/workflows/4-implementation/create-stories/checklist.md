---
title: "Definition of Done — Story Creation"
validation-criticality: "MEDIUM"
---

## Per User Story (6 items each)

- [ ] Story format: "As a {role}, I want {goal}, so that {benefit}"
- [ ] Linked to parent Feature (parentId in frontmatter)
- [ ] Gherkin ACs present (min 2 scenarios)
- [ ] Story points estimated (Fibonacci: 1, 2, 3, 5, 8, 13)
- [ ] INVEST criteria met (Independent, Negotiable, Valuable, Estimable, Small, Testable)
- [ ] Registered in Beads: `bd create --parent={feat_id}`

## Dev Tasks (3 items per story)

- [ ] Each story has 1+ dev tasks with descriptions
- [ ] Tasks are implementation-level (not business-level)
- [ ] Estimated hours per task (optional but recommended)

## QA Test Cases (3 items per story)

- [ ] Each story has 1+ QA test cases
- [ ] Test cases in Gherkin format
- [ ] Test cases cover happy path + at least 1 edge case
