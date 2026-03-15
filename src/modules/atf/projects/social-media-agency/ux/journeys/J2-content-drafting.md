# J2 — Content Drafting Journey Map

**Workflow:** B (Content Drafting) — 4 steps
**Agent:** Scout (flex-ideator)
**Trigger:** User says "Draft karo" or "Let's draft"
**Entry status:** Post exists with status=Scheduled_NoDraft
**Exit status:** Post updated to status=Drafted in MongoDB + Sheet updated

---

## Journey Overview

```
Pick post from    Load context &      User selects       Iterative         Finalize &
queue          →  fetch frameworks  →  1 per category  →  refinement     →  save draft
(B.1)             (B.2 auto)          (B.2 interactive)  (B.3, max 5x)    (B.4)
```

---

## Step-by-Step Journey

### B.1: Pick Post — Quick selection, ~30 seconds

| Aspect | Detail |
|--------|--------|
| **User action** | Says "Draft karo" |
| **System action** | Fetch earliest Scheduled_NoDraft post |
| **Webhook** | `POST /sma-fetch-post` (status=Scheduled_NoDraft, limit=1) |
| **User sees** | Post card: title, scheduled_date, content_pillar, score, linked experience |
| **User decision** | Confirm this post or skip to next |

**Presented to user:**
```
📝 Next post to draft:

"Why PMs should learn SQL"
  Scheduled: Mon Mar 16 | Pillar: Skill-Building | Score: 134/160
  Experience: "Built a dashboard query that saved 40hrs/month"

Draft this one? (y/skip)
```

**Emotion:** Purposeful — "Good, I know what I'm working on"
**Pain point:** If multiple posts are queued, user may want to pick a specific one (not just the earliest)

### B.2: Context Loading + Framework Selection — 3–8 minutes

#### Phase 2a: Auto-fetch context (~15 seconds)

| Aspect | Detail |
|--------|--------|
| **System action** | Parallel fetch: brief details, semantic search (3 queries × top 3), top 5 past posts |
| **Webhooks** | `POST /sma-fetch-briefs` + `POST /sma-search-experiences` (3 queries) + `POST /sma-fetch-past-posts` (top_performing, limit=5) |
| **User sees** | "Loading context... fetching experiences, past posts, and frameworks" |

#### Phase 2b: Framework selection — Interactive, 2–5 minutes

Agent loads 8 framework CSVs, AI curates top 3–5 per category based on brief/pillar/past performance, user picks 1 from each of 6 categories.

**User sees (6 sequential selections):**

```
🎯 HOOK FRAMEWORK (pick 1)
  Curated for "Why PMs should learn SQL" (Skill-Building pillar):

  1. Contrarian Statement — "Most PMs don't need SQL. Wrong."
  2. Story Hook — "2 AM. Dashboard broken. No engineer awake."
  3. Question Hook — "Can you answer this with data, not opinions?"

  Pick (1-3) or 'more' for full list:
```

**Categories presented sequentially:**
1. **Content Format** (from 35 options → top 3–5 curated)
2. **Hook Framework** (from 35 → top 3–5)
3. **Narrative Framework** (from 32 → top 3–5)
4. **CTA Framework** (from 32 → top 3–5)
5. **Tone Framework** (from 32 → top 3–5)
6. **Positioning Template** (from 32 → top 3–5)

**After all 6 selections, AI generates first draft.**

**Emotion:** Creative, engaged — "I'm shaping the voice of this post"
**Pain point:** 6 sequential selections feels long; on a quick break, user may want "auto-pick best" option
**Opportunity:** "Quick draft" mode that auto-selects top-ranked framework per category

### B.3: Iterative Refinement — 2–10 minutes (1–5 iterations)

| Aspect | Detail |
|--------|--------|
| **User action** | Reviews draft, provides feedback ("Make the hook shorter", "Add more personal touch") |
| **System action** | AI revises draft, re-checks quality gates |
| **Webhook** | `POST /sma-update-post` (save intermediate, status=Drafting) |
| **Iteration limit** | Max 3 AI-suggested revisions, hard cap 5 total |

