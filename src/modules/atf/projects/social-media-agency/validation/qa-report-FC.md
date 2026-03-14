# QA Validation Report — F (Content Formatting) + C (Content Review)

**Validator:** Grid
**Date:** 2026-03-14
**Status:** ISSUES FOUND

---

## Summary

| Workflow | Files Reviewed | PASS | WARN | FAIL |
|----------|---------------|------|------|------|
| F — Content Formatting | 14 | 22 | 4 | 2 |
| C — Content Review | 14 | 20 | 4 | 1 |
| **Total** | **28** | **42** | **8** | **3** |

**Overall Verdict: CONDITIONAL PASS** — Both workflows are structurally complete and well-documented. 3 failures and 7 warnings require attention before implementation.

---

## F — Content Formatting

### 1. COMPLETENESS: PASS

All required files present per BMAD/LR v6 standard:

| File | Status | Notes |
|------|--------|-------|
| `workflow.yaml` | PASS | name, code (F), config_source, installed_path, instructions, validation, template, input_file_patterns (2) |
| `workflow.md` | PASS | Frontmatter (name, description, code, initWorkflow), steps table, flow diagram, webhook reference, inputs/outputs |
| `instructions.md` | PASS | Overview, agents, prerequisites, 4-phase execution flow, all 12 rules detailed, webhook ref, constraints, error handling, success criteria |
| `checklist.md` | PASS | 28 checks across 4 categories (pre-format 5, format 18, preview 8, post-approval 5, rejection 3) |
| `templates/formatted-post.template.md` | PASS | Template structure, section guide, character count reference, example formatted post |
| `steps-c/step-01-load-session-context.md` | PASS | Config loading, in-progress session check, webhook call, error handling |
| `steps-c/step-01b-resume-if-interrupted.md` | PASS | 3 recovery options (resume/abandon+pick/abandon+exit), revert webhook |
| `steps-c/step-F1-pick-drafted-post.md` | PASS | Agent, trigger, webhook + JSON payload, post selection, status lock (Formatting), validation of raw_content, error handling, "What NOT to Do" |
| `steps-c/step-F2-apply-formatting.md` | PASS | Core step. All formatting rules with examples, phased execution order, iteration tracking, error handling |
| `steps-c/step-F3-generate-preview.md` | PASS | Stats computation, code block preview, 16-metric stats table, auto-fix table, readability summary, decision prompt |
| `steps-c/step-F4-user-approval.md` | PASS | 3 decision paths (approve/changes/reject), webhook payloads, iteration limits, post-approval summary, error handling |
| `steps-v/step-01-validate.md` | PASS | Full validation checklist (16 checks), report template, PASS/FAIL per criterion |
| `steps-e/step-01-assess.md` | PASS | Formatting audit against 12 rules, diagnostic-only, 4 user options |
| `steps-e/step-02-apply-edit.md` | PASS | Apply corrections, regenerate preview, re-validate, save webhook |

### 2. CONSISTENCY: MIXED (1 FAIL, 3 WARN)

#### Status Transitions
- `Drafted` → `Formatting` (F.1 locks post): PASS
- `Formatting` → `Previewed` (F.4 on approval): PASS
- `Formatting` → `Drafted` (F.4 on rejection): PASS
- Transitions match CONTEXT.md status flow (`Drafted → Formatting → Previewed`): PASS

#### Webhook Names vs CONTEXT.md

| Webhook | CONTEXT.md | F Step Files | Match? |
|---------|-----------|-------------|--------|
| `/sma-fetch-post` | B.1, C.1, D.1, E.1 | F.1, step-01 (session check) | **WARN** |
| `/sma-update-post` | B.4, C.2, D.3 | F.1 (status lock), F.4 (save/revert) | **WARN** |

> **WARN-F1:** CONTEXT.md webhook table does not list F workflow's usage of `/sma-fetch-post` or `/sma-update-post`. The table shows these webhooks used by B, C, D, E but omits F entirely. **Fix:** Add F.1 to the `sma-fetch-post` "Used By" column and F.1, F.4 to the `sma-update-post` "Used By" column.

#### Agent Name Inconsistency

