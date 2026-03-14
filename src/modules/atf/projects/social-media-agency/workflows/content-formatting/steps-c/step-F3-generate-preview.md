# Step F.3 — Generate Preview

**Agent:** Content Strategist
**Trigger:** Formatting complete in F.2 (user approved the initial formatted version).

---

## What You Do

Take the formatted post and render it in a markdown code block so the user can see EXACTLY how it will look on LinkedIn. Display formatting statistics for verification.

---

## Input
- `formatted_content` — the fully formatted post text from F.2
- `formatting_stats` — character count, emoji count, Hindi count, hashtag count, FK grade

---

## Action: Render Preview

### 1. Code Block Preview
Wrap the entire formatted post in a markdown code block (triple backticks). This is the "what you see is what you get" preview.

````
```
{formatted_content exactly as it will appear on LinkedIn}
```
````

### 2. Stats Summary
Below the code block, present the formatting stats in a clean table:

> **Formatting Stats:**
>
> | Metric | Value | Limit | Status |
> |--------|-------|-------|--------|
> | Characters | {count} | 800-1600 | PASS/FAIL |
> | Emojis | {count} | Max 3 | PASS/FAIL |
> | Hindi sentences | {count} | Max 3 | PASS/FAIL |
> | Hashtags | {count} | 3-6 | PASS/FAIL |
> | FK Grade Level | ~{grade} | ≤ 7 | PASS/FAIL |
> | 3-line blocks | {compliant} | All blocks ≤ 3 lines | PASS/FAIL |
> | Rich text | None | No bold/italic/underline | PASS/FAIL |

If any metric shows FAIL, flag it prominently:
> "Ek issue hai: {metric} limit se bahar hai. Fix karna padega."

### 3. Ask for User Decision
> "Preview theek hai? Koi changes chahiye?"

Present the options:
1. **Approve** — "Haan, sahi hai. Approve karo."
2. **Changes** — "Yeh change karo: {specific feedback}"
3. **Reject** — "Nahi, yeh draft wapas bhejo. Formatting band karo."

---

## After the Decision

**Approve:** Proceed to **F.4** (User Approval) to finalize and save.

**Changes:** Note the specific changes requested. Go back to **F.2** to apply ONLY the requested changes (not a full re-format). Then return to F.3 to regenerate the preview.

**Reject:** Proceed to **F.4** with rejection flag (F.4 handles the status revert).

---

## Error Handling

**If any stat shows FAIL:**
Do NOT allow approval until all stats pass. Offer to auto-fix:
> "Character count thoda zyada hai. Trim kar doon? Ya tum batao kya cut karna hai."

Fix the issue, regenerate the preview, and ask again.

---

## What NOT to Do
- Do NOT skip the code block preview — it is MANDATORY
- Do NOT skip the stats table — user must see all metrics
- Do NOT allow approval if any formatting rule fails
- Do NOT show the preview outside of a code block (the code block IS the preview)
- Do NOT modify the formatted content without user consent during this step

---

## Output for Next Step

Pass to **F.4**:
```
formatted_content — the approved (or rejected) formatted post
selected_post — original post object
user_decision — "approve", "changes", or "reject"
change_requests — (if changes) specific feedback from user
```
