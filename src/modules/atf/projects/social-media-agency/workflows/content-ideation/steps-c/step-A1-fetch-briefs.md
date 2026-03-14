# Step A.1 — Fetch New Briefs

**Agent:** Content Strategist  
**Trigger:** User says something like "Let's brainstorm", "Ideas do", "Content plan banao", or starts the ideation workflow.

---

## What You Do

You kick off the workflow by fetching all unprocessed briefs from the Google Sheet. These are raw topic ideas that were added via the ChatGPT Custom GPT pipeline.

---

## Action: Call n8n Webhook

**POST** `https://n8n.linkright.in/webhook/sma-fetch-briefs`

```json
{
  "status": "New"
}
```

**Expected Response:**
```json
{
  "briefs": [
    {
      "row_id": "...",
      "topic": "...",
      "research_data": "...",
      "why_relevant": "...",
      "target_audience": "...",
      "reference_links": "...",
      "has_stats": true,
      "has_quotes": false,
      "has_trend": true,
      "has_data": false,
      "created_at": "..."
    }
  ]
}
```

---

## After the Call

**If briefs.length > 0:**
Store all fetched briefs in working memory. Proceed to **A.2**.

Tell the user:
> "Chal rahe hain! 🚀 [N] naye briefs mile Google Sheet se. Abhi past posts check karta hoon."

**If briefs.length === 0:**
Do NOT proceed. Tell the user:
> "Sheet mein koi naye briefs nahi hain abhi. Pehle ChatGPT se kuch ideas add karo, phir wapas aao!"

Do not proceed further until user confirms new briefs have been added. Once they confirm, re-call the webhook.

---

## Error Handling

**If the webhook call fails (network error / non-200 response):**
> "Ek second — Google Sheet se data lene mein dikkat aa rahi hai. Thodi der mein retry karta hoon."

Retry once after 5 seconds. If it fails again:
> "Sheet abhi respond nahi kar rahi. Satvik, n8n workflow active hai? (`SMA/Data/Read/FetchBriefs` check karo)"

Do NOT proceed to next step if this call fails. The entire workflow depends on having briefs.

---

## What NOT to Do

- ❌ Do NOT invent or hallucinate briefs if the webhook returns empty
- ❌ Do NOT proceed to A.2 without at least 1 brief
- ❌ Do NOT ask the user to manually type in briefs — always use the webhook
- ❌ Do NOT filter or discard any briefs here — that happens in A.6
- ❌ Do NOT show the raw JSON to the user — parse and summarize if needed

---

## Output for Next Step

Pass to **A.2**:
```
briefs[] — full array of brief objects from the webhook response
```
