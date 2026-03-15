# Stitch Design Audit — What to Keep, What to Drop, What to Fix

## Summary
- **31 HTML files received** → **screen-1 = screen-2 (exact dup)** → **30 unique**
- **KEEP 17** (best version per screen type)
- **DROP 13** (duplicates or inferior variants)
- **Global fixes** needed across all kept screens

---

## 🟢 KEEP — Best Version Per Screen (17 files)

### Core Pages (10 — light + dark pairs)

| # | File | Screen | Why This Version |
|---|------|--------|-----------------|
| 1 | `dashboard-dark-v3.html` | Dashboard (dark) | Has Action Required + 7 pipeline chips + score rings |
| 2 | `dashboard-light-v4.html` | Dashboard (light) | Most complete variant |
| 3 | `posts-list.html` | Posts List (light) | Correct 4-nav, pillar chips, 2×2 card grid |
| 4 | `posts-list-dark.html` | Posts List (dark) | Dark pair of above |
| 5 | `post-detail.html` | Post Detail (light) | Split view: editor + LinkedIn preview + F/P/R breakdown |
| 6 | `post-detail-dark.html` | Post Detail (dark) | Dark pair |
| 7 | `analytics-v2.html` | Analytics (light) | Updated layout with resurgence alert |
| 8 | `analytics-dark.html` | Analytics (dark) | Dark pair |
| 9 | `settings-main.html` | Settings (light) | Fibonacci sliders + schedule + pillar weights + tone |
| 10 | `screen-1.html` | Settings Review Dialog | Before/after comparison table (J6 gap fix) |

### Journey & State Screens (7)

| # | File | Screen | Journey |
|---|------|--------|---------|
| 11 | `briefs-selection.html` | Briefs Selection | J1: Content Ideation |
| 12 | `drafting-editor.html` | Drafting Editor | J2: Content Drafting |
| 13 | `formatting-report.html` | Formatting Report | J3: FR01-FR16 checklist + editor + LinkedIn preview |
| 14 | `post-review-j4.html` | Post Review + Request Changes | J4: Review with revision history + feedback dialog |
| 15 | `batch-review.html` | Batch Review Summary | J4: "2 approved, 1 changes requested" |
| 16 | `analytics-j5-review.html` | Analytics Review | J5: Resurgence + AI recommendations + JS snippet |
| 17 | `scheduling-conflicts.html` | Scheduling Conflicts | J1: Weekly limit + conflict detection + similarity |

---

## 🟡 KEEP AS REFERENCE ONLY (not for dev)

| File | Why Keep | Notes |
|------|----------|-------|
| `dashboard-empty-v2.html` | Empty state pattern | Reuse pattern for "no posts" dashboard |
| `analytics-empty.html` | Empty state with NavRail | Best NavRail implementation |
| `posts-empty-v2.html` | Posts empty state | "No posts yet" + AI Suggestions + Plan Content CTA |
| `dashboard-loading.html` | Skeleton/shimmer state | Loading pattern for all pages |
| `dialogs-notifications.html` | Dialog + snackbar patterns | Unsaved changes, publish warning, error/warning bars |
| `formatting-validation.html` | QA validation roadmap | FR01-FR16 fidelity grid — dev testing reference |

---

## 🔴 DROP — Inferior Duplicates (7 files)

| File | Reason |
|------|--------|
| `screen-2.html` | Exact duplicate of screen-1.html |
| `dashboard-v3.html` | Same as dashboard-light-v3 but worse |
| `dashboard-light-v3.html` | Inferior to dashboard-light-v4 |
| `dashboard-dark-v1.html` | Marketing funnel (wrong concept — Awareness/Interest/Consideration) |
| `dashboard-dark-v2.html` | Similar to v1, wrong funnel concept |
| `dashboard-teal-v1.html` | Teal experiment, incomplete nav |
| `analytics-v1.html` | Older version, analytics-v2 is better |
| `posts-empty.html` | Inferior to posts-empty-v2 (wrong nav, no AI suggestions) |

---

## 🔧 GLOBAL FIXES (apply to ALL kept screens before dev)

### CRITICAL (must fix)

| # | Issue | Current | Should Be |
|---|-------|---------|-----------|
| 1 | **Score scale** | /100 | **/160** (max = F×8 + P×5 + R×3 = 80+50+30) |
| 2 | **Score formula** | Score = (F×2)+(P×3)+(R×5) | **Score = F×8 + P×5 + R×3** |
| 3 | **Dimension labels** | Fluency/Precision/Readability OR Follower/PostFreq/Reach | **Freshness / Personal Experience / Research Quality** |
| 4 | **Pillar names** | Product Features, Company Culture, etc. | **ai_automation (25%), startup (20%), pm (20%), career (15%), hottake (10%), personal (5%), howto (5%)** |
| 5 | **Pillar colors** | Random | **ai_automation=#2196F3, startup=#FF9800, pm=#9C27B0, career=#4CAF50, hottake=#F44336, personal=#E91E63, howto=#009688** |
| 6 | **Nav items** | Varies (3-5 items, different labels) | **4 items: Dashboard, Posts, Analytics, Settings** |
| 7 | **User profile** | "Alex Morgan/Rivera/Rivers", avatars, Pro Account | **Remove entirely** (single user, no auth v1) |
| 8 | **Year** | 2023/2024 | **2026** |
| 9 | **Posts per day** | 3 | **1** (max) |

