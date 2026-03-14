# Step 01b: Resume If Interrupted

## DEPENDENCIES
- Requires: Previous session state (partial execution of A.1–A.8)

## PURPOSE
Recover workflow state after an interruption (context loss, timeout, user disconnect) and resume from the last completed step.

## EXECUTION PROTOCOLS

1. [CHECK] Determine last completed step by checking available state:
   - `briefs[]` populated? → A.1 completed
   - `past_posts[]` populated? → A.2 completed
   - `briefs_with_experiences[]` populated? → A.3 completed
   - `scoring_config` loaded? → A.4 completed
   - `scored_briefs[]` computed? → A.6 in progress or completed
   - `selected_briefs[]` confirmed? → A.6 completed
   - `scheduled_posts[]` with dates? → A.7 completed
   - MongoDB IDs present? → A.8 partially completed

2. [RECOVER] Based on last completed step:
   - If interrupted at A.1–A.3: Re-fetch data (webhooks are idempotent reads)
   - If interrupted at A.4–A.5: Re-fetch config (idempotent)
   - If interrupted at A.6: Re-score from cached data, re-present to user
   - If interrupted at A.7: Re-present schedule for confirmation
   - If interrupted at A.8: Check which posts were already saved (query MongoDB via `sma-fetch-post`), save remaining

3. [INFORM] Tell the user:
   > "Pichli session resume kar raha hoon — last step [step_name] tha. Wahan se continue karte hain."

4. [PROCEED] Jump to the appropriate step file.

## RULES
- NEVER re-save a post that was already saved to MongoDB (check for existing `_id`)
- NEVER re-discard briefs that were already marked in the Sheet
- If state is completely lost, restart from A.1 (data fetches are idempotent)
