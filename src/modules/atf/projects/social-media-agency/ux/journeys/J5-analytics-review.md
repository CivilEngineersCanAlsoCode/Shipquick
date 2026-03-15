# J5 — Analytics Review Journey Map

**Workflow:** E (Analytics Review) — 5 steps
**Agent:** Echo (flex-publicist) / Relay (flex-publisher)
**Trigger:** User says "Analytics dekho" or "Performance review"
**Entry status:** Published posts exist with metrics_history[] data
**Exit status:** Strategy recommendations saved, scoring config updated (feedback loop)

---

## Journey Overview

```
Collect metrics     Aggregate &      Analyze &        Strategy           Feedback loop
(JS snippet or   →  benchmark     →  discuss with  →  recommendations →  update scoring
 ChatGPT Actions)   (E.1–E.2)       user (E.3)       (E.4)              config (E.5)
(pre-requisite)
```

---

## Pre-requisite: Metric Collection (Outside E workflow)

Before E can run, metrics must be collected at scheduled intervals.

**Collection schedule:** Day 1, 3, 7, 14, 30 after publish

**Method 1: JS DevTools Snippet (current)**
| Aspect | Detail |
|--------|--------|
| **User action** | Open Chrome DevTools on LinkedIn post page, paste JS snippet, run |
| **System action** | Snippet extracts likes, comments, shares, impressions → sends to n8n |
| **Webhook** | `POST /sma-analytics-collect` |
| **Data captured** | likes, comments, shares, impressions, follower_count, collected_at |

**Method 2: ChatGPT Actions (alternative)**
| Aspect | Detail |
|--------|--------|
| **User action** | Says "Collect metrics for [post]" in ChatGPT |
| **System action** | Triggers collection via ChatGPT Actions schema |
| **Webhook** | `POST /sma-analytics-collect` |

**User experience:**
```
📊 Metric collection reminder!

Posts due for collection today:
  Day 1:  "Why PMs should learn SQL" (published yesterday)
  Day 7:  "Design thinking tips" (published last Mon)
  Day 30: "My interview story" (published Feb 14)

Run JS snippet for each, or say "collect metrics" to trigger via Actions.
```

**Pain point:** Manually running JS snippets is fragile, easy to forget, and requires desktop Chrome
**Opportunity:** Automated collection via LinkedIn API (future), or at minimum a reminder system

---

## Step-by-Step Journey

### E.1: Fetch Published Posts with Metrics — ~15 seconds

| Aspect | Detail |
|--------|--------|
| **User action** | Says "Analytics dekho last week" or specifies date range |
| **System action** | Fetch published posts with metrics_history[], load analytics_config |
| **Webhooks** | `POST /sma-fetch-post` (filter=published_with_metrics) + `POST /sma-fetch-config` (analytics_config) |
| **Period options** | "last week", "last month", "last 7 posts", custom date range |

**User sees:**
```
📊 Fetching analytics for last 7 days...
   Found 5 published posts with metrics data.
   Loading analytics configuration...
```

### E.2: Store & Aggregate — Automatic, ~10 seconds

| Aspect | Detail |
|--------|--------|
| **User action** | Waits |
| **System action** | In-memory aggregation of all metrics |

**Calculations performed:**
| Metric | Formula |
|--------|---------|
| **Engagement score** | `likes + (comments × 3) + (shares × 2)` |
| **Engagement rate** | `(engagement_score / follower_count) × 100` |
| **Per-pillar average** | Mean engagement_score for each content pillar |
| **Per-method average** | Mean engagement_score for each content method/framework |
| **Per-day average** | Mean engagement_score by day-of-week |
| **Per-hook average** | Mean engagement_score by hook framework |
| **Engagement velocity** | `(Day 14 score - Day 7 score) / Day 7 score × 100` |
| **Benchmarks** | Current period vs all-time average |

### E.3: Analyze Performance — Interactive, 5–15 minutes

