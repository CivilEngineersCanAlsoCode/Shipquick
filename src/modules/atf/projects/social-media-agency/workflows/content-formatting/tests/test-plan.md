# F-ContentFormatting — Test Plan

Test cases for the Content Formatting workflow (steps F.1 through F.4), formatting rule validation, and edge cases.

---

## Test Case Index

| ID | Step | Category | Test Case | Priority |
|----|------|----------|-----------|----------|
| T01 | F.1 | Happy Path | Pick from multiple drafted posts | P1 |
| T02 | F.1 | Happy Path | Pick single drafted post | P1 |
| T03 | F.1 | Empty State | No drafted posts available | P1 |
| T04 | F.1 | Validation | Post with empty raw_content | P1 |
| T05 | F.1 | Validation | Post with raw_content < 200 chars | P2 |
| T06 | F.1 | Error | Fetch webhook failure (first attempt) | P1 |
| T07 | F.1 | Error | Fetch webhook failure (both attempts) | P1 |
| T08 | F.1 | Error | Status update webhook failure | P2 |
| T09 | F.1 | Input | Invalid selection (out of range number) | P2 |
| T10 | F.1 | Lock | Status set to Formatting on selection | P1 |
| T11 | F.2 | Structure | Staircase layout applied (FR01) | P1 |
| T12 | F.2 | Structure | 3-line block rule enforced (FR02) | P1 |
| T13 | F.2 | Structure | One idea per post verified (FR15) | P2 |
| T14 | F.2 | Structure | Whitespace breathing room (FR16) | P2 |
| T15 | F.2 | Typography | Bold/italic/underline stripped (FR03) | P1 |
| T16 | F.2 | Typography | UPPERCASE headers added (FR03) | P1 |
| T17 | F.2 | Typography | Dashes replaced with punctuation (FR04) | P1 |
| T18 | F.2 | Typography | Bullets use ' - ' format (FR05) | P1 |
| T19 | F.2 | Typography | Numbered lists use '1. ' format (FR06) | P2 |
| T20 | F.2 | Typography | Flow arrows use 'A —> B —> C' (FR07) | P2 |
| T21 | F.2 | Language | Emoji count 0-3 and placement (FR08) | P1 |
| T22 | F.2 | Language | Hindi sentence count 0-3 and placement (FR09) | P1 |
| T23 | F.2 | Language | FK Grade 7 readability (FR10) | P1 |
| T24 | F.2 | Footer | Character count 800-1600 (FR11) | P1 |
| T25 | F.2 | Footer | Positioning statement present (FR12) | P1 |
| T26 | F.2 | Footer | Follow invitation present (FR13) | P2 |
| T27 | F.2 | Footer | Hashtags 3-6 at end only (FR14) | P1 |
| T28 | F.2 | Integrity | Original content voice preserved | P1 |
| T29 | F.2 | Integrity | No new ideas/stories added | P1 |
| T30 | F.3 | Preview | Code block preview rendered | P1 |
| T31 | F.3 | Preview | Stats summary displayed | P1 |
| T32 | F.3 | Preview | All metrics show PASS/FAIL | P1 |
| T33 | F.3 | Preview | Failing metric blocks approval | P1 |
| T34 | F.4 | Approve | Status updated to Previewed | P1 |
| T35 | F.4 | Approve | Formatted content saved to MongoDB | P1 |
| T36 | F.4 | Approve | Post-approval summary shown | P2 |
| T37 | F.4 | Changes | Targeted changes only (not full re-format) | P1 |
| T38 | F.4 | Changes | Iteration counter incremented | P2 |
| T39 | F.4 | Changes | Warning at 4+ iterations | P2 |
| T40 | F.4 | Reject | Status reverted to Drafted | P1 |
| T41 | F.4 | Error | Save webhook failure with backup | P1 |
| T42 | F.4 | Input | Ambiguous user response handled | P2 |
| T43 | Edge | Char Count | Draft exactly 800 chars after formatting | P2 |
| T44 | Edge | Char Count | Draft exactly 1600 chars after formatting | P2 |
| T45 | Edge | Char Count | Draft under 800 — auto-expansion | P1 |
| T46 | Edge | Char Count | Draft over 1600 — auto-trimming | P1 |
| T47 | Edge | Language | Fully Hindi draft rejected | P1 |
| T48 | Edge | Content | Rich Unicode chars (𝗯𝗼𝗹𝗱) stripped | P2 |

