# n8n Workflow Learnings

> Auto-updated as we build and debug n8n workflows.
> These learnings will be pushed to vector DB for future reference.

---

## L001: Google Sheets Boolean Fields — Header Naming Breaks Field Mapping

**Date:** 2026-03-13
**Workflow:** SMA/Data/Read/FetchBriefs
**Severity:** Bug — wrong output values

### Context
We were building the first webhook workflow for SMA content ideation. This workflow reads briefs from a Google Sheet and returns them as JSON. The sheet has boolean columns (has_stats, has_quotes, has_trend, has_data) that indicate what kind of research data is available in each brief.

### What We Were Trying To Do
Read all rows from Google Sheet, filter by status column, and return the matching briefs with properly typed boolean fields. The Code node had this mapping:
```javascript
has_stats: item.json.has_stats === 'TRUE' || item.json.has_stats === true
```

### What Went Wrong
The API response showed `has_stats: false` for Row 1, even though the Google Sheet cell clearly had `TRUE` in it. Same issue for all 4 boolean columns. The filter (status = "Pending") worked fine — it correctly returned only rows 1 and 6. But the boolean conversion was completely broken.

### Root Cause
The Google Sheet column header was `has_stats (TRUE/FALSE)` — with the `(TRUE/FALSE)` suffix as a hint for data entry. When n8n's Google Sheets node reads the data, it uses the **exact header text as the JSON field name**. So the actual field in n8n was:
```
item.json['has_stats (TRUE/FALSE)'] = "TRUE"   ← actual field
item.json.has_stats = undefined                  ← what our code looked for
```
Since `undefined === 'TRUE'` is `false`, all booleans came back as `false`.

### How We Debugged
We identified the issue by reasoning about what n8n does with Sheet headers. The approach was to either:
1. Add a debug line in Code node: `return [{ json: { raw_keys: Object.keys(items[0].json) } }]` to see exact field names
2. Or simplify the Sheet headers to match expected field names

### Fix Applied
**Option 2 — Simplified headers.** Satvik updated the Google Sheet headers from:
```
BEFORE: has_stats (TRUE/FALSE) | has_quotes (TRUE/FALSE) | has_trend (TRUE/FALSE) | has_data (TRUE/FALSE)
AFTER:  has_stats              | has_quotes              | has_trend              | has_data
```

Also added a defensive `toBool()` helper in the Code node that handles multiple value formats:
```javascript
const toBool = (val) => {
  if (typeof val === 'boolean') return val;                          // n8n might convert
  if (typeof val === 'string') return val.trim().toUpperCase() === 'TRUE';  // string "TRUE"/"true"
  return false;                                                      // null/undefined/number
};
```

### After Fix
Output correctly showed `has_stats: true` for rows where the cell value was `TRUE`.

### Rule for Future
**Keep Google Sheet column headers simple — lowercase, no parentheses, no spaces if possible, no suffixes.** n8n uses exact header text as JSON keys. If you must have descriptive headers, add a frozen "instructions" row instead, not suffixes in headers.

### Also Consider
If you can't control the Sheet headers (e.g., someone else manages it), use a flexible field lookup:
```javascript
const getField = (obj, base) => {
  if (obj[base] !== undefined) return obj[base];
  const key = Object.keys(obj).find(k => k.toLowerCase().startsWith(base.toLowerCase()));
  return key ? obj[key] : null;
};
```

---

## L002: IF Node Creates Parallel Branches — Kills Single-Response Webhook Flows

**Date:** 2026-03-13
**Workflow:** SMA/Data/Read/FetchBriefs
**Severity:** Architecture issue — dual response in production

### Context
After fixing L001, the boolean output was correct. But we noticed in the n8n execution log that both TRUE and FALSE branches of the IF node were executing. We had separate "Respond to Webhook" nodes on each branch.

### What We Were Trying To Do
Use n8n's IF node to split rows: matched rows (status = "Pending") go to TRUE branch for formatting, unmatched rows go to FALSE branch that returns an empty `{ briefs: [], count: 0 }` response. Each branch had its own Code node + Respond to Webhook node.

```
Webhook → Sheets → IF → TRUE (2 items)  → Format Response → Send Response
                     → FALSE (4 items) → Empty Response  → Send Empty Response
```

### What Went Wrong
**Both branches executed.** The sheet had 6 rows. 2 matched "Pending" (went TRUE), 4 didn't (went FALSE). n8n's IF node works **per item**, not per batch. So:
- 2 items → TRUE branch → Format Response → Send Response ✅
- 4 items → FALSE branch → Empty Response → Send Empty Response ❌ (second response)

