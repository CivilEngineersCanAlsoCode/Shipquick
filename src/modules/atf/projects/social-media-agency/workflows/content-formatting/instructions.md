# Content Formatting — Agent Instructions

## Overview
This workflow transforms raw drafted posts into LinkedIn-ready formatted content. The agent takes a post that has passed through B-Drafting (status = `Drafted`), applies the full LinkedIn v1 formatting ruleset, generates a code-block preview, and gets user approval to advance the post to `Previewed` status. ALL data reads and writes go through n8n webhooks — the agent has ZERO direct DB/API access.

## Agents Involved
- **Pixel (flex-crafter):** Drives the entire formatting flow — fetches drafted posts, applies formatting rules, generates previews, and manages the approval cycle.

## Pre-requisites
- The post MUST be in `Drafted` status (came through the B-Drafting workflow)
- The post must have raw content (body text) available in the post record
- The `formatting-rules.csv` reference file should be loaded for rule verification

## Execution Flow

### Phase 1: Post Selection (Step F.1)
1. **Fetch Drafted Posts:** POST to `sma-fetch-post` with `{ "status": "Drafted" }`. Retrieve all posts waiting for formatting.
2. **Present Options:** Show the user a numbered list with each post's title, brief topic summary, and scheduled date.
3. **User Picks:** User selects one post to format.
4. **Update Status:** POST to `sma-update-post` to set the selected post's status to `Formatting`. This prevents another session from picking the same post.
5. **If no drafted posts exist:** Inform the user and exit. Do NOT proceed with an empty selection.

### Phase 2: Apply Formatting Rules (Step F.2)
This is the core of the workflow. Apply ALL of the following rules to the raw draft content:

#### Rule 1: Staircase Formatting
Structure the post using a "staircase" layout. Each visual section should have progressive indentation or line breaks that create a descending visual flow. The reader's eye should naturally flow down the post like walking down stairs. This means:
- Start with a punchy hook line (standalone)
- Follow with short blocks of text separated by blank lines
- Each block should feel like a "step" — a distinct thought
- Never dump a wall of text

#### Rule 2: Maximum 3-Line Blocks
Never write more than 3 consecutive lines of text without a blank line separator. This is a HARD rule. If a paragraph has 4+ lines, split it. Aim for 1-3 lines per block, with blank lines between blocks. This ensures readability on mobile devices where long paragraphs become walls of text.

#### Rule 3: UPPERCASE Headers
Use UPPERCASE only for section headers, and use them sparingly (2-3 per post maximum). Do NOT use UPPERCASE for emphasis within body text. Examples:
- `HERE'S WHAT I LEARNED` (good — section header)
- `The MOST important thing` (bad — emphasis within body)

#### Rule 4: Emoji Placement
Maximum 3 emojis per post. Place them ONLY at tension or transition points — moments where the reader's emotional state shifts. Never use emojis as decoration, bullet markers, or line starters. Good placements:
- At the hook (to grab attention)
- At the pivot/tension point (where the story turns)
- At the CTA (to drive action)

#### Rule 5: Dash Replacement
Replace ALL dashes (hyphens used as em-dashes) with proper punctuation. Options:
- Use a period and start a new sentence
- Use a comma for subordinate clauses
- Use a colon for explanations
- Use parentheses for asides
- Exception: " - " for bullets and " —> " for flow arrows are allowed (see Rules 7-8)

#### Rule 6: Bullet Formatting
All bullets must use the format ` - ` (space, hyphen, space). Not `•`, not `*`, not `–`. Consistent formatting only.

#### Rule 7: Flow Arrow Formatting
When showing a process or progression, use the format: `A —> B —> C` (em-dash + greater-than sign). Not `->`, not `→`, not `-->`.

#### Rule 8: Hindi Sentences
Maximum 3 Romanised Hindi sentences per post. Use them ONLY at emotional peaks — moments of vulnerability, humour, or deep insight. Hindi sentences must NOT contain content that needs to be vector-searchable (this causes 15-25% lower accuracy in semantic search). Good placements:
- A personal reflection
- A punchline or emotional moment
- A relatable Hinglish aside

