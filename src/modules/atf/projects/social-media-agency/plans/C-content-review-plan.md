# C-ContentReview — Detailed Implementation Plan

> **Version:** 1.0
> **Created:** 2026-03-15
> **Status:** Planning
> **Scope:** LinkedIn only (v1)
> **Depends on:** F-ContentFormatting (must have previewed posts)

---

## 1. Overview

Content Review is the fourth workflow in the SMA pipeline (A→B→F→**C**→D→E). It takes a formatted, previewed post (status: `Previewed`) and runs it through a quality review. The user approves, rejects (back to formatting), or requests rework (back to drafting).

### Key Design Decisions
- **User is the reviewer** — agent presents, user decides
- **Three outcomes:** Approve → `Ready_ToPublish`, Reject-format → back to F, Rework-content → back to B
- **Quality checklist** loaded from `workflows/content-review/checklist.md`
- **No auto-approve** — every post requires explicit human sign-off

### Architecture Rules (inherited)
- **Claw (BMAD agent) has ZERO direct DB/API access**
- ALL reads and writes go through n8n webhook-triggered workflows
- MongoDB = user's own data

---

## 2. Data Flow

### Input (from F-ContentFormatting F.4)
Post in `linkedin_posts` with:
```json
{
  "_id": ObjectId,
  "title": "Why I turned down PWC to bet on myself",
  "content": "Formatted post text with staircase, emoji, etc.",
  "status": "Previewed",
  "draft_metadata": { "hook_type", "cta_type", "hashtags", "tone", "format" },
  "formatting_metadata": { "char_count", "line_count", "emoji_count", "hashtag_count" }
}
```

### Output (after Content Review)
Same document updated:
```json
{
  "status": "Ready_ToPublish | Formatting | Drafting",
  "review_metadata": {
    "reviewed_at": ISODate,
    "decision": "approved | rejected_format | rejected_content",
    "review_notes": "string | null",
    "review_iteration": 1
  }
}
```

---

## 3. n8n Workflows

### 3.1 Existing Workflows (Reuse)

| # | Workflow | Webhook | Reuse For |
|---|----------|---------|-----------|
| 1 | SMA/Data/Read/FetchPostById | /sma-fetch-post | C.1 — Fetch previewed post |
| 2 | SMA/Data/Write/UpdatePost | /sma-update-post | C.2 — Update status after review |

**0 new n8n workflows needed** — fully reuses existing infrastructure.

---

## 4. BMAD Workflow Steps — Complete Execution Flow

### C.1 — Fetch Post for Review
```
Agent: Content Reviewer (flex-craft-qa or flex-publish-qa)
Trigger: User says "Review karo" / "Post check karo" / after F.4

Sub-steps:

C.1.a — Fetch previewed post:
  n8n call: SMA/Data/Read/FetchPostById
  Input: { "status": "Previewed", "channel": "linkedin", "limit": 1 }
  Sort: scheduled_date ascending (earliest first)
  Output: Single post (earliest previewed)

C.1.b — Present for review:
  "📋 Post Review:

   📌 'Why I turned down PWC to bet on myself'
   📅 Mar 17, 09:00 AM IST
   🎯 Pillar: Career | Score: 143/160

   ────────────────────
   [Full formatted post in code block]
   ────────────────────

   📊 Format Check:
   - Characters: 1,542 / 3,000 ✅
   - Emojis: 3 / 3 max ✅
   - Hashtags: 4 (3-6 range) ✅
   - Hook: Question type
   - CTA: Reflection type

   Approve karna hai, ya changes chahiye?"

C.1.c — Edge cases:
  - No previewed posts → "Koi previewed post nahi hai. Format karo pehle?"
  - Multiple previewed → auto-pick earliest, show count: "3 posts review ke liye ready — pehle wala dikha raha"
  - User says "next" → fetch next previewed post

Next: C.2
```

