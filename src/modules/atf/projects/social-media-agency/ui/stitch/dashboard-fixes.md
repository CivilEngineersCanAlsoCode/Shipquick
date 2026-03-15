# Dashboard Stitch Code — Required Fixes

## 1. NAV ITEMS (lines ~50-75)
**Current:** Dashboard, Content, Analytics, Schedule, Settings (5 items)
**Should be:** Dashboard, Posts, Analytics, Settings (4 items)
- Remove "Content" → rename to "Posts" with icon `article`
- Remove "Schedule" entirely (schedule is inside Settings)
- Keep: Dashboard (`dashboard`), Posts (`article`), Analytics (`bar_chart`), Settings (`settings`)

## 2. USER PROFILE SECTION (lines ~80-95)
**Current:** "Alex Morgan / Pro Account" with avatar image
**Should be:** REMOVE ENTIRELY — single user (Satvik), no auth, no profiles in v1

## 3. PILLAR NAMES (post cards)
**Current:** "Thought Leadership", "Skill-Building", "Analytics"
**Should be our 7 pillars:**
- `ai_automation` → blue chip (#2196F3)
- `startup` → orange chip (#FF9800)
- `pm` → purple chip (#9C27B0)
- `career` → green chip (#4CAF50)
- `hottake` → red chip (#F44336)
- `personal` → pink chip (#E91E63)
- `howto` → teal chip (#009688)

## 4. PIPELINE CHIP "Scheduled" 
**Current:** "Scheduled"
**Should be:** "Scheduled_NoDraft" (or at minimum "No Draft" to distinguish)

## 5. PIPELINE CHIP "Ready"
**Current:** "Ready"
**Should be:** "Ready_ToPublish" (or "Ready to Publish")

## 6. SCORE RING COLOR for 65
**Current:** All rings use stroke-primary (green)
**Should be:** 
- Score >= 80: green (stroke-primary)
- Score 60-79: amber (stroke-amber-500)
- Score < 60: red (stroke-red-500)

## 7. MISSING: Action Required Section
Between Pipeline and Today's Posts, add:
```html
<section>
  <h3>⚡ Action Required</h3>
  <!-- Cards for posts needing attention -->
  <div>Ready to publish: "Stop treating LinkedIn..." → Publish button</div>
  <div>Needs review: 4 posts previewed → Review button</div>
</section>
```

## 8. MISSING: Weekly Calendar
Between Action Required and Today's Posts:
```
Mon 17  Tue 18  Wed 19  Thu 20  Fri 21  Sat 22  Sun 23
  🟢              🟢              🟢
```
Days with scheduled posts get a green dot. Today highlighted.

## 9. MISSING: FAB Button
Bottom-right fixed position:
```html
<button class="fixed bottom-8 right-8 size-14 bg-primary text-white rounded-full shadow-xl">
  <span class="material-symbols-outlined">add</span>
</button>
```
On click → "Plan Content" (ChatGPT link) or quick action menu

## 10. POST TIME FORMAT
**Current:** "10:45 AM", "02:15 PM", "05:30 PM"
**Should be:** "6:00 PM IST" (our default posting time is 6-7 PM IST)
Also add date: "Mon, Mar 17 · 6:00 PM IST"

## 11. STAT CARD "Best Pillar"
**Current:** "Skill-Building"
**Should be:** "ai_automation" (or whichever has highest engagement)

## 12. STAT CARD "Next Scheduled" 
**Current:** "Mon 9:00 AM"
**Should be:** "Mon, Mar 17 · 6:30 PM IST" (full date + IST timezone)
