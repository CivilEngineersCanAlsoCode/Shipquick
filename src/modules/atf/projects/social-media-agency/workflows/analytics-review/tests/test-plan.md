# Analytics Review — Test Plan

## Overview
Test cases for the E-AnalyticsReview workflow (steps E.1–E.5), covering multi-point collection, resurgence detection, follower baseline handling, and the self-improving feedback loop.

---

## E.1 — Fetch Metrics

### TC-E1-01: Happy Path — Posts with Full Metrics
- **Input:** Review period "last week", 5 published posts with engagement_metrics populated
- **Expected:** All 5 posts fetched, analytics_config loaded, proceed to E.2
- **Verify:** `posts.length === 5`, all have `engagement_score`, `engagement_rate`, `metrics_history[]`

### TC-E1-02: No Published Posts in Period
- **Input:** Review period "last week", 0 published posts
- **Expected:** Halt workflow, message: "Is period mein koi published post nahi mila"
- **Verify:** Workflow does NOT proceed to E.2

### TC-E1-03: Posts with Missing Metrics
- **Input:** 5 posts, 2 have `engagement_metrics: null`
- **Expected:** Flag 2 posts, ask user whether to proceed with remaining 3
- **Verify:** If user says yes, proceed with 3 posts; if no, halt

### TC-E1-04: Webhook `/sma-fetch-post` Failure
- **Input:** Webhook returns non-200 or times out
- **Expected:** Retry once after 5s. If retry fails, halt with message to check n8n
- **Verify:** Exactly 1 retry attempt, workflow halts on second failure

### TC-E1-05: Config Fetch Failure — Fallback to Defaults
- **Input:** `/sma-fetch-config` returns error
- **Expected:** Apply defaults (formula: `likes + comments×3 + shares×2`, min_data_points: 5), continue
- **Verify:** Default config used, user notified, workflow proceeds

### TC-E1-06: Custom Date Range
- **Input:** User specifies "March 1 to March 10"
- **Expected:** `period_start = 2026-03-01`, `period_end = 2026-03-10`
- **Verify:** Correct date range passed to fetch webhook

---

## E.2 — Store & Aggregate

### TC-E2-01: Engagement Score Validation
- **Input:** Post with stored `engagement_score: 70`, actual `likes:42 + comments:8×3 + shares:3×2 = 72`
- **Expected:** Flag mismatch, use recalculated value 72
- **Verify:** Warning shown to user, recalculated value used in aggregations

### TC-E2-02: Engagement Velocity — Multi-Point
- **Input:** Post with metrics_history: Day 1 (score 24), Day 3 (score 49), Day 7 (score 72)
- **Expected:** Velocity: Day 1→3: +12.5/day, Day 3→7: +5.75/day. Trajectory: "decelerating"
- **Verify:** Velocity array has 2 entries, trajectory correctly classified

### TC-E2-03: Engagement Velocity — Single Snapshot
- **Input:** Post with metrics_history containing only Day 1 snapshot
- **Expected:** Cannot calculate velocity, skip for this post
- **Verify:** No velocity data, no trajectory, no error

### TC-E2-04: Pillar Aggregation — Missing Pillar Field
- **Input:** 5 posts, 1 has `content_pillar: null`
- **Expected:** Exclude that post from pillar aggregation, include in method/day/hook aggregations
- **Verify:** Pillar aggregation counts 4 posts, other aggregations count 5

### TC-E2-05: Low Confidence — Fewer Than 5 Posts
- **Input:** 3 posts total
- **Expected:** `low_confidence: true` flag set on all aggregations
- **Verify:** User prompted whether to proceed, caveat added to all results

### TC-E2-06: Day-of-Week Aggregation
- **Input:** 2 posts on Tuesday (scores 72, 80), 1 on Monday (score 45)
- **Expected:** Tuesday avg: 76, Monday avg: 45. Best day: Tuesday
- **Verify:** Correct averages, correct ranking

### TC-E2-07: All Posts Missing Same Field
- **Input:** All 5 posts have `hook_framework: null`
- **Expected:** Skip hook aggregation entirely, note in summary
- **Verify:** Hook dimension absent from aggregations, message displayed

