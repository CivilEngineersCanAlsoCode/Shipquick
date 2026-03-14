# Step B.2 — Generate Draft

**Agent:** Content Strategist
**Runs After:** B.1 (post confirmed by user)

---

## What You Do

This is the most complex step. You gather ALL context (research, experiences, top posts, frameworks), let the user choose their preferred frameworks, then generate the first draft. Two phases: **Context Gathering** then **Draft Generation**.

---

## PHASE 1: Context Gathering (3 parallel webhook calls + framework loading)

Make these calls to gather the full picture before writing a single word.

### B.2.a — Fetch Original Brief (if source_brief_id exists)

**POST** `https://n8n.linkright.in/webhook/sma-fetch-briefs`

```json
{
  "row_id": "[selected_post.source_brief_id]"
}
```

**Expected Response:**
```json
{
  "briefs": [
    {
      "row_id": "1773448434682",
      "topic": "Why I turned down PWC to bet on myself",
      "research_data": "67% of professionals regret not taking career risks...",
      "why_relevant": "Personal career story with data backing",
      "target_audience": "Early career professionals, PMs",
      "reference_links": "https://..., https://...",
      "has_stats": true,
      "has_quotes": false,
      "has_trend": true,
      "has_data": true
    }
  ]
}
```

**If source_brief_id is null/missing:** Skip this call. Note that we have no research data — the draft will rely more on experience and user context.

**If call fails:** Log and continue — brief research is helpful but not blocking.

---

### B.2.b — Deep Experience Search

**POST** `https://n8n.linkright.in/webhook/sma-search-experiences`

```json
{
  "queries": [
    "[selected_post.title]",
    "[selected_post.content_pillar] personal story",
    "[selected_post.additional_context]"
  ],
  "limit": 3,
  "min_similarity": 0.80
}
```

Only include the `additional_context` query if it exists and is non-empty. If it's null, send only 2 queries.

**Expected Response:**
```json
{
  "results": [
    {
      "query": "Why I turned down PWC to bet on myself",
      "experiences": [
        {
          "_id": "exp_001",
          "text": "Had PWC offer in hand. Everyone said take it. Declined it.",
          "similarity": 0.94,
          "tags": ["career", "risk"],
          "date": "2025-11-15"
        }
      ]
    }
  ]
}
```

Also check `selected_post.linked_experiences[]` — these are experiences already linked during ideation. Include them in context even if vector search doesn't return them.

**If call fails:** Continue with whatever experiences are in `linked_experiences[]`. If none exist, note that draft will lack personal stories — inform user.

---

### B.2.c — Top 5 Performing Posts (Tone Reference)

**POST** `https://n8n.linkright.in/webhook/sma-fetch-past-posts`

```json
{
  "days": 30,
  "channel": "linkedin",
  "top_performing": true,
  "limit": 5
}
```

**Expected Response:**
```json
{
  "posts": [
    {
      "_id": "post_abc",
      "title": "Why rejection is your best teacher",
      "content": "Full post text...",
      "metrics": { "likes": 45, "comments": 96, "shares": 23 },
      "engagement_score": 437,
      "scheduled_date": "2026-03-01"
    }
  ]
}
```

Engagement score formula: `likes + (comments × 3) + (shares × 2)`

**If call fails or returns empty:** Continue without tone reference. Draft using general Satvik voice guidelines.

---

### B.2.d — Load Framework CSVs (local file read, no webhook)

Read ALL 7 framework CSVs + content-methods.csv from the local `frameworks/` directory:

| File | Items | Purpose |
|------|-------|---------|
| `content-formats.csv` | 35 | Post structure (Story-to-Insight, Listicle, etc.) |
| `hook-frameworks.csv` | 35 | Opening lines (Question, Bold Statement, etc.) |
| `narrative-frameworks.csv` | 32 | Story structure (AIDA, Problem-Solution, etc.) |
| `cta-frameworks.csv` | 32 | Closing engagement prompts |
| `tone-frameworks.csv` | 32 | Voice/style (Casual-Witty, Reflective, etc.) |
| `positioning-templates.csv` | 32 | Author positioning lines |
| `formatting-rules.csv` | 15 | Visual formatting rules |
| `content-methods.csv` | 60 | Content creation methods |

Path: `src/modules/atf/projects/social-media-agency/frameworks/[file].csv`

---

## PHASE 2: AI Curates Top Frameworks

For each of the 7 framework CSVs (NOT formatting-rules or content-methods), analyze the post's topic, pillar, tone of top-performing posts, and curate the **top 3-5 most relevant options**. Do NOT dump all 35 options on the user.

### Curation Criteria