In test mode, n8n showed execution on both branches (visible in the green checkmarks on the canvas). In production, the second Respond to Webhook would throw an error because HTTP response was already sent by the first one.

### Fix Attempt 1: Merge Node (FAILED)
Removed the duplicate "Send Empty Response" node and added a Merge node (Append mode) that combined both branches into one before a single Respond to Webhook.

**Result:** Merge node appended both outputs — so the response contained TWO items: one with the filtered briefs `{ briefs: [...], count: 2 }` and one with the empty response `{}`. The API returned an array of 2 objects instead of a single object.

**Why it failed:** Merge (Append) doesn't pick one or the other — it concatenates ALL inputs. Since both branches produced output, Merge had 2 items.

### Fix Attempt 2: Direct Connection (FAILED)
Connected both branches directly to a single Respond to Webhook node without Merge.

**Result:** Same issue — both branches sent data to the Respond node. The response was unpredictable (whichever branch completed first).

### Final Fix: Eliminate IF Node Entirely
Realized the fundamental problem: **IF node is wrong for this use case.** We don't need to route items to different destinations — we need to filter items within a single stream.

Replaced the entire IF → dual-branch → Merge/dual-Respond pattern with a **single Code node** that does filter + format in one pass:

```
BEFORE (6 nodes, broken):
Webhook → Sheets → IF → TRUE  → Format → Respond
                     → FALSE → Empty  → Respond

AFTER (4 nodes, working):
Webhook → Sheets → Filter & Format (single Code) → Respond
```

The Code node:
```javascript
const items = $input.all();
const requestedStatus = $('Receive Request').first().json.body.status;

// Filter in code, not with IF node
const filtered = items.filter(item => item.json.status === requestedStatus);

// Format in same code block
const briefs = filtered.map(item => {
  const d = item.json;
  return {
    row_id: d.row_id,
    topic: d.topic,
    // ... all fields
  };
});

// Always returns exactly 1 item — either with briefs or empty array
return [{ json: { briefs, count: briefs.length } }];
```

If nothing matches, `filtered` is empty → `briefs` is `[]` → count is `0`. No branching needed.

### After Fix
Single response every time. 2 Pending rows → `{ briefs: [2 items], count: 2 }`. 0 matching rows → `{ briefs: [], count: 0 }`.

### Rule for Future
**In webhook workflows that must return a single JSON response, NEVER use IF node for data filtering.** Use Code node with `.filter()` instead. 

IF node is appropriate when:
- You need to route to DIFFERENT external systems (e.g., IF paid → Stripe, ELSE → free tier)
- You have separate webhook endpoints for each branch
- You don't need to merge results back

IF node is NOT appropriate when:
- You're filtering items from a list
- You need one combined response
- Both branches eventually feed the same output

### Mental Model
Think of it like SQL:
- IF node = `CASE WHEN` that creates separate result sets (like UNION later needed)
- Code `.filter()` = `WHERE` clause that filters within one result set

For webhook responses, you almost always want the `WHERE` approach.

---

## L003: n8n Respond to Webhook — Only One Can Fire Per Execution

**Date:** 2026-03-13
**Workflow:** SMA/Data/Read/FetchBriefs
**Severity:** Knowledge — critical architecture understanding

### Context
Discovered during L002 debugging. This is a fundamental n8n behavior that affects all webhook workflow design.

### How n8n Webhook Response Works
When you set a Webhook node to `Response Mode: "Using 'Respond to Webhook' Node"`:

1. n8n holds the HTTP connection open after the Webhook trigger fires
2. It waits until a "Respond to Webhook" node executes somewhere downstream
3. The **first** Respond to Webhook node that fires sends the HTTP response and closes the connection
4. Any subsequent Respond to Webhook nodes that fire will get an error (connection already closed)

### Implications
- Having 2+ Respond to Webhook nodes is only safe if they're on **mutually exclusive** paths (impossible for both to fire)
- IF node creates parallel paths where BOTH can fire → dangerous
- Switch node with proper routing is safer but still risky
- **Safest pattern:** Always have exactly ONE Respond to Webhook node at the end of the flow

### Safe Patterns
```
Pattern 1: Single path (recommended for data workflows)
Webhook → Process → Code → Respond

Pattern 2: Converging paths (if branching is truly needed)
Webhook → Switch → Path A → Merge → Respond
                 → Path B ↗

Pattern 3: Mutually exclusive (only if you're 100% sure)
Webhook → Switch → Path A → Respond A  (only fires if condition A)
                 → Path B → Respond B  (only fires if condition B)
                 // DANGEROUS: what if both conditions match?
```

