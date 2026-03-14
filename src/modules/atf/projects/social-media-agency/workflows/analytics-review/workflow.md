---
name: analytics-review
description: Collect engagement metrics, analyze performance, generate recommendations, close self-improving feedback loop
initWorkflow: './steps-c/step-01-load-session-context.md'
---

# Analytics Review

**Goal:** Review how published content performed, generate data-driven strategy recommendations, and feed insights back into A-Ideation and B-Drafting to make the SMA pipeline self-improving.

**System:** BMAD workflow — interactive. AI presents data, user draws conclusions, together they adjust strategy.

---

## Steps

1. **E.1 — Fetch Metrics** — Retrieve published posts with engagement metrics (collected via JS snippet / ChatGPT Actions) from MongoDB
2. **E.2 — Store & Aggregate** — Calculate per-pillar, per-method, per-day, per-hook averages and benchmarks
3. **E.3 — Analyze Performance** — Post vs average classification, pillar/method/framework ranking, timing analysis, week-over-week trend, resurgence detection, interactive discussion
4. **E.4 — Strategy Recommendations** — Pillar rebalancing, format insights, timing optimization, method combos, variety alerts → save to sma_config.analytics_recommendations
5. **E.5 — Feedback Loop** — Update scoring_weights, content_pillar_priority, feed top methods to B-Drafting, flag underperformers → close the self-improving loop

## Data Flow

```
JS DevTools snippet (Satvik runs manually on LinkedIn activity page)
  OR ChatGPT Actions (screenshot upload → vision OCR → webhook)
    ↓ POST /sma-analytics-collect (manual, multi-point: Day 1,3,7,14,30)
n8n → MongoDB (linkedin_posts.metrics_history[] + engagement_score + engagement_rate)
    ↓ E.1: Fetch stored metrics (with metrics_history time-series)
    ↓ E.2: Aggregate in-memory (+ engagement_velocity from snapshots)
    ↓ E.3: Analyze + resurgence detection + discuss with user
    ↓ E.4: Generate recommendations → save to sma_config
    ↓ E.5: Update scoring_weights, pillar_priority, method prefs
    ↓
A-Ideation (next cycle reads updated config) → self-improving loop
```

## Inputs
- Published posts with metrics_history[] (from JS snippet / ChatGPT Actions → n8n → MongoDB)
- Analytics config (`sma_config.analytics_config`)
- Scoring weights (`sma_config.scoring_weights`)
- Engagement config (`sma_config.engagement_config`)

## Outputs
- Performance dashboard with rankings and trends
- Approved strategy recommendations (saved to `sma_config.analytics_recommendations`)
- Updated scoring_weights (if data supports)
- Updated content_pillar_priority
- Preferred methods + formats for B-Drafting
- Underperformer flags

## Webhooks
| Webhook | Method | Step | Purpose |
|---------|--------|------|---------|
| `/sma-analytics-collect` | POST | (manual, multi-point) | JS snippet / ChatGPT Actions → n8n (raw metrics snapshot → metrics_history[]) |
| `/sma-fetch-post` | POST | E.1 | Fetch published posts with metrics |
| `/sma-fetch-config` | POST | E.1, E.5 | Load analytics/scoring/engagement config |
| `/sma-save-config` | POST | E.4, E.5 | Save recommendations + updated weights |

## Engagement Score Formula
```
engagement_score = likes + (comments × 3) + (shares × 2)
engagement_rate  = (engagement_score / follower_count) × 100
```
