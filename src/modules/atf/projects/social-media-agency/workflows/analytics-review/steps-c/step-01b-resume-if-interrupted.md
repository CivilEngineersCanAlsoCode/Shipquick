# Step 01b: Resume If Interrupted

## Purpose
Recover an analytics review session that was interrupted mid-flow.

## What to Do

1. **Check for In-Progress Session:**
   - Look for existing session state from a previous run
   - Check if `period_start`, `period_end`, and `period_label` are already set
   - Check which step was last completed

2. **Determine Resume Point:**
   - If session context was loaded but metrics not fetched -> resume at E.1
   - If metrics were fetched but scores not calculated -> resume at scoring phase
   - If scores calculated but discussion not started -> resume at E.2 (Discuss)
   - If discussion started but insights not saved -> resume at strategy adjustment phase
   - If everything complete -> inform user and offer to start a new review

3. **Restore State:**
   - Reload any cached metrics and scores from the interrupted session
   - Restore the review period settings
   - Restore any partial insights or notes already captured

4. **Confirm with User:**
   - Present a summary of where the previous session left off
   - Ask: "Continue from where we stopped, or start fresh?"
   - If start fresh: clear session state and go to `step-01-load-session-context.md`
   - If continue: proceed to the identified resume step

## Output
- Session state restored or cleared based on user choice
- Next step identified and ready to proceed

## Next Step
-> Resume step as determined above, or `step-01-load-session-context.md` if starting fresh
