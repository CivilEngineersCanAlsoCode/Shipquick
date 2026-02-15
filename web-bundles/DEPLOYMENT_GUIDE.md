# 🚀 Shipquick Enterprise: ChatGPT Deployment Guide

This guide describes how to manually set up your **5-Agent Shipquick Factory** using Custom ChatGPT models.

---

## 🏗️ The Factory Architecture

We have consolidated the Shipquick framework into 5 specialized models to respect context limits and prevent agent confusion.

| Model Name               | Role                            | Core Logic File                  | Knowledge Folder    |
| :----------------------- | :------------------------------ | :------------------------------- | :------------------ |
| **Bmad Master**          | Orchestrator & Governance       | `bmad-master/config.md`          | `bmad-master/`      |
| **Vision Factory**       | Problem & Vision (PM/Analyst)   | `vision-factory/config.md`       | `vision-factory/`   |
| **Architecture Factory** | Blueprints & UX (Architect/UX)  | `arch-ux-factory/config.md`      | `arch-ux-factory/`  |
| **Delivery Factory**     | Sprint & Stories (Dev/SM)       | `delivery-factory/config.md`     | `delivery-factory/` |
| **Quality Factory**      | Verification & Docs (QA/Writer) | `quality-docs-factory/config.md` | `quality-docs/`     |

---

## 🛠️ Step-by-Step Setup

### Step 1: Create the Custom GPT

1. Log in to [chatgpt.com](https://chatgpt.com) and go to **Explore GPTs** -> **Create**.
2. Go to the **Configure** tab.

### Step 2: Input Metadata & Logic

1. **Name, Description, & Icon**: Copy these from the `config.md` of the target factory in `_deployments/chatgpt/`.
2. **Instructions (System Message)**: Copy the "System Message" section from the `config.md`.

### Step 3: Upload Knowledge Bundles

For each model, upload the relevant templates and guides from `_deployments/chatgpt/templates/` as specified in their `config.md`.

> [!IMPORTANT]
> You can upload up to 20 files. Always prioritize the **Context Bridge** and the **Specific Artifact Template**.

### Step 4: Configure Conversation Starters

Use the "Conversation Starters" provided in the `config.md` to bootstrap your interactions.

---

## 📏 Working with the Factory (The Handoff Flow)

1.  **Start with Bmad Master**: Define your high-level intent.
2.  **Move to Vision**: Generate your Portfolio Epic and PRD.
3.  **Move to Architecture**: Generate your Technical Blueprint.
4.  **Move to Delivery**: Break the blueprint into Stories.
5.  **Move to Quality**: Verify the stories against the PRD.
6.  **Cycle Back**: If the Bmad Master flags a "Rework Required" via a **Change Manifest**, return to the appropriate sub-agent.

**Handoff Mechanism**: Always save the output of one agent as a `.md` file and upload it to the next agent as its first prompt.

---

**Made with love by Satvik Jain** ❤️  
_Empowering engineers to lead the AI revolution._
