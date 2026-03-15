# Agent Bundle Format

Specification for combining all agent definitions into a single HTML5 bundle with sidecar content embedding.

## Source Files

| Source | Maps To |
|---|---|
| Agent YAML/MD files (`flex-publicist.md`, etc.) | One `<section>` per agent |
| Sidecar `instructions.md` | Embedded in agent's `data-part="sidecar"` article |
| Sidecar `memories.md` | Referenced by path (not embedded — runtime-only) |
| `config.yaml` customization blocks | `data-part="customize"` article per agent |

## Document Layout

```
<header>
  h1: "Flex SMA — Agent Definitions"
  p: Total Agents, Orchestrator count, Specialist count, QA count
  table: Agent roster (ID, Name, Icon, Role, Workflows)

<!-- One section per agent, grouped by role -->
<section data-type="agent" data-id="{agent-id}" data-role="{role}">
  <article data-part="persona">
  <article data-part="activation">
  <article data-part="capabilities">
  <article data-part="menu">
  <article data-part="customize">
  <article data-part="sidecar">
</section>

<footer>
```

## Agent Roster Table

The `<header>` contains a summary table of all agents:

```html
<table>
  <thead><tr><th>Agent ID</th><th>Name</th><th>Icon</th><th>Role</th><th>Workflows</th></tr></thead>
  <tbody>
    <tr><td>flex-publicist</td><td>Echo</td><td>icon</td><td>Orchestrator</td><td>A→B→F→C→D→E</td></tr>
    ...
  </tbody>
</table>
```

## Section-Level Attributes

```html
<section data-type="agent" data-id="flex-publicist" data-role="orchestrator">
```

| Attribute | Values |
|---|---|
| `data-type` | Always `agent` |
| `data-id` | Agent identifier: `flex-publicist`, `flex-ideator`, `flex-crafter`, `flex-publisher`, `flex-ideation-qa`, `flex-craft-qa`, `flex-publish-qa` |
| `data-role` | `orchestrator`, `specialist`, `qa` |

## Role-Based Styling

Sections use role-specific left border colors:

| Role | Border Color | Badge Class |
|---|---|---|
| Orchestrator | `#2563eb` (blue) | `.badge-orch` — blue bg |
| Specialist | `#059669` (green) | `.badge-spec` — green bg |
| QA | `#d97706` (amber) | `.badge-qa` — amber bg |

Agent name headings include a badge:
```html
<h2>Echo — Social Brand Strategist <span class="badge badge-orch">Orchestrator</span></h2>
```

## Agent Header Pattern

Each agent section starts with an icon + name header:

```html
<div class="agent-header">
  <span class="agent-icon">icon</span>
  <h2>{Name} — {Role Title} <span class="badge badge-{role}">{Role}</span></h2>
</div>
```

## Article Structure Per Agent

### Persona (`data-part="persona"`)

```html
<article data-part="persona">
  <h3>Persona</h3>
  <ul>
    <li><strong>Role:</strong> {role title}</li>
    <li><strong>Identity:</strong> {what this agent does and why}</li>
    <li><strong>Communication Style:</strong> {how it speaks}</li>
    <li><strong>Principles:</strong> {core values, comma-separated}</li>
  </ul>
</article>
```

### Activation (`data-part="activation"`)

```html
<article data-part="activation">
  <h3>Activation Steps</h3>
  <ol>
    <li>Load persona from agent file</li>
    <li>IMMEDIATE: Load config, store session variables, STOP if not loaded</li>
    <li>MANDATORY SIDECAR: Load from {sidecar_path}</li>
    <li>Show greeting as "{Name} | {Role Title}", display menu</li>
    <li>STOP and WAIT for user input</li>
  </ol>
</article>
```

### Capabilities (`data-part="capabilities"`)

```html
<article data-part="capabilities">
  <h3>Capabilities</h3>
  <p>{comma-separated capability keywords}</p>
  <h3>Rules</h3>
  <ul>
    <li>{hard constraint 1}</li>
    <li>{hard constraint 2}</li>
  </ul>
</article>
```

### Menu (`data-part="menu"`)

```html
<article data-part="menu">
  <h3>Menu</h3>
  <table>
    <thead><tr><th>Command</th><th>Action</th></tr></thead>
    <tbody>
      <tr><td><code>[OR]</code></td><td>Orchestrate Pipeline: description</td></tr>
      <tr><td><code>[DA]</code></td><td>Dismiss Agent</td></tr>
    </tbody>
  </table>
</article>
```

Every agent menu includes `[DA]` (Dismiss Agent) as the last command.

### Customization (`data-part="customize"`)

```html
<article data-part="customize">
  <h3>Customization</h3>
  <pre><code>agent: {agent-id}
custom_rules: []
project_overrides:
  tone: professional
  platform_focus: linkedin</code></pre>
</article>
```

### Sidecar (`data-part="sidecar"`)

```html
<article data-part="sidecar">
  <h3>Sidecar</h3>
  <p><strong>Path:</strong> <code>_memory/{agent-id}-sidecar/</code></p>
  <p><strong>instructions.md:</strong> {Agent Name} — Sidecar Instructions (placeholder)</p>
</article>
```

## Sidecar Content Embedding

Sidecar files provide runtime context for agents:
- `instructions.md` — additional agent-specific instructions (referenced by path in the bundle)
- `memories.md` — runtime-only memories (never embedded in bundle, always loaded fresh)

The bundle references sidecar paths but does not inline memory content, since memories change between sessions.

## Agent Ordering

Agents are ordered by role hierarchy:
1. Orchestrator(s)
2. Specialists (in pipeline order)
3. QA agents (matching specialist order)

## Agent Grouping

HTML comments separate role groups:
```html
<!-- ORCHESTRATOR -->
<section data-type="agent" data-id="flex-publicist" data-role="orchestrator">...</section>

<!-- SPECIALISTS -->
<section data-type="agent" data-id="flex-ideator" data-role="specialist">...</section>
<section data-type="agent" data-id="flex-crafter" data-role="specialist">...</section>
<section data-type="agent" data-id="flex-publisher" data-role="specialist">...</section>

<!-- QA AGENTS -->
<section data-type="agent" data-id="flex-ideation-qa" data-role="qa">...</section>
...
```
