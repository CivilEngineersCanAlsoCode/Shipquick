# K1 — Pipeline Workflows (A-F)

## A — Content Ideation

### A.1: Fetch Briefs
- Call `fetchBriefs` with `{"status": "New"}`
- Display briefs as numbered list with topic, research_data, why_relevant
- If no new briefs: tell Satvik, suggest submitting new topics

### A.2: Fetch Past Posts
- Call `fetchPastPosts` with `{"days": 14, "channel": "linkedin"}`
- Note which pillars were covered recently to avoid repetition
- Flag any pillar not posted in 7+ days

### A.3: Semantic Search Experiences
- For each brief, generate 2-3 search queries from the topic
- Call `searchExperiences` with `{"queries": [...], "limit": 3}`
- Attach top 1 experience (score >= 0.80) to each brief
- Briefs with no matching experience: flag as lower personal relevance

### A.4: Load Scoring Config
- Call `fetchConfig` with `{"doc_ids": ["scoring_weights", "scoring_scales"]}`
- Display current weights: F x {w1} + P x {w2} + R x {w3}
- Ask Satvik to confirm or update

### A.5: Optional Config Update
- Only if Satvik requests changes
- Call `saveConfig` with updated weights
- Confirm save success

### A.6: Score and Select
- Score each brief: `Score = F x w1 + P x w2 + R x w3`
- Apply gate checks: F >= 5, P >= 3, R >= 2, Total >= 80
- Rank by total score, present top N
- Show: rank, topic, F/P/R scores, total, matched experience snippet
- Satvik selects which to plan (max 3 planned at any time)
- Update rejected briefs: call `updateSheetStatus` with status "Discarded" and reason

### A.7: Assign Dates
- Call `fetchConfig` with `{"doc_ids": ["posting_schedule"]}`
- Check next 7 days for open slots (max 1/day)
- Propose date assignments, Satvik confirms
- Save experiences if new ones surfaced: call `saveExperience`

### A.8: Save Selected Posts
- For each selected brief:
  - Call `savePost` with title, content_pillar, scheduled_date, status "Scheduled_NoDraft", scores
  - Call `updateSheetStatus` with status "Planned", scores, reason
- Confirm all saves successful
- Show summary: N posts planned for dates X, Y, Z

---

## B — Content Drafting

### B.1: Pick Post
- Call `fetchPost` with `{"status": "Scheduled_NoDraft", "channel": "linkedin"}`
- If multiple: show list, pick earliest by default or let Satvik choose
- If none: tell Satvik, suggest running Plan mode first
- Call `updatePost` to set status "Drafting"

### B.2: Generate Draft
- Gather context:
  - Fetch brief details from post document
  - Call `searchExperiences` for relevant experiences
  - Call `fetchPastPosts` for recent posts (avoid repetition)
- Load framework knowledge (from K4):
  - Present top 3-5 from each: Content Format, Hook, Narrative, CTA, Tone, Positioning
  - Satvik picks 1 from each category
- Generate first draft using selected frameworks
- Show draft in code block with character count

### B.3: Iterative Refinement
- Satvik gives feedback on draft
- AI revises (suggest max 3 iterations, hard cap 5)
- Each revision: show in code block, highlight changes
- Quality checks after each revision:
  - Character count (800-1600)
  - FK Grade 7 readability
  - Hook under 210 chars
  - Has CTA + positioning + follow line

### B.4: Finalize
- Call `updatePost` with:
  - `content`: final draft text
  - `status`: "Drafted"
  - `frameworks_used`: {format, hook, narrative, cta, tone, positioning}
  - `revision_count`: N
- Confirm save
- Show next actions: "Say `format post` to apply LinkedIn formatting"

---

## F — Content Formatting

### F.1: Pick Drafted Post
- Call `fetchPost` with `{"status": "Drafted"}`
- If multiple: show list, Satvik picks
- Display current raw content

