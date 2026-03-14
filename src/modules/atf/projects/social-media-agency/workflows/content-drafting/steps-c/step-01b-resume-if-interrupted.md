# Step 01b: Resume If Interrupted

## DEPENDENCIES
- Requires: Previous session state (partial execution of B.1–B.4)

## PURPOSE
Recover workflow state after an interruption and resume from the last completed step.

## EXECUTION PROTOCOLS

1. [CHECK] Determine last completed step by checking available state:
   - `selected_post` populated? → B.1 completed
   - `frameworks` loaded and `user_selections` populated? → B.2–B.3 selection completed
   - `draft_content` exists? → B.3 draft generation completed
   - `iteration_count > 0`? → B.3 refinement in progress
   - MongoDB status is `Drafted`? → B.4 completed (workflow done)

2. [RECOVER] Based on last completed step:
   - If interrupted at B.1: Re-fetch available posts (idempotent read)
   - If interrupted at B.2: Re-load frameworks (local CSVs, idempotent)
   - If interrupted at B.3 (selection): Re-present curated options to user
   - If interrupted at B.3 (drafting): Present last draft version, ask user if they want to continue refining
   - If interrupted at B.4: Check MongoDB — if status is already `Drafted`, workflow is complete

3. [INFORM] Tell the user:
   > "Pichli session resume kar raha hoon — [step description]. Continue karte hain."

4. [PROCEED] Jump to the appropriate step file.

## RULES
- NEVER re-save a draft that was already finalized in MongoDB (check status)
- If draft content exists in memory, present it to user for confirmation before continuing
- If framework selections exist, don't force user to re-select — offer to keep or change
- If state is completely lost, restart from B.1 (post fetch is idempotent)
