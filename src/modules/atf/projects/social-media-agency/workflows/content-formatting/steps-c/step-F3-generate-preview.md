# Step F.3 — Generate Preview

**Agent:** Pixel (flex-crafter)
**Trigger:** Formatting complete in F.2 — user approved the initial formatted version (or changes have been applied and user is satisfied with the text).

---

## What You Do

Render the fully formatted post inside a markdown code block so the user sees EXACTLY what it will look like when pasted into LinkedIn. Display a formatting stats table showing all rule compliance metrics. Flag any violations. Ask the user to approve, request changes, or reject.

This step is the quality gate — no post advances to `Previewed` status unless ALL metrics pass and the user explicitly approves.

---

## Input

- `formatted_content` — the fully formatted post text from F.2
- `selected_post` — original post object (post_id, title, topic, etc.)
- `formatting_stats` — all metrics computed in F.2

---

## Action 1: Compute Final Stats

Before rendering, compute or verify all formatting stats from the `formatted_content`:

### Character Count
Count all ASCII characters in `formatted_content` including:
- Letters, digits, punctuation, spaces
- Blank lines (each counts as a newline character)
- Emojis (count as their byte length, but for simplicity count each emoji as 1 character)
- Hashtags (the `#` symbol + tag text)

**Target: 800-1600 (inclusive)**

### Emoji Count
Count all emoji characters in the post. Regex pattern: any Unicode emoji.

**Target: 0-3**

### Hindi Sentence Count
Count sentences that are primarily in Romanised Hindi/Hinglish. A sentence counts as Hindi if >50% of its words are Hindi.

**Target: 0-3**

### Hashtag Count
Count all `#word` patterns at the end of the post.

**Target: 3-6**

### UPPERCASE Header Count
Count lines that are entirely UPPERCASE (excluding hashtags and short words like "I").

**Target: 0-3**

### Max Block Lines
Scan the post for the longest sequence of consecutive non-blank lines.

**Target: ≤ 3**

### Rich Text Check
Scan for any `**`, `*`, `__`, `_` markdown formatting markers, or Unicode bold/italic characters.

**Target: None found**

### FK Grade Level (Approximate)
Calculate: `FK Grade ≈ 0.39 × (total words / total sentences) + 11.8 × (total syllables / total words) − 15.59`

**Syllable counting shortcut:**
- Count vowel groups (a, e, i, o, u) in each word
- Subtract 1 for silent-e at end of word
- Minimum 1 syllable per word

**Target: ≤ 7.0**

### Positioning Statement Check
Check if the post has a positioning line after the CTA (who you are / value you provide).

**Target: Present**

### Follow Line Check
Check if the post has a follow invitation after the positioning line.

**Target: Present**

---

## Action 2: Render Code Block Preview

Wrap the entire `formatted_content` in a markdown code block using triple backticks. This is the "what you see is what you get" preview — it shows exactly how the post will look when pasted into LinkedIn's compose box.

Present it to the user:

> "Yeh raha final preview — exactly aisa dikhega LinkedIn pe:"

````
```
{formatted_content exactly as it will appear on LinkedIn — every line, every blank line, every emoji, every hashtag}
```
````

**Important:**
- The code block content must be an EXACT copy of `formatted_content`
- No additional formatting, no line numbers, no annotations inside the code block
- Blank lines inside the post must be preserved in the code block
- Emojis must render correctly

---

## Action 3: Display Stats Table

Below the code block, show the formatting compliance table:

> **Formatting Stats:**
>
> | # | Metric | Value | Limit | Status |
> |---|--------|-------|-------|--------|
> | FR01 | Staircase layout | Applied | Visual flow | ✅ PASS |
> | FR02 | Max block lines | {max_block} | ≤ 3 | ✅/❌ |
> | FR03 | Rich text | {none/found} | None allowed | ✅/❌ |
> | FR04 | Dashes replaced | {count} replaced | No em-dashes | ✅/❌ |
> | FR05 | Bullet format | All ` - ` | ` - ` only | ✅/❌ |
> | FR06 | Numbered lists | {format} | `1. ` format | ✅/❌ |
> | FR07 | Flow arrows | {count} flows | `A —> B` format | ✅/❌ |
> | FR08 | Emojis | {count} | 0-3 | ✅/❌ |
> | FR09 | Hindi sentences | {count} | 0-3 | ✅/❌ |
> | FR10 | FK Grade Level | ~{grade} | ≤ 7 | ✅/❌ |
> | FR11 | Characters | {count} | 800-1600 | ✅/❌ |
> | FR12 | Positioning line | {yes/no} | Required | ✅/❌ |
> | FR13 | Follow line | {yes/no} | Required | ✅/❌ |
> | FR14 | Hashtags | {count} | 3-6 | ✅/❌ |
> | FR15 | Single idea | {yes/no} | One idea | ✅/❌ |
> | FR16 | Whitespace | {adequate/cramped} | Generous | ✅/❌ |

