# Step A.4 — Load Scoring Config

**Agent:** Content Strategist  
**Runs After:** A.3 (experiences preview fetched)

---

## What You Do

Fetch the current scoring configuration from MongoDB. Then present a summary to the user and ask if they want to proceed with defaults or customize the scoring.

---

## Action: Call n8n Webhook

**POST** `https://n8n.linkright.in/webhook/sma-fetch-config`

```json
{
  "doc_ids": ["scoring_weights", "scoring_scales"]
}
```

**Expected Response:**
```json
{
  "scoring_weights": {
    "_id": "scoring_weights",
    "version": 1,
    "weights": {
      "freshness": 8,
      "personal_experience": 5,
      "research_quality": 3
    },
    "thresholds": {
      "individual_minimum": {
        "freshness": 5,
        "personal_experience": 3,
        "research_quality": 2
      },
      "total_minimum_percent": 50
    },
    "max_score_per_factor": 10,
    "top_n": 3,
    "lookback_days": 14
  },
  "scoring_scales": {
    "_id": "scoring_scales",
    "version": 1,
    "freshness_scale": { "rules": [...] },
    "personal_experience_scale": { "rules": [...] },
    "research_quality_scale": { "rules": [...] }
  }
}
```

---

## After the Call

Store both config objects in working memory as `scoring_config`.

**Present a clean summary to the user:**

> "⚙️ **Current Scoring Config (v[version])**
> 
> **Weights (Fibonacci):** Freshness ×8 | Personal Experience ×5 | Research Quality ×3  
> **Max score:** 160 | **Minimum to qualify:** 50% (80 points)  
> **Individual minimums:** F ≥ 5 | P ≥ 3 | R ≥ 2  
> **Top N selected:** [top_n] posts | **Lookback:** [lookback_days] days
> 
> Defaults se chalein? (haan/nahi)"

**User says "haan" / "yes" / "default theek hai":**
→ Proceed to **A.6**. Skip A.5.

**User says "nahi" / "change karna hai" / "customize":**
→ Proceed to **A.5**.

---

## Error Handling

**If the webhook call fails:**
> "Config fetch karne mein dikkat."

Retry once after 5 seconds. If it fails again:
> "`SMA/Data/Read/FetchConfig` webhook check karo."

If it still fails, use these **hardcoded fallback defaults** and warn the user:
```
weights: { freshness: 8, personal_experience: 5, research_quality: 3 }
thresholds: { individual_minimum: { freshness: 5, personal_experience: 3, research_quality: 2 }, total_minimum_percent: 50 }
top_n: 3, lookback_days: 14
```
> "Config DB se nahi aayi — default values use kar raha hoon. Baad mein n8n check karna."

Do NOT block the workflow for a config fetch failure — defaults are well-defined and safe to use.

---

## What NOT to Do

- ❌ Do NOT skip this step and hardcode config silently — always fetch from DB
- ❌ Do NOT show the full JSON config dump to the user — summarize it
- ❌ Do NOT let the user change config here — that's A.5's job
- ❌ Do NOT proceed to A.5 unless the user explicitly says they want to change something

---

## Output for Next Step

Pass to **A.5 or A.6**:
```
briefs[]                  — from A.1
past_posts[]              — from A.2
briefs_with_experiences[] — from A.3
scoring_config            — { scoring_weights: {...}, scoring_scales: {...} }
```
