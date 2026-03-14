# Step C.3 — Apply Minor Edits

**Agent:** Pixel (flex-crafter)
**Trigger:** User chose "Edit" in C.2 for the current post.

---

## What You Do

You take the user's edit instructions, apply them to the `formatted_content`, re-validate against formatting rules, show the updated preview, and loop until the user approves the edited version.

---

## Prerequisites

From **C.2**:
- `current_post` — the full post object being edited
- `edit_instructions` — user's requested changes

---

## Execution Flow

### 1. Understand the Edit Request

Parse the user's instructions. Common edit types:
- **Typo fix** — "line 3 mein 'teh' ko 'the' karo"
- **Word swap** — "'amazing' hatao, 'powerful' lagao"
- **Line rewrite** — "CTA line change karo to '...'"
- **Add/remove emoji** — "wahan pe ek emoji add karo"
- **Hashtag change** — "hashtag #AI hatao, #MachineLearning lagao"
- **Shorten** — "thoda chhota karo, 1200 chars ke andar"

If the edit is unclear, ask for clarification:
> "Exactly kya change karna hai? Line number ya specific text batao."

### 2. Apply Edits to `formatted_content`

Make the requested changes to `formatted_content`. Maintain all existing formatting:
- Preserve staircase formatting / line breaks
- Preserve UPPERCASE headers
- Keep emoji count ≤ 3
- Keep character count within 800–1600 range
- Preserve bullet formatting (" - ") and flow formatting ("A —> B —> C")

### 3. Re-validate Formatting Rules

After applying edits, check:

| Rule | Check |
|------|-------|
| Character count | 800–1600 ASCII chars |
| Emoji count | ≤ 3 |
| No bold/italic/underline | Plain text only |
| Line blocks | Max 3 lines per block |
| Hashtags | 3–6 at end |
| FK readability | Grade 7 target |

**If any rule violated by the edit:**
> "Edit ke baad character count {count} ho gaya (max 1600). Thoda trim karna padega — kahan se remove karein?"

Help user fix the violation before proceeding.

### 4. Show Updated Preview

Display the edited content in the same format as C.2:

> **EDITED PREVIEW:**

```
{updated_formatted_content}
```

> - Characters: {new_char_count} / 1600 max
> - Changes made: {summary_of_changes}
>
> "Ye theek hai? (approve / aur edit / revert)"

### 5. User Decision on Edited Version

**If user says "approve" / "theek hai" / "haan":**

Save the edited content:

**POST** `https://n8n.linkright.in/webhook/sma-update-post`

```json
{
  "post_id": "{_id}",
  "updates": {
    "status": "Ready_ToPublish",
    "formatted_content": "{updated_formatted_content}",
    "reviewed_at": "{ISO_timestamp}",
    "review_decision": "edited_and_approved",
    "edit_summary": "{brief description of changes made}"
  }
}
```

**On success:**
> "Edited post approved aur saved! Scheduled date pe publish hoga."

Increment `edited_count`. Return to **C.2** for the next post (or **C.4** if all done).

**If user says "aur edit":**

Ask for new edit instructions. Loop back to step 1 of this file. No limit on edit rounds — iterate until user is satisfied.

**If user says "revert":**

Restore original `formatted_content` (from the `current_post` object, not the edited version). Show original preview again. Return to **C.2** decision prompt for this post — user can choose a different action.

---

## Error Handling

**If `sma-update-post` fails after edit approval:**
> "Edited content save nahi hua. Retry karta hoon..."

Retry once. If still fails:
> "Save fail ho raha hai. Content clipboard mein copy karo taaki kho na jaye. Satvik, n8n check karo."

Keep the edited content in working memory so it's not lost. Do NOT discard edits on webhook failure.

**If user's edit instruction would require major structural changes:**
> "Ye change minor edit se nahi hoga — poora structure change karna padega. Send back to B-ContentDrafting karein? (haan/nahi)"

If yes → apply "Send Back" flow from C.2 (Decision 5). If no → ask user to simplify their edit request.

**Guideline for minor vs major:**
- **Minor:** Typos, word swaps, line tweaks, emoji changes, hashtag changes, shortening/lengthening within limits
- **Major:** Changing the hook entirely, rewriting the narrative structure, changing the content format, changing the topic angle

---

## What NOT to Do

- Do NOT save edits without showing the user the updated preview first
- Do NOT apply edits that violate formatting rules without flagging it
- Do NOT lose the original `formatted_content` — always keep it available for revert
- Do NOT make additional "improvement" edits beyond what the user asked for
- Do NOT change `draft_content` — only `formatted_content` is edited here (draft is the pre-formatting version)
- Do NOT auto-approve after editing — user MUST explicitly confirm the edited version

---

## Output for Next Step

Return to **C.2** (next post) or **C.4** (all done):
```
edited_content         — the final approved edited content (saved to MongoDB)
edit_summary           — brief description of what was changed
edited_count           — incremented by 1
```
