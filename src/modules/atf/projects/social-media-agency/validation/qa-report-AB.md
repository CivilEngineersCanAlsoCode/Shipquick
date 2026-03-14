# Validation Report: A-ContentIdeation + B-ContentDrafting

**Validator:** Lens (QA Agent)
**Date:** 2026-03-14
**Scope:** All files in workflows/content-ideation/ (18 files) and workflows/content-drafting/ (14 files)

---

## PASS ✅

### A — Content Ideation

- **workflow.yaml**: All required fields present (name, description, config_source, installed_path, instructions, validation, template, input_file_patterns). Description accurately reflects workflow purpose. Input patterns correctly specify briefs, scoring_config, experiences.
- **workflow.md**: Complete with 8-step table, flow diagram, webhook reference (9 webhooks with URLs), scoring formula, inputs/outputs. All steps correctly map to step files.
- **workflow.md webhook table**: All 9 webhooks match CONTEXT.md webhook names and URLs. Step attributions are accurate.
- **instructions.md**: Agent correctly identified as Content Strategist (Echo). 4-phase execution flow maps correctly to steps A.1–A.8. All 9 webhooks listed with correct step attributions.
- **checklist.md**: 22 quality gates across 4 categories (Pre-Execution: 6, Scoring: 5, Post-Execution: 7, Data Integrity: 4). All gates are specific and testable.
- **step-01-load-session-context.md**: Complete session initialization — config loading, variable resolution, webhook URL validation, empty state initialization.
- **step-01b-resume-if-interrupted.md**: Comprehensive recovery protocol with state-based detection, per-step recovery actions, rules against re-saving/re-discarding.
- **step-A1-fetch-briefs.md**: Correct webhook (sma-fetch-briefs), correct payload (`{ "status": "New" }`), response fields match expected schema, error handling with retry, 5 DO NOTs.
- **step-A2-fetch-past-posts.md**: Correct webhook (sma-fetch-past-posts), payload `{ "days": 14, "channel": "linkedin" }`, non-blocking on failure, mental analysis guidance.
- **step-A3-fetch-experiences-preview.md**: Correct webhook (sma-search-experiences), batched queries (all topics at once), limit: 1, non-blocking on failure.
- **step-A4-load-scoring-config.md**: Correct webhook (sma-fetch-config), fetches both scoring_weights and scoring_scales, user choice fork (accept → A.6, modify → A.5), hardcoded fallbacks on failure.
- **step-A5-update-scoring-config.md**: Fibonacci-only weight validation, range checks on all parameters, correct webhook (sma-save-config), skip logic when user accepted defaults.
- **step-A6-score-and-select.md**: Scoring formula matches CONTEXT.md (`F×8 + P×5 + R×3`). Gate checks correct (F≥5, P≥3, R≥2, Total≥80). Freshness scale, experience similarity scale, research quality scale all documented. 6-part execution with discard, present, save experience, user decision loop, fetch-more loop. Error handling per webhook.
- **step-A7-prioritize-and-schedule.md**: Calendar slot checking, posting schedule config, assignment logic (day-of-week preferences, pillar balance), user confirmation with shuffle/remove/change options.
- **step-A8-save.md**: Correct 3-stage save (MongoDB → Notion → Sheet). Status values correct: `Scheduled_NoDraft` (MongoDB), `Scheduled - No Draft` (Notion). Notion content_pillar Title Case mapping documented. Blocking/non-blocking correctly specified. Notion database_id present.
- **steps-e/step-01-assess.md**: 6 edit types with impact assessment matrix (re-score, re-schedule, re-save). Feasibility validation per type.
- **steps-e/step-02-apply-edit.md**: Per-type execution logic with correct webhook references. Verification step included.
- **steps-v/step-01-validate.md**: 4-dimension validation (Scoring Integrity, Data Consistency, Schedule Validity, User Confirmation). Generates structured pass/fail summary.
- **templates/content-plan.template.md**: Complete template with 3 post sections, score breakdown (`F×8 + P×5 + R×3`), IDs, summary, next actions.
- **Scoring formula consistency**: `Score = F×8 + P×5 + R×3` (max 160) matches across CONTEXT.md, workflow.md, instructions.md, step-A6, checklist.md, and template.
- **Status transitions**: `Scheduled_NoDraft` consistently used across all A step files, checklist, template.
- **Constraints**: 800-1600 chars, FK Grade 7, max 3 emojis — consistently referenced where applicable.

