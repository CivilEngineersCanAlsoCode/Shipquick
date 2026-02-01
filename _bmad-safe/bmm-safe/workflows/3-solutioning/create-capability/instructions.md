# Create Capability Workflow

## Overview

Capabilities are **solution-level behaviors** that span multiple ARTs (Agile Release Trains). They represent the **bridge between Epics and Features** in the SAFe hierarchy.

```
Theme → Epic → Capability → Feature → Story → Task
                   ↑
            (This Workflow)
```

---

## When to Use

- **Solution Train** environment with multiple ARTs
- Epic is too large for a single ART
- Cross-ART coordination required
- Enterprise-scale solution delivery

---

## Prerequisites

- [ ] Epic defined and approved by Business Owner
- [ ] Solution Architect available for architecture guidance
- [ ] PRD and Architecture documents complete
- [ ] Epic WSJF prioritization done

---

## Step 1: Load Epic Context

<invoke-protocol name="discover_inputs"/>

Review the loaded Epic to understand:

- Epic outcome and benefit hypothesis
- WSJF prioritization
- Business Owner expectations
- Solution Architect constraints

<ask>Which Epic are you breaking into Capabilities? Provide Epic ID or describe.</ask>

---

## Step 2: Identify Capabilities

For the selected Epic, identify 2-5 Capabilities that:

- Can be independently delivered by an ART
- Have clear boundaries and interfaces
- Align with Value Streams
- Can be WSJF prioritized independently

<action>List potential Capabilities with one-sentence descriptions</action>

<ask>Review the Capability breakdown. Adjust? [A]dd / [R]emove / [M]odify / [C]ontinue</ask>

---

## Step 3: Define Each Capability

For each identified Capability:

### 3.1 Basic Information

<template-output section="Basic Information">
Fill in the Capability template:
- Name
- Parent Epic reference
- State: Funnel
- Owner
- Enabler classification (None/Exploration/Architectural/Infrastructure/Compliance)
</template-output>

### 3.2 WSJF Prioritization

<action>Calculate WSJF for this Capability</action>

| Factor                                | Score (1-21 Fibonacci)   | Notes |
| ------------------------------------- | ------------------------ | ----- |
| Business Value                        |                          |       |
| Time Criticality                      |                          |       |
| Risk Reduction/Opportunity Enablement |                          |       |
| Job Size                              |                          |       |
| **WSJF**                              | (BV + TC + RR/OE) / Size |       |

<template-output section="WSJF"/>

### 3.3 Features Decomposition

<action>Break Capability into 3-7 Features for ART delivery</action>

<template-output section="Features">
List Features with:
- Feature name
- Target ART
- Initial sizing (T-shirt)
- Target PI
</template-output>

### 3.4 Acceptance Criteria

<template-output section="Acceptance Criteria">
Define 3-5 acceptance criteria for Capability completion
</template-output>

---

## Step 4: Solution Architecture Alignment

<ask>Is Solution Architect available to review? [Y/N]</ask>

<check if="response=Y">
  <action>Review Capability architecture alignment</action>
  <action>Document Solution Runway needs</action>
  <action>Identify NFRs and constraints</action>
</check>

<template-output section="Architecture Notes"/>

---

## Step 5: Beads Registration

<action>Register Capability in Beads for tracking</action>

```bash
# Get parent Epic bead ID
bd show {epic_bead_id}

# Create Capability
bd create "Capability: {capability_name}" --parent {epic_bead_id}

# Store capability_bead_id for Feature creation
```

<action>Store capability_bead_id in config.yaml</action>

---

## Step 6: Completion

<action>Save Capability document to output folder</action>
<action>Confirm with Solution Manager</action>
<action>Proceed to PI Planning for Feature commitment</action>

**Next Steps:**

1. RTE: Run PI Planning to commit Features from this Capability
2. PM: Prioritize Features using WSJF
3. ARTs: Break Features into Stories

---

## Beads Tracking Summary

After this workflow:

- Capability registered in Beads under Epic
- Features will be created under this Capability
- Acceptance requires all Features accepted
