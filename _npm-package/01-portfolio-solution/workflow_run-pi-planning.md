# PI Planning Workflow

## Purpose

Orchestrate the Program Increment (PI) Planning event — the critical 2-day ceremony where the entire ART aligns on objectives, resolves dependencies, and commits to the PI plan.

## Pre-Conditions

- Portfolio Epics and Capabilities are refined and prioritized.
- Features are in the Program Backlog with acceptance criteria.
- All ART teams, stakeholders, and Business Owners are available.
- Previous PI's Inspect & Adapt findings have been reviewed.

## Workflow Steps

### Day 1: Alignment & Vision

#### Step 1: Business Context (1 hour)

1. **Business Owner** presents:
   - Current market conditions and strategic themes.
   - Key business objectives for this PI.
   - Revenue targets and customer commitments.
2. **Product Manager** presents:
   - Vision and top 10 Features for the PI.
   - Feature priority order (WSJF ranked).
   - Any non-negotiable deadlines.

#### Step 2: Architecture Vision (30 min)

1. **System Architect** presents:
   - Architecture runway status.
   - Enablers needed this PI.
   - Technical debt items to address.
   - Integration points and constraints.

#### Step 3: Planning Context & Logistics (15 min)

1. **RTE (Release Train Engineer)** explains:
   - PI cadence (number of iterations, IP iteration).
   - Planning process and expected outputs.
   - Dependency identification protocol.
   - Confidence vote process.

#### Step 4: Team Breakout #1 (2 hours)

Each team:

1. Reviews the Features assigned/selected.
2. Breaks Features into **User Stories**.
3. Estimates stories using story points.
4. Identifies **risks and dependencies**.
5. Creates draft **Team PI Objectives**.
6. Flags any capacity concerns.

#### Step 5: Draft Plan Review (1 hour)

1. Each team presents their draft plan (5 min each).
2. Highlight:
   - Committed vs. Uncommitted objectives.
   - Dependencies on other teams (with team names).
   - Risks flagged.
3. **Dependency Board** is updated in real-time.

### Day 2: Refinement & Commitment

#### Step 6: Planning Adjustments (30 min)

1. **RTE** reviews overnight concerns.
2. **PM/PO** adjusts Feature scope based on Day 1 feedback.
3. Cross-team dependency owners meet to resolve conflicts.

#### Step 7: Team Breakout #2 (2 hours)

Each team:

1. Finalizes User Stories and estimates.
2. Resolves dependencies (confirm with other teams).
3. Finalizes **Team PI Objectives** (Committed + Uncommitted).
4. Builds the **Iteration Plan** (stories mapped to iterations).
5. Identifies remaining **risks** with mitigation plans.

#### Step 8: Final Plan Review (1.5 hours)

1. Each team presents final plan (5 min each):
   - PI Objectives (Business Value assigned by Business Owners).
   - Iteration-by-iteration story plan.
   - Resolved and unresolved dependencies.
   - Risks with ROAM classification.

#### Step 9: ROAM Risk Analysis (30 min)

Classify all program risks:

| Classification | Meaning                           | Action                |
| -------------- | --------------------------------- | --------------------- |
| **Resolved**   | Risk is no longer a concern       | Archive               |
| **Owned**      | Someone is responsible            | Track with owner      |
| **Accepted**   | Risk exists, impact is manageable | Monitor               |
| **Mitigated**  | Actions taken to reduce impact    | Track mitigation plan |

#### Step 10: Confidence Vote (15 min)

1. **RTE** asks: "On a scale of 1-5, how confident are you that we can achieve the PI Objectives?"
2. All team members vote simultaneously (fist of five).
3. **Threshold**: Average must be ≥ 3.
4. If < 3: Identify concerns, adjust plan, re-vote.
5. If ≥ 3: **PI Plan is committed.**

## Output

- Team PI Objectives (with Business Value scores).
- Program Board (Feature-to-Iteration mapping with dependencies).
- ROAM Risk Board.
- Confidence vote result.
- Saved to `{output_folder}/pi-planning/`.

## Post-PI Planning

1. **RTE** publishes the PI Plan to all stakeholders.
2. **SM** updates team backlogs with committed stories.
3. **Iteration 1** begins immediately.
