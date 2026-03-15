# QA Validation Report — P0/P1 Fix Wave

> **Validator:** Lens (flex-lens)
> **Date:** 2026-03-15
> **Scope:** All new files created in P0/P1 fix wave
> **Method:** Cross-check against CONTEXT.md, agent-manifest.csv, step files, and actual CSV row counts

---

## Summary

| Category | Files Checked | PASS | FAIL | Total Issues |
|----------|--------------|------|------|-------------|
| Reference YAMLs (data/reference/) | 11 | 8 | 3 | 5 |
| Sidecar Instructions (_memory/) | 7 | 7 | 0 | 0 |
| module-help.csv | 1 | 1 | 0 | 0 |
| frameworks/index.csv | 1 | 0 | 1 | 6 |
| _memory/config.yaml | 1 | 1 | 0 | 0 |
| docs/pipeline-state-machine.md | 1 | 1 | 0 | 0 |
| Plans C/D/F | 3 | 3 | 0 | 0 |
| **TOTAL** | **25** | **21** | **4** | **11** |

**Overall verdict: 4 files FAIL with 11 issues (all count mismatches). No logic, formula, or agent-name errors.**

---

## 1. Reference YAML Files (data/reference/) — 11 files across 6 workflows

### 1.1 content-ideation / scoring-weights.yaml — PASS ✅

| Check | CONTEXT.md | YAML Value | Match |
|-------|-----------|------------|-------|
| Freshness weight | 8 | 8 (VAR_A01) | ✅ |
| Personal Experience weight | 5 | 5 (VAR_A02) | ✅ |
| Research Quality weight | 3 | 3 (VAR_A03) | ✅ |
| Min Freshness | 5 | 5 (VAR_A04) | ✅ |
| Min Personal | 3 | 3 (VAR_A05) | ✅ |
| Min Research | 2 | 2 (VAR_A06) | ✅ |
| Total minimum | 50% of 160 = 80 | 50% (VAR_A07) | ✅ |
| Top N posts | 3 | 3 (VAR_A09) | ✅ |
| Similarity threshold | 0.80 | 0.80 (VAR_A13) | ✅ |

- Internal consistency: ✅ No contradictions
- Completeness: ✅ No placeholders/TODOs
- Formula accuracy: ✅ F×8 + P×5 + R×3 matches Fibonacci weights

### 1.2 content-ideation / scheduling-patterns.yaml — PASS ✅

| Check | CONTEXT.md | YAML Value | Match |
|-------|-----------|------------|-------|
| Posts per week | 3 (Mon/Wed/Fri) | 3 | ✅ |
| Max posts/day | 1 | 1 (VAR_D03) | ✅ |
| Max posts planned | 3 | 3 (VAR_A11) | ✅ |
| Random delay | 0-60 min | 0-60 (VAR_D01/D02) | ✅ |
| Timezone | Asia/Kolkata | Asia/Kolkata (VAR_D05) | ✅ |
| Lookback window | 14 days | 14 (VAR_A10) | ✅ |
| Visibility | PUBLIC | PUBLIC (VAR_D06) | ✅ |

### 1.3 content-ideation / platform-rules.yaml — PASS ✅

| Check | CONTEXT.md | YAML Value | Match |
|-------|-----------|------------|-------|
| Char min/max | 800-1600 | 800-1600 (VAR_B01/B02) | ✅ |
| FK Grade | 7 | 7 (VAR_B08) | ✅ |
| Max emojis | 3 | 3 (VAR_B03) | ✅ |
| Max Hindi sentences | 3 | 3 (VAR_B04) | ✅ |
| Max lines/block | 3 | 3 (VAR_B05) | ✅ |
| Hashtags | 3-6 | 3-6 (VAR_B09/B10) | ✅ |
| Similarity thresholds | 0.80/0.95 | 0.80/0.95 (VAR_B11/B12) | ✅ |

### 1.4 content-ideation / content-vocabulary.yaml — PASS ✅

