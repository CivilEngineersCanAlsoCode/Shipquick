# Variable Migration Checklist

Migration status for all 48 variables from hardcoded step files to MongoDB `sma_config` collection.

**Priority order:** Multi-workflow variables first, then P1 → P2 → P3.

**Legend:** `[ ]` = not started, `[~]` = in progress, `[x]` = migrated, `[s]` = skip (hardcoded OK)

---

## Multi-Workflow Variables (migrate first)

These variables are referenced by 2+ workflows and benefit most from centralization.

| ID | Variable | Config Doc | Workflows | Current Location | Target | Status |
|----|----------|-----------|-----------|-----------------|--------|--------|
| VAR_A11 | max_posts_planned_at_once | posting_schedule | A, D | step file A.7 | MongoDB | [ ] |
| VAR_A12 | posts_per_day | posting_schedule | A, D | step file A.7 | MongoDB | [ ] |
| VAR_B01 | char_limit_min | formatting_config | B, F | step file B.2 | MongoDB | [ ] |
| VAR_B02 | char_limit_max | formatting_config | B, F | step file B.2 | MongoDB | [ ] |
| VAR_B03 | max_emojis | formatting_config | B, F | step file B.2 | MongoDB | [ ] |
| VAR_B04 | max_hindi_sentences | formatting_config | B, F | step file B.2 | MongoDB | [ ] |
| VAR_B05 | max_lines_per_block | formatting_config | B, F | step file B.2 | MongoDB | [ ] |
| VAR_B08 | flesch_kincaid_max_grade | formatting_config | B, F | step file B.3 | MongoDB | [ ] |
| VAR_B09 | hashtag_count_min | formatting_config | B, F | step file B.3 | MongoDB | [ ] |
| VAR_B10 | hashtag_count_max | formatting_config | B, F | step file B.3 | MongoDB | [ ] |

---

## Workflow A — Content Ideation (14 variables)

| ID | Variable | Config Doc | Priority | Current Location | Target | Status |
|----|----------|-----------|----------|-----------------|--------|--------|
| VAR_A01 | scoring_weight_freshness | scoring_weights | P1 | step file A.4 | MongoDB | [ ] |
| VAR_A02 | scoring_weight_personal_experience | scoring_weights | P1 | step file A.4 | MongoDB | [ ] |
| VAR_A03 | scoring_weight_research_quality | scoring_weights | P1 | step file A.4 | MongoDB | [ ] |
| VAR_A04 | individual_min_freshness | scoring_scales | P1 | step file A.4 | MongoDB | [ ] |
| VAR_A05 | individual_min_personal_experience | scoring_scales | P1 | step file A.4 | MongoDB | [ ] |
| VAR_A06 | individual_min_research_quality | scoring_scales | P1 | step file A.4 | MongoDB | [ ] |
| VAR_A07 | total_minimum_percent | scoring_scales | P1 | step file A.6 | MongoDB | [ ] |
| VAR_A08 | max_score_per_factor | scoring_scales | P2 | step file A.4 | MongoDB | [ ] |
| VAR_A09 | top_n_posts_to_select | scoring_scales | P2 | step file A.6 | MongoDB | [ ] |
| VAR_A10 | lookback_days_freshness | scoring_scales | P2 | step file A.2 | MongoDB | [ ] |
| VAR_A11 | max_posts_planned_at_once | posting_schedule | P2 | step file A.7 | MongoDB | [ ] |
| VAR_A12 | posts_per_day | posting_schedule | P1 | step file A.7 | MongoDB | [ ] |
| VAR_A13 | vector_search_similarity_threshold | scoring_scales | P2 | step file A.3 | MongoDB | [ ] |
| VAR_A14 | vector_search_limit_per_query | scoring_scales | P3 | step file A.3 | MongoDB | [ ] |

---

## Workflow B — Content Drafting (17 variables)

