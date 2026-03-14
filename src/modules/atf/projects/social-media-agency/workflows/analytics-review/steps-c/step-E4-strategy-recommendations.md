# Step E.4 — Strategy Recommendations

**Agent:** Content Strategist (Echo)
**Trigger:** Automatic after E.3 completes with analysis and user insights in working memory.

---

## What You Do

You generate actionable strategy recommendations based on the performance analysis from E.3 and the user's qualitative insights. Recommendations are presented to the user for approval, then saved to `sma_config.analytics_recommendations` in MongoDB via n8n webhook.

---

## Recommendation Type 1: Pillar Rebalancing

**Input:** `pillar_ranking[]` from E.3

**Logic:**
- If top pillar avg score is >30% above overall avg → "Double down: plan 2x more [pillar] content next cycle"
- If bottom pillar avg score is >30% below overall avg → "Rethink: try different angles for [pillar] or reduce frequency"
- If a pillar has 0 posts in period → "Variety gap: no [pillar] content this period — add at least 1"
- If pillar distribution is heavily skewed (>50% posts in one pillar) → "Diversify: [pillar] dominates your feed — audiences like variety"

**Output example:**
```json
{
  "type": "pillar_rebalancing",
  "recommendations": [
    {
      "action": "increase",
      "pillar": "career",
      "reason": "Top performer at +32% above average",
      "target": "3-4 posts next cycle (was 2)"
    },
    {
      "action": "rethink",
      "pillar": "leadership",
      "reason": "Consistently below average (-25%)",
      "target": "Try personal leadership stories instead of generic advice"
    },
    {
      "action": "add_variety",
      "pillar": "tech-trends",
      "reason": "Zero posts this period",
      "target": "At least 1 post next cycle"
    }
  ]
}
```

---

## Recommendation Type 2: Format Insights

**Input:** `framework_ranking{}` from E.3

**Logic:**
- Identify format with highest avg engagement → "Format winner: [format] gets [X]% more engagement"
- Identify hook with highest avg comments → "Hook winner: [hook] drives most conversation"
- Identify CTA with highest avg shares → "CTA winner: [cta] gets most reposts"
- Identify tone with best overall score → "Tone winner: [tone] resonates best"

**Output example:**
```json
{
  "type": "format_insights",
  "recommendations": [
    {
      "dimension": "format",
      "winner": "Staircase",
      "metric": "avg_engagement_score",
      "advantage": "+30% vs other formats",
      "action": "Use Staircase format for 60% of posts"
    },
    {
      "dimension": "hook",
      "winner": "Pattern Interrupt",
      "metric": "avg_comments",
      "advantage": "2.5x more comments",
      "action": "Prioritize Pattern Interrupt hooks"
    }
  ]
}
```

---

## Recommendation Type 3: Timing Optimization

**Input:** `day_ranking[]` from E.3

**Logic:**
- Best day by avg engagement → "Publish on [day] — [X]% better engagement"
- Worst day by avg engagement → "Avoid [day] — [X]% below average"
- If time-of-day data available → "Best window: [time range] IST"
- If data insufficient for timing conclusions → "Not enough data yet — keep varying publish times"

**Output example:**
```json
{
  "type": "timing_optimization",
  "recommendations": [
    {
      "action": "prefer_day",
      "day": "Tuesday",
      "reason": "Avg score 72 vs overall 58 (+24%)",
      "confidence": "medium"
    },
    {
      "action": "avoid_day",
      "day": "Monday",
      "reason": "Avg score 45 vs overall 58 (-22%)",
      "confidence": "low"
    }
  ]
}
```

---

## Recommendation Type 4: Method Combos

**Input:** `best_combos[]`, `method_ranking[]` from E.3

**Logic:**
- Top 3 method+hook combos → "Winning combos — use these more often"
- Single-use methods that scored in top quartile → "Hidden gem: [method] scored [X] — try it again"
- Frequently-used methods in bottom quartile → "Fatigue risk: [method] used [N] times but scores declining"

**Output example:**
```json
{
  "type": "method_combos",
  "recommendations": [
    {
      "action": "repeat_combo",
      "combo": "Contrarian Take + Pattern Interrupt",
      "avg_score": 85,
      "reason": "Top performing combination"
    },
    {
      "action": "explore_method",
      "method": "Data Storytelling",
      "score": 78,
      "reason": "Used once, scored in top quartile — potential hidden gem"
    }
  ]
}
```

---

## Recommendation Type 5: Variety Alerts

**Input:** `posts[]`, `method_ranking[]` from E.3

**Logic:**
- If any method category (from `content-methods.csv` 10 categories) has 0 posts in 7+ posts → "Category gap: no [category] posts — add variety"
- If same method used 3+ times consecutively → "Repetition alert: [method] used [N] times in a row"
- If same hook used 3+ times → "Hook variety: try different hooks — [hook] getting stale"
- If < 3 unique methods across all posts → "Method variety low: only [N] methods used — explore more"