### TC-E2-08: Engagement Velocity — Resurgent Trajectory
- **Input:** Post with velocity Day 1→3: +5/day, Day 3→7: +2/day, Day 7→14: +8/day
- **Expected:** Trajectory: "resurgent" (later velocity > earlier velocity)
- **Verify:** Post flagged for resurgence detection in E.3

---

## E.3 — Analyze Performance

### TC-E3-01: Post Classification — Top/Par/Under
- **Input:** Benchmarks: top_quartile=72, bottom_quartile=40. Posts with scores: 92, 65, 35
- **Expected:** 92=top_performer, 65=par, 35=underperformer
- **Verify:** Each post correctly classified

### TC-E3-02: Resurgence Detection — Positive
- **Input:** Post with Day 7 score: 72, Day 14 score: 95
- **Expected:** `resurgence_ratio = (95-72)/72 = 0.32 > 0.20` → flagged as resurgent
- **Verify:** Post appears in resurgent_posts[], insight generated

### TC-E3-03: Resurgence Detection — Below Threshold
- **Input:** Post with Day 7 score: 72, Day 14 score: 80
- **Expected:** `resurgence_ratio = (80-72)/72 = 0.11 < 0.20` → NOT resurgent
- **Verify:** Post does NOT appear in resurgent_posts[]

### TC-E3-04: Resurgence Detection — Day 7 Score Zero
- **Input:** Post with Day 7 score: 0, Day 14 score: 15
- **Expected:** Division by zero avoided. Flag as "resurgence from zero" without ratio
- **Verify:** No crash, post noted but ratio not calculated

### TC-E3-05: Resurgence Detection — Missing Day 14 Snapshot
- **Input:** Post has Day 1, Day 3, Day 7 snapshots but no Day 14
- **Expected:** Resurgence detection skipped for this post
- **Verify:** Post not in resurgent_posts[], no error

### TC-E3-06: Week-over-Week Trend — Improving
- **Input:** Week 1: avg score 52 (5 posts), Week 2: avg score 64 (4 posts)
- **Expected:** `change_pct = +23.1%` → trend: "improving"
- **Verify:** Correct trend classification and percentage

### TC-E3-07: Week-over-Week Trend — Single Week
- **Input:** Review period covers only 1 week
- **Expected:** Trend calculation skipped
- **Verify:** No trend data, no error

### TC-E3-08: Low Confidence Dashboard
- **Input:** `low_confidence: true` (3 posts)
- **Expected:** Dashboard prefixed with warning about limited data
- **Verify:** Caveat message appears before dashboard

### TC-E3-09: Outlier Post
- **Input:** Benchmarks median: 55. One post scores 300 (>5× median)
- **Expected:** Post included but flagged as outlier, median reported alongside mean
- **Verify:** Outlier warning shown, mean and median both displayed

### TC-E3-10: Fewer Than 4 Posts — Quartile Fallback
- **Input:** 3 total posts
- **Expected:** Use median as threshold, classify above/below median (not quartiles)
- **Verify:** Classification uses median, not quartile thresholds

---

## E.4 — Strategy Recommendations

### TC-E4-01: Pillar Rebalancing — Top Performer
- **Input:** Career pillar avg +32% above overall avg
- **Expected:** Recommendation: "increase career content (2→3-4 posts)"
- **Verify:** Pillar rebalancing recommendation generated with correct rationale

### TC-E4-02: Pillar Rebalancing — Missing Pillar
- **Input:** Tech-trends pillar has 0 posts in period
- **Expected:** Variety gap alert: "No tech-trends content — add at least 1"
- **Verify:** Variety gap recommendation generated

### TC-E4-03: Format Insights — Winner Identification
- **Input:** Staircase format avg engagement +30% vs other formats
- **Expected:** Recommendation: "Use Staircase format for 60% of posts"
- **Verify:** Format recommendation generated with advantage percentage

### TC-E4-04: Timing Optimization — Best/Worst Day
- **Input:** Tuesday avg 72 vs overall 58 (+24%), Monday avg 45 (-22%)
- **Expected:** Prefer Tuesday, avoid Monday recommendations
- **Verify:** Both recommendations generated with correct confidence levels

