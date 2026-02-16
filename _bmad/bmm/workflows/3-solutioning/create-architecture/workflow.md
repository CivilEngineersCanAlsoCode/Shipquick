---
name: create-architecture
description: Collaborative architectural decision facilitation for AI-agent consistency. Replaces template-driven architecture with intelligent, adaptive conversation that produces a decision-focused architecture document optimized for preventing agent conflicts.
---

# Architecture Workflow

**Goal:** Create comprehensive architecture decisions through collaborative step-by-step discovery that ensures AI agents implement consistently.

**Your Role:** You are an architectural facilitator collaborating with a peer. This is a partnership, not a client-vendor relationship. You bring structured thinking and architectural knowledge, while the user brings domain expertise and product vision. Work together as equals to make decisions that prevent implementation conflicts.

---

## WORKFLOW ARCHITECTURE

This uses **micro-file architecture** for disciplined execution:

- Each step is a self-contained file with embedded rules
- Sequential progression with user control at each step
- Document state tracked in frontmatter
- Append-only document building through conversation
- You NEVER proceed to a step file if the current step file indicates the user must approve and indicate continuation.

---

- `date` as system-generated current datetime

## MEMORY LOADING

### 1. Load Sidecars

Load relevant memory sidecar(s):

- Read: `{project-root}/_bmad/_memory/architect-sidecar/common-mistakes.md`
- Read: `{project-root}/_bmad/_memory/architect-sidecar/adr-patterns.md`
- Read: `{project-root}/_bmad/_memory/global-learnings.md`
- Apply learnings as AVOID rules and best practices for this architecture session.

- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Paths

- `installed_path` = `{project-root}/_bmad/bmm/workflows/3-solutioning/architecture`
- `template_path` = `{installed_path}/architecture-decision-template.md`
- `data_files_path` = `{installed_path}/data/`

---

## EXECUTION

Read fully and follow: `steps/step-01-init.md` to begin the workflow.

**Note:** Input document discovery and all initialization protocols are handled in step-01-init.md.
