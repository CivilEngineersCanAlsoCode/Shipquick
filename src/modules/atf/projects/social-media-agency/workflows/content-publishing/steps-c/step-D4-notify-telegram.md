# Step D.4 — Notify via Telegram

**Agent:** Content Publisher (Relay)
**Trigger:** D.3 completed (regardless of whether the database update succeeded or failed).

---

## What You Do

Send a publish confirmation to the SMA control group on Telegram. This keeps the team informed about published content in real time, without needing to check dashboards or MongoDB.

---

## Telegram Target

**Chat ID:** `-1003399716516` (SMA control group)

This is the dedicated Telegram group for SMA pipeline notifications. All publish events, errors, and status updates go here.

---

## Action: Call n8n Webhook

**POST** `https://n8n.linkright.in/webhook/sma-notify-telegram`

**Exact Payload:**
```json
{
  "chat_id": "-1003399716516",
  "message": "=== Post Published ===\nTitle: <post title>\nLinkedIn: <linkedin_post_url>\nPublished At: <published_at>\nDelay Applied: <delay_applied> minutes\nStatus: Published\nDB Update: <success/failed>\n==="
}
```

**Full message template (with all fields filled in):**
```
=== Post Published ===
Title: Why Most DevTools Fail at Developer Experience
LinkedIn: https://www.linkedin.com/feed/update/urn:li:share:7307123456789012345
Published At: 2026-03-14T10:30:00Z
Delay Applied: 37 minutes
Status: Published
DB Update: success
===
```

**If D.3 update failed**, append a warning line before the closing `===`:
```
=== Post Published ===
Title: Why Most DevTools Fail at Developer Experience
LinkedIn: https://www.linkedin.com/feed/update/urn:li:share:7307123456789012345
Published At: 2026-03-14T10:30:00Z
Delay Applied: 37 minutes
Status: Published
DB Update: failed
WARNING: Database update failed — post is live but record not updated. Manual fix needed. URN: urn:li:share:7307123456789012345
===
```

**Expected Success Response (HTTP 200):**
```json
{
  "success": true,
  "message_id": 12345
}
```

---

## After Sending

**If notification sent successfully:**

Tell the user:
> "Telegram notification SMA control group mein bhej di. Sab done!"

**If notification fails (non-200, timeout, error):**

Tell the user:
> "Telegram notification nahi ja payi — lekin post published hai aur records updated hain. Koi action nahi chahiye, bas FYI."

Log the error for debugging but do NOT fail the workflow. Telegram is informational only — it does not affect the post or database state.

Do NOT retry. If Telegram is down, the team can check the dashboard.

---

## Workflow Complete — Final Summary

After D.4 (regardless of Telegram success/failure), present the full publish summary to the user:

> **Publish Summary:**
>
> | Field | Value |
> |-------|-------|
> | Post | [title] |
> | LinkedIn | [linkedin_post_url] |
> | URN | [linkedin_post_urn] |
> | Published At | [published_at] |
> | Delay Applied | [delay_applied] minutes |
> | Status | Published |
> | DB Update | [success/failed] |
> | Telegram | [sent/failed] |
>
> "Done! E (Analytics Review) workflow se performance track hoga. Aaj ke liye all set!"

---

## What NOT to Do

- Do NOT fail the workflow if Telegram notification fails — it's informational only
- Do NOT include sensitive data in the Telegram message (no auth tokens, no MongoDB connection strings, no internal credentials)
- Do NOT send the notification before D.3 — the status update should happen first (or at least be attempted)
- Do NOT skip this step even if D.3 failed — the team needs to know about the publish either way
- Do NOT retry Telegram if it fails — log and move on
- Do NOT send to any chat other than `-1003399716516`

---

## Output

This is the final step. No output to pass. The workflow is complete.

**Metrics Reminder:** Run metrics snippet for baseline capture — E (Analytics Review) needs Day 1 metrics as soon as possible after publish.

**Next workflow:** E — Analytics Review (tracks performance metrics of published posts).
