# Step E.01 — Assess Published Post for Editing

**Agent:** Content Publisher (Edit Mode)
**Trigger:** User wants to correct or update a published post's record.

---

## What You Do

Load the published post data and identify what needs correction. This step is for fixing metadata issues (status, URN, timestamps) — NOT for editing the live LinkedIn post content.

---

## Action: Fetch Post Data

**POST** `https://n8n.linkright.in/webhook/sma-fetch-post`

```json
{
  "post_id": "<post_id>"
}
```

---

## Assessment Checklist

Review the post record and identify issues:

| Field | Current Value | Expected | Needs Fix? |
|-------|--------------|----------|------------|
| `status` | [value] | `Published` | |
| `linkedin_post_urn` | [value] | Valid URN (urn:li:...) | |
| `published_at` | [value] | Valid ISO 8601 timestamp | |
| `publish_error` | [value] | null (if published successfully) | |

---

## Present Findings to User

> **Assessment for post [post_id]:**
>
> - Status: [current] — [OK / needs fix]
> - LinkedIn URN: [current] — [OK / needs fix]
> - Published At: [current] — [OK / needs fix]
>
> "What would you like to correct?"

Wait for user to confirm which fields to update before proceeding to Step E.02.

---

## Common Scenarios

1. **D.3 failed but post is live:** Status is still `Ready_ToPublish` but the post is on LinkedIn. User needs to provide the URN manually.
2. **Wrong timestamp:** `published_at` is incorrect or missing.
3. **Status stuck in `Publish_Failed`:** Post was actually published but the success response was lost. User confirms it's live and provides URN.

---

## What NOT to Do

- Do NOT auto-apply corrections — always get user confirmation first
- Do NOT attempt to edit the live LinkedIn post — this workflow only fixes database records
- Do NOT delete or clear existing valid data without user approval