For each framework CSV, pick 3-5 entries based on:
1. **Pillar match** — does the framework's `best_for` field match the post's `content_pillar`?
2. **Engagement level** — prefer `high` engagement frameworks
3. **Top post alignment** — what formats/hooks/tones did the top 5 performing posts use?
4. **Topic fit** — does this framework naturally suit the topic?

### B.2.e — Present Curated Frameworks to User

Show each category with curated options. User picks 1 from each:

> "Framework choices for '[post title]':
>
> **1. Content Format** (post structure):
>    a) Story-to-Insight — Personal story ending with transferable lesson
>    b) Before-After — Transformation narrative
>    c) Hot-Take — Bold opener, reasoning, nuanced conclusion
>
> **2. Hook Type** (opening 2 lines):
>    a) Question-Hook — 'What would you do with a PWC offer at 22?'
>    b) Bold-Statement — 'I turned down the safest job in India.'
>    c) Counter-Intuitive — 'The worst career move became my best.'
>
> **3. Narrative Framework** (story structure):
>    a) AIDA — Attention, Interest, Desire, Action
>    b) Hero-Journey — Challenge, struggle, transformation
>    c) Problem-Solution — Present problem, share fix
>
> **4. CTA Type** (closing):
>    a) Open-Question — 'Have you ever turned down a safe choice?'
>    b) Reflection — 'What's your hardest career decision?'
>    c) Poll — 'Agree or disagree?'
>
> **5. Tone** (voice/style):
>    a) Casual-Witty — Relaxed with clever wordplay
>    b) Reflective-Honest — Thoughtful vulnerability
>    c) Motivational-Direct — Energetic, action-oriented
>
> **6. Positioning** (author tagline):
>    a) 'PM by day. Builder by night.'
>    b) 'Writing about career bets that paid off.'
>    c) 'Sharing real PM stories, no BS.'
>
> Har category se 1 pick karo (number+letter, e.g., '1a, 2b, 3a, 4a, 5b, 6a')
> Ya 'auto' bolo toh main best combo pick karunga."

### User Responses

**User picks explicitly ("1a, 2b, 3a, 4a, 5b, 6a"):**
→ Use exactly those selections

**User says "auto" / "tu decide kar":**
→ AI picks the best combo based on curation criteria. Show what was picked:
> "Auto-picked: Story-to-Insight + Bold Statement + Hero Journey + Open Question + Casual-Witty + PM positioning"

**User picks some, leaves some ("1a, 2b, rest auto"):**
→ Use explicit picks for stated ones, auto-pick the rest

---

## PHASE 3: Fetch Matching Experiences for Selected Frameworks

After framework selection, do one final targeted vector search using the selected frameworks as context:

**POST** `https://n8n.linkright.in/webhook/sma-search-experiences`

```json
{
  "queries": [
    "[post title] + [selected hook description]",
    "[post content_pillar] + [selected narrative description]"
  ],
  "limit": 2,
  "min_similarity": 0.80
}
```

This refines the experience pool to match the chosen creative direction. Merge with B.2.b results, deduplicate by `_id`.

**If call fails:** Use experiences from B.2.b only. Not blocking.

---

## PHASE 4: User Additions (Optional)

### B.2.f — Check if User Wants to Add Context

> "Kuch aur add karna hai? (personal story, specific angle, data point)
> Ya seedha draft likhun?"

**User says "seedha likh" / "no" / "bas":**
→ Proceed to PHASE 5

**User shares a new experience:**
→ Run DUPLICATE DETECTION before saving:

#### Duplicate Detection Flow

**Step 1: Vector search for duplicates**

**POST** `https://n8n.linkright.in/webhook/sma-search-experiences`

```json
{
  "queries": ["[user's shared experience text]"],
  "limit": 1,
  "min_similarity": 0.80
}
```

**Step 2: Evaluate similarity**

| Similarity | Action | User Message |
|-----------|--------|-------------|
| > 0.95 | DUPLICATE — do NOT save | "Ye experience already saved hai: '[matched text first 100 chars]...' Duplicate save nahi kar raha." |
| 0.80 - 0.95 | SIMILAR — ask user | "Ek similar experience mila: '[matched text first 100 chars]...' Ye naya hai ya wahi? Save karun?" |
| < 0.80 | NEW — save directly | "Naya experience! Saving..." |

**Step 3: Save if confirmed new**

**POST** `https://n8n.linkright.in/webhook/sma-save-experience`

```json
{
  "date": "[today's date YYYY-MM-DD]",
  "text": "[user's experience text]",
  "tags": ["[content_pillar]", "[relevant keywords]"],
  "source": "user_shared_during_drafting",
  "generate_embedding": true
}
```

**Expected Response:** `{ "success": true, "_id": "ObjectId" }`

> "Experience save ho gayi! Draft mein use karunga."

**If save fails:** Log and continue. Experience text is still in context for draft generation.

