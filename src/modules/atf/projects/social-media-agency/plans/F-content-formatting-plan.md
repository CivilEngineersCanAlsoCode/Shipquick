# F-ContentFormatting — Detailed Implementation Plan

> **Version:** 1.0
> **Created:** 2026-03-15
> **Status:** Planning
> **Scope:** LinkedIn only (v1)
> **Depends on:** B-ContentDrafting (must have drafted posts)

---

## 1. Overview

Content Formatting is the third workflow in the SMA pipeline (A→B→**F**→C→D→E). It takes a drafted post (status: `Drafted`) and applies LinkedIn-specific formatting rules — staircase layout, emoji placement, UPPERCASE headers, hashtag formatting, and character constraints. The output is a platform-ready preview.

### Key Design Decisions
- **Formatting is separate from drafting** — B focuses on content quality, F focuses on platform compliance
- **16 formatting rules** from `frameworks/formatting-rules.csv` applied systematically
- **Code block preview** — user sees exact LinkedIn rendering
- **Re-entrant from C** — review can send posts back to F for format fixes (C→F loop)

### Architecture Rules (inherited)
- **Claw (BMAD agent) has ZERO direct DB/API access**
- ALL reads and writes go through n8n webhook-triggered workflows
- MongoDB = user's own data

---

## 2. Data Flow

### Input (from B-ContentDrafting B.4 or C-ContentReview C.2 reject)
Post in `linkedin_posts` with:
```json
{
  "_id": ObjectId,
  "title": "Why I turned down PWC to bet on myself",
  "content": "Raw draft text — not yet formatted for LinkedIn",
  "status": "Drafted",
  "draft_metadata": { "word_count": 287, "char_count": 1542, "hook_type": "question", "tone": "casual_witty" }
}
```

Or re-entry from review:
```json
{
  "status": "Formatting",
  "review_metadata": { "decision": "rejected_format", "review_notes": "emoji zyada hai, staircase fix karo" }
}
```

### Output (after Content Formatting)
Same document updated:
```json
{
  "content": "Formatted post text with staircase, emojis, etc.",
  "status": "Previewed",
  "formatting_metadata": {
    "char_count": 1489,
    "line_count": 28,
    "emoji_count": 3,
    "hashtag_count": 4,
    "has_staircase": true,
    "max_block_lines": 3,
    "readability_grade": 7,
    "rules_applied": ["FR01", "FR02", "FR04", "FR07", "FR10", "FR12"],
    "rules_violated": [],
    "formatted_at": ISODate
  }
}
```

---

## 3. Formatting Rules Reference

From `frameworks/formatting-rules.csv` (15 rules):

| ID | Rule | Category |
|----|------|----------|
| FR01 | 800-1600 ASCII characters | Length |
| FR02 | No bold/italic/underline — UPPERCASE headers sparingly | Typography |
| FR03 | Max 3-line blocks with staircase formatting | Layout |
| FR04 | Max 3 emojis at tension points | Emoji |
| FR05 | Replace dashes with punctuation | Typography |
| FR06 | Bullets: " - "; Flows: "A —> B —> C" | Typography |
| FR07 | Max 3 Hindi sentences at emotional peaks | Language |
| FR08 | FK Grade 7 readability | Readability |
| FR09 | Positioning + follow after CTA | Structure |
| FR10 | 3-6 hashtags at end | Hashtags |
| FR11 | Show in code block preview | Presentation |
| FR12-FR15 | Additional platform rules | Various |

---

## 4. n8n Workflows

### 4.1 Existing Workflows (Reuse)

| # | Workflow | Webhook | Reuse For |
|---|----------|---------|-----------|
| 1 | SMA/Data/Read/FetchPostById | /sma-fetch-post | F.1 — Fetch drafted post |
| 2 | SMA/Data/Write/UpdatePost | /sma-update-post | F.1 (status→Formatting), F.4 (save formatted) |

**0 new n8n workflows needed** — fully reuses existing infrastructure.

---

## 5. BMAD Workflow Steps — Complete Execution Flow

