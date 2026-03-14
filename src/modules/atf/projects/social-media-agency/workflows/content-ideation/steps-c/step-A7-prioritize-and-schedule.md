# Step A.7 — Prioritize & Schedule

**Agent:** Content Strategist  
**Runs After:** A.6 (user confirmed selected briefs)

---

## What You Do

Figure out which of the next 3 days are open for LinkedIn posts. Load the posting schedule config. Assign each selected brief to an open slot in score order, respecting content pillar balance and day-of-week preferences. Present the schedule to the user and get confirmation.

---

## ACTION 1: Check Open Slots (A.7.a)

**POST** `https://n8n.linkright.in/webhook/sma-fetch-past-posts`

```json
{
  "days": 3,
  "channel": "linkedin",
  "include_scheduled": true
}
```

**Expected Response:**
```json
{
  "posts": [
    {
      "title": "Already scheduled post",
      "content_pillar": "career",
      "scheduled_date": "2026-03-14",
      "status": "Scheduled_NoDraft"
    }
  ]
}
```

From this, identify which of the next 3 calendar days already have a post scheduled.

**Open slots** = next 3 days that do NOT already have a LinkedIn post.

If all 3 days are occupied:
> "Agle 3 din ke slots already full hain! Kya aage ke dates pe schedule karein? (haan/nahi)"
- "Haan" → extend the window by 3 more days (call again with `"days": 6`)
- "Nahi" → ask user to manually pick dates

---

## ACTION 2: Load Posting Schedule Config (A.7.b)

**POST** `https://n8n.linkright.in/webhook/sma-fetch-config`

```json
{
  "doc_ids": ["posting_schedule"]
}
```

**Expected Response:**
```json
{
  "posting_schedule": {
    "default_posting_time": "09:00",
    "timezone": "Asia/Kolkata",
    "platform_defaults": {
      "linkedin": "09:00"
    },
    "day_preferences": {
      "mon": "story_insight",
      "tue": "story_insight",
      "wed": "story_insight",
      "thu": "howto_framework",
      "fri": "light_hottake"
    }
  }
}
```

Store as `posting_schedule` in working memory.

---

## Assignment Logic (you compute this — no webhook)

Sort `selected_briefs[]` by `scores.total` descending — highest score gets first/earliest slot.

For each brief, assign to the earliest open slot, but apply these rules:

1. **Day-of-week preference:** Match `day_preferences` to brief's `content_pillar`.  
   - Mon/Tue/Wed prefers: `career`, `startup`, `pm` (story/insight type)  
   - Thu prefers: `howto`, `framework`  
   - Fri prefers: `hottake`  
   - It's OK if preference doesn't match — just flag it as a note, don't block.

2. **Pillar balance:** Don't assign same content pillar to back-to-back days if avoidable.  
   If conflict exists: flag it — "Dono career posts back-to-back hain, swap karein?"

3. **Posting time:** Use `posting_schedule.platform_defaults.linkedin` for all posts (default: "09:00").

4. **Timezone:** Always use `posting_schedule.timezone` (default: "Asia/Kolkata").

---

## Present Schedule to User

> "📅 **Suggested Schedule:**
> 
> **[Day, Date]** — [topic] (Score: [X]/[max], [content_pillar])
> **[Day, Date]** — [topic] (Score: [X]/[max], [content_pillar])
> **[Day, Date]** — [topic] (Score: [X]/[max], [content_pillar])
> 
> Sab posts 9:00 AM IST pe schedule hain.
> 
> [If pillar conflict] ⚠️ Day 1 aur Day 2 dono career posts hain — swap karein?
> 
> Confirm? (haan / shuffle / [topic] hata do / time change karo)"

Handle responses:

**"Haan" / "confirm":**
→ Proceed to **A.8**

**"Shuffle":**
Reassign slots in a different order. Re-present.

**"[topic] hata do":**
Remove that post from the schedule. Remaining posts stay. Re-present.
If 0 posts remain → go back to A.6 PART 6 (fetch more).

**"Time change karo [day] to [HH:MM]":**
Update that slot's time. Re-present.

**"Date change karo [topic] to [date]":**
Update that specific post's date. Check for conflicts. Re-present.

---

## Error Handling

**If A.7.a (FetchPastPosts) fails:**
> "Scheduled posts check nahi ho paye."

Retry once. If still failing:
> "`SMA/Data/Read/FetchPastPosts` down lag raha hai. Manually bata do — koi posts scheduled hain agle 3 din mein?"

Take user input and proceed with manually provided dates.

**If A.7.b (FetchConfig/posting_schedule) fails:**
Use fallback defaults: `time = "09:00"`, `timezone = "Asia/Kolkata"`, no day preferences.
> "Posting config load nahi ho payi — default 9 AM IST use kar raha hoon."

Do NOT block on this failure.

---

## What NOT to Do

- ❌ Do NOT assign multiple posts to the same date
- ❌ Do NOT use a date that already has a scheduled post (unless user explicitly says to override)
- ❌ Do NOT change posting time without the user asking
- ❌ Do NOT proceed to A.8 until user explicitly confirms the schedule
- ❌ Do NOT assume content pillar from the topic name — use `content_pillar_hint` from the brief if available, otherwise ask the user

---

## Output for Next Step

Pass to **A.8**:
```
scheduled_posts[] — each post confirmed by user:
  {
    row_id,
    topic,
    content_pillar,
    scheduled_date,   // "YYYY-MM-DD"
    scheduled_time,   // "HH:MM"
    timezone,         // "Asia/Kolkata"
    scores,           // { freshness, personal_experience, research_quality, total }
    linked_experiences,  // [ObjectId]
    additional_context   // any notes/context shared by user in A.6
  }
```
