# Persona: Satvik Jain

## Demographics
| Attribute | Value |
|-----------|-------|
| Name | Satvik Jain |
| Role | Senior Product Manager, American Express |
| Location | India (IST timezone) |
| Age range | Late 20s–early 30s |
| Platform | LinkedIn (primary professional network) |
| Tech comfort | High — builds n8n automations, uses ChatGPT daily, comfortable with MongoDB, JS snippets |

## Goals
1. **Build a consistent LinkedIn presence** — 1 post/day, professionally crafted, data-driven topic selection
2. **Minimize content creation time** — automate everything except creative decisions (topic selection, tone approval, final review)
3. **Improve engagement over time** — use analytics feedback loops to refine scoring weights, content pillars, and frameworks
4. **Maintain authenticity** — posts must draw from real life experiences and personal stories, not generic AI slop
5. **Establish thought leadership** — career, personal growth, skill-building content pillars aligned with PM brand

## Frustrations
- Spending 45–60 min per post manually is unsustainable alongside a full-time PM job
- Forgetting to post on schedule or losing momentum after a busy week
- Hard to track which content pillars and formats actually drive engagement
- LinkedIn's algorithm is opaque — no easy way to A/B test without tooling
- Generic AI drafts feel inauthentic without personal experience injection
- Context switching between Google Sheets, Notion, ChatGPT, and LinkedIn is fragmented

## Tech Stack & Comfort
| Tool | Usage | Comfort |
|------|-------|---------|
| ChatGPT (LinkRight HQ) | Primary interface — triggers all workflows via conversation | Expert |
| n8n | Builds and maintains webhook automations manually in UI | Advanced |
| MongoDB | Stores posts, experiences, config — accessed only via n8n | Intermediate |
| Google Sheets | Brief input source — adds raw ideas here | Expert |
| Notion | View-only content calendar | Basic |
| LinkedIn | Posting target, metric source | Expert |
| Telegram | Receives publish notifications | Basic |
| Chrome DevTools | Runs JS snippet for analytics collection at Day 1,3,7,14,30 | Intermediate |

## Daily Workflow

### Morning (8:00–9:00 AM IST) — Content Planning
- Opens ChatGPT (LinkRight HQ) on desktop
- Checks if today's post is Ready_ToPublish → triggers D-Publishing
- If pipeline is light, triggers A-Ideation to fill upcoming slots
- Reviews any Telegram notifications from yesterday's publish
- **Duration:** 15–30 min
- **Mood:** Focused, wants quick status overview before work starts

### Lunch Break (1:00–1:30 PM IST) — Quick Review
- Quick check on ChatGPT mobile or desktop
- Reviews any Drafted posts → triggers F-Formatting or C-Review
- Approves/rejects formatted previews
- **Duration:** 10–15 min
- **Mood:** Time-constrained, wants fast approve/reject cycles

### Evening (7:00–8:00 PM IST) — Analytics & Strategy
- Runs JS snippet in Chrome DevTools to collect metrics for published posts (Day 1,3,7,14,30 schedule)
- Triggers E-Analytics to review performance
- Adjusts scoring weights and pillar priorities based on data
- Adds new brief ideas to Google Sheets if inspired
- **Duration:** 20–30 min
- **Mood:** Reflective, analytical, open to experimentation

### Weekend — Batch Operations
- Ideation sessions to fill next week's pipeline (A workflow, 3+ posts)
- Drafting sessions for multiple posts (B workflow)
- Review and approve batch (C workflow)
- **Duration:** 1–2 hours total
- **Mood:** Creative, less time pressure

## Content Creation Habits
- **Frequency:** 1 post/day, 5–7 posts/week target
- **Content pillars:** Career growth, personal stories, skill-building, leadership, tech insights
- **Writing style:** Conversational, includes Romanised Hindi (15–25% of content), personal anecdotes
- **Hook preference:** Strong opening hooks (≤210 chars), often contrarian or story-based
- **CTA style:** Always includes positioning statement + follow prompt
- **Quality bar:** FK Grade 7 readability, 800–1600 characters, max 3 emojis

## LinkedIn Usage Patterns
- **Posting time:** Varies — uses random 0–60 min delay for organic appearance
- **Engagement check:** Day 1, 3, 7, 14, 30 after publish (structured via JS snippet)
- **Networking:** Responds to comments manually (not automated)
- **Content calendar:** Planned 3–7 days ahead via A-Ideation, visible in Notion

## Key Scenarios

### Scenario 1: Morning Content Planning
> "It's Monday 8:15 AM. Satvik opens ChatGPT and says 'Pipeline status dikhao.' He sees 2 posts Ready_ToPublish, 1 Drafted, 0 in pipeline for Thursday+. He publishes today's post, then starts ideation to fill the gap."

**Needs:** Quick pipeline overview → one-click publish → seamless ideation flow
**Pain point:** No single dashboard view — has to ask agent for status verbally

### Scenario 2: Quick Review on Break
> "It's 1:10 PM. Satvik has 15 minutes. He asks 'Koi draft ready hai?' Agent shows a Drafted post. He triggers formatting, reviews the preview, approves it. Done in 8 minutes."

**Needs:** Fast post selection → instant preview → one-word approval
**Pain point:** Framework selection in B.2 takes too long for a break session

### Scenario 3: Evening Analytics Check
> "It's 7:30 PM. Satvik ran the JS snippet for 3 posts. He says 'Analytics dekho last week.' Agent shows per-pillar performance, flags a resurgent post (Day 14 > Day 7 by 35%), recommends increasing career pillar weight."

**Needs:** Clear metric comparisons → actionable recommendations → one-click config update
**Pain point:** Manually running JS snippet in DevTools feels fragile and easy to forget

### Scenario 4: Weekend Batch Ideation
> "Saturday morning. Satvik added 8 briefs to Google Sheets during the week. He opens ChatGPT: 'Let's brainstorm.' Agent scores all 8, presents top 5, Satvik selects 3, schedules Mon–Wed."

**Needs:** Bulk scoring → ranked presentation → quick multi-select → calendar conflict check
**Pain point:** Scoring formula adjustments require remembering what changed last time

### Scenario 5: Config Tuning After Bad Week
> "Analytics show career posts underperforming for 2 weeks. Satvik wants to reduce career pillar weight and boost personal stories. He updates scoring weights and pillar priority via E.5 feedback loop."

**Needs:** Before/after comparison of config changes → confidence that next ideation will reflect updates
**Pain point:** No visibility into how config changes propagate to future scoring
