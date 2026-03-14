# B-ContentDrafting — Detailed Implementation Plan

> **Version:** 1.1
> **Created:** 2026-03-14
> **Status:** Planning
> **Scope:** LinkedIn only (v1)
> **Depends on:** A-ContentIdeation (must have scheduled posts)

---

## 1. Overview

Content Drafting is the second BMAD workflow in the SMA module. It takes the **earliest undrafted scheduled post** (status: `Scheduled_NoDraft`) and turns it into a publish-ready LinkedIn post through collaborative AI-human writing.

**Key design decisions:**
- **One post at a time** — no list, no choice. Earliest undrafted post auto-selected
- **Draft one day before** — kal ki post aaj draft karo
- **Top 5 performing posts** as tone reference (engagement-weighted)
- **Duplicate experience detection** before saving user-shared experiences
- **Vector search threshold: 0.80** minimum similarity

### Architecture Rules (inherited)
- **Claw (BMAD agent) has ZERO direct DB/API access**
- ALL reads and writes go through n8n webhook-triggered workflows
- n8n workflows built manually by user (Claw provides full node config)
- MongoDB = user's own data | Google Sheets = external/temporary
- Notion = deferred (v1 saves to MongoDB only)

### Key Difference from Content Ideation
- Content Ideation = **analytical** (scoring, filtering, scheduling)
- Content Drafting = **creative** (writing, refining, perfecting)
- More conversation, fewer n8n calls

---

## 2. Data Flow

### Input (from Content Ideation A.8)
Post in `linkedin_posts` with:
```json
{
  "_id": ObjectId,
  "title": "Why I turned down PWC to bet on myself",
  "content": null,
  "channel": "linkedin",
  "content_pillar": "career",
  "scheduled_date": "2026-03-17",
  "scheduled_time": "09:00",
  "status": "Scheduled_NoDraft",
  "scores": { "freshness": 9, "personal_experience": 10, "research_quality": 7, "total": 143 },
  "source_brief_id": "1773448434682",
  "linked_experiences": ["exp_id_1"],
  "additional_context": "User shared extra story about the PWC decision"
}
```

### Output (after Content Drafting)
Same document updated:
```json
{
  "content": "Full LinkedIn post text here...",
  "status": "Scheduled_Drafted",
  "draft_metadata": {
    "word_count": 287,
    "char_count": 1842,
    "hook_type": "question",
    "cta_type": "question",
    "hashtags": ["#career", "#decisions", "#PM"],
    "iterations": 3,
    "tone": "casual_witty",
    "format": "story_insight",
    "engagement_inspiration": ["post_id_1", "post_id_2"]
  },
  "updated_at": ISODate
}
```

---

## 3. n8n Workflows

### 3.1 Existing Workflows (Reuse)

| # | Workflow | Webhook | Reuse For | Modification |
|---|----------|---------|-----------|-------------|
| 1 | SMA/Data/Read/FetchBriefs | /sma-fetch-briefs | B.2.a — Original research data | None |
| 2 | SMA/Data/Read/SearchExperiences | /sma-search-experiences | B.2.b — Deep experience search + B.2.e duplicate detection | None |
| 3 | SMA/Data/Read/FetchPastPosts | /sma-fetch-past-posts | B.2.c — Top 5 performing posts | **MODIFY** — add engagement scoring + top_performing flag |
| 4 | SMA/Data/Write/UpdateSheetStatus | /sma-update-sheet-status | B.5.b — Mark brief as drafted | None |
| 5 | SMA/Data/Write/SaveExperience | /sma-save-experience | B.2.e — Save confirmed new experience | None |

### 3.2 New Workflows

| # | Workflow | Webhook | Purpose |
|---|----------|---------|---------|
| 6 | SMA/Data/Read/FetchPostById | /sma-fetch-post | B.1 — Fetch earliest undrafted post |
| 7 | SMA/Data/Write/UpdatePost | /sma-update-post | B.5.a — Update post with draft + status |

### 3.3 FetchPastPosts Modification

Add engagement scoring to existing workflow:

**Engagement Score Formula:**
```
engagement_score = likes + (comments × 3) + (shares × 2)
```

**Why this weighting:**
- Comments × 3 — LinkedIn algorithm boosts comment-heavy posts. Real conversations = highest signal
- Shares × 2 — Extends reach to new networks  
- Likes × 1 — Low effort, weakest engagement signal

**New Code node (after MongoDB fetch):**
```javascript
const body = $('Webhook').first().json.body;
const topPerforming = body.top_performing || false;
const limit = body.limit || 10;

let posts = $input.all().map(item => {
  const m = item.json.metrics || {};
  item.json.engagement_score = 
    (m.likes || 0) + 
    ((m.comments || 0) * 3) + 
    ((m.shares || 0) * 2);
  return item;
});

if (topPerforming) {
  posts = posts
    .sort((a, b) => b.json.engagement_score - a.json.engagement_score)
    .slice(0, limit);
}

return posts;
```

**B.2.c call:**
```json
{ "days": 30, "channel": "linkedin", "top_performing": true, "limit": 5 }
```

### 3.4 New Webhook Payloads

#### FetchPostById (READ)
```
POST /sma-fetch-post
Request: { "status": "Scheduled_NoDraft", "channel": "linkedin", "limit": 1 }
Response: { "posts": [{ _id, title, content_pillar, scheduled_date, scores, source_brief_id, linked_experiences, additional_context }] }

Sort: scheduled_date ascending (earliest first)
```

#### UpdatePost (WRITE)
```
POST /sma-update-post
Request: {
  "post_id": "ObjectId string",
  "updates": {
    "content": "Full post text...",
    "status": "Scheduled_Drafted",
    "draft_metadata": { word_count, char_count, hook_type, cta_type, hashtags, iterations, tone, format },
    "updated_at": "ISODate"
  }
}
Response: { "success": true, "modified_count": 1 }
```

---

## 4. BMAD Workflow Steps — Complete Execution Flow

### B.1 — Pick Post (Auto)
```
Agent: Content Strategist
Trigger: User says "Let's draft" / "Post likhna hai" / after A.8

Sub-steps:

B.1.a — Fetch earliest undrafted post:
  n8n call: SMA/Data/Read/FetchPostById
  Input: { "status": "Scheduled_NoDraft", "channel": "linkedin", "limit": 1 }
  Sort: scheduled_date ascending
  Output: Single post (earliest undrafted)

B.1.b — Present (no list, direct):
  "📝 Next undrafted post:
   
   'Why I turned down PWC to bet on myself'
   📅 Mar 17, 09:00 AM IST
   🎯 Pillar: Career | Score: 143/160
   
   Draft shuru karein?"

B.1.c — Edge cases:
  - Post found → show → user confirms → B.2
  - Post already drafted (Scheduled_Drafted) → "Kal ki post ready hai ✅ Kuch aur?"
  - No undrafted posts exist → "Koi undrafted post nahi hai. Content Ideation run kar?"
  - User says "skip this, next one" → fetch next earliest → show again

Output: Selected post with full metadata
Next: B.2
```