---

## Step F.1 — Pick Drafted Post

### T01: Pick from multiple drafted posts
**Precondition:** 3+ posts with status `Drafted` in MongoDB.
**Steps:**
1. Trigger formatting workflow ("Format karo")
2. Agent calls `sma-fetch-post` with `{ "status": "Drafted" }`
3. Agent presents numbered list (title, topic, scheduled date)
4. User selects post #2

**Expected:**
- [ ] Numbered list shown with all drafted posts
- [ ] No raw JSON displayed to user
- [ ] Selected post's status updated to `Formatting` via `sma-update-post`
- [ ] Full post object (including `raw_content`) passed to F.2
- [ ] Confirmation message shown: "Chaliye! '{title}' ko format karte hain."

---

### T02: Pick single drafted post
**Precondition:** Exactly 1 post with status `Drafted`.
**Steps:**
1. Trigger formatting workflow
2. Agent fetches posts, gets 1 result

**Expected:**
- [ ] Single post displayed with confirmation prompt ("Isko format karein? Haan ya nahi?")
- [ ] Agent does NOT auto-select — waits for user confirmation
- [ ] On "haan": status updated to `Formatting`, proceed to F.2

---

### T03: No drafted posts available
**Precondition:** Zero posts with status `Drafted`.
**Steps:**
1. Trigger formatting workflow
2. Agent fetches posts, gets empty array

**Expected:**
- [ ] Message: "Abhi koi drafted post nahi hai..."
- [ ] Workflow exits cleanly
- [ ] No webhook calls to `sma-update-post`
- [ ] Suggests B-Drafting workflow

---

### T04: Post with empty raw_content
**Precondition:** Post exists with status `Drafted` but `raw_content` is empty string or null.
**Steps:**
1. User selects this post
2. Agent validates `raw_content`

**Expected:**
- [ ] Agent halts: "Is post mein raw content nahi hai..."
- [ ] Status reverted to `Drafted` via `sma-update-post`
- [ ] Workflow exits, suggests B-Drafting
- [ ] Agent does NOT attempt to format empty content

---

### T05: Post with raw_content < 200 chars
**Precondition:** Post has `raw_content` of 150 characters.
**Steps:**
1. User selects this post
2. Agent checks character count

**Expected:**
- [ ] Warning: "Draft bahut chhota hai (150 characters)..."
- [ ] Status reverted to `Drafted`
- [ ] Workflow exits

---

### T06: Fetch webhook failure — first attempt recovers
**Precondition:** `sma-fetch-post` returns error on first call, succeeds on retry.
**Steps:**
1. Trigger workflow
2. First fetch call fails (network error / non-200)
3. Agent retries after 5 seconds

**Expected:**
- [ ] Agent shows: "Drafted posts fetch karne mein dikkat..."
- [ ] Retry executes after delay
- [ ] On retry success: normal flow continues
- [ ] No data loss

---

### T07: Fetch webhook failure — both attempts fail
**Precondition:** `sma-fetch-post` fails on both attempts.

**Expected:**
- [ ] Agent reports: "Webhook respond nahi kar raha. Satvik, `SMA/Data/Read/FetchPost` check karo n8n mein."
- [ ] Workflow halts — does NOT proceed with no data
- [ ] No phantom posts invented

---

### T08: Status update webhook failure
**Precondition:** `sma-fetch-post` succeeds but `sma-update-post` (Formatting) fails.

**Expected:**
- [ ] Warning about duplicate formatting risk
- [ ] Agent proceeds to F.2 anyway (status lock is safety, not blocker)
- [ ] User informed of manual check needed

---

### T09: Invalid selection
**Precondition:** 3 posts displayed, user enters "5" or "abc".

**Expected:**
- [ ] Agent re-prompts: "Valid number daalo — 1 se 3 ke beech."
- [ ] Does NOT default to any post
- [ ] Does NOT crash or proceed

---

### T10: Status lock on selection
**Precondition:** User selects a valid post.

