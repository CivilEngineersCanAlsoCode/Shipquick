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

## 5. ⚡ Advanced: Terminal Automation & Agent Mode

**GitHub Copilot (2025+ Updates)** now supports semi-autonomous command execution. You can enable this to allow Copilot to run `bd` commands for you.

### Enable Agent Mode:

1.  Use **VS Code Insiders** or ensure you have the latest Copilot Chat update.
2.  Look for the **"Agent"** toggle or mode in the Chat sidebar.
3.  When using Agent mode, Copilot can say: _"I will run `bd create ...`. Do you want to proceed?"_

### Auto-Approve Commands:

If you want Copilot to run `bd` without asking every time, add this to your `settings.json`:

```json
"chat.tools.terminal.autoApprove": true
```

> [!WARNING]
> Only enable this if you trust the repository! This allows the AI to execute commands in your shell.

---

## 6. 🔌 Power User: MCP (Model Context Protocol)

Shipquick is built on MCP principles. GitHub Copilot Chat now supports **MCP Servers**.
If you want Copilot to have deep, native access to the Beads database:

1.  Install an **MCP Client extension** in VS Code.
2.  Point it to the `bd` binary or a Beads MCP server (if configured).
3.  Copilot will then be able to "See" the state database directly without you needing to type `#` files.

---

**Made with love by Satvik Jain** ❤️  
_Empowering engineers to lead the AI revolution._