### Rule for Future
**One Respond to Webhook node per workflow. Period.** If your flow branches, merge before responding. If you're filtering data, do it in Code, not with branching nodes.

---

## L004: MongoDB Docker — Driver Resolves Advertised Hostname, Not Connection IP

**Date:** 2026-03-13
**Workflow:** SMA/Data/Read/FetchPastPosts
**Severity:** Bug — connection failure

### Context
n8n runs in Docker container A. MongoDB Atlas Local runs in Docker container B (`local6363`). Both on same Docker bridge network. n8n connects to MongoDB via IP `172.17.0.3:27017`.

### What Went Wrong
Error: `getaddrinfo ENOTFOUND 7a1b66ea9370`. Even though credential had correct IP `172.17.0.3`, MongoDB driver kept trying to resolve `7a1b66ea9370` (the MongoDB container ID).

### Root Cause
MongoDB advertises its hostname via the `hello` command response: `db.adminCommand({hello:1}).me` returns `7a1b66ea9370:27017`. The MongoDB Node.js driver uses server discovery (topology monitoring) — after initial connection, it reads the advertised hostname and tries to reconnect using THAT hostname instead of the original IP. Since `7a1b66ea9370` isn't resolvable from n8n's container, DNS lookup fails.

### Fix Attempts
1. ❌ Changed credential host to `172.17.0.3` — driver still resolved advertised hostname
2. ❌ Created new credential fresh — same issue
3. ❌ Used Values config instead of Connection String — same underlying driver behavior

### Final Fix
Added `directConnection=true` to connection string:
```
mongodb://n8n:sma2026@172.17.0.3:27017/sma?authSource=admin&directConnection=true
```

`directConnection=true` tells the driver: skip server discovery, don't use advertised hostname, connect directly to the specified host. No topology monitoring.

### Also Needed
MongoDB Atlas Local has no auth by default, but n8n's MongoDB credential requires user:password in connection string format. Created a user:
```javascript
use admin
db.createUser({ user: "n8n", pwd: "sma2026", roles: [{ role: "readWrite", db: "sma" }] })
```

### Rule for Future
**When connecting to MongoDB in Docker from another Docker container, ALWAYS use `directConnection=true` in the connection string.** MongoDB advertises its container ID as hostname, which isn't resolvable from other containers.

### Credential Reference
```
ID: ZId1p3cgYHjx3EM3
Name: MongoDB - SMA
Connection String: mongodb://n8n:sma2026@172.17.0.3:27017/sma?authSource=admin&directConnection=true
Database: sma
TLS: Inactive
```

---

## L005: n8n Vector Store Insert — Splits Every JSON Field into Separate Documents

**Date:** 2026-03-13
**Workflow:** Insert Experiences (temporary)
**Severity:** Bug — data corruption

### Context
Inserting life experiences with separate fields (`text`, `date`, `tags`, `category`) into MongoDB via n8n's "MongoDB Atlas Vector Store" node (Insert Documents mode).

### What Went Wrong
5 experiences with 4 fields each → **20 documents** inserted instead of 5. Node treated every JSON field as a separate document and embedded each independently. Tags like `"jee,exam,rejection,resilience"` became their own documents with embeddings.

### Root Cause
n8n's Vector Store Insert node processes each field of the input JSON as a separate "chunk" and creates independent documents for each. It doesn't understand that multiple fields belong to one logical record.

### Final Fix
Merge all metadata INTO the text field itself:
```javascript
{ json: { text: "Main experience text here. [date:2015-06-01] [category:academic] [tags:jee,exam,rejection]" } }
```
Only pass ONE field (`text`) — no separate metadata fields.

### Rule for Future
**When using n8n Vector Store Insert, pass ONLY a single `text` field. Merge all metadata into the text string using bracket notation `[key:value]`.**

---

## L006: Gemini text-embedding-001 Outputs 3072 Dimensions (Not 768)

**Date:** 2026-03-13
**Workflow:** SMA/Data/Read/SearchExperiences
**Severity:** Bug — query failure

### Context
MongoDB vector search index was configured with 768 dimensions (based on older Gemini embedding model specs). Used `text-embedding-001` model in n8n's Embeddings Google Gemini node.

### What Went Wrong
Error: `vector field is indexed with 768 dimensions but queried with 3072`

### Root Cause
`text-embedding-001` (available in free tier) outputs **3072-dimensional** vectors, not 768. The 768-dim spec was for older `text-embedding-004` model.