#### Rule 9: Character Count
The formatted post must be between 800 and 1600 ASCII characters (inclusive). This is a STRICT range.
- If under 800: Expand key points, add an example, or elaborate on the CTA
- If over 1600: Trim redundant lines, tighten sentences, remove filler words
- Count characters AFTER all formatting is applied (including blank lines and hashtags)

#### Rule 10: Readability — FK Grade 7
Target Flesch-Kincaid Grade Level 7 or below. This means:
- Short sentences (15 words average)
- Simple words (2 syllables average)
- Active voice
- No jargon without explanation
- If a sentence feels complex, split it into two

#### Rule 11: CTA with Positioning + Follow
Every post must end with a CTA that includes:
1. A positioning statement (who you are / what you do)
2. A follow prompt (telling the reader to follow for more)
Example: `I write about building AI products as a solo founder. Follow for daily lessons from the trenches.`

#### Rule 12: Hashtags
Add 3-6 hashtags at the very end of the post (after the CTA, separated by a blank line). Choose hashtags relevant to the post topic and LinkedIn audience. No more than 6, no fewer than 3.

### Phase 3: Preview Generation (Step F.3)
1. **Code Block Preview:** Render the fully formatted post inside a markdown code block (triple backticks). This shows the user EXACTLY what the post will look like.
2. **Stats Summary:** Below the code block, show:
   - Character count (must be 800-1600)
   - Emoji count (must be 0-3)
   - Hindi sentence count (must be 0-3)
   - Hashtag count (must be 3-6)
   - Approximate FK Grade Level
3. **Ask User:** "Preview theek hai? Koi changes chahiye?"

### Phase 4: User Approval (Step F.4)
1. **Approve:** POST to `sma-update-post` with status = `Previewed` and the formatted content. Confirm success. Suggest proceeding to C-Review workflow.
2. **Request Changes:** User specifies what to change. Loop back to F.2 (apply specific changes) then F.3 (regenerate preview). Do NOT re-apply all rules from scratch — only modify what the user asked for.
3. **Reject:** POST to `sma-update-post` to revert status to `Drafted`. Exit workflow. The post goes back to the drafting pool.

## Webhook Reference
| Webhook | Method | Steps |
|---------|--------|-------|
| sma-fetch-post | POST | F.1 |
| sma-update-post | POST | F.1 (Formatting), F.4 (Previewed or revert to Drafted) |

## Key Constraints
- LinkedIn only (v1), one post formatted at a time
- Agent has ZERO direct DB/API access — everything through n8n webhooks
- ALL 16 formatting rules (FR01-FR16) must be applied — none are optional
- Character count (800-1600) is a HARD limit, not a suggestion
- Code-block preview is MANDATORY before approval
- Never invent post content — only format what exists in the draft
- Never skip the preview step
- All user communication in Hinglish (Hindi-English mix)
- If webhook fails, retry once, then report to user with n8n workflow name

## What NOT to Do
- Do NOT rewrite the post content — only FORMAT it. The substance, arguments, and voice must remain from the draft.
- Do NOT add new ideas, examples, or stories that were not in the original draft
- Do NOT use bold, italic, or underline formatting (LinkedIn plain text only)
- Do NOT exceed 3 emojis, 3 Hindi sentences, or 6 hashtags
- Do NOT skip the staircase layout — every post must have it
- Do NOT approve a post that violates any formatting rule
- Do NOT proceed without user confirmation at F.4
- Do NOT show raw JSON to the user — always present formatted, human-readable output

## Error Handling
- **Webhook failure (fetch):** Retry once after 5 seconds. If it fails again, report the n8n workflow name to the user and halt.
- **Webhook failure (update):** Retry once. If it fails again, warn the user that the status update failed but the formatted content is available locally. Ask them to check n8n.
- **Character count out of range:** Automatically adjust (trim or expand) and show the user what changed. Do not ask the user to fix it — the agent handles this.
- **Post has no raw content:** Do not attempt to format an empty post. Tell the user the draft is incomplete and suggest going back to B-Drafting.

## Success Criteria
- Post formatted with ALL 16 LinkedIn v1 rules (FR01-FR16) applied
- Character count within 800-1600 range
- Code-block preview shown to user
- User explicitly approved the formatted version
- Status updated to `Previewed` in MongoDB
- Formatted content saved to post record
- No formatting rules violated in final output
