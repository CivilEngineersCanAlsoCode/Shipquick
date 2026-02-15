# 🛠️ Shipquick Enterprise: VS Code + GitHub Copilot Setup Guide

Since Visual Studio Code with GitHub Copilot operates differently than a native Agentic Environment like Antigravity, you need to follow these steps to "Activate" the Shipquick Factory within your IDE.

---

## 1. 🧩 Required Extensions

For the best experience, ensure you have these installed:

- **GitHub Copilot** & **GitHub Copilot Chat**: The core engine.
- **Mermaid Editor / Preview**: To view the architecture diagrams in `readme.md`.
- **Markdown All in One**: For better navigation of large documentation files.
- **YAML**: To edit BMad configuration files with schema support.

---

## 2. 🤖 Activating Your Agents

In VS Code, Copilot doesn't automatically show the "Agent Menu". You have to trigger it manually using the `#` symbol in **Copilot Chat**.

### How to trigger an Agent:

1.  Open **Copilot Chat** (`Cmd+Shift+I` or the sidebar).
2.  Type: `Act as #bmad-agent-bmm-dev.md` (or any other agent from `.github/agents/`).
3.  Copilot will read the instructions and present you with the agent's **Welcome Menu**.

---

## 3. 📜 Running Workflows

Antigravity's `/` commands are replaced by **File Referencing** in VS Code.

### How to run a Workflow:

1.  Find the workflow you want in `.agent/workflows/` (e.g., `005-create-product-brief.md`).
2.  In Chat, type: `Follow the steps in #005-create-product-brief.md`
3.  Copilot will guide you through the process step-by-step.

---

## 4. 🧠 Stateful State Management (Beads)

GitHub Copilot cannot directly run terminal commands on your behalf yet. You must keep your **Integrated Terminal** open.

### The Power Duo:

- **Copilot**: Does the thinking and code generation.
- **Terminal (`bd`)**: Records the facts in the Beads database.

**Pro Tip**: Whenever Copilot completes a task, run this in your terminal:

```bash
bd create "Implemented the XYZ Module" --completed
bd sync
```

This ensures your "Real World" (Files) matches your "Agentic World" (Database).

---

## 📏 Golden Rules for Copilot in VS Code

- **Always use `@workspace`**: If you want Copilot to understand the whole SAFe hierarchy, start your prompt with `@workspace`.
- **Reference `agents.md`**: If Copilot gets "dumb," type `Read #agents.md and follow the factory rules.`
- **Check `gemini.md`**: Before starting new work, tell Copilot: `Read #gemini.md and tell me what mistakes to avoid based on our history.`

---

**Made with love by Satvik Jain** ❤️  
_Empowering engineers to lead the AI revolution._
