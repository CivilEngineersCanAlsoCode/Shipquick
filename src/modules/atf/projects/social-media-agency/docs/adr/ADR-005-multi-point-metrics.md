# ADR-005: Multi-Point Metric Collection (Day 1, 3, 7, 14, 30)

- **Status:** Accepted
- **Date:** 2026-03-15

## Context

Most social media tools collect engagement metrics at a single point in time (e.g., 24 hours or 7 days after posting). This provides a snapshot but misses the engagement trajectory — whether a post peaked early, had sustained reach, or experienced late resurgence.

## Decision

Collect engagement metrics at **5 time points** after publishing: **Day 1, 3, 7, 14, and 30.** Each collection is stored as an entry in the post's `metrics_history[]` array with the collection timestamp and day marker.

Metrics collected at each point:
- Impressions
- Reactions (total + breakdown)
- Comments
- Reposts
- Engagement rate

## Consequences

**Positive:**
- **Resurgence detection:** Posts where Day 14 metrics exceed Day 7 by >20% are flagged as resurgent — indicating algorithmic re-promotion or viral sharing
- **Evergreen scoring:** Posts with sustained engagement (low decay between Day 7 and Day 30) are scored as evergreen content, informing future ideation
- **Content autopsy:** Posts that spike early but decay fast reveal hook quality vs. substance mismatches
- **Engagement velocity:** Rate-of-change between time points enables trend analysis beyond absolute numbers
- **Self-improving loop:** E→A feedback uses trajectory data, not just final numbers, for scoring weight updates

**Negative:**
- 5x collection burden per post (manual process per ADR-004)
- More storage per post document in MongoDB
- Analysis complexity increases — more dimensions to reason about
- Missed collection points create sparse data

**Mitigations:**
- Telegram reminders at each collection point reduce missed windows
- Day 1 and Day 7 are prioritized as minimum viable collection; Day 3, 14, 30 are optional enrichment
- Analysis algorithms gracefully handle missing time points via interpolation
- `metrics_history[]` array design allows flexible collection — no schema change needed for additional time points
