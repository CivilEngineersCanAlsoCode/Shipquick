# ATF: AutoFlow — TODO / Roadmap

## Phase 1: Agent Creation

Build all 7 agents from their spec files using the create-agent workflow.

- [ ] Scout (Analyst) — `agents/scout.spec.md`
- [ ] Blueprint (PM) — `agents/blueprint.spec.md`
- [ ] Forge Master (Architect) — `agents/forge-master.spec.md`
- [ ] Assembler (Designer) — `agents/assembler.spec.md`
- [ ] Foreman (Scrum Master) — `agents/foreman.spec.md`
- [ ] Welder (Developer) — `agents/welder.spec.md`
- [ ] Inspector (QA) — `agents/inspector.spec.md`

## Phase 2: Utility Workflows

Shared workflows used by all agents. Build these first since other workflows depend on them.

- [ ] handoff — Context transfer between agents
- [ ] status-check — Project progress reporting
- [ ] escalate-to-user — Human-in-the-loop decision gate

## Phase 3: Feature Workflows

Agent-specific workflows for each station on the assembly line.

- [ ] node-discovery — Forge Master's node search and comparison
- [ ] mock-data-generator — Blueprint's test data creation
- [ ] workflow-decompose — Assembler's modular architecture design
- [ ] learning-capture — Foreman's ChromaDB knowledge upload
- [ ] alternative-suggest — Inspector's fallback proposal engine

## Phase 4: Core Workflows

The main pipeline and deployment workflows.

- [ ] deploy-to-n8n — Push workflow JSON to n8n instance via API
- [ ] test-validate — QA validation loop with 3x retry logic
- [ ] create-automation — End-to-end orchestrator (depends on all above)

## Phase 5: Integration & Testing

- [ ] End-to-end test: simple single-platform automation (e.g., RSS to X)
- [ ] End-to-end test: multi-platform automation (e.g., Reddit + X + LinkedIn)
- [ ] ChromaDB learning capture integration test
- [ ] Handoff context bundle validation across all 7 agents
- [ ] PinchTab browser automation integration
- [ ] Credential placeholder / human-in-the-loop flow testing

## Phase 6: Polish

- [ ] Agent sidecar setup for Scout and Foreman
- [ ] Sticky note templates for workflow documentation
- [ ] Error message standardization across agents
- [ ] Factory floor status display (visual assembly line progress)
- [ ] Module help CSV content finalized and tested