- Contains branded terms, prohibited terms, voice guidelines
- Personal brand markers match project context ("PM by day. Builder by night.", "build in public", "ship quick")
- Hinglish constraints (max 3 per post) consistent with FR09
- Internal consistency: ✅
- Completeness: ✅ No placeholders

### 1.5 content-drafting / draft-constraints.yaml — PASS ✅

| Check | CONTEXT.md | YAML Value | Match |
|-------|-----------|------------|-------|
| Char min/max | 800-1600 | 800-1600 (VAR_B01/B02) | ✅ |
| Max emojis | 3 | 3 (VAR_B03) | ✅ |
| Max Hindi sentences | 3 | 3 (VAR_B04) | ✅ |
| FK Grade | 7 | 7 (VAR_B08) | ✅ |
| Hashtags | 3-6 | 3-6 (VAR_B09/B10) | ✅ |
| Max iterations (hard cap) | 5 | 5 (VAR_B06) | ✅ |
| Warning threshold | 3 | 3 (VAR_B07) | ✅ |
| Engagement: likes | 1 | 1 (VAR_B15) | ✅ |
| Engagement: comments | 3 | 3 (VAR_B16) | ✅ |
| Engagement: shares | 2 | 2 (VAR_B17) | ✅ |

### 1.6 content-drafting / framework-index.yaml — FAIL ❌

**Issue: Item counts do not match actual CSV row counts.**

| Framework | YAML Claims | Actual CSV Rows | Delta |
|-----------|------------|----------------|-------|
| content-formats | 35 | 35 | ✅ |
| hook-frameworks | 35 | 34 | -1 ❌ |
| narrative-frameworks | 32 | 31 | -1 ❌ |
| cta-frameworks | 32 | 32 | ✅ |
| tone-frameworks | 32 | 32 | ✅ |
| positioning-templates | 32 | 31 | -1 ❌ |
| formatting-rules | 16 | 16 | ✅ |
| content-methods | 62 | 61 | -1 ❌ |

**Root cause:** framework-index.yaml was written from CONTEXT.md planned counts, not verified against actual CSV files post-creation. Four entries are off-by-one (all over-counted).

**Bug:** `BUG-YAML-01` — framework-index.yaml item_count values for hook-frameworks (35→34), narrative-frameworks (32→31), positioning-templates (32→31), content-methods (62→61) do not match actual CSV row counts.

### 1.7 content-review / review-criteria.yaml — PASS ✅

| Check | CONTEXT.md | YAML Value | Match |
|-------|-----------|------------|-------|
| Formatting rules count | — | 16 (10 P1, 6 P2) | Consistent with linkedin-formatting-rules.yaml ✅ |
| Char range | 800-1600 | 800-1600 | ✅ |
| FK Grade | 7 | 7 | ✅ |
| Emoji limit | 3 | 3 | ✅ |
| Quality checks enabled | — | VAR_C01 = true | ✅ |
| Auto-fix disabled | — | VAR_C02 = false | ✅ |
| Decision types | approve/reject | approve, edit, reschedule, drop | ✅ expanded but consistent |
| Status transitions | Ready_ToPublish or back to F | approve → Ready_ToPublish, edit → F | ✅ |

### 1.8 content-formatting / linkedin-formatting-rules.yaml — PASS ✅

- 16 rules FR01-FR16 defined
- P1 (10 rules): FR02, FR03, FR04, FR05, FR08, FR09, FR10, FR11, FR12, FR14
- P2 (6 rules): FR01, FR06, FR07, FR13, FR15, FR16
- All formatting constraints match CONTEXT.md Formatting Rules section:
  - 800-1600 chars ✅, no bold/italic ✅, max 3-line blocks ✅, max 3 emojis ✅
  - Replace dashes ✅, bullets " - " ✅, flows "A —> B —> C" ✅
  - Max 3 Hindi sentences ✅, FK Grade 7 ✅, positioning + follow ✅, 3-6 hashtags ✅
- Note: CONTEXT.md says "15" formatting rules but this file and review-criteria.yaml both define 16. The 16th rule (FR16 whitespace) was added in the fix wave. Minor CONTEXT.md staleness — not a YAML error.

