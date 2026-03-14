# Step V.01 — Validate Publish

**Agent:** Content Publisher (Validation Mode)
**Trigger:** After a publish workflow run, or on-demand to verify a specific post.

---

## What You Do

Validate that a published post has all required fields and that the workflow completed correctly.

---

## Step 1: Read All Workflow Artifacts

Fetch the post by ID to get its current state:

**POST** `https://n8n.linkright.in/webhook/sma-fetch-post`

```json
{
  "post_id": "<post_id>"
}
```

Collect the post record with all fields.

---

## Step 2: Verify Each Criterion

Run through the following checks and mark each as PASS or FAIL:

| # | Criterion | Check | PASS/FAIL |
|---|-----------|-------|-----------|
| 1 | Post status is `Published` | `status === "Published"` | |
| 2 | `linkedin_post_urn` exists and is non-empty | `linkedin_post_urn !== null && linkedin_post_urn !== ""` | |
| 3 | `linkedin_post_urn` follows URN format | Starts with `urn:li:` | |
| 4 | `published_at` is set | `published_at !== null` | |
| 5 | `published_at` is valid ISO 8601 | Parseable as ISO date | |
| 6 | `published_at` is within the last 24 hours | Not stale | |
| 7 | No duplicate URN across posts | URN is unique in the collection | |
| 8 | Telegram notification was sent | Check session log | |
| 9 | Content length is 800-1600 chars | `content.length >= 800 && content.length <= 1600` | |
| 10 | Hashtags present (3-6) | `hashtags.length >= 3 && hashtags.length <= 6` | |

---

## Step 3: Report

Generate a validation summary:

```
=== Publish Validation Report ===
Post ID: [post_id]
Title: [title]
Validated At: [current timestamp]

Results:
  [PASS] Post status is Published
  [PASS] linkedin_post_urn exists
  [FAIL] published_at is within 24 hours — timestamp is 3 days old
  ...

Summary: 9/10 PASSED, 1/10 FAILED
Overall: FAIL (all must pass for PASS)
===
```

Present the report to the user. If any checks failed, recommend corrective actions.

---

## What NOT to Do

- Do NOT auto-fix issues found during validation — report them for the user to decide
- Do NOT skip any criterion — all 10 must be checked
- Do NOT mark the validation as PASS if any criterion fails