### F.2: Apply Formatting Rules
- Apply all 16 rules from K3:
  - Staircase pattern (progressive line lengths)
  - Max 3-line blocks with blank line separators
  - UPPERCASE headers (sparingly)
  - Remove bold/italic/underline
  - Replace dashes with punctuation
  - Format bullets as ` - ` and flows as `A --> B --> C`
  - Max 3 emojis at tension points
  - Max 3 Hindi sentences at emotional peaks
  - Add positioning line after CTA
  - Add follow CTA
  - Add 3-6 hashtags
  - Verify 800-1600 char count
  - Check FK Grade 7

### F.3: Generate Preview
- Show formatted post in code block
- Below preview, show stats:
  - Character count
  - Line count
  - Emoji count
  - Hindi sentence count
  - Hashtag count
  - Formatting rule pass/fail checklist

### F.4: Approve or Revise
- Satvik approves: call `updatePost` with status "Previewed", formatted content
- Satvik requests changes: revise and re-preview
- Satvik rejects: status stays "Drafted", suggest re-drafting

---

## C — Content Review

### C.1: Fetch Previewed Posts
- Call `fetchPost` with `{"status": "Previewed"}`
- Show each post with full preview and metadata

### C.2: Review Decisions
For each post, Satvik can:
- **Approve**: call `updatePost` with status "Ready_ToPublish"
- **Edit**: apply minor edits, re-validate formatting rules, re-preview
- **Reschedule**: call `updatePost` with new scheduled_date, status "Scheduled_NoDraft"
- **Drop**: call `updatePost` with status "Cancelled"

### C.3: Apply Edits (if needed)
- Make requested changes
- Re-run formatting validation
- Show updated preview
- Ask for final approval

### C.4: Summary
- Show table of all reviewed posts with decisions
- Confirm all status updates saved

---

## D — Content Publishing

### D.1: Fetch Ready Posts
- Call `fetchPost` with `{"status": "Ready_ToPublish"}`
- Show post(s) with full preview
- Ask Satvik to confirm which to publish

### D.2: Publish
- CRITICAL: Send EXACTLY the approved content. Do NOT modify.
- Call `publishLinkedIn` with `{"post_id": "...", "content": "..."}`
- ONE SHOT — if API returns error, DO NOT retry
- On success: receive linkedin_post_urn and linkedin_post_url

### D.3: Update Status
- Call `updatePost` with:
  - `status`: "Published"
  - `linkedin_post_urn`: from publish response
  - `linkedin_post_url`: from publish response
  - `published_at`: current ISO timestamp

### D.4: Notify Team
- Call `notifyTelegram` with message including:
  - Post title
  - LinkedIn URL
  - Scheduled vs actual publish time
  - Pillar and frameworks used
- Confirm notification sent

---

## E — Analytics Review

### E.1: Fetch Published Posts with Metrics
- Call `fetchPost` with `{"status": "Published", "days": 30}`
- Also call `fetchConfig` for current scoring weights and benchmarks
- Metrics are collected at Day 1, 3, 7, 14, 30 via JS snippet or `collectAnalytics` action

### E.2: Aggregate Metrics
- Calculate per post: `engagement_score = likes + (comments x 3) + (shares x 2)`
- Aggregate by:
  - Per pillar (avg engagement, best/worst)
  - Per content method/format
  - Per day of week
  - Per hook type
- Calculate engagement_velocity (rate of change between collection points)

### E.3: Analyze Performance
- Classify each post: Viral (>3x avg), Strong (>1.5x), Average, Weak (<0.5x)
- Rank by engagement score
- Detect trends: improving/declining pillars
- Resurgence detection: Day 14 metrics > Day 7 by >20%
- Present interactive discussion with Satvik

### E.4: Strategy Recommendations
- Pillar rebalancing: suggest posting more in high-performing pillars
- Format insights: which content formats drive most engagement
- Timing insights: best days/times
- Winning combos: which framework combinations work best
- Variety alerts: flag overused frameworks
- Call `saveConfig` to save recommendations

### E.5: Feedback Loop
- Update scoring weights based on performance data
- Update pillar priorities
- Flag underperforming frameworks
- Call `saveConfig` with updated weights
- Confirm the feedback loop is closed
- Suggest next ideation round incorporating learnings
