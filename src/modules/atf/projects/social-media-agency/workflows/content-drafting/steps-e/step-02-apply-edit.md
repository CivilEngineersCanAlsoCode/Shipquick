# Step E-02: Apply Edit (content-drafting)

## PURPOSE
Execute the assessed edit from E-01. Update the draft and save to MongoDB.

## EXECUTION PROTOCOLS

1. [LOAD] Retrieve assessment from E-01:
   - Edit type, regeneration scope, affected framework selections

2. [EXECUTE] Apply the edit based on type:

   ### Content Tweak
   - Apply the requested change directly to `draft_content`
   - Highlight what changed for user review
   - Verify char count still 800–1600

   ### Hook Change
   - Present top 3–5 alternative hooks from `hook-frameworks.csv`
   - User picks replacement
   - Regenerate opening 2 lines using new hook framework
   - Preserve rest of draft

   ### CTA Change
   - Present top 3–5 alternative CTAs from `cta-frameworks.csv`
   - User picks replacement
   - Regenerate closing section using new CTA framework
   - Preserve rest of draft

   ### Framework Swap
   - Re-present curated options for affected framework categories
   - User selects replacements
   - Regenerate full draft with updated framework combination
   - Present as new draft for review

   ### Topic Pivot
   - Confirm new angle with user
   - Re-present all framework categories for selection
   - Generate fresh draft from scratch
   - Reset iteration count

   ### Experience Addition
   - Fetch experience details via `sma-search-experiences` if needed
   - Weave experience into appropriate section of draft
   - Preserve overall structure and frameworks

3. [INCREMENT] Update `iteration_count += 1`

4. [SAVE] POST to `sma-update-post` with:
   - Updated `draft_content`
   - Updated `frameworks_used` (if changed)
   - Updated `draft_iterations`

5. [REPORT] Present updated draft to user:
   > "Updated draft (iteration {N}):"
   > ```
   > {updated_draft}
   > ```
   > "Approve karna hai ya aur changes? (done/aur changes)"
