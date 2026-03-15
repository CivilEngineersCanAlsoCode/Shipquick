# J6 — Config Management Journey Map

**Workflow:** Cross-cutting (A.4–A.5, E.4–E.5, and standalone config updates)
**Agents:** Any agent can read config; Scout and Echo/Relay can write
**Trigger:** User says "Config update karo" or arrives via E.5 feedback loop
**Data store:** MongoDB `sma_config` collection

---

## Journey Overview

```
View current     Select config     Make changes     Preview impact     Save &
config        →  doc to edit    →  (interactive) →  (before/after)  →  verify
```

---

## Config Documents

Seven config documents in `sma_config` collection:

| doc_id | Purpose | Primary Users | Update Frequency |
|--------|---------|---------------|-----------------|
| `scoring_weights` | Fibonacci weights (F×8, P×5, R×3) | A.4, E.5 | Monthly (via analytics) |
| `scoring_scales` | Scale definitions (1–10 per dimension) | A.4 | Rarely |
| `posting_schedule` | Days, times, max posts/day, slot rules | A.7, D.1 | Weekly/monthly |
| `formatting_config` | LinkedIn formatting rules | F.2 | Rarely |
| `engagement_config` | Engagement formula weights | E.2 | Monthly |
| `review_config` | Review workflow rules, approval criteria | C.1 | Rarely |
| `analytics_config` | Collection schedule, benchmark thresholds | E.1 | Monthly |

---

## Journey: Standalone Config Update

### Step 1: View Current Config — ~15 seconds

| Aspect | Detail |
|--------|--------|
| **User action** | Says "Show me current config" or "Scoring config dikhao" |
| **System action** | Fetch requested config doc(s) |
| **Webhook** | `POST /sma-fetch-config` (doc_ids: [requested]) |

**User sees:**
```
⚙️ CURRENT CONFIGURATION

═══ scoring_weights ═══
  Freshness weight:            8  (Fibonacci)
  Personal Experience weight:  5  (Fibonacci)
  Research Quality weight:     3  (Fibonacci)
  Max score:                   160 points
  Minimum threshold:           80 points (50%)
  Individual minimums:         F≥5, P≥3, R≥2

  Last updated: Mar 7, 2026 (via E.5 analytics feedback)

═══ posting_schedule ═══
  Active days:     Mon–Thu
  Posts per day:   1 (max)
  Planning horizon: 7 days
  Delay range:     0–60 min (anti-bot)

  Last updated: Mar 1, 2026

Which config to edit? (scoring/schedule/formatting/engagement/review/analytics)
```

### Step 2: Select & Edit — 1–5 minutes

**Example: Editing scoring_weights**

```
⚙️ EDITING: scoring_weights

Current values:
  F weight: 8 | P weight: 5 | R weight: 3
  Min threshold: 80 | F min: 5 | P min: 3 | R min: 2

What would you like to change?
  Examples:
  - "Increase P weight to 6"
  - "Lower threshold to 70"
  - "Change F minimum to 4"
```

**User says:** "Increase P weight to 6 and lower threshold to 70"

### Step 3: Preview Impact — ~10 seconds

| Aspect | Detail |
|--------|--------|
| **User action** | Reviews before/after comparison |
| **System action** | Calculate impact on recent/hypothetical posts |

**User sees:**
```
⚙️ PREVIEW: scoring_weights changes

  BEFORE                          AFTER
  F×8 + P×5 + R×3 = max 160     F×8 + P×6 + R×3 = max 170
  Threshold: 80 (50%)            Threshold: 70 (41%)

  Impact on last 5 ideation briefs:
  Brief                    Old Score  New Score  Status Change
  "SQL for PMs"            134/160    141/170    ✅ Still passes
  "AmEx year one"          121/160    129/170    ✅ Still passes
  "Design thinking"        96/160     101/170    ✅ Still passes
  "AI tools roundup"       72/160     77/170     ✅ NOW PASSES (was ❌)
  "Generic networking"     58/160     63/170     ❌ Still fails

  ⚠️ 1 additional brief would now pass threshold.

Apply changes? (y/n/adjust)
```

**Emotion:** Informed — "I can see exactly what this change does"
**Pain point:** Impact preview requires past data; if no history, preview is theoretical only

### Step 4: Save & Verify — ~10 seconds

| Aspect | Detail |
|--------|--------|
| **User action** | Confirms changes |
| **System action** | Save to MongoDB, verify |
| **Webhook** | `POST /sma-save-config` (updated doc) |

**User sees:**
```
✅ Config updated!

  scoring_weights:
    P weight: 5 → 6
    Threshold: 80 → 70
    Max score: 160 → 170

  Saved at: Sat Mar 14, 7:45 PM IST
  Next A-Ideation will use these weights.
```