---

## Action 4: Handle Failures

**If any metric shows ❌ FAIL:**

Do NOT allow the user to approve. Flag the failures prominently:

> "⚠️ {N} rule(s) fail ho rahi hain:"
>
> - FR{XX}: {metric} — current: {value}, limit: {limit}
> - FR{YY}: {metric} — current: {value}, limit: {limit}
>
> "Auto-fix karun? Ya tum batao kya change karna hai."

**Auto-fix behavior by rule:**

| Failed Rule | Auto-Fix Action |
|-------------|----------------|
| FR02 (block >3 lines) | Insert blank line at the nearest thought break |
| FR03 (rich text found) | Strip all markdown formatting markers |
| FR04 (dashes remain) | Replace with period + new sentence |
| FR05 (wrong bullet format) | Replace with ` - ` |
| FR06 (wrong number format) | Replace with `1. ` |
| FR07 (wrong flow format) | Replace with ` —> ` |
| FR08 (>3 emojis) | Remove emojis from least impactful positions |
| FR09 (>3 Hindi sentences) | Remove Hindi from least emotional positions |
| FR10 (FK grade >7) | Split longest sentences, simplify biggest words |
| FR11 (chars <800) | Expand weakest body block with a concrete example |
| FR11 (chars >1600) | Trim redundant words, cut weakest body block |
| FR12 (no positioning) | Add default positioning line |
| FR13 (no follow line) | Add default follow line |
| FR14 (hashtags wrong) | Add/remove hashtags to hit 3-6 range |

After auto-fix, regenerate the preview (loop back to Action 2 of this step). Do NOT go back to F.2 for auto-fixes — those are minor adjustments.

**If auto-fix fails after 2 attempts on the same rule:**
> "FR{XX} auto-fix se theek nahi ho raha. Manually adjust karna padega — kya change karein?"

Let user decide. Apply their specific change. Regenerate preview.

---

## Action 5: Ask User Decision

Once all stats show ✅ PASS, present the three options:

> "Sab rules pass ho rahe hain! Ab decide karo:"
>
> 1. **Approve** — "Haan, sahi hai. Approve karo." → Post saves as `Previewed`
> 2. **Changes** — "Yeh change karo: {batao kya}" → Loop back to F.2 for targeted edits
> 3. **Reject** — "Nahi, yeh draft wapas bhejo." → Reverts to `Drafted`, exits workflow

Wait for explicit user input. Do NOT assume approval.

---

## Readability Score Display

Below the stats table, show a human-readable summary of the FK Grade assessment:

> **Readability Check (FK Grade ~{grade}):**
> - Average sentence length: {words} words (target: ≤15)
> - Average word length: {syllables} syllables (target: ≤2)
> - Voice: {active/mixed/passive}
> - Verdict: {grade ≤ 7 ? "Easy to read — accessible to general audience" : "Too complex — needs simplification"}

---

## Error Handling

**If formatted_content is somehow empty at this point:**
> "Formatted content kho gaya — F.2 se wapas shuru karna padega."

Go back to F.2 with the original `raw_content`.

**If stats computation fails (edge case):**
Show the code block preview anyway, but warn:
> "Stats calculate nahi ho paye — preview dekh lo manually. Character count approximate: {rough_count}."

Proceed with user decision but flag the gap.

---

## What NOT to Do

- ❌ Do NOT skip the code block preview — it is MANDATORY
- ❌ Do NOT skip the stats table — user MUST see all 16 metrics
- ❌ Do NOT allow approval if ANY formatting rule fails (❌ in the table)
- ❌ Do NOT show the preview outside of a code block
- ❌ Do NOT modify the formatted content without user consent during this step (except auto-fixes for failed rules)
- ❌ Do NOT add annotations, line numbers, or comments inside the code block
- ❌ Do NOT round character count — show the exact number
- ❌ Do NOT skip the readability summary

---

## Success Criteria

- [ ] Formatted post rendered inside a markdown code block (exact copy)
- [ ] All 16 formatting metrics computed and displayed in the stats table
- [ ] All metrics show ✅ PASS (no ❌ failures remain)
- [ ] Character count displayed as exact number within 800-1600
- [ ] FK Grade Level displayed with sentence/word length breakdown
- [ ] Readability summary shown below stats table
- [ ] User presented with 3 clear options (approve/changes/reject)
- [ ] No approval allowed while any metric fails
- [ ] Auto-fix offered and applied for any failing metrics
- [ ] User's explicit decision captured

---

## Output for Next Step

Pass to **F.4**:
```
formatted_content — the approved (or rejected) formatted post
selected_post — original post object (post_id, title, topic, etc.)
formatting_stats — all 16 metrics with PASS/FAIL status
user_decision — "approve" | "changes" | "reject"
change_requests — (if "changes") specific feedback text from user
```
