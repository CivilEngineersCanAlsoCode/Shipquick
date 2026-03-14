# Step B.4 — Finalize & Save

**Agent:** Content Strategist
**Runs After:** B.3 (user approved the final draft)

---

## What You Do

You save the finalized draft to MongoDB via the `sma-update-post` webhook, update the Google Sheet status, and present next actions to the user. This is the completion step — two webhook calls, then done.

---

## PART 1: Save Draft to MongoDB (B.4.a)

**POST** `https://n8n.linkright.in/webhook/sma-update-post`

```json
{
  "post_id": "[selected_post._id]",
  "updates": {
    "content": "[final approved draft text]",
    "status": "Drafted",
    "draft_metadata": {
      "word_count": 287,
      "char_count": 1542,
      "hook_type": "question",
      "cta_type": "open_question",
      "hashtags": ["#career", "#decisions", "#PM"],
      "iterations": 3,
      "tone": "casual_witty",
      "format": "story_insight",
      "positioning": "PM by day. Builder by night.",
      "engagement_inspiration": ["top_post_id_1", "top_post_id_2"],
      "experiences_used": ["exp_id_1", "exp_id_2"]
    },
    "updated_at": "[ISO timestamp]"
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "modified_count": 1
}
```

**If call succeeds:** Continue to PART 2.

**If call fails:**
> "MongoDB mein draft save nahi ho paya. Retry karta hoon..."

Retry once after 5 seconds. If retry also fails:
> "Save fail ho gaya. Draft text copy kar lo:
> ```
> [full draft text]
> ```
> Satvik, `SMA/Data/Write/UpdatePost` n8n workflow check karo. Draft manually save karna padega."

Do NOT proceed to PART 2 if PART 1 fails — the post must be saved before marking the sheet.

---

## PART 2: Update Google Sheet Status (B.4.b)

**POST** `https://n8n.linkright.in/webhook/sma-update-sheet-status`

```json
{
  "action": "update_status",
  "rows": [
    {
      "row_id": "[selected_post.source_brief_id]",
      "status": "Drafted",
      "reason": "Draft complete, scheduled for [selected_post.scheduled_date]"
    }
  ]
}
```

**Expected Response:** `{ "success": true, "updated": 1 }`

**If source_brief_id is null/missing:** Skip this call entirely. Not all posts originate from the Google Sheet.

**If call fails:**
> "Sheet update nahi ho payi, lekin MongoDB mein draft save ho chuka hai. Sheet manually update karna — row [source_brief_id] ka status 'Drafted' karo."

Do NOT block on this failure — the critical save (MongoDB) already succeeded.

---

## PART 3: Confirmation & Next Actions (B.4.c)

After both calls complete (or PART 1 succeeds + PART 2 skipped/failed):

> "Post saved!
>
> '[selected_post.title]'
> Scheduled: [scheduled_date], [scheduled_time] IST
> Status: Drafted
> Characters: [char_count] | Words: [word_count]
>
> Next?
> 1. 'Next post draft karo' — pick next undrafted post (B.1)
> 2. 'Format karo' — apply LinkedIn formatting (F-ContentFormatting)
> 3. 'Review posts' — review all drafted posts (C-ContentReview)
> 4. 'Done for now' — exit"

### User Responses

**"Next post" / "1" / "aur draft":**
→ Clear draft state → restart at **B.1**

**"Format" / "2" / "formatting":**
→ Transition to **F-ContentFormatting** workflow with this post

**"Review" / "3":**
→ Transition to **C-ContentReview** workflow

**"Done" / "4" / "bas":**
> "Chal rahe hain! Draft ready hai — jab formatting karna ho toh bol dena."
→ Exit workflow

---

## Error Handling Summary

| Webhook | On Failure | Impact |
|---------|-----------|--------|
| sma-update-post (B.4.a) | Retry once. If fails again: show draft text for manual copy | BLOCKING — do not proceed without MongoDB save |
| sma-update-sheet-status (B.4.b) | Warn user, continue | Non-blocking — MongoDB is the source of truth |

---

## What NOT to Do

- Do NOT proceed to sheet update if MongoDB save failed — MongoDB is the source of truth
- Do NOT change status to anything other than `Drafted` — the plan specifies this exact status
- Do NOT modify the draft text during save — save exactly what the user approved
- Do NOT lose the draft if save fails — always show the text for manual copy
- Do NOT auto-transition to the next workflow — ask the user what they want to do
- Do NOT save to Notion (v1 does not use Notion for writes)
- Do NOT include formatting rules in the saved draft — formatting happens in F-ContentFormatting
- Do NOT forget to include `updated_at` in the update payload

---

## Output

This is the final step of B-ContentDrafting. Output depends on user's choice:
```
Option 1 → B.1: Clear state, start fresh post pick
Option 2 → F-ContentFormatting: Pass { post_id, content, draft_metadata }
Option 3 → C-ContentReview: Pass { post_id }
Option 4 → Exit: No output
```
