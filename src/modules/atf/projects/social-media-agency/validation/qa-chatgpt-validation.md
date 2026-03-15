# QA — ChatGPT Deployment Package Validation

**Validator:** flex-lens
**Date:** 2026-03-15
**Scope:** chatgpt/ system prompt, knowledge files K1-K6, actions schema, bundle HTML
**Verdict:** FAIL (3 Critical, 2 High, 4 Medium, 2 Low)

---

## Summary

| # | Check Area | Result | Issues |
|---|-----------|--------|--------|
| 1 | system-prompt.md | PASS (with notes) | 0C 0H 1M 0L |
| 2 | K1-pipeline-workflows.md | PASS (with notes) | 0C 0H 1M 1L |
| 3 | K2-api-reference.md | PASS | 0C 0H 0M 0L |
| 4 | K3-formatting-rules.md | FAIL | 1C 1H 0M 0L |
| 5 | K4-frameworks.md | PASS | 0C 0H 0M 0L |
| 6 | K5-scoring-config.md | PASS | 0C 0H 0M 0L |
| 7 | K6-content-pillars.md | FAIL | 1C 0H 0M 0L |
| 8 | chatgpt-actions-schema.json | PASS (with notes) | 0C 1H 1M 0L |
| 9 | bundle/ (WF-A-ideation.html) | PASS | 0C 0H 0M 0L |
| X | Cross-file: saveToNotion | FAIL | 1C 0H 0M 0L |
| X | Cross-file: CONTEXT.md counts | — | 0C 0H 1M 1L |

**Totals: 3 Critical, 2 High, 4 Medium, 2 Low**

---

## 1. system-prompt.md

### Character Count
- **Actual:** 7,318 bytes
- **Limit:** 8,000
- **Result:** PASS (918 bytes headroom)
- **Note (M1):** Inline comment says "~7,200" — actual is 7,318. Minor cosmetic.

### 14 Endpoints Listed
All 14 present in the API Endpoints table:

| # | Endpoint | Present |
|---|----------|---------|
| 1 | submitBrief | YES |
| 2 | fetchBriefs | YES |
| 3 | fetchPastPosts | YES |
| 4 | searchExperiences | YES |
| 5 | fetchConfig | YES |
| 6 | saveConfig | YES |
| 7 | updateSheetStatus | YES |
| 8 | saveExperience | YES |
| 9 | savePost | YES |
| 10 | fetchPost | YES |
| 11 | updatePost | YES |
| 12 | publishLinkedIn | YES |
| 13 | notifyTelegram | YES |
| 14 | collectAnalytics | YES |

**Result:** PASS — all 14 listed.

### Modes Table — MANDATORY PRE-LOAD
- Table present at lines 35-49 with 12 trigger rows
- "BEFORE responding to ANY mode trigger, you MUST" directive present (line 30)
- Each trigger maps to a knowledge file section and step sequence
- "DO NOT skip" and "DO NOT paraphrase" directives present (line 50)
- **Result:** PASS

### Knowledge File References (K1-K6)
| Ref | Used In | Correct |
|-----|---------|---------|
| K1 | §A, §B, §F, §C, §D, §E (modes table) | YES |
| K2 | §submitBrief, §collectAnalytics, §saveExperience (modes table) | YES |
| K3 | "16 rules — details in K3" (line 86) | YES |
| K4 | Frameworks section (line 122) | YES |
| K5 | Scoring section (line 84), show/update config modes | YES |
| K6 | Content Pillars section (line 120) | YES |

**Result:** PASS

### Rules Match CONTEXT.md
| Rule | System Prompt | CONTEXT.md | Match |
|------|--------------|------------|-------|
| Max posts/day | 1 | 1 | YES |
| Max planned | 3 | 3 | YES |
| Platform | LinkedIn only (v1) | LinkedIn only (v1) | YES |
| Formula | F×8 + P×5 + R×3 | F×8 + P×5 + R×3 | YES |
| Gates | F≥5, P≥3, R≥2, T≥80 | F≥5, P≥3, R≥2, T≥80 | YES |
| No direct DB | YES | YES | YES |
| One-shot publish | YES | YES | YES |
| Hindi limit | Max 3 sentences | Max 3 sentences | YES |
| Char limit | 800-1600 | 800-1600 | YES |

