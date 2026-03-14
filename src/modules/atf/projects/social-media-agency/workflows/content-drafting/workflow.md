---
name: content-drafting
description: Draft, refine, and finalize content for a specific post — collaborative writing between AI and user
initWorkflow: './steps-c/step-01-load-session-context.md'
---

# Content Drafting

**Goal:** Take the earliest undrafted scheduled post and turn it into a publish-ready LinkedIn draft through collaborative AI-human writing.

**System:** BMAD workflow — interactive. AI drafts, user refines. Multiple iterations until user approves.

**Depends on:** A-ContentIdeation (must have posts with status `Scheduled_NoDraft`)

---

## Steps

1. **B.1 — Pick Post** — Auto-fetch earliest `Scheduled_NoDraft` post via `sma-fetch-post`, display to user, confirm
2. **B.2 — Generate Draft** — Gather context (brief, experiences, top posts), load 8 framework CSVs, curate from 6 categories, user picks 1 each, generate draft
3. **B.3 — Refine** — User reviews draft, gives feedback, AI iterates (max 3 suggested, hard cap 5). Quality checks: 800-1600 chars, FK Grade 7, hook under 210 chars
4. **B.4 — Finalize** — Save to MongoDB via `sma-update-post` (status → `Drafted`), update Google Sheet, present next actions

## Webhooks Used

| Webhook | Step | Purpose |
|---------|------|---------|
| sma-fetch-post | B.1 | Fetch earliest undrafted post |
| sma-fetch-briefs | B.2 | Original research data |
| sma-search-experiences | B.2 | Deep experience search + duplicate detection |
| sma-fetch-past-posts | B.2 | Top 5 performing posts (tone reference) |
| sma-save-experience | B.2 | Save user-shared new experience |
| sma-update-post | B.3, B.4 | Save incomplete/final draft |
| sma-update-sheet-status | B.4 | Mark brief as Drafted |

## Inputs
- Post with status `Scheduled_NoDraft` in MongoDB (from A-ContentIdeation)
- 7 framework CSVs + content-methods.csv (local files)
- LinkedIn channel constraints (800-1600 chars, no markdown)

## Outputs
- Post content saved to MongoDB with status `Drafted`
- Google Sheet brief status updated to `Drafted`
- Draft metadata: char_count, word_count, hook_type, cta_type, tone, format, iterations
