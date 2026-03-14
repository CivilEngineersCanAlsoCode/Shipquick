# Content Publishing — Quality Checklist

Use this checklist to validate every publish run. All items must PASS before the workflow is considered complete.

---

## Pre-Publish Checks

| # | Check | Expected | PASS/FAIL |
|---|-------|----------|-----------|
| 1 | Post status is `Ready_ToPublish` | Yes | |
| 2 | Post content length is 800-1600 characters | Within range | |
| 3 | Post does NOT already have a `linkedin_post_urn` (duplicate guard) | No existing URN | |
| 4 | Hashtags present (3-6 hashtags) | 3-6 hashtags found | |
| 5 | CTA (Call to Action) present in post content | CTA found | |
| 6 | No other post published today (max 1/day rule) | No same-day publish | |
| 7 | Post came through C (Review) pipeline | Review-approved | |

---

## Publish Checks

| # | Check | Expected | PASS/FAIL |
|---|-------|----------|-----------|
| 8 | Publish webhook returned HTTP 200 | 200 OK | |
| 9 | Response contains `linkedin_post_urn` | URN present | |
| 10 | Random delay was applied (or user explicitly overrode) | Delay applied or overridden | |
| 11 | One-shot rule respected (no retries on failure) | No retries attempted | |

---

## Post-Publish Checks

| # | Check | Expected | PASS/FAIL |
|---|-------|----------|-----------|
| 12 | Post status updated to `Published` | Status = Published | |
| 13 | `published_at` timestamp saved (ISO 8601) | Timestamp present | |
| 14 | `linkedin_post_urn` saved to post record | URN saved | |
| 15 | Telegram notification sent to SMA control group | Notification sent | |
| 16 | Telegram message contains correct LinkedIn URL | URL matches URN | |

---

## Weekly Review Checks

| # | Check | Expected | PASS/FAIL |
|---|-------|----------|-----------|
| 17 | All published posts have valid `linkedin_post_urn` values | No blanks | |
| 18 | No duplicate URNs across posts | All unique | |
| 19 | Published count aligns with max 1/day rule | <= 7 per week | |
| 20 | No posts stuck in `Ready_ToPublish` for > 3 days | All processed | |
| 21 | Any `Publish_Failed` posts have been triaged | Failures reviewed | |
