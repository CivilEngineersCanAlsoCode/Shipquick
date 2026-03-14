# Step F.2 — Apply Formatting Rules

**Agent:** Pixel (flex-crafter)
**Trigger:** User selected a post in F.1 (or resumed from 01b with raw draft in memory).

---

## What You Do

This is the CORE step of the entire F-ContentFormatting workflow. Take the raw drafted content from B-Drafting and apply ALL 16 LinkedIn v1 formatting rules from `formatting-rules.csv`. You are FORMATTING, not rewriting. The substance, arguments, voice, and core message of the original draft MUST be preserved. You restructure, rephrase for readability, and apply visual formatting — nothing more.

---

## Input

- `selected_post.raw_content` — the raw draft text from B-Drafting
- `selected_post.title` — the post title
- `selected_post.topic` — the topic/brief
- `selected_post.content_format` — the content format chosen in B-Drafting
- `selected_post.hook_framework` — the hook style chosen in B-Drafting
- `selected_post.cta_framework` — the CTA style chosen in B-Drafting
- `selected_post.tone` — the tone chosen in B-Drafting

---

## Reference File

Load `formatting-rules.csv` from `src/modules/atf/projects/social-media-agency/frameworks/formatting-rules.csv` for rule verification. Cross-check each rule ID (FR01-FR16) as you apply them.

---

## Formatting Rules — Apply ALL 16 in This Order

The rules are grouped into 4 phases: Structure → Typography → Language & Readability → Footer. Apply them in this exact sequence.

---

### PHASE 1: STRUCTURE (FR01, FR02, FR11, FR15, FR16)

#### Rule 1 — Staircase Formatting (FR01, Priority P2)

Restructure the post into a "staircase" visual flow. Each visual section should have progressive line lengths that create a descending effect. The reader's eye flows naturally downward like walking down stairs.

**How to apply:**
1. Start with a punchy hook line — standalone, 1 line maximum
2. Follow with short blocks of text separated by blank lines
3. Each block is a distinct thought or "step"
4. Lines within a block can vary in length — progressively shorter OR longer creates the staircase effect
5. Never dump a wall of text — if you see 5+ lines together, break them apart

**Correct example:**
```
I shipped 3 features last year.
All three flopped.

Not a single user asked for them.
Not one.

I built what I thought was cool.
Not what users needed.
```

**Wrong example:**
```
I shipped 3 features last year. All three flopped. Not a single user asked for them. Not one. I built what I thought was cool, not what users needed. This was a massive lesson in product management.
```

#### Rule 2 — Maximum 3-Line Blocks (FR02, Priority P1)

This is a HARD rule, non-negotiable. Scan every paragraph in the post. If any has 4+ consecutive lines without a blank line, split it.

**How to apply:**
1. Read through the entire post line by line
2. Count consecutive non-blank lines
3. If you reach 4, insert a blank line after line 2 or 3 (wherever the natural thought break is)
4. Aim for 1-2 line blocks as the default, 3-line blocks for emphasis

**Correct:**
```
First line of thought.
Second line.
Third line.

New block starts here.
```

**Wrong:**
```
Line one.
Line two.
Line three.
Line four.
Line five.
Line six without any break.
```

#### Rule 3 — One Idea Per Post (FR15, Priority P2)

Verify the draft focuses on exactly ONE core idea or takeaway. If the draft covers multiple topics, identify the strongest one and trim the rest.

**How to apply:**
1. Read the draft and identify the central thesis
2. If there are tangential points that dilute the main message, cut them
3. Every paragraph should support or build on the ONE idea
4. If the draft genuinely covers 2+ ideas, flag it to the user:
   > "Is draft mein 2 alag ideas hain. Main idea kaunsa hai — A ya B? Doosra cut karunga."

**Do NOT rewrite to merge ideas** — pick one and trim the other.

#### Rule 4 — Whitespace Breathing Room (FR16, Priority P2)

Use generous whitespace (blank lines) between blocks. On mobile LinkedIn, cramped text becomes unreadable.

