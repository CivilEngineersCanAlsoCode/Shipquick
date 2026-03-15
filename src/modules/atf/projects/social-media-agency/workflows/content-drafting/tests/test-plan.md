# B-ContentDrafting — Test Plan

## Test Conventions

- **Pass criteria:** Each test describes expected behavior. A test passes when the agent's behavior matches.
- **Preconditions:** State required before running the test case.
- **Notation:** `→` = expected agent action/response.

---

## 1. B.1 — Pick Post

### T-B1.01: Happy Path — Single Undrafted Post

**Precondition:** 1 post with status `Scheduled_NoDraft` exists in MongoDB.
**Steps:**
1. User says "Let's draft"
2. Agent calls sma-fetch-post with `{ status: "Scheduled_NoDraft", channel: "linkedin", limit: 1 }`
3. → Agent displays: title, scheduled date/time, pillar, score
4. → Agent asks for confirmation
5. User confirms → proceeds to B.2

### T-B1.02: Zero Undrafted Posts

**Precondition:** No posts with status `Scheduled_NoDraft`.
**Steps:**
1. User says "Draft karo"
2. Agent calls sma-fetch-post → response: `{ "posts": [] }`
3. → Agent says no undrafted posts exist
4. → Agent suggests running A-ContentIdeation
5. → Agent does NOT proceed to B.2

### T-B1.03: Multiple Posts — User Skips First

**Precondition:** 3+ posts with status `Scheduled_NoDraft`.
**Steps:**
1. Agent presents earliest post
2. User says "skip this, next one"
3. → Agent calls sma-fetch-post with `limit: 2`
4. → Agent presents the second post
5. User confirms → proceeds to B.2

### T-B1.04: Skip When Only One Post Exists

**Precondition:** Exactly 1 post with status `Scheduled_NoDraft`.
**Steps:**
1. Agent presents the only post
2. User says "next one"
3. → Agent calls sma-fetch-post with `limit: 2`, gets 1 result
4. → Agent says "Bas yahi ek undrafted post hai. Isko draft karein ya exit?"

### T-B1.05: User Requests Specific Post by Title

**Precondition:** Multiple undrafted posts exist.
**Steps:**
1. User says "mujhe 'Why I left corporate' wali post draft karni hai"
2. → Agent calls sma-fetch-post with `limit: 10`
3. → Agent finds matching title from results
4. → Agent presents that specific post for confirmation

### T-B1.06: Post with Wrong Status Rejected

**Precondition:** User somehow references a post with status `Drafted` or later.
**Steps:**
1. → Agent does NOT allow drafting a post already in `Drafted`/`Formatting`/`Published` status
2. → Agent informs user the post is already past the drafting stage

### T-B1.07: Past Scheduled Date Warning

**Precondition:** Earliest undrafted post has `scheduled_date` in the past.
**Steps:**
1. Agent fetches and presents the post
2. → Agent warns: date has passed, ask user to draft or reschedule
3. User says "draft karo" → proceeds to B.2 normally

### T-B1.08: Today's Scheduled Date Warning

**Precondition:** Earliest undrafted post has `scheduled_date` = today.
**Steps:**
1. Agent fetches and presents the post
2. → Agent warns: post is scheduled for today, needs quick drafting
3. Proceeds normally after user confirms

### T-B1.09: Webhook Failure — Retry Then Halt

**Precondition:** sma-fetch-post webhook is down.
**Steps:**
1. First call fails (network error / non-200)
2. → Agent says "Retry karta hoon..."
3. → Agent retries after ~5 seconds
4. Second call also fails
5. → Agent shows escalation message referencing n8n workflow name
6. → Agent does NOT proceed to B.2

---

## 2. B.2 — Generate Draft

### 2a. Context Gathering

#### T-B2.01: All Three Webhooks Succeed

