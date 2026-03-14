# Step D.3 — Update Post Status

**Agent:** Content Publisher (Relay)
**Trigger:** D.2 completed successfully — post is live on LinkedIn.

---

## What You Do

Update the post record in MongoDB to reflect its published state. This ensures the rest of the pipeline (E-Analytics, dashboards, duplicate guards) knows the post is live. Four fields are updated: `status`, `published_at`, `linkedin_post_urn`, and `linkedin_post_url`.

---

## Action: Call n8n Webhook

**POST** `https://n8n.linkright.in/webhook/sma-update-post`

**Exact Payload:**
```json
{
  "post_id": "<post_id from D.2>",
  "status": "Published",
  "published_at": "<ISO 8601 timestamp from D.2, e.g. 2026-03-14T10:30:00Z>",
  "linkedin_post_urn": "<URN from D.2, e.g. urn:li:share:7307123456789012345>",
  "linkedin_post_url": "<URL from D.2, e.g. https://www.linkedin.com/feed/update/urn:li:share:7307123456789012345>"
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
> "Post record updated — status ab `Published` hai, URN aur timestamp save ho gaye."

Proceed to **D.4**.

**If update fails (non-200, error in response, timeout):**

This is a **non-critical failure**. The post is already live on LinkedIn — the publish cannot be undone.

Tell the user:
> "Warning: Post LinkedIn pe LIVE hai, lekin database record update nahi ho paya. Error: `[details]`. Dashboard mein `Published` nahi dikhega jab tak manually fix nahi hota."
>
> "LinkedIn URN: `[urn]` — yeh save kar lo agar manual fix karna pade."

**Retry once** after 5 seconds. If it fails again:
> "Retry bhi fail ho gaya. n8n workflow `SMA/Data/Write/UpdatePost` check karo. Post live hai, D.4 (Telegram notification) pe proceed kar raha hoon."

Log the error details and proceed to D.4 anyway — the team notification should still go out.

---

## Verification (Optional)

After a successful update, optionally verify by re-fetching the post:

**POST** `https://n8n.linkright.in/webhook/sma-fetch-post`

```json
{
  "post_id": "<post_id>"
}
```

Confirm that:
- `status` is `Published`
- `linkedin_post_urn` matches the URN from D.2
- `linkedin_post_url` is set
- `published_at` is set and matches

If verification fails, warn the user but still proceed to D.4. The post is live regardless.

---

## What NOT to Do

- Do NOT rollback or delete the LinkedIn post if the update fails — it's already live, there is no undo
- Do NOT skip this step — downstream workflows (E-Analytics) depend on the `Published` status and `linkedin_post_urn`
- Do NOT overwrite fields other than `status`, `published_at`, `linkedin_post_urn`, and `linkedin_post_url`
- Do NOT block the entire workflow if the update fails — proceed to D.4
- Do NOT fabricate any field values — all must come from the D.2 response

---

## Output for Next Step

Pass to **D.4**:
```
post_id            — the post ID
title              — the post title
linkedin_post_urn  — the LinkedIn URN
linkedin_post_url  — the full LinkedIn URL
published_at       — the publication timestamp
delay_applied      — the random delay that was applied (minutes)
update_status      — "success" or "failed" (so D.4 can include a warning if needed)
```
