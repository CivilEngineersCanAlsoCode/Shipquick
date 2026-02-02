# 🚀 Shipquick

**AI-Powered Agile Development Framework**

One command to set up a complete AI agent team for your software projects.

```bash
npx shipquick install
```

---

## What is Shipquick?

Shipquick is an **AI-powered development framework** that gives you a team of 18 specialized AI agents to help you build software - from initial idea to production code.

Think of it as having a **complete software team** (Product Manager, Architects, Developers, QA, Scrum Master, etc.) available in your IDE, all coordinated through proven agile methodologies.

### Key Features

- 🤖 **18 AI Agents** - Each with specialized expertise (PM, Dev, QA, UX, etc.)
- 📋 **35 Workflows** - Structured processes from ideation to deployment
- 🔄 **SAFe 6.0.1 Aligned** - Enterprise-grade agile methodology
- 🔗 **Beads State Tracking** - Never lose work context between sessions
- 📁 **Works in Any Project** - Just run `npx shipquick install`

---

## Quick Start

### 1. Install

```bash
# Navigate to your project folder
cd my-project

# Run the installer
npx shipquick install
```

This will:

- ✅ Copy the `_bmad-safe/` folder to your project
- ✅ Install Beads CLI for task tracking
- ✅ Initialize Beads state

### 2. Start an Agent

In **Cursor IDE** chat, type any agent command:

```
/analyst    → Start business analysis
/pm         → Start product management
/dev        → Start development
```

### 3. Follow the Workflow

Each agent will guide you through their specialized workflow with menus and prompts.

---

## The AI Team

| Agent          | Name    | What They Do                         |
| -------------- | ------- | ------------------------------------ |
| `/analyst`     | Mary    | Business analysis, market research   |
| `/pm`          | John    | Product requirements, prioritization |
| `/architect`   | Winston | System architecture, tech decisions  |
| `/dev`         | Amelia  | Code implementation                  |
| `/qa`          | Quinn   | Testing, quality assurance           |
| `/sm`          | Bob     | Sprint management, story tracking    |
| `/po`          | Oliver  | Backlog management, story refinement |
| `/rte`         | Derek   | PI Planning, ART coordination        |
| `/ux-designer` | Sally   | UX design, wireframes                |

[See all 18 agents →](#all-agents)

---

## Typical Project Flow

```
1. /analyst          → Brainstorm & research your idea
2. /pm               → Create PRD (Product Requirements)
3. /architect        → Design system architecture
4. /pm               → Create epics and stories
5. /sm               → Sprint planning
6. /dev              → Implement stories
7. /qa               → Test automation
8. /sm               → Retrospective
```

---

## Beads: Task State Management

Shipquick includes **Beads** - a hierarchical task tracker that remembers your work across sessions.

```bash
bd list       # See task hierarchy
bd ready      # What's next?
bd done T-001 # Mark task complete
```

When you start an agent, it automatically checks for pending work:

```
"Found pending tasks. [R]esume / [N]ew?"
```

---

## All Agents

### Core Team

| Command        | Role             |
| -------------- | ---------------- |
| `/analyst`     | Business Analyst |
| `/pm`          | Product Manager  |
| `/architect`   | System Architect |
| `/dev`         | Developer        |
| `/qa`          | QA Engineer      |
| `/sm`          | Scrum Master     |
| `/ux-designer` | UX Designer      |
| `/tech-writer` | Technical Writer |

### SAFe Roles

| Command               | Role                    |
| --------------------- | ----------------------- |
| `/po`                 | Product Owner           |
| `/rte`                | Release Train Engineer  |
| `/ste`                | Solution Train Engineer |
| `/solution-manager`   | Solution Manager        |
| `/solution-architect` | Solution Architect      |
| `/system-architect`   | System Architect        |
| `/business-owner`     | Business Owner          |
| `/ux-researcher`      | UX Researcher           |

### Quick Development

| Command                | Role                  |
| ---------------------- | --------------------- |
| `/quick-flow-solo-dev` | Fast solo development |
| `/bmad-master`         | System orchestrator   |

---

## All Workflows

### Analysis Phase

- `/brainstorm-project` - Ideation
- `/market-research` - Market analysis
- `/create-brief` - Product brief

### Planning Phase

- `/create-prd` - Product requirements ⭐
- `/create-ux` - UX design
- `/validate-prd` - PRD validation

### Solutioning Phase

- `/create-architecture` - Architecture ⭐
- `/create-epics-and-stories` - Epics & Stories ⭐
- `/create-capability` - SAFe Capabilities
- `/check-implementation-readiness` - Readiness check ⭐

### Implementation Phase

- `/pi-planning` - PI Planning ⭐
- `/sprint-planning` - Sprint setup ⭐
- `/create-story` - Story creation ⭐
- `/dev-story` - Implementation ⭐
- `/code-review` - Code review
- `/retrospective` - Retrospective
- `/art-sync` - ART Sync
- `/inspect-adapt` - I&A event

### Anytime

- `/quick-spec` - Quick tech spec
- `/quick-dev` - Quick development
- `/document-project` - Documentation
- `/correct-course` - Course correction

⭐ = Key milestones in the workflow

---

## Configuration

Edit `_bmad-safe/bmm-safe/config.yaml`:

```yaml
user_name: "Your Name"
communication_language: "English" # or "Romanised Hindi"
output_folder: "{project-root}/_bmad-output"
```

---

## Requirements

- **Node.js** 14+ (for Beads CLI)
- **Cursor IDE** (recommended) or any AI-enabled IDE
- **npm** access

---

## Links

- **NPM Package**: [npmjs.com/package/shipquick](https://www.npmjs.com/package/shipquick)
- **GitHub**: [github.com/CivilEngineersCanAlsoCode/Shipquick](https://github.com/CivilEngineersCanAlsoCode/Shipquick)
- **Beads**: [github.com/steveyegge/beads](https://github.com/steveyegge/beads)

---

## License

MIT

---

**Made with ❤️ by Satvik Jain**