> **FAIL-F1: Agent name inconsistency across files.** Three different agent names are used:
>
> | File(s) | Agent Name |
> |---------|-----------|
> | `instructions.md` | "Content Strategist (Echo)" |
> | `step-F1`, `step-F2`, `step-F3`, `step-F4` | "Pixel (flex-crafter)" |
> | `step-01`, `step-01b` | "Content Strategist" (no qualifier) |
> | `steps-v/step-01` | "Content Strategist (Validation Mode)" |
> | `steps-e/step-01`, `step-02` | "Content Strategist (Edit Mode)" |
>
> **Impact:** Agent assignment is ambiguous. Echo is the Content Strategist; Pixel is the Formatter. The F-specific steps (F1-F4) assign Pixel, but instructions.md assigns Echo.
>
> **Recommendation:** Decide which agent owns F-ContentFormatting. If Pixel, update `instructions.md` to say "Pixel (flex-crafter)". If Echo, update all F step files. The common steps (01, 01b, V, E) using "Content Strategist" should also specify which agent.

#### Rule Count Inconsistency

> **FAIL-F2: "12 rules" vs "16 rules" inconsistency.**
>
> | Source | Rule Count |
> |--------|-----------|
> | CONTEXT.md "Formatting Rules (LinkedIn v1)" | 12 rules listed |
> | `instructions.md` "Key Constraints" | "ALL 12 formatting rules must be applied" |
> | `step-F2-apply-formatting.md` | "Apply ALL 16 LinkedIn v1 formatting rules from `formatting-rules.csv`", lists FR01-FR16 |
> | `step-F3-generate-preview.md` stats table | 16 metrics (FR01-FR16) |
> | `checklist.md` "Format Checks" section | 18 line items (covering ~12-16 rules) |
> | `steps-e/step-01-assess.md` | "Check all 12 LinkedIn v1 rules" |
>
> F.2 expanded the original 12 rules to 16 by adding:
> - FR06: Numbered lists `1. ` format (split from bullets)
> - FR07: Flow arrows (split from bullets/flows)
> - FR15: One Idea Per Post (new)
> - FR16: Whitespace Breathing Room (new)
>
> **Impact:** `instructions.md` and `steps-e/step-01-assess.md` reference "12 rules" while the actual implementation (F.2, F.3) applies 16. This creates confusion about what "complete" formatting means.
>
> **Recommendation:** Update CONTEXT.md, `instructions.md`, and `steps-e/step-01-assess.md` to reference 16 rules (FR01-FR16). Or if 12 is the canonical count, consolidate F.2 back to 12.

> **WARN-F2:** `workflow.yaml` lists `input_file_patterns` for `drafted-posts.json` and `formatting-rules.csv` but the step files fetch posts via webhook (not from a JSON file). The `drafted-posts.json` pattern appears unused — steps use `sma-fetch-post` webhook exclusively.

> **WARN-F3:** `step-F1` uses `"post_id"` as the field name in the response example, while `step-F4` uses `"_id"` in the update payload. MongoDB uses `_id` natively. Standardize to one field name to avoid confusion.

### 3. ACCURACY: PASS (All 12 CONTEXT.md Rules Present)

Checking all 12 formatting rules from CONTEXT.md against the F workflow files:

