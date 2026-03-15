# K5 — Scoring System & Configuration

## Scoring Formula

```
Score = F x 8 + P x 5 + R x 3
```

- **F** = Freshness (weight: 8)
- **P** = Personal Experience (weight: 5)
- **R** = Research Quality (weight: 3)
- **Maximum score:** 10 x 8 + 10 x 5 + 10 x 3 = **160**
- **Weights are Fibonacci-inspired** and configurable via `saveConfig`

---

## Scale Definitions

### F — Freshness (1-10)
How timely and novel is this topic?

| Score | Definition |
|-------|-----------|
| 1-2 | Overdone topic, posted about this exact angle in last 7 days |
| 3-4 | Common topic, similar posts exist from last 14 days |
| 5-6 | Moderately fresh, hasn't been covered in 14+ days |
| 7-8 | Fresh angle on a known topic, or emerging trend |
| 9-10 | Breaking/novel topic, unique angle nobody is discussing |

**How to assess:** Check `fetchPastPosts` for last 14 days. If same pillar/angle posted recently, score lower. Trending topics get a boost.

### P — Personal Experience (1-10)
How strongly can Satvik connect this to personal experience?

| Score | Definition |
|-------|-----------|
| 1-2 | No personal connection, purely theoretical |
| 3-4 | Tangential connection, could force-fit an experience |
| 5-6 | Has a relevant experience but not deeply personal |
| 7-8 | Strong personal story with specific details |
| 9-10 | Defining life experience, deeply authentic and unique |

**How to assess:** Check `searchExperiences` results. Similarity score >= 0.80 with rich text = high P score. No matches = likely low P.

### R — Research Quality (1-10)
How well-supported is this topic with data and evidence?

| Score | Definition |
|-------|-----------|
| 1-2 | No data, no sources, pure opinion |
| 3-4 | Anecdotal, one weak source |
| 5-6 | Has some stats or quotes, moderately supported |
| 7-8 | Strong data points, credible sources, expert quotes |
| 9-10 | Multiple authoritative sources, original data, compelling evidence |

**How to assess:** Check brief's has_stats, has_quotes, has_trend, has_data flags. More TRUE flags = higher R.

---

## Gate Checks

Before a brief can be selected for planning, ALL gates must pass:

| Gate | Minimum | What Happens If Fail |
|------|---------|---------------------|
| F >= 5 | Freshness minimum | Topic too stale. Suggest waiting or finding new angle. |
| P >= 3 | Personal minimum | Not enough personal connection. Suggest adding experience. |
| R >= 2 | Research minimum | Needs more supporting data. Suggest research. |
| Total >= 80 | 50% of max (160) | Overall score too low. Show breakdown, suggest improvements. |

**Scoring display format:** `F:8 P:7 R:6 T:131`

---

## Scoring Examples

### Example 1: Strong Post
```
Topic: "Why I quit my Amex PM role to build a startup"
F: 9 (never posted about this)
P: 10 (deeply personal, defining moment)
R: 5 (moderate data on career transitions)
Score: 9x8 + 10x5 + 5x3 = 72 + 50 + 15 = 137
Gates: F(9)>=5, P(10)>=3, R(5)>=2, T(137)>=80 — ALL PASS
```

### Example 2: Borderline Post
```
Topic: "5 PM frameworks every product manager should know"
F: 5 (somewhat common topic)
P: 6 (has used these frameworks)
R: 7 (well-researched with sources)
Score: 5x8 + 6x5 + 7x3 = 40 + 30 + 21 = 91
Gates: F(5)>=5, P(6)>=3, R(7)>=2, T(91)>=80 — ALL PASS (barely)
```

### Example 3: Rejected Post
```
Topic: "AI will replace all jobs"
F: 3 (overdone topic)
P: 2 (no personal experience with this)
R: 4 (generic data)
Score: 3x8 + 2x5 + 4x3 = 24 + 10 + 12 = 46
Gates: F(3)<5 FAIL, P(2)<3 FAIL, T(46)<80 FAIL
Suggestion: Find a personal angle, add specific data, narrow the claim
```

---

## Updating Scoring Weights

Weights can be updated via the `saveConfig` endpoint:

```json
{
  "configs": [{
    "_id": "scoring_weights",
    "weights": {
      "freshness": 8,
      "personal_experience": 5,
      "research_quality": 3
    },
    "top_n": 5,
    "lookback_days": 14,
    "updated_by": "chatgpt"
  }]
}
```

**When to update weights:**
- During E.5 (Analytics Feedback Loop) based on performance data
- If a certain dimension consistently predicts high engagement, increase its weight
- If Satvik manually requests a priority shift (e.g., "I want more research-heavy posts")

**To fetch current weights:**
```json
{"doc_ids": ["scoring_weights"]}
```

---

## Config Document IDs

| _id | Contents |
|-----|----------|
| scoring_weights | F/P/R weights, top_n, lookback_days |
| scoring_scales | Scale definitions for F, P, R |
| posting_schedule | Max posts/day, max planned, blocked dates |
| formatting_config | Formatting rule parameters |
| engagement_config | Engagement score formula weights |
| review_config | Review workflow settings |
| analytics_config | Collection schedule, benchmark thresholds |
