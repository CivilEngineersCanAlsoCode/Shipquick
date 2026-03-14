# Step A.6 — Score & Select

**Agent:** Content Strategist  
**Runs After:** A.4 (defaults accepted) or A.5 (config updated)

---

## What You Do

You compute scores for each brief locally (no webhook for scoring itself), discard the ones that don't pass, present the qualifying ones to the user, handle user decisions, and manage the selection loop. This is the most complex step — read carefully.

---

## PART 1: Compute Scores (you do this, no webhook)

For each brief in `briefs_with_experiences[]`:

### Freshness Score (F)
Compare the brief's `topic` against `past_posts[]` titles. Use the `lookback_days` from scoring config.

Apply `scoring_scales.freshness_scale.rules` in order:
- No title match found within lookback period → **F = 10**
- Match found but older than 10 days → **F = 7**
- Match found but older than 5 days → **F = 4**
- Match found but older than 3 days → **F = 1**
- Exact match in last 3 days → **F = 0**

### Personal Experience Score (P)
Use `similarity_score` from `experience_preview` (fetched in A.3).

Apply `scoring_scales.personal_experience_scale.rules`:
- similarity ≥ 0.9 → **P = 10**
- similarity ≥ 0.7 → **P = 7**
- similarity ≥ 0.5 → **P = 4**
- similarity ≥ 0.3 → **P = 1**
- no match (null experience) or similarity < 0.3 → **P = 0**

### Research Quality Score (R)
Use the brief's boolean fields: `has_stats`, `has_quotes`, `has_trend`, `has_data`.

Apply `scoring_scales.research_quality_scale.rules`:
- All 4 fields true → **R = 10**
- Any 3 fields true → **R = 7**
- Any 2 fields true → **R = 4**
- Any 1 field true → **R = 1**
- All false → **R = 0**

### Gate Checks (apply in this order — fail fast)
```
weights = scoring_config.scoring_weights.weights
thresholds = scoring_config.scoring_weights.thresholds

1. F < thresholds.individual_minimum.freshness      → DISCARD
2. P < thresholds.individual_minimum.personal_experience → DISCARD
3. R < thresholds.individual_minimum.research_quality   → DISCARD
4. Total = (F × weights.freshness) + (P × weights.personal_experience) + (R × weights.research_quality)
   MaxPossible = 10 × (weights.freshness + weights.personal_experience + weights.research_quality)
   MinRequired = MaxPossible × (thresholds.total_minimum_percent / 100)
   Total < MinRequired → DISCARD
```

Record discard reason for each discarded brief (e.g., "F=4 < min 5" or "Total=72 < min 80").

Sort qualifying briefs by `Total` descending. Take top `top_n`.

---

## PART 2: Mark Discarded in Google Sheet (A.6.a)

**POST** `https://n8n.linkright.in/webhook/sma-update-sheet-status`

```json
{
  "action": "update_status",
  "rows": [
    {
      "row_id": "brief_row_id",
      "status": "Discarded",
      "reason": "F=4 < min 5",
      "scores": { "freshness": 4, "personal_experience": 7, "research_quality": 3, "total": 0 }
    }
  ]
}
```

Do this for ALL discarded briefs in one call. Do NOT loop per brief.

**Expected Response:** `{ "success": true, "updated": N }`

If this call fails, log the failure but do NOT block — the scoring display to user still proceeds. You can retry marking discarded later.

---

## PART 3: Present Qualifying Ideas to User (A.6.b)

If 0 briefs qualify → skip to **PART 6: Fetch More** directly.

Otherwise, show each qualifying brief clearly:

> "📊 **[N] qualifying ideas mile:**
> 
> **#1 — [topic]** (Score: [total]/[max])
> F=[F]×8=[F×8] | P=[P]×5=[P×5] | R=[R]×3=[R×3]
> 💡 Experience: "[first 100 chars of experience text]..." ([similarity_score] match)
> 
> **#2 — [topic]** (Score: [total]/[max])
> ...
> 
> **#3 — [topic]** (Score: [total]/[max])
> ..."

Then ask:
> "Koi experience/context share karna chahte ho inke liye? (haan/nahi)"

---

## PART 4: Save User-Shared Experiences (A.6.b, optional)

If user shares a personal story or context:

