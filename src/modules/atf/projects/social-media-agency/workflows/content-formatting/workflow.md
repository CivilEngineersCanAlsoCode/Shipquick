---
name: content-formatting
description: Apply LinkedIn-specific formatting rules to drafted posts — staircase layout, UPPERCASE headers, emoji placement, Hindi sentences, code-block preview, user approval.
code: F
initWorkflow: './steps-c/step-F1-pick-drafted-post.md'
---

# F — Content Formatting

**Goal:** Take drafted posts (status = `Drafted`), apply LinkedIn-specific formatting rules (staircase layout, 3-line blocks, UPPERCASE headers, emoji placement, Hindi sentences, character count, readability), generate a code-block preview, and get user approval to advance the post to `Previewed` status.

**System:** This is a BMAD workflow — interactive, human-in-the-loop. The agent applies formatting rules, the user previews and approves (or requests changes). ALL data reads and writes go through n8n webhooks. The agent has ZERO direct DB/API access.

**Scope:** LinkedIn only (v1). Formatting rules are platform-specific — this workflow implements the LinkedIn v1 ruleset.

---

## Steps

| Step | File | Description | Key Webhooks |
|------|------|-------------|--------------|
| F.1 | `step-F1-pick-drafted-post.md` | Fetch posts with status Drafted, user picks one | `sma-fetch-post` |
| F.2 | `step-F2-apply-formatting.md` | Apply all LinkedIn formatting rules to raw draft | (local processing) |
| F.3 | `step-F3-generate-preview.md` | Render formatted post in code block with stats | (local processing) |
| F.4 | `step-F4-user-approval.md` | User approves, requests changes, or rejects | `sma-update-post` |

---

## Flow Summary

```
User: "Format karo" / "Post format do" / starts formatting workflow
  |
  F.1 ---> FetchPost (status=Drafted)
  |          |-- Present list to user (title, topic, date)
  |          |-- User picks one to format
  |          |-- If none found -> exit
  |          |-- On selection -> update status to Formatting
  |
  F.2 ---> Apply ALL formatting rules locally:
  |          |-- Staircase layout
  |          |-- Max 3-line blocks
  |          |-- UPPERCASE headers (sparingly)
  |          |-- Max 3 emojis at tension points
  |          |-- Replace dashes with punctuation
  |          |-- Bullets: " - ", Flows: "A —> B —> C"
  |          |-- Max 3 Hindi sentences at emotional peaks
  |          |-- 800-1600 ASCII characters
  |          |-- FK Grade 7 readability
  |          |-- CTA with positioning + follow
  |          |-- 3-6 hashtags at end
  |          |-- Present formatted version for initial feedback
  |
  F.3 ---> Generate code-block preview
  |          |-- Show exact character count
  |          |-- Show emoji count, Hindi count, hashtag count
  |          |-- Ask user: "Preview theek hai?"
  |
  F.4 ---> User decision:
             |-- Approve -> UpdatePost (status=Previewed), save formatted content
             |-- Changes -> loop back to F.2/F.3
             |-- Reject -> revert status to Drafted, exit
             |-- On approval -> suggest C-Review workflow
```

---

## Webhook Reference

| n8n Workflow Name | Webhook URL | Used In |
|-------------------|-------------|---------|
| SMA/Data/Read/FetchPost | `https://n8n.linkright.in/webhook/sma-fetch-post` | F.1 |
| SMA/Data/Write/UpdatePost | `https://n8n.linkright.in/webhook/sma-update-post` | F.1 (status=Formatting), F.4 (status=Previewed or revert) |

---

## Inputs
- MongoDB: `linkedin_posts` collection (status = `Drafted`)
- Formatting rules: `formatting-rules.csv` (LinkedIn v1 ruleset)
- User decisions at F.2 (initial feedback), F.4 (approve/change/reject)
- Pipeline predecessor: B (Content Drafting) must have finalized the draft

## Outputs
- Formatted LinkedIn post with all rules applied
- Code-block preview shown to user
- Post status updated to `Previewed` in MongoDB
- Formatted content saved to post record
- Ready for C (Content Review) workflow
