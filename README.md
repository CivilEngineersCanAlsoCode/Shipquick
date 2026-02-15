<<<<<<< HEAD
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
=======
# Shipquick Enterprise

**The Agentic AI Software Factory for SAFe 6.0**

Shipquick automates the creation of an enterprise-grade development environment where Humans and AI Agents collaborate. It combines **BMad Method** (Agent Workflows), **SAFe 6.0** (Scaled Agile), and **Beads** (State Management) into a single, deployable framework.

---

## 🚀 How It Works (The Flow)

```mermaid
graph TD
    A[Start: npx shipquick@latest install] -->|Initialize| B(Detect Environment)
    B --> C{Select Modules}
    C -->|Core| D[Install Agents & Tasks]
    C -->|SAFe| E[Setup Portfolio/ART/Team]
    C -->|TEA| F[Setup Test Architecture]
    D & E & F --> G[Generate Configs]
    G --> H[Final Project Scaffold]
    H --> I[Ready to Code]
>>>>>>> 986c389 (docs: Rewrite readme.md with user guide and mermaid)
```

---

<<<<<<< HEAD
**Made with ❤️ by CivilEngineersCanAlsoCode**
=======
## 🎓 Step-by-Step Training Guide

Follow these steps to transform an empty folder into a fully functional Agentic Software Factory.

### Step 1: Initialize the Factory

Open your terminal in the folder where you want to build your project.

```bash
# Run the installer (No download required)
npx shipquick@latest install
```

### Step 2: Configure Your Factory

The installer will guide you through a setup wizard.
Make the following selections for a complete Enterprise setup:

1.  **Project Name**: Enter your project name (e.g., `MyEnterpriseApp`).
2.  **Modules**:
    - ✅ **Shipquick Core**: (Required) Installs base Agents (Analyst, Dev, Architect).
    - ✅ **BMad Method**: Adds 50+ standard workflows.
    - ✅ **SAFe 6.0**: Adds Portfolio, Solution, and Agile Release Train (ART) structure.
    - ✅ **Test Architect (TEA)**: Adds enterprise testing frameworks.
3.  **IDE Integration**: Select your AI Editor (VS Code, Cursor, Windsurf, GitHub Copilot).

### Step 3: Verify the Setup

Once installed, you will see a new directory structure:

- 📂 **`.agent/`**: Contains all Workflow definitions.
- 📂 **`_bmad/`**: Contains the Brain of the system (Agents & Tasks).
- 📂 **`_bmad/sq/`**: SAFe Hierarchy (Portfolio/Epics/Stories).
- 📄 **`agents.md`**: The rulebook for your AI Agents.

### Step 4: Start Building

You are now ready to use **Agentic Workflows**.
For example, to start a new feature:

1.  Open `agents.md` to see available specialized agents.
2.  Use **Beads** (installed automatically) to track your work:
    ```bash
    bd create " Implement User Login"
    ```
3.  Or execute a workflow directly via your IDE's AI Command palette.

---

## 📦 For Contributors

If you want to modify the Shipquick installer itself:

- **Source Code**: Located in `_npm-package/`.
- **Build**: Run `npm run bundle` inside `_npm-package/`.
- **Test**: Run `npm link` and then `shipquick install` to test local changes.

---

**Repository**: [Shipquick-enterprise](https://github.com/CivilEngineersCanAlsoCode/Shipquick-enterprise)
**Maintained by**: CivilEngineersCanAlsoCode
>>>>>>> 986c389 (docs: Rewrite readme.md with user guide and mermaid)
