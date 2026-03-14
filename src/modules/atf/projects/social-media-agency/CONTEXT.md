# SMA Project Context — Persistent Reference

## Architecture

### LinkRight Product
- LinkRight = BMAD-inspired improved system with Vector DB + Beads
- Two fundamental AI problems solved: limited context window (→ MongoDB vectors) + no task tracking (→ Beads)
- Modules: Core, Sync, Flex, LifeOS, Squick, Builder
- Flex = Social Media Agency (SMA) module

### BMAD/LR v6 Standard — Workflow Anatomy
Every workflow MUST have:
```
workflows/{name}/
├── workflow.yaml              # machine-readable config (name, paths, inputs)
├── workflow.md                # human-readable execution guide with XML steps
├── instructions.md            # detailed prose guide for agent
├── checklist.md               # quality gates (pre/post/weekly checks)
├── templates/
│   └── {output}.template.md   # output format template
├── steps/
│   └── step-01b-resume-if-interrupted.md  # common recovery step
├── steps-c/                   # CREATE phase
│   ├── step-01-load-session-context.md
│   ├── step-01b-resume-if-interrupted.md
│   └── step-{CODE}{N}-{name}.md...
├── steps-v/                   # VALIDATE phase
│   └── step-01-validate.md
├── steps-e/                   # EDIT phase
│   ├── step-01-assess.md
│   └── step-02-apply-edit.md
└── data/reference/            # reference data (YAML/CSV)
```

### Module-Level Files
```
{module}/
├── config.yaml           # module config
├── module-help.csv       # commands
├── teams/default-party.csv
├── agents/{name}.md + .customize.yaml
├── workflows/
├── knowledge/
└── _memory/{agent}-sidecar/ (instructions.md + memories.md)
```

### Global Config (_config/)
- manifest.yaml — system identity
- agent-manifest.csv — ALL agents
- workflow-manifest.csv — ALL workflows  
- lr-help.csv — global commands
- task-manifest.csv, tool-manifest.csv, files-manifest.csv
- agents/ — all .customize.yaml
- ides/ — IDE configs

## SMA Pipeline
```
A (Ideation) → B (Drafting) → F (Formatting) → C (Review) → D (Publishing) → E (Analytics)
                                                                              ↓
                                                                         loops back to A
```

### Status Flow
`Scheduled_NoDraft → Drafting → Drafted → Formatting → Previewed → Ready_ToPublish → Published`

## Webhooks (n8n)
| Webhook | Method | Used By |
|---------|--------|---------|
| /sma-fetch-briefs | POST | A.1 |
| /sma-fetch-past-posts | POST | A.2, A.7, B.1 |
| /sma-search-experiences | POST | A.3, B.2 |
| /sma-fetch-config | POST | A.4, A.7, B.2 |
| /sma-save-config | POST | A.5 |
| /sma-update-sheet-status | POST | A.6, A.8 |
| /sma-save-experience | POST | A.6 |
| /sma-save-post | POST | A.8 |
| /sma-save-to-notion | POST | A.8 |
| /sma-fetch-post | POST | B.1, C.1, D.1 |
| /sma-update-post | POST | B.4, C.2, D.3 |
| /sma-publish-linkedin | POST | D.2 |

## Workflow Details

### A — Content Ideation (8 steps, COMPLETE)
- A.1: Fetch briefs from Google Sheet
- A.2: Fetch past 14 days posts
- A.3: Semantic search experiences per brief  
- A.4: Load scoring config (Fibonacci: F×8 + P×5 + R×3)
- A.5: Optional config update
- A.6: Score, filter, present top N, user selects
- A.7: Check open slots, assign dates
- A.8: Save to MongoDB + Notion + update Sheet

### B — Content Drafting (needs detailed steps)
- B.1: Pick earliest Scheduled_NoDraft post (auto or user choice)
- B.2: Fetch frameworks (content-methods.csv, 7 vocab CSVs), fetch experiences
- B.3: AI curates top 3-5 per CSV, user picks 1 each
- B.3.1-B.3.6: Format, hook, narrative, CTA, tone, generate
- B.3.7-B.3.18: Formatting rules (→ moved to F-ContentFormatting)
- B.4: User reviews, iterates, finalizes → status Drafted
- B.5: Save draft to MongoDB

### C — Content Review (2+ steps)
- C.1: Fetch post by ID (status: Previewed)
- C.2: Display preview, user approves/rejects/edits → status Ready_ToPublish or back to F