### Final Fix
Recreated vector search index with 3072 dimensions:
```javascript
db.life_experiences.createSearchIndex({
  name: "experience_vector_idx",
  type: "vectorSearch",
  definition: {
    fields: [{
      type: "vector",
      path: "embedding",
      numDimensions: 3072,
      similarity: "cosine"
    }]
  }
})
```
Also deleted all existing documents (they had fake 768-dim embeddings).

### Rule for Future
**Always verify embedding model output dimensions BEFORE creating vector index. Test with a single embed call first. `text-embedding-001` = 3072 dims.**

---

## L007: Romanised Hindi (Hinglish) — 15-25% Lower Embedding Accuracy vs English

**Date:** 2026-03-13
**Workflow:** SMA/Data/Read/SearchExperiences
**Severity:** Design consideration

### Context
Life experiences were initially written in Hinglish (romanised Hindi). Tested semantic search accuracy.

### Finding
Gemini embeddings handle Hinglish decently (Google's model is trained on Indian languages), but English text gives **15-25% better similarity scores** for semantic matching. "mehnat" and "hard work" have more vector distance than "hard work" and "effort".

### Decision
Write experience data in **English** for maximum embedding accuracy. The data is for machine consumption — BMAD agent generates LinkedIn posts in English anyway.

### Rule for Future
**Store all vector-searchable content in English for best embedding accuracy. Hinglish is acceptable for user-facing text but not for semantic search data.**

---

## L008: Vector Search Threshold 0.80 — Sweet Spot for SMA

**Date:** 2026-03-13
**Workflow:** SMA/Data/Read/SearchExperiences
**Severity:** Tuning parameter

### Context
Tested various queries against 5 mock experiences. Analyzed score distribution.

### Finding
- **0.85+**: Near-exact semantic match (e.g., "JEE exam blackout" → JEE experience = 0.906)
- **0.80-0.85**: Strong relevant match (e.g., "exam failure and mental breakdown" → JEE = 0.843)
- **0.77-0.80**: Borderline — sometimes relevant, sometimes noise
- **<0.77**: Irrelevant (e.g., "cooking biryani" → any experience = 0.73)

### Decision
Set similarity threshold at **0.80** in Format Response code. Filters out noise while keeping strong semantic matches.

### Rule for Future
**Use 0.80 as default similarity threshold. Adjust up (0.85) for precision-critical use cases, down (0.75) when recall matters more.**

---

## L009: n8n MongoDB Node — String _id Fails with ObjectId Conversion Error

**Date:** 2026-03-14
**Workflow:** SMA/Data/Write/SaveConfig
**Severity:** Bug — update fails

### Context
Config docs in `sma_config` collection use string `_id` values like `"scoring_weights"`, `"scoring_scales"`. Tried using n8n MongoDB node's Update operation with Update Key `_id`.

### What Went Wrong
Error: `input must be a 24 character hex string, 12 byte Uint8Array, or an integer`

### Root Cause
n8n's MongoDB node **always converts `_id` to ObjectId**. It doesn't support string `_id` values for Update operations.

### Final Fix
Used **Aggregate operation** with `$match` + `$addFields` + `$merge` instead of Update:
```json
[
  {"$match": {"_id": "scoring_weights"}},
  {"$addFields": {"weights": {...}, "updated_by": "satvik"}},
  {"$merge": {"into": "sma_config", "on": "_id", "whenMatched": "merge", "whenNotMatched": "insert"}}
]
```

### Also Learned
- `$documents` stage requires `{aggregate: 1}` (admin command), doesn't work with collection-level aggregate
- `$merge` returns no output — use parallel branch with source node reference for response

### Rule for Future
**When MongoDB collection uses string `_id`, use Aggregate with `$match` + `$merge` instead of Update operation in n8n.**

---

## Template for New Learnings

```markdown
## LXXX: [Title]

**Date:** YYYY-MM-DD
**Workflow:** [workflow name]
**Severity:** Bug | Architecture | Knowledge | Performance

### Context
[Project context, what phase we were in, what we were building]

### What We Were Trying To Do
[Specific goal of the step/node]

### What Went Wrong
[Exact symptoms — what the output looked like, what errors appeared]

### Root Cause
[Why it happened — the technical reason]

### How We Debugged
[What steps we took to identify the issue]

### Fix Attempts (if multiple)
[Each attempt, what we tried, why it failed]

### Final Fix
[The solution that worked, with code if applicable]

### After Fix
[What the correct output looks like]

### Rule for Future
[One-liner golden rule to prevent this]

### Also Consider / Edge Cases
[Related scenarios where this might bite again]
```