**POST** `https://n8n.linkright.in/webhook/sma-save-experience`

```json
{
  "date": "[today's date in YYYY-MM-DD]",
  "text": "[full story text as shared by user]",
  "tags": ["topic keyword", "another tag"],
  "source": "user_shared_during_ideation",
  "generate_embedding": true
}
```

**Expected Response:** `{ "success": true, "_id": "ObjectId" }`

Store the returned `_id` as a `linked_experience_id` for the relevant brief.

Tell the user:
> "✅ Story save ho gayi! Isse draft mein bhi use karenge."

If this call fails:
> "Story save nahi ho payi, but scoring aur scheduling continue karunga. Baad mein manually add kar sakte ho."

Do NOT block on this failure.

---

## PART 5: User Decision Loop (A.6.c)

Ask:
> "Proceed karna hai in [X] posts ke saath? (haan / ye hata do [number] / aur ideas chahiye)"

**"Haan" or "proceed" (X ≥ 1):**
Mark selected briefs in the sheet:

**POST** `https://n8n.linkright.in/webhook/sma-update-sheet-status`

```json
{
  "action": "mark_selected",
  "rows": [
    { "row_id": "brief_row_id", "status": "Selected" }
  ]
}
```

If this call fails, warn the user but continue to A.7:
> "Sheet update nahi ho payi, lekin scheduling continue karte hain. Sheet baad mein manually update karna."

→ Proceed to **A.7**

**"Ye hata do [number or topic]":**
Remove that brief from the qualifying list.
- If remaining ≥ 1 → re-show updated list, re-ask
- If remaining = 0 → go to **PART 6: Fetch More**

**"Aur ideas chahiye":**
→ Go to **PART 6: Fetch More**

---

## PART 6: Fetch More Briefs Loop (A.6.d, A.6.e, A.6.f)

Tell the user:
> "Google Sheet mein naye briefs add karo, phir 'done' bolo!"

Wait for user to confirm "done" / "ho gaya" / "add kar diya".

Then make 3 webhook calls:

**Call 1 — Re-fetch briefs:**
**POST** `https://n8n.linkright.in/webhook/sma-fetch-briefs`
`{ "status": "New" }`

**Call 2 — Re-fetch past posts (optional, use cached if recent):**
**POST** `https://n8n.linkright.in/webhook/sma-fetch-past-posts`
`{ "days": 14, "channel": "linkedin" }`

**Call 3 — Search experiences for new briefs:**
**POST** `https://n8n.linkright.in/webhook/sma-search-experiences`
`{ "queries": ["new topic 1", "new topic 2"], "limit": 1, "min_similarity": 0.3 }`

After all 3 calls succeed, re-score the new briefs, merge with any already-confirmed qualifying briefs. Ensure total displayed never exceeds `top_n` (3 by default). Go back to **PART 3** to re-present.

**Maximum total posts selected must not exceed top_n (default: 3).**

---

## Error Handling Summary

| Webhook | On Failure |
|---------|-----------|
| sma-update-sheet-status (discarded) | Log, continue — non-blocking |
| sma-save-experience | Log, continue — non-blocking |
| sma-update-sheet-status (selected) | Warn user, continue to A.7 |
| sma-fetch-briefs (loop) | Retry once, then ask user to check n8n |
| sma-search-experiences (loop) | Proceed with P=0 for new briefs |

---

## What NOT to Do

- ❌ Do NOT show discarded briefs to the user — they failed the gate, show only qualifying ones
- ❌ Do NOT let the user select more than `top_n` posts total
- ❌ Do NOT re-fetch past posts in every loop iteration if it was fetched recently (< 30 mins) — use cached
- ❌ Do NOT block the workflow on UpdateSheetStatus failures
- ❌ Do NOT ask user to "rate" or "manually score" briefs — scoring is computed, not subjective here
- ❌ Do NOT combine the discard call and the select call into one UpdateSheetStatus call

---

## Output for Next Step

Pass to **A.7**:
```
selected_briefs[]  — array of confirmed qualifying briefs with their full scores + linked_experience_ids
                    each item: { row_id, topic, research_data, content_pillar_hint, scores: { freshness, personal_experience, research_quality, total }, linked_experiences: [_id] }
scoring_config     — from A.4/A.5 (unchanged)
```
