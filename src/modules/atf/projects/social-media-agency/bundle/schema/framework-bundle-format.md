# Framework Bundle Format

Specification for converting structured data sources (CSV, JSON/OpenAPI, YAML) into HTML5 bundle sections.

## CSV to HTML Table Conversion

CSV files render as standard HTML tables with `<thead>`/`<tbody>`.

### Conversion Rules

1. First row becomes `<thead><tr><th>` cells.
2. Remaining rows become `<tbody><tr><td>` cells.
3. Empty cells render as empty `<td></td>`.
4. Cell content is HTML-escaped (no raw HTML in CSV).
5. Tables get `width: 100%` and collapsed borders.

### Source Attribution

The enclosing `<article>` or `<section>` attributes identify the CSV source:

```html
<section data-type="endpoint-table">
  <h2>Endpoint Reference</h2>
  <table>
    <thead><tr><th>Operation ID</th><th>Path</th><th>Summary</th><th>Required Fields</th><th>Used In Steps</th></tr></thead>
    <tbody>
      <tr><td><code>fetchBriefs</code></td><td><code>/webhook/sma-fetch-briefs</code></td><td>Fetch briefs</td><td>status</td><td>A.1, A.6</td></tr>
    </tbody>
  </table>
</section>
```

### CSS Classes in Table Cells

| Class | Styling | Purpose |
|---|---|---|
| `.required` | `color: #dc2626; font-weight: 600` | Required fields |
| `.optional` | `color: #6b7280` | Optional fields |
| `.method` | `inline-block, #dbeafe bg, #1e40af text, bold` | HTTP method badges |

### Inline Code in Tables

Field names, paths, and technical values wrap in `<code>`:
```html
<td><code>sma-fetch-briefs</code></td>
<td><code>/webhook/sma-fetch-briefs</code></td>
```

## JSON/XML to Structured HTML Conversion

### OpenAPI/JSON Schema Rendering

JSON schemas render as a combination of:
1. **Summary table** — one row per endpoint with key fields
2. **Detail articles** — one `<article data-endpoint="{operationId}">` per endpoint
3. **Embedded raw schema** — full JSON in `<script type="application/json">`

#### Detail Article Structure

```html
<article data-endpoint="{operationId}">
  <h3><span class="method">POST</span> <code>{path}</code> — {operationId}</h3>
  <p>{summary description}</p>
  <table>
    <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td>{field}</td><td>{type}</td><td class="required">Yes</td><td>{description}</td></tr>
    </tbody>
  </table>
  <p><strong>Response:</strong> {response description}</p>
</article>
```

#### Nested Object Rendering

Nested objects use dot notation in the field name column:
```html
<tr><td>post</td><td>object</td><td class="required">Yes</td><td>Post object</td></tr>
<tr><td>post.title</td><td>string</td><td class="required">Yes</td><td>Post title</td></tr>
<tr><td>post.content</td><td>string</td><td class="required">Yes</td><td>Full content</td></tr>
```

#### Array Item Rendering

Array items use `[]` notation:
```html
<tr><td>updates</td><td>array[object]</td><td class="required">Yes</td><td>Array of updates</td></tr>
<tr><td>updates[].row_id</td><td>string</td><td>—</td><td>Row ID to update</td></tr>
```

#### Enum Rendering

Enum values appear in the description or as type qualifier:
```html
<tr><td>status</td><td>enum</td><td>—</td><td>New, Planned, Used, Discarded</td></tr>
<tr><td>has_stats</td><td>enum: TRUE/FALSE</td><td>No</td><td>Has statistical data</td></tr>
```

### Raw Schema Embedding

The full machine-readable schema embeds at the end of the bundle:

```html
<section data-type="openapi-schema">
  <h2>Raw OpenAPI Schema</h2>
  <p>The complete OpenAPI 3.1.0 specification is embedded below for machine consumption.</p>
  <script type="application/json" id="openapi-schema">
  { "openapi": "3.1.0", ... }
  </script>
</section>
```

## YAML to Definition List / Code Block Conversion

YAML source files render in two ways depending on context:

### As Code Blocks (configuration, payloads)

```html
<pre><code>name: content-ideation
description: "Fetch briefs..."
config_source: "{project-root}/_lr/_config/manifest.yaml"
input_file_patterns:
  briefs:
    pattern: "data/reference/briefs.yaml"
    strategy: FULL_LOAD</code></pre>
```

Used for: workflow configs, agent customization blocks, webhook payloads.

### As Structured Lists (key-value pairs)

Simple YAML key-value maps render as `<ul>` with `<strong>` keys:

```html
<ul>
  <li><strong>Role:</strong> Content Ideation Specialist</li>
  <li><strong>Identity:</strong> Data-driven pattern hunter...</li>
  <li><strong>Communication Style:</strong> Analytical yet creative.</li>
</ul>
```

Used for: agent persona fields, session variables, summary metadata.

### As Tables (structured records)

YAML arrays of objects render as tables when fields are uniform:

```html
<table>
  <thead><tr><th>Condition</th><th>Score</th></tr></thead>
  <tbody>
    <tr><td>No title match within lookback</td><td>F = 10</td></tr>
    <tr><td>Match found but older than 10 days</td><td>F = 7</td></tr>
  </tbody>
</table>
```

Used for: scoring scales, validation rules, error handling summaries.

## Conversion Decision Matrix

| Source Format | Content Type | HTML Rendering |
|---|---|---|
| CSV | Tabular data | `<table>` with thead/tbody |
| JSON (OpenAPI) | API schema | Summary table + detail articles + embedded `<script>` |
| JSON (payload) | Request/response example | `<pre><code>` block |
| YAML (config) | Configuration | `<pre><code>` block |
| YAML (key-value) | Agent persona, metadata | `<ul>` with `<strong>` keys |
| YAML (records) | Scoring rules, validation | `<table>` |
| Markdown | Instructions, steps | Direct HTML conversion (headings, lists, paragraphs) |