### B.2 — Research & Context Gathering
```
Agent: Content Strategist
Purpose: Gather ALL context before writing a single word

Sub-steps:

B.2.a — Fetch original brief (if source_brief_id exists):
  n8n call: SMA/Data/Read/FetchBriefs
  Input: { "row_id": source_brief_id }
  Output: Original topic, research_data, why_relevant, target_audience, reference_links
  Purpose: Research foundation — stats, data, trends

B.2.b — Deep experience search:
  n8n call: SMA/Data/Read/SearchExperiences
  Input: { 
    "queries": [
      post.title,
      post.content_pillar + " personal story",
      post.additional_context  // if exists
    ],
    "limit": 3
  }
  Output: Top 3 relevant experiences per query (min similarity 0.80)
  Purpose: Personal foundation — real stories to weave in

B.2.c — Top 5 performing posts (tone reference):
  n8n call: SMA/Data/Read/FetchPastPosts
  Input: { "days": 30, "channel": "linkedin", "top_performing": true, "limit": 5 }
  Output: 5 highest engagement posts with content
  Purpose: Tone foundation — what writing style works best
  
  Engagement Score = likes + (comments × 3) + (shares × 2)

B.2.d — Compile & present draft brief:
  "📋 Draft Brief:
   
   📌 Topic: Why I turned down PWC to bet on myself
   🎯 Pillar: Career | 📅 Mar 17
   
   📊 Research:
   - 67% of professionals regret not taking career risks (LinkedIn 2025)
   - Risk-takers earn 30% more by age 35
   - 3 reference links available
   
   💭 Matching Experiences (similarity ≥ 0.80):
   - 'Had PWC offer in hand. Everyone said take it. Declined it.' (0.94)
   - 'Got rejected in first Amex interview. Applied again after 6 months.' (0.85)
   
   🏆 Top Performing Posts (tone inspiration):
   - 'Why rejection is your best teacher' — 💬96 comments, Engagement: 437
   - '10 sprints solo taught me everything' — 💬52 comments, Engagement: 289
   
   Kuch aur add karna hai ya seedha draft likhun?"

B.2.e — User additions (optional):
  User might share a new experience. Before saving:
  
  DUPLICATE DETECTION FLOW:
  ┌─────────────────────────────────────┐
  │ User shares experience text         │
  │           ↓                         │
  │ SearchExperiences (vector search)   │
  │ Query: user's text, limit: 1        │
  │           ↓                         │
  │ similarity > 0.95 → DUPLICATE       │
  │   "Ye experience already saved hai: │
  │    '[matched text]'                 │
  │    Save nahi kar raha."             │
  │           ↓                         │
  │ similarity 0.80-0.95 → SIMILAR      │
  │   "Ek similar experience mila:      │
  │    '[matched text]'                 │
  │    Ye naya hai ya wahi? Save karun?"│
  │   User: "Haan" → SaveExperience     │
  │   User: "Nahi" → skip               │
  │           ↓                         │
  │ similarity < 0.80 → NEW             │
  │   "Naya experience! Saving..."      │
  │   → SaveExperience → ✅             │
  └─────────────────────────────────────┘
  
  n8n calls:
  1. SearchExperiences (check duplicate)
  2. SaveExperience (only if confirmed new)

  Other user additions:
  - Specific angle request → note for B.3
  - "Seedha likh" → B.3

Next: B.3
```

### B.3 — Generate First Draft
```
Agent: Content Strategist
Purpose: Create the actual LinkedIn post (BMAD computation — no n8n)

Sub-steps:

B.3.a — Draft generation:
  Using ALL gathered context:
  - Brief research data (stats, trends, data)
  - Matched personal experiences (stories)
  - Top performing post tone (voice, style)
  - User's additional context/angle

  LinkedIn Post Structure:
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
  │ ← Question that invites comments   │
  ├─────────────────────────────────────┤
  │ HASHTAGS (3-5 relevant)             │
  └─────────────────────────────────────┘

  LinkedIn Constraints:
  - Hard limit: 3000 characters
  - Sweet spot: 1200-1800 characters
  - First 2 lines visible: ~210 chars
  - No markdown rendering
  - Emoji: max 3-5 per post
  - Line breaks: use liberally

  Hook Types:
  | Type             | Example                                          | When to Use             |
  |------------------|--------------------------------------------------|-------------------------|
  | Question         | "What would you do with a PWC offer at 22?"      | Career, relatable       |
  | Bold Statement   | "I turned down the safest job in India."          | Hot takes, contrarian   |
  | Counter-intuitive| "The worst day taught me the most."              | Resilience, lessons     |
  | Data Shock       | "70% of PMs burn out within 2 years."            | Data-driven posts       |
  | Direct Address   | "If you're a PM, stop doing this one thing."     | How-to, frameworks      |
  | Cliffhanger      | "I walked into my boss's office and said 3 words"| Story-driven posts      |

  CTA Types:
  | Type       | Example                                           | Best For          |
  |------------|---------------------------------------------------|-------------------|
  | Question   | "Have you ever turned down a 'safe' choice?"      | Max comments      |
  | Poll       | "Agree or disagree? Drop a 👍 or 👎"               | Quick engagement  |
  | Action     | "Try this framework next sprint."                  | How-to posts      |
  | Share      | "Tag someone who needs to hear this."              | Viral potential   |
  | Reflection | "What's the hardest career decision you've made?"  | Deep engagement   |

  Content Formats:
  1. Story → Insight: Personal anecdote → lesson learned
  2. Data → Opinion: Stats/research → contrarian take
  3. Listicle: "5 things I learned from..." numbered format
  4. Before/After: Transformation narrative
  5. Hot Take: Bold opener → reasoning → nuanced conclusion
  6. How-To: Framework/steps for specific skill

B.3.b — Present draft with metadata:
  "📝 Draft v1:
   
   [Full post text]
   
   ---
   📊 Stats:
   - Characters: 1,542 / 3,000
   - Words: 287
   - Hook: Question
   - CTA: Question
   - Format: Story → Insight
   
   How's this? Tweak karna hai kuch?"

Next: B.4
```