**User shares a specific angle or data point (not an experience):**
→ Note for draft generation context. No webhook call needed.

---

## PHASE 5: Generate First Draft (BMAD Computation — no n8n)

Using ALL gathered context, generate the LinkedIn post:

### Input Context for Generation

```
1. Post metadata: title, content_pillar, scores, additional_context
2. Brief research: stats, trends, data, reference links (from B.2.a)
3. Personal experiences: matched stories with similarity scores (from B.2.b + B.2.f)
4. Top performing posts: content + engagement data for tone reference (from B.2.c)
5. Selected frameworks:
   - Content Format: [selected]
   - Hook: [selected]
   - Narrative: [selected]
   - CTA: [selected]
   - Tone: [selected]
   - Positioning: [selected]
6. Formatting rules: from formatting-rules.csv (applied in F-ContentFormatting, but keep awareness)
```

### LinkedIn Post Structure

```
┌─────────────────────────────────────┐
│ HOOK (first 2 lines)               │
│ ← Shows in feed without "see more" │
│ ← ~210 chars max                   │
│ ← Must make reader click           │
├─────────────────────────────────────┤
│ BODY                                │
│ ← Story / insight / data            │
│ ← Short paragraphs (1-2 sentences) │
│ ← Line breaks between paragraphs   │
│ ← Personal experience woven in     │
├─────────────────────────────────────┤
│ KEY TAKEAWAY                        │
│ ← 1-2 lines of distilled insight   │
├─────────────────────────────────────┤
│ CTA                                 │
│ ← Question/prompt for engagement   │
├─────────────────────────────────────┤
│ POSITIONING + FOLLOW                │
│ ← Author tagline + follow prompt   │
├─────────────────────────────────────┤
│ HASHTAGS (3-6 relevant)             │
└─────────────────────────────────────┘
```

### Draft Constraints (v1 — LinkedIn)

- Sweet spot: 800-1600 characters (will be validated in B.3)
- First 2 lines visible: ~210 chars
- No markdown rendering on LinkedIn
- Emoji: max 3, at tension/transition points only
- Line breaks: use liberally for readability
- English only (v1)
- First person always ("I", not "we")

### Tone Guidelines (Satvik's Voice)

- Casual but not sloppy — professional friend, not corporate robot
- Humor through observation, not forced jokes
- Vulnerability is strength — share the struggle, not just the win
- Data supports story, never replaces it
- Short sentences. Line breaks. Breathing room.

### Present Draft to User

> "Draft v1:
>
> ```
> [Full post text inside code block for accurate preview]
> ```
>
> ---
> Stats:
> - Characters: [char_count] (target: 800-1600)
> - Words: [word_count]
> - Hook: [selected hook name]
> - CTA: [selected CTA name]
> - Format: [selected format name]
> - Tone: [selected tone name]
> - Experiences used: [count]
>
> Kaisa laga? Tweak karna hai kuch?"

---

## Error Handling Summary

| Webhook | On Failure | Impact |
|---------|-----------|--------|
| sma-fetch-briefs (B.2.a) | Log, continue | No research data — draft relies on experiences + user context |
| sma-search-experiences (B.2.b) | Log, continue | Use linked_experiences only. Warn user if none exist |
| sma-fetch-past-posts (B.2.c) | Log, continue | No tone reference — use default Satvik voice |
| sma-search-experiences (B.2.f dup check) | Skip save, use text in context | Experience not saved but still used in draft |
| sma-save-experience (B.2.f) | Log, continue | Experience text in context anyway |
| All 3 main calls fail | Still generate draft using post metadata + frameworks only. Warn user: "Context gathering mein issues aaye, basic draft bana raha hoon. Baad mein refine karenge." |

---

## What NOT to Do

- Do NOT dump all 35 options from each CSV — curate to 3-5 per category
- Do NOT skip the framework selection step — user MUST pick (or say "auto")
- Do NOT generate the draft before gathering context — all 3 webhook calls first
- Do NOT include formatting rules in the draft (that's F-ContentFormatting's job) — but keep char count in range
- Do NOT use bold/italic/underline in the draft text — LinkedIn doesn't render markdown
- Do NOT show raw JSON or webhook responses to the user
- Do NOT proceed to B.3 without showing the user the first draft
- Do NOT add more than 3 emojis in the draft
- Do NOT write in third person — always first person (I, my, me)

---

## Output for Next Step

Pass to **B.3**:
```
selected_post       — original post object (from B.1)
draft_v1            — full draft text
draft_metadata      — { char_count, word_count, hook_type, cta_type, format, tone, positioning,
                        hashtags, experiences_used: [_id], engagement_inspiration: [post_id] }
context             — { brief_data, experiences[], top_posts[], selected_frameworks }
iteration_count     — 1
```
