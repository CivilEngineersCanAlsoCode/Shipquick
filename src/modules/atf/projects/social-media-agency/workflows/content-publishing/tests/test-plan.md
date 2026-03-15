# F4 — D-ContentPublishing Test Plan

**Workflow:** D — Content Publishing
**Scope:** Test cases for all steps D.1–D.4 plus integration flows
**Approach:** Webhook-level testing — mock n8n webhook responses to validate agent behavior

---

## Test Environment Setup

**Prerequisites:**
- Mock server intercepting webhook calls to `https://n8n.linkright.in/webhook/sma-*`
- Ability to control mock responses (status codes, response bodies, delays)
- Clean test post data in known states
- Telegram mock (capture messages without sending to real group)

**Test Post Fixture:**
```json
{
  "post_id": "test-post-001",
  "title": "Test Post — DevTools DX",
  "content": "Full test content (800-1600 chars)...",
  "hashtags": ["#DevTools", "#DX", "#Testing"],
  "topic": "developer-experience",
  "scheduled_date": "2026-03-15",
  "linkedin_post_urn": null,
  "linkedin_post_url": null,
  "status": "Ready_ToPublish",
  "created_at": "2026-03-10T08:00:00Z",
  "reviewed_at": "2026-03-14T14:30:00Z",
  "published_at": null
}
```

---

## D.1 — Fetch Ready Posts

### TC-D1-01: Zero Posts Found

**Precondition:** No posts with status `Ready_ToPublish` in database.

**Mock Response:**
```json
{ "posts": [] }
```

**Expected Behavior:**
- [ ] Agent displays message: no Ready_ToPublish posts available
- [ ] Agent suggests running Review (C) workflow first
- [ ] Workflow exits gracefully — D.2 is NOT entered
- [ ] No webhook calls made after D.1

---

### TC-D1-02: Single Post Found

**Precondition:** Exactly one post with status `Ready_ToPublish`.

**Mock Response:**
```json
{
  "posts": [{
    "post_id": "test-post-001",
    "title": "Test Post — DevTools DX",
    "status": "Ready_ToPublish",
    "scheduled_date": "2026-03-15",
    "topic": "developer-experience",
    "hashtags": ["#DevTools", "#DX", "#Testing"],
    "linkedin_post_urn": null
  }]
}
```

**Expected Behavior:**
- [ ] Agent presents the post in a summary table (title, date, topic, hashtag count)
- [ ] Agent asks user to confirm selection — does NOT auto-select
- [ ] On user confirmation, stores full post object and proceeds to D.2
- [ ] On user decline, exits gracefully

---

### TC-D1-03: Multiple Posts Found

**Precondition:** Three posts with status `Ready_ToPublish`.

**Mock Response:** Array of 3 posts with distinct titles and dates.

**Expected Behavior:**
- [ ] Agent presents all posts in a numbered summary table
- [ ] Agent asks user to pick one — max 1 post per publish run
- [ ] Agent does NOT allow selecting multiple posts
- [ ] Only the selected post is passed to D.2

---

### TC-D1-04: Already Published Today

**Precondition:** One Ready_ToPublish post exists, but another post was already published today.

**Setup:** Mock `sma-fetch-post` to return both a Ready_ToPublish post and evidence of today's publish (either in the same response or via the D.2 guardrail check).

**Expected Behavior:**
- [ ] Agent detects today's publish and warns user about 1/day limit
- [ ] Agent does NOT proceed to D.2 unless user explicitly overrides
- [ ] If user overrides, the override is logged
- [ ] If user does not override, workflow exits gracefully

---

### TC-D1-05: Webhook Failure — First Attempt

**Precondition:** First call to `sma-fetch-post` fails (HTTP 500), second succeeds.

**Mock:** First call → 500; Second call → 200 with posts.

**Expected Behavior:**
- [ ] Agent waits 5 seconds after first failure
- [ ] Agent retries exactly once
- [ ] On retry success, normal flow continues
- [ ] User sees a brief warning about the initial failure

---

### TC-D1-06: Webhook Failure — Both Attempts

**Precondition:** Both calls to `sma-fetch-post` fail.

**Mock:** Both calls → 500 or timeout.

