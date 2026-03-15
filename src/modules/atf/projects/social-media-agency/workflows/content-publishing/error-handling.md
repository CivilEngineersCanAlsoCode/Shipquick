# F3 — D-ContentPublishing Error Handling

**Workflow:** D — Content Publishing
**Scope:** All error scenarios across D.1–D.4 steps

---

## Error Classification

| Severity | Description | Workflow Impact |
|----------|-------------|-----------------|
| **FATAL** | Publish cannot proceed — workflow exits | D.1 webhook down, D.2 LinkedIn API failure |
| **CRITICAL** | Post is live but records are inconsistent | D.3 MongoDB update failure |
| **WARNING** | Informational failure — no data impact | D.4 Telegram notification failure |

---

## D.1 — Fetch Ready Posts Errors

### ERR-D1-01: Webhook Network Failure

**Detection:** HTTP connection error, DNS resolution failure, or connection refused when calling `sma-fetch-post`.

**Response:**
1. Wait 5 seconds
2. Retry the webhook call once

**Recovery:**
- If retry succeeds → continue normally
- If retry fails → inform user, exit workflow

**Escalation:**
> "Webhook abhi respond nahi kar raha. Satvik, n8n workflow `SMA/Data/Read/FetchPost` active hai? Check karo."

**Severity:** FATAL — cannot proceed without post data.

---

### ERR-D1-02: Webhook Non-200 Response

**Detection:** HTTP status code is not 200 (e.g., 502 Bad Gateway from n8n, 500 Internal Server Error).

**Response:** Same as ERR-D1-01 — retry once after 5 seconds.

**Recovery:** Same escalation path. Do NOT attempt to parse error response bodies as post data.

**Severity:** FATAL

---

### ERR-D1-03: Empty Post List

**Detection:** Webhook returns HTTP 200 but `posts` array is empty (`posts.length === 0`).

**Response:** Inform user:
> "Abhi koi Ready_ToPublish post nahi hai. Pehle Review (C) workflow se posts approve karwao."

**Recovery:** Exit workflow gracefully. No retry needed — this is a valid state, not an error.

**Escalation:** None. User must run upstream workflows (A→B→F→C) first.

**Severity:** N/A — expected state, not an error.

---

### ERR-D1-04: Malformed Response

**Detection:** Response is not valid JSON, or `posts` field is missing/not an array.

**Response:** Treat as webhook failure (ERR-D1-01 path). Retry once.

**Recovery:** If retry also returns malformed data, escalate to check n8n workflow configuration.

**Severity:** FATAL

---

## D.2 — Publish to LinkedIn Errors

### ERR-D2-01: LinkedIn API 401 Unauthorized

**Detection:** Publish webhook returns HTTP 401, or response body contains authentication error.

**Response:**
1. Do NOT retry (one-shot rule)
2. Mark post as `Publish_Failed`
3. Capture error: `"LinkedIn API 401: Authentication failed — access token expired or invalid"`

**Recovery:**
```json
{
  "post_id": "<post_id>",
  "status": "Publish_Failed",
  "publish_error": "LinkedIn API 401: Unauthorized — token expired or invalid",
  "failed_at": "<ISO 8601 timestamp>"
}
```

**Escalation:**
> "LinkedIn publish FAIL — 401 Unauthorized. Access token expire ho gaya hai ya invalid hai. n8n mein LinkedIn credentials refresh karo, phir post ko manually re-queue karo."

**Root Cause Checklist:**
- LinkedIn OAuth token expired (tokens expire every 60 days)
- n8n LinkedIn credential node misconfigured
- LinkedIn app permissions revoked

**Severity:** FATAL — requires credential fix before any publish can work.

---

### ERR-D2-02: LinkedIn API 403 Forbidden

**Detection:** Publish webhook returns HTTP 403.

**Response:**
1. Do NOT retry (one-shot rule)
2. Mark post as `Publish_Failed`
3. Capture error details

**Recovery:** Same `Publish_Failed` update as ERR-D2-01.

**Escalation:**
> "LinkedIn publish FAIL — 403 Forbidden. Account permissions issue. LinkedIn Developer Portal pe app permissions check karo. `w_member_social` scope hona chahiye."

**Root Cause Checklist:**
- LinkedIn app missing `w_member_social` permission
- Account restricted by LinkedIn (spam/abuse detection)
- Posting to a page without admin rights

**Severity:** FATAL

---

### ERR-D2-03: LinkedIn API 429 Rate Limited

**Detection:** Publish webhook returns HTTP 429 or response contains rate limit messaging.

**Response:**
1. Do NOT retry (one-shot rule — even though this is a rate limit, retrying risks duplicate posts if the original request actually succeeded but the response was delayed)
2. Mark post as `Publish_Failed`

**Recovery:** Same `Publish_Failed` update.

**Escalation:**
> "LinkedIn publish FAIL — 429 Rate Limited. LinkedIn API ka daily limit hit ho gaya. 24 hours baad try karo. Check karo ki koi aur tool bhi same account se post toh nahi kar raha."

