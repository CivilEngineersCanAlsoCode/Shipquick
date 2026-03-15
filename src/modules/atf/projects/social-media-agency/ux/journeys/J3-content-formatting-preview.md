# J3 — Content Formatting & Preview Journey Map

**Workflow:** F (Content Formatting) — 4 steps
**Agent:** Pixel (flex-crafter)
**Trigger:** User says "Format karo" or "Let's format"
**Entry status:** Post exists with status=Drafted
**Exit status:** Post updated to status=Previewed in MongoDB

---

## Journey Overview

```
Pick drafted    Lock post &         Generate code-block     User approves
post         →  apply formatting →  preview with stats   →  or requests changes
(F.1)           rules (F.2)         (F.3)                   (F.4)
```

---

## Step-by-Step Journey

### F.1: Pick Drafted Post — ~30 seconds

| Aspect | Detail |
|--------|--------|
| **User action** | Says "Format karo" |
| **System action** | Fetch all Drafted posts, present numbered list |
| **Webhook** | `POST /sma-fetch-post` (status=Drafted) |
| **Locking** | Selected post status → Formatting (`POST /sma-update-post`) to prevent concurrent formatting |
| **Validation** | raw_content exists and ≥200 characters |

**User sees:**
```
📝 Drafted posts ready for formatting:

  1. "Why PMs should learn SQL" — Mon Mar 16 (Skill-Building) — 1,247 chars
  2. "My first year at AmEx" — Tue Mar 17 (Career) — 1,102 chars

Pick one (1-2):
```

**Emotion:** Focused — "Let's polish this"
**Pain point:** If only 1 post, still requires confirmation (could auto-select)

### F.2: Apply Formatting Rules — Automatic, ~10 seconds

| Aspect | Detail |
|--------|--------|
| **User action** | Waits |
| **System action** | Apply all LinkedIn formatting rules to raw_content |
| **Rules applied** | See rules table below |
| **No webhook** | All formatting is done locally by agent |

**LinkedIn Formatting Rules Applied:**

| Rule | Implementation |
|------|---------------|
| Character limit | 800–1600 ASCII characters |
| No bold/italic/underline | Strip any markdown formatting |
| UPPERCASE headers | Apply sparingly to section breaks |
| Staircase layout | Structured line breaks between thought blocks |
| Max 3-line blocks | No paragraph exceeds 3 lines |
| Max 3 emojis | Place at tension points only |
| Dash replacement | Replace dashes with full stops or commas |
| Bullet format | " - " for lists |
| Flow format | "A —> B —> C" for sequences |
| Hindi sentences | Max 3, at emotional peaks only |
| FK Grade 7 | Readability check and simplify if needed |
| CTA positioning | Positioning statement + follow prompt at end |
| Hashtags | 3–6 relevant hashtags at end |

**Emotion:** Neutral — waiting for system to process

### F.3: Generate Preview — User reviews, ~1–3 minutes

| Aspect | Detail |
|--------|--------|
| **User action** | Reviews formatted preview and stats |
| **System action** | Display formatted content in code block + quality stats |

**User sees:**
```
🖥️ FORMATTED PREVIEW

┌────────────────────────────────────────────────┐
│                                                │
│  Most PMs think SQL is "nice to have."         │
│                                                │
│  They're wrong.                                │
│                                                │
│  Last year I built a dashboard query           │
│  that saved my team 40 hours a month.          │
│                                                │
│  Not because I'm a data wizard.                │
│  Because I stopped waiting for engineers       │
│  to pull numbers I needed yesterday.           │
│                                                │
│  HERE'S WHAT CHANGED                           │
│                                                │
│  - Stakeholder meetings: came with answers     │
│  - Sprint planning: data-backed priorities     │
│  - Customer insights: self-serve exploration   │
│                                                │
│  The ROI wasn't the dashboard.                 │
│  It was the conversations it unlocked.         │
│                                                │
│  Aur sabse bada fayda?                         │
│  Engineers started trusting my specs more.      │
│                                                │
│  PMs who speak data get faster decisions.       │
│  Period.                                       │
│                                                │
│  What's one skill outside your JD              │
│  that changed how people see your work?        │
│                                                │
│  ♻️ Share if this resonates                     │
│  ➕ Follow for more PM insights                │
│                                                │
│  #ProductManagement #SQL #DataDriven           │
│  #CareerGrowth #PMLife                         │
│                                                │
└────────────────────────────────────────────────┘

📊 FORMAT STATS
  Characters: 1,089 / 1,600 max  ✅
  Emojis: 2 / 3 max              ✅
  Hindi sentences: 1 / 3 max     ✅
  Hashtags: 5                     ✅
  Line blocks: all ≤ 3 lines     ✅
  FK Grade: 6.2                   ✅
  Hook length: 47 chars           ✅ (max 210)

Options:
  1. ✅ Approve — move to Previewed
  2. ✏️ Request changes — describe adjustments
  3. ❌ Reject — revert to Drafted
```

