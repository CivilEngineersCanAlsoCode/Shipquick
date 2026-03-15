# B-ContentDrafting — Error Handling

## Severity Levels

| Level | Meaning | Agent Action |
|-------|---------|-------------|
| **BLOCKING** | Workflow cannot proceed | Retry once → if still fails, halt and escalate to user |
| **DEGRADED** | Workflow continues with reduced quality | Log, warn user, proceed with fallback |
| **COSMETIC** | Minor issue, no impact on draft | Log silently, continue |

---

## 1. Webhook Failures

### 1.1 sma-fetch-post (B.1) — BLOCKING

**Trigger:** Network error, non-200 response, or timeout when fetching the earliest `Scheduled_NoDraft` post.

**Why blocking:** The entire workflow depends on having a post selected. No post = nothing to draft.

**Recovery:**
1. Retry once after 5 seconds.
2. If retry fails:
   - Message: "sma-fetch-post webhook respond nahi kar raha. Satvik, n8n workflow active hai? (`SMA/Data/Read/FetchPostById` check karo)"
   - Do NOT proceed to B.2.
   - Offer: "Retry karun ya exit?"

**Edge cases:**
- `posts: []` (empty array) is NOT an error — it means no undrafted posts exist. Suggest running A-ContentIdeation.
- Response with malformed JSON → treat as webhook failure, retry.

---

### 1.2 sma-fetch-briefs (B.2.a) — DEGRADED

**Trigger:** Failure when fetching original brief research data via `source_brief_id`.

**Why degraded:** Brief data provides stats, trends, and reference links. Without it, the draft relies more on experiences and user context — still viable but less data-rich.

**Recovery:**
1. Log the failure.
2. Continue to B.2.b and B.2.c.
3. Note internally: `brief_data = null`.
4. Do NOT warn user unless ALL three context calls fail (see §1.7).

**Edge case:** `source_brief_id` is null/missing → skip the call entirely (not an error).

---

### 1.3 sma-search-experiences (B.2.b) — DEGRADED

**Trigger:** Failure during deep experience vector search.

**Why degraded:** Experiences add personal stories to the draft. Fallback: use `linked_experiences[]` from the post object (attached during ideation).

**Recovery:**
1. Log the failure.
2. Use `selected_post.linked_experiences[]` as the experience pool.
3. If `linked_experiences` is also empty:
   - Warn user: "Experience search kaam nahi kari aur koi linked experience bhi nahi hai. Draft mein personal story kamzor hogi — koi story share karna chahoge?"
4. Continue to B.2.c.

---

### 1.4 sma-fetch-past-posts (B.2.c) — DEGRADED

**Trigger:** Failure when fetching top 5 performing posts for tone reference.

**Why degraded:** Top posts provide engagement data and tone calibration. Without them, AI uses default Satvik voice guidelines.

**Recovery:**
1. Log the failure.
2. Continue framework loading (B.2.d).
3. During curation (PHASE 2), skip "top post alignment" criterion — curate using pillar match, engagement level, and topic fit only.

---

### 1.5 sma-search-experiences — Duplicate Check (B.2.f) — DEGRADED

**Trigger:** Failure during duplicate detection vector search when user shares a new experience.

**Why degraded:** Cannot determine if the experience is a duplicate. Risk: saving a duplicate.

**Recovery:**
1. Skip the save to avoid duplicates.
2. Keep the experience text in working context for draft generation.
3. Message: "Duplicate check nahi ho paya — experience save nahi karunga abhi, lekin draft mein use karunga."

---

### 1.6 sma-save-experience (B.2.f) — DEGRADED

**Trigger:** Failure when saving a confirmed-new user experience to MongoDB.

**Why degraded:** The experience text is still available in context for draft generation. Only the persistent save is lost.

**Recovery:**
1. Log the failure.
2. Message: "Experience save nahi ho payi, lekin draft mein use karunga. Baad mein manually save karna padega."
3. Continue to PHASE 5 (draft generation).

---

### 1.7 All Three Context Calls Fail (B.2.a + B.2.b + B.2.c) — DEGRADED (severe)

**Trigger:** sma-fetch-briefs, sma-search-experiences, AND sma-fetch-past-posts all fail.

**Recovery:**
1. Warn user: "Context gathering mein issues aaye — brief, experiences, aur top posts koi bhi load nahi hua. Basic draft bana raha hoon post metadata + frameworks se. Baad mein refine karenge."
2. Generate draft using:
   - Post metadata: title, content_pillar, additional_context
   - Framework CSVs (local, unaffected by webhook failures)
   - User-provided context (if any)
3. Proceed normally to B.3 for refinement.

---