**Result:** PASS

---

## 2. K1-pipeline-workflows.md

### All 6 Workflows Documented
| WF | Name | Steps | Present |
|----|------|-------|---------|
| A | Content Ideation | A.1-A.8 (8 steps) | YES |
| B | Content Drafting | B.1-B.4 (4 steps) | YES |
| F | Content Formatting | F.1-F.4 (4 steps) | YES |
| C | Content Review | C.1-C.4 (4 steps) | YES |
| D | Content Publishing | D.1-D.4 (4 steps) | YES |
| E | Analytics Review | E.1-E.5 (5 steps) | YES |

**Result:** PASS

### Step Numbers Match CONTEXT.md
| WF | K1 Steps | CONTEXT.md Steps | Match |
|----|----------|-----------------|-------|
| A | A.1-A.8 | 8 steps | YES |
| B | B.1-B.4 | 4 steps | YES |
| F | F.1-F.4 | F.1-F.4 | YES |
| C | C.1-C.4 | "2+ steps" | **MISMATCH (L1)** |
| D | D.1-D.4 | 4 steps | YES |
| E | E.1-E.5 | 5 steps | YES |

**L1:** CONTEXT.md says C has "2+ steps" but K1 documents 4 steps (C.1-C.4). Non-breaking; K1 is the more detailed source.

### Webhook Calls vs CONTEXT.md
| Webhook | K1 Step(s) | CONTEXT.md Step(s) | Match |
|---------|-----------|-------------------|-------|
| fetchBriefs | A.1 | A.1 | YES |
| fetchPastPosts | A.2, B.2 | A.2, A.7, B.2 | PARTIAL — K1 A.7 says fetchConfig + fetchPastPosts but this is implied |
| searchExperiences | A.3, B.2 | A.3, B.2 | YES |
| fetchConfig | A.4, E.1 | A.4, A.7, E.1, E.5 | YES (K1 A.7 references it) |
| saveConfig | A.5, E.4, E.5 | A.5, E.4, E.5 | YES |
| updateSheetStatus | A.6, A.8 | A.6, A.8 | YES |
| saveExperience | A.7 | A.6 | **MISMATCH (M2)** |
| savePost | A.8 | A.8 | YES |
| saveToNotion | NOT IN K1 | A.8 | **MISSING (see C1)** |
| fetchPost | B.1, C.1, D.1, E.1, F.1 | B.1, C.1, D.1, E.1, F.1 | YES |
| updatePost | B.4, C.2, D.3, F.4 | B.4, C.2, D.2, D.3, F.1, F.4 | YES |
| publishLinkedIn | D.2 | D.2 | YES |
| notifyTelegram | D.4 | D.4 | YES |
| collectAnalytics | E.1 | E.1 | YES |

**M2:** K1 places `saveExperience` in A.7 ("Save experiences if new ones surfaced"), CONTEXT.md maps it to A.6. Suggest aligning to A.7 (K1) since A.6 is about scoring.

---

## 3. K2-api-reference.md

### All 14 Endpoints
All 14 endpoints documented with full request body schema, response format, and URL. Numbering 1-14 is sequential and complete.

**Result:** PASS

### URLs Match n8n Webhook Paths
All 14 URLs follow the `/webhook/sma-{name}` pattern and match exactly between K2 and CONTEXT.md webhook table:

| K2 # | operationId | URL | Matches CONTEXT.md |
|------|------------|-----|-------------------|
| 1 | submitBrief | /webhook/sma-submit-brief | YES |
| 2 | fetchBriefs | /webhook/sma-fetch-briefs | YES |
| 3 | fetchPastPosts | /webhook/sma-fetch-past-posts | YES |
| 4 | searchExperiences | /webhook/sma-search-experiences | YES |
| 5 | fetchConfig | /webhook/sma-fetch-config | YES |
| 6 | saveConfig | /webhook/sma-save-config | YES |
| 7 | updateSheetStatus | /webhook/sma-update-sheet-status | YES |
| 8 | saveExperience | /webhook/sma-save-experience | YES |
| 9 | savePost | /webhook/sma-save-post | YES |
| 10 | fetchPost | /webhook/sma-fetch-post | YES |
| 11 | updatePost | /webhook/sma-update-post | YES |
| 12 | publishLinkedIn | /webhook/sma-publish-linkedin | YES |
| 13 | notifyTelegram | /webhook/sma-notify-telegram | YES |
| 14 | collectAnalytics | /webhook/sma-analytics-collect | YES |