### B.4 — Refine (Iterative Loop)
```
Agent: Content Strategist
Purpose: Collaborative refinement until user approves

Sub-steps:

B.4.a — Process feedback:
  
  STRUCTURAL changes:
  - "Hook change kar" → rewrite first 2 lines
  - "Shorter kar" → trim while keeping core message
  - "Longer kar" → expand specific sections
  - "CTA badal" → different engagement prompt
  - "Hashtags change kar" → different set
  
  CONTENT changes:
  - "Meri [X] wali story add kar" → weave in specific experience
  - "Stats add kar" → pull from research brief
  - "Ye part hata do" → remove section
  - "Personal touch aur chahiye" → more first-person narrative
  
  TONE changes:
  - "Too formal" → more casual, add humor
  - "Too casual" → more professional
  - "More witty" → clever observations
  - "More emotional" → deeper personal reflection
  
  FORMAT changes:
  - "Listicle bana do" → restructure as numbered list
  - "Story format" → narrative structure

B.4.b — Show updated draft:
  - Highlight what changed
  - Update metadata (char count, word count)
  - "Better? Aur kuch?"

B.4.c — Iteration limits:
  After 3 iterations:
    "3 rounds ho gaye — finalize karein ya aur refinement?"
  Max 5 iterations:
    "Best version pick kar — v1, v2, v3, v4, or v5?"

B.4.d — Approval:
  User says "done" / "perfect" / "ship it" / "good" / "final"
  → One final show: "Ye final hai? Confirm kar toh save karta hoon"
  → User confirms → B.5

Decision tree:
  - Feedback → apply → show → loop (B.4.a)
  - "Done" → confirm → B.5
  - "Scrap it" → discard → back to B.1
  - "Save as draft, baad mein" → UpdatePost with status "Drafting" → exit

Next: B.5
```

### B.5 — Finalize & Save
```
Agent: Content Strategist
Purpose: Save final draft and update all systems

Sub-steps:

B.5.a — Update post in MongoDB:
  n8n call: SMA/Data/Write/UpdatePost (NEW)
  Input: {
    "post_id": selected_post._id,
    "updates": {
      "content": "Final post text...",
      "status": "Scheduled_Drafted",
      "draft_metadata": {
        "word_count": 287,
        "char_count": 1542,
        "hook_type": "question",
        "cta_type": "question",
        "hashtags": ["#career", "#decisions", "#PM"],
        "iterations": 3,
        "tone": "casual_witty",
        "format": "story_insight",
        "engagement_inspiration": ["top_post_id_1", "top_post_id_2"]
      },
      "updated_at": new Date().toISOString()
    }
  }
  Output: { success: true, modified_count: 1 }

B.5.b — Update Google Sheet:
  n8n call: SMA/Data/Write/UpdateSheetStatus (EXISTING)
  Input: {
    "updates": [{
      "row_id": source_brief_id,
      "status": "Drafted",
      "reason": "Draft complete, scheduled for [date]"
    }]
  }

B.5.c — Confirmation & next actions:
  "✅ Post saved!
   
   📌 'Why I turned down PWC to bet on myself'
   📅 Mar 17, 09:00 AM IST
   📊 Status: Scheduled_Drafted
   
   Next?
   1. 'Next post draft karo' → B.1
   2. 'Review posts' → C-ContentReview
   3. 'Done for now' → exit"

Next: B.1 (loop) or C-ContentReview or exit
```

