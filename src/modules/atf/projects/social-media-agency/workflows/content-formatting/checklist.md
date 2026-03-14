# Content Formatting — Quality Checklist

## Pre-Format Checks
- [ ] Post exists and has status `Drafted`
- [ ] Raw content (body text) is present and non-empty
- [ ] Post has a title and topic
- [ ] Raw content character count noted (baseline before formatting)
- [ ] Status updated to `Formatting` before work begins

## Format Checks — LinkedIn v1 Rules
- [ ] **Character Count:** 800-1600 ASCII characters (inclusive)
- [ ] **No Rich Text:** No bold, italic, or underline formatting used
- [ ] **Staircase Layout:** Post structured with progressive visual flow (no wall-of-text)
- [ ] **3-Line Block Rule:** No more than 3 consecutive lines without a blank line separator
- [ ] **UPPERCASE Headers:** Used sparingly (2-3 max), only for section headers, not for body emphasis
- [ ] **Emoji Count:** Maximum 3 emojis in entire post
- [ ] **Emoji Placement:** Emojis placed only at tension/transition points (not decorative)
- [ ] **No Dashes:** All informal dashes replaced with proper punctuation (periods, commas, colons, parentheses)
- [ ] **Bullet Format:** All bullets use ` - ` (space-hyphen-space) format
- [ ] **Flow Arrow Format:** All process flows use `A —> B —> C` (em-dash + greater-than)
- [ ] **Hindi Sentences:** Maximum 3 Romanised Hindi sentences
- [ ] **Hindi Placement:** Hindi used only at emotional peaks (not for vector-searchable content)
- [ ] **FK Readability:** Flesch-Kincaid Grade Level 7 or below
- [ ] **CTA Present:** Post ends with a clear call-to-action
- [ ] **CTA Has Positioning:** CTA includes a positioning statement (who you are / what you do)
- [ ] **CTA Has Follow Prompt:** CTA includes a follow prompt
- [ ] **Hashtags Count:** 3-6 hashtags present
- [ ] **Hashtags Placement:** Hashtags are at the very end of the post (after CTA, separated by blank line)

## Preview Checks
- [ ] Code-block preview generated (full post inside triple backticks)
- [ ] Character count displayed and within range
- [ ] Emoji count displayed and within limit
- [ ] Hindi sentence count displayed and within limit
- [ ] Hashtag count displayed and within range
- [ ] Approximate FK Grade Level displayed
- [ ] User reviewed the preview
- [ ] User explicitly approved OR requested specific changes

## Post-Approval Checks
- [ ] Status updated to `Previewed` via `sma-update-post` webhook
- [ ] Formatted content saved to post record in MongoDB
- [ ] Webhook response confirmed success (non-error status)
- [ ] User informed of successful save
- [ ] Next step suggested (C-Review workflow)

## Rejection Handling
- [ ] If user rejects: status reverted to `Drafted` via `sma-update-post`
- [ ] If user requests changes: loop back to F.2/F.3 (do not start from scratch)
- [ ] Change loop count tracked (warn user after 3+ iterations)
