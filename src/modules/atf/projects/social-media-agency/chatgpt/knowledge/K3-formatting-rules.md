# K3 — Formatting Rules (FR01-FR16)

These 16 rules define how every LinkedIn post must be formatted. Apply ALL rules during the F (Formatting) workflow. Priority: P1 = must pass, P2 = should pass.

---

## FR01: Staircase Formatting (P2)
**Rule:** Lines should progressively vary in length — short, medium, long or long, medium, short. Creates visual rhythm.

**Correct:**
```
I failed 3 interviews.

Not because I didn't know the answers.
Because I didn't know which answers mattered.
```

**Wrong:**
```
I failed 3 interviews. Not because I didn't know the answers. Because I didn't know which answers mattered.
```

**Validation:** No two consecutive lines should be the same length (within 10 chars). Visual blocks should show length variation.

---

## FR02: Max Three-Line Blocks (P1)
**Rule:** Maximum 3 consecutive non-empty lines, then a blank line. No wall of text.

**Correct:**
```
Line one.
Line two.
Line three.

Next block starts here.
```

**Wrong:**
```
Line one.
Line two.
Line three.
Line four.
Line five.
```

**Validation:** Count consecutive non-empty lines. If any block exceeds 3, fail.

---

## FR03: No Bold/Italic/Underline (P1)
**Rule:** LinkedIn doesn't render markdown formatting well. Use UPPERCASE for headers sparingly (max 2 per post).

**Correct:** `THE HARD TRUTH`
**Wrong:** `**The Hard Truth**` or `_The Hard Truth_`

**Validation:** No `**`, `__`, `*text*`, or `_text_` patterns in output.

---

## FR04: Replace Dashes with Punctuation (P1)
**Rule:** Replace em-dashes and en-dashes with full stops, commas, or line breaks. Exception: flow arrows (`-->`).

**Correct:** `I tried everything. Nothing worked.`
**Wrong:** `I tried everything — nothing worked.`

**Validation:** No standalone `—` or `–` characters (arrows `-->` are OK).

---

## FR05: Bullets Format (P1)
**Rule:** Use space-hyphen-space (` - `) for bullet points.

**Correct:**
```
 - First point
 - Second point
 - Third point
```

**Wrong:**
```
• First point
- First point (no leading space)
* First point
```

**Validation:** All bullet lines start with ` - ` (space, hyphen, space).

---

## FR06: Numbered Lists Format (P2)
**Rule:** Use digit-period-space format.

**Correct:** `1. First item`
**Wrong:** `1) First item` or `1- First item`

---

## FR07: Flows Format (P2)
**Rule:** Use arrow format with spaces and em-dash arrow.

**Correct:** `Idea --> Prototype --> Launch`
**Wrong:** `Idea -> Prototype -> Launch` or `Idea → Prototype → Launch`

---

## FR08: Max Three Emojis (P1)
**Rule:** Maximum 3 emojis per post, placed only at emotional tension points (not decorative).

**Correct:** One emoji at the hook, one at the turning point, one at CTA.
**Wrong:** Emoji on every line, emoji bullets, emoji headers.

**Validation:** Count total emoji characters. If > 3, fail.

---

## FR09: Max Three Hindi Sentences (P1)
**Rule:** Maximum 3 Romanised Hindi sentences, used only at emotional peaks for authenticity.

**Correct:** `"Kuch toh log kahenge" — that's what kept me going.`
**Wrong:** Full paragraphs in Hindi, or Hindi used for casual filler.

**Validation:** Count Hindi sentences. If > 3, fail.

---

## FR10: FK Grade 7 Readability (P1)
**Rule:** Write at Flesch-Kincaid Grade 7 level. Ad copy style. Short sentences. Layman language. No jargon without explanation.

**Correct:** `We shipped it in 2 weeks. Users loved it.`
**Wrong:** `The implementation was expeditiously deployed within a fortnight, garnering positive user sentiment.`

**Validation:** Average sentence length < 15 words. No words > 3 syllables without context.

---

## FR11: Character Limit (P1)
**Rule:** Total post must be 800-1600 ASCII characters (including spaces, excluding code block markers).

**Validation:** Count characters. If < 800 or > 1600, fail. Show exact count.

---

## FR12: Footer Line 1 — Positioning (P1)
**Rule:** After the CTA, the first footer line should be a positioning statement — who you are and the value you provide. Use positioning templates (PT01-PT31).

**Correct:** `PM by day. Builder by night. Writing about what I learn.`
**Wrong:** `Follow me for more content!`

**Validation:** Must contain a positioning line between CTA and hashtags.

---

## FR13: Footer Line 2 — Follow (P2)
**Rule:** After the positioning line, add a follow invitation line.

**Correct:** `Follow for weekly PM insights and career stories.`
**Wrong:** `Please like share and subscribe to my newsletter and also check out my website.`

---

## FR14: Hashtags at End Only (P1)
**Rule:** 3-6 generic hashtags placed only at the very end of the post. Never in the body text.

**Correct:**
```
[full post]

#ProductManagement #Career #Startup
```

**Wrong:** `I love #ProductManagement because it lets me work on #Startup ideas in my #Career`

**Validation:** All hashtags must appear only after the footer lines, never inline in the body.

---

## FR15: One Idea Per Post (P2)
**Rule:** Each post should focus on exactly one core idea or takeaway.

**Correct:** `One post about one lesson from one experience with one clear takeaway.`
**Wrong:** `A post that covers 5 different topics jumping from career advice to tool reviews to personal stories.`

---

## FR16: Whitespace Breathing Room (P2)
**Rule:** Use generous whitespace between blocks to create visual breathing room on mobile.

**Correct:**
```
Short line.

Another thought.

Key point here.
```

**Wrong:** `Short line. Another thought. Key point here. All cramped together in a single block.`

---

## Quick Checklist

| # | Rule | P | Pass? |
|---|------|---|-------|
| FR01 | Staircase formatting | P2 | |
| FR02 | Max 3-line blocks | P1 | |
| FR03 | No bold/italic/underline | P1 | |
| FR04 | No dashes (except arrows) | P1 | |
| FR05 | Bullets: ` - ` format | P1 | |
| FR06 | Numbers: `1. ` format | P2 | |
| FR07 | Flows: `-->` format | P2 | |
| FR08 | Max 3 emojis | P1 | |
| FR09 | Max 3 Hindi sentences | P1 | |
| FR10 | FK Grade 7 | P1 | |
| FR11 | 800-1600 characters | P1 | |
| FR12 | Footer positioning line | P1 | |
| FR13 | Footer follow line | P2 | |
| FR14 | Hashtags at end only | P1 | |
| FR15 | One idea per post | P2 | |
| FR16 | Whitespace breathing room | P2 | |

All P1 rules MUST pass. P2 rules SHOULD pass (warn if not).
