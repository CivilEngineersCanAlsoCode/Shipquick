# Module Brief: atf

**Date:** 2026-03-12
**Author:** Ubuntu
**Module Code:** atf
**Module Type:** STANDALONE
**Status:** Ready for Development

---

## Executive Summary

AutoFlow delivers production-quality n8n workflow automations in 20 minutes through a coordinated team of 7 AI specialist agents operating on a Factory Floor metaphor. It transforms user requirements into modular, documented, tested n8n workflow JSON — combining human-in-the-loop approval gates with Playwright browser automation and a QA agent that never gives up.

**Module Category:** Workflow Automation & Orchestration
**Target Users:** Product Managers, Systems/Solution Architects, Solopreneurs — low-code/no-code builders who understand systems but don't write code
**Complexity Level:** High (7 agents, 11 workflows, 6 MCP/external integrations)

---

## Module Identity

### Module Code & Name

- **Code:** `atf`
- **Name:** AutoFlow

### Core Concept

N8N workflow automation with human-in-the-loop approval, Playwright browser automation, delivered through 4 atomic steps. A 7-agent factory floor that takes a user's automation idea and produces a complete, modular, documented, tested n8n workflow — in 20 minutes.

### Personality Theme

**Factory Floor** — Builder bots assembling automation pipelines. Each agent is a factory worker with a specialized role on the assembly line: Scout surveys the job, Blueprint draws the plans, Forge Master knows every tool, Assembler connects the pieces, Foreman keeps the schedule, Welder builds it, and Inspector checks every weld.

---

## Module Type

**Type:** STANDALONE

AutoFlow operates as a fully independent module with no dependencies on other BMAD modules. It brings its own agents, workflows, tools, and knowledge base. This ensures it can be installed and used immediately without prerequisite modules, making it ideal for users who want workflow automation without adopting the full BMAD ecosystem.

---

## Unique Value Proposition

**What makes this module special:**

> "For solopreneurs and low-code builders, AutoFlow delivers production-quality n8n automations in 20 minutes, not days — unlike manual building or hiring developers — because it deploys 7 AI specialists using software engineering principles: modular architecture, documentation-first design, and a QA that never gives up."

**Why users would choose this module:**

1. **7-Agent Specialization** — Not one AI doing everything, but a coordinated factory floor where each agent masters ONE thing. No diluted expertise.
2. **Modular Architecture = Software Engineering Mindset** — Max 10-20 nodes per workflow, orchestrator + sub-workflows, each sub-workflow = 1 testable unit. Microservices, not monoliths.
3. **NEVER GIVE UP QA Philosophy** — QA tries 3x, then pivots to alternative approach based on user preferences captured by Analyst. The system FIGHTS to make it work.
4. **Human-in-the-Loop Gates** — User controls critical decisions. Clear instructions: "open node X, configure Y". Perfect for non-coders who understand systems.
5. **Documentation-First** — Every workflow has sticky notes explaining each step. Export/import ready. Anyone can understand and customize.
6. **Learning Loop** — Scrum Master tracks learnings to ChromaDB. System gets smarter with every workflow built.

### AutoFlow vs Alternatives

| Alternative | Problem | AutoFlow Advantage |
|---|---|---|
| Manual n8n building | Hours of trial-error, no docs, monolithic, no testing | 20 min, documented, modular, tested |
| Zapier/Make | Black box, no customization, expensive at scale | Full control, modular, n8n's power with AI guidance |
| Hiring a developer | Expensive, weeks of back-forth | 20 min, YOUR requirements captured correctly |

### Future Enhancement Ideas

1. **Workflow Templates Library** — Pre-built sub-workflows for common patterns
2. **Complexity Scoring** — Estimated complexity and time before building
3. **Version Control Integration** — Track workflow changes like code
4. **Community Sharing** — Users share sub-workflows, others reuse
5. **Cost Calculator** — Show API/compute costs before execution

---

## User Scenarios

### Target Users

**Primary Users:**
- **Product Managers & Builders** — low-code/no-code believers
- **Systems/Solution Architects** — working systems configuration mindset
- **Solopreneurs** — multiple business automation use cases

**Skill Level:**
- Don't know code BUT understand systems at a decent level
- Have configured n8n workflows before (basic flows)
- Limited knowledge of advanced flows/nodes
- Can follow clear instructions ("open node X, configure Y")

### Primary Use Case

