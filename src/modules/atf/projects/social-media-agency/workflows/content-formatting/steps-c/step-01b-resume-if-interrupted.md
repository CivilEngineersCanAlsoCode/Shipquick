# Step 01b — Resume If Interrupted

**Agent:** Content Strategist
**Trigger:** Step 01 detected a post with status `Formatting` (indicating an interrupted session).

---

## What You Do

A previous formatting session was interrupted. The agent must recover gracefully and let the user decide how to proceed.

---

## Actions

### 1. Present the Interrupted Post
Show the user the post that was found with `Formatting` status:
- Title
- Topic/brief summary
- Date it was scheduled for
- Whether any formatted content was partially saved

Tell the user:
> "Ek post mila jo pehle se formatting mein tha — lagta hai last session beech mein ruk gaya tha."

Then present the post details.

### 2. Ask User How to Proceed

Offer three options:
1. **Resume formatting this post** — Continue from where it was left off. If partially formatted content exists, show it. If not, start formatting from the raw draft.
2. **Abandon and pick a different post** — Revert this post's status back to `Drafted` and proceed to F.1 to pick a new post.
3. **Abandon and exit** — Revert status to `Drafted` and exit the workflow entirely.

### 3. Execute the User's Choice

**Option 1 — Resume:**
If partial formatted content exists in the post record, load it and proceed to **F.3** (Generate Preview) to show the user what was done so far.
If no formatted content exists, proceed to **F.2** (Apply Formatting) with the raw draft.

**Option 2 — Abandon + Pick New:**
POST to `https://n8n.linkright.in/webhook/sma-update-post`:
```json
{
  "post_id": "{post_id}",
  "status": "Drafted"
}
```
Then proceed to **F.1** (Pick Drafted Post).

**Option 3 — Abandon + Exit:**
Same revert call as Option 2, then exit the workflow.

---

## Error Handling

**If the revert webhook fails:**
> "Status revert nahi ho paya. Satvik, manually `sma-update-post` check karo for post ID: {post_id}."

Still proceed with the user's choice (the post may need manual status correction later).

---

## What NOT to Do
- Do NOT auto-resume without asking the user
- Do NOT leave the post stuck in `Formatting` status if user wants to abandon
- Do NOT discard any partially formatted content without user consent
