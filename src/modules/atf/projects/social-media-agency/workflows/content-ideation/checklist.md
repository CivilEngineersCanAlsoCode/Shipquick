# Content Ideation — Quality Checklist

## Pre-Execution Checks (6)

- [ ] Google Sheet has briefs with status "New"
- [ ] n8n webhooks are active (FetchBriefs, FetchPastPosts, SearchExperiences, FetchConfig)
- [ ] Scoring config exists in MongoDB (`scoring_weights`, `scoring_scales`)
- [ ] Vector index `experience_vector_idx` is operational
- [ ] User is available for interactive decisions (A.4, A.6, A.7)
- [ ] No more than 3 open calendar slots needed (max 3 posts per session)

## Scoring Validation (5)

- [ ] Freshness scored against past 14 days of posts (not invented)
- [ ] Personal Experience scored from vector similarity (not manually rated)
- [ ] Research Quality scored from brief boolean fields (has_stats, has_quotes, has_trend, has_data)
- [ ] Gate checks applied in order: F≥5, P≥3, R≥2, Total≥80
- [ ] Formula matches config: `F×weight_F + P×weight_P + R×weight_R`

## Post-Execution Checks (7)

- [ ] Each scheduled post saved to MongoDB with status `Scheduled_NoDraft`
- [ ] Each scheduled post has valid `_id` from MongoDB
- [ ] Notion entries created with status `Scheduled - No Draft` and correct content_pillar (Title Case)
- [ ] Source briefs marked "Used" in Google Sheet
- [ ] Discarded briefs marked "Discarded" with reason and scores in Google Sheet
- [ ] No duplicate topics scheduled within the lookback window
- [ ] User confirmed the final schedule before saves were executed

## Data Integrity (4)

- [ ] No brief processed without webhook data (no hallucinated briefs)
- [ ] Selected posts count ≤ `top_n` (default 3)
- [ ] All linked_experience_ids reference valid MongoDB ObjectIds
- [ ] Scores object includes freshness, personal_experience, research_quality, total
