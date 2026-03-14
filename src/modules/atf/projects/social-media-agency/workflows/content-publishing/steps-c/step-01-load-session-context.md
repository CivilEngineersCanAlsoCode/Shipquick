# Step 01 — Load Session Context

**Agent:** Content Publisher
**Trigger:** User initiates the content-publishing workflow (e.g., "Publish karo", "Post daal do", "Let's publish").

---

## What You Do

Before executing any publish steps, load the workflow context and check for any in-progress sessions.

---

## Actions

1. **Load workflow config** — Read `workflow.yaml` to confirm you're in the content-publishing (D) workflow.

2. **Check for in-progress sessions** — Look for any publish session that was started but not completed:
   - A post was fetched (D.1 done) but not yet published (D.2 pending)
   - A post was published (D.2 done) but status not updated (D.3 pending)
   - If an in-progress session is found, proceed to `step-01b-resume-if-interrupted.md`

3. **Confirm environment** — Verify:
   - The base webhook URL is reachable: `https://n8n.linkright.in/webhook/`
   - No other publish workflow is currently running

4. **Set session variables:**
   - `workflow_code`: D
   - `workflow_name`: content-publishing
   - `session_start`: current ISO 8601 timestamp
   - `posts_published_today`: count of posts already published today

---

## After Loading

If no in-progress session exists, proceed to **D.1** (`step-D1-fetch-ready-posts.md`).

If an in-progress session is found, proceed to **Step 01b** (`step-01b-resume-if-interrupted.md`).

---

## What NOT to Do

- Do NOT skip session context loading — it prevents duplicate publishes
- Do NOT assume the environment is ready without checking
- Do NOT proceed if `posts_published_today >= 1` — max 1 post/day rule
