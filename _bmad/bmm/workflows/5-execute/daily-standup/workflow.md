---
name: "051 Daily Standup"
description: "Facilitate Daily Standup synchronization to inspect progress and adapt the iteration plan"
disable-model-invocation: false
---

# 051 Daily Standup Workflow

**Goal:** Conduct a 15-minute synchronization to align the team on the Iteration Goal and identify any blockers.

## PREREQUISITES

- [ ] Active Iteration with committed stories.
- [ ] Updated Task board (Beads status).

## EXECUTION STEPS

### 1. Opening

- Start on time.
- Remind the team: "Focus on syncing, not reporting to a boss."

### 2. Walk the Board (Right-to-Left)

- Start from the rightmost column (Done/Ready for Review).
- For each item in progress, have the owner answer:
  1. What did I complete since yesterday?
  2. What will I work on today?
  3. Is anything blocking me?

### 3. Capture Blockers

- Identify any impediments.
- Moving deeper technical or complex discussions to the **Parking Lot**.

### 4. Closing

- Confirm daily priorities.
- "Great, let's go build."

## BEADS INTEGRATION

- Run `bd status` or `bd list --status=open` to show the current board state.
