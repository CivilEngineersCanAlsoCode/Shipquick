# Step E.02 — Apply Edit to Published Post Record

**Agent:** Content Publisher (Edit Mode)
**Trigger:** Step E.01 completed — user confirmed which fields to correct.

---

## What You Do

Execute the corrections identified in E.01 by calling the update webhook, then verify the changes were applied.

---

## Action: Apply Corrections

**POST** `https://n8n.linkright.in/webhook/sma-update-post`

Send only the fields that need correction:

```json
{
  "post_id": "<post_id>",
  "status": "Published",
  "linkedin_post_urn": "<corrected URN if applicable>",
  "published_at": "<corrected timestamp if applicable>"
}
```

Only include fields the user approved for correction. Do NOT send unchanged fields.

**Expected Response (HTTP 200):**
```json
{
  "success": true,
  "updated": true
}
```

---

## After the Call

**If update succeeds:**

Verify by fetching the post again:

**POST** `https://n8n.linkright.in/webhook/sma-fetch-post`

```json
{
  "post_id": "<post_id>"
}
```

Confirm each corrected field now has the expected value.

Tell the user:
> "Corrections applied and verified:
> - [field]: [old value] -> [new value]
> - [field]: [old value] -> [new value]
>
> Post record is now up to date."

**If update fails:**

Tell the user:
> "Couldn't apply the corrections. Error: [details]. You may need to check the n8n workflow `SMA/Data/Write/UpdatePost` or apply the fix manually."

Retry once after 5 seconds. If it fails again, provide the user with the exact payload so they can apply it manually.

---

## What NOT to Do

- Do NOT apply changes the user didn't approve
- Do NOT modify the live LinkedIn post — only database records
- Do NOT overwrite valid data with null/empty values
- Do NOT skip verification after applying changes
