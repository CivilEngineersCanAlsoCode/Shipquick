# Step 01b: Resume If Interrupted

## DEPENDENCIES
- Requires: Previous session state (partial execution of C.1–C.2)

## PURPOSE
Recover workflow state after an interruption and resume from the last reviewed post.

## EXECUTION PROTOCOLS

1. [CHECK] Determine last completed step by checking available state:
   - `posts_to_review[]` populated? → C.1 completed
   - `decisions{}` has entries? → C.2 partially completed
   - All posts have decisions? → C.2 completed (workflow done)

2. [RECOVER] Based on last completed step:
   - If interrupted at C.1: Re-fetch posts (idempotent read). Some posts may have already been updated — their status will have changed from `Previewed`, so they won't appear in the re-fetch. This is correct behavior.
   - If interrupted at C.2: Re-fetch remaining `Previewed` posts. Previously decided posts will already have their new status (Ready_ToPublish, Cancelled, etc.) and won't appear. Resume reviewing from the first remaining `Previewed` post.

3. [INFORM] Tell the user:
   > "Pichli session resume kar raha hoon — {decided_count} posts already reviewed, {remaining_count} baaki hain."

4. [PROCEED] Jump to C.2 with remaining posts.

## RULES
- NEVER re-review a post that already has status `Ready_ToPublish` or `Cancelled`
- The re-fetch naturally filters out already-decided posts (they're no longer `Previewed`)
- If no `Previewed` posts remain, workflow is complete — show summary of what was decided
- If state is completely lost, restart from C.1 (fetch is idempotent, already-decided posts excluded)