**Precondition:** sma-fetch-briefs, sma-search-experiences, sma-fetch-past-posts all healthy.
**Steps:**
1. Agent makes all 3 calls (can be parallel)
2. → brief_data populated
3. → experiences merged with linked_experiences (deduped by _id)
4. → top 5 performing posts loaded for tone reference
5. → Agent proceeds to framework loading

#### T-B2.02: source_brief_id Is Null

**Precondition:** Selected post has no `source_brief_id`.
**Steps:**
1. → Agent skips sma-fetch-briefs call entirely (not an error)
2. → Agent still calls sma-search-experiences and sma-fetch-past-posts
3. → Agent notes internally: no research data available

#### T-B2.03: sma-fetch-briefs Fails

**Steps:**
1. sma-fetch-briefs returns error
2. → Agent logs failure, continues
3. → Agent does NOT warn user (unless all 3 fail)
4. → Draft generation uses experiences + user context only

#### T-B2.04: sma-search-experiences Fails — Has Linked Experiences

**Precondition:** `selected_post.linked_experiences` contains 2 experience IDs.
**Steps:**
1. sma-search-experiences returns error
2. → Agent falls back to linked_experiences from post object
3. → Agent continues with those experiences in context

#### T-B2.05: sma-search-experiences Fails — No Linked Experiences

**Precondition:** `selected_post.linked_experiences` is empty.
**Steps:**
1. sma-search-experiences returns error
2. → Agent warns user: experience search failed AND no linked experiences
3. → Agent asks if user wants to share a story
4. → Agent continues (draft will lack personal stories)

#### T-B2.06: sma-fetch-past-posts Fails

**Steps:**
1. sma-fetch-past-posts returns error
2. → Agent continues without tone reference
3. → During curation, "top post alignment" criterion is skipped

#### T-B2.07: All Three Context Calls Fail

**Steps:**
1. All 3 webhooks fail
2. → Agent warns: "Context gathering mein issues aaye..."
3. → Agent generates draft using post metadata + frameworks only
4. → Agent proceeds to framework loading and generation

### 2b. Framework Selection

#### T-B2.08: All CSVs Load Successfully

**Precondition:** All 8 CSV files exist and are parseable.
**Steps:**
1. → Agent loads all 8 CSVs from `frameworks/` directory
2. → Agent curates top 3–5 per category for the 6 selectable categories
3. → Agent presents curated options to user

#### T-B2.09: One CSV Missing — Fallback to Generic

**Precondition:** hook-frameworks.csv is missing/unreadable.
**Steps:**
1. → Agent logs the failure
2. → Agent warns user: "[file] load nahi ho paya — generic options use kar raha hoon"
3. → Agent presents generic hook options (Question, Bold Statement, Counter-Intuitive)
4. → Other categories load normally from CSVs

#### T-B2.10: User Picks Explicitly (e.g., "1a, 2b, 3a, 4a, 5b, 6a")

**Steps:**
1. Agent presents curated frameworks
2. User responds with explicit picks
3. → Agent uses exactly those selections
4. → Agent proceeds to draft generation

#### T-B2.11: User Says "auto"

**Steps:**
1. Agent presents curated frameworks
2. User says "auto" or "tu decide kar"
3. → Agent picks best combo based on curation criteria
4. → Agent shows what was auto-picked before proceeding

#### T-B2.12: User Picks Partial ("1a, 2b, rest auto")

**Steps:**
1. User provides picks for some categories, says "rest auto"
2. → Agent uses explicit picks for stated categories
3. → Agent auto-picks for remaining categories
4. → Agent shows complete selection before proceeding

### 2c. Duplicate Experience Detection

#### T-B2.13: User Shares New Experience — Similarity < 0.80

**Steps:**
1. User shares a new experience
2. Agent calls sma-search-experiences for duplicate check
3. Similarity result: 0.65 (below 0.80)
4. → Agent says "Naya experience! Saving..."
5. → Agent calls sma-save-experience with correct payload (date, text, tags, source, generate_embedding)
6. → Agent confirms save and includes in draft context