| # | Rule (from CONTEXT.md) | Found In | Status |
|---|----------------------|----------|--------|
| 1 | Staircase formatting | F.2 (FR01), instructions.md Rule 1, checklist "Staircase Layout", template "staircase layout" | PASS |
| 2 | 3-line blocks | F.2 (FR02), instructions.md Rule 2, checklist "3-Line Block Rule" | PASS |
| 3 | UPPERCASE headers sparingly | F.2 (FR03), instructions.md Rule 3, checklist "UPPERCASE Headers" | PASS |
| 4 | Replace dashes with punctuation | F.2 (FR04), instructions.md Rule 5, checklist "No Dashes" | PASS |
| 5 | Bullets ` - `, Flows `A —> B —> C` | F.2 (FR05, FR07), instructions.md Rules 6-7, checklist "Bullet Format", "Flow Arrow Format" | PASS |
| 6 | Max 3 emojis at tension points | F.2 (FR08), instructions.md Rule 4, checklist "Emoji Count" + "Emoji Placement" | PASS |
| 7 | Max 3 Hindi sentences at emotional peaks | F.2 (FR09), instructions.md Rule 8, checklist "Hindi Sentences" + "Hindi Placement" | PASS |
| 8 | FK Grade 7 readability | F.2 (FR10), instructions.md Rule 10, checklist "FK Readability", F.3 readability summary | PASS |
| 9 | Positioning + follow after CTA | F.2 (FR12, FR13), instructions.md Rule 11, checklist "CTA Has Positioning" + "CTA Has Follow Prompt" | PASS |
| 10 | 3-6 hashtags at end | F.2 (FR14), instructions.md Rule 12, checklist "Hashtags Count" + "Hashtags Placement" | PASS |
| 11 | 800-1600 ASCII characters | F.2 (FR11), instructions.md Rule 9, checklist "Character Count" | PASS |
| 12 | Code block preview | F.3 (entire step), instructions.md Phase 3, checklist "Code-block preview generated" | PASS |

All 12 CONTEXT.md formatting rules are fully present with detailed implementation guidance, examples, and validation checks.

### 4. CROSS-REFERENCES: PASS

| Check | Status | Notes |
|-------|--------|-------|
| F output feeds C | PASS | F.4 sets status to `Previewed`, explicitly suggests "C-Review workflow" as next step. C.1 fetches `Previewed` posts. |
| F can receive from B | PASS | F.1 fetches `Drafted` posts (output of B-Drafting). workflow.md: "Pipeline predecessor: B (Content Drafting) must have finalized the draft" |
| F rejection returns to drafting pool | PASS | F.4 reject path reverts to `Drafted`, available for re-formatting or B rework |
| Change loop (F.4 → F.2 → F.3 → F.4) | PASS | Documented with iteration tracking and limits (warn at 4, strongly recommend B-Drafting rework at 5) |

### 5. workflow.yaml Correctness: PASS (with warning)

| Field | Value | Status |
|-------|-------|--------|
| `name` | content-formatting | PASS |
| `description` | Present, accurate | PASS |
| `code` | F | PASS |
| `config_source` | `{project-root}/_lr/_config/manifest.yaml` | PASS |
| `installed_path` | `{project-root}/_lr/flex/workflows/content-formatting` | PASS |
| `instructions` | `{installed_path}/instructions.md` | PASS |
| `validation` | `{installed_path}/checklist.md` | PASS |
| `template` | `{installed_path}/templates/formatted-post.template.md` | PASS |
| `input_file_patterns` | 2 patterns | WARN (see WARN-F2 — `drafted-posts.json` appears unused) |

### 6. checklist.md Specificity: PASS

28 checks across 4 categories. Each check is specific and actionable:
- Pre-Format (5): Post existence, raw content, title/topic, baseline char count, status lock
- Format (18): One check per formatting rule plus sub-checks for emoji placement, Hindi placement, CTA components, hashtag placement
- Preview (8): Code block generation, all metric displays, user review, explicit approval
- Post-Approval (5): Status update, content save, webhook confirmation, user notification, next step suggestion
- Rejection (3): Status revert, change loop, iteration tracking

### 7. Template Match: PASS

`formatted-post.template.md` matches the actual formatting output described in F.2 and F.3:
- Hook line → Body blocks (max 3 lines each) → UPPERCASE headers → CTA positioning + follow → Hashtags
- Character count reference (800-1600) matches F.2 and F.3
- Example post demonstrates all formatting rules correctly
- Template includes ` - ` bullet format and `A —> B —> C` flow format

---

## C — Content Review

### 1. COMPLETENESS: PASS

All required files present per BMAD/LR v6 standard:

| File | Status | Notes |
|------|--------|-------|
| `workflow.yaml` | PASS | name, config_source, installed_path, instructions, validation, template, input_file_patterns (2) |
| `workflow.md` | PASS | Frontmatter (name, description, initWorkflow), 4 steps, webhook table, inputs/outputs |
| `instructions.md` | PASS | Overview, agents, 3-phase execution, 5 decision types, webhook reference, constraints, success criteria |
| `checklist.md` | PASS | 22 checks across 5 categories (pre-exec 4, review process 5, decision validation 6, post-exec 4, safety 3) |
| `templates/review-summary.template.md` | PASS | 4 decision tables (approved/edited/rescheduled/dropped), status section, next actions |
| `steps-c/step-01-load-session-context.md` | PASS | Session variables, state initialization, counters |
| `steps-c/step-01b-resume-if-interrupted.md` | PASS | Resume from partial review, re-fetch idempotent, state recovery |
| `steps-c/step-C1-fetch-scheduled.md` | PASS | Agent: Echo, webhook + JSON payload, sort by date, response handling, error handling, "What NOT to Do" |
| `steps-c/step-C2-preview-and-decide.md` | PASS | 5 decision types, webhook payloads for each, conflict checking, double-confirmation for drop, error handling |
| `steps-c/step-C3-apply-minor-edits.md` | PASS | Edit parsing, formatting rule re-validation, preview loop, save webhook, revert option |
| `steps-c/step-C4-finalize-review.md` | PASS | Skipped post retry, summary display, publication schedule, quality gate, next workflow offers, undo support |
| `steps-v/step-01-validate.md` | PASS | 4 validation categories, report template with PASS/FAIL |
| `steps-e/step-01-assess.md` | PASS | 6 edit types with routing (inline vs send-back), feasibility checks |
| `steps-e/step-02-apply-edit.md` | PASS | 6 edit execution paths, webhook calls, verification |

### 2. CONSISTENCY: PASS (with warnings)

#### Status Transitions
- `Previewed` → `Ready_ToPublish` (approve): PASS — matches CONTEXT.md
- `Previewed` → `Cancelled` (drop): PASS
- `Previewed` → `Scheduled_NoDraft` (send back to B): PASS
- `Previewed` → `Drafted` (send back to F, via edit assessment): PASS

#### Webhook Names vs CONTEXT.md

| Webhook | CONTEXT.md | C Step Files | Match? |
|---------|-----------|-------------|--------|
| `/sma-fetch-post` | C.1 | C.1, C.2 (conflict check for reschedule) | PASS |
| `/sma-update-post` | C.2 | C.2, C.3, C.4 | PASS |

All webhook usage matches CONTEXT.md.

#### Agent Consistency

> **Note (linked to FAIL-F1):** All C files consistently say "Echo", but this is **incorrect** per the agent definition. `flex-crafter.md` states "Steps F and C are my domain" — **Pixel** should own C-ContentReview, not Echo. The C files are internally consistent but externally wrong.
- All C-specific steps: "Content Strategist (Echo)" — INTERNALLY CONSISTENT, EXTERNALLY INCORRECT
- Common steps (01, 01b): Generic "Content Strategist" — ambiguous, should specify Pixel

> **WARN-C1:** `workflow.yaml` is missing the `code` field. F's workflow.yaml has `code: F`, but C's does not include a code field. Per CONTEXT.md, this workflow is code "C".
>
> **Recommendation:** Add `code: C` to C's `workflow.yaml`.

> **WARN-C2:** `workflow.md` frontmatter is missing the `code` field. F's workflow.md has `code: F` in frontmatter, but C's does not.
>
> **Recommendation:** Add `code: C` to C's `workflow.md` frontmatter.

### 3. ACCURACY: PASS (with 1 FAIL)

#### Decision Types vs CONTEXT.md

| CONTEXT.md Says | C Step Files Implement | Match? |
|-----------------|----------------------|--------|
| "user approves/rejects/edits" | 5 decisions: Approve, Edit, Reschedule, Drop, Send Back | PASS (expanded beyond CONTEXT.md — richer than required) |
| "status Ready_ToPublish" | Approve → Ready_ToPublish | PASS |
| "or back to F" | Send Back → Scheduled_NoDraft (B, not F) + Edit Assessment → Drafted (F) | PASS (both paths exist) |

#### Send-Back Counter Bug