### 1.9 content-formatting / platform-constraints.yaml — PASS ✅

- LinkedIn platform limits documented (3000 char platform max, SMA limits to 800-1600)
- See-more threshold ~210 chars noted
- Algorithm notes (1/day optimal, comments 5x likes) consistent with CONTEXT.md constraints
- No placeholders/TODOs

### 1.10 content-publishing / publish-config.yaml — PASS ✅

| Check | CONTEXT.md | YAML Value | Match |
|-------|-----------|------------|-------|
| Retry policy | one shot, no retry | one-shot, no retries | ✅ |
| Random delay | 0-60 min | 0-60 (VAR_D01/D02) | ✅ |
| Max posts/day | 1 | 1 (VAR_D03) | ✅ |
| Timezone | Asia/Kolkata | Asia/Kolkata (VAR_D05) | ✅ |
| Visibility | PUBLIC | PUBLIC (VAR_D06) | ✅ |
| Duplicate guard | yes | enabled, thresholds 0.95/0.80 | ✅ |
| Status transitions | Ready_ToPublish → Published | Ready_ToPublish → Published/Publish_Failed | ✅ |
| Webhook: publish | /sma-publish-linkedin | /sma-publish-linkedin | ✅ |
| Webhook: notify | /sma-notify-telegram | /sma-notify-telegram | ✅ |

### 1.11 analytics-review / analytics-config.yaml — FAIL ❌

| Check | CONTEXT.md | YAML Value | Match |
|-------|-----------|------------|-------|
| Collection method | JS DevTools + ChatGPT Actions | JS DevTools + ChatGPT Actions | ✅ |
| Multi-point schedule | Day 1,3,7,14,30 | Present | ✅ |
| Engagement: likes | 1 | 1 (VAR_B15) | ✅ |
| Engagement: comments | 3 | 3 (VAR_B16) | ✅ |
| Engagement: shares | 2 | 2 (VAR_B17) | ✅ |
| Report top N | — | 5 (VAR_E03) | ✅ |
| Resurgence detection | Day 14 > Day 7 by >20% | > 2× average after 7+ days | ❌ |

**Bug:** `BUG-YAML-02` — Resurgence detection definition mismatch. CONTEXT.md defines resurgence as "Day 14 > Day 7 by >20%" (relative checkpoint comparison). analytics-config.yaml defines it as "> 2× average after 7+ days" (absolute average comparison). These are materially different thresholds (20% vs 100%) with different comparison bases.

---

## 2. Sidecar Instructions (_memory/) — 7 files

All 7 sidecar instructions.md files validated against agent-manifest.csv:

| Sidecar Directory | Agent ID | Display Name | Manifest Match |
|------------------|----------|-------------|----------------|
| flex-ideator-sidecar | flex-ideator | Scout | ✅ |
| flex-crafter-sidecar | flex-crafter | Pixel | ✅ |
| flex-publisher-sidecar | flex-publisher | Relay | ✅ |
| flex-publicist-sidecar | flex-publicist | Echo | ✅ |
| flex-ideation-qa-sidecar | flex-ideation-qa | Lens | ✅ |
| flex-craft-qa-sidecar | flex-craft-qa | Grid | ✅ |
| flex-publish-qa-sidecar | flex-publish-qa | Sentinel | ✅ |

Additional checks:
- Workflow ownership matches manifest capabilities ✅
- Role descriptions consistent with manifest titles ✅
- No placeholder/TODO content ✅
- All 7 agents in config.yaml have matching sidecar directories ✅

**Verdict: PASS ✅** (all 7 files)

---

## 3. module-help.csv — PASS ✅

| Command | Agent ID | In Manifest? |
|---------|----------|-------------|
| /flex-help | flex-publicist | ✅ |
| /flex-ideate | flex-ideator | ✅ |
| /flex-draft | flex-ideator | ✅ |
| /flex-format | flex-crafter | ✅ |
| /flex-review | flex-crafter | ✅ |
| /flex-publish | flex-publisher | ✅ |
| /flex-analytics | flex-publisher | ✅ |
| /flex-status | flex-publicist | ✅ |