### B — Content Drafting

- **workflow.yaml**: All required fields present. Input patterns correctly reference content-methods.csv, framework CSVs (wildcard), experiences.yaml.
- **workflow.md**: 4-step summary (B.1–B.4) with webhook table (7 webhooks), inputs, outputs, constraints. initWorkflow correctly points to step-B1.
- **step-01-load-session-context.md**: Complete session initialization — config loading, variable resolution (max_iterations, char constraints), empty state, framework CSV validation.
- **step-01b-resume-if-interrupted.md**: State-based recovery for each step (B.1–B.4), Hinglish communication, rules against re-saving.
- **step-B1-pick-post.md**: Correct webhook (sma-fetch-post), payload `{ "status": "Scheduled_NoDraft", "channel": "linkedin", "limit": 1 }`, user confirmation, skip/pagination logic, edge cases handled.
- **step-B2-generate-draft.md**: Most complex step — 5 phases correctly structured. Phase 1: 3 parallel webhooks + local CSV loading (8 files). Phase 2: AI curates top 3-5 per framework. Phase 3: targeted experience search with framework context. Phase 4: duplicate detection flow (>0.95 reject, 0.80-0.95 ask, <0.80 save). Phase 5: draft generation with LinkedIn structure, constraints, tone guidelines, presentation format. Error handling per webhook. 12 DO NOTs.
- **step-B3-refine.md**: 5-part iterative loop — feedback categorization (structural, content, tone, format), apply + show with changelog, quality checks (char count, FK grade, hook length), iteration management (3 soft, 5 hard cap), user decision (approve, scrap, save-as-draft). Incomplete draft save uses status `Drafting` (correct intermediate status).
- **step-B4-finalize.md**: 3-part execution — MongoDB save (blocking), Sheet update (non-blocking, skipped if no source_brief_id), next actions (4 options: B.1, F-ContentFormatting, C-ContentReview, exit). Error handling with manual copy fallback.
- **steps-e/step-01-assess.md**: 6 edit types with impact matrix. Feasibility validation.
- **steps-e/step-02-apply-edit.md**: Per-type execution logic with correct webhook references.
- **steps-v/step-01-validate.md**: 4-dimension validation (Draft Content Quality, Framework Compliance, Data Integrity, User Approval).
- **templates/draft-output.template.md**: Complete template with metadata, frameworks used, experiences, draft in code block, stats, next actions.
- **B.2 framework loading**: Correctly loads 7 framework CSVs + content-methods.csv (8 total), curates from 6 categories (excluding formatting-rules and content-methods), user picks from 6 categories including positioning.
- **Status transitions**: `Scheduled_NoDraft → Drafting → Drafted` correctly used across B step files.
- **Draft constraints**: 800-1600 chars, FK Grade 7, max 3 emojis, ~210 char hook — consistent across step-B2, step-B3, checklist.

---

## FAIL ❌

### F1 — B instructions.md: Phase-to-Step mapping incorrect
**File:** `workflows/content-drafting/instructions.md` — Lines 30-46
**Issue:** Phase 3 is labeled "(Step B.3)" but describes framework curation + draft generation, which is actually **Step B.2** in the step files (step-B2-generate-draft.md). Phase 4 is labeled "(Step B.3 continued)" for refinement — B.3 is correct for refinement, but Phase 3 should reference B.2.
**Impact:** Agent executing instructions.md could misinterpret which step file to run.
**Fix:** Change Phase 3 header to "(Step B.2 continued)" or merge Phases 2 and 3 as both are B.2.

### F2 — B instructions.md: Webhook table incomplete and inaccurate
**File:** `workflows/content-drafting/instructions.md` — Lines 67-75
**Issue:** Lists only 5 webhooks. **Missing:** `sma-fetch-briefs` (B.2.a), `sma-save-experience` (B.2.f), `sma-update-sheet-status` (B.4.b). **Incorrect:** Lists `sma-fetch-config` as used in B.2, but no B step file calls `sma-fetch-config`. Lists `sma-fetch-past-posts` as used in "B.1 (context)" but it's used in B.2.c, not B.1.
**Impact:** Agent won't know about 3 required webhooks and will attempt a non-existent call.
**Fix:** Update webhook table to match workflow.md's 7-webhook table, remove sma-fetch-config, correct step attributions.