| Aspect | Detail |
|--------|--------|
| **User action** | Reviews dashboard data, discusses insights with agent |
| **System action** | Present ranked data, flag anomalies, facilitate discussion |

**User sees — Performance Dashboard:**

```
📊 ANALYTICS DASHBOARD — Last 7 Days (5 posts)

═══ TOP PERFORMERS ═══
  #1  "Why PMs should learn SQL"      Engagement: 247  Rate: 2.1%  ▲ +64% vs avg
  #2  "My first year at AmEx"         Engagement: 198  Rate: 1.7%  ▲ +31% vs avg
  #3  "Design thinking tips"          Engagement: 156  Rate: 1.3%  ≈ avg
  #4  "Remote work productivity"      Engagement: 89   Rate: 0.7%  ▼ -41% vs avg
  #5  "AI tools roundup"              Engagement: 62   Rate: 0.5%  ▼ -59% vs avg

═══ BY CONTENT PILLAR ═══
  Skill-Building:  247 avg  ▲▲  (1 post — strong but small sample)
  Career:          198 avg  ▲   (1 post)
  Leadership:      156 avg  ≈   (1 post)
  Personal:        89  avg  ▼   (1 post)
  Tech Insights:   62  avg  ▼▼  (1 post — consider reducing)

═══ BY FRAMEWORK ═══
  Contrarian Hook:    247 avg  (best performing hook)
  Story Hook:         198 avg
  Question Hook:      156 avg
  List Hook:          89 avg   (underperforming)

═══ BY DAY OF WEEK ═══
  Monday:    247  (best day)
  Tuesday:   198
  Wednesday: 156
  Thursday:  89
  Friday:    62   (worst day — consider skipping)

═══ ANOMALIES ═══
  🔥 RESURGENT: "Design thinking tips" — Day 14 engagement +35% vs Day 7
     (viral late — consider reposting/threading this topic)

  ⚠️  DECLINING: "AI tools roundup" — steady decline Day 1→7→14
     (topic may be oversaturated on LinkedIn)
```

**Interactive discussion:**
```
Key takeaways:
  1. Contrarian hooks outperform by 64% — use more
  2. Skill-Building pillar is your strongest — schedule more
  3. Friday posts underperform — consider Mon-Thu only
  4. "Design thinking" went viral late — thread opportunity

What stands out to you? Any changes you want to make?
```

**Emotion:** Insightful, data-driven — "Now I can see what works"
**Pain point:** Small sample sizes make pillar averages unreliable (1 post each)
**Opportunity:** Confidence intervals or "needs more data" flags for small samples

### E.4: Strategy Recommendations — 2–5 minutes

| Aspect | Detail |
|--------|--------|
| **User action** | Reviews and approves/adjusts recommendations |
| **System action** | Generate actionable recommendations based on E.3 analysis |
| **Webhook** | `POST /sma-save-config` (save to sma_config.analytics_recommendations) |

**User sees:**
```
📋 STRATEGY RECOMMENDATIONS

1. PILLAR REBALANCING
   Current: Equal weight across 5 pillars
   Recommended: Skill-Building 30%, Career 25%, Leadership 20%, Personal 15%, Tech 10%
   Reason: Skill-Building + Career = 80% of top engagement

2. FRAMEWORK INSIGHTS
   ✅ Double down: Contrarian Hook + Story-to-Insight narrative
   ⚠️ Reduce: List Hook (consistently underperforms)
   🧪 Test: Haven't tried "Data Reveal" hook yet — experiment next week

3. TIMING OPTIMIZATION
   ✅ Best days: Mon–Wed (avg 200+ engagement)
   ⚠️ Worst day: Friday (avg 62 engagement)
   Recommendation: Post Mon–Thu, skip Friday

4. COMBO WINNERS
   Best pair: Contrarian Hook + Conversational Tone (247 engagement)
   Worst pair: List Hook + Formal Tone (62 engagement)

5. VARIETY ALERT
   ⚠️ Used Contrarian Hook 3 times in 5 posts — risk of pattern fatigue
   Recommendation: Alternate with Story Hook and Question Hook

Apply these recommendations? (y/adjust/skip)
```