---

## 5. Tone Guidelines (Satvik's Voice)

- First person always ("I", not "we" or "one")
- Casual but not sloppy — professional friend, not corporate robot
- Humor through observation, not forced jokes
- Vulnerability is strength — share the struggle, not just the win
- Data supports story, never replaces it
- Short sentences. Line breaks. Breathing room.
- English only in posts (v1)

---

## 6. Execution Flow Diagram

```
User: "Let's draft"
│
├─ B.1 ──[B.1.a]──→ n8n: FetchPostById ──→ MongoDB (earliest Scheduled_NoDraft)
│   └─ Auto-present single post → user confirms
│
├─ B.2 ──[B.2.a]──→ n8n: FetchBriefs ──→ Google Sheet (original research)
│   ├──[B.2.b]──→ n8n: SearchExperiences ──→ MongoDB (top 3, ≥0.80 similarity)
│   ├──[B.2.c]──→ n8n: FetchPastPosts ──→ MongoDB (top 5 performing, 30 days)
│   └── Compile brief → user adds context
│       └── New experience? → Duplicate check → Save if new
│
├─ B.3 ── Generate draft (BMAD — AI writes using all context)
│   └── Present v1 with metadata
│
├─ B.4 ── Refine loop (user ↔ AI, max 5 iterations)
│   └── User approves → B.5
│
└─ B.5 ──[B.5.a]──→ n8n: UpdatePost ──→ MongoDB (content + Scheduled_Drafted)
    ├──[B.5.b]──→ n8n: UpdateSheetStatus ──→ Google Sheet (mark Drafted)
    └── Done! → B.1 (next post) or exit
```

---

## 7. n8n Calls Per Run

| Scenario | Calls | Breakdown |
|----------|-------|-----------|
| Happy path (1 post) | 6 | B.1.a + B.2.a + B.2.b + B.2.c + B.5.a + B.5.b |
| + User shares new experience | +2 | SearchExperiences (dup check) + SaveExperience |
| + Experience is duplicate | +1 | SearchExperiences only (no save) |
| Save as draft (incomplete) | 1 | Only UpdatePost with status "Drafting" |

---

## 8. New n8n Workflow Specifications

### Workflow #10: SMA/Data/Read/FetchPostById

**Folder:** SMA → Data → Read
**Nodes:** 4

#### Node 1: Webhook
```
POST /sma-fetch-post
Response Mode: Using 'Respond to Webhook' Node
```

#### Node 2: Code (Build Query + Sort)
```javascript
const body = $input.first().json.body;
let query = {};
let sort = { scheduled_date: 1 }; // ascending — earliest first
let limit = body.limit || 10;

if (body.post_id) {
  query = { _id: { $oid: body.post_id } };
} else {
  if (body.status) query.status = body.status;
  if (body.channel) query.channel = body.channel;
}

return [{ json: { query: JSON.stringify(query), sort: JSON.stringify(sort), limit } }];
```

#### Node 3: MongoDB (Find)
```
├── Credential: MongoDB - SMA
├── Operation: Find
├── Collection: linkedin_posts
├── Query: {{ $json.query }}
├── Sort: {{ $json.sort }}
├── Limit: {{ $json.limit }}
```

#### Node 4: Respond to Webhook
```
{{ { posts: $json } }}
```

### Workflow #11: SMA/Data/Write/UpdatePost

**Folder:** SMA → Data → Write
**Nodes:** 4