**Result:** PASS

---

## 4. K3-formatting-rules.md

### All 16 Rules Present
FR01-FR16 all documented with rule name, description, correct/wrong examples, validation criteria, and priority (P1/P2). Quick checklist table included.

**Result:** PASS (count)

### Match formatting-rules.csv — FAIL

**CRITICAL (C1): Rules FR12-FR16 diverge between K3 and formatting-rules.csv.**

| FR# | K3 Rule | CSV Rule | Match |
|-----|---------|----------|-------|
| FR01 | Staircase Formatting (P2) | staircase-formatting (P2) | YES |
| FR02 | Max Three-Line Blocks (P1) | max-three-line-blocks (P1) | YES |
| FR03 | No Bold/Italic/Underline (P1) | no-bold-italic-underline (P1) | YES |
| FR04 | Replace Dashes with Punctuation (P1) | replace-dashes-with-punctuation (P1) | YES |
| FR05 | Bullets Format (P1) | bullets-format (P1) | YES |
| FR06 | Numbered Lists Format (P2) | numbered-lists-format (P2) | YES |
| FR07 | Flows Format (P2) | flows-format (P2) | YES* |
| FR08 | Max Three Emojis (P1) | max-three-emojis (P1) | YES |
| FR09 | Max Three Hindi Sentences (P1) | max-three-hindi-sentences (P1) | YES |
| FR10 | FK Grade 7 Readability (P1) | fk-grade-7-readability (P1) | YES |
| FR11 | Character Limit (P1) | character-limit (P1) | YES |
| **FR12** | **CTA Placement (P1)** | **footer-line-1-positioning (P1)** | **NO** |
| **FR13** | **Positioning Line (P1)** | **footer-line-2-follow (P2)** | **NO** |
| **FR14** | **Follow CTA (P1)** | **hashtags-at-end-only (P1)** | **NO** |
| **FR15** | **Hashtags (P2)** | **one-idea-per-post (P2)** | **NO** |
| **FR16** | **Code Block Preview (P1)** | **whitespace-breathing-room (P2)** | **NO** |

**Impact:** FR12-FR16 are completely different rules with different numbering. K3 has:
- FR12: CTA Placement — **NOT IN CSV**
- FR16: Code Block Preview — **NOT IN CSV**

CSV has:
- FR15: one-idea-per-post — **NOT IN K3**
- FR16: whitespace-breathing-room — **NOT IN K3**

Additionally, FR13 priority differs: K3 says P1, CSV says P2.

**HIGH (H1): FR07 flow arrow character mismatch.**
- K3 correct example: `Idea --> Prototype --> Launch` (double-hyphen `-->`)
- CSV correct example: `A —> B —> C —> D` (em-dash `—>`)
- CONTEXT.md: `A —> B —> C` (em-dash)
- System prompt: `A --> B --> C` (double-hyphen)

These are different Unicode characters. ChatGPT will generate inconsistent formatting depending on which source it follows.

---

## 5. K4-frameworks.md

### All 7+1 Framework Files Referenced
| # | Category | Code Prefix | K4 Count | CSV Lines (wc) | Match |
|---|----------|------------|----------|----------------|-------|
| 1 | Content Formats | CF | 35 | 35 | YES |
| 2 | Hook Frameworks | HK | 35 | 35 | YES |
| 3 | Narrative Frameworks | NF | 32 | 32 | YES |
| 4 | CTA Frameworks | CT | 32 | 32 | YES |
| 5 | Tone Frameworks | TN | 32 | 32 | YES |
| 6 | Positioning Templates | PT | 32 | 32 | YES |
| 7 | Content Methods | — | 60 | 61 | YES (60 data + 1 header) |
| +1 | Formatting Rules | FR | 16 | 16 | YES |

K4 full item lists verified against code prefixes (CF01-CF35, HK01-HK35, NF01-NF32, CT01-CT32, TN01-TN32, PT01-PT32). All IDs are sequential with no gaps.

