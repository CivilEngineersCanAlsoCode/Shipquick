# HTML5 Web Bundle Convention

Specification for converting SMA source files (YAML, Markdown, CSV, JSON) into self-contained HTML5 bundles consumable by AI agents and human reviewers.

## Document Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{Bundle Title} | Flex SMA Bundle</title>
  <meta name="bundle-version" content="1.0.0">
  <meta name="source-module" content="flex-sma">
  <!-- Bundle-type-specific meta tags -->
  <style>/* Embedded styles — no external dependencies */</style>
</head>
<body>
  <header><!-- Bundle title, summary stats --></header>
  <section><!-- Content groups --></section>
  <footer><!-- Generation provenance --></footer>
</body>
</html>
```

### Meta Tags

| Meta Name | Purpose | Example |
|---|---|---|
| `bundle-version` | Semver of the bundle format | `1.0.0` |
| `source-module` | Module that generated the bundle | `flex-sma` |
| `workflow-code` | Workflow identifier (workflow bundles) | `A` |
| `agent-count` | Number of agents (agent bundles) | `7` |
| `openapi-version` | OpenAPI version (schema bundles) | `3.1.0` |

## Semantic Element Mapping

### `<section>` — Content Group

Sections wrap logical groups: a workflow, an agent definition, an endpoint category.

```html
<section data-type="workflow" data-code="A">
<section data-type="agent" data-id="flex-publicist" data-role="orchestrator">
<section data-type="endpoint-table">
<section data-type="endpoint-details">
<section data-type="openapi-schema">
```

#### Section `data-*` Attributes

| Attribute | Values | Used In |
|---|---|---|
| `data-type` | `workflow`, `agent`, `endpoint-table`, `endpoint-details`, `openapi-schema` | All bundle types |
| `data-code` | Workflow letter code (`A`, `B`, `F`, etc.) | Workflow bundles |
| `data-id` | Agent identifier (`flex-publicist`, `flex-ideator`) | Agent bundles |
| `data-role` | `orchestrator`, `specialist`, `qa` | Agent bundles |

### `<article>` — Discrete Content Unit

Articles wrap individual steps, agent parts, or endpoint specs. Every article has a `data-*` attribute identifying its content.

```html
<!-- Workflow bundle: steps and parts -->
<article data-step="A1" data-phase="data-gathering">
<article data-part="config">
<article data-part="instructions">
<article data-part="checklist">
<article data-part="template">
<article data-part="validation">
<article data-part="edit-assess">
<article data-part="edit-apply">

<!-- Agent bundle: agent facets -->
<article data-part="persona">
<article data-part="activation">
<article data-part="capabilities">
<article data-part="menu">
<article data-part="customize">
<article data-part="sidecar">

<!-- Schema bundle: individual endpoints -->
<article data-endpoint="fetchBriefs">
<article data-endpoint="savePost">
```

#### Article `data-*` Attributes

| Attribute | Values | Used In |
|---|---|---|
| `data-step` | Step ID (`01`, `01b`, `A1`–`A8`) | Workflow bundles |
| `data-phase` | `setup`, `data-gathering`, `scoring-config`, `score-select`, `schedule`, `persistence` | Workflow bundles |
| `data-part` | `config`, `instructions`, `checklist`, `template`, `validation`, `edit-assess`, `edit-apply`, `persona`, `activation`, `capabilities`, `menu`, `customize`, `sidecar` | All bundle types |
| `data-endpoint` | Operation ID (`submitBrief`, `fetchPost`) | Schema bundles |

## Heading Hierarchy

| Level | Purpose | Example |
|---|---|---|
| `h1` | Bundle title (one per document) | `Workflow A — Content Ideation` |
| `h2` | Major section: step title, agent name, endpoint group | `Step A.1 — Fetch New Briefs` |
| `h3` | Subsection within a step/agent: "What You Do", "Error Handling", "Persona" | `Error Handling` |
| `h4` | Sub-subsection: phases within a step, scoring factor detail | `Phase 1: Data Gathering` |

Rules:
- Never skip levels (no h1 followed by h3).
- `h1` appears exactly once, inside `<header>`.
- `h2` appears inside `<article>` or at `<section>` level.
- `h3`/`h4` appear inside `<article>`.

## Code Block Handling

All code blocks use `<pre><code>` with no `data-language` attribute (language is inferred from context). Code blocks render configuration, payloads, templates, and formulas.

```html
<!-- YAML config -->
<pre><code>name: content-ideation
description: "Fetch briefs..."
config_source: "{project-root}/_lr/_config/manifest.yaml"</code></pre>

<!-- JSON payload -->
<pre><code>{
  "status": "New"
}</code></pre>

<!-- Template -->
<pre><code># Content Plan — {date_range}
## Scheduled Posts
### Post 1
- **Topic:** {topic_1}</code></pre>
```

## Table Rendering

Tables are standard HTML `<table>` with `<thead>`/`<tbody>`. Used for:
- Webhook reference tables (endpoint, method, steps)
- Scoring rules (condition → score)
- Validation rules (field, constraint, error message)
- Error handling summaries (action, on-failure, blocking?)
- Agent roster tables (ID, name, icon, role, workflows)
- Endpoint reference tables (operation ID, path, summary, fields, steps)

```html
<table>
  <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td>topic</td><td>string</td><td class="required">Yes</td><td>Content topic title</td></tr>
    <tr><td>days</td><td>integer</td><td class="optional">No</td><td>Lookback period</td></tr>
  </tbody>
</table>
```

### CSS Classes for Table Cells

| Class | Purpose |
|---|---|
| `.required` | Red bold text for required fields |
| `.optional` | Gray text for optional fields |

## Callout Blocks

Two callout types using CSS classes on `<div>`:

```html
<div class="warning">Non-negotiable constraint or pre-condition.</div>
<div class="error">Error handling guidance — what to do on failure.</div>
```

## Collapsible Details

Use `<details>/<summary>` for verbose content that shouldn't clutter the main flow (expected responses, raw schemas):

```html
<details>
  <summary>Expected Response</summary>
  <pre><code>{ "briefs": [...] }</code></pre>
</details>
```

## Embedded Machine-Readable Data

For schemas intended for machine consumption, embed JSON inside a `<script>` tag:

```html
<script type="application/json" id="openapi-schema">
{ "openapi": "3.1.0", ... }
</script>
```

## CSS Convention

All styles are embedded in `<head>` — no external stylesheets. The standard palette:

| Element | Color |
|---|---|
| `h1` | `#1e40af` (dark blue) |
| `h2` | `#2563eb` (blue) or `#7c3aed` (purple, agent bundles) |
| `h3` | `#3b82f6` (light blue) |
| `body` | `system-ui, sans-serif`, max-width 960px, centered |
| `section` border-left | `#2563eb` (workflow), `#7c3aed` (orchestrator), `#059669` (specialist), `#d97706` (QA) |
| `pre` background | `#1e293b` (dark slate) with `#e2e8f0` text |
| `article` background | `#f8fafc` with 8px border-radius |
| `.warning` | `#fef3c7` bg, `#f59e0b` left border |
| `.error` | `#fee2e2` bg, `#ef4444` left border |

## Footer Convention

Every bundle ends with a provenance footer:

```html
<footer>
  <hr>
  <p><small>Generated from {source description}. Bundle v{version}</small></p>
</footer>
```

## Self-Containment Rule

Bundles must be fully self-contained:
- No external CSS, JS, or font references.
- No relative links to other files.
- All styles inline in `<head>`.
- Machine-readable data embedded via `<script type="application/json">`.
- File paths in content use `{project-root}` placeholder, never absolute paths.
