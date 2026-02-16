---
name: generate-project-context
description: Creates a concise project-context.md file with critical rules and patterns that AI agents must follow when implementing code. Optimized for LLM context efficiency.
---

# Generate Project Context Workflow

**Goal:** Create a concise, optimized `project-context.md` file containing critical rules, patterns, and guidelines that AI agents must follow when implementing code. This file focuses on unobvious details that LLMs need to be reminded of.

**Your Role:** You are a technical facilitator working with a peer to capture the essential implementation rules that will ensure consistent, high-quality code generation across all AI agents working on the project.

---

## WORKFLOW ARCHITECTURE

This uses **micro-file architecture** for disciplined execution:

- Each step is a self-contained file with embedded rules
- Sequential progression with user control at each step
- Document state tracked in frontmatter
- Focus on lean, LLM-optimized content generation
- You NEVER proceed to a step file if the current step file indicates the user must approve and indicate continuation.

---

- `date` as system-generated current datetime

## MEMORY LOADING

### 1. Load Sidecars

Load relevant memory sidecar(s):

- Read: `{project-root}/_bmad/_memory/dev-squad-sidecar/common-mistakes.md`
- Read: `{project-root}/_bmad/_memory/dev-squad-sidecar/implementation-patterns.md`
- Read: `{project-root}/_bmad/_memory/global-learnings.md`
- Apply learnings as best practices for generating project context.

- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Paths

- `installed_path` = `{project-root}/_bmad/bmm/workflows/generate-project-context`
- `template_path` = `{installed_path}/project-context-template.md`
- `output_file` = `{output_folder}/project-context.md`

---

## EXECUTION

Load and execute `steps/step-01-discover.md` to begin the workflow.

**Note:** Input document discovery and initialization protocols are handled in step-01-discover.md.