System prompt framework counts (line 125-132) match K4 exactly.

**Result:** PASS

---

## 6. K5-scoring-config.md

### Formula
- K5: `Score = F x 8 + P x 5 + R x 3` — line 6
- Max: 10×8 + 10×5 + 10×3 = 160 — line 12
- Matches system prompt (line 81): `Score = F x 8 + P x 5 + R x 3` (max 160)
- Matches CONTEXT.md: `Score = F×8 + P×5 + R×3`
- **Result:** PASS

### Gate Checks
| Gate | K5 | CONTEXT.md | System Prompt | Match |
|------|-----|-----------|---------------|-------|
| F minimum | ≥ 5 | ≥ 5 | ≥ 5 | YES |
| P minimum | ≥ 3 | ≥ 3 | ≥ 3 | YES |
| R minimum | ≥ 2 | ≥ 2 | ≥ 2 | YES |
| Total minimum | ≥ 80 (50% of 160) | 50% of 160 = 80 | ≥ 80 | YES |

Scale definitions (1-10 for each factor) with detailed descriptions present. Config doc IDs table matches CONTEXT.md. Scoring examples validate formula correctly.

**Result:** PASS

---

## 7. K6-content-pillars.md

### All 7 Pillars Present
1. Product Management — YES
2. Career Growth — YES
3. Startup / Building — YES
4. Tech & AI — YES
5. Personal Growth — YES
6. Leadership — YES
7. Finance / Investing — YES

Each pillar includes: Description, Best Frameworks (6 categories), Audience. Posting frequency guidelines and pillar selection rules included.

**Result:** PASS (count and structure)

### Weights Match content-strategy.md — FAIL

**CRITICAL (C2): K6 pillars and content-strategy.md pillars are fundamentally different lists.**

| K6 Pillar | K6 % (2-week) | content-strategy.md Pillar | CS Weight |
|-----------|---------------|---------------------------|-----------|
| Product Management | ~25% | `pm` | 20% |
| Career Growth | ~17% | `career` | 15% |
| Startup / Building | ~17% | `startup` | 20% |
| Tech & AI | ~17% | `ai_automation` | 25% |
| Personal Growth | ~17% | `personal` | 5% |
| Leadership | ~8% | — (NOT IN CS) | — |
| Finance / Investing | ~8% | — (NOT IN CS) | — |
| — (NOT IN K6) | — | `hottake` | 10% |
| — (NOT IN K6) | — | `howto` | 5% |

**Key mismatches:**
1. `hottake` (10%) and `howto` (5%) exist in content-strategy.md but NOT in K6
2. `Leadership` and `Finance / Investing` exist in K6 but NOT in content-strategy.md
3. `Personal Growth` is 17% in K6 but only 5% in content-strategy.md
4. `Tech & AI` is 17% in K6 but `ai_automation` is 25% in content-strategy.md (top pillar)
5. System prompt pillar list (lines 112-118) matches K6, not content-strategy.md

**Impact:** ChatGPT will use K6 pillars (7 listed in system prompt), but the actual content strategy calls for `hottake` and `howto` posts which have no K6 entry, framework pairings, or scheduling guidance. This means ~15% of intended content has no ChatGPT support.

---

## 8. chatgpt-actions-schema.json

### Valid OpenAPI
- Version: **3.1.0** (not 3.0.x)
- Structure: valid `openapi`, `info`, `servers`, `paths`
- All paths use `post` method with `requestBody` and `responses`
- **Result:** PASS (M3: version is 3.1.0, not 3.0.x as task specified — ChatGPT accepts both)

### 14 operationIds — All Unique
| # | operationId | Unique |
|---|------------|--------|
| 1 | submitBrief | YES |
| 2 | fetchBriefs | YES |
| 3 | fetchPastPosts | YES |
| 4 | searchExperiences | YES |
| 5 | fetchConfig | YES |
| 6 | updateSheetStatus | YES |
| 7 | saveConfig | YES |
| 8 | saveExperience | YES |
| 9 | savePost | YES |
| 10 | fetchPost | YES |
| 11 | updatePost | YES |
| 12 | publishLinkedIn | YES |
| 13 | notifyTelegram | YES |
| 14 | collectAnalytics | YES |

