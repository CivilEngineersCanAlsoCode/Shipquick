# Step F.4 — User Approval

**Agent:** Content Strategist
**Trigger:** User made a decision in F.3 (approve, changes, or reject).

---

## What You Do

Execute the user's decision: save the approved post, loop back for changes, or revert on rejection. This is the final gate before the post advances to `Previewed` status.

---

## Input
- `formatted_content` — the formatted post text
- `selected_post` — original post object (post_id, title, etc.)
- `user_decision` — "approve", "changes", or "reject"

---

## Action: Handle User Decision

### Option 1: User Approves

**POST** `https://n8n.linkright.in/webhook/sma-update-post`

```json
{
  "post_id": "{selected_post.post_id}",
  "status": "Previewed",
  "formatted_content": "{formatted_content}",
  "formatted_at": "{current_timestamp}"
}
```

**On success:**
> "Done! '{title}' ka status ab `Previewed` hai. Formatted content save ho gaya. 🎉"
>
> "Aage C-Review workflow mein le jaayein? Wahan final review hoga publish se pehle."

**On failure:**
Retry once. If it fails again:
> "Save nahi ho paya — n8n mein `SMA/Data/Write/UpdatePost` check karo. Formatted content mere paas hai, manually save kar sakte ho."

Provide the formatted content so the user can manually save it if needed.

### Option 2: User Requests Changes

> "Theek hai, changes karta hoon."

Note the specific changes requested by the user. Loop back to **F.2** to apply ONLY those specific changes. Key points:
- Do NOT re-apply all 12 rules from scratch
- Only modify what the user asked for
- After changes, go to **F.3** to regenerate preview
- Track iteration count — if this is the 3rd+ loop:
  > "Yeh {N}th iteration hai. Agar major changes chahiye toh B-Drafting mein wapas jaana better hoga."

### Option 3: User Rejects

**POST** `https://n8n.linkright.in/webhook/sma-update-post`

```json
{
  "post_id": "{selected_post.post_id}",
  "status": "Drafted"
}
```

**On success:**
> "Post ka status wapas `Drafted` kar diya. Formatting workflow se exit kar rahe hain. Jab ready ho, wapas aana!"

**On failure:**
> "Status revert nahi ho paya. Satvik, manually post ID `{post_id}` ka status `Drafted` karo n8n se."

Exit the workflow regardless of revert success.

---

## Post-Approval Summary

After a successful approval, present a summary:

> **Formatting Complete**
> - Post: {title}
> - Status: Drafted —> Formatting —> Previewed
> - Characters: {count}
> - Emojis: {count}
> - Hindi sentences: {count}
> - Hashtags: {count}
> - Iterations: {count}
>
> Next: C-Review workflow (status must be `Previewed` to enter review)

---

## Error Handling

**Webhook failure (save):** Retry once. On second failure, provide formatted content to user for manual save. Do NOT lose the formatted content.

**Webhook failure (revert):** Warn user, provide post_id for manual fix. Exit anyway.

---

## What NOT to Do
- Do NOT auto-approve — user MUST explicitly say "approve" or equivalent
- Do NOT lose formatted content if the save webhook fails — always provide it to the user
- Do NOT allow more than 5 change iterations without suggesting a return to B-Drafting
- Do NOT skip the status update (Previewed or revert to Drafted)
- Do NOT proceed to C-Review automatically — only suggest it

---

## Output (End of Workflow)

If approved:
```
Post status: Previewed
Formatted content: saved to MongoDB
Next workflow: C-Review
```

If rejected:
```
Post status: Drafted (reverted)
Formatted content: discarded
Workflow: exited
```