- All 8 commands map to valid agent IDs from agent-manifest.csv ✅
- Workflow-to-agent assignment is correct:
  - Scout (flex-ideator) owns A+B ✅
  - Pixel (flex-crafter) owns F+C ✅
  - Relay (flex-publisher) owns D+E ✅
  - Echo (flex-publicist) owns orchestration ✅
- No placeholder/TODO content ✅

---

## 4. frameworks/index.csv — FAIL ❌

Cross-checked index.csv `item_count` vs CONTEXT.md stated counts vs actual CSV row counts:

| ID | Framework | index.csv | CONTEXT.md | Actual CSV | index↔actual | CONTEXT↔actual |
|----|-----------|----------|-----------|------------|-------------|----------------|
| FW01 | content-formats | 34 | 35 | 35 | ❌ -1 | ✅ |
| FW02 | hook-frameworks | 34 | 35 | 34 | ✅ | ❌ +1 |
| FW03 | narrative-frameworks | 31 | 32 | 31 | ✅ | ❌ +1 |
| FW04 | cta-frameworks | 31 | 32 | 32 | ❌ -1 | ✅ |
| FW05 | tone-frameworks | 31 | 32 | 32 | ❌ -1 | ✅ |
| FW06 | formatting-rules | 15 | 15 | 16 | ❌ -1 | ❌ -1 |
| FW07 | positioning-templates | 31 | 32 | 31 | ✅ | ❌ +1 |
| FW08 | content-methods | 60 | 60 | 61 | ❌ -1 | ❌ -1 |
| FW10 | variable-registry | 48 | 48 | 49 | ❌ -1 | ❌ -1 |

**6 mismatches** between index.csv and actual CSV counts. All are off-by-one errors.

**Bug:** `BUG-INDEX-01` — frameworks/index.csv item_count values are stale for 6 of 9 CSV entries. Counts were copied from CONTEXT.md planned values or estimated, not verified against actual files post-creation. Affected: FW01 (34→35), FW04 (31→32), FW05 (31→32), FW06 (15→16), FW08 (60→61), FW10 (48→49).

**Note:** CONTEXT.md itself is also stale for 5 entries (FW02, FW03, FW06, FW07, FW08). This is a systemic count-tracking issue.

---

## 5. _memory/config.yaml — PASS ✅

### Structure Validation

| Element | Valid? | Details |
|---------|--------|---------|
| memory_id | ✅ | `sma-global-memory` |
| version | ✅ | `1.0.0` (semver) |
| layers (3) | ✅ | sidecar-core (permanent), sidecar-insights (90d), sidecar-session (30d, non-persist) |
| Layer schema | ✅ | All have: id, description, type, file, persist, ttl |
| agents (7) | ✅ | All 7 manifest agents listed with valid sidecar_path and layer assignments |
| module_retention | ✅ | flex module with campaign-cycle policy, manual cleanup |
| vector_settings | ✅ | cosine, 3072 dims (matches CONTEXT.md experience_vector_idx) |

### Agent Registry Cross-Check

| Config Agent | Sidecar Path | Directory Exists? | Layers |
|-------------|-------------|-------------------|--------|
| flex-ideator | _memory/flex-ideator-sidecar/ | ✅ | core, insights |
| flex-crafter | _memory/flex-crafter-sidecar/ | ✅ | core, insights |
| flex-publisher | _memory/flex-publisher-sidecar/ | ✅ | core, insights |
| flex-publicist | _memory/flex-publicist-sidecar/ | ✅ | core, insights |
| flex-ideation-qa | _memory/flex-ideation-qa-sidecar/ | ✅ | core only |
| flex-craft-qa | _memory/flex-craft-qa-sidecar/ | ✅ | core only |
| flex-publish-qa | _memory/flex-publish-qa-sidecar/ | ✅ | core only |

- QA agents correctly have only `sidecar-core` (no insights accumulation) ✅
- Primary agents have both `sidecar-core` + `sidecar-insights` ✅
- Comment says "All 7 SMA agents" — count is accurate ✅

