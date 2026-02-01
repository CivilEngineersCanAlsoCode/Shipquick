# PI Planning Instructions (SAFe 6.0.1)

<critical>The workflow execution engine is governed by: {project-root}/\_bmad-safe/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/\_bmad-safe/bmm-safe/workflows/4-implementation/pi-planning/workflow.yaml</critical>

## Purpose

PI Planning is a cadence-based, face-to-face (or virtual) event that serves as the heartbeat of the ART, aligning all teams on a shared mission and Vision.

## Pre-Requisites Check

Before starting, verify:

- [ ] Product Vision document exists
- [ ] PI Roadmap is current
- [ ] Top 10 Features are prioritized (WSJF)
- [ ] Architecture vision is prepared
- [ ] Team capacities are known

---

## Day 1: Vision & Planning

### Step 1: Business Context (1 hour)

**Facilitator:** RTE with Senior Leadership

Present:

- Current business state
- Strategic themes
- Market conditions
- PI objectives from leadership perspective

### Step 2: Product Vision (1.5 hours)

**Presenter:** Product Management

Share:

- Solution Vision
- PI Roadmap (Current + Next 2 PIs)
- Top 10 Features with WSJF scores
- Key milestones and dependencies

### Step 3: Architecture Vision (1 hour)

**Presenter:** System Architect

Cover:

- Solution Intent updates
- Architectural Runway status
- Key enablers for this PI
- NFRs and constraints

### Step 4: Team Breakouts (4 hours)

**Teams:** Self-organize

Activities:

1. Review assigned Features
2. Create draft PI Objectives
3. Identify dependencies
4. Estimate capacity
5. Draft iteration plans

### Step 5: Draft Plan Review (1 hour)

**All Teams:**

Each team presents:

- Draft PI Objectives
- Key dependencies (red strings)
- Risks identified

---

## Day 2: Finalization

### Step 6: Planning Adjustments (2 hours)

**Facilitator:** RTE

Address:

- Cross-team dependencies
- Scope adjustments
- Load balancing

### Step 7: Team Breakouts (continued) (3 hours)

Finalize:

- PI Objectives (Committed + Uncommitted)
- Iteration plans
- Dependency agreements

### Step 8: Final Plan Review (1 hour)

Each team presents final:

- Committed PI Objectives with Business Value
- Uncommitted Objectives
- Resolved dependencies

### Step 9: ROAM Risks (30 minutes)

**Facilitator:** RTE

Categorize all identified risks:

- **R**esolved
- **O**wned
- **A**ccepted
- **M**itigated

### Step 10: Confidence Vote (15 minutes)

**All Teams:**

Fist of Five vote:

- 5 = High confidence
- 4 = Confident with concerns
- 3 = Need discussion
- 2 = Significant concerns
- 1 = Cannot commit

**Target:** Average of 4 or higher

### Step 11: Planning Retrospective (30 minutes)

What went well? What to improve?

---

## Outputs

Generate using templates:

1. `pi-objectives-template.md` - Per team
2. `roam-risk-template.md` - ART-level
3. ART Planning Board visualization