### IMPORTANT (should fix)

| # | Issue | Current | Should Be |
|---|-------|---------|-----------|
| 10 | **User name** | Alex Rivers/Morgan/Rivera | **Satvik Jain / Senior PM at American Express** |
| 11 | **Tone label** | "Friendly & Conversational" | **"vulnerable-conversational" (primary), "reflective-ambitious" (secondary)** |
| 12 | **Platform tabs** | LinkedIn + Twitter | **LinkedIn only (v1)** |
| 13 | **Workspace labels** | "Marketing Team A" / "Workspace Admin" | **Remove** (single user) |
| 14 | **Notification bell** | Present on some screens | **Remove** |
| 15 | **Dark mode toggle** | Moon icon on some | **Keep — good UX** |
| 16 | **Pipeline chips** | 6 in some, 7 in others | **Always 7: Scheduled_NoDraft → Drafting → Drafted → Formatting → Previewed → Ready_ToPublish → Published** |
| 17 | **Score ring colors** | Some correct, some not | **Green ≥80/160 (50%), Amber 60-79 (37-49%), Red <60 (<37%)** |

### NICE TO HAVE

| # | Issue | Notes |
|---|-------|-------|
| 18 | Consistent NavRail vs TopNav | Some screens use top nav, some use left NavRail. **Standardize to LEFT NavRail (256px)** |
| 19 | FAB button | Missing from most screens. Add "+ New Post" FAB (bottom-right) |
| 20 | Action Required section | Only in dashboard-dark-v3. Ensure present in dashboard |
| 21 | Weekly Calendar | Only in dashboard-empty-v2. Add to main dashboard |
| 22 | "Plan Content" → opens ChatGPT | CTA should link to external ChatGPT, not in-app AI |

---

## 📐 FINAL CODE ARCHITECTURE (React + MUI v6)

### File Structure
```
ui/app/src/
├── theme.js                 # M3 tokens from design system
├── App.jsx                  # Router + NavRail layout
├── components/
│   ├── NavRail.jsx          # 4 items + ChatGPT/Telegram links
│   ├── TopAppBar.jsx        # Logo + dark mode toggle
│   ├── PipelineFunnel.jsx   # 7 status chips with counts
│   ├── ScoreRing.jsx        # Circular progress with conditional color
│   ├── StatusChip.jsx       # 9 status variants
│   ├── PillarChip.jsx       # 7 pillar colors
│   ├── ActionRequired.jsx   # Urgent/soon/info items
│   ├── WeekCalendar.jsx     # Mon-Fri day cards
│   ├── MetricCard.jsx       # Icon + value + label + delta
│   ├── PostCard.jsx         # Card with score ring + chips
│   ├── LinkedInPreview.jsx  # Mock LinkedIn post
│   ├── ScoreBreakdown.jsx   # F/P/R progress bars
│   ├── StatusStepper.jsx    # 7-step horizontal timeline
│   └── FAB.jsx              # New Post floating button
├── pages/
│   ├── Dashboard.jsx        # From dashboard-dark-v3 + light-v4
│   ├── Posts.jsx             # From posts-list + posts-empty-v2
│   ├── PostDetail.jsx       # From post-detail + post-review-j4
│   ├── Analytics.jsx        # From analytics-v2 + j5-review
│   └── Settings.jsx         # From settings-main + screen-1 dialog
└── api.js                   # n8n webhook proxy calls
```

### Source Screen → Component Mapping
| Component | Primary Source | Fallback Source |
|-----------|---------------|-----------------|
| Dashboard | `dashboard-dark-v3` | `dashboard-light-v4` |
| Posts List | `posts-list` | `posts-list-dark` |
| Post Detail | `post-detail` + `post-review-j4` | `post-detail-dark` |
| Analytics | `analytics-v2` + `analytics-j5-review` | `analytics-dark` |
| Settings | `settings-main` + `screen-1` (dialog) | — |
| Empty States | `posts-empty-v2`, `analytics-empty`, `dashboard-empty-v2` | — |
| Loading | `dashboard-loading` | — |
| Dialogs | `dialogs-notifications`, `scheduling-conflicts` | — |
| Briefs | `briefs-selection` | — |
| Drafting | `drafting-editor` | — |
| Formatting | `formatting-report` | — |
| Batch Review | `batch-review` | — |
