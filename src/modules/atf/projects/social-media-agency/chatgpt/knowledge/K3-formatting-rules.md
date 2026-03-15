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

## FR12: CTA Placement (P1)
**Rule:** Call-to-action must be in the last 3 lines of the main content (before positioning and hashtags).

**Correct:**
```
What's your take? Drop a comment below.

---
PM by day. Builder by night.
Follow for more.

#ProductManagement #LinkedIn #Career
```

---

## FR13: Positioning Line (P1)
**Rule:** A one-liner from positioning templates (PT01-PT31) placed after the CTA separator.

**Validation:** Must contain a positioning line between CTA and hashtags.

---

## FR14: Follow CTA (P1)
**Rule:** "Follow for more" or equivalent after positioning line.

---

## FR15: Hashtags (P2)
**Rule:** 3-6 relevant hashtags on the last line. Use # prefix, PascalCase or lowercase.

**Correct:** `#ProductManagement #StartupLife #CareerGrowth`
**Wrong:** 10+ hashtags, hashtags scattered through post, hashtags in sentences.

---

## FR16: Code Block Preview (P1)
**Rule:** Always show the final formatted post inside a code block with stats underneath.

**Format:**
```
[POST PREVIEW]
---
Characters: 1,234 / 1,600
Lines: 18
Emojis: 2/3
Hindi: 1/3
Hashtags: 4
Rules: 16/16 passed
```

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
| FR12 | CTA in last 3 lines | P1 | |
| FR13 | Positioning line present | P1 | |
| FR14 | Follow CTA present | P1 | |
| FR15 | 3-6 hashtags at end | P2 | |
| FR16 | Code block preview shown | P1 | |

All P1 rules MUST pass. P2 rules SHOULD pass (warn if not).
