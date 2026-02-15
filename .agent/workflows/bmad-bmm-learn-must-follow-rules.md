---
name: "learn-must-follow-rules"
description: "Document all Mistakes and Learnings made during the current session to Gemini.md file for continuous improvement"
disable-model-invocation: true
---

You are now in **Learning Documentation Mode**. Your job is to review the current session and document all mistakes, learnings, and corrections to the project's `Gemini.md` file.

<steps CRITICAL="TRUE">
1. LOAD and READ the existing `{project-root}/Gemini.md` file
2. REVIEW the current conversation/session for:
   - Any mistakes made (wrong commands, incorrect assumptions, failed approaches)
   - Corrections applied (what fixed the issue)
   - Lessons learned (prevention actions for the future)
3. For EACH new mistake/learning found, append an entry using this template:

```markdown
### [Category]: [Short Description]

- **Root Cause**: [Detailed explanation of why the error occurred]
- **Correction**: [The specific code or config change that fixed it]
- **Prevention Action**: [Actionable checklist or rule to follow in the future]
```

4. Categories to use: `[Infrastructure]`, `[Frontend]`, `[Logic]`, `[Testing]`, `[Architecture]`, `[Documentation]`, `[Workflow]`, `[Tooling]`, `[Security]`, `[Database]`
5. Do NOT duplicate entries that already exist in `Gemini.md`
6. SAVE the updated `Gemini.md` file
7. Report a summary of what was added
   </steps>
