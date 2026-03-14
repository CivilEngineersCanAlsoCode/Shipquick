# Step F.1 — Pick Drafted Post

**Agent:** Pixel (flex-crafter)
**Trigger:** User says "Format karo", "Post format do", "Formatting shuru karo", or starts the F-ContentFormatting workflow. Session context loaded (Step 01), no interrupted sessions found (or user chose to pick a new post).

---

## What You Do

Fetch all posts with status `Drafted` from MongoDB via the `sma-fetch-post` webhook. Present them to the user as a numbered list. The user picks one post to format. You lock it by updating its status to `Formatting`, then hand off the full post object to F.2.

---

## Action 1: Fetch Drafted Posts

**POST** `https://n8n.linkright.in/webhook/sma-fetch-post`

### Request Payload
```json
{
  "status": "Drafted"
}
```

### Expected Response
```json
{
  "posts": [
    {
      "post_id": "67a1b2c3d4e5f6...",
      "title": "Why Most PMs Build Features Nobody Wants",
      "topic": "product-market-fit",
      "brief_summary": "Lesson from launching 3 failed features in 6 months",
      "scheduled_date": "2026-03-18",
      "raw_content": "I shipped 3 features last year...",
      "content_format": "storytelling",
      "hook_framework": "pattern-interrupt",
      "narrative_framework": "hero-journey",
      "cta_framework": "value-follow",
      "tone": "reflective-honest",
      "created_at": "2026-03-14T10:30:00Z",
      "status": "Drafted"
    }
  ]
}
```

---

## Action 2: Present Posts to User

**If `posts.length > 0`:**

Display a numbered list showing title, brief summary, and scheduled date for each post:

> "Yeh drafted posts hain jo format hone ke liye ready hain:"
>
> 1. **Why Most PMs Build Features Nobody Wants** — Lesson from launching 3 failed features (scheduled: 18 Mar)
> 2. **The 5am Myth That Nearly Broke Me** — Productivity culture vs burnout (scheduled: 19 Mar)
>
> "Kaun sa post format karna hai? Number bolo."

Wait for user to select a post by number.

**If `posts.length === 0`:**

> "Abhi koi drafted post nahi hai format karne ke liye. Pehle B-Drafting workflow se ek post draft karo, phir wapas aao!"

Do NOT proceed further. Exit the workflow.

**If `posts.length === 1`:**

Still present the single post and ask for confirmation. Do NOT auto-select:

> "Ek hi drafted post hai:"
>
> 1. **Why Most PMs Build Features Nobody Wants** — Lesson from launching 3 failed features (scheduled: 18 Mar)
>
> "Isko format karein? Haan ya nahi?"

---

## Action 3: Lock the Post (Status → Formatting)

Once the user selects a post, immediately update its status to `Formatting` to prevent another session from picking the same post.

**POST** `https://n8n.linkright.in/webhook/sma-update-post`

### Request Payload
```json
{
  "post_id": "67a1b2c3d4e5f6...",
  "status": "Formatting"
}
```

### Expected Response
```json
{
  "success": true,
  "post_id": "67a1b2c3d4e5f6...",
  "status": "Formatting"
}
```

**On success:**
> "Chaliye! '{title}' ko format karte hain. 🎯"

Store the full selected post object in working memory (including `raw_content`). Proceed to **F.2**.

---

## Validation Before Proceeding

Before handing off to F.2, verify the selected post has usable content:

1. **`raw_content` exists and is non-empty:** If empty or missing, halt:
   > "Is post mein raw content nahi hai — draft incomplete lag raha hai. B-Drafting mein wapas jaake draft complete karo."

   Revert status back to `Drafted` via `sma-update-post` and exit.

2. **`raw_content` length is at least 200 characters:** If too short, warn:
   > "Draft bahut chhota hai ({count} characters). Format karne mein mushkil hogi. B-Drafting mein expand karo pehle."

   Revert status and exit.

---

## Error Handling

**Fetch webhook fails (network error / non-200 response):**
> "Drafted posts fetch karne mein dikkat aa rahi hai. Thodi der mein retry karta hoon."

Retry once after 5 seconds. If it fails again:
> "Webhook respond nahi kar raha. Satvik, `SMA/Data/Read/FetchPost` check karo n8n mein."

Do NOT proceed if the fetch fails. The entire workflow depends on having posts.

**Status update webhook fails:**
> "Status update mein dikkat aayi. Post format toh karunga, but status `Formatting` set nahi hua — duplicate formatting ka risk hai. Manually check karna padega."

Proceed to F.2 anyway — formatting can still happen. The status lock is a safety mechanism, not a hard blocker. Log the failure for the user.

**User gives invalid selection (number out of range):**
> "Valid number daalo — 1 se {posts.length} ke beech."

Re-prompt. Do NOT default to any post.

---

## What NOT to Do

- ❌ Do NOT invent or hallucinate posts if the webhook returns empty
- ❌ Do NOT auto-select a post without user input (even if there's only 1)
- ❌ Do NOT show raw JSON to the user — always present formatted, readable output
- ❌ Do NOT proceed to F.2 without a valid post selected and stored in memory
- ❌ Do NOT skip the status update to `Formatting`
- ❌ Do NOT proceed if `raw_content` is empty — exit and suggest B-Drafting
- ❌ Do NOT format a post that is not in `Drafted` status

---

## Success Criteria

- [ ] Webhook called successfully and returned posts list
- [ ] User presented with readable numbered list (not raw JSON)
- [ ] User explicitly selected a post by number
- [ ] Selected post's status updated to `Formatting` in MongoDB
- [ ] Selected post's `raw_content` verified as non-empty (≥200 chars)
- [ ] Full post object stored in working memory for F.2

---

## Output for Next Step

Pass to **F.2**:
```
selected_post — full post object:
  - post_id
  - title
  - topic
  - brief_summary
  - raw_content (the draft text to format)
  - scheduled_date
  - content_format, hook_framework, narrative_framework, cta_framework, tone
  - created_at
```
