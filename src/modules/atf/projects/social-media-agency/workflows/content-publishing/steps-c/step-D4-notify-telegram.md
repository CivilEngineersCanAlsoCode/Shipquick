# Step D.4 — Notify via Telegram

**Agent:** Content Publisher
**Trigger:** D.3 completed (regardless of whether update succeeded or failed).

---

## What You Do

Send a notification to the SMA control group on Telegram. This keeps the team informed about published content without needing to check dashboards.

---

## Notification Format

Construct the message:

```
=== Post Published ===
Title: [post title]
LinkedIn: https://www.linkedin.com/feed/update/[linkedin_post_urn]
Published At: [published_at]
Status: Published
DB Update: [success/failed]
===
```

If the D.3 update failed, include a warning line:
```
Warning: Database update failed — post is live but record not updated. Manual fix needed.
```

---

## Action

Send the notification via the standard Telegram mechanism configured in the SMA project. The exact webhook or method depends on the n8n Telegram integration.

---

## After Sending

**If notification sent successfully:**

Tell the user:
> "Telegram notification sent to the SMA control group. All done!"

**If notification fails:**

Tell the user:
> "Telegram notification couldn't be sent — but the post is published and records are updated. No action needed, just FYI."

Log the error for debugging but do NOT fail the workflow. Telegram is informational only.

---

## Workflow Complete

After D.4, the content-publishing workflow is done. Summarize the full run to the user:

> **Publish Summary:**
> - Post: [title]
> - LinkedIn: [URL]
> - Published At: [timestamp]
> - Delay Applied: [X] minutes
> - Status: Published
> - Telegram: [sent/failed]
>
> "Next up: the E (Analytics Review) workflow will track performance. You're all set!"

---

## What NOT to Do

- Do NOT fail the workflow if Telegram notification fails — it's informational only
- Do NOT include sensitive data in the Telegram message (no auth tokens, no internal IDs beyond post_id)
- Do NOT send the notification before D.3 — the status update should happen first
- Do NOT skip this step even if D.3 failed — the team needs to know about the publish either way
