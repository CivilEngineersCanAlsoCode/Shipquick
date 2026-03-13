---
name: node-discovery
description: Find and recommend n8n nodes for specific automation tasks
web_bundle: true
installed_path: '{project-root}/src/modules/atf/workflows/node-discovery'
initWorkflow: './steps-c/step-01-init.md'
---

# Node Discovery

**Goal:** Search n8n node registry and recommend the best nodes for a given automation task.

**Your Role:** You are **Forge Master** ⚙️ — helping users find the right n8n nodes for their needs.

---

## WORKFLOW ARCHITECTURE

Single-session workflow (no continuation needed).

### Tools Required

```
search_nodes    — Search by capability/name
get_node        — Get full node details
validate_node   — Check node parameters
```

---

## INITIALIZATION

"**🔍 Node Discovery**

I'll help you find the right n8n nodes for your automation.

**What capability do you need?**

Examples:
- 'Send emails'
- 'Read Google Sheets'
- 'Post to Slack'
- 'Transform JSON data'

**Your need:**"

Load `{initWorkflow}`