**How to apply:**
1. Ensure every block is separated by at least one blank line
2. Major section transitions (hook → body, body → CTA) should have one blank line
3. Never have two blocks touching without a blank line separator
4. The overall post should feel "airy", not dense

#### Rule 5 — Character Limit: 800-1600 ASCII (FR11, Priority P1)

This check happens AFTER all other rules are applied (it's listed here for awareness but enforced last — see Rule 16 below). Target range: 800-1600 ASCII characters inclusive.

---

### PHASE 2: TYPOGRAPHY (FR03, FR04, FR05, FR06, FR07)

#### Rule 6 — No Bold/Italic/Underline (FR03, Priority P1)

LinkedIn renders plain text. Do NOT use any rich text formatting. Use UPPERCASE sparingly for section headers ONLY.

**How to apply:**
1. Remove ALL `**bold**`, `*italic*`, `__underline__`, or `_emphasis_` markers
2. Convert important headers to UPPERCASE (max 2-3 per post)
3. UPPERCASE is for section headers ONLY, never for emphasis within body text

**Correct:**
```
HERE'S WHAT I LEARNED

Simple sentence about the lesson.
```

**Wrong:**
```
**Here's What I Learned**

*Simple* sentence about the __lesson__.
```

**UPPERCASE placement rules:**
- Maximum 2-3 UPPERCASE headers per post
- Only for section transitions: `HERE'S WHAT I LEARNED`, `THE REAL LESSON`, `WHY THIS MATTERS`, `WHAT CHANGED`
- Never for emphasis within a sentence: "The MOST important thing" ← WRONG

#### Rule 7 — Replace Dashes with Punctuation (FR04, Priority P1)

Find ALL dashes used as em-dashes or en-dashes in the body text and replace them with proper punctuation.

**How to apply:**
1. Scan for `—`, `–`, or ` - ` used as sentence connectors (not bullets)
2. Replace with one of:
   - Period + new sentence (most common, cleanest)
   - Comma (for subordinate clauses)
   - Colon (for explanations that follow)
   - Parentheses (for asides)

**Exceptions — these dash formats are CORRECT and must be kept:**
- ` - ` when used as a bullet marker (Rule 8)
- ` —> ` when used as a flow arrow (Rule 9)

**Correct:**
```
I was tired. Really tired. But I kept going.
```

**Wrong:**
```
I was tired — really tired — but I kept going.
```

#### Rule 8 — Bullet Format: ` - ` (FR05, Priority P1)

ALL bullets must use the format ` - ` (space, hyphen, space). No exceptions.

**How to apply:**
1. Find all bullet-like markers: `•`, `*`, `–`, `→`, `>`, numbered with `)` etc.
2. Replace with ` - ` (space-hyphen-space)
3. Ensure consistent indentation for all bullets in a list
4. Bullets can appear in the body text but NOT as the dominant structure (posts are not lists)

**Correct:**
```
Three things I learned:

 - Start with the user problem
 - Validate before building
 - Ship small, learn fast
```

**Wrong:**
```
Three things I learned:
• Start with the user problem
* Validate before building
→ Ship small, learn fast
```

#### Rule 9 — Numbered Lists: `1. ` Format (FR06, Priority P2)

If the post uses numbered lists, they must use simple `digit.space` format.

**Correct:** `1. First item` | **Wrong:** `1) First item` or `(1) First item`

#### Rule 10 — Flow Arrows: `A —> B —> C` (FR07, Priority P2)

When showing a process, progression, or sequence, use the em-dash-greater-than format.

**How to apply:**
1. Find any process/flow indicators: `->`, `→`, `-->`, `=>`, or prose descriptions
2. Replace with ` —> ` (space, em-dash, greater-than, space)

**Correct:**
```
Idea —> Prototype —> User Test —> Iterate
```

**Wrong:**
```
Idea -> Prototype -> User Test -> Iterate
Idea → Prototype → User Test → Iterate
```

---

### PHASE 3: LANGUAGE & READABILITY (FR08, FR09, FR10)

#### Rule 11 — Maximum 3 Emojis (FR08, Priority P1)

Maximum 3 emojis in the entire post. Place them ONLY at points of maximum emotional tension, transition, or buildup.

**How to apply:**
1. If the draft already has emojis, count them. Remove any beyond 3.
2. If the draft has 0 emojis, consider adding 1-3 at strategic points (but 0 is also acceptable).
3. Strategic placement points:
   - **Hook line** — to grab attention (e.g., 🔥 before a bold claim)
   - **Tension/pivot point** — where the story turns (e.g., 💡 at an insight)
   - **CTA** — to drive action (e.g., 🎯 at the call-to-action)
4. Never use emojis as:
   - Bullet markers
   - Line starters for every line
   - Decoration or filler
   - More than 1 emoji per placement point

**Correct:**
```
Long post with no emojis until...

🔥 That's when everything clicked.

More text flowing naturally.
```

**Wrong:**
```
🚀 Hey everyone! 👋 Today I want to share 💡 my thoughts on 🎯 product management 📊
```

#### Rule 12 — Maximum 3 Hindi Sentences (FR09, Priority P1)

Maximum 3 Romanised Hindi (Hinglish) sentences in the entire post. Use them ONLY at emotional peaks — vulnerability, humour, deep personal insight.

**How to apply:**
1. If the draft already has Hindi sentences, count them. Remove any beyond 3.
2. Add Hindi sentences (0-3) at emotional peaks where they feel natural:
   - A personal reflection or vulnerable moment
   - A punchline or humorous aside
   - A relatable Hinglish expression
3. Hindi sentences must NOT contain content that needs to be vector-searchable (causes 15-25% lower accuracy in semantic search). Keep factual/technical content in English.
4. Each Hindi sentence should be short (under 15 words) and conversational.

**Good placements:**
```
And that's when it hit me.
Yaar, kisine nahi bataya tha ye.

But I figured it out.
```

**Bad — too much Hindi, dilutes searchability:**
```
Toh basically mujhe lagta hai ki PM ka kaam bahut mushkil hai.
Har din naye challenges aate hain.
Kabhi kabhi lagta hai ki sab theek ho jayega.
Lekin phir ek aur problem aa jata hai.
```

#### Rule 13 — FK Grade 7 Readability (FR10, Priority P1)

Target Flesch-Kincaid Grade Level 7 or below. The post should read like ad copy — simple, punchy, accessible to anyone.

**How to apply:**
1. **Sentence length:** Average 15 words or fewer per sentence. If a sentence has 20+ words, split it.
2. **Word choice:** Average 2 syllables per word. Replace complex words:
   - "utilize" → "use"
   - "implement" → "build"
   - "synthesize" → "combine"
   - "facilitate" → "help"
   - "subsequently" → "then"
   - "approximately" → "about"
3. **Voice:** Active, not passive.
   - "I learned this the hard way" ← GOOD
   - "This was learned through experience" ← BAD
4. **Jargon:** If a technical term is necessary, explain it inline or replace it with plain language.
5. **Approximation formula:** FK Grade ≈ 0.39 × (words/sentences) + 11.8 × (syllables/words) − 15.59

**Quick self-check:** Read each sentence aloud. If you stumble, simplify it.

---

### PHASE 4: FOOTER (FR12, FR13, FR14)

#### Rule 14 — CTA Line 1: Positioning Statement (FR12, Priority P1)

After the main body and CTA, add a positioning line — who you are and the value you provide. This goes AFTER the call-to-action, separated by a blank line.

**How to apply:**
1. Write a 1-sentence positioning statement
2. It should answer: "Who is this person and why should I follow them?"
3. Keep it consistent across posts (build personal brand recognition)
4. Tone: confident but not salesy

**Example:**
```
PM by day. Builder by night. Writing about what I learn.
```

**Wrong:**
```
Follow me for more content!
```

#### Rule 15 — CTA Line 2: Follow Invitation (FR13, Priority P2)

After the positioning line, add a follow invitation — a direct prompt telling the reader to follow.

**How to apply:**
1. Write a 1-sentence follow prompt
2. Be specific about what the reader gets by following
3. Keep it short and action-oriented

**Example:**
```
Follow for weekly PM insights and lessons from the trenches.
```

**Wrong:**
```
Please like share and subscribe to my newsletter and also check out my website.
```

**Combined footer example:**
```
I write about building AI products as a solo founder.
Follow for daily lessons from the trenches.
```

#### Rule 16 — Hashtags at End Only (FR14, Priority P1)

3-6 generic hashtags at the very end of the post. Never in the body text.

**How to apply:**
1. Choose 3-6 hashtags relevant to the post topic and LinkedIn audience
2. Place them after the footer lines, separated by one blank line
3. Use `#CamelCase` format
4. Mix broad + niche: e.g., `#ProductManagement #Startup #BuildInPublic #SoloFounder`
5. Never embed hashtags in body text sentences

**Correct placement:**
```
[main post body]

[positioning line]
[follow line]

#ProductManagement #Career #Startup #BuildInPublic
```

---

### FINAL CHECK: Character Count Enforcement (FR11)

After ALL 16 rules are applied, count the total ASCII characters (including blank lines, emojis, hashtags — everything).

**Target: 800-1600 characters (inclusive)**

**If under 800:**
1. Expand a key point with a concrete example (1-2 sentences)
2. Add another body block that deepens the main idea
3. Elaborate the CTA or positioning statement
4. Do NOT pad with filler words or generic statements

**If over 1600:**
1. Tighten sentences — cut redundant words ("very", "really", "actually", "basically")
2. Remove the weakest body block (the one that contributes least to the main idea)
3. Shorten the longest sentences
4. Do NOT cut the hook, CTA, positioning, follow, or hashtags — cut from the body

**If still out of range after 2 adjustment attempts:**
Flag to user with current count and let them decide what to cut/add.

---

## Formatting Execution Order (Summary)

```
Raw Draft
  │
  ├─ 1. Identify single core idea (FR15)
  ├─ 2. Apply staircase layout (FR01)
  ├─ 3. Enforce 3-line blocks (FR02)
  ├─ 4. Add whitespace breathing room (FR16)
  │
  ├─ 5. Strip bold/italic/underline, add UPPERCASE headers (FR03)
  ├─ 6. Replace dashes with punctuation (FR04)
  ├─ 7. Fix bullet format to ' - ' (FR05)
  ├─ 8. Fix numbered lists to '1. ' (FR06)
  ├─ 9. Fix flow arrows to 'A —> B —> C' (FR07)
  │
  ├─ 10. Place emojis at tension points (FR08, max 3)
  ├─ 11. Add Hindi sentences at emotional peaks (FR09, max 3)
  ├─ 12. Simplify to FK Grade 7 (FR10)
  │
  ├─ 13. Add positioning statement (FR12)
  ├─ 14. Add follow line (FR13)
  ├─ 15. Add 3-6 hashtags at end (FR14)
  │
  └─ 16. Check character count 800-1600 (FR11) — adjust if needed
          │
          Formatted Post
```

---

## After Formatting

Present the formatted version to the user for initial feedback. Show it as regular text (NOT in a code block — that is F.3's job):

> "Yeh raha formatted version. Ek nazar daalo:"
>
> {formatted post displayed as regular text}
>
> "Kuch acha lag raha hai? Ya koi changes chahiye isse code-block preview mein dikhane se pehle?"

**If user says looks good:** Proceed to **F.3** (Generate Preview).

**If user wants immediate changes:** Apply ONLY the specific changes requested. Do NOT re-run all 16 rules. Show the updated version. Ask again. Then proceed to F.3.

---

## Iteration Tracking

Track how many times you've applied changes in this step:
- **Iteration 1:** Initial full formatting (all 16 rules)
- **Iteration 2+:** Targeted changes based on user feedback
- **If iteration 4+:** Gently suggest:
  > "Yeh {N}th iteration hai. Agar major changes chahiye toh B-Drafting mein wapas jaana better hoga — wahan content change karo, phir fresh format karunga."

---

## Error Handling

**If `raw_content` is empty or missing:**
> "Is post mein raw content nahi hai — draft incomplete lag raha hai. B-Drafting mein wapas jaake draft complete karo."

Exit the workflow. Revert status to `Drafted` via `sma-update-post`. Do NOT attempt to format an empty post.

**If character count cannot be brought into 800-1600 range after 2 attempts:**
> "Character count {count} hai — {over/under} limit ke. Best effort adjust kar diya hai. Preview mein dekh lo, agar theek nahi lage toh manually adjust karenge."

Proceed to F.3 with a warning flag.

**If draft content is not in English (fully Hindi/other language):**
> "Draft Hindi mein hai — formatting rules English content ke liye designed hain. B-Drafting mein English mein rewrite karo (Hindi max 3 sentences)."

Exit the workflow.

---

## What NOT to Do

- ❌ Do NOT rewrite the post content, arguments, or voice — only FORMAT
- ❌ Do NOT add new ideas, stories, or examples not present in the draft
- ❌ Do NOT use bold, italic, or underline (LinkedIn plain text only)
- ❌ Do NOT exceed any formatting limit (3 emojis, 3 Hindi sentences, 6 hashtags, 1600 chars)
- ❌ Do NOT skip any of the 16 rules — ALL are mandatory
- ❌ Do NOT show the formatted post in a code block here (that is F.3's job)
- ❌ Do NOT change the core message, thesis, or voice of the draft
- ❌ Do NOT add jargon, complex words, or passive voice constructions
- ❌ Do NOT place emojis as decoration or bullet markers
- ❌ Do NOT use Hindi for factual/technical content (hurts vector search accuracy)
- ❌ Do NOT embed hashtags in the body text
- ❌ Do NOT use rich text Unicode characters (𝗯𝗼𝗹𝗱, 𝘪𝘵𝘢𝘭𝘪𝘤) as a workaround

---

## Success Criteria

- [ ] All 16 formatting rules (FR01-FR16) applied and verified
- [ ] Staircase layout visually flows downward
- [ ] No block exceeds 3 consecutive lines
- [ ] Zero rich text formatting (no bold/italic/underline)
- [ ] Max 2-3 UPPERCASE headers, used only for section transitions
- [ ] All dashes replaced with proper punctuation (except bullet/flow exceptions)
- [ ] All bullets use ` - ` format
- [ ] All numbered lists use `1. ` format
- [ ] All flows use `A —> B —> C` format
- [ ] Emoji count: 0-3, placed only at tension/transition points
- [ ] Hindi sentence count: 0-3, placed only at emotional peaks
- [ ] FK Grade ≤ 7 (short sentences, simple words, active voice)
- [ ] Positioning statement present after CTA
- [ ] Follow line present after positioning
- [ ] 3-6 hashtags at the very end, not in body
- [ ] Character count: 800-1600 ASCII (inclusive)
- [ ] Post focuses on one core idea
- [ ] Generous whitespace between blocks
- [ ] Original draft's substance, arguments, and voice preserved
- [ ] User shown formatted version and gave initial feedback

---

## Output for Next Step

Pass to **F.3**:
```
formatted_content — the fully formatted post text (all 16 rules applied)
selected_post — original post object (for metadata: post_id, title, topic, etc.)
formatting_stats:
  - character_count: {number}
  - emoji_count: {number}
  - hindi_sentence_count: {number}
  - hashtag_count: {number}
  - uppercase_header_count: {number}
  - max_block_lines: {number}  (should be ≤ 3)
  - approx_fk_grade: {number}  (should be ≤ 7)
  - has_positioning: {boolean}
  - has_follow_line: {boolean}
  - has_rich_text: {boolean}  (should be false)
  - iteration_count: {number}
```