### TC-E4-05: Variety Alert — Repetition
- **Input:** Personal Story method used 4 times consecutively
- **Expected:** Alert: "Break the pattern — insert a different method"
- **Verify:** Repetition alert generated with count

### TC-E4-06: User Rejects Some Recommendations
- **Input:** User approves pillar and timing recs, rejects format recs
- **Expected:** Save only approved recommendations
- **Verify:** Saved doc contains pillar + timing, excludes format

### TC-E4-07: Save Failure — Retry
- **Input:** `/sma-save-config` returns error on first attempt
- **Expected:** Retry once. If succeeds, continue normally
- **Verify:** Exactly 1 retry, recommendations saved on second attempt

### TC-E4-08: Save Failure — Both Attempts
- **Input:** `/sma-save-config` fails twice
- **Expected:** Keep payload in working memory, inform user
- **Verify:** Recommendations not lost, user can retry later

### TC-E4-09: Low Confidence Recommendations
- **Input:** `low_confidence: true`
- **Expected:** All recommendations prefixed with directional-only caveat
- **Verify:** Caveat text present, no definitive claims

---

## E.5 — Feedback Loop

### TC-E5-01: Scoring Weight Update — Happy Path
- **Input:** Personal stories in top quartile, current P weight: 5
- **Expected:** Propose P: 5→6. User approves. Save to MongoDB
- **Verify:** Weight saved, update_history appended, F > P > R maintained

### TC-E5-02: Scoring Weight — Max Change Constraint
- **Input:** Data suggests P weight should go from 5 to 8
- **Expected:** Cap at P: 5→6 (max ±1 per cycle)
- **Verify:** Change limited to ±1, user informed

### TC-E5-03: Scoring Weight — Fibonacci Violation
- **Input:** Current weights F:8, P:7, R:3. Proposal: P: 7→8
- **Expected:** Skip adjustment — would break F > P ordering (F=8, P=8)
- **Verify:** No weight change, user notified of constraint violation

### TC-E5-04: Scoring Weight — Minimum Floor
- **Input:** Current R weight: 2. Data suggests R: 2→1
- **Expected:** Cannot go below R minimum (2). Skip adjustment
- **Verify:** Weight stays at 2, user informed

### TC-E5-05: Pillar Priority Update
- **Input:** Career top performer (+32%), leadership underperformer (-25%)
- **Expected:** Career weight: 1.3, leadership weight: 0.8
- **Verify:** Priorities saved, user approved, A-Ideation will read new priorities

### TC-E5-06: Preferred Methods — B-Drafting Feed
- **Input:** Top combos: Contrarian Take + Pattern Interrupt (avg 85)
- **Expected:** Save preferred_methods with usage notes
- **Verify:** Methods saved to analytics_recommendations, B.3 will prioritize them

### TC-E5-07: Underperformer Flagging
- **Input:** Generic Listicle in bottom quartile (avg 32)
- **Expected:** Flag as "deprioritize" with reason
- **Verify:** Flag saved, B-Drafting will show warning

### TC-E5-08: User Rejects ALL Updates
- **Input:** User says no to all weight/priority changes
- **Expected:** No system updates applied, recommendations saved for historical reference
- **Verify:** analytics_recommendations saved (without applied changes), weights/priorities unchanged

### TC-E5-09: Config Save Partial Failure
- **Input:** `scoring_weights` saves OK, `engagement_config` save fails
- **Expected:** Note inconsistency, retry engagement_config, keep in memory
- **Verify:** User informed which saves succeeded/failed

### TC-E5-10: Final Summary — All Updates Applied
- **Input:** Weights updated, priorities reordered, methods saved, underperformers flagged
- **Expected:** Structured summary showing all 4 update categories
- **Verify:** Summary matches actual changes applied, self-improving loop confirmed

---

## Multi-Point Collection Tests

### TC-MP-01: Full Collection Schedule (Day 1, 3, 7, 14, 30)
- **Input:** Post with all 5 snapshots in metrics_history
- **Expected:** 4 velocity calculations, trajectory classified, resurgence check on Day 7→14
- **Verify:** Complete velocity array, correct trajectory, resurgence evaluated

