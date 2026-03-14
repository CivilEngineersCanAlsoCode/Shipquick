# Step D.3 — Update Post Status

**Agent:** Content Publisher
**Trigger:** D.2 completed successfully — post is live on LinkedIn.

---

## What You Do

Update the post record in the database to reflect its published state. This ensures the rest of the pipeline (Analytics, dashboards, etc.) knows the post is live.

---

## Action: Call n8n Webhook

**POST** `https://n8n.linkright.in/webhook/sma-update-post`

```json
{
  "post_id": "<post_id>",
  "status": "Published",
  "linkedin_post_urn": "<urn from D.2>",
  "published_at": "<ISO 8601 timestamp from D.2>"
}
```

**Expected Success Response (HTTP 200):**
```json
{
  "success": true,
  "updated": true
}
```

---

## After the Call

**If update succeeds (HTTP 200, success: true):**

Tell the user:
> "Post record updated — status is now `Published`, URN and timestamp saved."

Proceed to **D.4**.

**If update fails (non-200, error in response, timeout):**

This is a non-critical failure. The post is already live on LinkedIn. Inform the user clearly:

> "Warning: The post is LIVE on LinkedIn, but I couldn't update the database record. Error: [details]. The post won't show as Published in the dashboard until this is fixed."
>
> "You may need to manually update the record or re-run this step later. The LinkedIn post URN is: `[urn]`."

Retry once after 5 seconds. If it fails again, log the details and proceed to D.4 anyway — the Telegram notification should still go out.

**Critical:** Do NOT attempt to rollback or delete the LinkedIn post. It's live. There is no undo.

---

## Verification

After a successful update, optionally verify by fetching the post again:

**POST** `https://n8n.linkright.in/webhook/sma-fetch-post`

```json
{
  "post_id": "<post_id>"
}
```

Confirm that:
- `status` is `Published`
- `linkedin_post_urn` matches what was saved
- `published_at` is set

If verification fails, warn the user but still proceed to D.4.

---

## What NOT to Do

- Do NOT rollback the LinkedIn post if the update fails — it's already live
- Do NOT skip this step — downstream workflows (E-Analytics) depend on the updated status
- Do NOT overwrite fields other than `status`, `linkedin_post_urn`, and `published_at`
- Do NOT block the workflow if update fails — proceed to D.4

---

## Output for Next Step

Pass to **D.4**:
```
post_id — the post ID
title — the post title
linkedin_post_urn — the LinkedIn URN
published_at — the publication timestamp
update_status — "success" or "failed" (for Telegram notification context)
```