### F.1 — Pick Drafted Post
```
Agent: Content Formatter (flex-crafter)
Trigger: User says "Format karo" / "LinkedIn ready karo" / after B.4

Sub-steps:

F.1.a — Fetch drafted post:
  n8n call: SMA/Data/Read/FetchPostById
  Input: { "status": "Drafted", "channel": "linkedin", "limit": 1 }
  Sort: scheduled_date ascending (earliest first)
  Output: Single post (earliest drafted)

  OR — Re-entry from review:
  Input: { "status": "Formatting", "channel": "linkedin", "limit": 1 }
  Output: Post sent back from review with feedback

F.1.b — Set status to Formatting:
  n8n call: SMA/Data/Write/UpdatePost
  Input: { "post_id": post._id, "updates": { "status": "Formatting" } }

F.1.c — Present:
  "🎨 Formatting post:

   📌 'Why I turned down PWC to bet on myself'
   📅 Mar 17 | Pillar: Career
   📊 Current: 1,542 chars | Target: 800-1,600

   [If re-entry from review:]
   ⚠️ Review feedback: 'emoji zyada hai, staircase fix karo'

   Formatting rules apply karta hoon..."

F.1.d — Edge cases:
  - No drafted posts → "Koi drafted post nahi hai. Draft karo pehle?"
  - Post already previewed → "Ye post already formatted hai ✅ Review karo?"

Next: F.2
```

### F.2 — Apply Formatting Rules
```
Agent: Content Formatter
Purpose: Transform raw draft into LinkedIn-ready format (BMAD computation — no n8n)

Sub-steps:

F.2.a — Load formatting rules:
  Read frameworks/formatting-rules.csv (local file, no webhook needed)

F.2.b — Apply rules systematically:

  1. CHARACTER COUNT (FR01):
     - Count ASCII characters
     - If > 1600 → trim (suggest cuts)
     - If < 800 → warn (may need expansion)

  2. TYPOGRAPHY (FR02, FR05, FR06):
     - Remove any bold/italic/underline markers
     - Convert headers to UPPERCASE sparingly
     - Replace dashes (—) with proper punctuation
     - Bullets: " - " format
     - Flows: "A —> B —> C"

  3. LAYOUT — STAIRCASE (FR03):
     - Max 3 lines per paragraph block
     - Add line breaks between blocks
     - Staircase effect: visual breathing room

     Example:
     ```
     I had the offer letter in hand.
     PWC. The safest bet.
     Everyone said take it.

     I said no.

     Not because I had something better.
     But because I had something scarier.
     My own path.
     ```

  4. EMOJI (FR04):
     - Max 3 emojis total
     - Place at tension/transition points
     - No decorative emoji (no bullet emoji, no header emoji)

  5. LANGUAGE (FR07):
     - Max 3 Hindi sentences
     - Only at emotional peaks
     - Romanised Hindi only

  6. READABILITY (FR08):
     - Target FK Grade 7
     - Short sentences, simple words
     - Break complex sentences

  7. STRUCTURE (FR09):
     - Positioning line after CTA
     - Follow prompt after positioning

  8. HASHTAGS (FR10):
     - 3-6 relevant hashtags at end
     - No inline hashtags

Next: F.3
```

### F.3 — Generate Preview
```
Agent: Content Formatter
Purpose: Show exact LinkedIn rendering in code block (FR11)

Sub-steps:

F.3.a — Render in code block:
  Present the formatted post inside a code block to show exact rendering:

  "📱 LinkedIn Preview:

   ```
   What would you do with a PWC offer at 22?

   I had the offer letter in hand.
   PWC. The safest bet.
   Everyone said take it.

   I said no. 🎯

   Not because I had something better.
   But because I had something scarier.
   My own path.

   [... rest of formatted post ...]

   What's the hardest career decision you've made?

   ——
   Satvik | Building in public
   Follow for more career stories

   #career #decisions #PM #startups
   ```

   📊 Format Check:
   - Characters: 1,489 / 1,600 ✅
   - Lines: 28 ✅
   - Emojis: 3 / 3 ✅
   - Hashtags: 4 (3-6) ✅
   - Max block: 3 lines ✅
   - Staircase: Yes ✅
   - Hindi: 0 sentences ✅

   Rules applied: FR01 ✅ FR02 ✅ FR03 ✅ FR04 ✅ FR10 ✅
   Rules violated: None ✅

   Approve karna hai ya changes chahiye?"

F.3.b — User feedback loop:
  - "Emoji hata do" → remove, re-render
  - "Staircase tight karo" → adjust blocks
  - "Hashtag add karo" → add, check max 6
  - Minor adjustments only — content changes go back to B
  - Max 3 format adjustment rounds

Next: F.4
```

