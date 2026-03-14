# Step E.5 — Feedback Loop

**Agent:** Content Strategist (Echo)
**Trigger:** Automatic after E.4 completes with approved recommendations saved.

---

## What You Do

You close the self-improving loop by translating approved recommendations into concrete system parameter updates. This step modifies `scoring_weights`, `content_pillar_priority`, and content method preferences so that future A-Ideation and B-Drafting cycles automatically reflect what the data showed works best.

This is what makes the SMA pipeline **self-improving**: `E → A → B → ... → E → A → ...`

---

## Action 1: Update Scoring Weights

**Input:** `approved_recommendations`, `benchmarks`, current `scoring_weights`

**Step 1a: Fetch current scoring weights**

**POST** `https://n8n.linkright.in/webhook/sma-fetch-config`

```json
{
  "doc_id": "scoring_weights"
}
```

**Expected Response:**
```json
{
  "freshness_weight": 8,
  "personal_experience_weight": 5,
  "research_quality_weight": 3,
  "updated_at": "2026-02-28T12:00:00Z",
  "update_history": []
}
```

**Step 1b: Propose weight adjustments**

Apply rules based on performance data:

| Signal | Adjustment | Rationale |
|--------|-----------|-----------|
| Personal stories consistently top quartile | P weight: 5 → 6 | Data shows personal content drives engagement |
| Personal stories consistently bottom quartile | P weight: 5 → 4 | Personal content underperforming — reduce bias |
| Research-heavy posts outperform | R weight: 3 → 4 | Audience values data-backed content |
| Fresh/timely posts outperform | F weight: 8 → 9 | Freshness premium confirmed |

**Constraints:**
- Max change per review: ±1 per weight (no drastic shifts)
- Fibonacci sequence must still be maintained approximately (F > P > R)
- Minimum values: F ≥ 5, P ≥ 3, R ≥ 2
- Only adjust if signal is clear (>20% difference from average)

**Step 1c: Present to user**

> "Scoring weights update karna chahiye based on data:
> - Personal Experience: 5 → 6 (personal stories top quartile mein hain)
> - Baaki weights same rahenge
>
> Approve karo?"

**If user approves:**

**POST** `https://n8n.linkright.in/webhook/sma-save-config`

```json
{
  "doc_id": "scoring_weights",
  "data": {
    "freshness_weight": 8,
    "personal_experience_weight": 6,
    "research_quality_weight": 3,
    "updated_at": "2026-03-14T16:00:00Z",
    "update_history": [
      {
        "date": "2026-03-14",
        "change": "personal_experience_weight: 5 → 6",
        "reason": "Personal stories in top quartile for 2026-03-07 to 2026-03-14 period",
        "approved_by": "user"
      }
    ]
  }
}
```

**If user rejects:** Keep current weights. Log that user reviewed but chose not to adjust.

---

## Action 2: Update Content Pillar Priority

**Input:** `pillar_rebalancing[]` from E.4

**Step 2a: Fetch current pillar priority**

**POST** `https://n8n.linkright.in/webhook/sma-fetch-config`

```json
{
  "doc_id": "engagement_config"
}
```

**Step 2b: Reorder pillar priority**

Based on `pillar_ranking[]` and user-approved rebalancing:

```json
{
  "doc_id": "engagement_config",
  "data": {
    "content_pillar_priority": [
      { "pillar": "career", "weight": 1.3, "reason": "Top performer (+32%)" },
      { "pillar": "tech", "weight": 1.0, "reason": "At average" },
      { "pillar": "leadership", "weight": 0.8, "reason": "Below average, rethinking" },
      { "pillar": "tech-trends", "weight": 1.1, "reason": "Variety boost — underrepresented" }
    ],
    "pillar_priority_updated_at": "2026-03-14T16:05:00Z"
  }
}
```

**How A-Ideation uses this:** In step A.4, the scoring formula applies pillar weights:
`adjusted_score = base_score × pillar_weight`

This means career briefs get a 1.3x boost, leadership briefs get a 0.8x reduction.

**Present to user:**
> "Pillar priorities update kar raha hoon:
> - Career: 1.3x (top performer)
> - Tech: 1.0x (stable)
> - Leadership: 0.8x (rethinking)
> - Tech-trends: 1.1x (variety boost)
>
> Ye A-Ideation mein brief selection ko influence karega. Theek hai?"

Save only after user approval.

---

## Action 3: Feed Top Methods to B-Drafting

**Input:** `method_combos[]`, `format_insights[]` from E.4

**Step 3a: Update method preferences**

**POST** `https://n8n.linkright.in/webhook/sma-save-config`

```json
{
  "doc_id": "analytics_recommendations",
  "data": {
    "preferred_methods": [
      {
        "method": "Contrarian Take",
        "preferred_hook": "Pattern Interrupt",
        "avg_score": 85,
        "usage_note": "Top combo — suggest first in B.3"
      },
      {
        "method": "Personal Story",
        "preferred_hook": "Emotional Hook",
        "avg_score": 72,
        "usage_note": "Strong performer — always include in options"
      }
    ],
    "preferred_formats": [
      {
        "format": "Staircase",
        "advantage": "+30% engagement",
        "usage_note": "Default format for F-Formatting"
      }
    ],
    "methods_updated_at": "2026-03-14T16:10:00Z"
  }
}
```

