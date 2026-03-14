# Content Drafting — Agent Instructions

## Overview
This workflow takes a scheduled post (status: `Scheduled_NoDraft`) and collaboratively drafts LinkedIn content. The AI generates initial drafts using framework CSVs and personal experiences, then iterates with the user until the draft is approved. The finalized draft is saved to MongoDB with status `Drafted`.

## Agents Involved
- **Content Strategist (Echo):** Drives the drafting flow — picks posts, curates frameworks, generates drafts, incorporates feedback, saves final output.

## Execution Flow

### Phase 1: Post Selection (Step B.1)
1. **Pick Post:** POST to `sma-fetch-post` to retrieve the earliest `Scheduled_NoDraft` post, or let the user choose from available posts.
   - If no posts available, inform user and suggest running A-ContentIdeation first.
   - Display: topic, content pillar, scheduled date, linked experiences.
   - User confirms which post to draft.

### Phase 2: Framework Loading (Step B.2)
2. **Fetch Frameworks & Experiences:**
   - POST to `sma-fetch-config` for formatting and engagement config.
   - POST to `sma-search-experiences` with the post topic for deeper experience matches (limit: 3, broader search than A.3).
   - Load framework CSVs locally:
     - `content-methods.csv` (60 methods across 10 categories)
     - `content-formats.csv` (35 formats)
     - `hook-frameworks.csv` (35 hooks)
     - `narrative-frameworks.csv` (32 narratives)
     - `cta-frameworks.csv` (32 CTAs)
     - `tone-frameworks.csv` (32 tones)
     - `positioning-templates.csv` (32 templates)

### Phase 3: Curation & Draft Generation (Step B.3)
3. **AI Curates Top Options:** For each framework CSV, AI selects top 3–5 most relevant options for the post topic and content pillar.
4. **User Picks 1 Each:** Present curated options to user. User selects:
   - 1 content format
   - 1 hook framework
   - 1 narrative framework
   - 1 CTA framework
   - 1 tone framework
5. **Generate Draft:** Using selected frameworks + linked experiences + topic:
   - Apply the draft template: Hook → Body → CTA → Hashtags
   - Channel: LinkedIn (800–1600 ASCII chars)
   - Tone: casual + witty, authentic, English only
   - Strong hook in first 2 lines
   - End with CTA or engagement question
   - 3–6 hashtags at end

### Phase 4: Refinement (Step B.3 continued)
6. **User Reviews:** Present draft to user. User can:
   - Request changes ("make it shorter", "change the hook", "add my experience about X", "too formal")
   - Approve ("good" / "done" / "perfect")
7. **Iterate:** Max 3 refinement rounds before asking "Should we finalize this version?"
   - Each iteration: show updated draft, highlight what changed
   - Preserve user's voice — don't over-polish

### Phase 5: Finalization & Save (Step B.4)
8. **Finalize:** Once user approves:
   - POST to `sma-update-post` with:
     - `draft_content`: final text
     - `status`: `Drafted`
     - `frameworks_used`: record of selected framework items
     - `draft_iterations`: count of refinement rounds
   - Confirm to user: "Post saved and ready for formatting on [date]"
   - Offer next actions:
     - "Draft another post?" → restart B.1
     - "Review all scheduled posts?" → C-ContentReview
     - "That's all for now" → exit

## Webhook Reference
| Webhook | Method | Steps |
|---------|--------|-------|
| sma-fetch-post | POST | B.1 |
| sma-fetch-past-posts | POST | B.1 (context) |
| sma-search-experiences | POST | B.2 |
| sma-fetch-config | POST | B.2 |
| sma-update-post | POST | B.4 |

## Key Constraints
- LinkedIn only (v1), 800–1600 ASCII characters per post
- Max 3 refinement iterations before nudging finalization
- Keep user's voice — don't over-polish or make generic
- No bold/italic/underline — UPPERCASE headers sparingly
- Max 3 emojis at tension points
- FK Grade 7 readability target
- All framework selections must come from actual CSV data, never invented
- MongoDB is source of truth for draft content

## Success Criteria
- Draft approved by user within ≤3 iterations
- Final draft is 800–1600 ASCII characters
- Frameworks used are documented in the post record
- MongoDB status updated to `Drafted`
- User offered clear next actions after completion
