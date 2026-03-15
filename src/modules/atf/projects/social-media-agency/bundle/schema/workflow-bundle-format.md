# Workflow Bundle Format

Specification for combining workflow source files (instructions, steps, checklists, templates, validation) into a single HTML5 bundle.

## Source Files

A workflow bundle combines these source files into one HTML document:

| Source | Maps To | Article `data-part` / `data-step` |
|---|---|---|
| `config.yaml` (workflow section) | Configuration block | `data-part="config"` |
| `instructions.md` | Agent instructions | `data-part="instructions"` |
| Step files (`01.md`, `A1.md`, etc.) | Individual step articles | `data-step="01"`, `data-step="A1"` |
| `checklist.md` | Quality checklist | `data-part="checklist"` |
| `templates/*.md` | Output templates | `data-part="template"` |
| `validation/*.md` | Validation protocols | `data-part="validation"` |
| `edit-assess.md` | Edit assessment rules | `data-part="edit-assess"` |
| `edit-apply.md` | Edit execution rules | `data-part="edit-apply"` |

## Document Layout

```
<header>
  h1: "Workflow {CODE} — {NAME}"
  p: Module, Code, Step count, Status

<section data-type="workflow" data-code="{CODE}">

  <article data-part="config">         ← YAML config rendered as code block
  <article data-part="instructions">   ← Full instructions with h3/h4 subsections
  <article data-step="01">             ← Setup step
  <article data-step="01b">            ← Resume step (optional)
  <article data-step="A1">             ← First workflow step
  <article data-step="A2">             ← ...continuing in order
  ...
  <article data-step="A8">             ← Final workflow step
  <article data-part="checklist">      ← Quality checklist
  <article data-part="template">       ← Output template
  <article data-part="validation">     ← Validation protocol
  <article data-part="edit-assess">    ← Edit assessment
  <article data-part="edit-apply">     ← Edit execution

<footer>
```

## Step Article Structure

Each step article follows this internal structure:

```html
<article data-step="{ID}" data-phase="{PHASE}">
  <h2>Step {ID} — {Title}</h2>
  <p>Agent, Trigger/Runs After</p>

  <h3>What You Do</h3>           <!-- Purpose description -->

  <h3>Action: Call n8n Webhook</h3>  <!-- Webhook call with payload -->
  <p>POST <code>webhook-name</code></p>
  <pre><code>{ JSON payload }</code></pre>

  <details>
    <summary>Expected Response</summary>
    <pre><code>{ response shape }</code></pre>
  </details>

  <h3>After the Call</h3>        <!-- Success/empty handling -->
  <h3>Error Handling</h3>        <!-- Failure behavior -->
  <h3>What NOT to Do</h3>        <!-- Anti-patterns as bullet list -->
  <h3>Output for Next Step</h3>  <!-- Data passed forward -->
</article>
```

### Step Ordering

Steps are ordered within the single `<section>`:
1. Setup steps (`01`, `01b`) — `data-phase="setup"`
2. Workflow steps in sequence (`A1`–`A8`) with phase tags:
   - `data-gathering` (A1–A3)
   - `scoring-config` (A4–A5)
   - `score-select` (A6)
   - `schedule` (A7)
   - `persistence` (A8)
3. Post-workflow articles: checklist, template, validation, edit-assess, edit-apply

## Checklist Rendering

Checklists render as categorized `<ul>` lists under `<h3>` category headings:

```html
<article data-part="checklist">
  <h2>Quality Checklist</h2>
  <h3>Pre-Execution Checks (6)</h3>
  <ul>
    <li>Google Sheet has briefs with status "New"</li>
    ...
  </ul>
  <h3>Scoring Validation (5)</h3>
  <ul>...</ul>
  <h3>Post-Execution Checks (7)</h3>
  <ul>...</ul>
</article>
```

Count in parentheses after each category heading.

## Instruction Section Structure

The instructions article contains:

```html
<article data-part="instructions">
  <h2>Agent Instructions</h2>
  <h3>Overview</h3>             <!-- What the workflow does -->
  <h3>Agents Involved</h3>      <!-- Which agents execute which parts -->
  <h3>Execution Flow</h3>       <!-- Phase-by-phase summary with h4 per phase -->
  <h3>Webhook Reference</h3>    <!-- Table: webhook, method, steps -->
  <h3>Key Constraints</h3>      <!-- Bullet list of hard rules -->
  <h3>Success Criteria</h3>     <!-- Bullet list of completion conditions -->
</article>
```

## Template Rendering

Output templates render as a single `<pre><code>` block with `{placeholder}` variables:

```html
<article data-part="template">
  <h2>Output Template — {Template Name}</h2>
  <pre><code># Content Plan — {date_range}
## Scheduled Posts
### Post 1
- **Topic:** {topic_1}
...</code></pre>
</article>
```

## Validation Protocol Rendering

```html
<article data-part="validation">
  <h2>Validation Protocol (V-01)</h2>
  <h3>Category Name</h3>
  <ul>
    <li>Check description</li>
  </ul>
  <h3>Validation Report Format</h3>
  <pre><code>VALIDATION: workflow-name
Overall: PASS/FAIL</code></pre>
</article>
```

## Edit Assessment / Apply Rendering

Edit assessment uses a table mapping edit types to required re-execution:

```html
<article data-part="edit-assess">
  <h2>Edit Assessment (E-01)</h2>
  <table>
    <thead><tr><th>Edit Type</th><th>Re-score?</th><th>Re-schedule?</th><th>Re-save?</th></tr></thead>
    <tbody>
      <tr><td>Schedule change</td><td>No</td><td>Yes (A.7)</td><td>Yes (A.8)</td></tr>
    </tbody>
  </table>
</article>
```

## Error Handling Convention

Steps use two patterns for error documentation:

1. **Inline callouts** for single-action errors:
```html
<div class="error">If webhook fails: Retry once. If still failing, ask user.</div>
```

2. **Summary tables** for multi-action steps:
```html
<table>
  <thead><tr><th>Webhook</th><th>On Failure</th><th>Blocking?</th></tr></thead>
  <tbody>
    <tr><td>sma-save-post</td><td>Retry once, ask user</td><td>YES</td></tr>
    <tr><td>sma-save-to-notion</td><td>Warn, continue</td><td>NO</td></tr>
  </tbody>
</table>
```

## Step Dependency Chain

Steps declare dependencies via prose:
- `<p><strong>Runs After:</strong> A.1</p>` — sequential dependency
- `<div class="warning">This step is SKIPPED if...</div>` — conditional execution
- `Output for Next Step` section names the data passed forward