**Quality gates checked each iteration:**
- Character count: 800–1600 ASCII
- FK Grade 7 readability
- Hook length: ≤210 characters
- Personal experience reference present
- CTA + positioning included

**User sees (per iteration):**
```
📝 Draft v2 (revised per your feedback)

[Full draft in code block]

Stats: 1,247 chars | FK Grade 6.8 | Hook: 89 chars
Quality: ✅ All gates passed

Options:
  1. Approve draft
  2. Request changes (describe what to adjust)
  3. Start over with different frameworks
```

**Emotion curve:**
- v1: "Hmm, not quite right" → provides feedback
- v2: "Getting closer" → minor tweaks
- v3: "This is good!" → approves

**Pain point:** Hard cap of 5 iterations may frustrate if user is exploring significantly different directions
**Opportunity:** Show diff between versions to highlight what changed

### B.4: Finalize & Save — ~15 seconds

| Aspect | Detail |
|--------|--------|
| **User action** | Approves final draft |
| **System action** | Save to MongoDB (status=Drafted), update Google Sheet, present metadata |
| **Webhooks** | `POST /sma-update-post` (status=Drafted) + `POST /sma-update-sheet-status` |

**User sees:**
```
✅ Draft finalized!

"Why PMs should learn SQL"
  Status: Drafted | Chars: 1,247 | Iterations: 2
  Hook: Contrarian Statement | Tone: Conversational
  Format: Story-to-Insight | CTA: Follow + Engage

  Metadata saved: char_count, word_count, hook_type, cta_type,
                  tone, format, iteration_count

Next: "Format karo" to start F-ContentFormatting
```

**Emotion:** Accomplished — "One more post in the pipeline"

---

## Touchpoint Map

| Touchpoint | Channel | Interaction Type |
|------------|---------|-----------------|
| Trigger drafting | ChatGPT (LinkRight HQ) | Conversational command |
| Post selection | ChatGPT | Confirm/skip |
| Framework selection (×6) | ChatGPT | Numbered menu (×6 categories) |
| Draft review | ChatGPT | Read full draft in code block |
| Feedback | ChatGPT | Free-text revision instructions |
| Approval | ChatGPT | Numbered option or "approve" |

---

## Emotion Curve

```
High  ·                                    ·  ← Draft approved (accomplished)
      ·                                  ·
      ·     ← Framework selection      ·
      ·       (creative, engaged)    ·
Mid   ·  ·························
      ·                          ·  ← v1 "not quite" (mild frustration)
      ·                        ·
Low   ·  ← 6 selections feels long if time-constrained
```

---

## Error States & Edge Cases

| Condition | User Impact | System Response |
|-----------|-------------|-----------------|
| No Scheduled_NoDraft posts | Cannot draft | "No posts queued for drafting. Run ideation first?" |
| Experience match < 0.80 for all queries | Weaker draft | "No strong experience match. Draft without personal story, or add one now?" |
| Draft exceeds 1600 chars | Quality gate fail | "Draft is [N] chars (max 1600). Trimming..." + auto-suggest cuts |
| Draft below 800 chars | Quality gate fail | "Draft is only [N] chars (min 800). Expanding..." + suggest additions |
| FK readability > Grade 9 | Quality gate fail | "Readability is Grade [N] (target: 7). Simplifying language..." |
| User hits 5-iteration cap | Cannot revise further | "Iteration limit reached. Approve current draft or start over?" |
| Webhook timeout during save | Draft may be lost | Auto-save intermediate draft to MongoDB before each iteration |
| User wants to add experience mid-draft | Interrupts B.2/B.3 | Support inline: `POST /sma-save-experience` → re-generate with new context |

---

## Opportunities for Dashboard

1. **Draft queue widget** — Show Scheduled_NoDraft posts with countdown to scheduled_date
2. **Framework usage history** — "You've used Contrarian Statement 4 times this month" → variety nudge
3. **Draft progress tracker** — Visual indicator of iteration count and quality gate status
4. **Quick draft mode** — Auto-select top-performing frameworks, skip the 6-step selection
5. **Version history** — Side-by-side diff of draft iterations for a given post
6. **Time-to-draft metric** — Track how long drafting takes per post, show trends
