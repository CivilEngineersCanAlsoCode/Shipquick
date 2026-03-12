# AGENTS.md — Shipquick Agent Protocol

> This is the operating manual for all AI agents working inside Shipquick.
> Read this before touching any file, any task, any code.

---

## 1. Golden Rules (Non-Negotiable)

| # | Rule |
|---|---|
| R1 | **Never grep/find for context** — always fetch from ChromaDB via N8N |
| R2 | **GoBlue = execution** — no task runs without Satvik saying GoBlue |
| R3 | **Beads first** — every task must exist in Beads before execution |
| R4 | **3 retries max, 5 min max** — then pivot: find root cause, break task, new approach |
| R5 | **Planning = Beads hierarchy shown to Satvik + approved** |
| R6 | **No markdown file reading during execution** — use `bd show` + ChromaDB |
| R7 | **Error logging** — any error/fix during a session must be: (1) fixed in scripts/setup, (2) noted in `setup/setup.md` change log, (3) uploaded as `.qa.md` to `vectors/debug/` in ChromaDB |

---

## 2. Session Boot Sequence

```
1. bd dolt start               # Start Beads DB
2. bd ready                    # See available (unblocked) tasks
3. fetch context from ChromaDB # GET relevant knowledge before acting
4. bd show <id>                # Read full task details
5. bd update <id> --status in_progress  # Claim task
6. Execute
7. bd close <id> --comment "what was done"  # Complete + unblock dependents
8. Repeat from step 2
```

---

## 3. Context Retrieval (MANDATORY)

Before writing any code or making any decision:

```bash
# Fetch from ChromaDB via N8N
curl -s -X POST http://localhost:5678/webhook/fetch-context \
  -H "Content-Type: application/json" \
  -d '{"chatInput": "<your question>", "collection": "<project>-qa"}'
```

**Collections:**
| Project | Collection |
|---|---|
| Shipquick OS | `shipquick-qa` |
| LifeOS | `lifeos-qa` |
| Sync | `sync-qa` |
| Flex | `flex-qa` |

**NEVER use:** `grep`, `find`, `cat` on markdown files for context.

---

## 4. Beads Task Hierarchy

**Workflow/Process (3 levels):**
```
Epic > Feature > Story
```

**Code Development (5 levels):**
```
Epic > Feature > Story > Task > Subtask/Bug
```

**Special Features (always inside Epic):**
```
"Bug Fixing & Refactors"  ← all bugs go here
"Miscellaneous"           ← unclassified work
```

**Beads commands:**
```bash
bd ready                          # What can I work on now?
bd show <id>                      # Full task details
bd update <id> --status in_progress  # Claim it
bd close <id> --comment "..."     # Done, unblocks dependents
bd create --type story --parent <feature-id> --title "..."
bd dep <blocker> --blocks <blocked>
bd list                           # Full tree view
```

---

## 5. Knowledge Upload Protocol

After completing any significant work:

```bash
# 1. Create .qa.md file in correct location
# knowledge-base/<project>/vectors/<category>/<project>-<category>-NNN.qa.md

# 2. Upload to ChromaDB
cd /home/ubuntu/MasterWorkspace/shipquick
python3 scripts/upload_qa.py knowledge-base/<project>/vectors/<category>/<file>.qa.md
```

**When to upload:**
- Bug fixed → `debug/` category
- Architecture decision made → `arch/` category
- Pattern discovered → `pattern/` category
- New rule established → `rule/` category
- Process documented → `howto/` category

---

## 6. BMAD Planning → Beads Execution Flow

```
Phase 1 (BMAD): PM + Architect + SM create docs
                ↓
                [Satvik approves]
                ↓
Phase 2 (Import): Run scripts/bmad_to_beads.py
                  → Creates full Beads hierarchy
                  → Wires dependencies
                  ↓
                  [Show bd dep tree → Satvik approves]
                  ↓
Phase 3 (Execute): bd ready → bd show → execute → bd close
                   Upload learnings to ChromaDB after each task
```

---

## 7. Infra Reference

| Service | URL | Notes |
|---|---|---|
| N8N | http://localhost:5678 | Workflows: fetch-context, upload-* |
| ChromaDB | http://localhost:8000 | 4 project collections |
| MCP Agent Mail | http://localhost:8765 | Agent coordination |
| Beads | `bd` CLI | Run `bd dolt start` first |

**N8N API Key:** in `.env` as `N8N_API_KEY`
**Gemini Key (account 2):** in `.env` as `GEMINI_API_KEY_2`

---

## 8. GitHub Release Checklist

Before pushing to GitHub release:
- ✅ Only `knowledge-base/<project>/final/` docs
- ❌ Never: `vectors/`, `context.md`, `.qa.md`, `.env`, `.beads/`
- Run: `git status` to verify `.gitignore` is working