> **FAIL-C1: "Send Back" decision increments `dropped_count` instead of a dedicated counter.** In `step-C2-preview-and-decide.md`, Decision 5 (Send Back) ends with "Increment `dropped_count`." This conflates two fundamentally different actions:
> - **Dropped** posts are cancelled and will never be published
> - **Sent-back** posts are returning to the drafting pipeline for rework
>
> The summary in C.4 displays "Dropped / Sent Back" as one category, making it impossible to distinguish cancelled posts from rework-in-progress posts.
>
> **Recommendation:** Add a `sent_back_count` counter. Update C.4 summary to show Dropped and Sent Back separately. Update `review-summary.template.md` to add a "Sent Back" section.

### 4. CROSS-REFERENCES: PASS

| Check | Status | Notes |
|-------|--------|-------|
| C receives from F | PASS | C.1 fetches `Previewed` posts (F.4 output). workflow.md: "quality gate between formatting and publishing" |
| C feeds D | PASS | Approved posts → `Ready_ToPublish` (D.1 input). C.4 mentions "n8n auto-publishes via D-ContentPublishing" |
| C can send back to F | PASS | Edit assessment `step-01-assess.md` routes formatting fixes back to F (status → `Drafted`) |
| C can send back to B | PASS | C.2 Decision 5 "Send Back" sets status to `Scheduled_NoDraft` (B.1 input) |
| C.4 offers next workflow routing | PASS | Offers B-ContentDrafting, A-ContentIdeation, F-ContentFormatting, E-AnalyticsReview, Exit |
| C empty state suggests F | PASS | C.1 empty response: "Pehle F-ContentFormatting run karo" |

### 5. workflow.yaml Correctness: PASS (with warnings)

| Field | Value | Status |
|-------|-------|--------|
| `name` | content-review | PASS |
| `description` | Present, accurate | PASS |
| `code` | MISSING | **WARN** (see WARN-C1) |
| `config_source` | `{project-root}/_lr/_config/manifest.yaml` | PASS |
| `installed_path` | `{project-root}/_lr/flex/workflows/content-review` | PASS |
| `instructions` | `{installed_path}/instructions.md` | PASS |
| `validation` | `{installed_path}/checklist.md` | PASS |
| `template` | `{installed_path}/templates/review-summary.template.md` | PASS |
| `input_file_patterns` | 2 patterns (scheduled-posts.yaml, review-config.yaml) | PASS |

### 6. checklist.md Specificity: PASS

22 checks across 5 categories. Each check is specific and actionable:
- Pre-Execution (4): Post existence, webhook activity, user availability, no past-dated posts
- Review Process (5): Chronological order, code block preview, metadata display, explicit decision, no skipping
- Decision Validation (6): One check per decision type + webhook success verification
- Post-Execution (4): All posts reviewed, summary shown, next actions offered, no ambiguous state
- Safety (3): No approval without preview, user understands auto-publish, date conflict check

### 7. Template Match: PASS

`review-summary.template.md` matches the outputs described in C.4:
- 4 decision tables (Approved, Edited, Rescheduled, Dropped) with appropriate columns
- Status section explaining auto-publish behavior
- Next actions checklist (B-Drafting, A-Ideation, E-Analytics)
- Session date placeholder

---

## Issue Registry

### Failures (Must Fix)

| ID | Severity | Workflow | Issue | Affected Files |
|----|----------|----------|-------|----------------|
| FAIL-F1 | HIGH | F+C | Agent name inconsistency: `flex-crafter.md` explicitly states "Steps F and C are my domain" — **Pixel owns both F and C**. Yet F's `instructions.md` says "Echo", C's `instructions.md` and ALL C step files say "Echo", and common steps say "Content Strategist". Only F's step files (F1-F4) correctly say "Pixel". | F: instructions.md, step-01, step-01b, steps-v, steps-e. C: instructions.md, step-C1 through C4, step-01, step-01b, steps-v, steps-e |
| FAIL-F2 | MEDIUM | F | Rule count mismatch: "12 rules" in instructions.md/CONTEXT.md vs "16 rules" (FR01-FR16) in F.2 and F.3 | CONTEXT.md, instructions.md, step-F2, step-F3, steps-e/step-01-assess.md |
| FAIL-C1 | MEDIUM | C | "Send Back" decision increments `dropped_count` instead of a dedicated `sent_back_count`, conflating cancelled and rework-in-progress posts | step-C2, step-C4, review-summary.template.md |

