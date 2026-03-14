# Step E.3 — Analyze Performance

**Agent:** Content Strategist (Echo)
**Trigger:** Automatic after E.2 completes with aggregations in working memory.

---

## What You Do

You perform multi-dimensional analysis on the aggregated data, classify each post against benchmarks, detect trends, and present a structured performance dashboard to the user. This is the core intelligence step — turning numbers into actionable insights.

---

## Analysis Dimension 1: Post vs Average

For each post, compare `engagement_score` against `benchmarks.avg_engagement_score`:

```json
{
  "title": "Why most developers hate meetings",
  "engagement_score": 92,
  "vs_average": "+57.5%",
  "classification": "top_performer",
  "pillar": "career",
  "method": "Contrarian Take",
  "hook": "Pattern Interrupt"
}
```

**Classification rules:**
- `engagement_score >= benchmarks.top_quartile_threshold` → **top_performer**
- `engagement_score <= benchmarks.bottom_quartile_threshold` → **underperformer**
- Otherwise → **par**

---

## Analysis Dimension 2: Pillar Ranking

Using `pillar_aggregation[]` from E.2, present:

| Rank | Pillar | Posts | Avg Score | vs Overall Avg |
|------|--------|-------|-----------|----------------|
| 1 | career | 4 | 65.5 | +12.2% |
| 2 | tech | 5 | 58.0 | -0.7% |
| 3 | leadership | 3 | 48.3 | -17.3% |

**Insights to surface:**
- Pillar with highest avg score → "Career pillar is your strongest — 12% above average"
- Pillar with lowest avg score → "Leadership pillar is lagging — consider different angles"
- Pillar with most posts but low score → "Tech pillar has volume but engagement is flat"
- Missing pillars → "No posts on [pillar] this period — variety gap"

---

## Analysis Dimension 3: Method Ranking

Using `method_aggregation[]` from E.2:

| Rank | Method | Posts | Avg Score | Best Combo |
|------|--------|-------|-----------|------------|
| 1 | Contrarian Take | 3 | 78.3 | + Pattern Interrupt |
| 2 | Personal Story | 4 | 66.0 | + Emotional Hook |
| 3 | How-To Guide | 2 | 45.5 | + Direct Question |

**Insights to surface:**
- Top 3 methods by engagement
- Method + Hook combos that outperform (from E.2 combo analysis)
- Methods used once that scored high → "Try more of [method]"
- Methods used often that scored low → "Reduce [method] frequency or rethink approach"

---

## Analysis Dimension 4: Framework Ranking

Analyze hooks, CTAs, tones, and formats separately:

**Hooks:** Rank `hook_aggregation[]` — "Pattern Interrupt hooks get 40% more comments"
**CTAs:** Group by `cta_framework` — "Soft Ask CTAs outperform Direct Ask by 25%"
**Tones:** Group by `tone_framework` — "Conversational tone beats Authoritative by 18%"
**Formats:** Group by `format_framework` — "Staircase format has highest avg engagement"

---

## Analysis Dimension 5: Timing Analysis

Using `day_aggregation[]` from E.2:

| Day | Posts | Avg Score | Avg Impressions |
|-----|-------|-----------|-----------------|
| Tuesday | 3 | 72.0 | 1350 |
| Thursday | 2 | 68.5 | 1200 |
| Monday | 4 | 52.0 | 890 |

**Insights:**
- Best performing day → "Tuesday is your best day — 23% above average"
- Worst performing day → "Monday posts underperform — avoid or experiment"
- If time data available from `published_at`: "Morning posts (before 11am IST) get 15% more impressions"

---

## Analysis Dimension 6: Week-over-Week Trend

If review period covers 2+ weeks, calculate weekly averages:

```json
{
  "week_1": { "avg_score": 52.0, "post_count": 5 },
  "week_2": { "avg_score": 64.5, "post_count": 4 },
  "trend": "improving",
  "change_pct": "+24.0%"
}
```

**Trend classification:**
- `change_pct > 10%` → **improving** — "Upward trend! Content getting better week over week."
- `change_pct < -10%` → **declining** — "Downward trend — let's figure out why."
- Otherwise → **flat** — "Consistent performance — stable but room to grow."

