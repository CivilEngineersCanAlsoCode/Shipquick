# Content Strategy — SMA LinkedIn

## Target Audience

### Primary Targets (optimize all content for these)

| Segment | Why They Matter | What They Engage With |
|---------|----------------|----------------------|
| VCs & Angel Investors | Funding, network, credibility | Market insights, traction signals, contrarian takes |
| Founders with Exits | Peer network, collaboration | Founder struggles, building-in-public, hard decisions |
| YCombinator / Ivy League Alumni | Elite network signal | Ambitious thinking, first-principles, unconventional paths |
| MAANG PMs & Senior Engineers | Credibility, hiring pipeline | AI/product frameworks, career decisions, industry shifts |
| Dubai/Europe/Singapore Recruiters | International opportunities | Career growth narratives, leadership signals, global thinking |

### Anti-Targets (do NOT optimize for)

- Job seekers wanting referrals → attracts engagement but zero strategic value
- Freshers / campus placement crowd → high volume, low quality followers
- LinkedIn engagement pods → inflated metrics, no real audience growth

## Content Pillar Weights

| Pillar | Weight | Description | Audience Fit |
|--------|--------|-------------|-------------|
| `ai_automation` | 25% | AI tools, automation workflows, LLM applications, agent architectures | VCs, MAANG, founders |
| `startup` | 20% | Building products, founder lessons, market insights, fundraising | Founders, VCs, YC |
| `pm` | 20% | Product management, strategy, roadmaps, stakeholder management | MAANG PMs, founders |
| `career` | 15% | Career pivots, unconventional paths, senior IC/leadership transitions | Recruiters, MAANG leaders |
| `hottake` | 10% | Contrarian opinions on tech, industry, culture | All targets (engagement driver) |
| `personal` | 5% | Vulnerability, life lessons, identity — ALWAYS paired with insight | Broad (gateway to follow) |
| `howto` | 5% | Tactical tutorials, tool walkthroughs, step-by-step guides | MAANG engineers, founders |

### Pillar Rotation Rules

- Never post the same pillar twice consecutively
- `ai_automation` and `startup` should each appear at least once per week
- `personal` max once per 2 weeks — and MUST include a technical/strategic takeaway
- `hottake` max once per week — must be defensible, not rage-bait

## Tone Strategy

### Default: `vulnerable-conversational`

Write like you're telling a friend about something real that happened — no corporate polish, no LinkedIn-speak. Include the messy parts. Show the doubt. But always land on an insight.

### Secondary: `reflective-ambitious`

For `startup` and `career` pillars. Looking back at decisions with the clarity of hindsight. "Here's what I'd do differently" energy.

### When to Break Default

| Pillar | Tone Override |
|--------|--------------|
| `hottake` | `bold-contrarian` — take a strong position, defend it |
| `howto` | `mentor-practical` — clear, direct, no fluff |
| `ai_automation` | `curious-builder` — excitement about what's possible |

## Publishing Schedule

- **Frequency**: 3 posts per week
- **Default Days**: Monday, Wednesday, Friday
- **Time Window**: 6:00-7:00 PM IST (12:30-1:30 PM UTC)
- **Rationale**: Evening IST catches US morning (East Coast wake-up), India evening scroll, and Europe afternoon

See `frameworks/posting-schedule.yaml` for full configuration including A/B test variants and holiday overrides.

## The Core Strategic Insight

### Problem: Personal vs Technical Trade-off

| Post Type | Engagement | Follower Quality |
|-----------|-----------|-----------------|
| Pure personal/vulnerable | HIGH (likes, comments, shares) | LOW (job seekers, sympathy engagers) |
| Pure technical/startup | LOW-MEDIUM (niche audience) | HIGH (VCs, founders, builders) |
| **Personal hook + technical insight** | **HIGH** | **HIGH** |

### Solution: Vulnerability as a Trojan Horse

Every post should follow this pattern:
1. **Hook**: Personal, vulnerable, surprising (catches attention)
2. **Bridge**: "Here's what I learned" / "This changed how I think about..."
3. **Payload**: Technical insight, framework, or strategic takeaway
4. **CTA**: Positioning + follow (not "like if you agree")

This way personal authenticity drives engagement while technical substance attracts the right followers.

### Examples

**Bad** (pure personal): "I cried in a meeting yesterday. It's okay to be vulnerable at work."
→ High engagement, wrong audience

**Bad** (pure technical): "Here's how to set up a RAG pipeline with pgvector and LangChain."
→ Right audience, low engagement

**Good** (combined): "I spent 3 months building something nobody wanted. Then I fed our user interviews to an AI agent and it found the insight I missed in 40 minutes. Here's the exact workflow..."
→ High engagement AND right audience

## Content Quality Gates

Before publishing, every post must pass:

1. **Audience check**: "Would a VC/founder find this valuable?" — if no, rewrite or kill
2. **Insight check**: "Is there a non-obvious takeaway?" — if no, dig deeper
3. **Anti-pattern check**: No "like if you agree", no engagement bait, no humblebrags
4. **Hindi check**: Max 3 Hindi sentences, only at emotional peaks, never in the hook
5. **Length check**: 800-1600 ASCII characters
6. **Readability check**: FK Grade 7 or below

## Metrics That Matter

Track in E-Analytics workflow:

| Metric | Target | Why |
|--------|--------|-----|
| Follower quality score | >30% qualified | Right audience growing |
| Engagement rate | >4% | Content resonates |
| Comment quality | >25% from targets | Real conversations happening |
| Profile views/post | >50 | Discovery working |
| Weekly DMs from targets | >2 | Converting to relationships |

## Integration Points

- **A-Ideation**: Pillar weights feed into brief scoring (`sma_config.scoring_weights`)
- **B-Drafting**: Tone and format defaults loaded from this strategy
- **E-Analytics**: Metrics targets used as benchmarks in E.3
- **A/B Testing**: See `docs/ab-testing-framework.md` for systematic optimization
- **Schedule**: See `frameworks/posting-schedule.yaml` for timing configuration
