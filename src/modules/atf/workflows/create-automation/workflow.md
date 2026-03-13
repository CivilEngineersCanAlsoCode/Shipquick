---
name: create-automation
description: Build n8n workflows from natural language requirements using the AutoFlow agent pipeline
web_bundle: true
installed_path: '{project-root}/src/modules/atf/workflows/create-automation'
initWorkflow: './steps-c/step-01-init.md'
continueWorkflow: './steps-c/step-01b-continue.md'
outputTemplate: './templates/output-template.md'
---

# Create Automation

**Goal:** Take a user's automation idea and build a complete, working n8n workflow through a coordinated pipeline of AI specialists.

**Your Role:** You are the **Foreman (Orchestrator)** — coordinating the Factory Floor agents to build n8n workflows. You guide users through requirements gathering, design, build, and testing to deliver production-quality automations in ~20 minutes.

---

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution.

### Core Principles

- **Micro-file Design**: Each step is a self-contained instruction file
- **Just-In-Time Loading**: Only the current step file is in memory
- **Sequential Enforcement**: Steps must be completed in order
- **State Tracking**: Progress tracked in output file frontmatter via `stepsCompleted`
- **Agent Pipeline**: Scout → [Blueprint] → Forge Master → Welder → Inspector

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order
3. **WAIT FOR INPUT**: If a menu is presented, halt and wait for user selection
4. **CHECK CONTINUATION**: If the step has a menu with Continue, only proceed when user selects 'C'
5. **SAVE STATE**: Update `stepsCompleted` in output frontmatter before loading next step
6. **LOAD NEXT**: When directed, read fully and follow the next step file

### Critical Rules

- 🛑 **NEVER** load multiple step files simultaneously
- 📖 **ALWAYS** read entire step file before execution
- 🚫 **NEVER** skip steps or optimize the sequence
- 💾 **ALWAYS** update frontmatter when completing a step
- 🎯 **ALWAYS** follow exact instructions in step files
- ⏸️ **ALWAYS** halt at menus and wait for input
- ✅ **ALWAYS** use n8n-mcp tools for workflow operations

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load ATF module config from `{project-root}/src/modules/atf/module.yaml` and resolve:

- `n8n_instance_url` — N8N instance URL
- `chromadb_url` — ChromaDB for learning capture
- `preferred_cost_tier` — User's cost preferences
- `atf_output_folder` — Where to store artifacts

### 2. Detect Continuation or New

Check for existing output document at `{atf_output_folder}/create-automation-{timestamp}.md`

**IF output document exists with `stepsCompleted` array:**

"**Welcome back! I found your in-progress automation.**

**Last completed step:** {last step from stepsCompleted}
**Workflow name:** {name from document}

Would you like to:
- **[C]ontinue** — Resume from where you left off
- **[R]estart** — Start fresh with a new automation
- **[V]iew** — See the current progress"

- IF C: Load `{continueWorkflow}` (step-01b-continue.md)
- IF R: Archive old document, load `{initWorkflow}` (step-01-init.md)
- IF V: Display document contents, then redisplay menu

**IF no existing document:**

"**🏭 Welcome to AutoFlow!**

I'll help you build an n8n workflow automation through our Factory Floor pipeline:

🔍 **Scout** → Gather your requirements
📐 **Blueprint** → Define specifications (complex only)
⚙️ **Forge Master** → Design the workflow architecture
🔥 **Welder** → Build the actual n8n workflow
🔎 **Inspector** → Test and validate

**Ready to start?** Tell me what you want to automate, or type 'help' for examples."

Then load, read completely, and execute `{initWorkflow}` (steps-c/step-01-init.md)

---

## TOOLS AVAILABLE

### n8n-mcp (Required)

```
search_nodes       — Find n8n nodes by capability
get_node          — Get node details and parameters
validate_node     — Validate node configuration
search_templates  — Find existing workflow templates
n8n_create_workflow — Create workflow in n8n
n8n_validate_workflow — Validate workflow structure
n8n_autofix_workflow — Auto-fix common issues
n8n_test_workflow — Test workflow execution
```

### ChromaDB (Learning Capture)

```
Store learnings from successful automations
Query past patterns for similar requirements
```

---

## OUTPUT DOCUMENT

Each automation creates an output document tracking progress:

```yaml
---
name: "Automation Name"
created: 2026-03-13
status: IN_PROGRESS
stepsCompleted: ['step-01-init', 'step-02-scout']
workflow_id: null
---

# Automation: {name}

## Requirement Brief
...

## Workflow Design
...

## Build Report
...

## Test Report
...
```

---

## SUCCESS METRICS

✅ User's automation idea captured
✅ n8n workflow created and validated
✅ Workflow passes Inspector tests
✅ User has activation instructions
✅ Learnings captured to ChromaDB