---

## Journey: Config via Analytics Feedback Loop (E.5)

When arriving from E.5, the flow is the same but context-driven:

```
E.3 analysis shows     E.4 recommends        E.5 applies changes
career pillar      →   reduce career      →   scoring_weights +
underperforming         weight, boost          pillar_priority
                        skill-building         updated
```

**Key difference:** Changes are suggested by the agent based on data, not initiated by user. User approves/adjusts.

---

## All Config Fields Reference

### scoring_weights
```yaml
freshness_weight: 8          # Fibonacci, 1-13 range
personal_experience_weight: 5 # Fibonacci, 1-13 range
research_quality_weight: 3    # Fibonacci, 1-13 range
min_threshold_percent: 50     # % of max score
min_freshness: 5              # Individual minimum (1-10)
min_personal_experience: 3    # Individual minimum (1-10)
min_research_quality: 2       # Individual minimum (1-10)
```

### scoring_scales
```yaml
freshness:
  1: "Topic posted about last week"
  5: "Topic not covered in 30 days"
  10: "Completely novel topic for this audience"
personal_experience:
  1: "No personal connection"
  5: "Indirect experience"
  10: "Direct, vivid, personal story"
research_quality:
  1: "No supporting data"
  5: "Basic research/references"
  10: "Deep research with unique insights"
```

### posting_schedule
```yaml
active_days: [Mon, Tue, Wed, Thu]  # Days to post
max_posts_per_day: 1
planning_horizon_days: 7
publish_delay_min: 0               # Minutes
publish_delay_max: 60              # Minutes
preferred_times: ["8:00-10:00"]    # IST
```

### formatting_config
```yaml
min_chars: 800
max_chars: 1600
max_emojis: 3
max_hindi_sentences: 3
max_hashtags: 6
min_hashtags: 3
max_hook_chars: 210
target_fk_grade: 7
max_line_block: 3
staircase_layout: true
uppercase_headers: sparingly
```

### engagement_config
```yaml
like_weight: 1
comment_weight: 3
share_weight: 2
collection_days: [1, 3, 7, 14, 30]
resurgence_threshold: 0.20        # Day 14 > Day 7 by 20%
benchmark_period_days: 90
```

### review_config
```yaml
auto_approve: false               # Always require manual review
max_edits_per_review: 3
require_formatting_check: true
allow_reschedule: true
allow_send_back: true
```

### analytics_config
```yaml
default_period: "last_7_days"
min_posts_for_analysis: 3
confidence_threshold: 5           # Min posts per category for recommendations
trend_window: 30                  # Days for trend analysis
pillar_priority:                  # Multipliers for ideation scoring
  skill_building: 1.3
  career: 1.1
  leadership: 1.0
  personal: 0.9
  tech_insights: 0.7
preferred_methods: ["Contrarian Hook", "Story-to-Insight"]
underperformer_flags: ["List Hook", "Formal Tone"]
```

---

## Touchpoint Map

| Touchpoint | Channel | Interaction Type |
|------------|---------|-----------------|
| View config | ChatGPT (LinkRight HQ) | Conversational query |
| Edit config | ChatGPT | Conversational instruction |
| Impact preview | ChatGPT | Read comparison table |
| Confirm save | ChatGPT | Yes/no |
| Auto-suggested changes | ChatGPT (via E.5) | Approve/adjust agent recommendation |

---

## Error States & Edge Cases

| Condition | User Impact | System Response |
|-----------|-------------|-----------------|
| Invalid weight value (e.g., negative) | Rejected | "Weight must be positive. Fibonacci values recommended: 1,2,3,5,8,13." |
| Threshold > 100% | Rejected | "Threshold cannot exceed 100%. Current max: 100%." |
| Config save fails | Changes lost | "Save failed. Your changes: [list]. Retry?" |
| Conflicting config (e.g., min > max) | Rejected | "min_chars (800) cannot exceed max_chars (1600). Adjust?" |
| User wants to rollback | No built-in versioning | "Previous config was: [values]. Apply these?" (agent remembers from conversation) |
| Schedule change conflicts with queued posts | Downstream impact | "3 posts scheduled for Friday. Removing Friday from active_days will orphan them. Reschedule?" |

---

## Opportunities for Dashboard

1. **Config panel in Settings** — Dedicated settings page with form-based editing
2. **Impact simulator** — "What if" tool: change weights and see how past briefs would score
3. **Config changelog** — Version history with timestamps and who changed what
4. **Rollback button** — One-click revert to previous config version
5. **Config presets** — Save named config profiles ("Aggressive growth", "Steady pace")
6. **Validation indicators** — Real-time validation as user types new values
7. **Config dependency graph** — Show which workflows read which config docs
