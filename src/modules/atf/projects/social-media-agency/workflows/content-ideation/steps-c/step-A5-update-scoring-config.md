# Step A.5 — Update Scoring Config (Optional)

**Agent:** Content Strategist  
**Runs After:** A.4 (only if user said "nahi" to defaults)  
**This step is SKIPPED if user accepted defaults in A.4**

---

## What You Do

Walk the user through changing scoring config values. Validate each input strictly. Save the new config to MongoDB. Then proceed to scoring.

---

## User Interaction

Present the options:
> "Kya change karna hai? Ek ya zyada choose karo:
> 1. Weights (Fibonacci numbers only: 1, 2, 3, 5, 8, 13, 21)
> 2. Individual minimum thresholds (0–10 per factor)
> 3. Total minimum percentage (20%–80%)
> 4. Scoring scale rules
> 5. Top N count (how many posts to select)
> 6. Lookback days (how many days to check for freshness)"

Collect changes one by one. After each input, validate immediately.

---

## Validation Rules

**Weights:**
- Must be valid Fibonacci numbers: 1, 2, 3, 5, 8, 13, 21
- All three weights must be different (no duplicates)
- ❌ If invalid: "Ye Fibonacci number nahi hai. Valid values: 1, 2, 3, 5, 8, 13, 21"

**Individual minimums:**
- Must be between 0 and 10 (inclusive)
- ❌ If out of range: "Value 0-10 ke beech honi chahiye."

**Total minimum percentage:**
- Must be between 20 and 80 (inclusive)
- ❌ If out of range: "Percentage 20% se 80% ke beech rakho — bahut strict ya bahut lenient mat karo."

**Top N count:**
- Must be between 1 and 10
- ❌ If out of range: "Top N 1 se 10 ke beech hona chahiye."

**Lookback days:**
- Must be between 7 and 90
- ❌ If out of range: "Lookback 7 se 90 days ke beech rakho."

**Scoring scale rules:**
- Walk the user through each scale (freshness, personal_experience, research_quality)
- Only allow changes to threshold values and score values
- Do NOT allow adding or removing rule types

---

## Confirm Before Saving

Show a summary of all proposed changes:
> "📝 **Changes summary:**
> [list each changed field and old → new value]
> 
> Save karna hai? (haan/nahi)"

If "nahi" → let user revise or cancel. If cancelled, proceed with the old config from A.4.

---

## Action: Call n8n Webhook

After user confirms, save only the `scoring_weights` document (scales are saved separately if changed):

**POST** `https://n8n.linkright.in/webhook/sma-save-config`

```json
{
  "doc_id": "scoring_weights",
  "data": {
    "weights": { "freshness": 8, "personal_experience": 5, "research_quality": 3 },
    "thresholds": {
      "individual_minimum": { "freshness": 5, "personal_experience": 3, "research_quality": 2 },
      "total_minimum_percent": 50
    },
    "max_score_per_factor": 10,
    "top_n": 3,
    "lookback_days": 14
  },
  "updated_by": "user"
}
```

If scoring scales were also changed, make a second call with `"doc_id": "scoring_scales"` and the updated scales data.

**Expected Response:**
```json
{ "success": true, "version": 2 }
```

> Update `scoring_config` in working memory with the new saved values. The version number in memory should reflect what was saved.

Tell the user:
> "✅ Config save ho gayi (v[version]). Chalo ab scoring karte hain!"

---

## Error Handling

**If the webhook call fails:**
> "Config save nahi ho payi."

Retry once after 5 seconds. If it fails again:
> "`SMA/Data/Write/SaveConfig` webhook down lag raha hai."

If save fails, ask the user:
> "Save failed — purani config se proceed karein? (haan/nahi)"
- "Haan" → proceed to A.6 with the old config from A.4
- "Nahi" → wait, let user fix the issue and retry

---

## What NOT to Do

- ❌ Do NOT save config without user confirmation
- ❌ Do NOT accept non-Fibonacci weights silently — always validate before saving
- ❌ Do NOT allow total_minimum_percent > 80 — it would eliminate everything
- ❌ Do NOT allow total_minimum_percent < 20 — it would select garbage content
- ❌ Do NOT change scoring logic itself — only change the config values
- ❌ Do NOT run this step if user accepted defaults in A.4

---

## Output for Next Step

Pass to **A.6**:
```
briefs[]                  — from A.1
past_posts[]              — from A.2
briefs_with_experiences[] — from A.3
scoring_config            — UPDATED config (from this step, or original from A.4 if save failed)
```
