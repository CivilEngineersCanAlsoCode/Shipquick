# BMAD-Beads Integration Rules

## Single Source of Truth

Beads (`.beads/`) is the ONLY system for:

- Long-term memory
- Task planning
- Dependency tracking
- Execution state
- Session-to-session continuity

## BMAD Responsibilities

- Reasoning and decomposition
- Prioritization decisions
- Decision making

## Beads Responsibilities

- Storing every task created by BMAD
- Storing all dependencies
- Storing execution state

## Integration Contract

| BMAD Action       | Beads Command                     |
| ----------------- | --------------------------------- |
| Create plan step  | `bd create "Title" -p <priority>` |
| Add dependency    | `bd dep add <child> <parent>`     |
| Complete task     | `bd done <id>`                    |
| Get next task     | `bd ready`                        |
| Show task details | `bd show <id>`                    |
| List all tasks    | `bd list`                         |

## Execution Loop

```
1. On startup:
   - Check `bd list` for existing tasks
   - If empty, create root task

2. Planning phase:
   - BMAD generates plan
   - Each step → `bd create`

3. Execution phase:
   - Run `bd ready`
   - Execute ONE ready task
   - Mark complete → `bd done <id>`

4. Repeat until `bd ready` is empty
```

## Strict Rules

1. **Beads = Single Source of Truth**
2. Information not in Beads = NON-EXISTENT
3. Never recreate plans already in Beads
4. On restart, ALWAYS read from Beads first

## Hierarchy

```
bmad-safe-xxxx          (Epic/Root)
bmad-safe-xxxx.1        (Task)
bmad-safe-xxxx.1.1      (Sub-task)
```