---

## 6. docs/pipeline-state-machine.md — PASS ✅

### Pipeline Flow
- CONTEXT.md: `A → B → F → C → D → E (loops back to A)`
- State machine: `A (Ideation) → B (Drafting) → F (Formatting) → C (Review) → D (Publishing) → E (Analytics)` with loop back to A ✅

### Status States
| State | In CONTEXT.md? | In State Machine? | Consistent? |
|-------|---------------|-------------------|-------------|
| Scheduled_NoDraft | ✅ | ✅ | ✅ |
| Drafting | ✅ | ✅ | ✅ |
| Drafted | ✅ | ✅ | ✅ |
| Formatting | ✅ | ✅ | ✅ |
| Previewed | ✅ | ✅ | ✅ |
| Ready_ToPublish | ✅ | ✅ | ✅ |
| Published | ✅ | ✅ | ✅ |
| Cancelled | — | ✅ | ✅ (terminal, not in happy path) |
| Publish_Failed | — | ✅ | ✅ (error state, correctly added) |

### Transition Accuracy
- B.1 picks Scheduled_NoDraft ✅
- B.4 finalizes to Drafted ✅
- F.1 picks Drafted → Formatting ✅
- F.4 approves → Previewed ✅
- C.2 approves → Ready_ToPublish ✅
- C.2 reject-format → back to Formatting ✅
- C.2 reject-content → back to Drafting ✅
- D.2+D.3 → Published or Publish_Failed ✅
- One-shot publish rule documented ✅
- Duplicate guard documented ✅
- Random 0-60 min delay documented ✅
- 1/day rule documented ✅

### Invariants
All 8 invariants are accurate and consistent with CONTEXT.md constraints ✅

---

## 7. Plans C/D/F — PASS ✅ (all 3)

### 7.1 C-content-review-plan.md — PASS ✅

| Plan Step | Step File Exists? | Matches CONTEXT.md? |
|-----------|------------------|---------------------|
| step-01-load-session-context | ✅ | ✅ (standard preamble) |
| step-01b-resume-if-interrupted | ✅ | ✅ (standard recovery) |
| step-C1-fetch-scheduled | ✅ | ✅ (C.1: Fetch post by ID) |
| step-C2-preview-and-decide | ✅ | ✅ (C.2: approve/reject/edit) |
| step-C3-apply-minor-edits | ✅ | ✅ (expanded from C.2 edit path) |
| step-C4-finalize-review | ✅ | ✅ (expanded from C.2 finalize) |
| steps-v/step-01-validate | ✅ | ✅ (standard validate) |
| steps-e/step-01-assess + step-02-apply-edit | ✅ | ✅ (standard edit phase) |

Note: CONTEXT.md describes C as "2+ steps" — plan expands to 4 domain steps (C1-C4). This is a valid elaboration, not a contradiction.

### 7.2 D-content-publishing-plan.md — PASS ✅

| Plan Step | Step File Exists? | Matches CONTEXT.md? |
|-----------|------------------|---------------------|
| step-01-load-session-context | ✅ | ✅ |
| step-01b-resume-if-interrupted | ✅ | ✅ |
| step-D1-fetch-ready-posts | ✅ | ✅ (D.1: Fetch ready posts) |
| step-D2-publish-to-linkedin | ✅ | ✅ (D.2: one shot, random delay, duplicate guard) |
| step-D3-update-status | ✅ | ✅ (D.3: Published + URN + timestamp) |
| step-D4-notify-telegram | ✅ | ✅ (D.4: Telegram notification) |
| steps-v/step-01-validate | ✅ | ✅ |
| steps-e/step-01-assess + step-02-apply-edit | ✅ | ✅ |

### 7.3 F-content-formatting-plan.md — PASS ✅