| ID | Variable | Config Doc | Priority | Current Location | Target | Status |
|----|----------|-----------|----------|-----------------|--------|--------|
| VAR_B01 | char_limit_min | formatting_config | P1 | step file B.2 | MongoDB | [ ] |
| VAR_B02 | char_limit_max | formatting_config | P1 | step file B.2 | MongoDB | [ ] |
| VAR_B03 | max_emojis | formatting_config | P2 | step file B.2 | MongoDB | [ ] |
| VAR_B04 | max_hindi_sentences | formatting_config | P2 | step file B.2 | MongoDB | [ ] |
| VAR_B05 | max_lines_per_block | formatting_config | P2 | step file B.2 | MongoDB | [ ] |
| VAR_B06 | max_refinement_iterations | formatting_config | P2 | step file B.3 | MongoDB | [ ] |
| VAR_B07 | iteration_warning_threshold | formatting_config | P3 | step file B.3 | MongoDB | [ ] |
| VAR_B08 | flesch_kincaid_max_grade | formatting_config | P1 | step file B.3 | MongoDB | [ ] |
| VAR_B09 | hashtag_count_min | formatting_config | P2 | step file B.3 | MongoDB | [ ] |
| VAR_B10 | hashtag_count_max | formatting_config | P2 | step file B.3 | MongoDB | [ ] |
| VAR_B11 | duplicate_threshold_high | engagement_config | P1 | step file B.2 | MongoDB | [ ] |
| VAR_B12 | duplicate_threshold_similar | engagement_config | P2 | step file B.2 | MongoDB | [ ] |
| VAR_B13 | top_performing_posts_count | engagement_config | P2 | step file B.2 | MongoDB | [ ] |
| VAR_B14 | top_performing_lookback_days | engagement_config | P2 | step file B.2 | MongoDB | [ ] |
| VAR_B15 | engagement_weight_likes | engagement_config | P2 | step file B.2 | MongoDB | [ ] |
| VAR_B16 | engagement_weight_comments | engagement_config | P2 | step file B.2 | MongoDB | [ ] |
| VAR_B17 | engagement_weight_shares | engagement_config | P2 | step file B.2 | MongoDB | [ ] |

---

## Workflow C — Content Review (2 variables)

| ID | Variable | Config Doc | Priority | Current Location | Target | Status |
|----|----------|-----------|----------|-----------------|--------|--------|
| VAR_C01 | quality_checks_enabled | review_config | P1 | step file C.1 | MongoDB | [ ] |
| VAR_C02 | auto_fix_enabled | review_config | P2 | step file C.1 | MongoDB | [ ] |

---

## Workflow D — Content Publishing (6 variables)

| ID | Variable | Config Doc | Priority | Current Location | Target | Status |
|----|----------|-----------|----------|-----------------|--------|--------|
| VAR_D01 | random_delay_min | posting_schedule | P2 | step file D.2 | MongoDB | [ ] |
| VAR_D02 | random_delay_max | posting_schedule | P2 | step file D.2 | MongoDB | [ ] |
| VAR_D03 | max_posts_per_day | posting_schedule | P1 | step file D.1 | MongoDB | [ ] |
| VAR_D04 | default_publish_time | posting_schedule | P1 | step file D.2 | MongoDB | [ ] |
| VAR_D05 | timezone | posting_schedule | P1 | step file D.2 | MongoDB | [ ] |
| VAR_D06 | linkedin_visibility | posting_schedule | P2 | step file D.2 | MongoDB | [ ] |

---

## Workflow E — Analytics Review (5 variables)

| ID | Variable | Config Doc | Priority | Current Location | Target | Status |
|----|----------|-----------|----------|-----------------|--------|--------|
| VAR_E01 | no_data_reminder_hours | analytics_config | P2 | step file E.1 | MongoDB | [ ] |
| VAR_E02 | report_period_days | analytics_config | P2 | step file E.2 | MongoDB | [ ] |
| VAR_E03 | top_posts_in_report | analytics_config | P3 | step file E.3 | MongoDB | [ ] |
| VAR_E04 | engagement_benchmark_likes | analytics_config | P2 | step file E.2 | MongoDB | [ ] |
| VAR_E05 | engagement_benchmark_comments | analytics_config | P2 | step file E.2 | MongoDB | [ ] |

---

## Workflow F — Content Formatting (4 variables)

| ID | Variable | Config Doc | Priority | Current Location | Target | Status |
|----|----------|-----------|----------|-----------------|--------|--------|
| VAR_F01 | default_target_format | formatting_config | P2 | step file F.2 | MongoDB | [ ] |
| VAR_F02 | staircase_direction | formatting_config | P3 | step file F.2 | MongoDB | [ ] |
| VAR_F03 | positioning_line_enabled | formatting_config | P2 | step file F.2 | MongoDB | [ ] |
| VAR_F04 | follow_line_enabled | formatting_config | P2 | step file F.2 | MongoDB | [ ] |

---

## Summary

| Priority | Count | Status |
|----------|-------|--------|
| P1 | 12 | 0/12 migrated |
| P2 | 31 | 0/31 migrated |
| P3 | 5 | 0/5 migrated |
| **Total** | **48** | **0/48 migrated** |

### Migration Order

1. Multi-workflow variables (10 vars) — reduces duplication risk
2. P1 single-workflow variables (2 remaining) — critical correctness
3. P2 variables (31 vars) — tuning and optimization
4. P3 variables (5 vars) — rarely changed settings
