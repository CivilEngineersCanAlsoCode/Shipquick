# Analytics Review — Error Handling Guide

## 1. Metrics Webhook Failures

### `/sma-fetch-post` Failure (E.1)
| Scenario | Detection | Response | Recovery |
|----------|-----------|----------|----------|
| Network timeout / non-200 | HTTP error or no response | Retry once after 5s | If retry fails: halt workflow, ask user to check `SMA/Data/Read/FetchPost` in n8n |
| Partial response (some posts missing metrics) | `engagement_metrics` is null/empty on post objects | Flag posts lacking metrics, ask user to run JS snippet | Proceed with available data if user approves, otherwise wait |
| Empty result set | `posts.length === 0` | Inform user, suggest adjusting review period or running D-Publishing first | Do NOT proceed to E.2 |

### `/sma-fetch-config` Failure (E.1, E.5)
| Scenario | Detection | Response | Recovery |
|----------|-----------|----------|----------|
| Webhook unreachable | HTTP error | Apply default config: formula `likes + comments×3 + shares×2`, min_data_points: 5 | Non-blocking — continue with defaults, notify user |
| Invalid/corrupt config doc | Missing required fields | Fall back to defaults, log warning | Notify user that config needs manual review in MongoDB |
| Wrong `doc_id` returned | `doc_id` mismatch | Discard response, use defaults | Log for debugging |

### `/sma-save-config` Failure (E.4, E.5)
| Scenario | Detection | Response | Recovery |
|----------|-----------|----------|----------|
| Save fails (network/n8n error) | Non-200 response | Retry once | If retry fails: keep payload in working memory, ask user to check `SMA/Config/Save` workflow |
| Partial save (some docs saved, others not) | Track per-doc success | Report which saves succeeded and which failed | Retry failed saves individually |
| Concurrent write conflict | n8n returns conflict error | Re-fetch current doc, re-apply changes, retry save | If conflict persists, present diff to user |

### `/sma-analytics-collect` Failure (Pre-workflow — JS snippet)
| Scenario | Detection | Response | Recovery |
|----------|-----------|----------|----------|
| Snippet sends malformed JSON | n8n rejects payload | User sees error in DevTools console | Fix snippet payload format, re-run |
| Post URN not found in MongoDB | n8n cannot match `linkedin_post_urn` | Collection silently fails, post has no metrics_history | Verify URN matches published post, re-run D-Publishing status check |
| Duplicate collection_day snapshot | Same `collection_day` sent twice | n8n should append (idempotent by `collection_day`) | If duplicates exist, E.2 uses latest snapshot per collection_day |

---

## 2. Stale Data (>48h No Collection)

### Detection
- In E.1: compare `metrics_collected_at` against current time
- Flag posts where `now - metrics_collected_at > 48 hours` AND expected collection_day has passed

### Staleness Levels
| Level | Condition | Action |
|-------|-----------|--------|
| Fresh | Collected within expected schedule (±24h of collection_day) | Proceed normally |
| Stale | >48h past expected collection_day, no snapshot | Warn user: "Post '[title]' ka Day [N] collection miss ho gaya. JS snippet run karo." |
| Very stale | >7 days past expected collection_day | Mark post with `data_quality: "stale"`, add caveat to all analysis involving this post |
| Abandoned | Published >30 days ago with <2 snapshots | Exclude from trend analysis, include in score analysis with warning |

### Handling Rules
- Never skip stale posts from aggregation — include with `data_quality` flag
- If >50% of posts are stale: prepend dashboard with staleness warning
- If ALL posts are stale: halt and ask user to run collection before proceeding
- Track collection schedule compliance: "X/Y posts collected on time this period"

---

## 3. MongoDB Aggregation Errors

### In-Memory Aggregation Failures (E.2)
The agent performs aggregation in working memory (not MongoDB aggregation pipeline), but these errors can occur:

| Scenario | Detection | Response | Recovery |
|----------|-----------|----------|----------|
| Missing `content_pillar` on post | Field is null/undefined | Exclude post from pillar aggregation, include in all others | Flag: "Post '[title]' mein content_pillar missing — pillar aggregation se exclude kiya" |
| Missing `content_method` on post | Field is null/undefined | Exclude from method aggregation, include in others | Same pattern — flag and continue |
| Missing `hook_framework` on post | Field is null/undefined | Exclude from hook aggregation | Flag and continue |
| All posts missing a field | Entire aggregation dimension empty | Skip that dimension, note in dashboard | "Hook aggregation skip kiya — kisi post mein hook_framework nahi tha" |
| `metrics_history[]` empty or malformed | Array missing or contains non-object entries | Cannot calculate engagement_velocity | Use latest `engagement_metrics` only, skip velocity/trajectory |
| Single snapshot in metrics_history | Array length === 1 | Cannot calculate velocity (need 2+ points) | Skip velocity for this post, note "Day 1 only" |

