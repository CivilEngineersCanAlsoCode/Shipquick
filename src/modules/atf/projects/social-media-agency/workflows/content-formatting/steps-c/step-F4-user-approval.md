# Step F.4 — User Approval

**Agent:** Pixel (flex-crafter)
**Trigger:** User made a decision in F.3 — approve, request changes, or reject.

---

## What You Do

Execute the user's decision. This is the final gate of the F-ContentFormatting workflow. On approval, save the formatted content and advance the post to `Previewed` status. On changes, loop back to F.2 for targeted edits. On rejection, revert the post to `Drafted` and exit.

---

## Input

- `formatted_content` — the formatted post text (all 16 rules applied, all stats passing)
- `selected_post` — original post object (post_id, title, topic, scheduled_date, etc.)
- `formatting_stats` — all 16 metrics with PASS/FAIL status
- `user_decision` — `"approve"` | `"changes"` | `"reject"`
- `change_requests` — (if changes) specific feedback text from user

---

## Option 1: User Approves

### Action: Save Formatted Post and Update Status

**POST** `https://n8n.linkright.in/webhook/sma-update-post`

### Request Payload
```json
{
  "post_id": "67a1b2c3d4e5f6...",
  "status": "Previewed",
  "formatted_content": "I shipped 3 features last year.\nAll three flopped.\n\nNot a single user asked for them.\n...",
  "formatting_stats": {
    "character_count": 1247,
    "emoji_count": 2,
    "hindi_sentence_count": 1,
    "hashtag_count": 4,
    "uppercase_header_count": 2,
    "max_block_lines": 3,
    "approx_fk_grade": 5.8,
    "has_positioning": true,
    "has_follow_line": true,
    "has_rich_text": false,
    "iteration_count": 1
  },
  "formatted_at": "2026-03-14T14:30:00Z"
}
```

### Expected Response
```json
{
  "success": true,
  "post_id": "67a1b2c3d4e5f6...",
  "status": "Previewed"
}
```

### On Success

Confirm to user:
> "Done! '{title}' ka status ab `Previewed` hai. Formatted content save ho gaya. 🎉"

Then show the **Post-Approval Summary** (see below).

Then suggest next workflow:
> "Aage C-Review workflow mein le jaayein? Wahan final review hoga publish se pehle."
>
> "Bol do 'Review karo' jab ready ho."

### On Failure

Retry once after 5 seconds. If it fails again:
> "Save nahi ho paya — n8n mein `SMA/Data/Write/UpdatePost` check karo. Formatted content mere paas hai, neeche copy kar lo manually save karne ke liye:"

Then display the formatted content in a code block so the user has a backup:

````
```
{formatted_content}
```
````

> "Post ID: `{post_id}` — isko manually `Previewed` status karo n8n se."

Do NOT lose the formatted content under any circumstances.

---

## Option 2: User Requests Changes

### Action: Loop Back to F.2

> "Theek hai, changes karta hoon."

1. Note the specific changes the user requested (store as `change_requests`)
2. Increment the iteration counter
3. Loop back to **F.2** with these constraints:
   - Apply ONLY the specific changes the user asked for
   - Do NOT re-apply all 16 rules from scratch
   - Do NOT change anything the user didn't mention
   - Preserve everything the user was happy with
4. After F.2 applies changes, return to **F.3** to regenerate the preview

### Iteration Limits

Track the total number of formatting iterations (initial + change loops):

| Iteration | Behavior |
|-----------|----------|
| 1 | Initial full formatting (all 16 rules) |
| 2 | Targeted changes — normal |
| 3 | Targeted changes — mention: "Yeh 3rd iteration hai." |
| 4 | Suggest: "Major changes chahiye toh B-Drafting mein wapas jaana better hoga." |
| 5+ | Strongly recommend: "5 iterations ho gaye — is post ko B-Drafting mein rework karo. Formatting se content fix nahi hoga." |

### Change Request Examples

Common change types and how to handle them:

| User Says | Action |
|-----------|--------|
| "Hook aur strong karo" | Rewrite hook line only — keep rest identical |
| "Emoji hata do" | Remove emojis — recount stats |
| "Hindi add karo somewhere" | Add 1 Hindi sentence at best emotional peak |
| "Too long, trim karo" | Cut weakest body block — recount characters |
| "CTA change karo" | Rewrite CTA + positioning — keep body identical |
| "Hashtags change karo" | Replace hashtags only |
| "Tone thoda casual karo" | Adjust word choices in body — preserve structure |

---

## Option 3: User Rejects

### Action: Revert Status to Drafted

**POST** `https://n8n.linkright.in/webhook/sma-update-post`

### Request Payload
```json
{
  "post_id": "67a1b2c3d4e5f6...",
  "status": "Drafted"
}
```

### Expected Response
```json
{
  "success": true,
  "post_id": "67a1b2c3d4e5f6...",
  "status": "Drafted"
}
```

