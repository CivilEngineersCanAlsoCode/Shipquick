# J4 — Content Review & Publish Journey Map

**Workflows:** C (Content Review) + D (Content Publishing) — Combined journey
**Agents:** Pixel (flex-crafter) for C, Relay (flex-publisher) for D
**Trigger:** User says "Review karo" (C) then "Publish karo" (D)
**Entry status:** Post with status=Previewed
**Exit status:** Post with status=Published + LinkedIn live + Telegram notified

---

## Journey Overview

```
C — REVIEW                                    D — PUBLISH
Fetch Previewed   Preview &      Batch         Fetch Ready      Publish to      Update status
posts          →  decide per  →  summary    →  posts         →  LinkedIn     →  + Telegram notify
(C.1)             post (C.2-3)   (C.4)         (D.1)            (D.2)           (D.3-D.4)
```

---

## C — Content Review

### C.1: Fetch Scheduled Posts — ~15 seconds

| Aspect | Detail |
|--------|--------|
| **User action** | Says "Review karo" |
| **System action** | Fetch all Previewed posts, sorted by scheduled_date ascending |
| **Webhook** | `POST /sma-fetch-post` (status=Previewed) |

**User sees:**
```
📋 Posts ready for review (2 posts):

  1. "Why PMs should learn SQL" — Mon Mar 16 (Skill-Building) — Previewed
     1,089 chars | FK 6.2 | Contrarian Hook

  2. "My first year at AmEx" — Tue Mar 17 (Career) — Previewed
     987 chars | FK 6.8 | Story Hook

Review in order (1→2) or pick specific?
```

**Emotion:** Focused — "Final check before this goes live"

### C.2: Preview & Decide — 1–3 minutes per post

| Aspect | Detail |
|--------|--------|
| **User action** | Reviews formatted preview, makes decision |
| **System action** | Display metadata + code-block preview + stats |

**User sees per post:**
```
📝 REVIEW: "Why PMs should learn SQL"

  Topic: SQL for Product Managers
  Pillar: Skill-Building | Score: 134/160
  Scheduled: Mon Mar 16
  Frameworks: Contrarian Hook + Story-to-Insight + Conversational Tone
  Iterations: 2 | Formatted: 1,089 chars

┌──────────────────────────────────────┐
│  [Full formatted preview in code     │
│   block — same as F.3 output]        │
└──────────────────────────────────────┘

📊 Quick stats: 1,089 chars | 2 emojis | 1 Hindi | 5 hashtags | FK 6.2

Decision:
  1. ✅ Approve → Ready to Publish
  2. ✏️ Edit → Make minor changes here
  3. 📅 Reschedule → Change date
  4. ❌ Drop → Cancel this post
  5. 🔙 Send back → Return to Drafting (Scheduled_NoDraft)
```

**Decision outcomes:**

| Decision | Webhook | Status Change | Notes |
|----------|---------|---------------|-------|
| **Approve** | `POST /sma-update-post` | Previewed → Ready_ToPublish | Fastest path |
| **Edit** | Proceed to C.3 | Stays Previewed during edit | Re-validates after edit |
| **Reschedule** | `POST /sma-update-post` (new scheduled_date) | Stays Previewed | Checks calendar conflicts |
| **Drop** | `POST /sma-update-post` | → Cancelled | Requires confirmation ("Are you sure?") |
| **Send back** | `POST /sma-update-post` | → Scheduled_NoDraft | Back to B-Drafting queue |

**Emotion:** Evaluative, decisive — "Is this worth putting my name on?"

### C.3: Apply Minor Edits (if chosen) — 1–3 minutes

| Aspect | Detail |
|--------|--------|
| **User action** | Describes edit ("Change the hook to be less aggressive") |
| **System action** | Apply edit, re-validate formatting rules, show updated preview |
| **Webhook** | `POST /sma-update-post` (save edited content) |
| **Loop** | Show new preview → ask approval again (back to C.2 decision menu) |

**Validation after edit:**
- Re-check all formatting rules (chars, emojis, Hindi, FK grade, etc.)
- If edit breaks a rule, flag it before asking for approval

### C.4: Finalize Review — Summary, ~15 seconds

| Aspect | Detail |
|--------|--------|
| **User action** | Reviews batch summary |
| **System action** | Present review session stats |

**User sees:**
```
✅ Review session complete!

  Approved: 2 posts (Mon–Tue)
  Edited: 0
  Rescheduled: 0
  Dropped: 0
  Sent back: 0

Ready_ToPublish queue: 2 posts
Next: "Publish karo" to start D-ContentPublishing
```

**Emotion:** Confident — "Pipeline is solid, ready to go live"

---

## D — Content Publishing

### D.1: Fetch Ready Posts — ~15 seconds

| Aspect | Detail |
|--------|--------|
| **User action** | Says "Publish karo" |
| **System action** | Fetch Ready_ToPublish posts, check 1/day constraint |
| **Webhook** | `POST /sma-fetch-post` (status=Ready_ToPublish) |
| **Conflict check** | Verify no post already published today |

**User sees:**
```
📡 Posts ready to publish:

  1. "Why PMs should learn SQL" — Scheduled: Mon Mar 16
     ⚠️ Today is Mon Mar 16 — this is due today!

  2. "My first year at AmEx" — Scheduled: Tue Mar 17
     📅 Scheduled for tomorrow

Publish #1 now? (1/publish now/cancel)
```

