# Step E.02 — Apply Formatting Edit

**Agent:** Content Strategist (Edit Mode)
**Trigger:** Assessment complete in E.01, user confirmed which edits to apply.

---

## What You Do

Apply the requested formatting corrections to the post, regenerate the preview, and re-validate. This follows the same quality standards as the original F.2/F.3 flow but targets specific issues rather than a full format pass.

---

## Input
- `post` — full post object
- `formatted_content` — current formatted text
- `issues[]` — identified issues from E.01
- `user_instructions` — what the user wants fixed

---

## Actions

### 1. Apply Corrections
For each issue the user wants fixed:
- Apply the correction to `formatted_content`
- Track what was changed (before/after for each fix)
- Ensure the fix does not violate any OTHER formatting rule

Common corrections:
- **Character count:** Trim or expand content to hit 800-1600 range
- **Block length:** Split long blocks with blank lines
- **Emoji adjustment:** Add/remove/reposition emojis
- **Dash cleanup:** Replace remaining dashes with proper punctuation
- **Bullet format:** Convert to ` - ` format
- **Hindi adjustment:** Add/remove/reposition Hindi sentences
- **CTA fix:** Add missing positioning or follow prompt
- **Hashtag fix:** Adjust count or placement

### 2. Show Changes
Present what was changed:

> **Changes Applied:**
>
> {For each change:}
> - **{Rule}:** {Brief description of what changed}

### 3. Regenerate Preview
Follow the same process as F.3:
- Render the updated post in a code block
- Show the stats table (character count, emoji count, Hindi count, hashtag count, FK grade)
- Flag any remaining issues

````
```
{updated formatted content}
```
````

> **Updated Formatting Stats:**
>
> | Metric | Value | Limit | Status |
> |--------|-------|-------|--------|
> | Characters | {count} | 800-1600 | PASS/FAIL |
> | Emojis | {count} | Max 3 | PASS/FAIL |
> | Hindi sentences | {count} | Max 3 | PASS/FAIL |
> | Hashtags | {count} | 3-6 | PASS/FAIL |
> | FK Grade Level | ~{grade} | ≤ 7 | PASS/FAIL |

### 4. Re-validate
Run the full validation checklist against the updated content. If any rule still fails, flag it.

### 5. Ask User
> "Updated preview theek hai? Save karoon?"

Options:
1. **Save** — Update the post via `sma-update-post` with the corrected `formatted_content`
2. **More changes** — Loop back to step 1 of this file
3. **Discard** — Keep the original formatted content, exit edit mode

### 6. Save (If Approved)

**POST** `https://n8n.linkright.in/webhook/sma-update-post`

```json
{
  "post_id": "{post.post_id}",
  "formatted_content": "{updated_formatted_content}",
  "formatted_at": "{current_timestamp}"
}
```

> "Updated content save ho gaya. Post `Previewed` status mein hai — C-Review ke liye ready."

---

## Error Handling

**If a fix introduces a new violation:**
> "Yeh change karne se {other_rule} break ho raha hai. Dono fix karta hoon."

Auto-resolve the conflict if possible. If not, present both issues to the user and ask for guidance.

**If save webhook fails:**
Retry once. On second failure, provide the updated content to the user:
> "Save nahi ho paya. Yeh raha updated content — manually save karo ya baad mein retry karenge."

---

## What NOT to Do
- Do NOT rewrite the post substance — only fix formatting issues
- Do NOT apply changes the user did not request (unless they break other rules)
- Do NOT skip the preview regeneration — user must see the updated version
- Do NOT skip re-validation — all rules must pass after edits
- Do NOT save without user approval

---

## Output

```
post — updated post object
formatted_content — corrected formatted text (saved or discarded)
validation_result — PASS/FAIL summary
```
