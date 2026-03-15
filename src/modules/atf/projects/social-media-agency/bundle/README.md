# Flex SMA — Web Bundle

## What is a Web Bundle?

A **Web Bundle** is a self-contained collection of HTML files that consolidates an entire AI agent module's knowledge base into a format optimized for ChatGPT Custom GPTs (or any LLM that accepts uploaded files).

**Why HTML?** ChatGPT's knowledge file parser handles HTML well — semantic tags (`<section>`, `<article>`, `<details>`) provide structure, `data-*` attributes enable programmatic access, and embedded JSON (`<script type="application/json">`) preserves machine-readable schemas without escaping issues.

**The problem it solves:** The Flex SMA module has 170+ source files across workflows, agents, steps, templates, checklists, and configs. ChatGPT Custom GPTs support max 20 knowledge files. The Web Bundle compresses ~170 files into ~14 well-structured HTML files that preserve all content with zero information loss.

## How to Deploy to ChatGPT Custom Model

1. **Open** ChatGPT > Explore GPTs > Create a GPT (or edit existing)
2. **System Prompt:** Copy `bundle/system-prompt.md` into the Instructions field
3. **Knowledge Files:** Upload all `.html` files from the `bundle/` directory
4. **Actions:** In the Actions tab, paste the contents of the `<script type="application/json" id="openapi-schema">` block from `actions-schema.html` — or use the original `chatgpt-actions-schema.json` directly
5. **Test:** Trigger each mode (`plan content`, `draft post`, `format post`, etc.) and verify the GPT follows the correct workflow steps

## File Inventory

### Complete Inventory (16 files)

| # | File | Size | Source Files | Description |
|---|------|------|-------------|-------------|
| 1 | `system-prompt.md` | 7K | `chatgpt/system-prompt.md` | System prompt — identity, pipeline, modes, rules |
| 2 | `WF-A-ideation.html` | 41K | `workflows/content-ideation/*` (17 files) | A-workflow: config, instructions, steps 01/01b/A1-A8, checklist, template, validation, edit protocols |
| 3 | `agents.html` | 24K | `agents/*.md` + `agents/*.customize.yaml` + `_memory/*/instructions.md` (21 files) | All 7 agent definitions: persona, activation, capabilities, rules, menus, customization, sidecar |
| 4 | `actions-schema.html` | 34K | `chatgpt-actions-schema.json` | OpenAPI 3.1.0 schema + endpoint reference table (14 endpoints) |
| 5 | `WF-B-drafting.html` | 92K | `workflows/content-drafting/*` (20 files) | B-workflow: steps 01/01b/B1-B4, checklist, template, validation, edit protocols, error handling, test plan |
| 6 | `WF-C-review.html` | 62K | `workflows/content-review/*` (17 files) | C-workflow: steps 01/01b/C1-C4, checklist, template, validation, edit protocols, error handling, test plan |
| 7 | `WF-D-publishing.html` | 64K | `workflows/content-publishing/*` (17 files) | D-workflow: steps 01/01b/D1-D4, checklist, template, validation, edit protocols, error handling, test plan |
| 8 | `WF-E-analytics.html` | 86K | `workflows/analytics-review/*` (18 files) | E-workflow: steps 01/01b/E1-E5, checklist, template, validation, edit protocols, error handling, test plan |
| 9 | `WF-F-formatting.html` | 92K | `workflows/content-formatting/*` (18 files) | F-workflow: steps 01/01b/F1-F4, checklist, template, validation, edit protocols, reference data, test plan |
| 10 | `frameworks.html` | 98K | `frameworks/*.csv` (9 CSVs) + `content-elicitation-workflow.xml` | All framework data: formats, hooks, narrative, CTA, tone, positioning, methods, formatting rules, elicitation workflow |
| 11 | `config.html` | 30K | `frameworks/variable-registry.csv`, `config-doc-schemas.md`, `posting-schedule.yaml` | Variable registry (49 vars), 7 config document schemas, posting schedule |
| 12 | `validation.html` | 205K | `validation/*.md` (8 files) | QA reports: AB, FC, DE, revalidation, docs, UX strategy, P0P1, ChatGPT validation |
| 13 | `reference.html` | 28K | `workflows/*/data/reference/*.yaml` (11 files) | Reference YAML data across all 6 workflows |
| 14 | `orchestrator.html` | 64K | `docs/*.md` (5 files) + `docs/adr/ADR-*.md` (5 files) | Pipeline state machine, content strategy, variable storage, AB testing, 5 ADRs |
| 15 | `module-meta.html` | 27K | `config.yaml`, `CONTEXT.md`, `module-help.csv`, `workflow-manifest.csv`, `agent-manifest.csv` | Module config, context summary, help commands, workflow & agent manifests |
| 16 | `README.md` | 4K | — | This file. Bundle documentation and deployment guide. |

**Total: 16 files** (within ChatGPT's 20-file limit, leaving 4 slots for future expansion)

## How to Update/Rebuild

### Manual Update
1. Edit the source files in their original locations (`workflows/`, `agents/`, `chatgpt/`)
2. Re-generate the affected bundle HTML file by combining the updated sources
3. Re-upload to ChatGPT Custom GPT

### Bundle Conventions
- Each HTML file uses `<section data-type="...">` to identify content types (workflow, agent, endpoint)
- Each step uses `<article data-step="A1">` for granular identification
- Agent sections use `<section data-type="agent" data-id="flex-ideator" data-role="specialist">`
- JSON schemas are embedded in `<script type="application/json">` tags
- All styling is inline per file (no external dependencies)
- Files are self-contained — no cross-file references required at runtime

### Naming Convention
```
system-prompt.md          — System prompt (markdown, not HTML)
WF-{CODE}-{name}.html    — Workflow bundles (A-E + F)
agents.html               — All agent definitions
actions-schema.html        — OpenAPI schema + endpoint docs
frameworks.html            — Framework CSV + XML data
config.html                — Variable registry + config schemas + posting schedule
validation.html            — QA reports and validation checklists
reference.html             — Reference YAML data across all workflows
orchestrator.html          — Pipeline docs + ADRs
module-meta.html           — Module config, context, manifests
README.md                  — This documentation
```

## Architecture Notes

- **Source of truth:** The source markdown/YAML/JSON files in the SMA module remain canonical. Bundle files are generated outputs.
- **No build tool (yet):** Bundle files are hand-assembled. A build script may be added when the pattern stabilizes.
- **ChatGPT file size:** Each HTML file should stay under 2MB. Current files are well within this limit.
- **Version tracking:** Each HTML file has `<meta name="bundle-version" content="1.0.0">` in the head.
