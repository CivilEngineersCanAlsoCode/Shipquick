# J1 — Content Ideation Journey Map

**Workflow:** A (Content Ideation) — 8 steps
**Agent:** Scout (flex-ideator)
**Trigger:** User says "Let's brainstorm" or "Ideation shuru karo"
**Entry status:** Briefs exist in Google Sheet (status=New)
**Exit status:** Posts saved to MongoDB (status=Scheduled_NoDraft) + Notion + Sheet updated

---

## Journey Overview

```
User adds briefs     Trigger ideation     Review scores     Select top N     Confirm schedule     Done
to Google Sheet  →   in ChatGPT       →   & experiences  →  from ranked   →  dates & save     →  Pipeline filled
(async, anytime)     (A.1–A.3)           (A.4–A.6)         list (A.6)       (A.7–A.8)
```

---

## Step-by-Step Journey

### Phase 1: Data Gathering (A.1–A.3) — Automatic, ~30 seconds

| Step | User Action | System Action | Webhook | Data Flow |
|------|-------------|---------------|---------|-----------|
| A.1 | Says "Let's brainstorm" | Fetch all New briefs from Google Sheet | `POST /sma-fetch-briefs` | Sheet → Agent: array of briefs with title, notes, source |
| A.2 | Waits (auto) | Fetch last 14 days of published posts for context | `POST /sma-fetch-past-posts` (days=14) | MongoDB → Agent: recent posts with metrics |
| A.3 | Waits (auto) | Semantic search: top 1 experience per brief | `POST /sma-search-experiences` (threshold=0.80) | MongoDB vectors → Agent: matched experiences |

**User sees:** "Found [N] new briefs. Fetching context..." → progress indicator
**Emotion:** Anticipation — "What did it find?"
**Pain point:** If no briefs exist, dead end — needs clear empty state guidance

### Phase 2: Scoring & Selection (A.4–A.6) — Interactive, 3–10 minutes

| Step | User Action | System Action | Webhook | Data Flow |
|------|-------------|---------------|---------|-----------|
| A.4 | Reviews current scoring config | Fetch scoring_weights + scoring_scales from MongoDB | `POST /sma-fetch-config` | MongoDB config → Agent |
| A.5 | (Optional) Adjusts weights | Save updated config | `POST /sma-save-config` | Agent → MongoDB config |
| A.6 | **Selects top N from ranked list** | Score all briefs: `F×8 + P×5 + R×3`, filter ≥80 points, rank | `POST /sma-update-sheet-status` (discard below threshold) | Agent → Sheet (mark discarded) |

**User sees at A.6:**
```
📋 Ranked Briefs (3 of 8 passed threshold)

#1  "Why PMs should learn SQL" .............. Score: 134/160
    Pillar: Skill-Building | Experience match: 0.91
    F=9 × 8=72 | P=7 × 5=35 | R=9 × 3=27

#2  "My first year at AmEx" ................ Score: 121/160
    Pillar: Career | Experience match: 0.87
    F=8 × 8=64 | P=8 × 5=40 | R=6 × 3=17 (⚠️ near min)

#3  "Design thinking for product teams" ..... Score: 96/160
    Pillar: Leadership | Experience match: 0.82
    F=6 × 8=48 | P=5 × 5=25 | R=8 × 3=23

--- Below threshold (discarded) ---
#4  "Generic AI trends" .................... Score: 72/160 ❌

Select posts to schedule (e.g., "1,2" or "all 3"):
```

**Emotion:** Engaged, evaluative — "These scores make sense, let me pick the best ones"
**Pain point:** If all briefs score below threshold, user needs to either lower threshold or add better briefs
**Opportunity:** Show historical average score for context ("Your avg score is 112")

### Phase 3: Scheduling & Save (A.7–A.8) — Quick confirmation, ~1 minute

| Step | User Action | System Action | Webhook | Data Flow |
|------|-------------|---------------|---------|-----------|
| A.7 | Reviews proposed schedule | Check open slots (3-day lookahead), assign dates | `POST /sma-fetch-past-posts` (lookahead) + `POST /sma-fetch-config` (posting_schedule) | Calendar check |
| A.8 | **Confirms schedule** | Save to MongoDB + Notion + update Sheet | `POST /sma-save-post` + `POST /sma-save-to-notion` + `POST /sma-update-sheet-status` | Agent → MongoDB, Notion, Sheet |

**User sees at A.7:**
```
📅 Proposed Schedule

Mon Mar 16  →  "Why PMs should learn SQL" (Skill-Building)
Tue Mar 17  →  "My first year at AmEx" (Career)
Wed Mar 18  →  [slot open — no post assigned]

Confirm? (y/adjust/cancel)
```

**User sees at A.8 (completion):**
```
✅ Ideation complete!
   2 posts scheduled (Mon–Tue)
   5 briefs discarded (below threshold)
   1 brief remaining in Sheet

Next: "Draft karo" to start B-ContentDrafting
```

**Emotion:** Satisfied, productive — "Pipeline is filled for the week"
**Pain point:** If calendar has conflicts, resolution is conversational (no visual calendar)

---

## Touchpoint Map

| Touchpoint | Channel | Interaction Type |
|------------|---------|-----------------|
| Add briefs | Google Sheets | Manual data entry (async, anytime) |
| Trigger ideation | ChatGPT (LinkRight HQ) | Conversational command |
| Review scores | ChatGPT | Read + evaluate presented data |
| Select posts | ChatGPT | Numbered selection ("1,2,3") |
| Confirm schedule | ChatGPT | Yes/no confirmation |
| View in calendar | Notion | View-only (post-save) |

---

## Emotion Curve

```
High  ·                              ·  ← Selection (engaged)
      ·                            ·   ·
      ·  ← Trigger (hopeful)    ·       ·  ← Schedule confirmed (satisfied)
      ·                       ·           ·
Mid   ·····················                 ·
      ·  ← Waiting for     ·                 ·
      ·    data fetch     ·                    ·
Low   ·                ·  ← All briefs below threshold (frustrated)
```

---

## Error States & Edge Cases

| Condition | User Impact | System Response |
|-----------|-------------|-----------------|
| No new briefs in Sheet | Cannot proceed | "No new briefs found. Add ideas to Google Sheet first." + link to Sheet |
| All briefs below threshold | No posts to schedule | "No briefs passed the 80-point threshold. Lower threshold or improve briefs?" |
| No experience matches (similarity < 0.80) | Weaker scoring | "No strong experience match for '[brief]'. Add a relevant experience?" |
| Calendar fully booked (next 7 days) | Cannot schedule | "All slots filled through [date]. Schedule for next week?" |
| Webhook timeout (n8n down) | Workflow blocked | "Connection issue. Try again in a moment." + retry button |
| User wants to add experience mid-flow | Interrupts A.6 | Support inline experience addition → `POST /sma-save-experience` → re-score |

---

## Opportunities for Dashboard

1. **Pre-ideation brief count badge** — Show "8 new briefs" on dashboard before user enters ChatGPT
2. **Score history visualization** — Chart of average scores over time
3. **Calendar widget** — Visual calendar showing filled/open slots
4. **One-click re-score** — After config change, re-run scoring without full ideation flow
5. **Brief quality indicator** — Flag briefs likely to score low before ideation
