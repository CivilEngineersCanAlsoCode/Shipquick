# E — Analytics Review Plan

## Pipeline Position
`A → B → F → C → D → E → (feeds back to A)`

## Steps

### E.1 — Collect Metrics
- **Source:** Chrome Extension (passive DOM reading, zero API ban risk)
- **Metrics:** likes, comments, shares, impressions, profile views
- **Frequency:** Daily cron (extension sends to n8n webhook)
- **Webhook:** POST `/sma-analytics-collect`
- **Payload:** `{ post_urn, likes, comments, shares, impressions, timestamp }`

### E.2 — Store & Aggregate
- **n8n workflow:** Receives from Chrome Extension webhook
- **Actions:**
  1. Find post in `linkedin_posts` by `linkedin_post_urn`
  2. Update `engagement_metrics: { likes, comments, shares, impressions }`
  3. Calculate `engagement_score = likes + (comments × 3) + (shares × 2)`
  4. Save `metrics_collected_at` timestamp
- **Aggregation (daily cron or on-demand):**
  - Average engagement per pillar
  - Average engagement per content method used
  - Best performing day of week
  - Best performing hook framework

### E.3 — Performance Analysis
- **Input:** Aggregated metrics from E.2
- **Output:** Performance insights + pattern detection
- **Analysis dimensions:**
  1. Post-level: This post vs your average → above/below/par
  2. Pillar-level: Which content pillars perform best?
  3. Method-level: Which content methods drive most engagement?
  4. Framework-level: Which hooks, CTAs, tones work best?
  5. Timing: Best publish day/time (from random delay data)
  6. Trend: Week-over-week improvement tracking
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
| `/sma-analytics-collect` | POST | Chrome Extension → n8n (raw metrics) |
| `/sma-fetch-post` | POST | Fetch post for analysis |
| `/sma-update-post` | POST | Save metrics to post |
| `/sma-fetch-config` | POST | Load analytics config |
| `/sma-save-config` | POST | Save recommendations + updated weights |

## Chrome Extension
- Manifest V3
- Passive DOM reading on linkedin.com
- Scrapes own post metrics from feed/profile
- Sends to n8n webhook daily (background service worker cron)
- Zero API usage = zero ban risk

## Engagement Score Formula
`engagement_score = likes + (comments × 3) + (shares × 2)`

## Constraints
- LinkedIn API doesn't support pulling personal profile post metrics
- Chrome Extension is only viable approach for v1
- Extension runs only when Chrome is open (background service worker)
- Data may have gaps if Chrome not opened for days