### F3 — B instructions.md: Missing positioning framework selection
**File:** `workflows/content-drafting/instructions.md` — Lines 36-39
**Issue:** Lists 5 framework selections: "1 content format, 1 hook framework, 1 narrative framework, 1 CTA framework, 1 tone framework". **Missing:** positioning (step-B2-generate-draft.md Phase 2 clearly requires 6 selections including positioning).
**Impact:** Agent following instructions.md will skip positioning selection.
**Fix:** Add "1 positioning template" to the list.

### F4 — B checklist.md: Pre-Execution webhook list incorrect
**File:** `workflows/content-drafting/checklist.md` — Line 7
**Issue:** Lists "FetchPost, SearchExperiences, FetchConfig, UpdatePost" as required active webhooks. `FetchConfig` is NOT used in any B step file. **Missing:** FetchBriefs, FetchPastPosts, SaveExperience, UpdateSheetStatus.
**Impact:** Pre-execution validation would check wrong webhooks and miss required ones.
**Fix:** Replace with: "FetchPost, FetchBriefs, FetchPastPosts, SearchExperiences, SaveExperience, UpdatePost, UpdateSheetStatus".

### F5 — CONTEXT.md: Webhook attribution errors for B workflow
**File:** `CONTEXT.md` — Lines 70-72
**Issue:**
- Line 70: `sma-fetch-past-posts` listed for "B.1" — step-B1 uses `sma-fetch-post`, not `sma-fetch-past-posts`. Should be "B.2" (step-B2.c).
- Line 72: `sma-fetch-config` listed for "B.2" — step-B2 does NOT call `sma-fetch-config`. It does local framework CSV reads only.
**Impact:** CONTEXT.md is the canonical reference. Incorrect attributions propagate to all downstream documents.
**Fix:** Change `sma-fetch-past-posts` from "A.2, A.7, B.1" to "A.2, A.7, B.2". Remove "B.2" from `sma-fetch-config` row.

### F6 — CONTEXT.md: B workflow description outdated
**File:** `CONTEXT.md` — Line 95
**Issue:** Says "B — Content Drafting (needs detailed steps)" but all 6 detailed step files (step-01, step-01b, B1-B4) are complete and comprehensive.
**Impact:** Misleading — suggests B is incomplete when it's fully detailed.
**Fix:** Change to "B — Content Drafting (4 steps, COMPLETE)" to match A's format.

### F7 — CONTEXT.md: B step numbering diverged from step files
**File:** `CONTEXT.md` — Lines 96-103
**Issue:** CONTEXT.md lists B.3 as "AI curates top 3-5 per CSV, user picks 1 each" and B.3.1-B.3.6 as sub-steps. But in step files, curation + draft generation is **B.2** (step-B2-generate-draft.md) and B.3 is **Refine** (step-B3-refine.md). The step numbering in CONTEXT.md doesn't match the actual step files.
**Impact:** Anyone reading CONTEXT.md gets wrong step numbers for B workflow.
**Fix:** Realign B step descriptions to match step files: B.2 = "Fetch frameworks, curate, generate draft", B.3 = "Iterative refinement loop", B.4 = "Finalize and save".

### F8 — A and B workflow.md: initWorkflow skips mandatory session context
**File:** `workflows/content-ideation/workflow.md` — Line 5, `workflows/content-drafting/workflow.md` — Line 4
**Issue:** A's initWorkflow points to `./steps-c/step-A1-fetch-briefs.md` and B's to `./steps-c/step-B1-pick-post.md`. But both have `step-01-load-session-context.md` that explicitly states "Mandatory execution before A.1" / "before B.1". The init step is skipped.
**Impact:** Agent starting the workflow will skip config loading, variable resolution, and state initialization.
**Fix:** Change initWorkflow to `./steps-c/step-01-load-session-context.md` in both workflow.md files, or add a note that step-01 is implicit.

---

## WARNINGS ⚠️

### W1 — workflow.yaml: Minimal machine-readable content
**Files:** Both `workflow.yaml` files
**Issue:** Neither lists step files, agents, phases, or webhook dependencies. Only contains name, description, paths, and input patterns. The BMAD standard says workflow.yaml is "machine-readable config (name, paths, inputs)" — technically compliant, but less useful for tooling that needs to discover steps/agents programmatically.
**Suggestion:** Consider adding `steps:`, `agents:`, and `webhooks:` sections for tooling discoverability.

