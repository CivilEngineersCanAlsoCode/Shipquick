# Content Drafting — Quality Checklist

## Pre-Execution Checks (5)

- [ ] At least 1 post exists with status `Scheduled_NoDraft` in MongoDB
- [ ] Framework CSVs are accessible (content-methods, content-formats, hook, narrative, CTA, tone, positioning)
- [ ] n8n webhooks active (FetchPost, FetchBriefs, FetchPastPosts, SearchExperiences, SaveExperience, UpdatePost, UpdateSheetStatus)
- [ ] Vector index operational for experience search
- [ ] User is available for interactive framework selection and draft review

## Framework Selection (4)

- [ ] AI curated top 3–5 options per framework category (not random, relevant to topic)
- [ ] User explicitly selected 1 item per category (format, hook, narrative, CTA, tone, positioning)
- [ ] All selected frameworks exist in the actual CSV files (not invented)
- [ ] Framework selections recorded for the post record

## Draft Quality (7)

- [ ] Draft length: 800–1600 ASCII characters
- [ ] Strong hook in first 2 lines (grabs attention)
- [ ] Body delivers value/story/insight (not filler)
- [ ] CTA or engagement question at the end
- [ ] 3–6 relevant hashtags included
- [ ] No bold/italic/underline — UPPERCASE headers only if needed
- [ ] Max 3 emojis, placed at tension points only

## Post-Execution Checks (5)

- [ ] MongoDB post status updated to `Drafted`
- [ ] `draft_content` field contains the final approved text
- [ ] `frameworks_used` field documents selected framework items
- [ ] `draft_iterations` count recorded
- [ ] User explicitly approved the final version ("good" / "done" / "perfect")

## Tone & Voice (3)

- [ ] Casual + witty, authentic — not corporate or generic
- [ ] User's voice preserved through iterations (not over-polished)
- [ ] FK Grade 7 readability (simple, clear language)
