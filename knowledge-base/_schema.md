# Knowledge Base Schema — Shipquick Standard

## Folder Structure

```
knowledge-base/
├── _schema.md               ← This file (rules)
├── <project>/
│   ├── final/               ← Ships to GitHub on release (PRDs, arch docs, API specs)
│   ├── vectors/             ← ChromaDB only, never shipped
│   │   ├── arch/            ← Architecture decisions
│   │   ├── howto/           ← How-to guides
│   │   ├── pattern/         ← Code/design patterns
│   │   ├── debug/           ← Error solutions & fixes
│   │   └── rule/            ← Constraints, never/always rules
│   └── context.md           ← Human-readable summary (internal only)
```

**Projects:** shipquick | lifeos | sync | flex

---

## Q&A File Format (vectors/)

**Filename:** `<project>-<category>-<NNN>.qa.md`
Example: `lifeos-arch-001.qa.md`

**File contents:**
```
---
id: lifeos-arch-001
project: lifeos
category: arch
source: bmad-prd
source_file: knowledge-base/lifeos/final/prd-v1.md
created: YYYY-MM-DD
---

Q: <question>
A: <answer>

---

Q: <next question>
A: <next answer>

---
```

Each `---` separator = one vector in ChromaDB.

---

## Categories

| Category | When to use |
|---|---|
| `arch` | Architecture decisions, system design choices, why X was chosen |
| `howto` | Step-by-step instructions, how to run/use/configure something |
| `pattern` | Reusable code or design patterns, recurring solutions |
| `debug` | Error messages, root causes, fixes — searchable by error text |
| `rule` | Hard constraints: never do X, always do Y |

---

## Source Values

| Source | Meaning |
|---|---|
| `bmad-prd` | Generated from BMAD PRD approval |
| `bmad-arch` | Generated from BMAD Architecture approval |
| `bmad-epic` | Generated from BMAD Epics/Stories |
| `beads` | Generated from Beads issue close/retrospective |
| `manual` | Manually written by Satvik or Raju |

---

## What Goes to GitHub (final/)

| Document | Ships? |
|---|---|
| PRD | ✅ Yes |
| Architecture doc | ✅ Yes |
| API spec | ✅ Yes |
| Deployment guide | ✅ Yes |
| Q&A vectors | ❌ No (ChromaDB only) |
| context.md | ❌ No (internal) |
| Debug logs | ❌ No |
| Session notes | ❌ No |

---

## Numbering

Auto-increment per project+category combo:
- Count existing files in `vectors/<category>/`
- Next = count + 1, zero-padded to 3 digits
- Example: if 2 files exist → next is `003`