### D — Content Publishing (4 steps)
- D.1: Fetch ready posts (Ready_ToPublish)
- D.2: Publish to LinkedIn (one shot, no retry, random 0-60min delay, duplicate guard)
- D.3: Update status → Published + linkedin_post_urn + published_at
- D.4: Telegram notification to SMA control group

### E — Analytics Review (plan incomplete, E.1 discussed)
- E.1: Collect metrics via Chrome Extension (passive DOM reading)
- E.2-E.5: TBD

### F — Content Formatting (new, split from B)
- F.1: Pick drafted post
- F.2: Apply platform-specific formatting (staircase, 3-line blocks, UPPERCASE, etc.)
- F.3: Generate preview in code block
- F.4: User approves → status Previewed

## Formatting Rules (LinkedIn v1)
- 800-1600 ASCII characters
- No bold/italic/underline — UPPERCASE headers sparingly
- Max 3-line blocks with staircase formatting
- Max 3 emojis at tension points
- Replace dashes with punctuation
- Bullets: " - "; Flows: "A —> B —> C"
- Max 3 Hindi sentences at emotional peaks
- FK Grade 7 readability
- Positioning + follow after CTA
- 3-6 hashtags at end
- Show in code block preview

## Scoring Formula
`Score = F×8 + P×5 + R×3` (Fibonacci weights)
- F=Freshness, P=Personal Experience, R=Research Quality
- Minimums: F≥5, P≥3, R≥2
- Total minimum: 50% of 160 = 80

## Key Constraints
- Agent has ZERO direct DB/API access — ALL via n8n webhooks
- n8n workflows built manually by Satvik in UI
- Max 3 posts planned, 1 post/day, LinkedIn only (v1)
- Interactive/creative → BMAD workflow; Automated/scheduled → n8n
- MongoDB = user data | Sheets = temp/external | Notion = view-only
- English for vector-searchable content (Romanised Hindi = 15-25% lower accuracy)
- 0.80 default similarity threshold
- No retry for LinkedIn publishing — one shot only

## Beads Hierarchy (SAFe 6-level)
Epic → Capability → Feature → Story → Task → Subtask/Bug

### Flex Epic (shipquick-cmg) Capabilities
| ID | Capability | Phase |
|----|-----------|-------|
| cmg.1 | Structural Compliance | 1 (current) |
| 07t | B-ContentDrafting | 2 |
| 7ay | F-ContentFormatting | 3 |
| 1hf | C-ContentReview | 4 |
| jvy | D-ContentPublishing | 5 |
| 6i9 | E-AnalyticsReview | 6 |
| l50 | Variables Registry | 7 |
| eex | UX Design | 8 |
| brv | UI Integration | 9 |

### Other Product Line Epics (placeholders)
| Module | Epic ID |
|--------|---------|
| Core | shipquick-5ej |
| Sync | shipquick-758 |
| Flex | shipquick-cmg |
| LifeOS | shipquick-8tu |
| Squick | shipquick-ig6 |
| Builder | shipquick-53z |

## Framework Files (created by IronForge agent)
- content-formats.csv (35 items)
- hook-frameworks.csv (35)
- narrative-frameworks.csv (32)
- cta-frameworks.csv (32)
- tone-frameworks.csv (32)
- formatting-rules.csv (15)
- positioning-templates.csv (32)
- content-methods.csv (60 methods, 10 categories)
- content-elicitation-workflow.xml
- variable-registry.csv (48 variables)
- config-doc-schemas.md (7 MongoDB schemas)

## Database
- MongoDB: `sma` database, collections: `linkedin_posts`, `life_experiences`, `sma_config`
- Connection: `mongodb://n8n:sma2026@172.17.0.3:27017/sma?authSource=admin&directConnection=true`
- Vector index: `experience_vector_idx` (3072 dims, cosine)
- Config doc IDs: scoring_weights, scoring_scales, posting_schedule, formatting_config, engagement_config, review_config, analytics_config

## Paths
- SMA root: `src/modules/atf/projects/social-media-agency/`
- Workflows: `{root}/workflows/`
- Frameworks: `{root}/frameworks/`
- Plans: `{root}/plans/`
- Learnings: `{root}/learnings/`
- LR reference: `/home/ubuntu/MasterWorkspace/linkright/context/linkright/_lr/`
- BMAD reference: `/home/ubuntu/MasterWorkspace/linkright/context/bmad-method/_bmad/`
