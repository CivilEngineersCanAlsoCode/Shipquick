---
name: "autoflow-orchestrator"
description: "AutoFlow Main Orchestrator (Foreman)"
module: "atf"
---

# AutoFlow Orchestrator 🏭

**Foreman** is the orchestrator that sits ABOVE the pipeline, routing requests through the appropriate path based on complexity.

## Architecture

```
                    👷 FOREMAN (Orchestrator)
                    ┌─────────────────────────┐
                    │ • Classifies complexity  │
                    │ • Routes to correct path │
                    │ • Manages retries        │
                    │ • Tracks progress        │
                    │ • Escalates blockers     │
                    └───────────┬─────────────┘
                                │
    ┌───────────────────────────┴───────────────────────────┐
    │                                                        │
    │  🚀 FAST PATH (1-5 nodes):                            │
    │  Scout → [Template Check] → Welder → Inspector        │
    │                                                        │
    │  📋 STANDARD PATH (5-15 nodes):                       │
    │  Scout → Forge Master → Welder → Inspector            │
    │                                                        │
    │  🏗️ COMPLEX PATH (15+ nodes):                         │
    │  Scout → Blueprint → Forge Master → Welder → Inspector│
    │                                                        │
    └────────────────────────────────────────────────────────┘
```

## Agents (5 total)

| Agent | Role | Memory | When Used |
|-------|------|--------|-----------|
| 🔍 Scout | Analyst | ✅ | Always first |
| 📐 Blueprint | PM | ✅ | Complex only |
| ⚙️ Forge Master | Architect + Configurator | ✅ | Standard + Complex |
| 🔥 Welder | Builder | ❌ | Always builds |
| 🔎 Inspector | QA | ✅ | Always tests |

**Removed:** Assembler (merged into Forge Master), Foreman (elevated to Orchestrator)

## Entry Points

```bash
# Main entry - Foreman orchestrates
/autoflow "Send email when Google Sheet row is added"

# Direct agent access
/scout       # Start requirements gathering
/forge-master # Start with existing requirements  
/inspector   # Test existing workflow
```

## Foreman Orchestration Logic

```yaml
on_request:
  1. Receive user request
  2. Route to Scout for requirements
  
on_scout_complete:
  requirement_brief = scout.output
  complexity = classify_complexity(requirement_brief)
  
  if complexity == "simple":
    # Fast path - check templates first
    templates = search_templates(requirement_brief.keywords)
    if templates.match_score > 0.9:
      workflow_id = deploy_template(templates[0])
      route_to: inspector
    else:
      route_to: forge_master  # Minimal design needed
      
  elif complexity == "moderate":
    route_to: forge_master
    
  elif complexity == "complex":
    route_to: blueprint
    
on_blueprint_complete:
  route_to: forge_master
  
on_forge_master_complete:
  route_to: welder
  
on_welder_complete:
  if build_report.status == "error":
    retries += 1
    if retries < 3:
      route_to: forge_master  # Redesign
    else:
      escalate_to: user
  else:
    route_to: inspector
    
on_inspector_complete:
  if test_report.status == "passed":
    deliver_to: user
  else:
    # Try auto-fix first
    autofix_result = n8n_autofix_workflow(workflow_id)
    if autofix_result.success:
      route_to: inspector  # Re-test
    else:
      retries += 1
      if retries < 3:
        route_to: welder  # Rebuild
      else:
        suggest_alternatives()
        escalate_to: user
```

## Complexity Classification

```yaml
classify_complexity:
  inputs:
    - requirement_brief from Scout
    
  rules:
    simple (1-5 nodes):
      - Single trigger + 1-3 actions
      - No conditional logic
      - No loops
      - Common integrations (Gmail, Sheets, Slack)
      
    moderate (5-15 nodes):
      - Multiple actions
      - Some conditional logic (IF nodes)
      - Data transformation
      - Less common integrations
      
    complex (15+ nodes):
      - Multiple triggers or webhooks
      - Complex branching
      - Loops or recursion
      - Sub-workflows needed
      - Error handling chains
      - Uncommon/custom integrations
```

## Handoff Files

All handoffs write to `_bmad/_memory/handoffs/`:

```
_bmad/_memory/handoffs/
├── 01-requirement-brief.yaml  (Scout output)
├── 02-automation-spec.yaml    (Blueprint output, if used)
├── 03-workflow-design.yaml    (Forge Master output)
├── 04-build-report.yaml       (Welder output)
└── 05-test-report.yaml        (Inspector output)
```

## Error Handling

```yaml
retry_policy:
  max_retries: 3
  retry_actions:
    1: autofix (Inspector uses n8n_autofix_workflow)
    2: rebuild (route back to Welder)
    3: redesign (route back to Forge Master)
    
escalation:
  after_retries: 3
  action: escalate_to_user
  provide:
    - error summary
    - suggested alternatives
    - manual steps needed
```

## Status Tracking

Foreman maintains status in `_bmad/_memory/foreman-sidecar/status.md`:

```yaml
current_automation:
  request: "User's original request"
  started: "2026-03-12T23:00:00Z"
  path: "standard"  # fast | standard | complex
  current_agent: "welder"
  progress: 60%
  completed:
    - scout: "✅ 23:01"
    - forge_master: "✅ 23:05"
  pending:
    - welder: "🔄 in progress"
    - inspector: "⏳ waiting"
  retries: 0
  blockers: []
```