**Emotion:** Strategic — "I have a plan for next week"

### E.5: Feedback Loop — Config Update, ~1 minute

| Aspect | Detail |
|--------|--------|
| **User action** | Approves config changes |
| **System action** | Update scoring_weights, pillar_priority, preferred methods |
| **Webhooks** | `POST /sma-save-config` (updated scoring_weights) + `POST /sma-fetch-config` (verify) |

**Config changes applied:**
```
📝 CONFIG UPDATES APPLIED

scoring_weights:
  Freshness: 8 → 8 (unchanged)
  Personal Experience: 5 → 6 (↑ — personal stories drive engagement)
  Research Quality: 3 → 3 (unchanged)

content_pillar_priority:
  Skill-Building: 1.0 → 1.3 (↑)
  Career: 1.0 → 1.1 (↑)
  Leadership: 1.0 → 1.0
  Personal: 1.0 → 0.9 (↓)
  Tech Insights: 1.0 → 0.7 (↓↓)

preferred_methods: [Contrarian Hook, Story-to-Insight, Conversational Tone]
underperformer_flags: [List Hook, Formal Tone, Friday posting]

✅ Next A-Ideation will use updated weights.
   Self-improving cycle active.
```

**Emotion:** Empowered — "The system learns from my data"
**Pain point:** No easy way to undo config changes if next week's results are worse
**Opportunity:** Config versioning with rollback capability

---

## Touchpoint Map

| Touchpoint | Channel | Interaction Type |
|------------|---------|-----------------|
| Metric collection | Chrome DevTools / ChatGPT Actions | Manual JS snippet or conversational |
| Trigger analytics | ChatGPT (LinkRight HQ) | Conversational command |
| Dashboard review | ChatGPT | Read data tables and charts (text-based) |
| Discussion | ChatGPT | Conversational analysis |
| Recommendation review | ChatGPT | Approve/adjust presented plan |
| Config update | ChatGPT | Confirm changes |
| Collection reminders | Telegram (future) | Push notification |

---

## Emotion Curve

```
High  ·                              ·  ← Resurgent post discovery (excitement)
      ·                            ·   ·
      ·                          ·       ·  ← Config updated (empowered)
      ·  ← Dashboard loaded    ·
Mid   ·  ·····················           ·
      ·                      ·  ← Low performer found (concern)
      ·                    ·
Low   ·  ← JS snippet collection (tedious)
```

---

## Error States & Edge Cases

| Condition | User Impact | System Response |
|-----------|-------------|-----------------|
| No published posts with metrics | Cannot analyze | "No metrics collected yet. Run JS snippet on published posts first." |
| Metrics only at Day 1 (no Day 7/14/30) | Incomplete picture | "Only Day 1 data available. Velocity and trend analysis unavailable until Day 7+." |
| All posts below average | Discouraging | Frame positively: "Engagement is building. Here's what to try next..." |
| Config save fails | Changes lost | "Config update failed. Your changes: [list]. Try again?" |
| Very small sample (< 5 posts) | Unreliable stats | "⚠️ Small sample (N posts). Recommendations are directional, not statistically significant." |
| Resurgence detected (Day 14 > Day 7 by >20%) | Positive anomaly | "🔥 Post went viral late! Consider threading this topic." |

---

## Opportunities for Dashboard

1. **Visual engagement charts** — Line charts for engagement over Day 1→3→7→14→30
2. **Pillar performance heatmap** — Color-coded grid of pillar × metric performance
3. **Config diff view** — Before/after comparison when changing scoring weights
4. **Collection calendar** — Visual calendar showing which posts need metrics collected when
5. **Auto-remind for collection** — Telegram/in-app notification: "3 posts due for Day 7 collection"
6. **Trend sparklines** — Mini charts next to each post showing engagement trajectory
7. **Config version history** — Timeline of config changes with rollback option
8. **Benchmark overlay** — Show industry averages alongside personal metrics
