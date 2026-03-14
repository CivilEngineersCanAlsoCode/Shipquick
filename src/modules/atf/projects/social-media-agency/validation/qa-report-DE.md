# QA Validation Report — D (Content Publishing) + E (Analytics Review)

**Validator:** Sentinel
**Date:** 2026-03-14
**Status:** ISSUES FOUND

---

## Summary

| Workflow | Files Reviewed | PASS | WARN | FAIL |
|----------|---------------|------|------|------|
| D — Content Publishing | 14 | 18 | 3 | 0 |
| E — Analytics Review | 15 | 14 | 2 | 4 |
| **Total** | **29** | **32** | **5** | **4** |

**Overall Verdict: CONDITIONAL PASS** — D is ready; E has 4 failures requiring action before implementation.

---

## D — Content Publishing

### 1. COMPLETENESS: PASS

All required files present per BMAD/LR v6 standard:

| File | Status | Notes |
|------|--------|-------|
| `workflow.yaml` | PASS | name, code, config_source, installed_path, instructions, validation, template, input_file_patterns |
| `workflow.md` | PASS | Frontmatter (name, description, code, initWorkflow), steps table, flow diagram, webhook reference, inputs/outputs |
| `instructions.md` | PASS | Overview, prerequisites, step-by-step with exact payloads, error handling table, "What NOT to Do" section |
| `checklist.md` | PASS | 21 checks across 4 categories (pre-publish 7, publish 4, post-publish 5, weekly 5) |
| `templates/publish-report.template.md` | PASS | All fields templated with `{{variables}}`, execution summary table, checklist summary |
| `steps-c/step-01-load-session-context.md` | PASS | Session init, in-progress check, environment check, session variables |
| `steps-c/step-01b-resume-if-interrupted.md` | PASS | 4 recovery cases (D.1-done, D.2-done, D.3-done, unknown), one-shot rule respected in recovery |
| `steps-c/step-D1-fetch-ready-posts.md` | PASS | Agent: Relay, webhook + JSON payload, response handling, error handling, "What NOT to Do" |
| `steps-c/step-D2-publish-to-linkedin.md` | PASS | Agent: Relay, 3 duplicate guard checks, random delay formula, one-shot rule, full error handling |
| `steps-c/step-D3-update-status.md` | PASS | Agent: Relay, exact payload, non-critical failure handling, optional verification step |
| `steps-c/step-D4-notify-telegram.md` | PASS | Agent: Relay, chat_id specified, message template, D.3-failure warning variant |
| `steps-v/step-01-validate.md` | PASS | 10 validation criteria, report template |
| `steps-e/step-01-assess.md` | PASS | Edit mode for metadata correction |
| `steps-e/step-02-apply-edit.md` | PASS | Apply corrections + verify |

### 2. CONSISTENCY: PASS (with warnings)

#### Status Transitions
- `Ready_ToPublish` -> `Published` (success path): PASS
- `Ready_ToPublish` -> `Publish_Failed` (error path): PASS
- Transitions match CONTEXT.md status flow: PASS

#### Webhook Names vs CONTEXT.md

| Webhook | CONTEXT.md | D Step Files | Match? |
|---------|-----------|-------------|--------|
| `/sma-fetch-post` | D.1 | D.1, D.2 (1/day check) | PASS |
| `/sma-publish-linkedin` | D.2 | D.2 | PASS |
| `/sma-update-post` | D.3 | D.2 (Publish_Failed), D.3 | PASS |
| `/sma-notify-telegram` | NOT LISTED | D.4 | WARN |

> **WARN-D1:** `/sma-notify-telegram` webhook is used in D.4 but is NOT registered in CONTEXT.md webhook table. Add it to CONTEXT.md.

> **WARN-D2:** CONTEXT.md lists `/sma-update-post` as used by "B.4, C.2, D.3" but D.2 also uses it (to mark `Publish_Failed`). Update CONTEXT.md to include D.2.

### 3. ACCURACY: PASS