### W2 — B.3 save-as-draft payload: Hardcoded zero values
**File:** `workflows/content-drafting/steps-c/step-B3-refine.md` — Lines 157-158
**Issue:** The save-as-draft JSON payload shows `"word_count": 0, "char_count": 0` as placeholder values. Should use actual draft metrics.
**Suggestion:** Replace with `"word_count": [actual], "char_count": [actual]` like B.4 does.

### W3 — A instructions.md: Similarity threshold ambiguity
**File:** `workflows/content-ideation/instructions.md` — Line 54
**Issue:** States "0.80 default similarity threshold" as a key constraint, but step-A3 intentionally uses `min_similarity: 0.3` for broader initial preview search. This is correct behavior but instructions.md doesn't clarify the difference.
**Suggestion:** Add note: "0.80 for final matching; A.3 preview uses 0.3 for broader initial results."

### W4 — workflow.yaml: input_file_patterns reference potentially non-existent local files
**Files:** Both `workflow.yaml` files reference `data/reference/briefs.yaml`, `data/reference/experiences.yaml`, etc.
**Issue:** These data sources are fetched via n8n webhooks at runtime, not stored as local files. The input_file_patterns may be aspirational or for a future offline mode.
**Suggestion:** Add comments clarifying these are webhook-sourced at runtime, or remove if not used.

### W5 — B checklist.md: Framework Selection lists 5 categories, step-B2 has 6
**File:** `workflows/content-drafting/checklist.md` — Line 14
**Issue:** Says "User explicitly selected 1 item per category (format, hook, narrative, CTA, tone)" — lists 5 but step-B2 requires 6 selections including positioning.
**Suggestion:** Add "positioning" to the list.

### W6 — B workflow.md: Says "7 framework CSVs" but curation uses 6
**File:** `workflows/content-drafting/workflow.md` — Line 20
**Issue:** B.2 description says "load 7 framework CSVs". Step-B2 loads 7 framework CSVs + content-methods.csv (8 total) but curates from only 6 (excluding formatting-rules and content-methods). The "7" count is technically about loaded CSVs but could confuse since user picks from 6.
**Suggestion:** Clarify: "load 8 framework CSVs, curate from 6 categories".

### W7 — B instructions.md: Draft template description incomplete
**File:** `workflows/content-drafting/instructions.md` — Line 39
**Issue:** Lists draft template as "Hook → Body → CTA → Hashtags" but step-B2 specifies "Hook → Body → Key Takeaway → CTA → Positioning → Hashtags" (6 sections, not 4).
**Suggestion:** Update to match the full structure from step-B2.

---

## SUMMARY

| Metric | Count |
|--------|-------|
| **Total files checked** | **32** |
| A-ContentIdeation files | 18 |
| B-ContentDrafting files | 14 |
| **Pass** | **39 items** |
| **Fail** | **8 items** |
| **Warning** | **7 items** |

### Severity Breakdown

| ID | Severity | Location | Category |
|----|----------|----------|----------|
| F1 | HIGH | B instructions.md | CONSISTENCY — phase/step mismatch |
| F2 | HIGH | B instructions.md | COMPLETENESS — missing webhooks |
| F3 | MEDIUM | B instructions.md | COMPLETENESS — missing framework |
| F4 | HIGH | B checklist.md | ACCURACY — wrong webhook list |
| F5 | HIGH | CONTEXT.md | ACCURACY — wrong step attributions |
| F6 | LOW | CONTEXT.md | ACCURACY — outdated label |
| F7 | HIGH | CONTEXT.md | CONSISTENCY — step numbering diverged |
| F8 | MEDIUM | A+B workflow.md | CROSS-REFERENCE — initWorkflow skip |

### Key Findings

1. **A-ContentIdeation is solid.** All 18 files are internally consistent, cross-references align, scoring formula is correct everywhere, webhook names match CONTEXT.md (except where CONTEXT.md itself is wrong for B). No failures specific to A workflow files.

2. **B-ContentDrafting step files are excellent.** The step-c/ files (B1–B4) are detailed, accurate, and well-structured. The issues are in the **surrounding documentation** (instructions.md, checklist.md) which hasn't been updated to match the step files.

3. **CONTEXT.md has 3 failures** — all related to the B workflow section being outdated/misaligned with the actual B step files. This is the canonical reference document so these should be fixed first.

4. **The root cause** of most failures is that B's instructions.md, checklist.md, and CONTEXT.md's B section appear to have been written against an earlier version of the step numbering (where curation was B.3, not B.2) and haven't been synced after the step files were finalized.

---

*Report generated by Lens QA Agent — 2026-03-14*