### 1.8 sma-update-post — Save as Draft (B.3) — BLOCKING (for save)

**Trigger:** User says "save as draft, baad mein" but the save-as-draft webhook call fails.

**Recovery:**
1. Retry once after 5 seconds.
2. If retry fails:
   - Show full draft text in a code block for manual copy.
   - Message: "Draft save nahi ho paya. Content copy kar lo manually: [code block]. Baad mein retry karna."
   - Do NOT lose the draft text under any circumstances.

---

### 1.9 sma-update-post — Final Save (B.4.a) — BLOCKING

**Trigger:** Failure when saving the finalized, user-approved draft to MongoDB with status `Drafted`.

**Why blocking:** MongoDB is the source of truth. Without a successful save, the post doesn't exist in the system as drafted.

**Recovery:**
1. Retry once after 5 seconds.
2. If retry fails:
   - Show full draft text in code block for manual copy.
   - Message: "Save fail ho gaya. Draft text copy kar lo: [code block]. Satvik, `SMA/Data/Write/UpdatePost` n8n workflow check karo. Draft manually save karna padega."
   - Do NOT proceed to B.4.b (sheet update). Do NOT present "next actions."

---

### 1.10 sma-update-sheet-status (B.4.b) — COSMETIC

**Trigger:** Failure when updating Google Sheet brief status to `Drafted`.

**Why cosmetic:** MongoDB already has the draft saved (B.4.a succeeded). Sheet is a secondary view.

**Recovery:**
1. Message: "Sheet update nahi ho payi, lekin MongoDB mein draft save ho chuka hai. Sheet manually update karna — row [source_brief_id] ka status 'Drafted' karo."
2. Continue to PART 3 (next actions) normally.

**Edge case:** `source_brief_id` is null → skip the call entirely (not an error).

---

## 2. Framework CSV Loading Failures

### 2.1 Individual CSV Missing or Unreadable — DEGRADED

**Trigger:** One or more of the 8 framework CSVs cannot be read from `frameworks/` directory.

**Affected files:** content-formats.csv, hook-frameworks.csv, narrative-frameworks.csv, cta-frameworks.csv, tone-frameworks.csv, positioning-templates.csv, formatting-rules.csv, content-methods.csv.

**Recovery per file:**

| Missing CSV | Fallback |
|------------|----------|
| content-formats.csv | Use generic formats: Story-to-Insight, Listicle, Hot-Take |
| hook-frameworks.csv | Use generic hooks: Question, Bold Statement, Counter-Intuitive |
| narrative-frameworks.csv | Use generic: AIDA, Problem-Solution, Hero Journey |
| cta-frameworks.csv | Use generic: Open Question, Reflection, Poll |
| tone-frameworks.csv | Use generic: Casual-Witty, Reflective, Motivational |
| positioning-templates.csv | Use default: "PM by day. Builder by night." |
| formatting-rules.csv | Use hardcoded rules from CONTEXT.md §Formatting Rules |
| content-methods.csv | Skip content method selection, proceed with other frameworks |

1. Log which CSV failed.
2. Warn user: "[file] load nahi ho paya — generic options use kar raha hoon."
3. Present generic options in the curation step for that category.
4. Never invent framework names that don't exist — use only the documented generics above.

### 2.2 All CSVs Missing — BLOCKING

**Trigger:** No framework CSVs can be read (directory missing, permissions issue, etc.).

**Recovery:**
1. Message: "Framework CSVs load nahi ho rahe. Path check karo: `src/modules/atf/projects/social-media-agency/frameworks/`. Kya files wahan hain?"
2. Do NOT proceed to draft generation without frameworks — the selection step is a core part of the workflow.
3. Offer: "Generic frameworks se draft likhun? (Quality lower hogi)"
4. If user agrees → use all generic fallbacks from §2.1 table and proceed.

### 2.3 CSV Parse Error — DEGRADED

**Trigger:** CSV file exists but has malformed rows, missing headers, or encoding issues.

**Recovery:**
1. Skip malformed rows, use parseable entries.
2. If fewer than 3 entries are parseable → use generic fallback for that category.
3. Log which file had parse errors for debugging.

---

## 3. Draft Generation Failures

### 3.1 AI Timeout / Context Window Exceeded — BLOCKING

**Trigger:** Draft generation takes too long or the gathered context exceeds the model's processing capacity.

**Recovery:**
1. Reduce context:
   - Drop top-posts tone reference (least critical).
   - Limit experiences to top 2 by similarity.
   - Use only the selected framework descriptions, not full CSV data.
2. Retry draft generation with reduced context.
3. If still fails: "Draft generation mein issue aa rahi hai. Context reduce karke try kar raha hoon..."
4. If second attempt fails: ask user to provide a simpler brief or reduce the scope.

