# Persona Development Workflow

## Purpose

Create data-driven user personas that connect UX research to SAFe Features and Stories, ensuring the team builds for real people, not assumptions.

## Pre-Conditions

- User research data available (interviews, surveys, analytics).
- Product Brief or PRD exists with target audience defined.

## Workflow Steps

### Step 1: Gather Research Data (15 min)

1. Collect all available user research:
   - Interview transcripts / notes
   - Survey results
   - Analytics data (demographics, behavior patterns)
   - Support tickets / complaint themes
2. If no research exists, schedule **5-8 user interviews** first.

### Step 2: Identify Behavioral Patterns (20 min)

1. Sort users into groups based on **behavior**, not demographics.
2. Look for patterns in:
   - Goals (What are they trying to achieve?)
   - Pain Points (What frustrates them?)
   - Workflows (How do they currently solve the problem?)
   - Decision Factors (What influences their choices?)
3. Aim for **3-5 distinct behavioral groups**.

### Step 3: Build Persona Cards (30 min per persona)

Use this template for each persona:

```markdown
## [Persona Name] – [Archetype Title]

**Photo**: [Representative image]
**Quote**: "[A real or composite quote from research]"

### Demographics

- **Age Range**:
- **Role/Occupation**:
- **Tech Comfort Level**: Low / Medium / High

### Goals

1. [Primary goal]
2. [Secondary goal]

### Pain Points

1. [Primary frustration]
2. [Secondary frustration]

### Scenarios

- **Typical Use**: [How they'd typically interact with the product]
- **Edge Case**: [An unusual but realistic scenario]

### Feature Mapping

| Feature     | Importance to this Persona           |
| ----------- | ------------------------------------ |
| [Feature 1] | Critical / Nice-to-Have / Irrelevant |
| [Feature 2] | Critical / Nice-to-Have / Irrelevant |
```

### Step 4: Prioritize Personas (10 min)

1. Rank personas by business value and frequency of use.
2. Designate **1 Primary Persona** (design optimizes for them).
3. Designate **1-2 Secondary Personas** (design accommodates them).
4. Note any **Negative Personas** (who the product is NOT for).

### Step 5: Validate with Stakeholders (15 min)

1. Present personas to PM, PO, and key stakeholders.
2. Confirm alignment with business goals.
3. Iterate based on feedback.

### Step 6: Link to SAFe Artifacts

1. Map personas to **Epics** (which personas benefit from each Epic?).
2. Reference personas in **User Story** acceptance criteria.
3. Use personas during **PI Planning** to prioritize features.

## Output

- 3-5 validated persona cards (Markdown).
- Persona-to-Feature mapping table.
- Saved to `{output_folder}/personas/`.
