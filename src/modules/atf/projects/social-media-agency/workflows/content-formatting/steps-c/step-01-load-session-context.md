# Step 01 — Load Session Context

**Agent:** Content Strategist
**Trigger:** User starts the formatting workflow ("Format karo", "Post format do", "Formatting shuru karo", or any equivalent).

---

## What You Do

Before any formatting work begins, load the session context. This ensures the agent has all necessary configuration and can detect interrupted sessions.

---

## Actions

### 1. Load Formatting Configuration
Load the formatting rules reference file (`formatting-rules.csv`) from the workflow's data directory. This contains the LinkedIn v1 ruleset that governs all formatting decisions.

Key rules to hold in working memory:
- Character count range: 800-1600
- Max emojis: 3
- Max Hindi sentences: 3
- Max consecutive lines before break: 3
- Hashtag range: 3-6
- FK readability target: Grade 7

### 2. Check for In-Progress Sessions
Before fetching new posts, check if there is a post with status `Formatting` — this indicates a previously interrupted session.

**POST** `https://n8n.linkright.in/webhook/sma-fetch-post`

```json
{
  "status": "Formatting"
}
```

**If a post with status `Formatting` is found:**
Proceed to **step-01b** (Resume If Interrupted).

**If no `Formatting` posts found:**
Proceed to **step-F1** (Pick Drafted Post).

---

## After the Step

Tell the user:
> "Formatting workflow shuru karte hain! Pehle check karta hoon koi pending session toh nahi hai..."

Then route to either step-01b or step-F1 based on the check above.

---

## Error Handling

**If the formatting-rules reference file is missing:**
> "Formatting rules file nahi mil raha. Default LinkedIn v1 rules use karunga — but Satvik, please check the reference data."

Proceed with hardcoded defaults (the rules are also documented in instructions.md).

**If the webhook call fails:**
> "Session check mein dikkat aa rahi hai. Thodi der mein retry karta hoon."

Retry once. If it fails again, assume no in-progress session and proceed to F.1.

---

## What NOT to Do
- Do NOT skip the session check — interrupted sessions must be detected
- Do NOT start formatting without loading the rules reference
- Do NOT show raw configuration data to the user