### Data Consistency Issues
| Scenario | Detection | Response | Recovery |
|----------|-----------|----------|----------|
| Engagement score mismatch | Stored score !== recalculated score | Use recalculated value | Flag: "Post '[title]' ka score mismatch — recalculated value use kar raha hoon" |
| Negative metric values | likes/comments/shares < 0 | Treat as 0 | Flag anomaly, suggest checking n8n collection workflow |
| Metrics decrease between snapshots | Day N values < Day N-1 values | Possible LinkedIn data correction | Use latest values, note "metrics adjusted by platform" |

---

## 4. Scoring Calculation Edge Cases

### Division by Zero — Follower Count
The engagement rate formula: `engagement_rate = (engagement_score / follower_count) × 100`

| Scenario | Detection | Response |
|----------|-----------|----------|
| `follower_count === 0` | Zero value in snapshot | Set `engagement_rate = null`, exclude from rate-based comparisons |
| `follower_count` missing | Field undefined/null | Use `follower_baseline` from post document |
| `follower_baseline` also missing | Both undefined | Set `engagement_rate = null`, flag: "Follower count unavailable — rate calculation skipped" |
| `follower_count === 0` in ALL posts | Systemic collection issue | Skip all engagement_rate analysis, rely on raw engagement_score only |

### Other Scoring Edge Cases
| Scenario | Detection | Response |
|----------|-----------|----------|
| All metrics zero (likes=0, comments=0, shares=0) | `engagement_score === 0` | Valid — post had no engagement. Include in analysis as score 0 |
| Extremely high outlier (score > 5× median) | Post score >>> benchmarks.median × 5 | Include in analysis but flag: "Outlier detected — may skew averages". Report median alongside mean |
| Only 1 post in a pillar/method group | Group size === 1 | Cannot compute meaningful average — report single value with "n=1" caveat |
| Quartile calculation with < 4 posts | Total posts < 4 | Use median as threshold, classify as above/below median only (not quartiles) |
| Velocity calculation: zero time delta | Two snapshots on same collection_day | Skip duplicate, use earliest and latest unique collection_days |
| Resurgence ratio denominator zero | Day 7 engagement_score === 0 | Cannot calculate ratio — if Day 14 > 0, flag as "resurgence from zero" without ratio |

### Weight Constraint Violations (E.5)
| Scenario | Detection | Response |
|----------|-----------|----------|
| Proposed weight change > ±1 | `abs(new - old) > 1` | Cap change at ±1, inform user |
| Change breaks F > P > R ordering | New values violate Fibonacci ordering | Skip adjustment, notify: "Weight change F > P > R constraint violate karta hai" |
| Weight below minimum (F<5, P<3, R<2) | New value below floor | Clamp to minimum, inform user |
| All weights adjusted simultaneously | 3 changes in one cycle | Allow (each capped at ±1), but flag for user awareness |

---

## 5. Config Save Failures

### Save Failure Taxonomy
| Doc ID | Step | Impact if Save Fails | Mitigation |
|--------|------|---------------------|------------|
| `analytics_recommendations` | E.4 | Recommendations lost for future reference | Keep in working memory, retry before session end |
| `scoring_weights` | E.5 | Next A-Ideation uses old weights | Old weights still functional — no degradation, just no improvement |
| `engagement_config` | E.5 | Pillar priorities not updated | Old priorities still functional — flag for next review |

### Retry Strategy
1. **First failure:** Retry once immediately
2. **Second failure:** Notify user, keep payload in working memory
3. **Session end approaching:** Attempt one final save of all pending payloads
4. **All retries exhausted:** Present the JSON payload to user for manual insertion via n8n or MongoDB

### Partial Save Scenarios
- If `analytics_recommendations` saves but `scoring_weights` fails: recommendations reference weight changes that aren't applied — note this inconsistency
- If `scoring_weights` saves but `engagement_config` fails: weights updated but pillars not — acceptable, pillars are secondary
- Track which docs saved successfully in a `save_status{}` object through E.5

### Working Memory Persistence
- All payloads remain in working memory even after successful save
- If session terminates unexpectedly, unsaved payloads are lost
- Mitigation: save each config doc immediately after user approval (don't batch)

---

## General Error Handling Principles

1. **Never lose data** — keep payloads in working memory even if save fails
2. **Never hallucinate metrics** — if data is missing, say so
3. **Never block on non-critical failures** — config fetch failures use defaults, partial data proceeds with flags
4. **Always inform the user** — every error gets a Hinglish message explaining what happened
5. **Retry exactly once** — then escalate to user, don't loop
6. **Degrade gracefully** — skip dimensions with no data rather than failing the entire workflow
7. **Flag, don't drop** — stale/partial/outlier data stays in analysis with appropriate caveats
