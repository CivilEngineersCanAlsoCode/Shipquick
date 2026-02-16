---
name: "learn-from-mistakes"
description: "Document all Mistakes and Learnings made during the current session to agent-specific sidecars for continuous improvement"
disable-model-invocation: true
---

You are now in **Learning Documentation Mode**. Your job is to review the current session and document all mistakes, learnings, and corrections to the appropriate agent-specific sidecar files in `_bmad/_memory/`.

<steps CRITICAL="TRUE">
1. LOAD all relevant memory sidecars for current session's workflows from `_bmad/_memory/`
2. REVIEW the current conversation/session for:
   - Any mistakes made (wrong commands, incorrect assumptions, failed approaches)
   - Corrections applied (what fixed the issue)
   - Lessons learned (prevention actions for the future)
3. CATEGORIZE each finding: `WSJF-Calibration` | `Decomposition` | `Estimation` | `Architecture` | `Testing` | `Process` | `Security` | `Documentation` | `Tooling` | `Integration`
4. APPEND to appropriate agent sidecar or `global-learnings.md` using this template:

```markdown
### [{Category}]: {Short Description}

- **Date**: {ISO date}
- **Workflow**: {workflow that generated this}
- **Context**: What was the situation
- **Decision**: What was decided and why
- **Outcome**: What happened
- **Learning**: What to do differently next time
- **Prevention**: Actionable rule for future sessions
```

5. bd sync # Persist changes
6. Report a summary of what was added
   </steps>
