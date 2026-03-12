# 🚀 Shipquick — Autonomous Agent Development OS

> The foundation. Build once, ship unlimited products.

## What is Shipquick?

Shipquick is a fully autonomous AI development environment. It combines structured planning, task tracking, multi-agent coordination, and vector memory into one integrated OS for building products with AI agents.

## Architecture

```
Human (Satvik)
    ↓
BMAD Method          → Structured planning, PRDs, epics (human-in-the-loop)
    ↓
Beads (bd)           → Task tracking: epic > feature > story > task > subtask
    ↓
N8N (port 5678)      → Automation: push artifacts → ChromaDB, fetch context
    ↓
ChromaDB (port 8000) → Vector memory (NO grep/find — always use N8N to fetch)
    ↑
MCP Agent Mail       → Multi-agent coordination (port 8765)
    ↓
Code ships ✅
```

## Stack

| Tool | Role | Port | Status |
|---|---|---|---|
| BMAD Method | AI agile planner | — | ⏳ Install next |
| Beads (bd) | Task tracker | — | ✅ v0.59.0 |
| MCP Agent Mail | Agent coordination | 8765 | ✅ Running |
| N8N | Workflow automation | 5678 | ✅ Running |
| ChromaDB | Vector DB | 8000 | ✅ Running |
| n8n-mcp | N8N ↔ Claude Code bridge | stdio | ✅ Configured |

## Folder Structure

```
shipquick/
├── README.md          ← This file
├── .env               ← All secrets (gitignored)
├── .gitignore
├── setup/
│   └── setup.md       ← Step-by-step setup log
├── context/           ← BMAD method will install here
├── agents/            ← Agent configs and personas
├── n8n/
│   └── workflows/     ← Exported N8N workflow JSONs
└── docs/              ← Architecture decisions, guides
```

## Golden Rules

1. **Never grep/find for context** — always use N8N `fetch_from_vector_db`
2. **Planning first** — BMAD before any code
3. **Beads for everything** — every task tracked, nothing in your head
4. **Human in the loop** — approve plans before execution
5. **3 retries max, 5 min wait max** — if stuck, pivot immediately. Find root cause, break task, try different approach
6. **Always log tasks** — every task in Beads + setup.md before execution
7. **No plan → no execution** — koi bhi lamba task sirf tab execute hoga jab Beads mein full hierarchy bani ho aur Satvik ne approve kiya ho
7. **Workflow hierarchy** — Epic > Feature > Story (3 levels)
8. **Code hierarchy** — Epic > Feature > Story > Task > Subtask/Bug (5 levels)
9. **Bugs** → separate "Bug Fixing" feature inside the relevant Epic
10. **Miscellaneous effort** → separate feature inside Epic if no other feature fits

## Products Built With Shipquick

- **LinkRight** — AI career platform (Sync + Flex + LifeOS modules)
