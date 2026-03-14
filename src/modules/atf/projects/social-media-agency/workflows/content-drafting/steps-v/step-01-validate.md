# Step V-01: Validate (content-drafting)

## EXECUTION PROTOCOLS

1. [READ] Load all workflow artifacts:
   - `selected_post` — the post that was drafted
   - `draft_content` — final approved text
   - `user_selections` — framework items chosen
   - `iteration_count` — number of refinement rounds

2. [VERIFY] Run checklist against output:

   ### Draft Content Quality
   - [ ] Character count: 800–1600 ASCII characters
   - [ ] Hook present in first 2 lines
   - [ ] CTA or engagement question at end
   - [ ] 3–6 hashtags included
   - [ ] Max 3 emojis (at tension points only)
   - [ ] No bold/italic/underline formatting
   - [ ] FK Grade ≤ 7 readability

   ### Framework Compliance
   - [ ] Content format selection from `content-formats.csv`
   - [ ] Hook framework selection from `hook-frameworks.csv`
   - [ ] Narrative framework selection from `narrative-frameworks.csv`
   - [ ] CTA framework selection from `cta-frameworks.csv`
   - [ ] Tone framework selection from `tone-frameworks.csv`
   - [ ] All selections are real CSV entries (not invented)

   ### Data Integrity
   - [ ] MongoDB post status updated to `Drafted`
   - [ ] `draft_content` field populated in MongoDB
   - [ ] `frameworks_used` field documents selections
   - [ ] `draft_iterations` count recorded
   - [ ] Post `_id` unchanged from original scheduled post

   ### User Approval
   - [ ] User explicitly approved final version
   - [ ] Max 3 iterations respected (or user asked to finalize)

3. [REPORT] Generate validation summary:
   ```
   VALIDATION: content-drafting
   Post: {topic}
   Draft Length: {char_count} chars
   Iterations: {iteration_count}
   Content Quality: PASS/FAIL
   Framework Compliance: PASS/FAIL
   Data Integrity: PASS/FAIL
   User Approval: PASS/FAIL
   Overall: PASS/FAIL
   ```
