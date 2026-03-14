# Step V.01 — Validate Formatted Post

**Agent:** Pixel (Validation Mode)
**Trigger:** Called after the formatting workflow completes, or independently to verify a post with `Previewed` status.

---

## What You Do

Read all workflow artifacts and verify that the formatted post meets every quality gate. Produce a validation report with PASS/FAIL per criterion.

---

## Actions

### 1. Load Artifacts
- Fetch the post from MongoDB via `sma-fetch-post` (by post_id or status = `Previewed`)
- Load the `formatted_content` field from the post record
- Load the formatting rules reference (`formatting-rules.csv`)

### 2. Run Validation Checks

#### Status Check
- [ ] Post status is `Previewed`
- [ ] Post was previously in `Formatting` status (status history)
- [ ] `formatted_content` field is non-empty
- [ ] `formatted_at` timestamp exists

#### Character Count
- [ ] ASCII character count is between 800 and 1600 (inclusive)
- Actual count: {count}

#### Rich Text Check
- [ ] No bold markers (`**`, `__`)
- [ ] No italic markers (`*`, `_` used for emphasis)
- [ ] No underline markers
- LinkedIn is plain text only

#### Staircase Layout
- [ ] Post has multiple blocks separated by blank lines
- [ ] No single block exceeds 3 consecutive lines
- [ ] Visual flow progresses downward (hook -> body -> CTA -> hashtags)

#### Emoji Check
- [ ] Total emoji count: {count} (max 3)
- [ ] Emojis placed at tension/transition points (not decorative)

#### Dash Check
- [ ] No informal dashes found (hyphens used as em-dashes)
- [ ] Exception: ` - ` in bullets and ` —> ` in flow arrows are acceptable

#### Bullet Format
- [ ] All bullets use ` - ` format
- [ ] No `•`, `*`, `–` bullet styles found

#### Flow Arrow Format
- [ ] All flows use `A —> B —> C` format
- [ ] No `->`, `→`, `-->` found

#### Hindi Check
- [ ] Hindi sentence count: {count} (max 3)
- [ ] Hindi used only at emotional peaks (subjective — flag for human review if unsure)

#### Readability
- [ ] Approximate FK Grade Level: {grade} (target ≤ 7)
- [ ] Sentences are short and clear

#### CTA Check
- [ ] CTA is present at end of post
- [ ] CTA includes positioning statement
- [ ] CTA includes follow prompt

#### Hashtag Check
- [ ] Hashtag count: {count} (range 3-6)
- [ ] Hashtags are at the very end of the post
- [ ] Hashtags are separated from CTA by a blank line

#### Preview Check
- [ ] Code-block preview was generated (check session log)
- [ ] User explicitly approved the preview

### 3. Generate Report

Present the validation summary:

> **Validation Report — {title}**
>
> | Check | Result | Notes |
> |-------|--------|-------|
> | Status = Previewed | PASS/FAIL | |
> | Characters (800-1600) | PASS/FAIL | Actual: {count} |
> | No rich text | PASS/FAIL | |
> | Staircase layout | PASS/FAIL | |
> | 3-line blocks | PASS/FAIL | |
> | Emojis (max 3) | PASS/FAIL | Count: {count} |
> | No dashes | PASS/FAIL | |
> | Bullet format | PASS/FAIL | |
> | Flow arrow format | PASS/FAIL | |
> | Hindi (max 3) | PASS/FAIL | Count: {count} |
> | FK ≤ Grade 7 | PASS/FAIL | Grade: ~{grade} |
> | CTA + positioning | PASS/FAIL | |
> | CTA + follow | PASS/FAIL | |
> | Hashtags (3-6) | PASS/FAIL | Count: {count} |
> | Preview shown | PASS/FAIL | |
> | User approved | PASS/FAIL | |
>
> **Overall: {PASS/FAIL}** ({pass_count}/{total_count} checks passed)

### 4. Handle Results

**All PASS:** Post is validated. Ready for C-Review.
> "Validation complete — sab checks pass hue. Post C-Review ke liye ready hai."

**Any FAIL:** Flag the failures.
> "Validation mein {fail_count} issues mile. Fix karne ke liye F-Formatting workflow dubara run karo."

---

## What NOT to Do
- Do NOT auto-fix issues during validation — only report them
- Do NOT change post status during validation
- Do NOT skip any check — all are mandatory