**How B-Drafting uses this:** In step B.3, when AI curates top methods/hooks for user selection, it prioritizes `preferred_methods[]` by presenting them first.

**Present to user:**
> "B-Drafting ke liye top methods set kar raha hoon:
> 1. Contrarian Take + Pattern Interrupt (avg: 85)
> 2. Personal Story + Emotional Hook (avg: 72)
> Default format: Staircase
>
> Ye B.3 mein pehle suggest honge. Approve?"

---

## Action 4: Flag Underperformers

**Input:** `variety_alerts[]`, `method_ranking[]` (bottom entries), `framework_ranking{}` (bottom entries)

Create an underperformer watchlist:

**POST** `https://n8n.linkright.in/webhook/sma-save-config`

```json
{
  "doc_id": "analytics_recommendations",
  "data": {
    "underperformer_flags": [
      {
        "type": "method",
        "name": "Generic Listicle",
        "avg_score": 32,
        "action": "deprioritize",
        "reason": "Consistently in bottom quartile"
      },
      {
        "type": "hook",
        "name": "Clickbait Question",
        "avg_score": 28,
        "action": "avoid",
        "reason": "Low engagement, may hurt credibility"
      },
      {
        "type": "variety",
        "category": "hottake",
        "action": "add_one",
        "reason": "Missing from last 12 posts"
      }
    ],
    "flags_updated_at": "2026-03-14T16:15:00Z"
  }
}
```

**How workflows use this:**
- B-Drafting (B.3): Deprioritized methods shown last or with warning
- A-Ideation (A.6): Variety gaps flagged during brief selection
- E-Analytics (next cycle): Track if flagged items improved after changes

**Present to user:**
> "Underperformers flag kar raha hoon:
> - Generic Listicle: deprioritize (bottom quartile)
> - Clickbait Question hook: avoid (low engagement)
> - Hottake category: add 1 next cycle (missing)
>
> Ye future workflows mein warnings dikhayega. Theek hai?"

---

## Final Summary

After all updates are saved, present the complete feedback loop summary:

```
✅ FEEDBACK LOOP COMPLETE
══════════════════════════

🔄 SYSTEM UPDATES APPLIED:

1. Scoring Weights
   - Personal Experience: 5 → 6

2. Pillar Priorities
   - Career: 1.3x | Tech: 1.0x | Leadership: 0.8x | Tech-trends: 1.1x

3. Preferred Methods (for B-Drafting)
   - Contrarian Take + Pattern Interrupt
   - Personal Story + Emotional Hook
   - Default format: Staircase

4. Underperformer Flags
   - Generic Listicle: deprioritized
   - Clickbait Question: flagged
   - Hottake: variety gap alert

📈 Next A-Ideation cycle will automatically use these insights.
   System is now SELF-IMPROVING. 🔁
```

> "Analytics review complete! Next time jab A-Ideation chalega, ye sab changes automatically apply honge. Kuch aur dekhna hai?"

---

## Error Handling

**If any `/sma-save-config` call fails:**
> "Config save fail hua [doc_id] ke liye. Retry karta hoon."

Retry once. If fails again, save the payload in working memory and tell user:
> "Save fail ho gaya. Ye changes working memory mein hain — manually apply karna padega ya session mein baad mein retry karo."

**If user rejects ALL updates:**
> "Koi system update nahi kiya. Recommendations saved hain for reference, but weights aur priorities same rahenge. Next review mein wapas dekh lenge."

Still save the analytics_recommendations doc (without applied changes) for historical reference.

**If scoring weight adjustment would violate constraints:**
> "Weight change F > P > R constraint violate karta hai. Adjustment skip kar raha hoon — manually review karo if needed."

---

## What NOT to Do

- ❌ Do NOT update weights by more than ±1 per review cycle
- ❌ Do NOT auto-apply without user approval — EVERY change needs confirmation
- ❌ Do NOT break the Fibonacci ordering (F > P > R)
- ❌ Do NOT delete underperformer data — flag it, don't remove it
- ❌ Do NOT modify content-methods.csv or framework CSVs — those are reference data
- ❌ Do NOT promise specific engagement improvements — "this SHOULD help, we'll see next review"
- ❌ Do NOT skip the final summary — user needs to know what changed

---

## Success Criteria

- [ ] Scoring weights reviewed and updated (or confirmed unchanged) with user approval
- [ ] Content pillar priorities reordered and saved with user approval
- [ ] Top methods and preferred combos saved for B-Drafting reference
- [ ] Underperformers flagged with actionable guidance
- [ ] All config changes saved to MongoDB via webhooks
- [ ] Update history maintained (no overwriting without trail)
- [ ] Final summary presented to user
- [ ] Self-improving loop confirmed closed: E → A connection established

---

## Output (End of Workflow)

The E-AnalyticsReview workflow is complete. The following data is now persisted in MongoDB:

```
sma_config.analytics_recommendations  — full recommendation set + user insights
sma_config.scoring_weights            — updated weights (if changed)
sma_config.engagement_config          — updated pillar priorities (if changed)
```

**Next workflow trigger:** When user starts A-Ideation, steps A.4 and A.6 will read the updated config and apply the feedback loop automatically.