**Expected:**
- [ ] `sma-update-post` called with `{ "post_id": "...", "status": "Formatting" }`
- [ ] Prevents concurrent formatting sessions from picking same post

---

## Step F.2 — Apply Formatting Rules

### T11: Staircase layout (FR01)
**Input:** Draft with wall-of-text paragraph (10+ lines without breaks).

**Expected:**
- [ ] Output has progressive visual flow (descending blocks)
- [ ] No section has more than 3 consecutive lines
- [ ] Hook is standalone (1 line)
- [ ] Blank lines separate all blocks

---

### T12: 3-line block rule (FR02)
**Input:** Draft with a 6-line paragraph.

**Expected:**
- [ ] Paragraph split into 2+ blocks of max 3 lines each
- [ ] Natural thought breaks used for split points
- [ ] No block exceeds 3 consecutive non-blank lines

---

### T13: One idea per post (FR15)
**Input:** Draft covering 2 distinct topics (product-market fit AND hiring).

**Expected:**
- [ ] Agent flags: "Is draft mein 2 alag ideas hain..."
- [ ] Asks user which to keep
- [ ] Trims the weaker topic
- [ ] Does NOT merge topics into one

---

### T14: Whitespace breathing room (FR16)
**Input:** Draft with blocks touching without blank lines.

**Expected:**
- [ ] Blank line inserted between every block
- [ ] Major transitions (hook-body, body-CTA) have blank line separation
- [ ] Post feels "airy" not dense

---

### T15: Bold/italic/underline stripped (FR03)
**Input:** Draft containing `**bold text**`, `*italic text*`, `__underlined__`.

**Expected:**
- [ ] All markdown formatting markers removed
- [ ] Text content preserved (only markers stripped)
- [ ] No rich Unicode characters (𝗯𝗼𝗹𝗱) used as replacement

---

### T16: UPPERCASE headers added (FR03)
**Input:** Draft with section headers like "Here's what I learned" and "The real lesson".

**Expected:**
- [ ] Headers converted to UPPERCASE: `HERE'S WHAT I LEARNED`
- [ ] Maximum 2-3 UPPERCASE headers in output
- [ ] UPPERCASE NOT used for emphasis within body sentences

---

### T17: Dashes replaced (FR04)
**Input:** Draft with "I was tired — really tired — but I kept going."

**Expected:**
- [ ] Dashes replaced: "I was tired. Really tired. But I kept going."
- [ ] Bullet dashes ` - ` preserved
- [ ] Flow arrows ` —> ` preserved

---

### T18: Bullet format (FR05)
**Input:** Draft with mixed bullet styles: `•`, `*`, `–`, `→`.

**Expected:**
- [ ] All converted to ` - ` (space-hyphen-space)
- [ ] Consistent formatting across all bullets
- [ ] Bullet content unchanged

---

### T19: Numbered list format (FR06)
**Input:** Draft with `1)`, `(1)`, `1-` style numbered lists.

**Expected:**
- [ ] All converted to `1. ` (digit-period-space)

---

### T20: Flow arrow format (FR07)
**Input:** Draft with `Idea -> Prototype -> Ship` and `A → B → C`.

**Expected:**
- [ ] Converted to `Idea —> Prototype —> Ship` and `A —> B —> C`
- [ ] Uses em-dash + greater-than, not arrow Unicode

---

### T21: Emoji count and placement (FR08)
**Input:** Draft with 7 emojis scattered throughout.

**Expected:**
- [ ] Reduced to max 3 emojis
- [ ] Remaining emojis placed at tension/transition points only
- [ ] No emojis used as bullet markers or line starters
- [ ] No emojis used as decoration

---

### T22: Hindi sentence count and placement (FR09)
**Input:** Draft with 5 Romanised Hindi sentences.

**Expected:**
- [ ] Reduced to max 3 Hindi sentences
- [ ] Remaining Hindi at emotional peaks (vulnerability, humour, insight)
- [ ] No Hindi used for factual/technical content (vector search accuracy)
- [ ] Each Hindi sentence under 15 words

---

### T23: FK Grade 7 readability (FR10)
**Input:** Draft with complex sentences (25+ words avg, multi-syllable jargon).

