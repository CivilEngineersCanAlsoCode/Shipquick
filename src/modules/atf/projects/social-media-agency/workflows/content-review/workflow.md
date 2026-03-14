---
name: content-review
description: Review all scheduled posts before they go live — preview, edit, approve, or reschedule
initWorkflow: './steps-c/step-C1-fetch-scheduled.md'
---

# Content Review

**Goal:** Let user review upcoming scheduled posts and make last-minute changes before n8n auto-publishes them.

**System:** BMAD workflow — interactive. This is the quality gate between formatting and publishing.

**Agent:** Content Strategist (Echo)

---

## Steps

1. **C.1 — Fetch Scheduled** — Fetch all posts with status `Previewed` via `sma-fetch-post`, sort by date, present summary
2. **C.2 — Preview & Decide** — Show formatted preview in code block, user decides: approve / edit / reschedule / drop / send back
3. **C.3 — Apply Minor Edits** — If user chose edit: apply changes, re-validate formatting, re-preview, loop until approved
4. **C.4 — Finalize Review** — Summary of all decisions, retry any failed saves, offer next workflow actions

## Webhooks
| Webhook | Method | Steps |
|---------|--------|-------|
| sma-fetch-post | POST | C.1 |
| sma-update-post | POST | C.2, C.3, C.4 |

## Inputs
- MongoDB `linkedin_posts` collection (status: `Previewed`)

## Outputs
- Approved posts → status `Ready_ToPublish` (n8n auto-publishes via D-ContentPublishing)
- Edited posts → updated `formatted_content` + status `Ready_ToPublish`
- Rescheduled posts → new `scheduled_date` (conflict-checked, 1 post/day max)
- Dropped posts → status `Cancelled`
- Sent-back posts → status `Scheduled_NoDraft` (returns to B-ContentDrafting)
