# Variable Storage Strategy

## Current State

48 variables across 6 workflows (A, B, C, D, E, F), stored in MongoDB `sma_config` collection as 7 config documents.

### Config Documents

| Doc ID | Variables | Workflows |
|--------|-----------|-----------|
| `scoring_weights` | VAR_A01–A03 (3) | A |
| `scoring_scales` | VAR_A04–A10, A13–A14 (9) | A |
| `posting_schedule` | VAR_A11–A12, D01–D06 (8) | A, D |
| `formatting_config` | VAR_B01–B10, F01–F04 (14) | B, F |
| `engagement_config` | VAR_B11–B17 (7) | B |
| `review_config` | VAR_C01–C02 (2) | C |
| `analytics_config` | VAR_E01–E05 (5) | E |

**Total:** 48 variables, 7 config docs, all user-editable.

---

## Storage Tiers

### Tier 1: Static (hardcoded in step files)
Variables baked into workflow step markdown. Not changeable at runtime. Used for structural constants that should never change without a code release.

**Examples:** Step numbering, workflow phase codes (C/V/E), webhook endpoint paths.

**When to use:** Value is architectural, not tunable.

### Tier 2: Configurable (MongoDB `sma_config`)
The primary tier. All 48 registered variables target this tier. Loaded via `/sma-fetch-config` webhook, updated via `/sma-save-config` webhook.

**Access pattern:** Agent calls n8n webhook → n8n reads/writes MongoDB → returns JSON.

**When to use:** Value should be tunable by user without code changes.

### Tier 3: Dynamic (per-post in `linkedin_posts`)
Per-post metadata stored alongside the post document. Includes computed values like `total_score`, `engagement_score`, `metrics_history[]`.

**Examples:** Post-specific scores, publishing timestamps, analytics snapshots.

**When to use:** Value is specific to a single post, not a system-wide setting.

---

## Access Patterns by Workflow

### Read Access (which workflows read which config docs)

| Config Doc | Read By Steps |
|------------|---------------|
| `scoring_weights` | A.4, E.5 |
| `scoring_scales` | A.4, A.6, A.7 |
| `posting_schedule` | A.7, D.1, D.2 |
| `formatting_config` | B.2, B.3, F.2 |
| `engagement_config` | B.2, B.3 |
| `review_config` | C.1 |
| `analytics_config` | E.1, E.2, E.3 |

### Write Access

| Config Doc | Written By Steps |
|------------|------------------|
| `scoring_weights` | A.5, E.5 |
| `scoring_scales` | A.5 |
| `posting_schedule` | A.5 |
| `formatting_config` | A.5 |
| `engagement_config` | A.5 |
| `review_config` | A.5 |
| `analytics_config` | E.4, E.5 |

### Webhooks Used

- **Read:** `/sma-fetch-config` — POST with `{ "config_id": "<doc_id>" }` → returns full config doc
- **Write:** `/sma-save-config` — POST with `{ "config_id": "<doc_id>", "data": { ... } }` → upserts document

---

## Variable Lifecycle

```
default → user override → A/B test variant → locked
```

### States

1. **Default** — Hardcoded fallback value (from `current_value` in variable-registry.csv). Used when MongoDB config doc fails to load.
2. **User Override** — User updates via A.5 step or ChatGPT Actions API. Stored in MongoDB with `updated_by: "user"`.
3. **A/B Test Variant** — Future: temporarily override a variable for a subset of posts to measure impact. Stored with `updated_by: "ab_test:<test_id>"`.
4. **Locked** — Admin-frozen value that cannot be changed by user. Future: `locked: true` field on individual variables.

### Transition Rules

- Default → User Override: Any time via A.5 or API
- User Override → A/B Test: When analytics E.5 proposes an experiment
- A/B Test → User Override: When experiment concludes, winning value becomes new override
- Any → Locked: Admin action only

---

## Migration Plan

### Current State

All 48 variables have `storage_location: mongodb_config` in the registry. The config-doc-schemas define the target structure. Migration involves:

1. **Ensuring all 7 config docs exist** in MongoDB with correct defaults
2. **Updating step files** to read from config instead of hardcoded values
3. **Removing hardcoded values** from step markdown once config-based reads are confirmed working

### Migration Priority

**Phase 1 (P1 variables — 12 vars):** Scoring weights, character limits, publish time, posts per day — most impactful if wrong.

**Phase 2 (P2 variables — 31 vars):** Thresholds, engagement weights, formatting options — tunable but have safe defaults.

**Phase 3 (P3 variables — 5 vars):** Staircase direction, vector search limit, top posts in report — rarely changed.

### Migration Steps per Variable

1. Verify config doc exists in MongoDB with default value
2. Update step file to call `/sma-fetch-config` and read from response
3. Add fallback: if config fetch fails, use hardcoded default
4. Test: change value in MongoDB, verify workflow uses new value
5. Mark migrated in checklist

---

## Caching Strategy

### Fetch-Once-Per-Session

- Config docs are fetched **once** at the start of each workflow session (step 01: load-session-context)
- Cached in the agent's conversation context for the duration of the session
- No TTL-based expiry — session is short-lived (minutes to hours)

### Refresh Triggers

- **Explicit config update:** When user changes a value via A.5, the updated doc is immediately re-fetched
- **New session:** Fresh fetch on every new workflow invocation
- **Cross-workflow:** If workflow A updates config, workflow B started afterward gets the new values automatically (new session = new fetch)

### No Server-Side Cache

The agent has zero direct DB access. n8n webhooks always read fresh from MongoDB. No intermediate caching layer exists or is needed at current scale.

---

## Validation Rules

### Fibonacci Weight Constraints (scoring_weights)

- Each weight must be a Fibonacci number: 1, 2, 3, 5, 8, 13, 21
- All three weights must be different values
- **Order constraint:** `freshness > personal_experience > research_quality` (F > P > R)
- Default: F=8, P=5, R=3

### Range Constraints (all variables)

Every variable has `min` and `max` defined in the registry. Validation enforces:
- Integer types: `min ≤ value ≤ max`
- Float types: `min ≤ value ≤ max` (2 decimal precision)
- Boolean types: no range, must be true/false
- String types: validated against enum where applicable

### Cross-Field Constraints

| Rule | Config Doc |
|------|-----------|
| `character_limits.min < character_limits.max` | formatting_config |
| `hashtags.min ≤ hashtags.max` | formatting_config |
| `random_delay.min_minutes ≤ random_delay.max_minutes` | posting_schedule |
| `duplicate_detection.threshold_similar < duplicate_detection.threshold_high` | engagement_config |
| `auto_fix_enabled=true` requires `quality_checks_enabled=true` | review_config |

### Fallback Behavior

If a config doc fetch fails (network error, missing doc):
1. Log warning to conversation
2. Use hardcoded defaults from variable-registry.csv `current_value` column
3. Continue workflow execution — never block on config failure
