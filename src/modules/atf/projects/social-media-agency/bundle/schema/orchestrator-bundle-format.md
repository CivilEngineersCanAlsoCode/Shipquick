# Orchestrator Bundle Format

Specification for rendering master agent routing, pipeline state machine, and error recovery in HTML5 bundles.

## Master Agent Routing

The orchestrator agent (Echo) routes work through the pipeline `A→B→F→C→D→E`. The agent bundle encodes routing via:

### Agent Roster with Workflow Assignments

```html
<table>
  <thead><tr><th>Agent ID</th><th>Name</th><th>Icon</th><th>Role</th><th>Workflows</th></tr></thead>
  <tbody>
    <tr><td>flex-publicist</td><td>Echo</td><td>icon</td><td>Orchestrator</td><td>A→B→F→C→D→E</td></tr>
    <tr><td>flex-ideator</td><td>Scout</td><td>icon</td><td>Specialist</td><td>A, B</td></tr>
    <tr><td>flex-crafter</td><td>Pixel</td><td>icon</td><td>Specialist</td><td>F, C</td></tr>
    <tr><td>flex-publisher</td><td>Relay</td><td>icon</td><td>Specialist</td><td>D, E</td></tr>
  </tbody>
</table>
```

### Routing Rules (in Orchestrator Capabilities)

```html
<article data-part="capabilities">
  <h3>Rules</h3>
  <ul>
    <li>Orchestrate the full A→B→F→C→D→E pipeline, delegating to specialist agents</li>
    <li>Never execute pipeline steps directly — delegate to Scout, Pixel, or Relay</li>
  </ul>
</article>
```

### Delegation Map

| Pipeline Stage | Delegated To | Agent ID |
|---|---|---|
| A (Ideation) | Scout | `flex-ideator` |
| B (Drafting) | Scout | `flex-ideator` |
| F (Formatting) | Pixel | `flex-crafter` |
| C (Review) | Pixel | `flex-crafter` |
| D (Publishing) | Relay | `flex-publisher` |
| E (Analytics) | Relay | `flex-publisher` |

### QA Gate Map

| Pipeline Stage | QA Agent | Agent ID |
|---|---|---|
| A, B | Lens | `flex-ideation-qa` |
| F, C | Grid | `flex-craft-qa` |
| D, E | Sentinel | `flex-publish-qa` |

## Pipeline State Machine Rendering

### Post Status Flow

The pipeline tracks post status through these states:

```
New → Scheduled_NoDraft → Draft → Drafted → Formatting → Previewed → Ready_ToPublish → Published
                                                                                    ↘ Cancelled
```

### Status Transitions by Workflow Step

| From Status | To Status | Triggered By | Step |
|---|---|---|---|
| (new brief) | `New` | Brief submitted to Sheet | Manual |
| `New` | `Scheduled_NoDraft` | Ideation complete, post saved | A.8 |
| `Scheduled_NoDraft` | `Draft` | Drafting started | B.1 |
| `Draft` | `Drafted` | Draft saved | B.4 |
| `Drafted` | `Formatting` | Formatting started | F.1 |
| `Formatting` | `Previewed` | Preview generated | F.4 |
| `Previewed` | `Ready_ToPublish` | User approves review | C.2 |
| `Ready_ToPublish` | `Published` | LinkedIn publish succeeds | D.2 |
| Any | `Cancelled` | User or error cancellation | E-02 |

### Status Rendered in Bundles

Workflow bundles reference statuses in webhook payloads and constraints:

```html
<!-- In step articles -->
<pre><code>{
  "status": "Scheduled_NoDraft"
}</code></pre>

<!-- In constraints -->
<div class="warning">Do NOT set status to anything other than Scheduled_NoDraft in MongoDB</div>

<!-- In fetch filters -->
<tr><td>status</td><td>string</td><td>No</td><td>Draft, Drafted, Formatting, Previewed, Ready_ToPublish, Published</td></tr>
```

## Error Recovery Section

### Step-Level Error Handling

Each workflow step declares error behavior using two patterns:

#### Pattern 1: Blocking vs Non-Blocking Classification

```html
<table>
  <thead><tr><th>Action</th><th>On Failure</th><th>Blocking?</th></tr></thead>
  <tbody>
    <tr><td>sma-save-post (MongoDB)</td><td>Retry once, ask user</td><td>YES</td></tr>
    <tr><td>sma-save-to-notion</td><td>Retry once, warn & continue</td><td>NO</td></tr>
    <tr><td>sma-update-sheet-status</td><td>Warn user, continue</td><td>NO</td></tr>
  </tbody>
</table>
```

#### Pattern 2: Inline Error Callouts

```html
<div class="error">
  If webhook fails: Retry once after 5 seconds.
  If still failing, ask user to check n8n workflow.
  Do NOT proceed to next step if this call fails.
</div>
```

### Resume/Recovery Step (01b)

Workflow bundles include a dedicated resume step for crash recovery:

```html
<article data-step="01b" data-phase="setup">
  <h2>Step 01b — Resume If Interrupted</h2>
  <!-- State detection logic -->
  <!-- Recovery actions per step -->
  <!-- Idempotency guarantees -->
</article>
```

#### Recovery State Detection

The resume step checks available state to determine the last completed step:

```html
<ul>
  <li><code>briefs[]</code> populated? → A.1 completed</li>
  <li><code>past_posts[]</code> populated? → A.2 completed</li>
  <li><code>scoring_config</code> loaded? → A.4 completed</li>
  <li>MongoDB IDs present? → A.8 partially completed</li>
</ul>
```

#### Idempotency Rules

| Operation Type | Idempotent? | Recovery Strategy |
|---|---|---|
| Data fetches (briefs, posts, config) | Yes | Re-fetch safely |
| Score computation | Yes | Re-compute from cached data |
| MongoDB save (new post) | No | Check for existing `_id` before re-saving |
| Sheet status update | Mostly | Check current status before updating |
| Notion save | No | Check for existing page before creating |
| LinkedIn publish | No | NEVER retry — check `linkedin_post_urn` exists |

### Error Escalation Hierarchy

1. **Retry once** — for transient failures (network, timeout)
2. **Warn and continue** — for non-blocking operations (Notion, Sheet updates)
3. **Ask user** — for blocking operations after retry fails (MongoDB save)
4. **Halt workflow** — for critical failures (no briefs, publish failure)

### Non-Blocking Convention

Non-blocking operations are marked explicitly in step articles:
- Prose: "Non-blocking on failure"
- Table column: `Blocking? NO`
- Callout: `<div class="error">Non-blocking. Proceed with [fallback].</div>`

Source of truth hierarchy: **MongoDB > Notion > Google Sheet**. Failures cascade gracefully right-to-left.

## Orchestrator Menu Commands

The orchestrator exposes pipeline-level commands:

```html
<table>
  <thead><tr><th>Command</th><th>Action</th></tr></thead>
  <tbody>
    <tr><td><code>[OR]</code></td><td>Orchestrate Pipeline: End-to-end A→B→F→C→D→E</td></tr>
    <tr><td><code>[GW]</code></td><td>Ghostwrite Post: Direct narrative creation</td></tr>
    <tr><td><code>[ST]</code></td><td>Pipeline Status: View active posts and stages</td></tr>
    <tr><td><code>[DA]</code></td><td>Dismiss Agent</td></tr>
  </tbody>
</table>
```

Specialist agents expose workflow-specific commands (`[ID]`, `[DR]`, `[FM]`, `[RV]`, `[PB]`, `[AN]`).
QA agents expose validation commands (`[VA]`, `[VB]`, `[VF]`, `[VC]`, `[VD]`, `[VE]`).