**Result:** PASS — all 14 unique.

### URLs Match Webhook Paths
All 14 paths in the schema match K2 and CONTEXT.md exactly:
- Base URL: `https://n8n.linkright.in`
- All paths: `/webhook/sma-{name}` pattern

**Missing: `/webhook/sma-save-to-notion`** — see C3 below.

**HIGH (H2): Schema path ordering differs from K2 numbering.** `updateSheetStatus` appears before `saveConfig` in the schema paths but is #7 (after saveConfig #6) in K2. No functional impact but could confuse during audits.

**Result:** PASS (with H2 note)

---

## 9. Bundle Files

### WF-A-ideation.html
- **Well-formed HTML:** YES — valid DOCTYPE, html/head/body structure, all tags properly closed
- **Data attributes:**
  - `data-type="workflow"` on section element — YES
  - `data-code="A"` — YES
  - `data-part` attributes: config, instructions, checklist, template, validation, edit-assess, edit-apply — YES (7 parts)
  - `data-step` attributes: 01, 01b, A1, A2, A3, A4, A5, A6, A7, A8 — YES (10 steps)
  - `data-phase` attributes: setup, data-gathering, scoring-config, score-select, schedule, persistence — YES (6 phases)
- **Content completeness:** Full workflow instructions, webhook reference table, error handling, constraints, checklist, template, validation protocol, and edit protocols all present
- **Bundle metadata:** version 1.0.0, source-module flex-sma, workflow-code A

**Result:** PASS

---

## Cross-File Issues

### CRITICAL (C3): saveToNotion Endpoint Missing from ChatGPT Package

CONTEXT.md lists `/sma-save-to-notion` as a webhook used in step A.8. The bundle HTML (WF-A-ideation.html) references it in the A.8 step and webhook reference table. However:

| File | saveToNotion Present |
|------|---------------------|
| CONTEXT.md | YES (line 77) |
| bundle/WF-A-ideation.html | YES (A.8.b) |
| system-prompt.md | **NO** |
| K1-pipeline-workflows.md | **NO** |
| K2-api-reference.md | **NO** |
| chatgpt-actions-schema.json | **NO** |

**Impact:** ChatGPT cannot save to Notion during A.8 because it has no action for it. Either:
1. Add `saveToNotion` as the 15th endpoint (requires updating system prompt, K1, K2, schema)
2. Or document that Notion saves are handled server-side by n8n (remove from bundle HTML)

### MEDIUM (M4): CONTEXT.md Framework Count Mismatch
CONTEXT.md (line 186) says `formatting-rules.csv (15)` but the actual file has 16 rules (FR01-FR16). Should be `(16)`.

### LOW (L2): C Workflow Step Count
CONTEXT.md says C has "2+ steps" but all other sources (K1, bundle) show 4 steps (C.1-C.4).

---

## Issue Registry

| ID | Severity | File(s) | Description | Recommended Fix |
|----|----------|---------|-------------|----------------|
| C1 | CRITICAL | K3, formatting-rules.csv | FR12-FR16 rules diverge between K3 and CSV. K3 has CTA Placement + Code Block Preview; CSV has footer-positioning + one-idea-per-post + whitespace. | Reconcile: merge both rule sets into FR01-FR18 or decide canonical 16 and update both files. |
| C2 | CRITICAL | K6, content-strategy.md | Pillar lists differ: K6 has Leadership + Finance; CS has hottake + howto. Weights disagree on all overlapping pillars. | Pick one canonical list. If CS is authoritative, update K6 + system prompt pillars. |
| C3 | CRITICAL | system-prompt, K1, K2, schema | saveToNotion webhook in CONTEXT.md + bundle but missing from all ChatGPT-facing files. | Add as 15th endpoint or remove from CONTEXT.md/bundle if handled server-side. |
| H1 | HIGH | K3, formatting-rules.csv, system-prompt, CONTEXT.md | FR07 flow arrow uses `-->` in K3/prompt but `—>` in CSV/CONTEXT. Different Unicode chars. | Standardize to one format across all files. |
| H2 | HIGH | chatgpt-actions-schema.json, K2 | Schema path ordering (updateSheetStatus before saveConfig) differs from K2 numbering. | Reorder schema paths to match K2 sequence for consistency. |
| M1 | MEDIUM | system-prompt.md | Inline char count comment says "~7,200" but actual is 7,318 bytes. | Update comment to "~7,300". |
| M2 | MEDIUM | K1, CONTEXT.md | saveExperience step: K1 says A.7, CONTEXT.md says A.6. | Align to K1 (A.7) and update CONTEXT.md. |
| M3 | MEDIUM | chatgpt-actions-schema.json | OpenAPI version is 3.1.0, not 3.0.x. | Non-breaking — ChatGPT accepts 3.1.0. No action needed unless targeting strict 3.0 validators. |
| M4 | MEDIUM | CONTEXT.md | Says formatting-rules.csv has 15 items; actual count is 16. | Update CONTEXT.md to say 16. |
| L1 | LOW | K1, CONTEXT.md | C workflow: K1 has 4 steps (C.1-C.4), CONTEXT.md says "2+ steps". | Update CONTEXT.md to "4 steps". |
| L2 | LOW | chatgpt-actions-schema.json | Schema endpoint ordering doesn't match K2 numbering. | Cosmetic — no functional impact. |