### F.4 — Save & Mark Previewed
```
Agent: Content Formatter
Purpose: Save formatted content and update status

Sub-steps:

F.4.a — User approves preview:
  User says "done" / "good" / "preview theek hai"

F.4.b — Save to MongoDB:
  n8n call: SMA/Data/Write/UpdatePost
  Input: {
    "post_id": post._id,
    "updates": {
      "content": "Formatted post text...",
      "status": "Previewed",
      "formatting_metadata": {
        "char_count": 1489,
        "line_count": 28,
        "emoji_count": 3,
        "hashtag_count": 4,
        "has_staircase": true,
        "max_block_lines": 3,
        "readability_grade": 7,
        "rules_applied": ["FR01", "FR02", "FR03", "FR04", "FR10"],
        "rules_violated": [],
        "formatted_at": now
      }
    }
  }

F.4.c — Confirmation & next actions:
  "✅ Post formatted & previewed!

   📌 'Why I turned down PWC to bet on myself'
   📅 Mar 17 | Status: Previewed

   Next?
   1. 'Review karo' → C-ContentReview
   2. 'Next post format karo' → F.1
   3. 'Done' → exit"

Next: C (review) or F.1 (next post) or exit
```

---

## 6. Execution Flow Diagram

```
User: "Format karo"
│
├─ F.1 ──[F.1.a]──→ n8n: FetchPostById ──→ MongoDB (Drafted or Formatting)
│   ├──[F.1.b]──→ n8n: UpdatePost (status → Formatting)
│   └─ Present post + review feedback (if re-entry)
│
├─ F.2 ── Apply formatting rules (BMAD — local computation)
│   └── Load formatting-rules.csv → apply 15 rules → transform content
│
├─ F.3 ── Generate code block preview
│   └── Show formatted post + format check + rule compliance
│   └── User feedback loop (max 3 rounds)
│
└─ F.4 ──[F.4.b]──→ n8n: UpdatePost ──→ MongoDB (Previewed + formatting_metadata)
    └── Done! → C (review) or exit
```

---

## 7. n8n Calls Per Run

| Scenario | Calls | Breakdown |
|----------|-------|-----------|
| Happy path | 3 | F.1.a + F.1.b + F.4.b |
| Re-entry from review | 3 | F.1.a + F.1.b + F.4.b |
| User abandons mid-format | 1 | F.1.a only |

---

## 8. Dependencies

### Prerequisites
- At least 1 post with status `Drafted` or `Formatting` (from B or C reject)
- `frameworks/formatting-rules.csv` present with 15 rules
- FetchPostById and UpdatePost n8n workflows active

### Build Order
```
1. Update/create step files for F workflow
2. Verify formatting-rules.csv has all 15 rules
3. End-to-end test: format from Drafted
4. End-to-end test: re-entry from C review rejection
5. End-to-end test: format adjustment loop
```

---

## 9. Naming Convention Reference

```
Tier 1 (BMAD Workflow): F (ContentFormatting)
Tier 2 (Step):          1-4
Tier 3 (n8n Call):      a, b

Steps:
  F.1 — Pick Drafted Post
  F.2 — Apply Formatting Rules
  F.3 — Generate Preview
  F.4 — Save & Mark Previewed

n8n Calls:
  F.1.a — FetchPostById (existing)
  F.1.b — UpdatePost (existing, status → Formatting)
  F.4.b — UpdatePost (existing, status → Previewed)
```

---

## 10. File References

| File | Path |
|------|------|
| This plan | `plans/F-content-formatting-plan.md` |
| BMAD workflow | `workflows/content-formatting/workflow.md` |
| Step files | `workflows/content-formatting/steps-c/` |
| Formatting rules | `frameworks/formatting-rules.csv` |
| State machine | `docs/pipeline-state-machine.md` |
