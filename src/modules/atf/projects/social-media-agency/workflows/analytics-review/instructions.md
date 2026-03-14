# Analytics Review — Agent Instructions

## Overview
This workflow reviews the performance of published LinkedIn content using engagement metrics collected via the Chrome Extension. The agent fetches stored metrics, aggregates data, analyzes performance across multiple dimensions, generates strategy recommendations, and closes the self-improving feedback loop by updating system parameters. ALL data reads and writes go through n8n webhooks — the agent has ZERO direct DB/API access.

## Agents Involved
- **Content Strategist (Echo):** Drives the entire analytics review — fetches metrics, calculates aggregations, presents analysis, facilitates discussion, generates recommendations, and applies feedback loop updates.

## Chrome Extension
The Chrome Extension is a passive DOM reader (Manifest V3) that collects engagement metrics directly from the LinkedIn feed. It reads:
- **Likes** (reactions count)
- **Comments** (comment count)
- **Shares** (repost count)
- **Impressions** (view count, when available)

The extension does NOT interact with the LinkedIn API. It reads what is visible in the DOM when the user visits their post analytics page. Data is sent to the n8n webhook `POST /sma-analytics-collect` automatically via a background service worker. The n8n workflow then:
1. Finds the post in `linkedin_posts` by `linkedin_post_urn`
2. Updates `engagement_metrics: { likes, comments, shares, impressions }`
3. Calculates `engagement_score = likes + (comments × 3) + (shares × 2)`
4. Saves `metrics_collected_at` timestamp

This collection happens in the background — by the time the user starts an analytics review, metrics are already stored.

## Engagement Scoring Formula
```
engagement_score = likes × 1 + comments × 3 + shares × 2
```
- **Comments** weighted highest (×3): deep engagement, conversation signal
- **Shares** weighted next (×2): reach extension to new audiences
- **Likes** at baseline (×1): low-effort engagement signal

## Execution Flow

### Phase 1: Data Collection (E.1 — Fetch Metrics)
1. Ask user for review period (last week / last month / custom)
2. Fetch published posts with engagement_metrics via `/sma-fetch-post`
3. Load analytics config via `/sma-fetch-config`
4. Flag posts with missing metrics, proceed with available data

### Phase 2: Aggregation (E.2 — Store & Aggregate)
5. Validate engagement scores against formula
6. Aggregate by content pillar (avg score, best post)
7. Aggregate by content method (avg score, best combos)
8. Aggregate by day of week (best/worst day)
9. Aggregate by hook framework (avg score)
10. Calculate overall benchmarks (avg, median, quartile thresholds)

### Phase 3: Analysis & Discussion (E.3 — Analyze Performance)
11. Classify each post: top_performer / par / underperformer
12. Present pillar ranking with vs-average comparison
13. Present method ranking with best combos
14. Present framework ranking (hooks, CTAs, tones, formats)
15. Present timing analysis with best/worst day
16. Calculate week-over-week trend (if 2+ weeks)
17. Present structured dashboard in Hinglish
18. Interactive discussion — capture user's qualitative insights

### Phase 4: Recommendations (E.4 — Strategy Recommendations)
19. Generate pillar rebalancing recommendations
20. Generate format/hook/CTA insights
21. Generate timing optimization suggestions
22. Generate method combo recommendations
23. Generate variety alerts
24. Present all recommendations, get user approval
25. Save approved recommendations to `sma_config.analytics_recommendations`

### Phase 5: Feedback Loop (E.5 — Feedback Loop)
26. Fetch current scoring_weights, propose adjustments (max ±1 per weight)
27. Get user approval, save updated weights
28. Reorder content_pillar_priority based on performance
29. Save preferred methods + formats for B-Drafting
30. Flag underperformers for watchlist
31. Present final summary of all system updates
32. Confirm self-improving loop is closed: E → A connection established

## How Feedback Feeds Into Other Workflows

### A-Ideation
- **A.4 (Load Config):** Reads updated `scoring_weights` → changes how briefs are scored
- **A.6 (Score & Select):** Reads `content_pillar_priority` → applies pillar weight multiplier to scores
- **A.6:** Reads `variety_alerts` → flags if selected briefs create category gaps

### B-Drafting
- **B.3 (Curate Methods):** Reads `preferred_methods[]` → presents winning methods first
- **B.3:** Reads `underperformer_flags` → shows deprioritized methods last with warning
- **B.3:** Reads `preferred_formats` → suggests winning format as default

### F-Formatting
- Reads `preferred_formats` → applies top-performing format style by default

## Webhooks
| Webhook | Method | Step | Purpose |
|---------|--------|------|---------|
| `/sma-analytics-collect` | POST | Background | Chrome Extension → n8n (raw metrics) |
| `/sma-fetch-post` | POST | E.1 | Fetch published posts with engagement metrics |
| `/sma-fetch-config` | POST | E.1, E.5 | Load analytics/scoring/engagement config |
| `/sma-save-config` | POST | E.4, E.5 | Save recommendations, weights, priorities |

## Error Handling
- **No published posts for period:** Inform user, suggest shortening review window or checking D-Publishing
- **Chrome Extension data missing:** Ask user to visit LinkedIn analytics page with extension active, then retry
- **n8n webhook unreachable:** Retry once, then ask user to verify n8n is running (`SMA/Data/Read/FetchPost`)
- **Partial data:** Proceed with available data, clearly flag which posts lack metrics
- **Fewer than 5 posts:** Set `low_confidence` flag, add caveats to all recommendations
- **Config save failure:** Keep data in working memory, retry, or ask user to manually check n8n
- **Weight constraint violation:** Skip adjustment, notify user

## Key Constraints
- LinkedIn only (v1)
- Agent has ZERO direct DB/API access — ALL via n8n webhooks
- Chrome Extension is passive — reads DOM, never writes to or interacts with LinkedIn
- All user communication in Hinglish (Hindi-English mix)
- Never invent or hallucinate metrics — always use webhook data
- Insights are suggestions, not directives — user makes final strategy decisions
- Max ±1 weight change per review cycle (no drastic shifts)
- Fibonacci ordering must be maintained (F > P > R)
- Every system parameter change requires explicit user approval

## Success Criteria
- All published posts in the review period have engagement scores
- Aggregations computed across all dimensions (pillar, method, day, hook)
- Top and bottom performers identified with reasoning
- User insights captured through interactive discussion
- Strategy recommendations generated, approved, and saved
- Scoring weights and pillar priorities updated (if warranted by data)
- Preferred methods fed to B-Drafting configuration
- Underperformers flagged for watchlist
- Self-improving feedback loop confirmed closed