### TC-MP-02: Out-of-Order Collection
- **Input:** metrics_history snapshots arrive as Day 3, Day 1, Day 7
- **Expected:** Sort by collection_day before calculating velocity
- **Verify:** Velocity calculated correctly regardless of insertion order

### TC-MP-03: Duplicate Collection Day
- **Input:** Two Day 3 snapshots with different values
- **Expected:** Use latest `collected_at` snapshot for that collection_day
- **Verify:** No duplicate velocity entries, correct values used

### TC-MP-04: Missing Middle Snapshot
- **Input:** Post has Day 1, Day 7, Day 14 (missing Day 3)
- **Expected:** Velocity calculated for Day 1→7 and Day 7→14 (skip gap)
- **Verify:** 2 velocity entries, no error from missing Day 3

### TC-MP-05: Day 30 Final Snapshot Analysis
- **Input:** Post with Day 7 score 72, Day 30 score 78
- **Expected:** Long-tail engagement detected but NOT flagged as resurgent (resurgence = Day 14 vs Day 7 only)
- **Verify:** Post trajectory includes Day 30 velocity but resurgence check uses Day 7→14 only

---

## Follower Baseline Tests

### TC-FB-01: First Collection Sets Baseline
- **Input:** First collection (Day 1) sends follower_count: 5200
- **Expected:** `follower_baseline` set to 5200 on post document
- **Verify:** Baseline stored, used for engagement_rate in all subsequent calculations

### TC-FB-02: Follower Count Changes Over Time
- **Input:** Day 1: follower_count 5200, Day 7: follower_count 5350
- **Expected:** Engagement rate uses the snapshot's `follower_count` for that collection_day, `follower_baseline` remains 5200
- **Verify:** Rate calculated with per-snapshot follower_count, baseline unchanged

### TC-FB-03: Follower Count Zero
- **Input:** Collection sends `follower_count: 0`
- **Expected:** `engagement_rate = null` (division by zero avoided), engagement_score still calculated
- **Verify:** No crash, rate excluded from comparisons, score calculated normally

### TC-FB-04: Follower Count Missing
- **Input:** Collection sends no `follower_count` field
- **Expected:** Fall back to `follower_baseline` from post document
- **Verify:** If baseline exists, use it for rate; if not, rate = null

### TC-FB-05: Follower Growth Impact
- **Input:** Day 1: followers 5000, score 50. Day 30: followers 6000, score 50
- **Expected:** Day 1 rate: 1.0%, Day 30 rate: 0.83% — same absolute engagement but lower rate due to growth
- **Verify:** Rate correctly reflects denominator change, analysis notes follower growth context

---

## Feedback Loop Integration Tests

### TC-FL-01: E→A Loop — Scoring Weights Applied
- **Input:** E.5 updates P weight: 5→6. Next A-Ideation runs A.4
- **Expected:** A.4 fetches updated scoring_weights, uses P=6 in formula
- **Verify:** `Score = F×8 + P×6 + R×3` in next ideation cycle

### TC-FL-02: E→A Loop — Pillar Priority Applied
- **Input:** E.5 sets career: 1.3, leadership: 0.8. Next A-Ideation runs A.6
- **Expected:** Career briefs get 1.3× multiplier, leadership gets 0.8×
- **Verify:** `adjusted_score = base_score × 1.3` for career briefs

### TC-FL-03: E→B Loop — Preferred Methods Applied
- **Input:** E.5 saves preferred_methods: Contrarian Take + Pattern Interrupt
- **Expected:** B.3 presents Contrarian Take first in method selection
- **Verify:** Method ordering reflects preference, user still has full choice

### TC-FL-04: E→B Loop — Underperformer Warning
- **Input:** E.5 flags Generic Listicle as underperformer
- **Expected:** B.3 shows Generic Listicle last with warning icon/text
- **Verify:** Warning visible, method still selectable (not removed)

### TC-FL-05: Full Loop — Two Consecutive Cycles
- **Input:** Run E workflow, then A workflow, then B workflow, then through to next E
- **Expected:** Second E review reflects changes from first E review
- **Verify:** Updated weights used in scoring, preferred methods appeared in B.3, new data validates previous recommendations