### Warnings (Should Fix)

| ID | Severity | Workflow | Issue | Affected Files |
|----|----------|----------|-------|----------------|
| WARN-F1 | MEDIUM | F | CONTEXT.md webhook table omits F workflow usage of `sma-fetch-post` and `sma-update-post` | CONTEXT.md |
| WARN-F2 | LOW | F | `workflow.yaml` input_file_patterns lists `drafted-posts.json` but steps use webhook fetch exclusively | workflow.yaml |
| WARN-F3 | LOW | F | Field name inconsistency: `post_id` in F.1 response vs `_id` in F.4 payload | step-F1, step-F4 |
| WARN-C1 | MEDIUM | C | `workflow.yaml` missing `code: C` field (F has `code: F`) | workflow.yaml |
| WARN-C2 | MEDIUM | C | `workflow.md` frontmatter missing `code: C` field | workflow.md |
| WARN-C3 | LOW | C | C.2 reschedule conflict check queries `Ready_ToPublish` posts but should also check `Previewed` and `Published` posts for date conflicts | step-C2 |
| WARN-C4 | MEDIUM | C | C.2 reschedule webhook payload does NOT include a status update — rescheduled posts remain `Previewed` and will reappear in the next review session. C.4's "Upcoming Publication Schedule" lists them as `Ready_ToPublish`, contradicting the actual state. Either reschedule should set `Ready_ToPublish` (implicit approval) or C.4 should show rescheduled posts as still `Previewed` | step-C2, step-C4 |
| WARN-F4 | LOW | F | `step-F1` uses `raw_content` field name while `step-C1` response has `draft_content` and `formatted_content` — field naming not standardized across workflows | step-F1, step-C1 |

---

## Recommended Fix Priority

1. **FAIL-F1** (Agent name inconsistency) — Highest priority. Resolution is clear: `flex-crafter.md` says "Steps F and C are my domain" — **Pixel owns both**. Update F's `instructions.md` + common steps, and ALL C files to say "Pixel (flex-crafter)" instead of "Echo".
2. **FAIL-F2** (12 vs 16 rules) — High priority. The step files implement 16 rules but multiple documents reference 12. Standardize the canonical count and update all references.
3. **FAIL-C1** (Send Back counter) — Medium priority. Functional bug in review tracking. Add `sent_back_count` and update summary/template.
4. **WARN-C4** (Reschedule status gap) — Medium priority. Rescheduled posts stay `Previewed` but C.4 displays them as `Ready_ToPublish`. Decide semantics and fix.
5. **WARN-F1** (CONTEXT.md webhook table) — Medium priority. CONTEXT.md is the authoritative reference — must be complete.
6. **WARN-C1/C2** (Missing code field) — Medium priority. Structural consistency across workflow configs.
7. **WARN-F2/F3/F4, WARN-C3** — Low priority. Field naming and minor logic issues.

---

## Strengths

Both workflows demonstrate high quality:

- **F-ContentFormatting** has exceptionally detailed step files, especially F.2 with per-rule examples (correct/wrong), a clear 4-phase execution order, and F.3 with a comprehensive 16-metric stats table and auto-fix matrix.
- **C-ContentReview** covers 5 decision types (exceeding CONTEXT.md's 3), includes double-confirmation for destructive actions, idempotent resume logic, and undo support in C.4.
- **Error handling** is thorough in both workflows: retry-once patterns, fallback to manual with n8n workflow names, content preservation on webhook failure.
- **Cross-references** are solid: F→C handoff is explicit, C→B/F send-back paths are well-defined, C.4 offers routing to all adjacent workflows.
- **User interaction** is well-designed: Hinglish communication, no auto-approval anywhere, explicit confirmation required at every decision point.

---

*Report generated by Grid QA Validator | 2026-03-14 | Updated 2026-03-14 (added WARN-C4 reschedule status gap, clarified FAIL-F1 scope to include C workflow)*
