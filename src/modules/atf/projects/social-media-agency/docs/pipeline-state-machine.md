# SMA Pipeline State Machine

> **Version:** 1.0
> **Created:** 2026-03-15
> **Source:** BMAD Deep Audit P1.5

---

## 1. Pipeline Flow

```
A (Ideation) → B (Drafting) → F (Formatting) → C (Review) → D (Publishing) → E (Analytics)
                                                                                ↓
                                                                           loops back to A
```

---

## 2. Post Status States

| State | Description | Set By | Stored In |
|-------|-------------|--------|-----------|
| `Scheduled_NoDraft` | Post scheduled, no content yet | A.8 | MongoDB `linkedin_posts.status` |
| `Drafting` | Draft in progress (saved incomplete) | B.4 | MongoDB |
| `Drafted` | Draft complete, awaiting formatting | B.4 (finalize) | MongoDB |
| `Formatting` | Formatting in progress | F.1 | MongoDB |
| `Previewed` | Formatted and previewed, awaiting review | F.4 | MongoDB |
| `Ready_ToPublish` | Review approved, ready to publish | C.2 | MongoDB |
| `Published` | Published to LinkedIn | D.3 | MongoDB |
| `Cancelled` | Post cancelled at any stage | Any | MongoDB |
| `Publish_Failed` | LinkedIn publish attempt failed | D.2 | MongoDB |

---

## 3. State Transition Diagram

```
                    ┌──────────────────────────────────────────────────┐
                    │                  Cancelled                       │
                    │  (reachable from any state except Published)     │
                    └──────────────────────────────────────────────────┘
                                          ▲
                                          │ user cancels
                                          │
┌──────────────────┐    B.1     ┌─────────┴────────┐
│ Scheduled_NoDraft├───────────►│    Drafting       │◄──┐
│                  │  pick post │  (in-progress)    │   │
└──────────────────┘            └────────┬──────────┘   │
       ▲                                 │              │
       │                          B.4    │ finalize     │ B.4 "save as draft"
       │                                 ▼              │ (incomplete)
       │                        ┌────────────────┐      │
       │                        │    Drafted      ├─────┘
       │                        │                 │
       │                        └───────┬────────┘
       │                                │
       │                          F.1   │ pick for formatting
       │                                ▼
       │                        ┌────────────────┐
       │                        │  Formatting    │
       │                        │                │
       │                        └───────┬────────┘
       │                                │
       │                          F.4   │ user approves preview
       │                                ▼
       │               ┌───────────────────────────────┐
       │               │        Previewed              │
       │               │                               │
       │               └───────┬───────────────────────┘
       │                       │
       │                 C.1   │ fetch for review
       │                       ▼
       │    ┌─────────────────────────────────────┐
       │    │         C.2 Review Decision          │
       │    │                                      │
       │    │  approve ──► Ready_ToPublish          │
       │    │  reject  ──► back to Formatting (F)   │
       │    │  rework  ──► back to Drafting (B)     │
       │    └──┬──────────┬────────────┬───────────┘
       │       │          │            │
       │       │ approve  │ reject     │ rework
       │       ▼          ▼            ▼
       │  ┌──────────┐  Formatting   Drafting
       │  │Ready_To  │  (loop C→F)   (loop C→B)
       │  │Publish   │
       │  └────┬─────┘
       │       │
       │ D.2   │ publish to LinkedIn
       │       ▼
       │  ┌──────────┐     ┌──────────────┐
       │  │Published  │     │Publish_Failed │
       │  └────┬─────┘     └──────┬───────┘
       │       │                  │
       │ E.1   │ analytics        │ manual retry
       │       ▼                  │ (re-queue)
       │  E (Analytics)           ▼
       │       │            Ready_ToPublish
       │       │
       └───────┘
    E.5 feedback loop
```

---

## 4. Transition Table

| From | To | Trigger | Condition | Workflow Step |
|------|----|---------|-----------|--------------|
| `Scheduled_NoDraft` | `Drafting` | Agent picks post | Earliest by `scheduled_date` | B.1 |
| `Drafting` | `Drafted` | User finalizes draft | User approves draft content | B.4 |
| `Drafting` | `Drafting` | User saves incomplete | "Save as draft, baad mein" | B.4 |
| `Drafted` | `Formatting` | Agent picks for formatting | Status = Drafted | F.1 |
| `Formatting` | `Previewed` | User approves preview | Formatting rules applied, preview shown | F.4 |
| `Previewed` | `Ready_ToPublish` | Reviewer approves | Review passes quality gates | C.2 |
| `Previewed` | `Formatting` | Reviewer rejects (format) | Formatting issues found | C.2 (loop C→F) |
| `Previewed` | `Drafting` | Reviewer rejects (content) | Content rework needed | C.2 (loop C→B) |
| `Ready_ToPublish` | `Published` | LinkedIn publish succeeds | One-shot publish via webhook | D.2 + D.3 |
| `Ready_ToPublish` | `Publish_Failed` | LinkedIn publish fails | API error, network failure | D.2 |
| `Publish_Failed` | `Ready_ToPublish` | Manual re-queue | User decides to retry | Manual |
| `Published` | — | Terminal state | Analytics collection begins | E.1 |
| Any (except Published) | `Cancelled` | User cancels | User decision | Any |

---

## 5. Loop Paths

### C→F Rework (Formatting Issues)
```
Previewed → (reviewer finds formatting problems) → Formatting → Previewed → Ready_ToPublish
```
- **Trigger:** Reviewer sees layout issues, emoji violations, character count problems
- **Action:** Status reverts to `Formatting`, F workflow re-applies rules
- **Guard:** Must re-preview before returning to review

### C→B Rework (Content Issues)
```
Previewed → (reviewer finds content problems) → Drafting → Drafted → Formatting → Previewed → Ready_ToPublish
```
- **Trigger:** Reviewer finds factual errors, tone mismatch, weak hook, missing CTA
- **Action:** Status reverts to `Drafting`, full B→F→C cycle re-runs
- **Guard:** Must complete drafting, formatting, and preview before re-review

---

## 6. Error States & Recovery

| Error State | Cause | Recovery Path |
|-------------|-------|---------------|
| `Publish_Failed` | LinkedIn API error, network timeout, auth failure | Manual re-queue to `Ready_ToPublish` (no auto-retry — one shot only) |
| `Drafting` (stale) | User abandoned mid-draft | B.1 step-01b resume-if-interrupted loads from last saved state |
| `Formatting` (stale) | User abandoned mid-formatting | F.1 detects in-progress post, offers resume |
| Webhook failure (any step) | n8n down, MongoDB unreachable | Agent reports error, user retries step manually |

### One-Shot Publish Rule
LinkedIn publishing is **one attempt only** — no automatic retry. If `Publish_Failed`:
1. Agent notifies user with error details
2. User investigates (auth token expired? rate limited? content policy?)
3. User manually triggers re-publish or cancels

---

## 7. Invariants

1. A post can only be in **one state** at a time
2. State transitions are **forward-only** except for review rework loops (C→F, C→B)
3. `Published` is a **terminal state** — no further status changes
4. `Cancelled` is a **terminal state** — reachable from any non-terminal state
5. Only `Ready_ToPublish` posts can be published — no skipping review
6. Maximum **1 post published per day** (v1 constraint)
7. Random **0-60 minute delay** before actual LinkedIn publish (D.2)
8. Duplicate guard: check `linkedin_post_urn` before publish to prevent double-posting
