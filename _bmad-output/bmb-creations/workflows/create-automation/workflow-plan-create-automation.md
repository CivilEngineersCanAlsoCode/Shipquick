---
conversionFrom: 'src/modules/atf/workflows/create-automation/create-automation.spec.md'
originalFormat: 'BMAD Placeholder Spec'
stepsCompleted: ['step-00-conversion', 'step-02-classification', 'step-03-requirements', 'step-04-tools', 'step-05-plan-review', 'step-06-design']
status: BUILDING
approvedDate: 2026-03-13
created: 2026-03-13
status: CONVERSION
---

# Workflow Creation Plan

## Conversion Source

**Original Path:** src/modules/atf/workflows/create-automation/create-automation.spec.md
**Original Format:** BMAD Placeholder Spec
**Detected Structure:** 8-step pipeline (outdated)

---

## Original Workflow Analysis

### Goal (from source)

Main end-to-end flow — take a user's automation idea through the full agent assembly line to produce a working n8n workflow JSON.

### Original Steps (Complete List)

**Step 1:** Requirements Gathering - Scout interviews user, captures automation idea
**Step 2:** I/O Specification - Blueprint defines inputs, outputs, schemas
**Step 3:** Node Discovery - Forge Master finds available n8n nodes
**Step 4:** Architecture Design - Assembler decomposes into workflows
**Step 5:** Backlog Creation - Foreman creates project backlog
**Step 6:** Build - Welder constructs n8n workflow JSON
**Step 7:** Test & Validate - Inspector validates data flow
**Step 8:** Learning Capture - Log learnings to ChromaDB

### Output / Deliverable

- Complete n8n workflow JSON (orchestrator + sub-workflows)
- Test report
- Architecture documentation

### Input Requirements

- User's automation idea/description
- Target platform(s) (e.g., X, Reddit, LinkedIn)
- (Optional) Preferred cost tier, existing credentials, schedule

### Key Instructions to LLM

- Sequential agent handoff pattern
- Each agent has specific persona and tools
- Use n8n-mcp for node operations
- Capture learnings to ChromaDB

---

## Conversion Notes

**What works well in original:**
- Clear step progression
- Agent-based responsibilities
- Defined inputs/outputs

**What needs improvement:**
- Agent count changed (7→5)
- Assembler merged into Forge Master
- Foreman elevated to orchestrator (not a step)
- Missing BMAD step-file architecture

**Compliance gaps identified:**
- No workflow.md entry point
- No steps/ folder with step files
- No data/ or templates/ folders
- Needs tri-modal structure consideration

---

## Updated Architecture (Sensible Defaults)

### New Step Structure (6 steps)

**Step 1:** Scout - Requirements Gathering
**Step 2:** Blueprint - Specification (complex only)
**Step 3:** Forge Master - Node Discovery + Architecture Design
**Step 4:** Welder - Build n8n Workflow
**Step 5:** Inspector - Test & Validate
**Step 6:** Delivery - Present to User + Capture Learnings

### Agent Mapping

| Old | New |
|-----|-----|
| Scout | Scout (unchanged) |
| Blueprint | Blueprint (complex path only) |
| Forge Master | Forge Master (expanded) |
| Assembler | Merged into Forge Master |
| Foreman | Elevated to Orchestrator |
| Welder | Welder (unchanged) |
| Inspector | Inspector (unchanged) |
