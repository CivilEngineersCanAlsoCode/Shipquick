# Step E-01: Assess (content-ideation)

## PURPOSE
Evaluate a requested edit to the content ideation output before applying changes. Determine scope, impact, and whether the edit requires re-execution of upstream steps.

## EXECUTION PROTOCOLS

1. [IDENTIFY] Determine the edit type:
   - **Schedule change:** User wants to move a post to a different date
   - **Topic swap:** User wants to replace a selected topic with a different brief
   - **Score override:** User wants to adjust scoring weights or thresholds
   - **Add/remove post:** User wants to change the number of scheduled posts
   - **Experience update:** User wants to link a different experience to a post

2. [ASSESS] Evaluate impact:
   | Edit Type | Re-score? | Re-schedule? | Re-save? |
   |-----------|-----------|--------------|----------|
   | Schedule change | No | Yes (A.7) | Yes (A.8) |
   | Topic swap | Yes (A.6) | Yes (A.7) | Yes (A.8) |
   | Score override | Yes (A.6, all) | Maybe | Maybe |
   | Add post | Yes (A.6) | Yes (A.7) | Yes (A.8) |
   | Remove post | No | Yes (A.7) | Yes (A.8, undo) |
   | Experience update | No | No | Yes (A.8) |

3. [VALIDATE] Check feasibility:
   - Schedule change: Is the target date available (no existing post)?
   - Topic swap: Does the replacement brief pass gate checks?
   - Add post: Are there qualifying briefs left? Is `top_n` not exceeded?
   - Remove post: Will at least 1 post remain?

4. [REPORT] Present assessment to user:
   > "Edit: [description]. Impact: [re-score/re-schedule/re-save]. Proceed? (haan/nahi)"

5. [PROCEED] If approved → Step E-02 (Apply Edit)