**Root Cause Checklist:**
- LinkedIn API daily rate limit hit (typically 100 posts/day for most apps)
- Multiple tools/services posting from same account
- Rapid successive publish attempts

**Severity:** FATAL — transient, resolves after rate limit window resets.

---

### ERR-D2-04: LinkedIn API 500 Internal Server Error

**Detection:** Publish webhook returns HTTP 500, 502, 503, or 504.

**Response:**
1. Do NOT retry (one-shot rule)
2. Mark post as `Publish_Failed`
3. Log the full error response

**Recovery:** Same `Publish_Failed` update.

**Escalation:**
> "LinkedIn publish FAIL — server error (HTTP [code]). LinkedIn ki taraf se issue hai. LinkedIn API Status page check karo. Post ko baad mein manually re-queue karo."

**Important:** On 5xx errors, it is **ambiguous** whether the post was actually created on LinkedIn. Before re-queuing:
1. Check the LinkedIn profile manually to see if the post appeared
2. If post IS live → manually set `linkedin_post_urn` and status to `Published`
3. If post is NOT live → safe to re-queue to `Ready_ToPublish`

**Severity:** FATAL — may require manual verification.

---

### ERR-D2-05: Network Timeout

**Detection:** Webhook call exceeds timeout threshold (n8n default: 30 seconds) without response.

**Response:**
1. Do NOT retry (one-shot rule)
2. Mark post as `Publish_Failed`
3. Log: `"Network timeout — no response from publish webhook within [X]s"`

**Recovery:** Same `Publish_Failed` update.

**Escalation:**
> "Publish webhook timeout ho gaya — response nahi aaya. Post LinkedIn pe live ho bhi sakta hai, bhi nahi. MANUALLY CHECK KARO LinkedIn profile pe. Agar post dikh raha hai toh manually Published mark karo, nahi toh re-queue karo."

**CRITICAL WARNING:** Timeouts are the most dangerous error because the post may have been successfully created on LinkedIn before the timeout occurred. ALWAYS verify manually before re-queuing.

**Severity:** FATAL — ambiguous state, requires manual verification.

---

### ERR-D2-06: Duplicate Publish Prevention — URN Already Exists

**Detection:** Selected post has a non-null, non-empty `linkedin_post_urn` field.

**Response:** STOP immediately. Do NOT call the publish webhook.

> "Is post ka LinkedIn URN pehle se set hai (`[urn]`) — yeh pehle publish ho chuka hai. Duplicate se bachne ke liye skip kar raha hoon."

**Recovery:** Ask user to select a different post (back to D.1) or exit workflow.

**Severity:** Prevented error — guardrail working correctly.

---

### ERR-D2-07: Duplicate Publish Prevention — Already Published Today

**Detection:** Fetch of today's published posts returns results with `published_at` matching today (UTC).

**Response:** STOP. Inform user of 1/day limit.

> "Aaj already ek post publish ho chuka hai (`[title]` at [time]). Max 1 post/day rule hai. Kal try karo."

**Recovery:** User can explicitly override by saying "publish anyway" — log the override. Otherwise exit.

**Severity:** Prevented error — guardrail working correctly.

---

### ERR-D2-08: Response Missing linkedin_post_urn

**Detection:** Webhook returns HTTP 200 and `success: true`, but `linkedin_post_urn` is null, empty, or missing.

**Response:**
1. Treat as publish failure (one-shot rule applies)
2. Mark post as `Publish_Failed`
3. Log: `"Publish API returned success but no linkedin_post_urn — cannot verify post was created"`

**Recovery:** Same `Publish_Failed` update. Manual LinkedIn profile check required.

**Escalation:**
> "Publish API ne success bola lekin URN nahi diya. LinkedIn pe manually check karo ki post live hai ya nahi. n8n workflow response mapping bhi check karo."

**Severity:** FATAL — ambiguous state.

---

### ERR-D2-09: success: false in Response Body

**Detection:** Webhook returns HTTP 200 but response body contains `"success": false`.

**Response:**
1. Do NOT retry (one-shot rule)
2. Mark post as `Publish_Failed`
3. Extract and log error message from response body

**Recovery:** Same `Publish_Failed` update.

**Escalation:** Share the full error response with user for debugging.

**Severity:** FATAL

---

## D.3 — Status Update Errors

### ERR-D3-01: MongoDB Write Failure (via n8n)

**Detection:** Update webhook (`sma-update-post`) returns non-200, timeout, or `success: false`.

**Response:**
1. Warn user — the post IS live on LinkedIn, but the database record is stale
2. Retry once after 5 seconds

**Recovery:**
- If retry succeeds → continue to D.4 normally
- If retry fails → proceed to D.4 anyway, include warning in Telegram notification

**Escalation:**
> "Warning: Post LinkedIn pe LIVE hai, lekin database record update nahi ho paya. Error: `[details]`. Dashboard mein `Published` nahi dikhega jab tak manually fix nahi hota."
>
> "LinkedIn URN: `[urn]` — yeh save kar lo agar manual fix karna pade."

**Impact if not fixed:**
- E-Analytics workflow won't pick up the post (looks for `status: Published`)
- Duplicate guard may fail (no `linkedin_post_urn` in record)
- Post may appear as `Ready_ToPublish` in future D.1 fetch — risk of duplicate publish attempt

