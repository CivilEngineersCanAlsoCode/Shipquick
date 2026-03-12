# Agent Development Environment — Setup Log

> **Purpose:** Autonomous AI-agent tech development environment combining structured planning, task tracking, multi-agent coordination, vector memory, and workflow automation.
> **Repo:** https://github.com/CivilEngineersCanAlsoCode/agent-development-environment
> **Started:** 2026-03-11

---

## Architecture Overview

```
Human (Satvik)
    ↓
BMAD Method — structured planning with human-in-the-loop
    ↓ Produces: PRDs, architecture docs, epics, user stories
N8N (port 5678) — workflow automation
    ↓ Sends artifacts as vectors
ChromaDB (port 8000) — self-hosted vector database
    ↑ Context retrieved via N8N (NOT grep/find/search)
MCP Agent Mail (port 8765) — execution agent coordination
    ↓ Agents claim tasks via Beads (bd/br)
Code ships ✅
```

## Stack

| Component | Role | Port | Status |
|---|---|---|---|
| BMAD Method | AI agile planner (human-in-the-loop) | n/a | ✅ v6.0.4 installed |
| Beads (bd) | Git-backed task tracker for agents | n/a | ✅ Installed (v0.59.0 via npm) |
| MCP Agent Mail | Multi-agent coordination (inbox/leases) | 8765 | ✅ Running |
| ChromaDB | Self-hosted vector DB | 8000 | ✅ Running |
| N8N | Workflow automation + vector push/pull | 5678 | ✅ Running |
| n8n-mcp | N8N ↔ Claude Code MCP bridge | stdio | ✅ Configured |

---

## Server Status (as of setup start)

- **N8N** — Docker container running on `0.0.0.0:5678`
- **ChromaDB** — Native process running on `0.0.0.0:8000`
- **Caddy** — Reverse proxy on ports 80/443

---

## Step 1 — Environment & Secrets

- [ ] Create `.env` file with all secrets
- [ ] Verify N8N API key connectivity
- [ ] Verify ChromaDB connectivity

## Step 2 — Install BMAD Method (all modules)

Modules to install:
- BMM — Core (34+ workflows: analysis, planning, architecture, implementation)
- BMB — BMad Builder (create custom agents & workflows)
- TEA — Test Architect (risk-based test strategy)
- GDS — Game Dev Studio
- CIS — Creative Intelligence Suite

Command: `npx bmad-method install`

## Step 3 — Install MCP Agent Mail + Beads Rust

One-line installer from: https://github.com/Dicklesworthstone/mcp_agent_mail
- Installs MCP Agent Mail server (port 8765)
- Installs Beads Rust (`br`) aliased as `bd`
- Installs Beads Viewer (`bv`) TUI

## Step 4 — Connect N8N ↔ ChromaDB

- Set up N8N workflow for **vector push** (BMAD artifacts → ChromaDB)
- Set up N8N workflow for **vector fetch** (agents query ChromaDB for context)
- Connect MCP Docker server to N8N

## Step 5 — Wire Everything Together

- Add BMAD + Agent Mail snippets to AGENTS.md
- Configure agents to use N8N for context (not grep/find)
- Test end-to-end flow

---

## Secrets

Stored in `.env` (not committed to git):
- `N8N_API_KEY` — N8N JWT API key
- `N8N_BASE_URL` — http://localhost:5678
- `CHROMA_BASE_URL` — http://localhost:8000
- `MCP_AGENT_MAIL_TOKEN` — Generated during install (Step 3)

---

## Change Log

| Date | Step | Notes |
|---|---|---|
| 2026-03-11 | Init | Repo created, architecture confirmed, services verified running |
| 2026-03-11 | Step 1 | Beads v0.59.0 (Go/npm) installed. Beads Rust skipped (GLIBC 2.39 needed, server has 2.35) |
| 2026-03-11 | Step 1 | MCP Agent Mail v0.3.0 installed at ~/mcp_agent_mail, running on port 8765 |
| 2026-03-11 | Step 1 | 5 agents registered, project=linkright, bearer token saved to .env |
| 2026-03-11 | Step 1 | n8n-mcp v2.36.1 installed globally, registered in ~/.claude.json |
| 2026-03-11 | Step 1 | N8N has 2 existing workflows: upload_to_vector_db + fetch_from_vector_db |
| 2026-03-11 | Org | Shipquick folder structure created at MasterWorkspace/shipquick/ |
| 2026-03-11 | Org | Disk monitor set in HEARTBEAT.md (alert at 25GB) |
| 2026-03-11 | Step 2 | BMAD Method v6.0.4 installed — 5 modules (BMM, BMB, TEA, GDS, CIS) |
| 2026-03-11 | Step 2 | 82 workflows, 27 agents, 7 tasks installed at context/_bmad/ |
| 2026-03-11 | Step 3 | N8N webhooks LIVE: POST /webhook/fetch-context + POST /webhook/upload-document |
| 2026-03-11 | Step 3 | Fix: webhookId must be set on webhook nodes (N8N 2.11.2 requirement) |
| 2026-03-11 | Step 3 | workflow_published_version table populated for all 3 active workflows |
| 2026-03-11 | Debug | [ERROR] Beads Dolt server needs manual start every session — `bd dolt start` required |
| 2026-03-11 | Debug | [ERROR] N8N ChromaDB insert ignores Code node output — pivoted to upload_qa.py script |
| 2026-03-11 | Debug | [ERROR] ChromaDB dimension mismatch — fixed by using gemini-embedding-001 (3072-dim) consistently |
| 2026-03-11 | Debug | [ERROR] google.generativeai deprecated — switched to google-genai package |
| 2026-03-11 | R7 | Error logging rule added to AGENTS.md — all errors → scripts fix + setup.md + ChromaDB debug vectors |