**Expected Behavior:**
- [ ] Agent retries once after 5 seconds
- [ ] After second failure, agent asks user to check n8n workflow
- [ ] Workflow exits — D.2 is NOT entered
- [ ] Agent references specific n8n workflow name: `SMA/Data/Read/FetchPost`

---

### TC-D1-07: Malformed Response

**Precondition:** Webhook returns 200 but body is not valid JSON or missing `posts` field.

**Expected Behavior:**
- [ ] Agent treats as webhook failure — follows retry logic
- [ ] Agent does NOT crash or attempt to parse invalid data as posts

---

## D.2 — Publish to LinkedIn

### TC-D2-01: Successful Publish

**Precondition:** Post selected from D.1, all guardrails pass, user confirms.

**Mock Response (sma-publish-linkedin):**
```json
{
  "success": true,
  "linkedin_post_urn": "urn:li:share:7307123456789012345",
  "linkedin_post_url": "https://www.linkedin.com/feed/update/urn:li:share:7307123456789012345",
  "published_at": "2026-03-15T10:30:00Z"
}
```

**Expected Behavior:**
- [ ] Agent captures `linkedin_post_urn`, `linkedin_post_url`, `published_at`
- [ ] Agent informs user that post is live
- [ ] Agent proceeds to D.3 with correct data
- [ ] Content sent to webhook matches exactly what was approved in Review (C) — no modifications

---

### TC-D2-02: LinkedIn API Error — 401 Unauthorized

**Mock Response:** HTTP 401 with auth error body.

**Expected Behavior:**
- [ ] Agent does NOT retry (one-shot rule)
- [ ] Agent calls `sma-update-post` with `status: "Publish_Failed"` and error details
- [ ] Agent informs user about token/credential issue
- [ ] Workflow exits — D.3 and D.4 are NOT executed

---

### TC-D2-03: LinkedIn API Error — 403 Forbidden

**Mock Response:** HTTP 403.

**Expected Behavior:**
- [ ] Same as TC-D2-02 — no retry, mark Publish_Failed, exit
- [ ] Agent mentions permission/scope issue (`w_member_social`)

---

### TC-D2-04: LinkedIn API Error — 429 Rate Limited

**Mock Response:** HTTP 429.

**Expected Behavior:**
- [ ] No retry (one-shot rule — even for rate limits)
- [ ] Mark `Publish_Failed`
- [ ] Agent mentions rate limit and suggests waiting 24 hours

---

### TC-D2-05: LinkedIn API Error — 500 Server Error

**Mock Response:** HTTP 500.

**Expected Behavior:**
- [ ] No retry, mark `Publish_Failed`
- [ ] Agent warns that post MAY have been created — manual LinkedIn check needed
- [ ] Agent does NOT assume post was or wasn't created

---

### TC-D2-06: Network Timeout

**Mock:** Webhook call hangs beyond timeout threshold (30s), no response returned.

**Expected Behavior:**
- [ ] Agent treats timeout as failure (one-shot rule)
- [ ] Mark `Publish_Failed`
- [ ] Agent explicitly warns about ambiguous state — post may or may not be live
- [ ] Agent recommends manual LinkedIn profile check

---

### TC-D2-07: Duplicate Guard — URN Already Exists

**Precondition:** Selected post has `linkedin_post_urn: "urn:li:share:existing123"`.

**Expected Behavior:**
- [ ] Agent detects existing URN before calling publish webhook
- [ ] Publish webhook is NOT called
- [ ] Agent informs user this post was already published
- [ ] Agent offers to go back to D.1 or exit

---

### TC-D2-08: Duplicate Guard — Already Published Today (1/Day)

**Precondition:** A different post was published today (UTC).

**Mock (sma-fetch-post with status=Published):**
```json
{
  "posts": [{
    "post_id": "other-post",
    "title": "Earlier Post",
    "published_at": "2026-03-15T08:00:00Z"
  }]
}
```

**Expected Behavior:**
- [ ] Agent detects today's existing publish
- [ ] Agent blocks publish and informs user of 1/day rule
- [ ] If user says "publish anyway" → agent proceeds but logs the override
- [ ] If user does not override → workflow exits

---

