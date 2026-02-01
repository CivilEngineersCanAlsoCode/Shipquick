# SAFe WSJF Calculator

## Overview

**WSJF (Weighted Shortest Job First)** prioritizes work to produce maximum economic benefit.

**Formula:** `WSJF = Cost of Delay (CoD) / Job Size`

Where: `CoD = User/Business Value + Time Criticality + RR/OE`

---

## Scoring Guide

Use relative Fibonacci numbers: **1, 2, 3, 5, 8, 13, 20**

### User/Business Value

| Score | Meaning                 |
| ----- | ----------------------- |
| 1     | Minimal value           |
| 3     | Some value              |
| 5     | Moderate value          |
| 8     | High value              |
| 13    | Very high value         |
| 20    | Critical business value |

### Time Criticality

| Score | Meaning                             |
| ----- | ----------------------------------- |
| 1     | No deadline, customers will wait    |
| 3     | Preferred timeline                  |
| 5     | Delay causes moderate impact        |
| 8     | Fixed deadline approaching          |
| 13    | Urgent, significant decay           |
| 20    | Immediate, major penalty if delayed |

### Risk Reduction / Opportunity Enablement (RR/OE)

| Score | Meaning                              |
| ----- | ------------------------------------ |
| 1     | No risk reduction or new opportunity |
| 3     | Minor risk reduction                 |
| 5     | Moderate risk/opportunity            |
| 8     | Significant enablement               |
| 13    | High strategic value                 |
| 20    | Critical for future work             |

### Job Size (Duration/Effort)

| Score | Meaning               |
| ----- | --------------------- |
| 1     | Very small (1 sprint) |
| 2     | Small (1-2 sprints)   |
| 3     | Medium (1 PI)         |
| 5     | Large (1-2 PIs)       |
| 8     | Very large (2-3 PIs)  |
| 13    | Extra large (3+ PIs)  |

---

## Backlog Prioritization

| Item      | BV  | TC  | RR/OE | CoD   | Job Size | WSJF     | Priority |
| --------- | --- | --- | ----- | ----- | -------- | -------- | -------- |
| [Item 1]  |     |     |       | [Sum] |          | [CoD/JS] |          |
| [Item 2]  |     |     |       |       |          |          |          |
| [Item 3]  |     |     |       |       |          |          |          |
| [Item 4]  |     |     |       |       |          |          |          |
| [Item 5]  |     |     |       |       |          |          |          |
| [Item 6]  |     |     |       |       |          |          |          |
| [Item 7]  |     |     |       |       |          |          |          |
| [Item 8]  |     |     |       |       |          |          |          |
| [Item 9]  |     |     |       |       |          |          |          |
| [Item 10] |     |     |       |       |          |          |          |

---

## Calculation Steps

1. **Score each CoD component** (BV, TC, RR/OE) using relative Fibonacci
2. **Sum CoD components** → Total Cost of Delay
3. **Estimate Job Size** using relative sizing
4. **Calculate WSJF** = CoD ÷ Job Size
5. **Prioritize** highest WSJF first

---

## Notes

- Always use **relative** scoring (compare items to each other)
- Recalculate when new items are added
- Review WSJF before each PI Planning