#### T-B2.14: User Shares Experience — Similarity 0.80–0.95 (Similar)

**Steps:**
1. Similarity result: 0.87
2. → Agent shows matched experience (first 100 chars)
3. → Agent asks: "Ye naya hai ya wahi? Save karun?"
4. User says "naya hai" → Agent saves
5. User says "wahi hai" → Agent skips save, uses existing in context

#### T-B2.15: User Shares Experience — Similarity > 0.95 (Duplicate)

**Steps:**
1. Similarity result: 0.97
2. → Agent says "Ye experience already saved hai: '[matched text]...' Duplicate save nahi kar raha."
3. → Agent does NOT call sma-save-experience
4. → Agent uses the existing experience in draft context

#### T-B2.16: Duplicate Check Webhook Fails

**Steps:**
1. sma-search-experiences (dup check) returns error
2. → Agent skips the save to avoid duplicates
3. → Agent keeps experience text in context for draft
4. → Agent informs user: dup check failed, not saving but will use in draft

#### T-B2.17: sma-save-experience Fails

**Steps:**
1. Duplicate check passes (new experience confirmed)
2. sma-save-experience returns error
3. → Agent logs failure
4. → Agent informs user: save failed but will use in draft
5. → Agent proceeds with experience text in working context

### 2d. Formatting Rules Applied

#### T-B2.18: All 16 Formatting Constraints in Draft

Verify the generated draft respects:

| # | Rule | Validation |
|---|------|-----------|
| 1 | 800–1600 ASCII characters | Count chars, verify in range |
| 2 | No bold/italic/underline | No `**`, `_`, `__` in output |
| 3 | UPPERCASE headers sparingly | At most 2 UPPERCASE words used as headers |
| 4 | Max 3-line blocks | No paragraph exceeds 3 lines |
| 5 | Max 3 emojis | Count emoji, verify ≤ 3 |
| 6 | Emojis at tension points | Emojis not at start of post or in hashtags |
| 7 | No dashes as separators | No ` - ` used as visual breaks (bullets OK) |
| 8 | Bullets use " - " format | Any list items use ` - ` prefix |
| 9 | Flows use "A —> B —> C" | Any process flows use arrow notation |
| 10 | Hook under ~210 chars | First 2 lines fit LinkedIn feed preview |
| 11 | FK Grade 7 readability | Estimate reading level |
| 12 | CTA or engagement question | Post ends with a prompt for engagement |
| 13 | Positioning + follow line | Author tagline present near end |
| 14 | 3–6 hashtags at end | Count hashtags at post end |
| 15 | First person ("I") | No "we" or third person for author |
| 16 | English only (v1) | No Devanagari script (romanized Hindi OK) |

---

## 3. B.3 — Refine

### 3a. Feedback Categories

#### T-B3.01: Structural — Hook Change

**Steps:**
1. User says "hook change kar"
2. → Agent rewrites ONLY the first 2 lines
3. → Agent uses a different hook type from the curated list
4. → Body, CTA, positioning remain unchanged

#### T-B3.02: Structural — Shorter

**Steps:**
1. User says "shorter kar"
2. → Agent trims the draft (removes weakest paragraph first)
3. → Core message preserved
4. → Char count decreases

#### T-B3.03: Structural — Longer

**Steps:**
1. User says "aur likho"
2. → Agent asks which section to expand (if unclear)
3. → Agent expands specified section
4. → Char count increases

#### T-B3.04: Content — Add Specific Experience

**Steps:**
1. User says "meri PWC wali story add kar"
2. → Agent weaves the experience into the draft body
3. → If experience not in context, agent may vector search for it
4. → Other sections remain largely unchanged

#### T-B3.05: Content — Remove Section

**Steps:**
1. User says "ye part hata do" (referring to a specific section)
2. → Agent removes the section
3. → Agent adjusts flow so remaining text reads naturally

#### T-B3.06: Content — Incorrect Fact

**Steps:**
1. User says "ye fact galat hai"
2. → Agent removes/corrects the fact immediately
3. → Does NOT argue or justify the original fact

