# SMA Config Document Schemas

MongoDB collection: `sma_config`
Each document is identified by `_id` matching the `config_doc_id` values in the variable registry.

---

## 1. scoring_weights

Stores the Fibonacci weights applied to each scoring factor during content ideation.

```json
{
  "_id": "scoring_weights",
  "weights": {
    "freshness": 8,
    "personal_experience": 5,
    "research_quality": 3
  },
  "updated_at": "2026-03-14T00:00:00Z",
  "updated_by": "system"
}
```

**Variables:** VAR_A01, VAR_A02, VAR_A03
**Validation:** Each weight must be a Fibonacci number (1, 2, 3, 5, 8, 13, 21). All three weights must be different.

---

## 2. scoring_scales

Stores thresholds, limits, and scale parameters for the scoring system.

```json
{
  "_id": "scoring_scales",
  "individual_minimum": {
    "freshness": 5,
    "personal_experience": 3,
    "research_quality": 2
  },
  "total_minimum_percent": 50,
  "max_score_per_factor": 10,
  "top_n": 3,
  "lookback_days": 14,
  "vector_search": {
    "similarity_threshold": 0.80,
    "limit_per_query": 3
  },
  "updated_at": "2026-03-14T00:00:00Z",
  "updated_by": "system"
}
```

**Variables:** VAR_A04, VAR_A05, VAR_A06, VAR_A07, VAR_A08, VAR_A09, VAR_A10, VAR_A13, VAR_A14
**Validation:**
- `individual_minimum.*`: integer 0–10
- `total_minimum_percent`: integer 20–80 (validated range), registry allows 10–100
- `max_score_per_factor`: integer 5–20
- `top_n`: integer 1–10
- `lookback_days`: integer 7–90
- `vector_search.similarity_threshold`: float 0.50–1.00
- `vector_search.limit_per_query`: integer 1–10

---

## 3. posting_schedule

Stores publishing timing, limits, and platform-specific settings.

```json
{
  "_id": "posting_schedule",
  "max_posts_planned_at_once": 3,
  "posts_per_day": 1,
  "max_posts_per_day": 1,
  "default_publish_time": "09:00",
  "timezone": "Asia/Kolkata",
  "random_delay": {
    "min_minutes": 0,
    "max_minutes": 60
  },
  "platform_defaults": {
    "linkedin": {
      "publish_time": "09:00",
      "visibility": "PUBLIC"
    }
  },
  "day_preferences": {
    "mon": "story_insight",
    "tue": "story_insight",
    "wed": "story_insight",
    "thu": "howto_framework",
    "fri": "light_hottake"
  },
  "updated_at": "2026-03-14T00:00:00Z",
  "updated_by": "system"
}
```

**Variables:** VAR_A11, VAR_A12, VAR_D01, VAR_D02, VAR_D03, VAR_D04, VAR_D05, VAR_D06
**Validation:**
- `default_publish_time`: string in HH:MM 24h format
- `timezone`: valid IANA timezone string
- `platform_defaults.linkedin.visibility`: enum `PUBLIC` | `CONNECTIONS`
- `random_delay.min_minutes` must be ≤ `random_delay.max_minutes`

---

## 4. formatting_config

Stores post formatting constraints, readability rules, and display toggles.

```json
{
  "_id": "formatting_config",
  "character_limits": {
    "min": 800,
    "max": 1600
  },
  "max_emojis": 3,
  "max_hindi_sentences": 3,
  "max_lines_per_block": 3,
  "refinement": {
    "max_iterations": 5,
    "warning_threshold": 3
  },
  "readability": {
    "flesch_kincaid_max_grade": 7
  },
  "hashtags": {
    "min": 3,
    "max": 6
  },
  "default_target_format": "linkedin_post",
  "staircase_direction": "descending",
  "positioning_line_enabled": true,
  "follow_line_enabled": true,
  "updated_at": "2026-03-14T00:00:00Z",
  "updated_by": "system"
}
```

**Variables:** VAR_B01–VAR_B10, VAR_F01–VAR_F04
**Validation:**
- `character_limits.min` must be < `character_limits.max`
- `hashtags.min` must be ≤ `hashtags.max`
- `staircase_direction`: enum `ascending` | `descending` | `mixed`
- `flesch_kincaid_max_grade`: integer 5–12

---

## 5. engagement_config

Stores engagement scoring weights, duplicate detection thresholds, and top-post lookup settings.

```json
{
  "_id": "engagement_config",
  "duplicate_detection": {
    "threshold_high": 0.95,
    "threshold_similar": 0.80
  },
  "top_performing": {
    "posts_count": 5,
    "lookback_days": 30
  },
  "engagement_weights": {
    "likes": 1,
    "comments": 3,
    "shares": 2
  },
  "updated_at": "2026-03-14T00:00:00Z",
  "updated_by": "system"
}
```

**Variables:** VAR_B11–VAR_B17
**Validation:**
- `duplicate_detection.threshold_similar` must be < `duplicate_detection.threshold_high`
- `engagement_weights.*`: integer 1–10
- `top_performing.posts_count`: integer 3–20
- `top_performing.lookback_days`: integer 7–180

---

## 6. review_config

Stores content review automation settings.

```json
{
  "_id": "review_config",
  "quality_checks_enabled": true,
  "auto_fix_enabled": false,
  "updated_at": "2026-03-14T00:00:00Z",
  "updated_by": "system"
}
```

**Variables:** VAR_C01, VAR_C02
**Validation:**
- Both fields are boolean
- `auto_fix_enabled` should only be `true` if `quality_checks_enabled` is also `true`

---

## 7. analytics_config

Stores analytics reporting parameters and engagement benchmarks.

```json
{
  "_id": "analytics_config",
  "no_data_reminder_hours": 48,
  "report_period_days": 7,
  "top_posts_in_report": 5,
  "engagement_benchmarks": {
    "likes": 50,
    "comments": 10
  },
  "updated_at": "2026-03-14T00:00:00Z",
  "updated_by": "system"
}
```

**Variables:** VAR_E01–VAR_E05
**Validation:**
- `no_data_reminder_hours`: integer 24–168
- `report_period_days`: integer 1–30
- `top_posts_in_report`: integer 3–20
- `engagement_benchmarks.likes`: integer 10–500
- `engagement_benchmarks.comments`: integer 5–100

---

## Usage Notes

- **Fallback defaults:** If a config document fails to load from MongoDB, the system uses hardcoded defaults matching the `current_value` column in the variable registry.
- **Update flow:** Users can update config via the A.5 step (interactive customization) or directly through the ChatGPT Actions API.
- **Audit fields:** Every document includes `updated_at` and `updated_by` for change tracking.
- **Collection:** All documents live in the `sma_config` collection in the project's MongoDB database.
