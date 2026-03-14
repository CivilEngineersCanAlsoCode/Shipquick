# Step A.8 — Save

**Agent:** Content Strategist  
**Runs After:** A.7 (user confirmed schedule)

---

## What You Do

Save each confirmed scheduled post to MongoDB, then to Notion, then mark the source briefs as "Used" in the Google Sheet. Then give the user a final summary and next-step options.

---

## Process ALL Posts in Sequence

For each post in `scheduled_posts[]`, execute A.8.a, A.8.b in order. Then do A.8.c for ALL posts together at the end.

Do NOT skip any save step — all three must complete for a successful run.

---

## ACTION A.8.a — Save to MongoDB (per post)

**POST** `https://n8n.linkright.in/webhook/sma-save-post`

```json
{
  "title": "[post.topic]",
  "channel": "linkedin",
  "content_pillar": "[post.content_pillar]",
  "scheduled_date": "[post.scheduled_date]",
  "scheduled_time": "[post.scheduled_time]",
  "timezone": "[post.timezone]",
  "status": "Scheduled_NoDraft",
  "scores": {
    "freshness": "[post.scores.freshness]",
    "personal_experience": "[post.scores.personal_experience]",
    "research_quality": "[post.scores.research_quality]",
    "total": "[post.scores.total]"
  },
  "source_brief_id": "[post.row_id]",
  "linked_experiences": "[post.linked_experiences]",
  "additional_context": "[post.additional_context]"
}
```

**Expected Response:** `{ "success": true, "_id": "ObjectId" }`

Store the returned `_id` as `mongo_id` for this post.

**On failure:**
> "MongoDB mein save nahi ho paya: [topic]"

Retry once. If still failing:
> "MongoDB save fail ho raha hai — `SMA/Data/Write/SavePost` n8n workflow check karo. Is post ko skip karein aur baaki save karein? (haan/nahi)"

Do NOT proceed to Notion save for a post that failed MongoDB save (the IDs won't be consistent).

---

## ACTION A.8.b — Save to Notion (per post)

**POST** `https://n8n.linkright.in/webhook/sma-save-to-notion`

```json
{
  "database_id": "cc01482c-cd34-83ac-81a8-013e4d767924",
  "title": "[post.topic]",
  "channel": "LinkedIn",
  "go_live_date": "[post.scheduled_date]",
  "status": "Scheduled - No Draft",
  "content_pillar": "[post.content_pillar as Title Case]"
}
```

Note: `content_pillar` must be Title Case for Notion select field — e.g., "career" → "Career", "pm" → "PM", "hottake" → "Hot Take", "howto" → "How To".

**Expected Response:** `{ "success": true, "page_id": "..." }`

Store the returned `page_id`.

**On failure:**
> "Notion mein save nahi hua: [topic]"

Retry once. If still failing:
> "Notion save fail — content calendar mein manually add karna padega: [topic] on [date]"

Do NOT block the overall workflow on a Notion failure — MongoDB is the source of truth. Log the failure and continue.

---

## ACTION A.8.c — Mark Briefs as Used in Google Sheet (all posts together)

After ALL posts are saved (or attempted), update the Google Sheet in one batch call:

**POST** `https://n8n.linkright.in/webhook/sma-update-sheet-status`

```json
{
  "action": "mark_used",
  "rows": [
    {
      "row_id": "[post.row_id]",
      "status": "Used",
      "used_for": "[post.topic]",
      "scheduled_date": "[post.scheduled_date]"
    }
  ]
}
```

Include all successfully saved posts in this batch (even if Notion failed — MongoDB save is sufficient).

**Expected Response:** `{ "success": true, "updated": N }`

**On failure:**
> "Google Sheet mein 'Used' mark nahi ho paye — manually update kar lena baad mein."

Do NOT block — this is a cleanup step. Warn and continue.

---

## Final Summary

After all saves complete, show a clean summary:

> "✅ **Content plan ready hai!**
> 
> **Saved posts:**
> 📌 [Day, Date] — [topic] ([content_pillar])
> 📌 [Day, Date] — [topic] ([content_pillar])
> 📌 [Day, Date] — [topic] ([content_pillar])
> 
> MongoDB: ✅ | Notion: ✅ | Sheet: ✅
> 
> [If any failures, list them here]
> 
> **Aage kya?**
> 1. Draft likhna shuru karein (Content Drafting → B)
> 2. Baad mein (exit)
> 3. Aur ideas chahiye (restart A.1)"

---

## Error Handling Summary

| Action | On Failure | Blocking? |
|--------|-----------|-----------|
| sma-save-post (MongoDB) | Retry once, then ask user | YES — don't save to Notion for this post |
| sma-save-to-notion | Retry once, warn & continue | NO — MongoDB is source of truth |
| sma-update-sheet-status (mark_used) | Warn user, continue | NO |

---

## What NOT to Do

- ❌ Do NOT save to Notion before MongoDB — MongoDB is the source of truth
- ❌ Do NOT mark briefs as "Used" in the Sheet if their MongoDB save failed
- ❌ Do NOT invent or modify content at this stage — save exactly what was confirmed in A.7
- ❌ Do NOT set status to anything other than `"Scheduled_NoDraft"` in MongoDB
- ❌ Do NOT set status to anything other than `"Scheduled - No Draft"` in Notion
- ❌ Do NOT combine all posts into a single SavePost call — save each post individually

---

## Workflow Complete

This is the final step of **A-ContentIdeation**.

If user chooses option 1 (draft now) → hand off to **B-ContentDrafting** workflow.  
If user chooses option 3 (more ideas) → restart from **A.1**.  
Otherwise → workflow ends cleanly.
