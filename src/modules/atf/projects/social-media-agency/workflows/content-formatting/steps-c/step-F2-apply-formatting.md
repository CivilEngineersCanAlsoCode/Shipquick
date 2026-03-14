# Step F.2 — Apply Formatting

**Agent:** Content Strategist
**Trigger:** User selected a post in F.1 (or resumed from 01b with raw draft).

---

## What You Do

This is the CORE step of the workflow. Take the raw drafted content and apply ALL 12 LinkedIn v1 formatting rules. The substance, arguments, and voice of the original draft must be preserved — you are FORMATTING, not rewriting.

---

## Input
- `selected_post.raw_content` — the raw draft text from B-Drafting
- `selected_post.title` — the post title
- `selected_post.topic` — the topic/brief

---

## Formatting Rules — Apply ALL in Order

### 1. Staircase Layout
Restructure the post into a "staircase" visual flow:
- Hook line stands alone at the top
- Each idea gets its own block (1-3 lines)
- Blank lines separate every block
- The reader's eye flows naturally downward
- No wall-of-text anywhere in the post

### 2. 3-Line Block Rule
Scan every paragraph. If any has 4+ consecutive lines without a blank line, split it. Maximum 3 lines per block. This is non-negotiable.

### 3. UPPERCASE Headers
Convert section transition lines to UPPERCASE where appropriate. Rules:
- Maximum 2-3 UPPERCASE headers per post
- Only for section headers, NEVER for in-line emphasis
- Examples: `HERE'S WHAT I LEARNED`, `THE REAL LESSON`, `WHY THIS MATTERS`

### 4. Emoji Placement
Add up to 3 emojis. Place them ONLY at:
- The hook line (to grab attention)
- A tension/pivot point (where the story turns)
- The CTA (to drive action)
Never use emojis as bullet markers, line starters, or decoration.

### 5. Dash Replacement
Find ALL dashes used as em-dashes (e.g., "this - that", "and then — boom") and replace with proper punctuation:
- Period + new sentence
- Comma
- Colon
- Parentheses
Exceptions: ` - ` in bullets and ` —> ` in flow arrows are the correct format.

### 6. Bullet Format
Convert any bullets to ` - ` format (space-hyphen-space). Replace `•`, `*`, `–`, or other bullet styles.

### 7. Flow Arrows
Convert any process/progression indicators to `A —> B —> C` format (em-dash + greater-than). Replace `->`, `→`, `-->`, or prose descriptions of flows.

### 8. Hindi Sentences
Add up to 3 Romanised Hindi sentences at emotional peaks. Rules:
- Only at moments of vulnerability, humour, or deep personal insight
- Never for vector-searchable content (causes 15-25% lower semantic search accuracy)
- Must feel natural, not forced
- If the draft already has Hindi, count those toward the limit

### 9. Character Count
After all formatting, count ASCII characters. Must be 800-1600 (inclusive).
- **Under 800:** Expand a key point with an example, add another body block, or elaborate the CTA. Do NOT pad with filler.
- **Over 1600:** Tighten sentences, remove redundant words, cut the weakest body block. Do NOT cut the hook, CTA, or hashtags.

### 10. FK Grade 7 Readability
Review the entire post for readability:
- Average sentence length: 15 words or fewer
- Average word length: 2 syllables or fewer
- Active voice (not passive)
- No unexplained jargon
- If a sentence is complex, split it into two shorter sentences

### 11. CTA with Positioning + Follow
Ensure the post ends with a CTA that has TWO parts:
1. **Positioning statement:** Who you are / what you do (1 sentence)
2. **Follow prompt:** Tell the reader to follow (1 sentence)
If the draft already has a CTA, check it has both parts. If missing either, add it.

### 12. Hashtags
Add 3-6 relevant hashtags at the very end of the post. Separated from the CTA by one blank line. Choose hashtags relevant to the post topic and LinkedIn audience.

---

## After Formatting

Present the formatted version to the user for initial feedback:

> "Yeh raha formatted version. Ek nazar daalo:"

Show the formatted post (NOT in a code block yet — that's F.3). This is a quick first look.

> "Kuch acha lag raha hai? Ya koi changes chahiye isse code-block preview mein dikhane se pehle?"

**If user says looks good:** Proceed to **F.3** (Generate Preview).
**If user wants immediate changes:** Apply the specific changes and show again. Then proceed to F.3.

---

## Error Handling

**If raw_content is empty or missing:**
> "Is post mein raw content nahi hai — draft incomplete lag raha hai. B-Drafting mein wapas jaake draft complete karo."

Exit the workflow. Do NOT attempt to format an empty post.

**If character count cannot be brought into range after 2 attempts:**
> "Character count {count} hai — {over/under} limit. Best effort adjust kar diya hai. Preview mein dekh lo, agar theek nahi lage toh manually adjust karenge."

---

## What NOT to Do
- Do NOT rewrite the post content, arguments, or voice — only FORMAT
- Do NOT add new ideas, stories, or examples not present in the draft
- Do NOT use bold, italic, or underline (LinkedIn plain text only)
- Do NOT exceed any formatting limit (3 emojis, 3 Hindi, 6 hashtags, 1600 chars)
- Do NOT skip any of the 12 rules — all are mandatory
- Do NOT show the formatted post in a code block here (that is F.3's job)

---

## Output for Next Step

Pass to **F.3**:
```
formatted_content — the fully formatted post text
selected_post — original post object (for metadata)
formatting_stats — character count, emoji count, Hindi count, hashtag count, approx FK grade
```
