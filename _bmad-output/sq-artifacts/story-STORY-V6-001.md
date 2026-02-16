---
stepsCompleted:
  [
    "step-01-theme",
    "step-02-epic",
    "step-03-capabilities",
    "step-04-features",
    "step-05-stories",
  ]
type: user-story
id: STORY-V6-001
parentId: FEAT-V6-001
beadId: Safe Agile Agentic Framework-cxb.1.1.1
status: READY
points: 5
---

# User Story: Configure BGP Peering

As a network engineer,
I want to configure BGP peering on the gateway,
so that routes can be shared across the mesh.

## Acceptance Criteria

- **Scenario 1: Interface Assignment**
  - Given a gateway interface
  - When a BGP peering IP is assigned
  - Then the interface responds to BGP keepalives
- **Scenario 2: Neighbor Adjacency**
  - Given a configured BGP neighbor
  - When the adjacency timer expires
  - Then the session status transitions to ESTABLISHED

## Dev Tasks

- [ ] Implement BGP configuration module in Go
- [ ] Define peering protobuf schema
- [ ] Add unit tests for neighbor state machine

## QA Test Cases

- [ ] Verify peering with invalid ASN (must fail)
- [ ] Verify peering with matching MD5 secret (must pass)