#### T-B3.07: Tone — Too Formal

**Steps:**
1. User says "bahut formal hai"
2. → Agent makes language more casual
3. → Adds observational humor where natural
4. → Structure remains same

#### T-B3.08: Tone — More Emotional

**Steps:**
1. User says "dil se likho"
2. → Agent deepens personal reflection, adds vulnerability
3. → Does NOT make it melodramatic

#### T-B3.09: Format — Switch to Listicle

**Steps:**
1. User says "listicle bana do"
2. → Agent restructures as numbered list
3. → Preserves key points from original draft

### 3b. Iteration Tracking

#### T-B3.10: Version Display After Each Iteration

**Steps:**
1. User gives feedback, agent applies changes
2. → Agent shows: "Draft v[N]: [code block]"
3. → Agent shows: what changed (diff summary)
4. → Agent shows: char count, word count, iteration N of 3

#### T-B3.11: Previous Versions Retained

**Steps:**
1. After 3 iterations, user says "v1 better tha"
2. → Agent can recall and present v1

### 3c. Save-as-Draft (Incomplete)

#### T-B3.12: User Says "baad mein"

**Steps:**
1. User says "save as draft, baad mein"
2. → Agent calls sma-update-post with status: `Drafting` (not `Drafted`)
3. → Payload includes: content, status, draft_metadata with `incomplete: true`
4. → Agent confirms: "Incomplete draft save ho gaya (status: Drafting)"
5. → Agent exits workflow

#### T-B3.13: Save-as-Draft Fails

**Steps:**
1. sma-update-post fails
2. → Agent retries once
3. → On second failure: shows full draft in code block
4. → Agent does NOT lose draft text

### 3d. Iteration Limits

#### T-B3.14: Soft Cap at 3 Iterations

**Steps:**
1. User gives feedback for 3rd time
2. → After applying changes, agent says: "3 rounds ho gaye — finalize karein ya aur refinement chahiye?"
3. User says "aur chahiye" → agent allows more iterations

#### T-B3.15: Hard Cap at 5 Iterations

**Steps:**
1. User has completed 5 iterations
2. → Agent presents all 5 versions (first 50 chars each)
3. → Agent asks user to pick the best version
4. → Agent does NOT allow a 6th iteration

#### T-B3.16: Hard Cap — User Rejects All Versions

**Steps:**
1. At 5-iteration cap, user says "none of these"
2. → Agent offers: "Scrap karein aur naye post se start karein?"
3. User agrees → clear state, return to B.1

### 3e. Quality Checks

#### T-B3.17: Character Count Below 800

**Steps:**
1. After revision, draft is 650 chars
2. → Agent warns: "Post thoda chhota hai (650 chars). 800+ better perform karta hai. Expand karun?"
3. Warning does NOT block — user can override

#### T-B3.18: Character Count Above 1600

**Steps:**
1. After revision, draft is 1850 chars
2. → Agent warns: "Post lamba ho gaya (1850 chars). 1600 se neeche laana chahiye. Trim karun?"

#### T-B3.19: Hook Over 210 Chars

**Steps:**
1. First 2 lines exceed 210 chars
2. → Agent warns: "Hook 210 chars se zyada hai — feed mein cut ho jayega. Trim karun?"

#### T-B3.20: Readability Above Grade 9

**Steps:**
1. FK estimate > Grade 9
2. → Agent warns: readability is heavy, suggests simplification
3. → Does NOT block

#### T-B3.21: Quality Checks Pass — No Warnings

**Steps:**
1. Draft is 1200 chars, hook is 180 chars, FK ~Grade 7
2. → Agent shows NO quality warnings
3. → Only shows draft + stats

### 3f. Approval Flow

#### T-B3.22: User Approves at v1

**Steps:**
1. After first draft, user says "perfect"
2. → Agent asks final confirmation: "Ye final hai? Confirm kar toh save karta hoon."
3. User confirms → proceeds to B.4

