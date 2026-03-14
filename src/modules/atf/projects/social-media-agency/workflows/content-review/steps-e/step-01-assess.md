# Step E-01: Assess (content-review)

## PURPOSE
Evaluate a requested edit to a post during the review process. Determine if the edit can be applied inline or requires sending the post back to an earlier workflow.

## EXECUTION PROTOCOLS

1. [IDENTIFY] Determine the edit type:
   - **Minor content edit:** Fix typo, adjust wording, tweak CTA (can be done inline)
   - **Formatting fix:** Adjust line breaks, emoji placement, capitalization (inline or send back to F)
   - **Major rewrite:** Fundamentally change the content angle or structure (send back to B)
   - **Reschedule:** Change the go-live date
   - **Drop:** Remove the post entirely

2. [ASSESS] Evaluate impact:
   | Edit Type | Handle In Review? | Send Back To? | Re-save? |
   |-----------|-------------------|---------------|----------|
   | Minor content edit | Yes (inline) | — | Yes |
   | Formatting fix (small) | Yes (inline) | — | Yes |
   | Formatting fix (major) | No | F-ContentFormatting | Yes (status → Drafted) |
   | Major rewrite | No | B-ContentDrafting | Yes (status → Scheduled_NoDraft) |
   | Reschedule | Yes (inline) | — | Yes |
   | Drop | Yes (inline) | — | Yes (status → Cancelled) |

3. [VALIDATE] Check feasibility:
   - Minor edit: Will the result still be 800–1600 chars?
   - Reschedule: Is the new date available (no conflicts)?
   - Drop: Confirm user intent (this is the last checkpoint before publishing)

4. [REPORT] Present assessment to user:
   - For inline edits: "Ye change yahan apply kar deta hoon. Proceed? (haan/nahi)"
   - For send-back: "Ye major change hai — isko [B/F] workflow mein wapas bhejna padega. Confirm? (haan/nahi)"

5. [PROCEED] If approved → Step E-02 (Apply Edit)
