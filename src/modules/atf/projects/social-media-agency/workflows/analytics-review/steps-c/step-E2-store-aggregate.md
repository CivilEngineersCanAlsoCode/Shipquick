# Step E.2 — Store & Aggregate

**Agent:** Content Strategist (Echo)
**Trigger:** Automatic after E.1 completes with posts[] in working memory.

---

## What You Do

You aggregate the raw per-post engagement metrics into meaningful summaries: averages per content pillar, averages per content method, best performing day of week, and best performing hook framework. These aggregations power the analysis in E.3.

---

## Action 1: Calculate Per-Post Engagement Score (Validation)

For each post in `posts[]`, verify the engagement score matches the formula:

```
engagement_score = likes + (comments × 3) + (shares × 2)
```

If any post's stored `engagement_score` doesn't match recalculation, flag it:
> "Post '[title]' ka engagement_score mismatch hai — stored: [X], calculated: [Y]. Recalculated value use kar raha hoon."

Update in working memory (do NOT call update webhook here — this is read-only aggregation).

---

## Action 2: Aggregate by Content Pillar

Group posts by `content_pillar` and calculate for each pillar:

```json
{
  "pillar": "career",
  "post_count": 4,
  "avg_engagement_score": 65.5,
  "avg_likes": 38.2,
  "avg_comments": 6.5,
  "avg_shares": 2.8,
  "avg_impressions": 1100,
  "best_post_title": "Why most developers hate meetings",
  "best_post_score": 92
}
```

Rank pillars by `avg_engagement_score` descending.

---

## Action 3: Aggregate by Content Method

Group posts by `content_method` and calculate:

```json
{
  "method": "Contrarian Take",
  "post_count": 3,
  "avg_engagement_score": 78.3,
  "total_engagement_score": 235,
  "best_combined_with": "Personal Story"
}
```

Rank methods by `avg_engagement_score` descending.

**Method combinations:** For each post, record the `content_method` + `hook_framework` + `tone_framework` combo. Identify the top 3 combos by engagement score.

---

## Action 4: Aggregate by Day of Week

Group posts by day of week (from `published_at`) and calculate:

```json
{
  "day": "Tuesday",
  "post_count": 3,
  "avg_engagement_score": 72.0,
  "avg_impressions": 1350
}
```

Rank days by `avg_engagement_score` descending. Identify **best day** and **worst day**.

---

## Action 5: Aggregate by Hook Framework

Group posts by `hook_framework` and calculate:

```json
{
  "hook": "Pattern Interrupt",
  "post_count": 2,
  "avg_engagement_score": 81.5,
  "avg_comments": 9.0
}
```

Rank hooks by `avg_engagement_score` descending.

---

## Action 6: Calculate Overall Averages & Benchmarks

Compute global averages across ALL posts:

```json
{
  "total_posts": 12,
  "avg_engagement_score": 58.4,
  "median_engagement_score": 55,
  "avg_likes": 32.1,
  "avg_comments": 5.2,
  "avg_shares": 2.1,
  "avg_impressions": 980,
  "top_quartile_threshold": 72,
  "bottom_quartile_threshold": 40
}
```

These benchmarks are used in E.3 to classify each post as above/below/par.

---

## After Aggregation

Tell the user:
> "Aggregation ho gaya! [N] posts ka data ready hai:
> - [X] content pillars tracked
> - Best pillar: [name] (avg score: [X])
> - Best day: [day] (avg score: [X])
> - Best hook: [name] (avg score: [X])
>
> Ab detailed analysis karta hoon."

Proceed to **E.3**.

---

## Error Handling

**If posts[] is empty or undefined:**
> This should never happen — E.1 guarantees at least 1 post. If it does, halt:
> "Working memory mein posts nahi hain. E.1 se wapas shuru karo."

**If fewer than `min_data_points` (default: 5) posts:**
> "Sirf [N] posts hain — aggregation kam reliable hogi. Proceed karein with caveat ya zyada posts collect karein?"

If user says proceed, continue with a `low_confidence: true` flag on all aggregations.

**If a post is missing `content_pillar` or `content_method`:**
Exclude from that specific aggregation, include in others. Flag:
> "Post '[title]' mein [field] missing hai — usko [aggregation_type] se exclude kiya."

---

## What NOT to Do

- ❌ Do NOT write aggregations to MongoDB — this is in-memory only
- ❌ Do NOT call any webhooks in this step — it is pure computation
- ❌ Do NOT show raw aggregation JSON to the user — summarize in Hinglish
- ❌ Do NOT drop posts with partial data — include them where possible
- ❌ Do NOT average impressions if most posts lack impression data (Chrome Extension limitation)
- ❌ Do NOT present analysis or recommendations here — that's E.3 and E.4

---

## Success Criteria

- [ ] All posts have validated engagement scores
- [ ] Pillar aggregation complete with ranking
- [ ] Method aggregation complete with top combos identified
- [ ] Day-of-week aggregation complete with best/worst day
- [ ] Hook framework aggregation complete with ranking
- [ ] Overall benchmarks calculated (avg, median, quartile thresholds)
- [ ] Low-confidence flag set if fewer than 5 posts
- [ ] User briefed on aggregation summary

---

## Output for Next Step

Pass to **E.3**:
```
posts[]                  — array with validated engagement scores
pillar_aggregation[]     — ranked by avg_engagement_score
method_aggregation[]     — ranked by avg_engagement_score, with combos
day_aggregation[]        — ranked by avg_engagement_score
hook_aggregation[]       — ranked by avg_engagement_score
benchmarks{}             — avg, median, top/bottom quartile thresholds
low_confidence           — boolean flag
period_label             — from E.1
analytics_config         — from E.1
```