**Emotion:** Critical eye — "Does this look right? Would I post this?"
**Pain point:** Code block preview doesn't perfectly represent LinkedIn's rendering (line spacing, mobile vs desktop)

### F.4: User Decision — ~15 seconds

| Decision | System Action | Webhook | Next Status |
|----------|---------------|---------|-------------|
| **Approve** | Save formatted_content, update status | `POST /sma-update-post` (status=Previewed) | Previewed |
| **Request changes** | Loop back to F.2 with user's feedback | (no webhook until re-approve) | Stays Formatting |
| **Reject** | Revert to Drafted status | `POST /sma-update-post` (status=Drafted) | Drafted |

**On approve:**
```
✅ Post formatted and previewed!

"Why PMs should learn SQL"
  Status: Previewed | Ready for C-ContentReview
  Formatted: 1,089 chars | 5 hashtags | FK 6.2

Next: "Review karo" to start C-ContentReview
```

**Emotion (approve):** Satisfied — "Looks professional, ready for final check"
**Emotion (changes):** Mildly frustrated — "Almost there, just a few tweaks"
**Emotion (reject):** Disappointed — "This needs a full rewrite, back to drafting"

---

## Touchpoint Map

| Touchpoint | Channel | Interaction Type |
|------------|---------|-----------------|
| Trigger formatting | ChatGPT (LinkRight HQ) | Conversational command |
| Post selection | ChatGPT | Numbered menu |
| Preview review | ChatGPT | Visual inspection of code block |
| Stats review | ChatGPT | Read quality metrics |
| Approve/reject | ChatGPT | Numbered option |

---

## Emotion Curve

```
High  ·                        ·  ← Approved (satisfied)
      ·                      ·
      ·                    ·  ← Preview looks good
Mid   ·  ·················
      ·                  ·  ← "Hmm, spacing is off" (change request)
Low   ·                ·  ← Reject — needs full redraft
```

---

## Error States & Edge Cases

| Condition | User Impact | System Response |
|-----------|-------------|-----------------|
| No Drafted posts | Cannot format | "No drafted posts to format. Run B-Drafting first?" |
| raw_content < 200 chars | Cannot format | "Draft too short ([N] chars). Return to B-Drafting to expand?" |
| Formatting pushes over 1600 chars | Needs trimming | "Formatted version is [N] chars (max 1600). Auto-trimming hashtags/spacing..." |
| Formatting drops below 800 chars | Needs expansion | "Formatted version is only [N] chars (min 800). Add content or adjust formatting?" |
| Post locked by another session | Concurrent conflict | "This post is being formatted in another session. Pick a different one?" |
| Hindi content exceeds 3 sentences | Rule violation | Auto-flag and suggest which Hindi sentences to keep |

---

## Opportunities for Dashboard

1. **Before/after diff** — Show raw vs formatted side-by-side
2. **LinkedIn preview mockup** — Render preview that looks like actual LinkedIn post card
3. **Format rule checklist** — Visual checklist showing each rule's pass/fail status
4. **Batch formatting** — "Format all drafted posts" for weekend sessions
5. **Format template presets** — Save preferred formatting styles for quick apply
