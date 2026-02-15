# 🚀 Shipquick Enterprise (BMad + SAFe 6.0)

**The AI-Powered Scaled Agile Framework for Agentic Development**

Shipquick is an enterprise-grade framework that combines the **BMad Method** (Agent-driven development) with **SAFe 6.0** (Scaled Agile Framework) and **Beads** (Local State Management).

---

## What is Shipquick?

Shipquick gives you a team of **18 specialized AI agents** to help you build software - from initial idea to production code. It provides structured, automated workflows (35+) designed to scale agile development in your IDE.

### Key Features

- 🤖 **18 AI Agents** - Each with specialized expertise (PM, Architect, Dev, QA, etc.)
- 📋 **35 Workflows** - Structured processes from ideation to deployment
- 🔄 **SAFe 6.0.1 Aligned** - Enterprise-grade agile methodology
- 🔗 **Beads State Tracking** - Never lose work context between sessions
- 📁 **IDE Integration** - Optimized for Cursor, VS Code, and Windsurf

---

## Quick Start

### For New Users (Install Framework)

Run the installer to set up a new project with Shipquick agents and workflows:

```bash
npx shipquick@latest install
```

This will:

- ✅ Copy the `_bmad/` folder to your project
- ✅ Install Beads CLI for task tracking
- ✅ Initialize Beads state
- ✅ Configure IDE integration

### For Contributors (Modify Installer)

The installer source code is located in `_npm-package/`. To build and test locally:

```bash
cd _npm-package
npm install
npm run bundle
npm link
shipquick install
```

---

## 🤖 The AI Team

| Agent        | Role                   | Context                       |
| ------------ | ---------------------- | ----------------------------- |
| `/analyst`   | Business Analysis      | Market research & Ideation    |
| `/pm`        | Product Management     | Requirements & Prioritization |
| `/architect` | System Architecture    | Tech decisions & Design       |
| `/dev`       | Development            | Code implementation           |
| `/qa`        | Quality Assurance      | Testing & Automation          |
| `/sm`        | Scrum Master           | Sprint management & tracking  |
| `/rte`       | Release Train Engineer | PI Planning & Coordination    |

---

## 🔄 Repository Structure

- **`_bmad/`**: Core framework definitions (Agents, Tasks).
- **`.agent/`**: Workflow definitions (Phases 1-6).
- **`_npm-package/`**: Source code for the CLI installer.
- **`.beads/`**: Local state database (for Contributors).
- **`_bmad-output/`**: Generated artifacts and reports.
- **`agents.md`**: Agent manifesto and rules.

---

## 🔗 State Management (Beads)

Shipquick uses [Beads](https://github.com/steveyegge/beads) for local state management. This ensures that agents remember previous task context, WSJF scores, and design decisions across different sessions.

```bash
bd list       # See task hierarchy
bd stats      # Database health check
bd ready      # View next actionable items
```

---

**Made with ❤️ by CivilEngineersCanAlsoCode**