| Requirement | Expected | Found | Status |
|------------|----------|-------|--------|
| ONE SHOT publish (no retry) | No retries ever | D.2: "One-Shot Rule — ABSOLUTE, NON-NEGOTIABLE", "Not once. Not ever. Not even if the user asks." | PASS |
| Duplicate guard (check not already Published) | Check linkedin_post_urn, status, and 1/day | D.2: THREE checks — (1) status still Ready_ToPublish, (2) no post published today, (3) linkedin_post_urn not already set | PASS |
| 1/day guard | Max 1 post per day | D.1: "Aaj already ek post publish ho chuka hai" check; D.2: re-checks via fetch with `published_date: today` | PASS |
| Random delay (0-60 min) | Random integer 0-60 inclusive | D.2: `Math.floor(Math.random() * 61)` — correct formula for 0-60 inclusive | PASS |
| Telegram to chat_id -1003399716516 | Exact chat_id | D.4: `"chat_id": "-1003399716516"` explicitly set, "Do NOT send to any chat other than `-1003399716516`" | PASS |
| User confirmation before publish | Always ask user | D.1: "Do NOT auto-select even if there's only 1 post" | PASS |
| Content unmodified | Publish exactly as approved in C | D.2: "Send the content exactly as it was approved in Review (C). Do NOT reformat, trim, or modify" | PASS |

### 4. CROSS-REFERENCES

| Check | Status | Notes |
|-------|--------|-------|
| D.4 mentions E-Analytics as next step | PASS | "E (Analytics Review) workflow se performance track hoga" |
| D.4 includes metrics reminder for E | WARN | D.4 notification does NOT include a reminder to collect metrics via Chrome Extension. Consider adding a line about when E.1 should run. |

> **WARN-D3:** D.4 Telegram notification doesn't remind about metrics collection. Low severity — the Chrome Extension collects automatically, but a "metrics collection starts now" note would improve observability.

### 5. Template Correctness: PASS

`publish-report.template.md` — All fields have `{{variable}}` placeholders, execution summary covers D.1-D.4, checklist summary tallies pre/publish/post-publish counts.

### 6. Checklist Correctness: PASS

21 checks covering all critical paths. Weekly review checks include duplicate URN detection and stale post detection.

---

## E — Analytics Review

### 1. COMPLETENESS: PASS

All required files present:

| File | Status | Notes |
|------|--------|-------|
| `workflow.yaml` | PASS | name, code, config_source, instructions, validation, template, 2 input patterns |
| `workflow.md` | PASS | Frontmatter, 5 steps, data flow diagram, webhooks, engagement formula |
| `instructions.md` | PASS | Detailed 32-step execution flow, error handling, key constraints, success criteria |
| `checklist.md` | PASS | 18 checks across 4 categories |
| `templates/analytics-report.template.md` | PASS | Period, engagement summary, top/bottom performers, trends, strategy adjustments |
| `steps-c/step-01-load-session-context.md` | PASS | Config loading, period determination, prerequisites |
| `steps-c/step-01b-resume-if-interrupted.md` | PASS | Resume logic for each step |
| `steps-c/step-E1-fetch-metrics.md` | PASS | Agent: Echo, period selection, 2 webhook calls, error handling |
| `steps-c/step-E2-store-aggregate.md` | PASS | 6 aggregation actions, formula validation, low-confidence flag |
| `steps-c/step-E3-analyze-performance.md` | PASS | 6 analysis dimensions, dashboard template, interactive discussion |
| `steps-c/step-E4-strategy-recommendations.md` | PASS | 5 recommendation types, user approval flow, save to MongoDB |
| `steps-c/step-E5-feedback-loop.md` | PASS | 4 actions (weights, pillars, methods, underperformers), final summary |
| `steps-v/step-01-validate.md` | PASS | 5 quality gate categories |
| `steps-e/step-01-assess.md` | PASS | Edit mode assessment |
| `steps-e/step-02-apply-edit.md` | PASS | Apply corrections + re-validate |

### 2. CONSISTENCY: PASS (with warnings)

#### Webhook Names vs CONTEXT.md

| Webhook | CONTEXT.md | E Step Files | Match? |
|---------|-----------|-------------|--------|
| `/sma-analytics-collect` | E.1 (background, Chrome Extension) | E.1 (background) | PASS |
| `/sma-fetch-post` | E.1 | E.1 | PASS |
| `/sma-fetch-config` | E.1, E.5 | E.1, E.5 | PASS |
| `/sma-save-config` | E.4, E.5 | E.4, E.5 | PASS |