**Emotion:** Anticipation — "This is going live"
**Pain point:** If today's post was already published, user must wait until tomorrow

### D.2: Publish to LinkedIn — 0–60 minutes (delay)

| Aspect | Detail |
|--------|--------|
| **User action** | Confirms publish |
| **System action** | Run 3 guardrails, apply random delay, publish |
| **Webhook** | `POST /sma-publish-linkedin` (post_id, content, hashtags, title, topic, scheduled_date) |

**Three guardrails (all must pass):**
1. Status still = Ready_ToPublish (not already published)
2. No post published today (max 1/day rule)
3. `linkedin_post_urn` not already set (duplicate guard)

**Random delay behavior:**
```
🕐 Publishing with random delay (anti-bot measure)...
   Delay: ~34 minutes
   Estimated publish: ~9:49 AM IST

   Say "publish now" to skip delay, or wait.
```

**ONE-SHOT RULE (ABSOLUTE):**
- If publish API fails → status = Publish_Failed
- NO automatic retry. Ever.
- Error stored: timestamp, HTTP status, error message
- User must manually investigate and retry via new workflow

**User sees on success:**
```
✅ Published to LinkedIn!

"Why PMs should learn SQL"
  LinkedIn URN: urn:li:share:7123456789
  Published at: Mon Mar 16, 9:47 AM IST
  Status: Published
```

**User sees on failure:**
```
❌ Publish FAILED (one-shot — no retry)

"Why PMs should learn SQL"
  Error: 403 Forbidden — "Access token expired"
  Status: Publish_Failed
  Timestamp: Mon Mar 16, 9:47 AM IST

Action needed: Check LinkedIn token, then manually re-queue.
```

**Emotion (success):** Relief, satisfaction — "It's live!"
**Emotion (failure):** Anxiety — "What went wrong? Can I fix it?"

### D.3: Update Status — Automatic, ~5 seconds

| Aspect | Detail |
|--------|--------|
| **System action** | Update MongoDB with Published status, URN, timestamp |
| **Webhook** | `POST /sma-update-post` (status=Published, linkedin_post_urn, published_at) |
| **Edge case** | If DB update fails but LinkedIn post is live → warn user, manual reconciliation needed |

### D.4: Telegram Notification — Automatic, ~5 seconds

| Aspect | Detail |
|--------|--------|
| **System action** | Send notification to SMA Telegram control group |
| **Webhook** | `POST /sma-notify-telegram` |
| **Message** | Post title, LinkedIn URL, published_at timestamp |
| **Failure handling** | Log warning, don't fail the workflow — Telegram is non-critical |

**Telegram message:**
```
📡 New post published!
"Why PMs should learn SQL"
🔗 linkedin.com/feed/update/urn:li:share:7123456789
⏰ Mon Mar 16, 9:47 AM IST
```

---

## Touchpoint Map

| Touchpoint | Channel | Interaction Type |
|------------|---------|-----------------|
| Trigger review | ChatGPT (LinkRight HQ) | Conversational command |
| Post selection | ChatGPT | Numbered list or sequential |
| Review decision (×N posts) | ChatGPT | 5-option menu per post |
| Minor edits | ChatGPT | Free-text edit instructions |
| Trigger publish | ChatGPT | Conversational command |
| Publish confirmation | ChatGPT | Yes/no + delay preference |
| Publish notification | Telegram | Push notification (passive) |
| Post live | LinkedIn | Content visible to network |

---

## Emotion Curve (Combined C+D)

```
High  ·                    ·           ·  ← Published! (elation)
      ·                  ·   ·       ·
      ·  ← Review start ·     ·   ·  ← Waiting during delay (tension)
Mid   ·················      ·  ·
      ·                       ·  ← Publish failed (anxiety)
Low   ·
```

---

## Error States & Edge Cases

| Condition | User Impact | System Response |
|-----------|-------------|-----------------|
| No Previewed posts | Cannot review | "No posts ready for review. Run F-Formatting first?" |
| No Ready_ToPublish posts | Cannot publish | "No posts approved. Run C-Review first?" |
| Already published today | Cannot publish another | "Already published today. Next slot: tomorrow [date]." |
| LinkedIn token expired | Publish fails (one-shot) | "Token expired. Refresh in LinkedIn settings, then re-queue." |
| Duplicate URN detected | Guardrail blocks | "This post appears already published. Check LinkedIn." |
| Telegram down | Non-critical failure | "Published but Telegram notification failed. Post is live." |
| DB update fails after publish | Data inconsistency | "Published to LinkedIn but status update failed. Manual fix needed: post_id=[ID]" |
| Reschedule to already-filled date | Calendar conflict | "Mar 18 already has a post. Pick another date or swap?" |
| Edit breaks formatting rules | Needs re-format | "Edit changed char count to [N] (exceeds 1600). Auto-trim or adjust?" |

---

## Opportunities for Dashboard

1. **Review queue with urgency** — Posts due today highlighted in red, tomorrow in amber
2. **One-click approve all** — For batch review sessions, approve all with single action
3. **Publish countdown timer** — Visual timer showing delay countdown
4. **Publish history log** — Table of all published posts with URN links
5. **LinkedIn preview card** — Mock how the post will look in LinkedIn feed
6. **Failure recovery wizard** — Guided steps to recover from Publish_Failed status
7. **Calendar view integration** — See review/publish status overlaid on content calendar