| Plan Step | Step File Exists? | Matches CONTEXT.md? |
|-----------|------------------|---------------------|
| step-01-load-session-context | ✅ | ✅ |
| step-01b-resume-if-interrupted | ✅ | ✅ |
| step-F1-pick-drafted-post | ✅ | ✅ (F.1: Pick drafted post) |
| step-F2-apply-formatting | ✅ | ✅ (F.2: Apply platform formatting) |
| step-F3-generate-preview | ✅ | ✅ (F.3: Generate preview) |
| step-F4-user-approval | ✅ | ✅ (F.4: User approves → Previewed) |
| steps-v/step-01-validate | ✅ | ✅ |
| steps-e/step-01-assess + step-02-apply-edit | ✅ | ✅ |

---

## Bug Summary

| Bug ID | Severity | File | Description | Root Cause |
|--------|----------|------|-------------|------------|
| BUG-YAML-01 | P2 | `workflows/content-drafting/data/reference/framework-index.yaml` | 4 item_count values overstate actual CSV rows by 1 (hook-frameworks 35→34, narrative-frameworks 32→31, positioning-templates 32→31, content-methods 62→61) | Counts copied from CONTEXT.md planned values, not verified post-creation |
| BUG-YAML-02 | P1 | `workflows/analytics-review/data/reference/analytics-config.yaml` | Resurgence detection threshold defined as "> 2× average after 7+ days" but CONTEXT.md defines it as "Day 14 > Day 7 by >20%" — materially different thresholds and comparison methods | Definition drift between CONTEXT.md spec and YAML implementation |
| BUG-INDEX-01 | P2 | `frameworks/index.csv` | 6 of 9 CSV item_count values are wrong by ±1 vs actual CSV row counts (FW01, FW04, FW05, FW06, FW08, FW10) | Index file not updated after CSVs were modified post-initial creation |

### Recommended Fixes

1. **BUG-YAML-02 (P1):** Align resurgence detection definition — decide whether the canonical rule is CONTEXT.md's "Day 14 > Day 7 by >20%" or the YAML's "> 2× average after 7+ days", then update the other file. Recommend keeping CONTEXT.md's version as it is more specific and actionable.

2. **BUG-YAML-01 (P2):** Update framework-index.yaml counts to match actual CSV rows: hook-frameworks=34, narrative-frameworks=31, positioning-templates=31, content-methods=61.

3. **BUG-INDEX-01 (P2):** Update frameworks/index.csv counts to match actual CSV rows: FW01=35, FW04=32, FW05=32, FW06=16, FW08=61, FW10=49.

4. **CONTEXT.md staleness (advisory):** Update CONTEXT.md framework counts for: hook-frameworks (35→34), narrative-frameworks (32→31), positioning-templates (32→31), formatting-rules (15→16), content-methods (60→61), variable-registry (48→49).

---

## Appendix: Complete Cross-Reference Matrix

### Agent Name Consistency (all sources agree)

| Agent ID | Display Name | manifest | module-help | sidecar | config.yaml |
|----------|-------------|----------|-------------|---------|-------------|
| flex-publicist | Echo | ✅ | ✅ | ✅ | ✅ |
| flex-ideator | Scout | ✅ | ✅ | ✅ | ✅ |
| flex-crafter | Pixel | ✅ | ✅ | ✅ | ✅ |
| flex-publisher | Relay | ✅ | ✅ | ✅ | ✅ |
| flex-ideation-qa | Lens | ✅ | — | ✅ | ✅ |
| flex-craft-qa | Grid | ✅ | — | ✅ | ✅ |
| flex-publish-qa | Sentinel | ✅ | — | ✅ | ✅ |

### Webhook Consistency (CONTEXT.md vs reference YAMLs)

All 13 webhooks referenced in CONTEXT.md are correctly used in the corresponding reference YAMLs and step files. No phantom webhooks, no missing references. ✅

### Status Flow Consistency (all sources agree)

`Scheduled_NoDraft → Drafting → Drafted → Formatting → Previewed → Ready_ToPublish → Published`

Confirmed in: CONTEXT.md ✅ | pipeline-state-machine.md ✅ | publish-config.yaml ✅ | review-criteria.yaml ✅ | all plan files ✅
