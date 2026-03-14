# E — Analytics Review Plan

## Pipeline Position
`A → B → F → C → D → E → (feeds back to A)`

## Steps

### E.1 — Collect Metrics
- **Source:** JS DevTools snippet (Satvik runs manually on LinkedIn activity page) OR ChatGPT Actions (screenshot upload → vision OCR → webhook)
- **Metrics:** likes, comments, shares, impressions, follower_count
- **Collection schedule:** Day 1, 3, 7, 14, 30 after each post is published
- **Follower baseline:** Captured on first snippet run per post
- **Webhook:** POST `/sma-analytics-collect`
- **Payload:** `{ post_urn, likes, comments, shares, impressions, follower_count, collection_day, collected_at }`
- **Storage:** Appended to `metrics_history[]` array (not overwritten) — each collection creates a timestamped snapshot
- **engagement_rate:** `(engagement_score / follower_count) × 100`

### E.2 — Store & Aggregate
- **n8n workflow:** Receives from JS snippet / ChatGPT Actions webhook
- **Actions:**
  1. Find post in `linkedin_posts` by `linkedin_post_urn`
  2. Append snapshot to `metrics_history[]` array: `{ likes, comments, shares, impressions, follower_count, collection_day, collected_at }`
  3. Calculate `engagement_score = likes + (comments × 3) + (shares × 2)`
  4. Calculate `engagement_rate = (engagement_score / follower_count) × 100`
  5. Update latest `engagement_metrics` with most recent snapshot
  6. Calculate `engagement_velocity` (score change between snapshots)
  7. Save `metrics_collected_at` timestamp
- **Aggregation (daily cron or on-demand):**
  - Average engagement per pillar
  - Average engagement per content method used
  - Best performing day of week
  - Best performing hook framework

### E.3 — Performance Analysis
- **Input:** Aggregated metrics from E.2 (including metrics_history time-series)
- **Output:** Performance insights + pattern detection + resurgence flags
- **Resurgence detection:** If Day 14 score > Day 7 score by >20%, flag post as **resurgent** — indicates algorithmic re-distribution or viral second wave
- **Analysis dimensions:**
  1. Post-level: This post vs your average → above/below/par
  2. Pillar-level: Which content pillars perform best?
  3. Method-level: Which content methods drive most engagement?
  4. Framework-level: Which hooks, CTAs, tones work best?
  5. Timing: Best publish day/time (from random delay data)
  6. Trend: Week-over-week improvement tracking
  7. Trajectory: Per-post engagement decay/growth curve (from metrics_history)
  8. Resurgence: Flag posts where Day 14 score > Day 7 by >20%
- **Presentation:** BMAD interactive session, simple language, Hinglish

### E.4 — Strategy Recommendations
- **Input:** Analysis from E.3 + historical post data
- **Output:** Actionable recommendations
- **Types:**
  1. Pillar rebalancing ("career pillar 2x better → plan more career content")
  2. Format insights ("staircase format = 30% more engagement")
  3. Timing optimization ("Tuesday 10am IST = best window")
  4. Method combos ("Contrarian Take + Personal Story = top performer")
  5. Variety alerts ("no hottake in 7 posts → add variety")
- **Storage:** `sma_config.analytics_recommendations`

### E.5 — Feedback Loop to A
- **Input:** Recommendations from E.4
- **Output:** Adjusted system parameters
- **Actions:**
  1. Update `scoring_weights` if data supports (e.g., reduce P weight if personal posts underperform)
  2. Update `content_pillar_priority` order
  3. Feed top-performing methods to B-ContentDrafting ("prefer these 5 methods")
  4. Flag underperforming frameworks for review
- **Result:** System becomes SELF-IMPROVING over time

## Webhooks
| Webhook | Method | Purpose |
|---------|--------|---------|
| `/sma-analytics-collect` | POST | JS snippet / ChatGPT Actions → n8n (raw metrics snapshot) |
| `/sma-fetch-post` | POST | Fetch post for analysis |
| `/sma-update-post` | POST | Save metrics to post |
| `/sma-fetch-config` | POST | Load analytics config |
| `/sma-save-config` | POST | Save recommendations + updated weights |

## Data Collection Mechanisms

### Primary: JS DevTools Snippet
- Satvik runs manually in Chrome DevTools on LinkedIn activity page
- Scrapes own post metrics from DOM (likes, comments, shares, impressions, follower_count)
- Sends to n8n webhook `POST /sma-analytics-collect`
- Zero API usage = zero ban risk
- Follower count baseline captured on first snippet run per post

### Backup: ChatGPT Actions
- Screenshot of LinkedIn post analytics uploaded to ChatGPT
- Vision OCR extracts metrics from screenshot
- ChatGPT Action sends extracted data to n8n webhook
- Fallback when DevTools snippet is inconvenient

### Collection Schedule
- **Day 1:** First collection after publish (baseline metrics + follower_count)
- **Day 3:** Early traction snapshot
- **Day 7:** Mid-term performance
- **Day 14:** Late performance (resurgence detection checkpoint)
- **Day 30:** Final performance snapshot
- Each collection appends to `metrics_history[]` — never overwrites

### Resurgence Detection
- Compare Day 14 score vs Day 7 score
- If Day 14 > Day 7 by >20% → flag as **resurgent**
- Resurgent posts indicate algorithmic re-distribution or viral second wave
- Feed resurgent patterns back to E.4 recommendations

## Engagement Score Formula
`engagement_score = likes + (comments × 3) + (shares × 2)`

## Engagement Rate Formula
`engagement_rate = (engagement_score / follower_count) × 100`
- Normalizes performance across audience growth
- Requires follower_count from first collection (baseline)

## Constraints
- LinkedIn API doesn't support pulling personal profile post metrics
- JS DevTools snippet + ChatGPT Actions are the collection mechanisms for v1
- Snippet requires Satvik to manually run on LinkedIn activity page at scheduled collection days
- Data may have gaps if collection is missed for a scheduled day
- Chrome Extension deferred to future version