**Expected:**
- [ ] Sentences shortened to ~15 words average
- [ ] Complex words replaced (utilize→use, implement→build)
- [ ] Active voice used throughout
- [ ] Jargon explained or replaced
- [ ] Approximate FK Grade shown in stats as ≤ 7

---

### T24: Character count 800-1600 (FR11)
**Input:** Draft that formats to exactly 950 characters.

**Expected:**
- [ ] Character count within 800-1600 range
- [ ] Count includes all text, blank lines, emojis, hashtags

---

### T25: Positioning statement (FR12)
**Input:** Draft without a positioning statement.

**Expected:**
- [ ] Positioning line added after CTA
- [ ] 1 sentence: who you are + value you provide
- [ ] Not salesy

---

### T26: Follow invitation (FR13)
**Input:** Draft without a follow line.

**Expected:**
- [ ] Follow prompt added after positioning line
- [ ] Specific about what reader gets by following
- [ ] Action-oriented

---

### T27: Hashtags at end (FR14)
**Input:** Draft with hashtags embedded in body text and only 2 hashtags total.

**Expected:**
- [ ] Hashtags removed from body text
- [ ] 3-6 hashtags placed at very end (after follow line, blank line separator)
- [ ] `#CamelCase` format

---

### T28: Original content voice preserved
**Input:** Draft with distinct personal voice and specific examples.

**Expected:**
- [ ] Core message unchanged
- [ ] Arguments and examples preserved
- [ ] Author voice maintained
- [ ] Only structural/formatting changes applied

---

### T29: No new ideas added
**Input:** Any draft.

**Expected:**
- [ ] No new stories, examples, or ideas that were not in the original draft
- [ ] Content only restructured and reformatted

---

## Step F.3 — Generate Preview

### T30: Code block preview rendered
**Precondition:** F.2 completed with formatted content.

**Expected:**
- [ ] Formatted post displayed inside triple-backtick code block
- [ ] Shows EXACTLY what the post will look like on LinkedIn
- [ ] No markdown rendering inside the code block

---

### T31: Stats summary displayed
**Precondition:** F.2 completed.

**Expected:**
- [ ] Character count shown (with 800-1600 range reference)
- [ ] Emoji count shown (with 0-3 limit)
- [ ] Hindi sentence count shown (with 0-3 limit)
- [ ] Hashtag count shown (with 3-6 range)
- [ ] Approximate FK Grade Level shown (with ≤7 target)

---

### T32: All metrics show PASS/FAIL
**Precondition:** F.2 completed.

**Expected:**
- [ ] Each metric clearly labeled PASS or FAIL
- [ ] Visual indicators (checkmarks/crosses) for quick scanning

---

### T33: Failing metric blocks approval
**Precondition:** Formatted post has character count of 1700 (over limit).

**Expected:**
- [ ] Character count metric shows FAIL
- [ ] Agent does NOT allow user to approve with failing metrics
- [ ] Agent auto-adjusts (trims to under 1600) OR flags for user decision
- [ ] Preview regenerated after adjustment

---

## Step F.4 — User Approval

### T34: Approve — status updated to Previewed
**Precondition:** All metrics pass, user says "approve" / "haan" / "theek hai".

**Expected:**
- [ ] `sma-update-post` called with status `Previewed`
- [ ] Payload includes `formatted_content` and `formatting_stats`
- [ ] Webhook returns success
- [ ] User sees confirmation

---

### T35: Approve — formatted content saved
**Precondition:** Approval webhook succeeds.

**Expected:**
- [ ] `formatted_content` field saved to post record in MongoDB
- [ ] `formatting_stats` saved alongside
- [ ] `formatted_at` timestamp included

---

### T36: Post-approval summary shown
**Precondition:** Approval succeeded.

**Expected:**
- [ ] Summary table with: title, topic, scheduled date, status flow, char count, emoji count, Hindi count, hashtag count, FK grade, UPPERCASE header count, iteration count
- [ ] C-Review workflow suggested as next step

---

### T37: Changes — targeted edits only
**Precondition:** User says "Hook aur strong karo."

**Expected:**
- [ ] Agent rewrites hook line ONLY
- [ ] Rest of post remains identical
- [ ] Does NOT re-apply all 16 rules from scratch
- [ ] Returns to F.3 for new preview

