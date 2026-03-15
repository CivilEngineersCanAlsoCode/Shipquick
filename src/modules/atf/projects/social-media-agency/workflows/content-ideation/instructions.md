# Content Ideation — Agent Instructions

## Overview
This workflow transforms raw topic briefs (sourced from ChatGPT via Google Sheets) into a scored, scheduled 3-day LinkedIn content plan. The agent collaborates with the user at key decision points. ALL data reads and writes go through n8n webhooks — the agent has ZERO direct DB/API access.

## Agents Involved
- **Content Strategist (Echo):** Drives the entire ideation flow — fetches briefs, scores them, presents options, manages scheduling, and saves results.

## Execution Flow

### Phase 1: Data Gathering (Steps A.1–A.3)
1. **Fetch Briefs (A.1):** POST to `sma-fetch-briefs` with `{ "status": "New" }`. Store all returned briefs. If zero briefs, halt and ask user to add ideas via ChatGPT GPT.
2. **Fetch Past Posts (A.2):** POST to `sma-fetch-past-posts` with `{ "days": 14, "channel": "linkedin" }`. Used for freshness scoring — prevents topic repetition within the lookback window.
3. **Search Experiences (A.3):** POST to `sma-search-experiences` with each brief topic as a query (limit: 1, min_similarity: 0.3). Provides personal-experience relevance scores.

### Phase 2: Scoring Configuration (Steps A.4–A.5)
4. **Load Scoring Config (A.4):** POST to `sma-fetch-config` for `scoring_weights` and `scoring_scales`. Present current weights (F×8, P×5, R×3) and thresholds to user. Ask user to confirm or modify.
5. **Update Config (A.5, optional):** If user wants changes, POST to `sma-save-config` with updated weights/scales.

### Phase 3: Score, Select & Schedule (Steps A.6–A.7)
6. **Score & Select (A.6):** Compute scores locally using the Fibonacci formula:
   - `Score = F×8 + P×5 + R×3` (max 160)
   - Gate checks: F≥5, P≥3, R≥2, Total≥80
   - Discard failing briefs (update Sheet status to "Discarded")
   - Present qualifying briefs ranked by score — user selects up to 3
   - If user shares a personal experience, save it via `sma-save-experience`
   - Loop: user can request more briefs → re-fetch, re-score, re-present
7. **Prioritize & Schedule (A.7):** POST to `sma-fetch-past-posts` and `sma-fetch-config` (posting_schedule) to find open calendar slots. Assign each selected post to a date. User confirms schedule.

### Phase 4: Persistence (Step A.8)
8. **Save (A.8):** For each post:
   - Save to MongoDB via `sma-save-post` (status: `Scheduled_NoDraft`) — BLOCKING
   - Mark source briefs as "Used" in Google Sheet via `sma-update-sheet-status` — non-blocking on failure
   - Present final summary and offer next actions (draft now, more ideas, exit)

## Webhook Reference
| Webhook | Method | Steps |
|---------|--------|-------|
| sma-fetch-briefs | POST | A.1, A.6 (loop) |
| sma-fetch-past-posts | POST | A.2, A.7 |
| sma-search-experiences | POST | A.3, A.6 (loop) |
| sma-fetch-config | POST | A.4, A.7 |
| sma-save-config | POST | A.5 |
| sma-update-sheet-status | POST | A.6, A.8 |
| sma-save-experience | POST | A.6 |
| sma-save-post | POST | A.8 |

## Key Constraints
- LinkedIn only (v1), max 3 posts planned per session
- 1 post per day, no weekends unless configured
- MongoDB is source of truth — Notion is view-only mirror
- 0.80 default similarity threshold for experience matching (A.3 preview uses 0.3 for broader initial results)
- English for vector-searchable content
- All user communication in Hinglish (Hindi-English mix)
- Never invent or hallucinate briefs — always use webhook data
- Never show discarded briefs to user
- Never block workflow on non-critical webhook failures (Sheet updates, Notion saves)

## Success Criteria
- ≥1 post scheduled per session (up to 3)
- All qualifying briefs scored using consistent formula
- MongoDB records created for every scheduled post
- Notion calendar entries mirror MongoDB
- Google Sheet statuses reflect final state (Used/Discarded/Selected)
- User confirmed schedule before any saves executed