#### Node 1: Webhook
```
POST /sma-update-post
Response Mode: Using 'Respond to Webhook' Node
```

#### Node 2: Code (Build Update)
```javascript
const body = $input.first().json.body;
const postId = body.post_id;
const updates = body.updates || {};
updates.updated_at = new Date().toISOString();

return [{ json: { post_id: postId, ...updates } }];
```

#### Node 3: MongoDB (Update)
```
├── Credential: MongoDB - SMA
├── Operation: Update
├── Collection: linkedin_posts
├── Update Key: _id
├── Value: {{ $json.post_id }}
```
Note: linkedin_posts uses ObjectId _id — no $merge workaround needed

#### Node 4: Respond to Webhook
```
{{ { success: true, modified_count: 1 } }}
```

---

## 9. GitHub Issue Hierarchy

### Epic (1)
```
🏔️ EPIC: B-ContentDrafting
  The complete content drafting pipeline — from picking an undrafted post 
  to saving a publish-ready LinkedIn draft.
```

### Features (3)
```
F1: n8n Workflow Infrastructure (new + modified workflows)
F2: BMAD Step Files (update step files to match plan)
F3: End-to-End Testing
```

### Stories, Tasks, Subtasks

#### F1: n8n Workflow Infrastructure

📘 STORY S1.1: New Read Workflow — FetchPostById
├── T1.1: n8n SMA/Data/Read/FetchPostById
│   ├── ST1.1.1: Webhook trigger node (/sma-fetch-post)
│   ├── ST1.1.2: Code node (Build Query + Sort)
│   ├── ST1.1.3: MongoDB Find node (linkedin_posts)
│   ├── ST1.1.4: Respond to Webhook node
│   └── ST1.1.5: Test — fetch by status Scheduled_NoDraft, verify earliest returned

📘 STORY S1.2: New Write Workflow — UpdatePost
├── T1.2: n8n SMA/Data/Write/UpdatePost
│   ├── ST1.2.1: Webhook trigger node (/sma-update-post)
│   ├── ST1.2.2: Code node (Build Update payload)
│   ├── ST1.2.3: MongoDB Update node (linkedin_posts)
│   ├── ST1.2.4: Respond to Webhook node
│   └── ST1.2.5: Test — update content + status, verify in DB

📘 STORY S1.3: Modify Existing — FetchPastPosts (Engagement Scoring)
├── T1.3: Add engagement scoring to FetchPastPosts
│   ├── ST1.3.1: Add Code node after MongoDB fetch (engagement_score formula)
│   ├── ST1.3.2: Handle top_performing flag (sort + slice)
│   ├── ST1.3.3: Test — verify top 5 by engagement returned correctly
│   └── ST1.3.4: Test — verify backward compatibility (existing calls still work)

📘 STORY S1.4: Update ChatGPT Actions Schema
├── T1.4: Add FetchPost + UpdatePost to OpenAPI schema
│   ├── ST1.4.1: Add /sma-fetch-post endpoint to schema
│   ├── ST1.4.2: Add /sma-update-post endpoint to schema
│   ├── ST1.4.3: Push updated schema to GitHub
│   └── ST1.4.4: Update GPT Actions in ChatGPT

#### F2: BMAD Step Files

📘 STORY S2.1: Update Content Drafting Step Files
├── T2.1: Update step-01-pick-post.md
│   ├── ST2.1.1: Remove Notion references, add MongoDB auto-pick logic
│   └── ST2.1.2: Add edge cases (no posts, already drafted)
├── T2.2: Update step-02-generate-draft.md
│   ├── ST2.2.1: Add research context gathering (B.2.a-d)
│   ├── ST2.2.2: Add duplicate experience detection flow
│   ├── ST2.2.3: Add engagement scoring reference for tone
│   └── ST2.2.4: LinkedIn constraints and format types
├── T2.3: Update step-03-refine.md
│   ├── ST2.3.1: Add feedback categories (structural/content/tone/format)
│   ├── ST2.3.2: Add iteration tracking + limits (max 5)
│   └── ST2.3.3: Add "save as draft" option
├── T2.4: Update step-04-finalize.md
│   ├── ST2.4.1: Replace Notion save with MongoDB UpdatePost
│   ├── ST2.4.2: Add Sheet status update
│   └── ST2.4.3: Add next actions menu