#### T-B3.23: User Scraps Draft

**Steps:**
1. User says "scrap it" or "nahi chahiye"
2. → Agent discards all draft state
3. → Agent asks: "Wapas B.1 pe jaayein naya post pick karne?"

---

## 4. B.4 — Finalize

### 4a. MongoDB Save

#### T-B4.01: Happy Path — Save Succeeds

**Steps:**
1. Agent calls sma-update-post with: content, status: "Drafted", full draft_metadata, updated_at
2. → Response: `{ success: true, modified_count: 1 }`
3. → Agent proceeds to sheet update

#### T-B4.02: Verify Payload Completeness

**Steps:**
1. Inspect the sma-update-post payload
2. → Contains: post_id, content (exact approved text), status: "Drafted"
3. → draft_metadata contains: word_count, char_count, hook_type, cta_type, hashtags[], iterations, tone, format, positioning, engagement_inspiration[], experiences_used[]
4. → Contains: updated_at (ISO timestamp)

#### T-B4.03: MongoDB Save Fails — Retry Succeeds

**Steps:**
1. First call fails
2. → Agent retries after ~5 seconds
3. Retry succeeds
4. → Agent proceeds to sheet update normally

#### T-B4.04: MongoDB Save Fails — Both Attempts Fail

**Steps:**
1. First call fails, retry also fails
2. → Agent shows full draft in code block
3. → Agent shows escalation message with n8n workflow name
4. → Agent does NOT proceed to sheet update
5. → Agent does NOT present "next actions"

### 4b. Sheet Update

#### T-B4.05: Sheet Update Succeeds

**Precondition:** MongoDB save succeeded.
**Steps:**
1. Agent calls sma-update-sheet-status with: row_id, status: "Drafted", reason
2. → Response: `{ success: true, updated: 1 }`
3. → Agent proceeds to next actions

#### T-B4.06: Sheet Update Fails — Non-blocking

**Precondition:** MongoDB save succeeded.
**Steps:**
1. sma-update-sheet-status fails
2. → Agent warns user with manual update instructions
3. → Agent still proceeds to next actions (MongoDB is source of truth)

#### T-B4.07: No source_brief_id — Skip Sheet Update

**Precondition:** `selected_post.source_brief_id` is null.
**Steps:**
1. → Agent skips sma-update-sheet-status call entirely
2. → Agent proceeds directly to next actions

### 4c. Next Actions

#### T-B4.08: User Picks "Next Post"

**Steps:**
1. Agent presents 4 options after successful save
2. User says "next post" or "1"
3. → Agent clears draft state
4. → Agent restarts at B.1

#### T-B4.09: User Picks "Format"

**Steps:**
1. User says "format karo" or "2"
2. → Agent transitions to F-ContentFormatting with post_id and content

#### T-B4.10: User Picks "Review"

**Steps:**
1. User says "review" or "3"
2. → Agent transitions to C-ContentReview with post_id

#### T-B4.11: User Picks "Done"

**Steps:**
1. User says "done" or "4"
2. → Agent gives a closing message
3. → Agent exits workflow

#### T-B4.12: Draft Text Not Modified During Save

**Steps:**
1. Compare draft text user approved in B.3 with the content field sent to sma-update-post
2. → They are identical — agent did NOT modify the text during save

---

## 5. Integration Tests

### T-INT.01: Full Happy Path (B.1 → B.4)

**Precondition:** 1 undrafted post, all webhooks healthy, all CSVs present.
**Steps:**
1. User starts drafting → B.1 fetches post → user confirms
2. B.2 gathers context (3 webhooks) → loads 8 CSVs → curates frameworks → user picks "1a, 2b, 3a, 4c, 5b, 6a" → first draft generated
3. User says "hook change kar" → B.3 revises → user says "perfect"
4. B.4 saves to MongoDB → updates sheet → user picks "done"
5. → Verify: MongoDB has status `Drafted`, content matches approved text, draft_metadata complete

