# Step E.01 — Assess Formatting Issues

**Agent:** Content Strategist (Edit Mode)
**Trigger:** User wants to edit/correct a previously formatted post, or validation revealed issues that need fixing.

---

## What You Do

Load the formatted post and identify all formatting issues that need correction. This is the diagnostic step before applying edits.

---

## Actions

### 1. Load the Post
Fetch the post that needs editing:

**POST** `https://n8n.linkright.in/webhook/sma-fetch-post`

```json
{
  "post_id": "{post_id}"
}
```

If no specific post_id, fetch by status:
```json
{
  "status": "Previewed"
}
```

Present the list and let user pick which post to edit.

### 2. Load Current Formatted Content
Extract the `formatted_content` field from the post record. If it does not exist, fall back to `raw_content`.

### 3. Run Formatting Audit
Check all 12 LinkedIn v1 rules against the current content:

1. **Character count:** Is it 800-1600? If not, by how much?
2. **Rich text:** Any bold/italic/underline markers?
3. **Staircase layout:** Are there wall-of-text sections?
4. **3-line blocks:** Any blocks with 4+ consecutive lines?
5. **UPPERCASE:** Any misuse (in-line emphasis instead of headers)?
6. **Emojis:** Count and placement assessment
7. **Dashes:** Any informal dashes remaining?
8. **Bullets:** All using ` - ` format?
9. **Flow arrows:** All using `A —> B —> C` format?
10. **Hindi sentences:** Count and placement assessment
11. **Readability:** Approximate FK grade
12. **CTA:** Has positioning + follow?
13. **Hashtags:** Count and placement

### 4. Present Assessment

> **Formatting Assessment — {title}**
>
> **Issues Found: {count}**
>
> {For each issue:}
> - {Rule name}: {Description of the problem} — {Suggested fix}
>
> **No Issues Found:** (if all rules pass)
> - "Formatting looks clean. Koi specific changes chahiye?"

### 5. Ask User

> "Yeh issues fix karoon? Ya koi aur specific changes batao."

Options:
1. **Fix all issues** — Proceed to E.02 (Apply Edit) to fix everything
2. **Fix specific issues** — User specifies which to fix
3. **Custom changes** — User describes changes not in the audit
4. **Exit** — No changes needed

---

## Error Handling

**If post not found:**
> "Post nahi mila. Post ID check karo ya status confirm karo."

**If no formatted_content exists:**
> "Is post mein formatted content nahi hai — pehle F-Formatting workflow run karo."

---

## What NOT to Do
- Do NOT apply fixes in this step — only diagnose
- Do NOT change the post status
- Do NOT modify the content — this step is read-only

---

## Output for Next Step

Pass to **E.02**:
```
post — full post object
formatted_content — current formatted text
issues[] — list of identified formatting issues
user_instructions — what the user wants fixed
```