#### F3: End-to-End Testing

📘 STORY S3.1: Core Flow Test
├── T3.1: Prepare test data
│   ├── ST3.1.1: Insert 1 post with status Scheduled_NoDraft in MongoDB
│   ├── ST3.1.2: Ensure corresponding brief exists in Google Sheet
│   └── ST3.1.3: Ensure matching experiences exist in life_experiences
├── T3.2: Run full B workflow
│   ├── ST3.2.1: Trigger B.1 — verify auto-pick returns correct post
│   ├── ST3.2.2: Verify B.2 — research + experiences + top posts fetched
│   ├── ST3.2.3: Verify B.3 — draft generated within LinkedIn constraints
│   ├── ST3.2.4: Verify B.4 — refinement loop works (test 2 iterations)
│   └── ST3.2.5: Verify B.5 — MongoDB updated, Sheet updated

📘 STORY S3.2: Edge Cases
├── T3.3: No undrafted posts
│   └── ST3.3.1: Verify graceful message when no Scheduled_NoDraft exists
├── T3.4: Duplicate experience detection
│   ├── ST3.4.1: Share existing experience — verify duplicate detected (>0.95)
│   ├── ST3.4.2: Share similar experience — verify prompt shown (0.80-0.95)
│   └── ST3.4.3: Share new experience — verify saved (<0.80)
├── T3.5: Save as draft (incomplete)
│   └── ST3.5.1: Verify UpdatePost saves with status "Drafting"

📘 STORY S3.3: Bug Fixing & Issue Resolution
├── T3.6: Dynamic bug tracking
│   └── (Bugs logged here as discovered during testing)

---

## 10. Issue Count Summary

| Level | Count |
|-------|-------|
| Epic | 1 |
| Features | 3 |
| Stories | 8 |
| Tasks | 10 |
| Subtasks | 28 |
| **Total** | **50** |

---

## 11. Dependencies

### Build Order
```
1. F1/S1.1 — FetchPostById (new workflow)
2. F1/S1.2 — UpdatePost (new workflow)
3. F1/S1.3 — Modify FetchPastPosts (engagement scoring)
4. F1/S1.4 — Update ChatGPT schema
5. F2/S2.1 — Update all 4 step files
6. F3/S3.1 — Core flow test
7. F3/S3.2 — Edge case tests
```

### Prerequisites
- At least 1 post with status `Scheduled_NoDraft` (from A-ContentIdeation or manual insert)
- All A-ContentIdeation n8n workflows working
- Google Sheet with test brief data

---

## 12. Naming Convention Reference

```
Tier 1 (BMAD Workflow): B (ContentDrafting)
Tier 2 (Step):          1-5
Tier 3 (n8n Call):      a, b, c...

Steps:
  B.1 — Pick Post (Auto)
  B.2 — Research & Context Gathering
  B.3 — Generate First Draft
  B.4 — Refine (Iterative Loop)
  B.5 — Finalize & Save

n8n Calls:
  B.1.a — FetchPostById (NEW)
  B.2.a — FetchBriefs (existing)
  B.2.b — SearchExperiences (existing)
  B.2.c — FetchPastPosts (existing, MODIFIED)
  B.2.e — SearchExperiences (duplicate check) + SaveExperience (if new)
  B.5.a — UpdatePost (NEW)
  B.5.b — UpdateSheetStatus (existing)
```

---

## 13. File References

| File | Path |
|------|------|
| This plan | `plans/B-content-drafting-plan.md` |
| A-ContentIdeation plan | `plans/A-content-ideation-plan.md` |
| BMAD workflow | `workflows/content-drafting/workflow.md` |
| Step files | `workflows/content-drafting/steps-c/` |
| ChatGPT schema | `chatgpt-actions-schema.json` |