> **WARN-E1:** `checklist.md` line "Notion KPIs database is accessible via n8n webhook" has no corresponding webhook in CONTEXT.md. CONTEXT.md states "Notion = view-only". This check should be removed or clarified.

> **WARN-E2:** `workflow.yaml` description still says "via Chrome Extension" — should be updated if Chrome Extension is deferred (see FAIL-E1 below).

### 3. ACCURACY: MIXED (4 FAILURES)

#### Engagement Formula
| Requirement | Expected | Found | Status |
|------------|----------|-------|--------|
| `likes + comments*3 + shares*2` | Exact formula | E plan, workflow.md, instructions.md, E.1, E.2, checklist.md — all consistent | PASS |
| Comment weighting rationale | Comments highest | instructions.md: "Comments weighted highest (x3): deep engagement, conversation signal" | PASS |

#### Multi-Point Collection

| Requirement | Expected | Found | Status |
|------------|----------|-------|--------|
| Day 1,3,7,14,30 collection schedule | Scheduled multi-point scrapes | NOT FOUND in any file | **FAIL** |

> **FAIL-E1: Multi-point collection not implemented.** The E plan and all step files describe a single-snapshot collection model (Chrome Extension sends data whenever the user visits LinkedIn). There is NO scheduling mechanism for Day 1, 3, 7, 14, 30 post-publish metric snapshots. This means:
> - No tracking of metric evolution over time per post
> - No decay/growth curve analysis possible
> - Resurgence detection impossible without time-series data
>
> **Recommendation:** Add a `collection_schedule` field to `analytics_config` and modify the n8n `/sma-analytics-collect` workflow to store timestamped metric snapshots in an array (e.g., `engagement_history: [{day: 1, likes: 10, ...}, {day: 3, likes: 25, ...}]`). Update E.1 and E.2 to handle multi-point data.

#### Follower Count Baseline

| Requirement | Expected | Found | Status |
|------------|----------|-------|--------|
| Follower count tracking | Baseline + growth | NOT FOUND in any file | **FAIL** |

> **FAIL-E2: Follower count baseline not tracked.** No step file captures follower count before/after posts. Without this:
> - Cannot calculate engagement rate (score / followers)
> - Cannot normalize scores as audience grows
> - Cannot attribute follower growth to specific content
>
> **Recommendation:** Add `follower_count` to the Chrome Extension data payload and E.1 fetch response. Store as a time-series in the post record or a separate `follower_history` collection.

#### Resurgence Detection

| Requirement | Expected | Found | Status |
|------------|----------|-------|--------|
| Detect posts that re-spike after initial period | Resurgence logic | NOT FOUND in any file | **FAIL** |

> **FAIL-E3: Resurgence detection not implemented.** Without multi-point collection (FAIL-E1), resurgence detection is architecturally impossible. No step file mentions detecting posts that gain traction days/weeks after publishing.
>
> **Recommendation:** Depends on FAIL-E1 resolution. Once multi-point data exists, add resurgence detection logic to E.3 (e.g., "if Day 14 score > Day 7 score by >20%, flag as resurgent").

#### Chrome Extension Deferral

> **FAIL-E4: Chrome Extension DEFERRED but all files still reference it.** The task states Chrome Extension was replaced by JS snippet + ChatGPT Actions. However, EVERY E workflow file still references Chrome Extension:
>
> | File | Chrome Extension References |
> |------|---------------------------|
> | `E-analytics-review-plan.md` | "Source: Chrome Extension", "Chrome Extension → n8n webhook", Manifest V3 details, entire "Chrome Extension" section |
> | `workflow.yaml` | description: "via Chrome Extension" |
> | `workflow.md` | "Chrome Extension engagement metrics", "Chrome Extension (passive DOM reading)" in data flow |
> | `instructions.md` | "Chrome Extension is a passive DOM reader (Manifest V3)", 4+ references |
> | `checklist.md` | "Chrome Extension data is available" |
> | `step-E1-fetch-metrics.md` | "Chrome Extension (Manifest V3) runs as a background service worker", payload example |
> | `CONTEXT.md` | `/sma-analytics-collect` listed as "E.1 (background, Chrome Extension)" |
>
> **None of these files mention JS snippet or ChatGPT Actions.**
>
> **Recommendation:** Update all E files to replace Chrome Extension references with the new JS snippet + ChatGPT Actions approach. At minimum:
> 1. Update E plan to describe new collection mechanism
> 2. Update E.1 step to document new data flow
> 3. Update instructions.md collection section
> 4. Update workflow.yaml description
> 5. Update CONTEXT.md webhook annotation
> 6. Keep Chrome Extension as a "future/deferred" note if desired

