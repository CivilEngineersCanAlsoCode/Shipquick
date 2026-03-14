# Content Review — Quality Checklist

## Pre-Execution Checks (4)

- [ ] At least 1 post exists with status `Previewed` in MongoDB
- [ ] n8n webhooks active (FetchPost, UpdatePost)
- [ ] User is available for interactive review decisions
- [ ] No posts with `scheduled_date` in the past (flag if found)

## Review Process (5)

- [ ] Posts presented in chronological order (soonest first)
- [ ] Full content shown in code block preview for each post
- [ ] Metadata displayed: topic, pillar, date, time, channel, frameworks
- [ ] User explicitly chose one of: Approve / Edit / Reschedule / Drop
- [ ] No post skipped without a decision

## Decision Validation (6)

- [ ] **Approved posts:** Status updated to `Ready_ToPublish` in MongoDB
- [ ] **Edited posts:** Updated `draft_content` saved to MongoDB, user confirmed the edit
- [ ] **Rescheduled posts:** New `scheduled_date` has no conflicts with other posts
- [ ] **Dropped posts:** Status updated to `Cancelled` in MongoDB
- [ ] Major edits flagged for re-drafting (sent back to B-ContentDrafting if needed)
- [ ] All webhook calls to `sma-update-post` returned success

## Post-Execution Checks (4)

- [ ] All previewed posts have been reviewed (none left in `Previewed` status)
- [ ] Summary shown: count of approved, edited, rescheduled, dropped
- [ ] User offered next actions (draft, ideate, exit)
- [ ] No post left in ambiguous state (every post has a clear status)

## Safety Checks (3)

- [ ] No post approved without user seeing the full content preview
- [ ] Approved posts will auto-publish — user understands this is the last checkpoint
- [ ] Date conflicts checked before rescheduling (1 post per day max)
