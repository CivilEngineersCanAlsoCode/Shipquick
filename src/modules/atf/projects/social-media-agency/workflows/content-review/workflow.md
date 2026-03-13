---
name: content-review
description: Review all scheduled posts before they go live — preview, edit, approve, or reschedule
initWorkflow: './steps-c/step-01-fetch-scheduled.md'
---

# Content Review

**Goal:** Let user review upcoming scheduled posts and make last-minute changes before n8n auto-publishes them.

**System:** BMAD workflow — interactive. This is the quality gate between drafting and publishing.

---

## Steps

1. **Fetch Scheduled** — Get all "Ready to Publish" posts from Notion
2. **Preview** — Show each post with full content, channel, date
3. **Decide** — For each post: Approve / Edit / Reschedule / Delete
4. **Apply Changes** — Update Notion based on decisions

## Inputs
- Notion Content Calendar (status: "Ready to Publish")

## Outputs
- Approved posts remain "Ready to Publish" (n8n will post them)
- Edited posts get updated content
- Rescheduled posts get new dates
- Deleted posts get archived
