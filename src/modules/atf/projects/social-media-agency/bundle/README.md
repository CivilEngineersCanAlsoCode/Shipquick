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

### Prototype (5 files — this batch)

| # | File | Source Files Consolidated | Description |
|---|------|--------------------------|-------------|
| 1 | `system-prompt.md` | `chatgpt/system-prompt.md` | 6849-char system prompt — identity, pipeline, modes, rules |
| 2 | `WF-A-ideation.html` | `workflows/content-ideation/*` (17 files) | Complete A-workflow: config, instructions, steps 01/01b/A1-A8, checklist, template, validation, edit protocols |
| 3 | `agents.html` | `agents/*.md` + `agents/*.customize.yaml` + `_memory/*/instructions.md` (21 files) | All 7 agent definitions: persona, activation, capabilities, rules, menus, customization, sidecar content |
| 4 | `actions-schema.html` | `chatgpt-actions-schema.json` | OpenAPI 3.1.0 schema as embedded JSON + human-readable endpoint reference table with all 14 endpoints |
| 5 | `README.md` | — | This file. Bundle documentation and deployment guide. |

### Planned (9 more files)

| # | File | Source Files | Description |
|---|------|-------------|-------------|
| 6 | `WF-B-drafting.html` | `workflows/content-drafting/*` | B-workflow: steps B1-B4, framework curation, iterative refinement |
| 7 | `WF-F-formatting.html` | `workflows/content-formatting/*` | F-workflow: steps F1-F4, 16 formatting rules, preview generation |
| 8 | `WF-C-review.html` | `workflows/content-review/*` | C-workflow: steps C1-C4, approval/rejection flow |
| 9 | `WF-D-publishing.html` | `workflows/content-publishing/*` | D-workflow: steps D1-D4, one-shot publish, Telegram notification |
| 10 | `WF-E-analytics.html` | `workflows/analytics-review/*` | E-workflow: steps E1-E5, metric collection, strategy optimization |
| 11 | `knowledge-K1-K2.html` | `chatgpt/knowledge/K1-*.md`, `K2-*.md` | Pipeline workflows + API reference (detailed prose) |
| 12 | `knowledge-K3-K4.html` | `chatgpt/knowledge/K3-*.md`, `K4-*.md` | Formatting rules + Frameworks catalog |
| 13 | `knowledge-K5-K6.html` | `chatgpt/knowledge/K5-*.md`, `K6-*.md` | Scoring config + Content pillars |
| 14 | `frameworks.html` | `frameworks/*.csv` (8 CSVs) | All framework data: formats, hooks, narrative, CTA, tone, positioning, methods, formatting rules |

**Total: 14 files** (within ChatGPT's 20-file limit, leaving 6 slots for future expansion)

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
knowledge-{K#}-{K#}.html  — Knowledge file pairs
frameworks.html            — Framework CSV data
README.md                  — This documentation
```

## Architecture Notes

- **Source of truth:** The source markdown/YAML/JSON files in the SMA module remain canonical. Bundle files are generated outputs.
- **No build tool (yet):** Bundle files are hand-assembled. A build script may be added when the pattern stabilizes.
- **ChatGPT file size:** Each HTML file should stay under 2MB. Current files are well within this limit.
- **Version tracking:** Each HTML file has `<meta name="bundle-version" content="1.0.0">` in the head.