### T-INT.02: Interrupted at B.1 — Resume

**Steps:**
1. Session starts, B.1 fetch completes, user sees post
2. Session interrupted (context lost)
3. New session: agent runs resume check
4. → Agent re-fetches posts (idempotent) → presents to user
5. → Workflow continues from B.1 confirmation

### T-INT.03: Interrupted at B.2 (After Framework Load, Before Selection)

**Steps:**
1. Frameworks loaded, curated options prepared, user hasn't picked yet
2. Session interrupted
3. Resume: agent re-loads CSVs (local, idempotent) → re-presents curated options
4. → User picks → draft generated → continues normally

### T-INT.04: Interrupted at B.3 (Mid-Refinement)

**Steps:**
1. User has completed 2 iterations, working on v3
2. Session interrupted
3. Resume: agent checks for `Drafting` status in MongoDB
4. If incomplete draft was saved → presents that version to user
5. If not saved → presents whatever draft is in available context
6. → User decides: continue refining or finalize current version

### T-INT.05: Interrupted at B.4 (After MongoDB Save, Before Sheet Update)

**Steps:**
1. MongoDB save succeeded, sheet update not yet called
2. Session interrupted
3. Resume: agent checks MongoDB → status is `Drafted` (save completed)
4. → Agent calls sheet update
5. → Presents next actions

### T-INT.06: Interrupted at B.4 (Before MongoDB Save)

**Steps:**
1. User approved draft, B.4 starts, MongoDB save not yet called
2. Session interrupted
3. Resume: agent checks MongoDB → status is still `Scheduled_NoDraft` or `Drafting`
4. → Agent presents draft for re-confirmation
5. → User confirms → agent saves to MongoDB

### T-INT.07: Full Flow with All Context Webhooks Failing

**Steps:**
1. B.1 succeeds (post fetched)
2. B.2: all 3 context webhooks fail → agent warns, generates basic draft from metadata + frameworks
3. B.3: user refines (2 iterations) → approves
4. B.4: save succeeds
5. → Verify: workflow completes despite degraded context gathering

### T-INT.08: Full Flow with Save-as-Draft Mid-B.3

**Steps:**
1. B.1 → B.2 complete normally
2. B.3: user gives 1 round of feedback, then says "baad mein"
3. → Agent saves with status `Drafting`, incomplete: true
4. New session: user says "draft karo"
5. → Agent fetches post (status: `Drafting`) → presents existing draft
6. → User continues refining → approves → B.4 saves with status `Drafted`

---

## 6. Test Coverage Summary

| Area | Test IDs | Count |
|------|----------|-------|
| B.1 — Pick Post | T-B1.01 – T-B1.09 | 9 |
| B.2 — Context Gathering | T-B2.01 – T-B2.07 | 7 |
| B.2 — Framework Selection | T-B2.08 – T-B2.12 | 5 |
| B.2 — Duplicate Detection | T-B2.13 – T-B2.17 | 5 |
| B.2 — Formatting Rules | T-B2.18 | 1 (16 sub-checks) |
| B.3 — Feedback Categories | T-B3.01 – T-B3.09 | 9 |
| B.3 — Iteration Tracking | T-B3.10 – T-B3.11 | 2 |
| B.3 — Save-as-Draft | T-B3.12 – T-B3.13 | 2 |
| B.3 — Iteration Limits | T-B3.14 – T-B3.16 | 3 |
| B.3 — Quality Checks | T-B3.17 – T-B3.21 | 5 |
| B.3 — Approval Flow | T-B3.22 – T-B3.23 | 2 |
| B.4 — MongoDB Save | T-B4.01 – T-B4.04 | 4 |
| B.4 — Sheet Update | T-B4.05 – T-B4.07 | 3 |
| B.4 — Next Actions | T-B4.08 – T-B4.12 | 5 |
| Integration | T-INT.01 – T-INT.08 | 8 |
| **Total** | | **70** |