### On Success
> "Post ka status wapas `Drafted` kar diya. Formatting workflow se exit kar rahe hain."
>
> "Options:"
> - "B-Drafting mein wapas jaake draft rework karo, phir fresh format karunga"
> - "Baad mein 'Format karo' bol ke wapas aa sakte ho"

### On Failure
> "Status revert nahi ho paya. Satvik, manually post ID `{post_id}` ka status `Drafted` karo n8n se."
>
> "n8n workflow: `SMA/Data/Write/UpdatePost`"

Exit the workflow regardless of whether the revert succeeded. The formatted content is discarded.

---

## Post-Approval Summary

After a successful approval, present this summary:

> **Formatting Complete ✅**
>
> | Field | Value |
> |-------|-------|
> | Post | {title} |
> | Topic | {topic} |
> | Scheduled | {scheduled_date} |
> | Status Flow | `Drafted` —> `Formatting` —> `Previewed` |
> | Characters | {count} / 1600 |
> | Emojis | {count} / 3 |
> | Hindi sentences | {count} / 3 |
> | Hashtags | {count} |
> | FK Grade | ~{grade} / 7 |
> | UPPERCASE headers | {count} |
> | Formatting iterations | {count} |
>
> **Next:** C-Review workflow (post must be `Previewed` to enter review)

---

## Webhook Reference

| Webhook | URL | Used For |
|---------|-----|----------|
| sma-update-post | `https://n8n.linkright.in/webhook/sma-update-post` | Save formatted content + status `Previewed` (approve) |
| sma-update-post | `https://n8n.linkright.in/webhook/sma-update-post` | Revert status to `Drafted` (reject) |
| n8n Workflow Name | `SMA/Data/Write/UpdatePost` | For troubleshooting |

---

## Error Handling

**Webhook failure (save on approval):**
1. Retry once after 5 seconds
2. If still fails, show formatted content in code block for manual backup
3. Provide post_id for manual status update
4. Do NOT lose the formatted content under any circumstances

**Webhook failure (revert on rejection):**
1. Retry once after 5 seconds
2. If still fails, warn user with post_id for manual fix
3. Exit the workflow anyway — do not block on a failed revert

**User gives ambiguous response (not clearly approve/changes/reject):**
> "Clearly batao — approve karna hai, changes chahiye, ya reject? Ek word mein:"
>
> - **Approve:** "haan", "approve", "sahi hai", "done", "theek hai"
> - **Changes:** "change karo", "edit karo", "fix karo", plus what to change
> - **Reject:** "nahi", "reject", "wapas bhejo", "cancel"

Re-prompt until the user gives a clear signal. Do NOT guess.

---

## What NOT to Do

- ❌ Do NOT auto-approve — user MUST explicitly approve
- ❌ Do NOT lose formatted content if the save webhook fails — ALWAYS provide backup
- ❌ Do NOT allow more than 5 change iterations without strongly recommending B-Drafting rework
- ❌ Do NOT skip the status update (either `Previewed` or revert to `Drafted`)
- ❌ Do NOT proceed to C-Review automatically — only SUGGEST it
- ❌ Do NOT re-apply all 16 formatting rules on a change request — only modify what the user asked
- ❌ Do NOT discard the formatted content on webhook failure
- ❌ Do NOT interpret silence as approval — always wait for explicit user input
- ❌ Do NOT save a post that has any failing formatting metrics (all must be ✅)

---

## Success Criteria

### If Approved:
- [ ] All 16 formatting metrics passed (verified in F.3)
- [ ] `sma-update-post` called with status `Previewed` + `formatted_content` + `formatting_stats`
- [ ] Webhook returned success
- [ ] Post-approval summary shown to user
- [ ] C-Review workflow suggested as next step
- [ ] User explicitly approved (not assumed)

### If Changes Requested:
- [ ] Specific change requests captured
- [ ] Iteration counter incremented
- [ ] Looped back to F.2 for targeted edits only
- [ ] Did not re-apply all 16 rules from scratch
- [ ] Iteration limit warning shown at 4+ iterations

### If Rejected:
- [ ] `sma-update-post` called with status `Drafted` (revert)
- [ ] Workflow exited cleanly
- [ ] User informed of next steps (rework in B-Drafting or retry later)
- [ ] Formatted content discarded (not saved)

---

## Output (End of Workflow)

**If approved:**
```
Post status: Previewed (saved to MongoDB)
Formatted content: saved to post record
Formatting stats: saved to post record
Next workflow: C-Review (user must manually initiate)
```

**If changes requested:**
```
Loop: F.4 → F.2 (targeted changes) → F.3 (new preview) → F.4 (re-ask)
Iteration count: incremented
```

**If rejected:**
```
Post status: Drafted (reverted in MongoDB)
Formatted content: discarded
Workflow: exited
```