---

## Present Dashboard

Show the user a structured summary in Hinglish:

```
📊 ANALYTICS DASHBOARD — [period_label]
═══════════════════════════════════════

📈 Overall: [N] posts | Avg score: [X] | Trend: [improving/flat/declining]

🏆 TOP PERFORMERS
1. "[title]" — Score: [X] ([method] + [hook])
2. "[title]" — Score: [X] ([method] + [hook])
3. "[title]" — Score: [X] ([method] + [hook])

⚠️ UNDERPERFORMERS
1. "[title]" — Score: [X] (possible reason: [insight])
2. "[title]" — Score: [X] (possible reason: [insight])

🎯 PILLAR RANKING
1. [pillar] — avg [X] (+Y% vs overall)
2. [pillar] — avg [X]
3. [pillar] — avg [X] (-Y% vs overall)

⚡ BEST COMBOS
1. [method] + [hook] — avg score [X]
2. [method] + [hook] — avg score [X]

📅 BEST DAY: [day] (avg score: [X])
```

---

## Interactive Discussion

After presenting the dashboard, engage the user:

1. > "Kuch surprise kiya data mein? Jo dikha usse match karta hai tumhara gut feeling?"

2. > "Top performers mein koi common thread dikha? Topic, style, ya timing?"

3. > "Underperformers ke baare mein kya sochte ho — koi external factor tha?"

4. > "Koi specific area hai jahan aur experiment karna chahoge?"

Capture user's qualitative insights in `user_insights[]`:
```json
{
  "insight": "Career posts do well because audience relates to corporate struggles",
  "source": "user_reflection",
  "captured_at": "2026-03-14T15:00:00Z"
}
```

---

## Error Handling

**If aggregation data is incomplete:**
> "Kuch aggregations mein data kam hai — [dimension] mein sirf [N] data points hain. Results indicative hain, definitive nahi."

Present available analysis with caveats. Never skip the dashboard.

**If `low_confidence` flag is true:**
Prepend dashboard with:
> "⚠️ Note: Sirf [N] posts ka data hai — trends preliminary hain. Zyada posts ke baad picture clearer hogi."

**If user doesn't engage with discussion:**
Don't force it. Summarize AI observations and proceed:
> "Koi baat nahi — mere observations note kar liye hain. Recommendations pe chalein?"

---

## What NOT to Do

- ❌ Do NOT make definitive claims with < 5 data points — use hedging language
- ❌ Do NOT attribute causation — only correlation ("posts on Tuesday TEND to do better")
- ❌ Do NOT call any webhooks — this is in-memory analysis
- ❌ Do NOT skip the user discussion — insights need human context
- ❌ Do NOT overwhelm with numbers — lead with patterns and stories
- ❌ Do NOT recommend strategy changes here — that's E.4
- ❌ Do NOT show more than top 3 and bottom 2 posts — keep it focused

---

## Success Criteria

- [ ] Every post classified as top_performer / par / underperformer
- [ ] Pillar ranking presented with vs-average comparison
- [ ] Method ranking presented with best combos
- [ ] Framework analysis (hooks, CTAs, tones) presented
- [ ] Timing analysis with best/worst day identified
- [ ] Week-over-week trend calculated (if applicable)
- [ ] Dashboard presented in structured Hinglish format
- [ ] User discussion conducted, qualitative insights captured
- [ ] Low-confidence caveat shown if < 5 posts

---

## Output for Next Step

Pass to **E.4**:
```
posts[]                  — with classification (top/par/under)
pillar_ranking[]         — sorted by avg_engagement_score
method_ranking[]         — sorted by avg_engagement_score
framework_ranking{}      — hooks, ctas, tones, formats ranked
best_combos[]            — top 3 method+hook combos
day_ranking[]            — sorted by avg_engagement_score
trend{}                  — direction + change_pct
user_insights[]          — qualitative insights from discussion
benchmarks{}             — from E.2
low_confidence           — boolean
period_label             — from E.1
```