### 4. CROSS-REFERENCES

| Check | Status | Notes |
|-------|--------|-------|
| E.5 feeds back to A scoring | PASS | E.5 updates `scoring_weights` (read by A.4), `content_pillar_priority` (read by A.6), `preferred_methods` (read by B.3). instructions.md has explicit "How Feedback Feeds Into Other Workflows" section mapping to A.4, A.6, B.3, F. |
| E.5 updates use `/sma-save-config` | PASS | Matches CONTEXT.md |
| E.4 `variety_alerts` feeds A.6 | PASS | instructions.md: "A.6: Reads `variety_alerts` -> flags if selected briefs create category gaps" |
| E.5 max +/-1 weight constraint | PASS | "Max change per review: +/-1 per weight", "Fibonacci sequence must still be maintained" |
| E.5 Fibonacci ordering (F > P > R) | PASS | Explicit constraint in E.5 and instructions.md |

### 5. Template Correctness: PASS

`analytics-report.template.md` — Covers period, engagement summary table with formula note, top 3 / bottom 3 performers with scores, trends (format, timing, topic, trajectory), user insights section, strategy adjustments section.

### 6. Checklist Correctness: PASS (with warning)

18 checks across 4 categories. See WARN-E1 about Notion KPIs reference.

---

## Issue Registry

### Failures (Must Fix)

| ID | Severity | Workflow | Issue | Affected Files |
|----|----------|----------|-------|----------------|
| FAIL-E1 | HIGH | E | Multi-point collection (Day 1,3,7,14,30) not implemented | E plan, E.1, E.2 |
| FAIL-E2 | MEDIUM | E | Follower count baseline not tracked | E plan, E.1, instructions.md |
| FAIL-E3 | MEDIUM | E | Resurgence detection not implemented (blocked by FAIL-E1) | E.3 |
| FAIL-E4 | HIGH | E | Chrome Extension DEFERRED but all files still reference it; JS snippet + ChatGPT Actions not documented | ALL E files + CONTEXT.md |

### Warnings (Should Fix)

| ID | Severity | Workflow | Issue | Affected Files |
|----|----------|----------|-------|----------------|
| WARN-D1 | LOW | D | `/sma-notify-telegram` webhook not in CONTEXT.md | CONTEXT.md |
| WARN-D2 | LOW | D | CONTEXT.md doesn't show D.2 using `/sma-update-post` for Publish_Failed | CONTEXT.md |
| WARN-D3 | LOW | D | D.4 Telegram message doesn't include metrics collection reminder | step-D4 |
| WARN-E1 | MEDIUM | E | checklist.md references "Notion KPIs database" — no matching webhook, Notion is view-only | checklist.md |
| WARN-E2 | LOW | E | workflow.yaml description references Chrome Extension | workflow.yaml |

---

## Recommended Fix Priority

1. **FAIL-E4** (Chrome Extension deferral) — Highest priority. All E documentation is based on a deferred approach. Update to reflect JS snippet + ChatGPT Actions before any E implementation begins.
2. **FAIL-E1** (Multi-point collection) — High priority. Architectural gap that affects metric depth. Design the collection schedule and storage schema.
3. **FAIL-E2** (Follower baseline) — Medium priority. Can be added incrementally after E1 fix.
4. **FAIL-E3** (Resurgence detection) — Medium priority. Blocked by FAIL-E1; will become feasible once multi-point data exists.
5. **WARN-D1/D2** — Low priority. CONTEXT.md bookkeeping updates.
6. **WARN-E1** — Medium priority. Checklist accuracy.
7. **WARN-D3** — Low priority. Nice-to-have observability improvement.

---

*Report generated by Sentinel QA Validator | 2026-03-14*