---

### T38: Changes — iteration counter
**Precondition:** User requests changes on second iteration.

**Expected:**
- [ ] Counter incremented to 2
- [ ] Iteration count tracked accurately across loops

---

### T39: Changes — iteration warning at 4+
**Precondition:** 4th change request.

**Expected:**
- [ ] Agent suggests: "Major changes chahiye toh B-Drafting mein wapas jaana better hoga."
- [ ] At 5+: strongly recommends B-Drafting rework

---

### T40: Reject — status reverted
**Precondition:** User says "reject" / "nahi" / "cancel".

**Expected:**
- [ ] `sma-update-post` called with status `Drafted` (revert)
- [ ] Formatted content discarded
- [ ] Workflow exits cleanly
- [ ] User informed of options (B-Drafting rework or retry later)

---

### T41: Save webhook failure with backup
**Precondition:** Approval webhook fails on both attempts.

**Expected:**
- [ ] Formatted content displayed in code block as backup
- [ ] Post ID provided for manual status update
- [ ] n8n workflow name provided for troubleshooting
- [ ] Formatted content NOT lost under any circumstances

---

### T42: Ambiguous user response
**Precondition:** User responds with "hmm" or "not sure".

**Expected:**
- [ ] Agent re-prompts with clear options: approve / changes / reject
- [ ] Lists accepted phrases for each option
- [ ] Does NOT guess or assume approval

---

## Edge Cases

### T43: Formatted post exactly 800 characters
**Input:** Draft that formats to exactly 800 ASCII characters.

**Expected:**
- [ ] Character count metric: PASS (800 is inclusive in range)
- [ ] No unnecessary expansion

---

### T44: Formatted post exactly 1600 characters
**Input:** Draft that formats to exactly 1600 ASCII characters.

**Expected:**
- [ ] Character count metric: PASS (1600 is inclusive in range)
- [ ] No unnecessary trimming

---

### T45: Draft under 800 chars — auto-expansion
**Input:** Draft that formats to 650 characters.

**Expected:**
- [ ] Agent expands key points with examples (1-2 sentences)
- [ ] Does NOT pad with filler or generic statements
- [ ] Does NOT add content not rooted in the original draft
- [ ] Final count within 800-1600 range
- [ ] User shown what was added

---

### T46: Draft over 1600 chars — auto-trimming
**Input:** Draft that formats to 1850 characters.

**Expected:**
- [ ] Agent tightens sentences, cuts redundant words
- [ ] Weakest body block removed if needed
- [ ] Hook, CTA, positioning, follow, hashtags NOT cut
- [ ] Cuts come from body text
- [ ] Final count within 800-1600 range
- [ ] User shown what was removed

---

### T47: Fully Hindi draft rejected
**Input:** Draft written entirely in Hindi (no English content).

**Expected:**
- [ ] Agent halts: "Draft Hindi mein hai — formatting rules English content ke liye designed hain..."
- [ ] Suggests rewrite in English in B-Drafting
- [ ] Workflow exits
- [ ] Status reverted to `Drafted`

---

### T48: Rich Unicode characters stripped
**Input:** Draft using Unicode bold/italic: 𝗧𝗵𝗶𝘀 𝘪𝘴 𝗳𝗮𝗻𝗰𝘆.

**Expected:**
- [ ] Rich Unicode characters converted to plain text: "This is fancy."
- [ ] No Unicode formatting remains in output

---

## Regression Checklist

Run after any change to the F-ContentFormatting workflow, formatting rules, or related webhooks.

- [ ] T01: Multi-post selection works
- [ ] T03: Empty state handled gracefully
- [ ] T04: Empty raw_content rejected
- [ ] T12: 3-line block rule enforced (most common regression)
- [ ] T15: Bold/italic stripped
- [ ] T17: Dashes replaced
- [ ] T21: Emoji count ≤ 3
- [ ] T24: Character count 800-1600
- [ ] T28: Original voice preserved
- [ ] T34: Approval saves to MongoDB
- [ ] T37: Targeted changes (not full re-format)
- [ ] T40: Rejection reverts status
- [ ] T41: Webhook failure backup works
