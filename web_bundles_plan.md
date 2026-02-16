# Shipquick 3.0: The 9-Agent Architecture Strategy

## 1. Executive Summary

This document outlines the major strategic shift to a **9-Agent Enterprise Architecture** for Shipquick. This new architecture introduces specialized roles (UX Designer, Scrum Master) and optimizes high-level strategy by merging Portfolio and Solution domains.

**Rollout Strategy:**

- **Phase 1 (Immediate): Web Bundles**: Implement this architecture strictly within the ChatGPT/Claude custom model "Web Bundles".
- **Phase 2 (Future): Shipquick Core**: Port this architecture to the main Shipquick npm package and `_bmad` core.

## 2. The 9-Agent Roster (Shipquick 3.0)

| Agent Role                    | Focus Area                                                           | File Count (Est) |
| :---------------------------- | :------------------------------------------------------------------- | :--------------- |
| **00 - BMad Orchestrator**    | Traffic Control & Master Routing                                     | 9                |
| **01 - Portfolio & Solution** | **[MERGED]** Portfolio Strategy, Investment & Large Scale Governance | 13               |
| **02 - Product Manager**      | Strategic Product Vision                                             | 12               |
| **03 - System Architect**     | Technical Runway & Standards                                         | 11               |
| **04A - Product Owner**       | Backlog & User Stories                                               | 10               |
| **04B - Scrum Master**        | **[NEW]** Process Coaching & Facilitation                            | 9                |
| **04C - Dev Squad**           | Execution & Coding                                                   | 10               |
| **04D - UX Designer**         | **[NEW]** Experience & Usability                                     | 12               |
| **05 - Test Architect**       | Quality Engineering & Automation                                     | 13               |

## 3. "Mega-HTML" Compiler Strategy

To bypass the 20-file limit, we will compile multi-file workflows (Steps + Templates + Data + Configs) into **single HTML files**.

**Universal Source Harvester:**
The script will recursively scan the workflow directory and embed **ALL** file types:

- **Markdown (`.md`)**: Steps, Checklists, Instructions -> _Embedded as `<article>` sections._
- **Data (`.csv`)**: Reference Data -> _Converted to HTML Tables._
- **Config (`.yaml`, `.json`)**: Workflow Rules -> _Embedded in `<pre><code class="language-yaml">` blocks._
- **Logic (`.xml`)**: Complex Instruction Sets -> _Embedded in `<pre><code class="language-xml">` blocks._

**Compiled Output:** `web-bundles/02-product-manager/workflow_create-prd.html`

**Key Features:**

- **One File to Rule Them All**: 1 Workflow = 1 HTML File containing logic, data, templates, and config.
- **Context Preservation**: XML/YAML instructions are preserved for the Agent to read as "System Prompts".
- **Human Readable**: Browser-friendly navigation with Table of Contents.

## 4. Strategic Content Authoring (10 New Files)

We will author **10 Net-New Files** to close capability gaps during Phase 1:

**Portfolio & Solution (01)**

- `workflow_pi_planning.md` (Compiled - Critical Event)
- `workflow_inspect_and_adapt.md` (Compiled - Retrospective)

**Scrum Master (04B)**

- `009_scrum_master_handbook.md`
- `workflow_daily_standup.md` (Compiled)

**UX Designer (04D)**

- `003_human_centered_design.md`
- `004_accessibility_checklist.md`
- `005_responsive_design_rules.md`
- `workflow_persona_development.md` (Compiled)
- `workflow_usability_testing.md` (Compiled)
- `workflow_design_handoff.md` (Compiled)

## 5. Phase 1 Execution Steps

1.  **Restructure Folders**: Create the 9-agent directory structure in `web-bundles/` (00-05).
2.  **Author Content**: Generate the 10 new strategic files.
3.  **Develop Script**: Create `scripts/compile_web_bundles.js` for HTML compilation.
4.  **Execute Build**: Populate `web-bundles` with the new architecture.
5.  **Sanitize**: Ensure all filenames are lowercase.
6.  **Verify**: Check file counts and validate HTML rendering.