### 3.2 Empty Output / No Draft Generated — BLOCKING

**Trigger:** Draft generation produces empty string, whitespace-only output, or null.

**Recovery:**
1. Retry generation once with the same inputs.
2. If retry produces empty output:
   - Message: "Draft generate nahi ho paya — empty output aaya. Ek aur try context reduce karke..."
   - Reduce context per §3.1 step 1 and retry.
3. If third attempt also empty: escalate to user — "Draft generation kaam nahi kar rahi. Manually likh ke start karein? Main refine kar dunga."

### 3.3 Wrong Language in Output — DEGRADED

**Trigger:** Draft contains non-English text (Hindi script, other languages) when the v1 constraint requires English only.

**Detection:** Check for Devanagari unicode range (U+0900–U+097F) or other non-ASCII script blocks in the generated draft.

**Recovery:**
1. Regenerate the draft with reinforced language constraint: "English only, no Hindi script."
2. Romanized Hindi phrases (like "yaar", "bhai") are acceptable — only block Devanagari script.
3. If the user's input was in Hindi → translate intent to English for the draft, keep the user interaction in whatever language they prefer.

### 3.4 Draft Violates Character Limits — DEGRADED

**Trigger:** Generated draft is below 800 or above 1600 ASCII characters.

**Recovery:**
- This is handled in B.3 quality checks, not here.
- During initial generation, aim for 1000–1400 chars (sweet spot within the range).
- If first draft is wildly off (< 400 or > 2500 chars), regenerate once before showing to user.

---

## 4. Iteration Limit Exceeded (B.3)

### 4.1 Soft Cap Reached (3 iterations)

**Trigger:** User has requested 3 rounds of refinement.

**Recovery:**
1. Message: "3 rounds ho gaye — ye version kaafi solid hai. Finalize karein ya aur refinement chahiye?"
2. If user wants more → allow up to 5.
3. Do NOT force finalization — user choice.

### 4.2 Hard Cap Reached (5 iterations)

**Trigger:** User has requested 5 rounds of refinement.

**Recovery:**
1. Present all 5 versions with first 50 chars each.
2. Message: "5 iterations ho gayi. Best version pick karo: [v1–v5 list]. Konsa version final hai?"
3. User MUST pick a version — no more iterations.
4. If user says "none of these" → offer: "Scrap karein aur naye post se start karein? (B.1)"

### 4.3 Iteration State Lost — BLOCKING

**Trigger:** Previous draft versions are no longer in memory (context overflow, session interrupt).

**Recovery:**
1. Check if any version was saved as incomplete draft (status: `Drafting`) via sma-fetch-post.
2. If found → resume from that version.
3. If not found → present whatever draft version is currently available.
4. Message: "Pichle versions memory se nikal gaye. Current version se continue karein?"

---

## 5. Save Failures

### 5.1 MongoDB Save Failure (B.4.a) — BLOCKING

See §1.9 for full details. Summary:
- Retry once → show draft text for manual copy → halt workflow.
- NEVER proceed to sheet update if MongoDB save fails.

### 5.2 Google Sheet Update Failure (B.4.b) — COSMETIC

See §1.10 for full details. Summary:
- Warn user → provide manual instructions → continue to next actions.

### 5.3 Save-as-Draft Failure (B.3 incomplete save) — BLOCKING (for save)

See §1.8 for full details. Summary:
- Retry once → show draft text for manual copy → exit workflow.

---

## 6. Error Escalation Matrix

| Error Count | Action |
|-------------|--------|
| 1 webhook fails | Log, apply fallback per above |
| 2 webhooks fail | Warn user: "n8n mein kuch issues lag rahe hain" |
| 3+ webhooks fail | Suggest: "n8n health check karo — multiple webhooks fail ho rahe hain. `https://n8n.linkright.in` accessible hai?" |
| Any BLOCKING error | Halt workflow, show all available data to user, suggest manual steps |

## 7. Data Integrity Rules

1. **Never lose draft text** — if any save fails, always show the full text in a code block for manual copy.
2. **Never invent data** — if a webhook returns empty, say so. Don't hallucinate posts, experiences, or framework entries.
3. **Never skip status transitions** — `Scheduled_NoDraft` → `Drafting` (incomplete) → `Drafted` (final). No jumping.
4. **MongoDB is source of truth** — if MongoDB and Sheet disagree, MongoDB wins.
5. **Idempotent reads are safe to retry** — fetch-post, fetch-briefs, search-experiences, fetch-past-posts can all be retried without side effects.
6. **Writes need caution** — save-experience and update-post are NOT idempotent. Check before retrying to avoid duplicates.