**Manual Fix:**
```json
// Run via MongoDB shell or n8n manual trigger
db.linkedin_posts.updateOne(
  { _id: ObjectId("<post_id>") },
  {
    $set: {
      status: "Published",
      linkedin_post_urn: "<urn>",
      linkedin_post_url: "<url>",
      published_at: ISODate("<timestamp>")
    }
  }
)
```

**Severity:** CRITICAL — post is live but records are inconsistent. Must be fixed to prevent downstream issues.

---

### ERR-D3-02: Webhook Network Failure

**Detection:** Connection error, DNS failure, or connection refused to `sma-update-post`.

**Response:** Same as ERR-D3-01 — retry once, then proceed to D.4 with warning.

**Severity:** CRITICAL

---

### ERR-D3-03: Partial Update (Fields Missing After Update)

**Detection:** Verification fetch shows some fields updated but others missing (e.g., `status` is `Published` but `linkedin_post_urn` is null).

**Response:** Warn user about inconsistency. Provide the full set of values that should be present.

**Recovery:** Manual correction via MongoDB or re-running the update webhook with all four fields.

**Severity:** CRITICAL — incomplete record causes downstream issues.

---

## D.4 — Telegram Notification Errors

### ERR-D4-01: Telegram Bot API Error

**Detection:** `sma-notify-telegram` webhook returns non-200 or `success: false`.

**Response:** Log the error. Do NOT retry. Do NOT fail the workflow.

> "Telegram notification nahi ja payi — lekin post published hai aur records updated hain. Koi action nahi chahiye, bas FYI."

**Recovery:** None required. Team can check dashboard for publish status.

**Escalation:** Only escalate if Telegram failures happen repeatedly (3+ consecutive publishes). Then check:
- Telegram Bot token validity
- Chat ID `-1003399716516` still correct
- Bot still member of the SMA control group
- n8n Telegram node configuration

**Severity:** WARNING — informational only, no data impact.

---

### ERR-D4-02: Telegram Network Timeout

**Detection:** Webhook call times out.

**Response:** Same as ERR-D4-01 — log and continue. The workflow is complete regardless.

**Severity:** WARNING

---

### ERR-D4-03: Malformed Message

**Detection:** Telegram rejects the message due to formatting issues (e.g., message too long, invalid characters).

**Response:** Log the error. If possible, send a simplified fallback message:
```json
{
  "chat_id": "-1003399716516",
  "message": "Post Published: <title> — Check dashboard for details."
}
```

If the fallback also fails, log and move on.

**Severity:** WARNING

---

## Error Recovery Procedures

### Recovering from Publish_Failed

When a post is in `Publish_Failed` status, follow this procedure:

1. **Investigate the error** — check `publish_error` and `failed_at` fields on the post record
2. **Check LinkedIn manually** — verify the post did NOT appear on the LinkedIn profile (especially for timeout/5xx errors)
3. **Fix root cause** — resolve the underlying issue (token refresh, rate limit wait, etc.)
4. **Re-queue the post:**
   ```json
   {
     "post_id": "<post_id>",
     "status": "Ready_ToPublish",
     "publish_error": null,
     "failed_at": null
   }
   ```
5. **Re-run the D workflow** — start from D.1

**NEVER re-queue without manual LinkedIn verification** — this prevents duplicate posts.

---

### Recovering from D.3 Failure (Post Live, DB Stale)

1. **Immediately save the URN** — copy from agent conversation or Telegram notification
2. **Fix n8n** — check `SMA/Data/Write/UpdatePost` workflow is active
3. **Manual update** — use MongoDB shell or re-trigger the update webhook
4. **Verify** — fetch the post and confirm all four fields are set correctly

---

### Recovering from Interrupted Workflow

If the workflow is interrupted between steps (agent crash, user disconnect, etc.):

| Interrupted After | State | Recovery |
|-------------------|-------|----------|
| D.1 | No damage — nothing published | Re-start from D.1 |
| D.2 (success) | Post is LIVE but DB not updated | Check LinkedIn, manually update DB, then run D.4 |
| D.2 (failure) | Post marked Publish_Failed | Follow Publish_Failed recovery |
| D.3 | Post live, DB may/may not be updated | Verify DB state, run D.4 if not sent |
| D.4 | Everything done except notification | Send Telegram manually or ignore |

---

## Error Monitoring Checklist (Weekly)

| # | Check | Action if Failed |
|---|-------|------------------|
| 1 | Any posts in `Publish_Failed` status for > 24 hours? | Triage and re-queue or archive |
| 2 | Any posts in `Ready_ToPublish` for > 3 days? | Check if pipeline is stuck |
| 3 | Any duplicate `linkedin_post_urn` values? | Investigate — one is likely wrong |
| 4 | Any `Published` posts missing `linkedin_post_urn`? | Manual fix required |
| 5 | Telegram notifications failing consistently? | Check bot token and group membership |
| 6 | n8n webhook response times > 10 seconds? | Check n8n server health |
