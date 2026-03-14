# Step C.2 — Preview Post & Get User Decision

**Agent:** Content Strategist (Echo)
**Trigger:** Automatically after C.1 for each post in `posts_to_review[]`.

---

## What You Do

For each post, you display the full formatted preview exactly as it will appear on LinkedIn, show all metadata, and ask the user to make a decision: approve, edit, reschedule, or drop.

---

## Action: Display Formatted Preview

For the current post (`posts_to_review[current_post_index]`), present:

### 1. Metadata Header

> **Post {current_post_index + 1} of {total_posts}**
>
> | Field | Value |
> |-------|-------|
> | Topic | {topic} |
> | Content Pillar | {content_pillar} |
> | Scheduled Date | {scheduled_date} (formatted as "Mon, 15 Mar 2026 at 10:00 AM IST") |
> | Channel | {channel} |
> | Format | {frameworks_used.content_format} |
> | Hook | {frameworks_used.hook} |
> | Narrative | {frameworks_used.narrative} |
> | CTA | {frameworks_used.cta} |
> | Tone | {frameworks_used.tone} |

### 2. Content Preview (Code Block)

Display `formatted_content` inside a code block so the user sees exact formatting — line breaks, spacing, staircase formatting, emojis, hashtags — exactly as LinkedIn will render it:

```
{formatted_content}
```

### 3. Quick Stats

> - Characters: {char_count} / 1600 max
> - Emojis: {emoji_count} / 3 max
> - Hashtags: {hashtag_count}

### 4. Decision Prompt

> "Kya karna hai is post ke saath?"
>
> 1. **Approve** — As-is publish hoga scheduled date pe
> 2. **Edit** — Minor changes karne hain (typo, word change, line tweak)
> 3. **Reschedule** — Date/time change karna hai
> 4. **Drop** — Post cancel karo, publish nahi karna
> 5. **Send Back** — Major rework needed, back to drafting

---

## Processing Each Decision

### Decision 1: Approve

**POST** `https://n8n.linkright.in/webhook/sma-update-post`

```json
{
  "post_id": "{_id}",
  "updates": {
    "status": "Ready_ToPublish",
    "reviewed_at": "{ISO_timestamp}",
    "review_decision": "approved"
  }
}
```

**On success:**
> "Post approved! n8n {scheduled_date} ko auto-publish karega."

Increment `approved_count`. Proceed to next post or **C.4** if all done.

**On failure:**
> "Approve save nahi hua — retry karta hoon."

Retry once. If still fails, log the error and ask user if they want to skip or retry manually.

---

### Decision 2: Edit (Minor)

Ask the user:
> "Kya change karna hai? Content paste karo ya specific line batao."

→ Proceed to **C.3** (Apply Minor Edits) with the current post and user's edit instructions.

---

### Decision 3: Reschedule

Ask the user:
> "Nayi date/time batao (e.g., '17 March 10am', 'kal 2pm', 'next Monday')."

Parse the user's date input. Convert to ISO format. Check for conflicts:

**POST** `https://n8n.linkright.in/webhook/sma-fetch-post`

```json
{
  "status": "Ready_ToPublish",
  "scheduled_date": "{new_date_YYYY-MM-DD}"
}
```

**If conflict found (another post on same date):**
> "Us din already ek post scheduled hai: '{conflicting_topic}'. Max 1 post/day hai. Doosri date choose karo."

Re-ask for date. Do NOT allow scheduling conflicts (max 1 post/day constraint).

**If no conflict:**

**POST** `https://n8n.linkright.in/webhook/sma-update-post`

```json
{
  "post_id": "{_id}",
  "updates": {
    "scheduled_date": "{new_ISO_date}",
    "reviewed_at": "{ISO_timestamp}",
    "review_decision": "rescheduled",
    "previous_scheduled_date": "{old_ISO_date}"
  }
}
```

**On success:**
> "Post rescheduled to {new_date_formatted}."

Increment `rescheduled_count`. Proceed to next post or **C.4**.

---

### Decision 4: Drop

Confirm with user before dropping (irreversible action):
> "Sure ho? '{topic}' cancel ho jayega aur publish nahi hoga. (haan/nahi)"

**If confirmed:**

**POST** `https://n8n.linkright.in/webhook/sma-update-post`

```json
{
  "post_id": "{_id}",
  "updates": {
    "status": "Cancelled",
    "reviewed_at": "{ISO_timestamp}",
    "review_decision": "dropped",
    "cancelled_reason": "user_review_drop"
  }
}
```

**On success:**
> "Post cancelled. Slot {scheduled_date} ab free hai."

Increment `dropped_count`. Proceed to next post or **C.4**.

**If user says nahi:** Go back to decision prompt for this post.

---

### Decision 5: Send Back (Major Rework)

This is for posts that need fundamental rewriting — not just a typo fix.

> "Post wapas B-ContentDrafting bhej raha hoon. Topic aur brief retain hoga, bas content dobara likhna padega."

**POST** `https://n8n.linkright.in/webhook/sma-update-post`

```json
{
  "post_id": "{_id}",
  "updates": {
    "status": "Scheduled_NoDraft",
    "reviewed_at": "{ISO_timestamp}",
    "review_decision": "sent_back",
    "draft_content": "",
    "formatted_content": "",
    "send_back_reason": "{user's reason if provided}"
  }
}
```

**On success:**
> "Post wapas drafting queue mein hai. B-ContentDrafting mein pick hoga."

Increment `dropped_count`. Proceed to next post or **C.4**.

---

## Moving to Next Post

After processing a decision:

1. Increment `current_post_index`.
2. If `current_post_index < posts_to_review.length` → repeat C.2 for next post.
3. If all posts reviewed → proceed to **C.4** (Finalize Review).

Between posts, brief transition:
> "Agli post ({current_post_index + 1} of {total})..."

---

## Error Handling

**If any `sma-update-post` call fails:**
> "Update save nahi hua. Retry karta hoon..."

Retry once after 3 seconds. If still fails:
> "MongoDB update fail ho raha hai. Satvik, n8n check karo (`SMA/Data/Write/UpdatePost`). Is post ko skip karke agle pe chalein?"

If user says skip — mark this post as "skipped" in local state and move on. At the end (C.4), remind about skipped posts.

**If user input is ambiguous (e.g., "theek hai"):**
> "Confirm karo — approve matlab as-is publish, ya kuch edit karna hai?"

Always disambiguate before making webhook calls.

---

## What NOT to Do

- Do NOT auto-approve any post — every post needs explicit user confirmation
- Do NOT apply edits without showing the user the result first (that's C.3's job)
- Do NOT drop a post without double-confirmation from the user
- Do NOT allow scheduling on a date that already has a post (1 post/day max)
- Do NOT show `draft_content` — always show `formatted_content` (the formatted version is what will be published)
- Do NOT proceed past a post without a clear decision — no post should be left in limbo
- Do NOT make up or modify content on your own — only apply changes the user explicitly requests

---

## Output for Next Step

Pass to **C.3** (if edit chosen):
```
current_post           — the full post object being edited
edit_instructions       — user's requested changes (text)
```

Pass to **C.4** (when all posts done):
```
posts_to_review[]      — full array with decisions recorded
approved_count         — count of approved posts
edited_count           — count of edited posts
rescheduled_count      — count of rescheduled posts
dropped_count          — count of dropped + sent-back posts
skipped_posts[]        — any posts that had webhook failures (if any)
```
