---
name: "step-04-register"
description: "Register Theme and Epic in Beads for tracking"

epicFile: "{sq_output_folder}/epic-{epic_id}.md"
themeFile: "{sq_output_folder}/theme-{theme_id}.md"
---

# Step 4: Register in Beads

**Progress: Step 4 of 4** — Final Step

## STEP GOAL:

Register the Strategic Theme and Portfolio Epic in the Beads persistent memory system for cross-session tracking.

## MANDATORY SEQUENCE

### 1. Beads Registration

Execute the following Beads operations:

- Run: `bd create "Strategic Theme: {theme_name}" --type epic`
- **Copy the ID** from the output (e.g., `Safe Agile Agentic Framework-qtc`).
- Run: `bd create "Portfolio Epic: {epic_name}" --type epic --parent <THEME_ID>`

### 2. Verify Links

Check that:

- Theme exists in Beads DB
- Epic exists in Beads DB
- Parent-child link is intact
- WSJF score is stored

### 3. Summary Report

"**✅ SAFe Hierarchy Initialized!**

**Strategic Theme:** {theme_name}
**Portfolio Epic:** {epic_name}
**WSJF Score:** {wsjf_score}
**Status:** FUNNEL → Ready for analysis

**Hierarchy so far:**

```
{theme_name} (THEME-001)
  └── {epic_name} (EPIC-001) [WSJF: {wsjf_score}]
```

**Next Steps:**

- Run `/sq analyze` to create the Lean Business Case
- Run `/sq solve` to decompose into Capabilities

Your theme and epic are now tracked in Beads and will persist across sessions."

### 4. Update Frontmatter

Update `{epicFile}` frontmatter:

```yaml
stepsCompleted:
  ["step-01-theme", "step-02-epic", "step-03-wsjf", "step-04-register"]
status: FUNNEL
beads_registered: true
```