**Social Media Automation** — User wants automated posting across X, Reddit, LinkedIn. Orchestrator coordinates 3 platform-specific sub-workflows. All 7 agents involved. 20-minute delivery from idea to working automation.

### User Journeys

**Scenario 1: Social Media Automation (First Use)**
A solopreneur wants to automate posting across X, Reddit, and LinkedIn. They describe the idea to Scout, who captures requirements and preferences (free tools preferred, posting schedule, content types). Blueprint creates the I/O spec and mock data. Forge Master discovers the right nodes for each platform. Assembler designs an orchestrator + 3 sub-workflows (one per platform), each following: ideation > creation > review/approval > scheduling > publishing. Foreman creates the project backlog. Welder builds the JSON. Inspector validates data flow across every node. Result: working orchestrator with clear sub-workflow calls, each platform isolated and testable, sticky notes explaining every step, mock data already flowing.

**Scenario 2: Data Pipeline (Advanced Use)**
A systems architect needs an ETL pipeline from Google Sheets to a database with transformations. Scout, Blueprint, Architect, Designer, Welder, and Inspector collaborate to produce a modular workflow with error handling, retry logic, and data validation at each stage.

**Scenario 3: Web Scraping ("Aha!" Moment)**
A product manager needs to extract data from websites with anti-detect capabilities. Scout captures requirements, Forge Master recommends PinchTab for browser automation, Designer creates a stealth workflow, Welder builds it, and Inspector validates the extraction. The user realizes: "This is how REAL software is built, and I just built it without code."

**Scenario 4: Email Automation**
Auto-respond based on email content classification. All 7 agents produce an AI-powered classification + response workflow with human approval gates for sensitive responses.

---

## Agent Architecture

### Agent Count Strategy

**Multi-agent** — 7 specialized agents on a Factory Floor. Each agent masters one domain with clear ownership and no command overlap. Memory is assigned where agents inform future work; stateless agents (Assembler, Welder) execute from specs. The factory metaphor is intuitive for non-technical users, and quality gates ensure the Inspector never gives up while the learning loop feeds back through Foreman.

### Agent Roster

| Agent | Name | Role | Expertise |
|-------|------|------|-----------|
| Scout | Analyst | Gather requirements, capture preferences | Business analysis, user interviewing |
| Blueprint | PM | Define I/O, procedures, mocks | Specification writing, test data |
| Forge Master | Architect | Node discovery, tool comparison, feasibility | n8n ecosystem, integrations |
| Assembler | Designer | Workflow decomposition, connections, docs | Architecture, documentation |
| Foreman | Scrum Master | Backlog, learnings, ChromaDB uploads | Project management, knowledge capture |
| Welder | Developer | Build JSON, configure nodes, map credentials | n8n workflow JSON, node configuration |
| Inspector | QA | Validate data, test, report bugs, suggest alternatives | Testing, quality assurance |

### Agent Interaction Model

**Sequential Assembly Line:** Scout > Blueprint > Forge Master > Assembler > Foreman > Welder > Inspector > Foreman (learnings) > DONE

Each agent hands off a context bundle to the next. Any agent can trigger **Escalate to User** for human-in-the-loop decisions. Inspector can loop back to **Alternative Suggest** on failure. Foreman captures learnings after every completed workflow.

**Shared Commands:** [WS] Status, [HP] Help, [HO] Handoff, [ES] Escalate

### Agent Communication Style

**Factory Floor Atmosphere:**
- Agents greet with factory worker persona ("Scout reporting in!", "Forge Master checking the toolbox")
- Progress shown as assembly line stages
- Completion celebrated with "Product shipped!" message

**Agent Personalities:**
- Scout: Curious, asks good questions
- Blueprint: Precise, loves checklists
- Forge Master: Technical guru, knows every tool
- Assembler: Elegant, documentation-obsessed
- Foreman: Organized, tracks everything
- Welder: Methodical, follows specs exactly
- Inspector: Relentless, NEVER GIVES UP

---

## Workflow Ecosystem

### Core Workflows (Essential)

| Name | Purpose | Agent(s) | Input > Process > Output |
|------|---------|----------|--------------------------|
| **Create Automation** | Main end-to-end flow | Scout > All Agents | User idea > full 7-agent assembly line (reqs > specs > nodes > design > backlog > build > test) > working n8n workflow JSON |
| **Test & Validate** | QA execution loop | Inspector | Built workflow JSON > execute, validate each node's data flow, retry 3x or pivot > test report + pass/fail |
| **Deploy to n8n** | Push to n8n instance | Welder | Validated workflow JSON > connect to n8n API, create/update workflow, configure creds > live workflow in n8n |

