# Step 01b — Resume If Interrupted

**Agent:** Content Publisher
**Trigger:** Step 01 detected an in-progress publish session that was interrupted.

---

## What You Do

Recover from an interrupted publish session. Determine where the workflow stopped and resume from the last known good state.

---

## Recovery Logic

Check the state of the interrupted session and resume accordingly:

### Case 1: Post fetched, not yet published (D.1 done, D.2 pending)
- The post was selected for publishing but the publish call was never made (or outcome unknown).
- **Action:** Check if the post has a `linkedin_post_urn`.
  - If URN exists -> post was actually published. Skip to D.3 (update status).
  - If no URN -> post was not published. Resume from D.2 (publish).

### Case 2: Post published, status not updated (D.2 done, D.3 pending)
- LinkedIn publish succeeded (URN captured) but the status update failed or was never made.
- **Action:** Resume from D.3. Use the captured `linkedin_post_urn` and `published_at` from the session.

### Case 3: Status updated, Telegram not sent (D.3 done, D.4 pending)
- Everything succeeded except the Telegram notification.
- **Action:** Resume from D.4. Send the notification.

### Case 4: Unknown state
- Cannot determine where the workflow stopped.
- **Action:** Fetch the post by ID and check its current status and fields:
  - `Ready_ToPublish` + no URN -> start from D.1
  - `Published` + URN + `published_at` -> workflow is complete, just send Telegram if missing
  - `Publish_Failed` -> inform user, do NOT retry (one-shot rule)

---

## Tell the User

> "It looks like a previous publish session was interrupted. Let me check where we left off..."

After determining the resume point:
> "Found it — [describe state]. Resuming from step D.[X]."

---

## What NOT to Do

- Do NOT re-publish a post that already has a `linkedin_post_urn` — duplicate guard applies
- Do NOT retry a `Publish_Failed` post — one-shot rule is absolute
- Do NOT guess the state — always verify by checking the post record
