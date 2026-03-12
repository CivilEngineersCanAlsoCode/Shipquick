# ATF: AutoFlow

**AutoFlow — 7-Agent Factory Floor for n8n Workflow Automation**

Production-quality n8n automations in 20 minutes through coordinated AI specialists.

---

## What Is AutoFlow?

AutoFlow is a modular automation factory that takes your idea for an n8n workflow and builds it end-to-end using 7 coordinated AI agents. Each agent is a specialist on the factory floor — from gathering requirements to deploying and validating the finished workflow.

**The factory motto: "We don't ship junk."**

## The Assembly Line

Your automation idea flows through 7 stations, each staffed by a specialist agent:

| # | Agent | Role | Icon | What They Do |
|---|-------|------|------|-------------|
| 1 | **Scout** | Analyst | 🔍 | Surveys the job site — interviews you, captures requirements and preferences |
| 2 | **Blueprint** | PM | 📐 | Draws the plans — defines I/O specs, data schemas, and mock data |
| 3 | **Forge Master** | Architect | 🔥 | Checks the toolbox — discovers nodes, compares tools, assesses feasibility |
| 4 | **Assembler** | Designer | 🔧 | Connects the pieces — decomposes into modular sub-workflows (max 10-20 nodes each) |
| 5 | **Foreman** | Scrum Master | 📋 | Keeps the schedule — manages backlog, tracks progress, captures learnings |
| 6 | **Welder** | Developer | ⚡ | Builds the pipeline — constructs production-ready n8n workflow JSON |
| 7 | **Inspector** | QA | 🔎 | Checks every weld — validates data flow, retries 3x, never gives up |

## Workflows

### Core Workflows
- **create-automation** — Main end-to-end pipeline. Takes an idea through all 7 agents to produce a working n8n workflow.
- **deploy-to-n8n** — Pushes validated workflow JSON to your n8n instance via API.
- **test-validate** — QA execution loop with retry logic and alternative pivoting.

### Feature Workflows
- **node-discovery** — Finds and ranks n8n nodes for a given requirement.
- **mock-data-generator** — Creates realistic test data from I/O specifications.
- **workflow-decompose** — Breaks complex automations into modular sub-workflows.
- **learning-capture** — Logs patterns and learnings to ChromaDB knowledge base.
- **alternative-suggest** — Proposes different approaches when tests fail after retries.

### Utility Workflows (Shared)
- **status-check** `[WS]` — Check project progress from any agent.
- **handoff** `[HO]` — Transfer context between agents on the assembly line.
- **escalate-to-user** `[ES]` — Human-in-the-loop decision gate.

## Configuration

AutoFlow requires the following configuration (set in `module.yaml`):

| Setting | Default | Description |
|---------|---------|-------------|
| `n8n_instance_url` | `http://localhost:5678` | Your n8n instance URL |
| `pinchtab_url` | `http://localhost:9867` | PinchTab browser automation URL |
| `chromadb_url` | `http://localhost:8000` | ChromaDB URL for learning capture |
| `atf_output_folder` | `{output_folder}/atf-artifacts` | Where artifacts are stored |
| `preferred_cost_tier` | `free` | Tool cost preference: free, freemium, or paid |

## Getting Started

1. Select the ATF module during BMAD setup
2. Configure your n8n instance URL and preferences
3. Talk to **Scout** and describe the automation you want to build
4. The assembly line handles the rest — you'll be asked for input at decision points

## Architecture Principles

- **Modularity** — Sub-workflows max 10-20 nodes. Microservices, not monoliths.
- **Testability** — Every sub-workflow is a testable unit with mock data.
- **Documentation** — Sticky notes on every node. If you didn't build it, you can still understand it.
- **Resilience** — Inspector retries 3x with different approaches before escalating.
- **Learning** — Every completed build feeds the ChromaDB knowledge base. The system gets smarter over time.
- **Human-in-the-loop** — Credential setup and critical decisions always go through you.
