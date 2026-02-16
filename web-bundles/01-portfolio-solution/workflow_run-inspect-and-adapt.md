# Inspect & Adapt Workflow

## Purpose

Conduct the SAFe Inspect & Adapt (I&A) event at the end of each Program Increment. This is a structured retrospective at scale that combines a quantitative review, a qualitative retrospective, and a problem-solving workshop to drive continuous improvement.

## Pre-Conditions

- PI has completed (all iterations finished).
- PI metrics are compiled (velocity, quality, objectives met).
- All ART teams, stakeholders, and Business Owners are available.

## Workflow Steps

### Part 1: PI System Demo (1 hour)

#### Step 1: Showcase Integrated Solution

1. Each team demos their completed Features (5-7 min each).
2. Focus on **integrated, end-to-end** functionality (not isolated stories).
3. Business Owners score each PI Objective:
   - **Actual Business Value** vs. **Planned Business Value**.

#### Step 2: Quantitative Measurement

Compile and present:

| Metric                | Planned | Actual | Trend |
| --------------------- | ------- | ------ | ----- |
| PI Objectives Met     | X/Y     | X/Y    | ↑↓→   |
| Features Completed    | X       | X      | ↑↓→   |
| Team Velocity (Avg)   | X       | X      | ↑↓→   |
| Defect Density        | X       | X      | ↑↓→   |
| Cycle Time (Avg)      | X days  | X days | ↑↓→   |
| Customer Satisfaction | X/5     | X/5    | ↑↓→   |

### Part 2: Retrospective (30 min)

#### Step 3: Gather Feedback

Use a structured format:

**What Went Well (Keep)**

- [Team-level and cross-team wins]

**What Didn't Go Well (Drop)**

- [Impediments, process failures, quality issues]

**What to Try (Add)**

- [New practices, tools, or process changes]

#### Step 4: Identify Top Problems

1. Each team presents their top 1-2 improvement items.
2. **Dot Vote**: All participants vote on the most impactful problems.
3. Select the **Top 3 problems** for the Problem-Solving Workshop.

### Part 3: Problem-Solving Workshop (1.5 hours)

#### Step 5: Root Cause Analysis (per problem)

Use the **5 Whys** or **Fishbone Diagram**:

```
Problem: [Stated Problem]
│
├── Why? [First cause]
│   └── Why? [Deeper cause]
│       └── Why? [Even deeper]
│           └── Why? [Structural cause]
│               └── Why? [ROOT CAUSE] ← This is what we fix
```

#### Step 6: Define Improvement Actions

For each root cause, create a **SMART improvement action**:

```markdown
## Improvement Item: [Title]

- **Specific**: [Exact change to make]
- **Measurable**: [How we'll know it worked]
- **Achievable**: [Why this is realistic]
- **Relevant**: [Link to the problem]
- **Time-bound**: [Complete by iteration X of next PI]
- **Owner**: [Name/Team]
```

#### Step 7: Commit to Improvements

1. Each improvement item gets an **Owner** and a **Target Iteration**.
2. Improvement items are added to the **next PI's backlog** as Enablers or Stories.
3. **RTE** tracks progress during the next PI.

## Output

- PI System Demo results (Business Value scores).
- PI Metrics dashboard.
- Retrospective findings (Keep / Drop / Add).
- 3-5 Improvement items with SMART definitions and owners.
- Saved to `{output_folder}/inspect-and-adapt/`.

## Follow-Through

- Improvement items appear in the next **PI Planning**.
- **RTE** reviews progress at each **ART Sync**.
- Resolved items are celebrated; stalled items are escalated.
