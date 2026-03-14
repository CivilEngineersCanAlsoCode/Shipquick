# Step D.2 — Publish to LinkedIn

**Agent:** Content Publisher
**Trigger:** User confirmed a post selection in D.1.

---

## What You Do

Publish the selected post to LinkedIn. This is the most critical step in the workflow. Follow every guardrail exactly.

---

## Guardrail 1: Duplicate Guard

Before doing anything else, check the selected post's `linkedin_post_urn` field.

**If `linkedin_post_urn` already has a value:**
> "This post already has a LinkedIn URN (`[urn]`) — it's been published before. Skipping to avoid a duplicate post."

SKIP this post entirely. Do NOT call the publish webhook. Ask the user if they want to select a different post (go back to D.1) or exit.

**If `linkedin_post_urn` is null/empty:** Proceed.

---

## Guardrail 2: Random Delay

Generate a random integer between 0 and 60 (inclusive). This is the delay in minutes before publishing.

Tell the user:
> "Applying a **[X]-minute delay** before publishing to keep timing natural. Say 'publish now' if you want to skip the wait."

- If the user says to publish now (or similar), skip the delay and proceed immediately.
- Otherwise, wait for the delay period before making the publish call.

---

## Action: Call n8n Webhook

**POST** `https://n8n.linkright.in/webhook/sma-publish-linkedin`

```json
{
  "post_id": "<post_id>",
  "content": "<full post content>",
  "hashtags": ["<hashtag1>", "<hashtag2>", "..."]
}
```

**Expected Success Response (HTTP 200):**
```json
{
  "success": true,
  "linkedin_post_urn": "urn:li:share:1234567890",
  "published_at": "2026-03-14T10:30:00Z"
}
```

---

## One-Shot Rule

This rule is absolute and non-negotiable.

**If the publish webhook returns ANY error** (non-200 status, timeout, network error, API error in response body):

1. Do NOT retry. Not once. Not ever.
2. Capture the error message/code.
3. Mark the post as `Publish_Failed` by calling the update webhook:

   **POST** `https://n8n.linkright.in/webhook/sma-update-post`
   ```json
   {
     "post_id": "<post_id>",
     "status": "Publish_Failed",
     "publish_error": "<error message>",
     "failed_at": "<ISO 8601 timestamp>"
   }
   ```

4. Tell the user:
   > "LinkedIn publish failed. Error: [error details]. This post has been marked as Publish_Failed. Per the one-shot rule, I won't retry. You can investigate and re-queue it manually if needed."

5. Do NOT proceed to D.3 or D.4. Exit the workflow.

---

## On Success

If the webhook returns HTTP 200 with a valid `linkedin_post_urn`:

1. Store in working memory:
   - `linkedin_post_urn` from response
   - `published_at` — use the response timestamp, or generate current ISO 8601 if not provided
   - `delay_applied_minutes` — the delay that was used

2. Tell the user:
   > "Post is LIVE on LinkedIn! URN: `[urn]`. Updating the records now..."

3. Proceed to **D.3**.

---

## What NOT to Do

- Do NOT retry a failed publish — one-shot rule is absolute
- Do NOT publish if `linkedin_post_urn` already exists — duplicate guard
- Do NOT skip the random delay without user explicitly requesting it
- Do NOT fabricate a `linkedin_post_urn` — it must come from the API response
- Do NOT proceed to D.3 if publish failed
- Do NOT modify the post content before publishing — publish exactly what was approved in Review (C)

---

## Output for Next Step

Pass to **D.3**:
```
post_id — the published post's ID
linkedin_post_urn — URN from the LinkedIn API response
published_at — ISO 8601 timestamp of publication
delay_applied_minutes — the random delay that was applied
```