### TC-D2-09: Random Delay Verification

**Precondition:** All guardrails pass, publish is about to proceed.

**Expected Behavior:**
- [ ] Agent generates a random delay between 0 and 60 minutes (inclusive)
- [ ] Agent displays the delay value to the user
- [ ] Agent offers the user the option to skip ("publish now")
- [ ] If user says "publish now" → delay is skipped, publish proceeds immediately
- [ ] If user does not skip → agent waits full delay before calling webhook
- [ ] `delay_applied` value is stored and passed to D.3/D.4

---

### TC-D2-10: Response Missing URN (success: true but no URN)

**Mock Response:**
```json
{
  "success": true,
  "linkedin_post_urn": null,
  "published_at": "2026-03-15T10:30:00Z"
}
```

**Expected Behavior:**
- [ ] Agent treats as failure — cannot verify post creation without URN
- [ ] Mark `Publish_Failed`
- [ ] Agent recommends manual LinkedIn check

---

### TC-D2-11: Response success: false

**Mock Response:**
```json
{
  "success": false,
  "error": "Content policy violation detected"
}
```

**Expected Behavior:**
- [ ] Agent does NOT retry
- [ ] Mark `Publish_Failed` with error message from response
- [ ] Error message shown to user

---

### TC-D2-12: User Asks to Retry After Failure

**Precondition:** Publish failed, user says "retry karo" or "phir se try karo".

**Expected Behavior:**
- [ ] Agent refuses to retry
- [ ] Agent explains one-shot rule
- [ ] Agent suggests investigating the error and manually re-queuing if appropriate

---

### TC-D2-13: Content Integrity Check

**Precondition:** Post content has been through Review (C).

**Expected Behavior:**
- [ ] Content sent to `sma-publish-linkedin` is byte-for-byte identical to what was stored
- [ ] No reformatting, trimming, or modification of content or hashtags
- [ ] All payload fields match the post record exactly

---

## D.3 — Update Post Status

### TC-D3-01: Successful Status Update

**Precondition:** D.2 succeeded, calling `sma-update-post` with Published status.

**Mock Response:**
```json
{ "success": true, "updated": true }
```

**Expected Behavior:**
- [ ] Agent confirms record updated
- [ ] All four fields sent: `status`, `published_at`, `linkedin_post_urn`, `linkedin_post_url`
- [ ] Agent proceeds to D.4

---

### TC-D3-02: MongoDB Write Failure — First Attempt, Retry Succeeds

**Mock:** First call → 500; Second call → 200 with success.

**Expected Behavior:**
- [ ] Agent warns user about initial failure
- [ ] Agent retries after 5 seconds
- [ ] Retry succeeds → normal flow to D.4
- [ ] Agent makes clear the post IS live regardless

---

### TC-D3-03: MongoDB Write Failure — Both Attempts Fail

**Mock:** Both calls → 500 or timeout.

**Expected Behavior:**
- [ ] Agent warns user: post is LIVE but DB record not updated
- [ ] Agent provides the `linkedin_post_urn` for manual recovery
- [ ] Agent proceeds to D.4 anyway (Telegram should still notify)
- [ ] Agent references `SMA/Data/Write/UpdatePost` n8n workflow for debugging
- [ ] Agent does NOT attempt to rollback the LinkedIn post

---

### TC-D3-04: Verify Updated Fields

**Precondition:** Update succeeded, optional verification fetch.

**Mock (sma-fetch-post by post_id):**
```json
{
  "posts": [{
    "post_id": "test-post-001",
    "status": "Published",
    "linkedin_post_urn": "urn:li:share:7307123456789012345",
    "linkedin_post_url": "https://www.linkedin.com/feed/update/urn:li:share:7307123456789012345",
    "published_at": "2026-03-15T10:30:00Z"
  }]
}
```

**Expected Behavior:**
- [ ] `status` is `Published`
- [ ] `linkedin_post_urn` matches the URN from D.2 response
- [ ] `linkedin_post_url` is set and valid
- [ ] `published_at` is set and matches D.2 timestamp (ISO 8601)

---

### TC-D3-05: No Rollback Attempt

**Precondition:** D.3 update fails.

