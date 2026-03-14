# Content Publishing — Execution Instructions

## Overview

This workflow handles the final mile — getting approved posts onto LinkedIn. By the time a post reaches this workflow, it has already been through Ideation (A), Drafting (B), Formatting (F), and Review (C). The post status is `Ready_ToPublish`.

Your job: publish it safely, update the records, and notify the team.

---

## Pre-requisites

Before starting this workflow, confirm:

1. **Post status is `Ready_ToPublish`** — if it's anything else, do NOT publish. Send it back to the appropriate workflow.
2. **The post came through C (Content Review)** — it must have been explicitly approved.
3. **No post has already been published today** — max 1 post/day rule (v1).
4. **You have ZERO direct DB/API access** — every read and write goes through n8n webhooks.

---

## Step-by-Step Execution

### Step D.1 — Fetch Ready Posts

Call the fetch webhook to get all posts ready for publishing.

**POST** `https://n8n.linkright.in/webhook/sma-fetch-post`

```json
{
  "status": "Ready_ToPublish"
}
```

- If the response contains posts, present them to the user in a clean summary (title, topic, scheduled date).
- Let the user confirm which post to publish. Do NOT auto-select.
- If no posts are found, inform the user and exit the workflow gracefully.
- If the webhook fails, retry once after 5 seconds. If it fails again, ask the user to check the n8n workflow.

### Step D.2 — Publish to LinkedIn

This is the critical step. Follow these guardrails strictly:

**Duplicate Guard:**
Before publishing, check if the selected post already has a `linkedin_post_urn` field with a value. If it does, the post has already been published. SKIP it. Tell the user:
> "This post already has a LinkedIn URN — it's been published before. Skipping to avoid duplicate."

**Random Delay:**
Generate a random delay between 0 and 60 minutes. This makes posting times appear natural and non-robotic. Inform the user:
> "Applying a [X]-minute delay before publishing to keep timing natural. You can say 'publish now' to skip the delay."

If the user wants to override, publish immediately. Otherwise, wait for the delay period.

**Publish Call:**

**POST** `https://n8n.linkright.in/webhook/sma-publish-linkedin`

Send the full post content as the payload. The exact payload structure depends on what the n8n workflow expects (typically: `post_id`, `content`, `hashtags`, etc.).

**One-Shot Rule:**
This is non-negotiable. If the LinkedIn API returns an error (non-200 response, timeout, or any failure):
- Do NOT retry. Not once. Not ever.
- Mark the post status as `Publish_Failed` via the update webhook.
- Inform the user with the exact error message.
- Log the error details for debugging.
- Exit the publish flow for this post.

**On Success:**
- Capture the `linkedin_post_urn` from the response.
- Store it in working memory for the next step.
- Inform the user that the post is now live.

### Step D.3 — Update Post Status

After a successful publish, update the post record.

**POST** `https://n8n.linkright.in/webhook/sma-update-post`

```json
{
  "post_id": "<post_id>",
  "status": "Published",
  "linkedin_post_urn": "<urn from D.2 response>",
  "published_at": "<ISO 8601 timestamp>"
}
```

- Verify the webhook returns a success response.
- If the update fails, warn the user but do NOT attempt to rollback the LinkedIn post (it's already live — you can't un-publish).
- The post is live regardless of whether this update succeeds. Make that clear to the user if there's an issue.

### Step D.4 — Telegram Notification

Send a notification to the SMA control group via Telegram.

**Notification format:**
```
Published: [Post Title]
LinkedIn: https://www.linkedin.com/feed/update/[linkedin_post_urn]
Time: [published_at]
Status: Published
```

- If the Telegram notification fails, log a warning but do NOT fail the entire workflow. The post is already published and status is already updated — Telegram is informational only.

---

## Error Handling Summary

| Step | Error | Action |
|------|-------|--------|
| D.1 | Webhook fails | Retry once, then ask user to check n8n |
| D.1 | No posts found | Inform user, exit gracefully |
| D.2 | Duplicate URN found | SKIP post, inform user |
| D.2 | LinkedIn API error | Do NOT retry. Mark Publish_Failed. Inform user. |
| D.2 | Timeout | Treat as failure. One-shot rule applies. |
| D.3 | Update webhook fails | Warn user. Post is still live. Do not rollback. |
| D.4 | Telegram fails | Log warning. Workflow still succeeds. |

---

## What NOT to Do

- Do NOT retry a failed LinkedIn publish — one-shot rule is absolute.
- Do NOT publish a post that doesn't have `Ready_ToPublish` status.
- Do NOT publish more than 1 post per day.
- Do NOT auto-select which post to publish — always let the user choose.
- Do NOT fabricate a `linkedin_post_urn` if the API didn't return one.
- Do NOT attempt to delete or rollback a LinkedIn post if a later step fails.
- Do NOT skip the duplicate guard check.
- Do NOT skip the random delay without user explicitly requesting it.
- Do NOT access any database or API directly — everything goes through webhooks.
- Do NOT proceed to D.3 if D.2 failed — the post isn't published.
