# Content Ideation Journey (J1) Validation & PRD

This document validates the **LinkRight SMA** design against the Content Ideation (J1) journey. It identifies existing coverage and flags missing states/components (❌).

---

## 1. Happy Path Validation

| Step | Scenario | Status | Design Reference |
| :--- | :--- | :--- | :--- |
| 1 | Dashboard "Pipeline Funnel" with counts | ✅ | {{DATA:SCREEN:SCREEN_29}} (Light), {{DATA:SCREEN:SCREEN_19}} (Dark) |
| 2 | FAB "Plan Content" trigger | ✅ | FAB exists on {{DATA:SCREEN:SCREEN_29}}. *Note: Interaction leads to Step 3.* |
| 3 | System fetching (Loading State) | ❌ | **Missing:** Skeleton screens and LinearProgress for "Briefs Loading". |
| 4 | Display numbered list of briefs | ❌ | **Missing:** "Briefs Selection" screen showing fetched content. |
| 5 | WSJF breakdown & Experience snippets | ❌ | **Missing:** Brief cards showing F/P/R scores and experience matches. |
| 6 | Select top N posts (Multi-select) | ❌ | **Missing:** Multi-select interaction on Briefs screen. |
| 7 | Calendar view (available slots) | ❌ | **Missing:** Scheduling/Calendar selection view during ideation. |
| 8 | Success Snackbar "3 posts scheduled!" | ❌ | **Missing:** Post-scheduling confirmation feedback. |
| 9 | Pipeline funnel updates | ✅ | Supported by Pipeline Overview card structure. |
| 10 | "Today's Posts" updates | ✅ | Supported by Dashboard list view. |

---

## 2. Edge Cases & Error Handling

| Step | Scenario | Status | Design Treatment Needed |
| :--- | :--- | :--- | :--- |
| 11 | ZERO briefs found | ❌ | **Missing:** Empty state for "No Briefs Found". |
| 12 | ALL slots taken (Max 3) | ❌ | **Missing:** Banner alert for capacity limit. |
| 13 | NO Experience matches (< 0.80) | ❌ | **Missing:** Fallback state for brief without experience snippet. |
| 14 | Score below 80 threshold | ❌ | **Missing:** Amber "Low Quality" badge variant + tooltip. |
| 15 | API timeout/error | ❌ | **Missing:** Error Banner with retry logic. |
| 16 | Network offline | ❌ | **Missing:** Offline Snackbar. |

---

## 3. Negative Scenarios

| Step | Scenario | Status | Design Treatment Needed |
| :--- | :--- | :--- | :--- |
| 17 | Schedule on occupied day | ❌ | **Missing:** Conflict Warning Dialog. |
| 18 | Schedule > 3 posts | ❌ | **Missing:** Disabled state for selection after limit. |
| 19 | Duplicate topic detected | ❌ | **Missing:** "Similar post exists" warning chip on brief. |

---

## Conclusion & Next Steps
The core "management" UI (Dashboard, List, Detail) is high-fidelity and dev-ready. However, the **Ideation Flow (Fetching → Selection → Scheduling)** is currently missing the dedicated "Briefs Selection" UI and its associated edge cases.

**Action Plan:**
1. Generate the **"Briefs Selection"** screen showing the ranked list with WSJF scores.
2. Generate the **"Loading & Empty States"** for this flow.
3. Design the **Warning/Conflict Dialogs** and **Status Banners**.