**Expected Behavior:**
- [ ] Agent does NOT attempt to delete or modify the LinkedIn post
- [ ] Agent does NOT call any LinkedIn API to undo the publish
- [ ] Agent explicitly tells user the post is live and cannot be un-published

---

## D.4 — Telegram Notification

### TC-D4-01: Successful Notification

**Precondition:** D.3 completed (success or failure), sending Telegram message.

**Mock Response:**
```json
{ "success": true, "message_id": 12345 }
```

**Expected Behavior:**
- [ ] Agent sends notification to chat ID `-1003399716516`
- [ ] Agent confirms notification sent
- [ ] Agent presents final publish summary to user
- [ ] Workflow completes

---

### TC-D4-02: Telegram Bot Error

**Mock:** HTTP 403 (bot kicked from group) or 400 (bad request).

**Expected Behavior:**
- [ ] Agent logs the error
- [ ] Agent does NOT retry
- [ ] Agent does NOT fail the workflow — post is still published
- [ ] Agent informs user: notification failed, but everything else is done
- [ ] Final publish summary is still presented

---

### TC-D4-03: Telegram Network Timeout

**Mock:** Webhook hangs beyond timeout.

**Expected Behavior:**
- [ ] Agent treats as failure — logs and moves on
- [ ] Workflow still completes successfully
- [ ] Final summary still presented

---

### TC-D4-04: Message Format — D.3 Success

**Precondition:** D.3 update succeeded.

**Expected Message Content:**
```
=== Post Published ===
Title: <post title>
LinkedIn: <linkedin_post_url>
Published At: <published_at>
Delay Applied: <X> minutes
Status: Published
DB Update: success
===
```

**Validation:**
- [ ] Title matches post title exactly
- [ ] LinkedIn URL is the full URL (not just URN)
- [ ] Published At is ISO 8601 format
- [ ] Delay Applied shows actual delay in minutes
- [ ] DB Update shows "success"
- [ ] No sensitive data (tokens, connection strings, credentials)

---

### TC-D4-05: Message Format — D.3 Failed

**Precondition:** D.3 update failed.

**Expected Message Content:**
```
=== Post Published ===
Title: <post title>
LinkedIn: <linkedin_post_url>
Published At: <published_at>
Delay Applied: <X> minutes
Status: Published
DB Update: failed
WARNING: Database update failed — post is live but record not updated. Manual fix needed. URN: <urn>
===
```

**Validation:**
- [ ] DB Update shows "failed"
- [ ] WARNING line is present with URN for manual recovery
- [ ] Message is still sent (D.4 runs even if D.3 failed)

---

## Integration Tests

### TC-INT-01: Full Happy Path (D.1 → D.2 → D.3 → D.4)

**Precondition:** One Ready_ToPublish post, no posts published today, all webhooks healthy.

**Flow:**
1. D.1: Fetch → 1 post returned → user confirms
2. D.2: Guardrails pass → random delay (user skips) → publish succeeds → URN captured
3. D.3: Status update succeeds → verified
4. D.4: Telegram notification sent → final summary displayed

**Expected Behavior:**
- [ ] All four steps execute in sequence
- [ ] Post transitions: `Ready_ToPublish` → `Published`
- [ ] `linkedin_post_urn`, `linkedin_post_url`, `published_at` all saved
- [ ] Telegram message contains correct data
- [ ] Final summary table presented to user with all fields
- [ ] Total webhook calls: fetch (D.1) + guardrail fetch (D.2) + publish (D.2) + update (D.3) + telegram (D.4) = 5 calls

---

### TC-INT-02: Publish Failure — Early Exit

**Precondition:** Post selected, guardrails pass, but LinkedIn API returns 401.

**Flow:**
1. D.1: Fetch → user selects post
2. D.2: Guardrails pass → publish fails (401) → mark Publish_Failed → exit

**Expected Behavior:**
- [ ] D.3 is NOT executed
- [ ] D.4 is NOT executed
- [ ] Post status is `Publish_Failed` (not `Ready_ToPublish`, not `Published`)
- [ ] User receives clear error message with next steps
- [ ] No Telegram notification sent (workflow exited at D.2)

---

### TC-INT-03: Interrupted Flow — Agent Crash After D.2 Success

