---
name: "step-04-register"
description: "Register Theme and Epic in Beads for tracking"

epicFile: "{sq_output_folder}/epic-{epic_id}.md"
themeFile: "{sq_output_folder}/theme-{theme_id}.md"
beadsCommand: "bd sync"
qualityGate: hard
---

# Step 4: Register in Beads

**Progress: Step 4 of 4** — Final Step

## PREREQUISITES CHECK

### Hard Gates (MUST pass — abort if any fail)

1. [ ] HG-01: Beads initialized -> `.beads/` exists
2. [ ] Theme and Epic documents exist with WSJF calculated
3. [ ] HG-07: WSJF calculated -> Epic frontmatter contains `wsjf` value > 0

**If ANY hard gate fails -> STOP. Display specific error. Do NOT proceed.**

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

## QUALITY GATE

- **PASS:** Both Theme and Epic exist in Beads DB, parent-child link verified, WSJF persisted.
- **FAIL:** Beads sync failed or hierarchy link broken (Hard Gate HG-01, HG-04).

## MEMORY CAPTURE

- Capture any session-level learnings in `global-learnings.md`.
- Update `portfolio-sidecar/common-mistakes.md` if any friction occurred.

## SESSION CLOSE

1. `bd sync` # Commit beads changes
2. `git add {sq_output_folder}/` # Stage artifact files
3. `git commit -m "feat: initialized SAFe hierarchy for {theme_name}"`
4. `bd sync`
5. `git push`

### 4. Update Frontmatter

Update `{epicFile}` frontmatter:

```yaml
stepsCompleted:
  ["step-01-theme", "step-02-epic", "step-03-wsjf", "step-04-register"]
status: FUNNEL
beads_registered: true
```
