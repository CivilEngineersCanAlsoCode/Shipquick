# Step D.2 — Publish to LinkedIn

**Agent:** Content Publisher (Relay)
**Trigger:** User confirmed a post selection in D.1.

---

## What You Do

Publish the selected post to LinkedIn. This is the most critical step in the entire SMA pipeline. A bad publish cannot be undone programmatically. Follow every guardrail exactly — no exceptions.

---

## Guardrail 1: Duplicate Guard (TWO checks)

Before doing anything else, run both checks. If either fails, STOP.

### Check 1 — Post Status Not Already Published

Verify the selected post's `status` field is still `Ready_ToPublish`.

If `status` is `Published`, `Publish_Failed`, or anything other than `Ready_ToPublish`:
> "Yeh post ka status `[status]` hai — `Ready_ToPublish` nahi. Publish nahi kar sakta. Workflow exit kar raha hoon."

STOP. Do NOT call the publish webhook. Exit the workflow.

### Check 2 — No Post Published Today

Fetch today's published posts to verify no post has already been published today:

**POST** `https://n8n.linkright.in/webhook/sma-fetch-post`

```json
{
  "status": "Published",
  "published_date": "2026-03-14"
}
```

If the response returns any post with `published_at` matching today's date (UTC):
> "Aaj already ek post publish ho chuka hai (`[title]` at [time]). Max 1 post/day rule hai. Kal try karo."

STOP. Do NOT proceed. The user can explicitly override by saying "publish anyway" — but log the override.

### Check 3 — LinkedIn URN Not Already Set

Check the selected post's `linkedin_post_urn` field.

If `linkedin_post_urn` already has a value (not null, not empty string):
> "Is post ka LinkedIn URN pehle se set hai (`[urn]`) — yeh pehle publish ho chuka hai. Duplicate se bachne ke liye skip kar raha hoon."

STOP. Ask the user if they want to go back to D.1 to select a different post, or exit.

**All three checks pass?** Proceed to the random delay.

---

## Guardrail 2: Random Delay

Generate a random delay to make posting times appear natural and non-robotic.

**Formula (exact):**
```
delay_minutes = Math.floor(Math.random() * 61)
```

This gives a random integer between 0 and 60 (inclusive).

Tell the user:
> "Publishing mein **[X] minute ka delay** laga raha hoon taaki timing natural lage. 'Publish now' bolo agar abhi daalna hai."

- If the user says "publish now", "abhi daal do", "skip delay", or similar → skip the delay and proceed immediately.
- Otherwise, wait for the full delay period before calling the publish webhook.
- During the wait, do NOT make any other webhook calls. Just wait.

---

## Action: Call n8n Webhook

**POST** `https://n8n.linkright.in/webhook/sma-publish-linkedin`

**Exact Payload:**
```json
{
  "post_id": "<post_id from selected_post>",
  "content": "<full post content — exactly as approved in Review (C), no modifications>",
  "hashtags": ["#DevTools", "#DX", "#SaaS"],
  "title": "<post title>",
  "topic": "<post topic>",
  "scheduled_date": "<scheduled_date from post>"
}
```

**CRITICAL:** Send the content exactly as it was approved in Review (C). Do NOT reformat, trim, or modify any part of the content or hashtags. What was approved is what gets published.

**Expected Success Response (HTTP 200):**
```json
{
  "success": true,
  "linkedin_post_urn": "urn:li:share:7307123456789012345",
  "linkedin_post_url": "https://www.linkedin.com/feed/update/urn:li:share:7307123456789012345",
  "published_at": "2026-03-14T10:30:00Z"
}
```

---

## One-Shot Rule — ABSOLUTE, NON-NEGOTIABLE

If the publish webhook returns **ANY error** — this includes:
- HTTP non-200 status code (4xx, 5xx)
- Network timeout
- Connection refused
- `success: false` in response body
- Missing `linkedin_post_urn` in response
- Any exception during the call

**Then do the following, in order:**

### 1. Do NOT Retry

Not once. Not ever. Not even if the user asks. The one-shot rule is absolute. If the user insists, explain:
> "One-shot rule hai — LinkedIn publish retry nahi hota. Duplicate post ka risk hai. Error workflow se handle hoga."

### 2. Capture the Error

Store the full error details:
- HTTP status code (if available)
- Error message from response body
- Timestamp of failure

### 3. Mark Post as Publish_Failed

**POST** `https://n8n.linkright.in/webhook/sma-update-post`

```json
{
  "post_id": "<post_id>",
  "status": "Publish_Failed",
  "publish_error": "<error message or HTTP status>",
  "failed_at": "<ISO 8601 timestamp of failure, e.g. 2026-03-14T10:30:00Z>"
}
```

### 4. Inform the User

> "LinkedIn publish FAIL ho gaya. Error: `[error details]`. Post ko `Publish_Failed` mark kar diya hai. One-shot rule ke hisaab se retry nahi hoga. Investigate karo aur manually re-queue karo agar zarurat ho."

### 5. Exit

Do NOT proceed to D.3 or D.4. The workflow ends here for this post. The error workflow handles `Publish_Failed` posts separately.

---

## On Success

If the webhook returns HTTP 200 with `success: true` and a valid `linkedin_post_urn`:

### 1. Store in Working Memory
```
linkedin_post_urn  — from response (e.g. "urn:li:share:7307123456789012345")
linkedin_post_url  — from response (e.g. "https://www.linkedin.com/feed/update/urn:li:share:7307123456789012345")
published_at       — from response, or generate current UTC ISO 8601 if not provided
delay_applied      — the delay in minutes that was applied (or 0 if skipped)
```

### 2. Tell the User
> "Post LIVE hai LinkedIn pe! URN: `[urn]`. Ab records update karta hoon..."

### 3. Proceed to **D.3**

---

## What NOT to Do

- Do NOT retry a failed publish — one-shot rule is absolute
- Do NOT publish if `linkedin_post_urn` already exists — duplicate guard
- Do NOT publish if another post was already published today — 1/day limit
- Do NOT publish if status is not `Ready_ToPublish`
- Do NOT skip the random delay without user explicitly requesting it
- Do NOT fabricate a `linkedin_post_urn` — it MUST come from the API response
- Do NOT proceed to D.3 if publish failed — exit immediately
- Do NOT modify the post content before publishing — publish exactly what was approved
- Do NOT retry even if the user asks — explain the one-shot rule

---

## Output for Next Step

Pass to **D.3**:
```
post_id              — the published post's ID
title                — post title (for Telegram notification)
linkedin_post_urn    — URN from the LinkedIn API response
linkedin_post_url    — full URL from the LinkedIn API response
published_at         — ISO 8601 timestamp of publication
delay_applied        — the random delay in minutes that was applied
```
