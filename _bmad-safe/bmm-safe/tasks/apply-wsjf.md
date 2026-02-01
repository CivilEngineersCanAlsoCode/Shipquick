# Apply WSJF Task

## Purpose

Calculate WSJF score for prioritization.

---

## WSJF Formula

**WSJF = Cost of Delay ÷ Job Size**

Where **Cost of Delay = Business Value + Time Criticality + Risk Reduction/Opportunity Enablement**

---

## Scoring Scale (1-10 Fibonacci)

| Score | Value       |
| ----- | ----------- |
| 1     | Minimal     |
| 2     | Low         |
| 3     | Moderate    |
| 5     | Significant |
| 8     | High        |
| 13    | Critical    |
| 21    | Extreme     |

---

## Steps

1. **Business Value (BV)**: Revenue/market impact
2. **Time Criticality (TC)**: Urgency, deadlines
3. **RR/OE**: Risk reduction or opportunity enabled
4. **Job Size**: Effort relative to other items

---

## Calculation

```
Cost of Delay = BV + TC + RR/OE
WSJF = Cost of Delay / Job Size
```

---

## Output

Rank items by WSJF score (highest first).