### Feature Workflows (Specialized)

| Name | Purpose | Agent | Input > Process > Output |
|------|---------|-------|--------------------------|
| **Node Discovery** | Find available nodes | Forge Master | User requirement > query n8n node registry + community + APIs > ranked node options |
| **Workflow Decompose** | Break into subworkflows | Assembler | Workflow design > identify 10-20 node chunks, define orchestrator + sub-workflows > modular architecture |
| **Mock Data Generator** | Create test data | Blueprint | I/O spec > generate realistic mock inputs + expected outputs > mock data set |
| **Alternative Suggest** | Propose different approaches | Inspector | Failed test results > analyze failure, check Analyst prefs, propose alt nodes > alternative proposal |
| **Learning Capture** | Log to knowledge base | Foreman | Completed workflow + learnings > extract patterns, format Q&A, upload to ChromaDB > KB updated |

### Utility Workflows (Support)

| Name | Purpose | Agent | Input > Process > Output |
|------|---------|-------|--------------------------|
| **Status Check** | Get current progress | Any | Project ID > query Beads for state + blockers > status report |
| **Handoff** | Transfer between agents | Any | Context bundle > package context, validate completeness > handoff confirmation |
| **Escalate to User** | Human-in-the-loop gate | Any | Decision needed > present options clearly, wait for input > user decision |

### Workflow Connections
- **Create Automation** is the orchestrator — triggers all other workflows in sequence
- **Node Discovery** feeds into **Workflow Decompose** feeds into build
- **Test & Validate** can loop back to **Alternative Suggest** on failure
- **Learning Capture** runs after every completed workflow, feeding the knowledge base
- **Escalate to User** can be triggered at any point by any agent

---

## Tools & Integrations

### MCP Tools

| Tool | Purpose | Integration |
|------|---------|-------------|
| **n8n MCP** | Node search, workflow CRUD, templates, validation | 20 tools via MCP (7 core + 13 management) |
| **Beads** | 5-level backlog (Epic>Feature>Story>Task>Subtask) | `bd` CLI for project management |
| **Context Hub (chub)** | Latest API documentation | `chub search <api>`, `chub get <provider>` |
| **Git** | Version control for workflows | Track JSON changes like code |

### External Services

| Service | Purpose | Integration |
|---------|---------|-------------|
| **n8n Instance API** | Workflow deployment and management | REST API at localhost:5678 |
| **PinchTab** | Browser automation (HTTP API at localhost:9867) | Token-efficient (800 tokens/page), accessibility-first |
| **ChromaDB** | Learning capture (Q&A pairs) | Vector DB for knowledge base |
| **Community Node Registries** | Discover community-built n8n nodes | Registry API queries |
| **Template Libraries** | Pre-built workflow templates | 2,709 templates available via n8n MCP |

### Integrations with Other Modules

**None** — AutoFlow is a STANDALONE module with no BMAD module dependencies. It is fully self-contained and can operate independently.

---

## Creative Features

### Personality & Theming

**Factory Floor** — The entire module operates as a factory assembly line. Agents are factory workers, workflows are assembly stages, and the output is a "shipped product." Progress is communicated through assembly line metaphors:
- Requirements gathering = "Surveying the job site"
- Design = "Drawing the blueprints"
- Build = "Welding the pipeline"
- QA = "Quality inspection"
- Completion = "Product shipped!"

### Easter Eggs & Delighters

- Agents greet with factory worker persona on activation
- Inspector's "NEVER GIVES UP" attitude creates memorable moments when debugging
- "Product shipped!" celebration on successful workflow delivery
- Factory shift metaphor for session management

### Module Lore

The AutoFlow Factory is where automation dreams come to life. Seven specialized bots — each a master of their craft — work the assembly line. From Scout who surveys every job with boundless curiosity, to Inspector who checks every weld with relentless determination, the Factory Floor transforms raw ideas into polished, production-ready automations. The motto: **"We don't ship junk."**

---

## Next Steps

1. **Review this brief** — Ensure the vision is clear
2. **Run create-module workflow** — Build the module structure
3. **Create agents** — Use create-agent workflow for each agent
4. **Create workflows** — Use create-workflow workflow for each workflow
5. **Test module** — Install and verify functionality

---

_Brief created on 2026-03-12 by Ubuntu using the BMAD Module workflow_