### C.2 — Review Decision
```
Agent: Content Reviewer
Purpose: User makes final quality decision

Sub-steps:

C.2.a — Quality checklist (agent-assisted):
  Agent highlights any concerns against checklist:
  ┌─────────────────────────────────────┐
  │ ✅ Hook compelling (first 2 lines)  │
  │ ✅ Personal experience present      │
  │ ✅ CTA drives engagement            │
  │ ✅ Formatting rules followed        │
  │ ✅ Hashtags relevant (3-6)          │
  │ ✅ Character count in range         │
  │ ⚠️ No data/stats used (optional)   │
  └─────────────────────────────────────┘

C.2.b — User decision:

  APPROVE ("haan", "approve", "ship it", "ready"):
    n8n call: SMA/Data/Write/UpdatePost
    Input: {
      "post_id": post._id,
      "updates": {
        "status": "Ready_ToPublish",
        "review_metadata": {
          "reviewed_at": now,
          "decision": "approved",
          "review_notes": null,
          "review_iteration": N
        }
      }
    }
    → "✅ Post approved! Ready to publish on Mar 17."
    → Next actions: "Publish karo?" → D | "Next review?" → C.1 | "Done" → exit

  REJECT — FORMATTING ("format fix karo", "emoji zyada hai", "formatting issue"):
    n8n call: SMA/Data/Write/UpdatePost
    Input: {
      "post_id": post._id,
      "updates": {
        "status": "Formatting",
        "review_metadata": {
          "reviewed_at": now,
          "decision": "rejected_format",
          "review_notes": "user feedback here"
        }
      }
    }
    → "↩️ Sent back to formatting. Run F workflow to fix."
    → Loop: C → F → C

  REJECT — CONTENT ("hook weak hai", "rewrite karo", "content change"):
    n8n call: SMA/Data/Write/UpdatePost
    Input: {
      "post_id": post._id,
      "updates": {
        "status": "Drafting",
        "review_metadata": {
          "reviewed_at": now,
          "decision": "rejected_content",
          "review_notes": "user feedback here"
        }
      }
    }
    → "↩️ Sent back to drafting. Run B workflow to rework."
    → Loop: C → B → F → C

  MINOR EDIT (user provides small text change):
    Apply change inline, re-present, re-ask
    No status change until user makes final decision

Next: D (if approved) or F/B (if rejected)
```

---

## 5. Execution Flow Diagram

```
User: "Review karo"
│
├─ C.1 ──[C.1.a]──→ n8n: FetchPostById ──→ MongoDB (earliest Previewed)
│   └─ Present formatted post + quality checklist
│
└─ C.2 ── Review Decision
    ├── Approve ──[C.2.b]──→ n8n: UpdatePost (Ready_ToPublish) ──→ D
    ├── Reject Format ──[C.2.b]──→ n8n: UpdatePost (Formatting) ──→ F
    └── Reject Content ──[C.2.b]──→ n8n: UpdatePost (Drafting) ──→ B
```

---

## 6. n8n Calls Per Run

| Scenario | Calls | Breakdown |
|----------|-------|-----------|
| Happy path (approve) | 2 | C.1.a + C.2.b |
| Reject (format or content) | 2 | C.1.a + C.2.b |
| Minor edit + approve | 2 | C.1.a + C.2.b |
| Review multiple posts | 2 × N | Per post: fetch + update |

---

## 7. Dependencies

### Prerequisites
- At least 1 post with status `Previewed` (from F-ContentFormatting)
- FetchPostById and UpdatePost n8n workflows active (built in B phase)

### Build Order
```
1. Update/create step files for C workflow
2. End-to-end test: approve flow
3. End-to-end test: reject-format flow (C→F loop)
4. End-to-end test: reject-content flow (C→B loop)
```

---

## 8. Naming Convention Reference

```
Tier 1 (BMAD Workflow): C (ContentReview)
Tier 2 (Step):          1-2
Tier 3 (n8n Call):      a, b

Steps:
  C.1 — Fetch Post for Review
  C.2 — Review Decision

n8n Calls:
  C.1.a — FetchPostById (existing)
  C.2.b — UpdatePost (existing)
```

---

## 9. File References

| File | Path |
|------|------|
| This plan | `plans/C-content-review-plan.md` |
| BMAD workflow | `workflows/content-review/workflow.md` |
| Step files | `workflows/content-review/steps-c/` |
| Checklist | `workflows/content-review/checklist.md` |
| State machine | `docs/pipeline-state-machine.md` |