**Precondition:** D.2 published successfully, then agent/connection dies before D.3.

**State After Interruption:**
- LinkedIn: post IS live
- MongoDB: status still `Ready_ToPublish`, no URN saved
- Telegram: no notification sent

**Recovery Flow:**
1. User restarts workflow
2. D.1 fetches posts — the published post still shows as `Ready_ToPublish`
3. D.2 guardrail: `linkedin_post_urn` is null (DB not updated) — guardrail does NOT catch it
4. **RISK:** Duplicate publish if user re-selects the same post

**Expected Recovery Behavior:**
- [ ] Resume-if-interrupted step (step-01b) should detect incomplete state
- [ ] Agent should ask user to verify if post is already live on LinkedIn
- [ ] If live → manually update DB and skip to D.4
- [ ] If not live → safe to re-publish

---

### TC-INT-04: Interrupted Flow — Agent Crash After D.3 Failure

**Precondition:** D.2 succeeded, D.3 failed, agent dies before D.4.

**State After Interruption:**
- LinkedIn: post IS live
- MongoDB: status still `Ready_ToPublish` (update failed)
- Telegram: no notification sent

**Recovery Flow:**
1. Fix n8n / MongoDB connectivity
2. Manually update the post record with URN and Published status
3. Optionally send manual Telegram notification

**Expected Behavior:**
- [ ] Recovery procedure documented in error-handling.md is followable
- [ ] Manual DB update template is provided
- [ ] No automated retry of the publish step

---

### TC-INT-05: Multiple Posts — Correct Selection Propagation

**Precondition:** 3 posts in Ready_ToPublish, user selects post #2.

**Expected Behavior:**
- [ ] Only post #2's data is sent to publish webhook
- [ ] Only post #2's record is updated in D.3
- [ ] Telegram notification references post #2's title and URL
- [ ] Posts #1 and #3 remain untouched in `Ready_ToPublish` status

---

### TC-INT-06: D.3 Failure Does Not Block D.4

**Precondition:** D.2 succeeds, D.3 fails both attempts.

**Expected Behavior:**
- [ ] D.4 is still executed
- [ ] Telegram message includes `DB Update: failed` and WARNING line
- [ ] Final summary shows DB Update as failed
- [ ] Workflow completes (not stuck)

---

### TC-INT-07: Full Flow with Random Delay

**Precondition:** Standard happy path, user does NOT skip delay.

**Expected Behavior:**
- [ ] Random delay value is between 0 and 60 (inclusive)
- [ ] Publish webhook is NOT called until delay expires
- [ ] No other webhook calls during the delay period
- [ ] `delay_applied` value is correctly propagated to D.3 and D.4
- [ ] Telegram message shows actual delay value

---

## Test Result Summary Template

| Test Case | Status | Notes |
|-----------|--------|-------|
| TC-D1-01 | | |
| TC-D1-02 | | |
| TC-D1-03 | | |
| TC-D1-04 | | |
| TC-D1-05 | | |
| TC-D1-06 | | |
| TC-D1-07 | | |
| TC-D2-01 | | |
| TC-D2-02 | | |
| TC-D2-03 | | |
| TC-D2-04 | | |
| TC-D2-05 | | |
| TC-D2-06 | | |
| TC-D2-07 | | |
| TC-D2-08 | | |
| TC-D2-09 | | |
| TC-D2-10 | | |
| TC-D2-11 | | |
| TC-D2-12 | | |
| TC-D2-13 | | |
| TC-D3-01 | | |
| TC-D3-02 | | |
| TC-D3-03 | | |
| TC-D3-04 | | |
| TC-D3-05 | | |
| TC-D4-01 | | |
| TC-D4-02 | | |
| TC-D4-03 | | |
| TC-D4-04 | | |
| TC-D4-05 | | |
| TC-INT-01 | | |
| TC-INT-02 | | |
| TC-INT-03 | | |
| TC-INT-04 | | |
| TC-INT-05 | | |
| TC-INT-06 | | |
| TC-INT-07 | | |

**Total: 37 test cases** (7 D.1 + 13 D.2 + 5 D.3 + 5 D.4 + 7 Integration)