**Output example:**
```json
{
  "type": "variety_alerts",
  "alerts": [
    {
      "alert": "category_gap",
      "category": "hottake",
      "posts_in_period": 0,
      "total_posts": 12,
      "suggestion": "No hottake in 12 posts — audience might enjoy a spicy take"
    },
    {
      "alert": "repetition",
      "method": "Personal Story",
      "consecutive_uses": 4,
      "suggestion": "Break the pattern — insert a Contrarian Take or How-To"
    }
  ]
}
```

---

## Present Recommendations to User

Show recommendations in structured Hinglish format:

```
🎯 STRATEGY RECOMMENDATIONS
════════════════════════════

📊 PILLAR REBALANCING
- Career content badhao (top performer, +32%)
- Leadership content mein personal stories try karo
- Tech-trends mein at least 1 post daalo

⚡ FORMAT WINNERS
- Staircase format = +30% engagement → 60% posts mein use karo
- Pattern Interrupt hook = 2.5x comments → priority hook

📅 TIMING
- Tuesday best day hai (+24%) → Tuesday ko prefer karo
- Monday se bachke raho (-22%)

🔥 WINNING COMBOS
1. Contrarian Take + Pattern Interrupt (avg: 85)
2. Personal Story + Emotional Hook (avg: 72)

⚠️ VARIETY ALERTS
- Hottake category missing — add 1 next cycle
- Personal Story 4 baar consecutive — pattern break karo

Kya ye sab theek lagta hai? Kuch change karna hai?
```

---

## User Approval Flow

Wait for user feedback:

**If user approves all:** Proceed to save.

**If user modifies:** Update recommendations per user feedback. Re-present modified list. Get final approval.

**If user rejects some:** Remove rejected recommendations. Confirm remaining list. Proceed to save.

> "Recommendations finalize ho gaye. Ab MongoDB mein save karta hoon."

---

## Action: Save Recommendations to MongoDB

**POST** `https://n8n.linkright.in/webhook/sma-save-config`

```json
{
  "doc_id": "analytics_recommendations",
  "data": {
    "review_period": {
      "start": "2026-03-07",
      "end": "2026-03-14",
      "label": "last week"
    },
    "generated_at": "2026-03-14T15:30:00Z",
    "pillar_rebalancing": [ ... ],
    "format_insights": [ ... ],
    "timing_optimization": [ ... ],
    "method_combos": [ ... ],
    "variety_alerts": [ ... ],
    "user_insights": [ ... ],
    "approved_by_user": true
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "doc_id": "analytics_recommendations",
  "updated_at": "2026-03-14T15:30:05Z"
}
```

---

## Error Handling

**If `/sma-save-config` fails:**
> "Recommendations save nahi ho paye. Retry karta hoon."

Retry once. If fails again:
> "n8n respond nahi kar raha. Satvik, `SMA/Config/Save` check karo. Recommendations working memory mein safe hain — session khatam hone se pehle retry kar lena."

Do NOT lose recommendations — keep in working memory even if save fails.

**If user engagement is low (short/no responses):**
Present a simplified list of top 3 recommendations only:
> "Top 3 recommendations ye hain — approve karo toh save kar deta hoon."

**If `low_confidence` flag is true:**
Prefix recommendations with:
> "⚠️ Ye recommendations kam data pe based hain ([N] posts). Directional guidance samjho, strong conclusions nahi."

---

## What NOT to Do

- ❌ Do NOT auto-apply recommendations — user MUST approve first
- ❌ Do NOT update scoring_weights or config here — that's E.5
- ❌ Do NOT overwhelm with 20 recommendations — max 2-3 per type
- ❌ Do NOT make definitive claims with < 5 data points
- ❌ Do NOT save without user approval
- ❌ Do NOT invent insights not supported by the data
- ❌ Do NOT skip variety alerts — they prevent content staleness

---

## Success Criteria

- [ ] All 5 recommendation types generated (pillar, format, timing, combos, variety)
- [ ] Recommendations presented in structured Hinglish dashboard
- [ ] User reviewed and approved (or modified) recommendations
- [ ] Approved recommendations saved to `sma_config.analytics_recommendations`
- [ ] Webhook save confirmed successful (or failure flagged with retry plan)
- [ ] Low-confidence caveat shown if applicable

---

## Output for Next Step

Pass to **E.5**:
```
approved_recommendations{}  — full approved recommendation set
pillar_rebalancing[]        — approved pillar changes
format_insights[]           — approved format preferences
timing_optimization[]       — approved timing changes
method_combos[]             — approved combo preferences
variety_alerts[]            — approved variety flags
user_insights[]             — qualitative insights from E.3
benchmarks{}                — from E.2
analytics_config            — from E.1
```