---

## Recommended Fix Priority

### P0 — Must fix before deployment
1. **C2: Pillar reconciliation.** Decide canonical pillar list. If content-strategy.md is the source of truth, K6 must add `hottake` and `howto` pillars with framework pairings, and remove or remap `Leadership` and `Finance / Investing`. System prompt pillar list must match.
2. **C1: FR12-FR16 reconciliation.** Merge K3 and CSV into one canonical set of 16 (or 18) rules. Both files must have identical rule IDs, names, and priorities.
3. **C3: saveToNotion decision.** Either add it as endpoint #15 everywhere, or document it as server-side-only and remove from bundle HTML.

### P1 — Fix before first user session
4. **H1: Standardize flow arrow format** (`-->` or `—>`, pick one).
5. **H2: Reorder schema paths** to match K2 for auditability.

### P2 — Fix when convenient
6. M1-M4 and L1-L2: Update counts, comments, and step attributions.

---

## Appendix: Detailed Cross-Reference

### Endpoint Presence Matrix

| Endpoint | Prompt | K1 | K2 | Schema | CONTEXT | Bundle |
|----------|--------|----|----|--------|---------|--------|
| submitBrief | Y | Y | Y | Y | Y | — |
| fetchBriefs | Y | Y | Y | Y | Y | Y |
| fetchPastPosts | Y | Y | Y | Y | Y | Y |
| searchExperiences | Y | Y | Y | Y | Y | Y |
| fetchConfig | Y | Y | Y | Y | Y | Y |
| saveConfig | Y | Y | Y | Y | Y | Y |
| updateSheetStatus | Y | Y | Y | Y | Y | Y |
| saveExperience | Y | Y | Y | Y | Y | Y |
| savePost | Y | Y | Y | Y | Y | Y |
| **saveToNotion** | **N** | **N** | **N** | **N** | **Y** | **Y** |
| fetchPost | Y | Y | Y | Y | Y | — |
| updatePost | Y | Y | Y | Y | Y | — |
| publishLinkedIn | Y | Y | Y | Y | Y | — |
| notifyTelegram | Y | Y | Y | Y | Y | — |
| collectAnalytics | Y | Y | Y | Y | Y | — |

### Pillar Cross-Reference

| K6 Pillar | System Prompt | content-strategy.md | Match All |
|-----------|--------------|--------------------:|-----------|
| Product Management | Y | `pm` (20%) | Partial — name/weight differ |
| Career Growth | Y | `career` (15%) | Partial |
| Startup / Building | Y | `startup` (20%) | Partial |
| Tech & AI | Y | `ai_automation` (25%) | Partial — name/weight differ |
| Personal Growth | Y | `personal` (5%) | Partial — weight 17% vs 5% |
| Leadership | Y | — | **NO** (not in CS) |
| Finance / Investing | Y | — | **NO** (not in CS) |
| — | — | `hottake` (10%) | **NO** (not in K6) |
| — | — | `howto` (5%) | **NO** (not in K6) |
