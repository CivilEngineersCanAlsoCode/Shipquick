# Step B.3 — Refine (Iterative Loop)

**Agent:** Content Strategist
**Runs After:** B.2 (first draft presented to user)

---

## What You Do

You take the user's feedback on the draft and iterate. This is a collaborative refinement loop — the user reviews, gives feedback, and you apply changes. Max 3 iterations before suggesting finalization, hard cap at 5.

---

## PART 1: Process User Feedback

Listen for feedback and categorize it:

### Structural Changes

| User Says | Action |
|-----------|--------|
| "Hook change kar" / "opening badal" | Rewrite first 2 lines using a different hook type from curated list |
| "Shorter kar" / "trim karo" | Trim while keeping core message. Remove weakest paragraph first |
| "Longer kar" / "aur likho" | Expand specific sections — ask which part to expand if unclear |
| "CTA badal" / "ending change" | Different engagement prompt from curated CTA list |
| "Hashtags change kar" | Generate different set of 3-6 relevant hashtags |
| "Structure badal do" | Restructure using a different content format (e.g., story → listicle) |

### Content Changes

| User Says | Action |
|-----------|--------|
| "Meri [X] wali story add kar" | Weave in specific experience — may need vector search if not in context |
| "Stats add kar" / "data daalo" | Pull from research brief (B.2.a data) |
| "Ye part hata do" / "remove [section]" | Remove specified section, adjust flow |
| "Personal touch aur chahiye" | More first-person narrative, deeper vulnerability |
| "Ye fact galat hai" | Remove/correct the fact immediately |

### Tone Changes

| User Says | Action |
|-----------|--------|
| "Too formal" / "bahut formal" | More casual, add observational humor |
| "Too casual" / "thoda professional" | Tighten language, remove slang |
| "More witty" / "mazaak daalo" | Clever observations, wordplay |
| "More emotional" / "dil se likho" | Deeper personal reflection, vulnerability |
| "Tone theek hai" | Keep tone, apply other changes only |

### Format Changes

| User Says | Action |
|-----------|--------|
| "Listicle bana do" | Restructure as numbered list |
| "Story format mein likh" | Narrative structure with arc |
| "Data-driven bana" | Lead with stats, support with story |

---

## PART 2: Apply Changes & Show Updated Draft

After applying feedback, show the updated draft:

> "Draft v[N]:
>
> ```
> [Full updated post text]
> ```
>
> ---
> Changes:
> - [What changed, e.g., 'Hook rewritten: Question → Bold Statement']
> - [e.g., 'Trimmed body by 120 chars']
>
> Stats:
> - Characters: [char_count] (target: 800-1600)
> - Words: [word_count]
> - Iteration: [N] of 3
>
> Better? Aur kuch?"

---

## PART 3: Quality Checks (run after each iteration)

After every revision, silently check these and flag ONLY if they fail:

### Character Count Check
- Below 800 chars → Warn: "Post thoda chhota hai ([count] chars). 800+ better perform karta hai LinkedIn pe. Expand karun?"
- Above 1600 chars → Warn: "Post lamba ho gaya ([count] chars). 1600 se neeche laana chahiye. Trim karun?"
- 800-1600 → Good, no warning needed

### Readability Check (FK Grade)
- Estimate Flesch-Kincaid grade level of the draft
- Target: Grade 7 (easy to read)
- Above Grade 9 → Warn: "Readability thodi heavy hai. Sentences chhotay karun? Simpler words use karun?"
- Do NOT block on this — just inform

### First 2 Lines Check
- Are the first 2 lines (hook) within ~210 chars? They must fit in the LinkedIn feed preview
- If over 210 chars → Warn: "Hook 210 chars se zyada hai — feed mein cut ho jayega. Trim karun?"

---

## PART 4: Iteration Management

### After Each Iteration
Track iteration count. Increment after each round of feedback.

### After 3 Iterations
> "3 rounds ho gaye — ye version kaafi solid hai. Finalize karein ya aur refinement chahiye?"

If user wants more → allow up to 5 total.

### After 5 Iterations (hard cap)
> "5 iterations ho gayi. Best version pick karo:
> - v1: [first 50 chars of v1]...
> - v2: [first 50 chars of v2]...
> - v3: [first 50 chars of v3]...
> - v4: [first 50 chars of v4]...
> - v5: [first 50 chars of v5]...
>
> Konsa version final hai?"

User picks a version number → proceed to B.4 with that version.

---

## PART 5: User Decision

### Approval Signals
User says "done" / "perfect" / "ship it" / "good" / "final" / "theek hai" / "approved" / "chalega"

→ One final confirmation:
> "Ye final hai? Confirm kar toh save karta hoon."

User confirms → proceed to **B.4**

### Other Decisions

**"Scrap it" / "delete karo" / "nahi chahiye":**
> "Draft discard kar diya. Wapas B.1 pe jaayein naya post pick karne?"
→ Discard all draft state → back to **B.1**

**"Save as draft, baad mein" / "incomplete save karo" / "baad mein":**
Save incomplete draft to MongoDB with status `Drafting` (not `Drafted`):

**POST** `https://n8n.linkright.in/webhook/sma-update-post`

```json
{
  "post_id": "[selected_post._id]",
  "updates": {
    "content": "[current draft text]",
    "status": "Drafting",
    "draft_metadata": {
      "word_count": 0,
      "char_count": 0,
      "iterations": "[current iteration]",
      "incomplete": true
    },
    "updated_at": "[ISO timestamp]"
  }
}
```

> "Incomplete draft save ho gaya (status: Drafting). Jab continue karna ho toh 'draft karo' bolo — ye post wapas pick ho jayega."

→ Exit workflow

---

## Error Handling

**If sma-update-post fails (save as draft):**
> "Draft save nahi ho paya. Content copy kar lo manually:
> ```
> [draft text]
> ```
> Baad mein retry karna."

Do NOT lose the draft text — always show it to user if save fails.

---

## What NOT to Do

- Do NOT apply changes the user didn't ask for — if they say "hook change kar", only change the hook
- Do NOT over-polish and lose the user's voice — keep it authentic
- Do NOT add formatting rules here (staircase, UPPERCASE, etc.) — that's F-ContentFormatting
- Do NOT block on quality check warnings — inform, suggest, but proceed if user overrides
- Do NOT force the user to iterate if they're happy with v1 — "done" at any point is valid
- Do NOT lose previous versions — keep all versions in memory for the v1-v5 comparison
- Do NOT auto-save without user saying "done" or "save as draft"
- Do NOT show quality warnings that passed — only flag failures

---

## Output for Next Step

Pass to **B.4**:
```
selected_post       — original post object (from B.1)
final_draft         — user-approved draft text
draft_metadata      — { char_count, word_count, hook_type, cta_type, format, tone, positioning,
                        hashtags[], experiences_used: [_id], engagement_inspiration: [post_id],
                        iterations: N }
```
