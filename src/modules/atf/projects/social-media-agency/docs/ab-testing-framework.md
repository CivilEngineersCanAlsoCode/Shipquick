# A/B Testing Framework — SMA LinkedIn Strategy

## Purpose

Systematically optimize LinkedIn content strategy through controlled single-variable experiments measured over 2-week cycles. Goal: maximize engagement from the RIGHT audience (VCs, founders, MAANG leaders, international recruiters) — NOT job seekers.

## Target Audience Definition

**Primary (engage these):**
- VCs and angel investors
- Founders with exits / serial entrepreneurs
- YCombinator / Ivy League alumni
- MAANG PMs, Staff Engineers, Directors
- International recruiters (Dubai, Europe, Singapore)

**Anti-audience (avoid optimizing for):**
- Job seekers looking for referrals
- Freshers / entry-level candidates
- Engagement farmers / comment-for-comment networks

## Test Variables

| # | Variable | Options to Test | Default (Baseline) |
|---|----------|----------------|-------------------|
| 1 | Posting Day | Mon/Wed/Fri vs Tue/Thu/Sat vs Mon/Tue/Thu | Mon/Wed/Fri |
| 2 | Posting Time | 6-7 PM IST vs 8-9 AM IST vs 12-1 PM IST | 6-7 PM IST |
| 3 | Content Pillar | ai_automation vs startup vs pm vs career vs hottake | Weighted mix (see content-strategy.md) |
| 4 | Tone | vulnerable-conversational vs bold-contrarian vs reflective-ambitious | vulnerable-conversational |
| 5 | Hook Type | Pattern Interrupt vs Controversial Take vs Vulnerability vs Data-Led | Rotate per pillar |
| 6 | Content Format | story-insight vs listicle vs hot-take vs framework-drop | story-insight |
| 7 | CTA Type | question vs positioning+follow vs share vs save | positioning+follow |
| 8 | Hindi Usage | 0 sentences vs 2-3 sentences vs all-Hindi hook | 2-3 sentences at emotional peaks |

## Measurement Metrics (per 2-week cycle)

### Primary Metrics

| Metric | Formula | Weight |
|--------|---------|--------|
| `engagement_rate` | (likes + comments + reposts) / impressions × 100, normalized by follower count at cycle start | 40% |
| `follower_quality_score` | % of new followers matching target titles (see below) | 35% |
| `comment_quality_score` | % of comments from target audience + avg comment length > 20 words | 25% |

### Follower Quality Score Calculation

```
follower_quality_score = (qualified_new_followers / total_new_followers) × 100

qualified = title contains ANY of:
  - Founder, Co-Founder, CEO, CTO, CPO
  - VC, Venture, Investor, Angel, Partner (at fund)
  - Product @ {MAANG/top-50 company}
  - Staff Engineer, Principal Engineer, Director, VP
  - Recruiter + {Dubai|Singapore|Europe|London|Berlin|UAE}
  - YCombinator, Y Combinator, YC
```

### Secondary Metrics (tracked but not used for decisions in v1)

- Profile views per cycle
- DM quality (inbound opportunities)
- Post save rate
- Follower growth velocity

## Process: Single-Variable Testing

### Rules

1. **ONE variable per cycle** — never change two things at once
2. **Minimum 6 posts per cycle** (3/week × 2 weeks) for statistical relevance
3. **Document everything** — every cycle gets a result entry in `sma_config.ab_test_history`
4. **No cherry-picking** — use all posts in the cycle, not just the best ones
5. **Revert if worse** — if the variant underperforms baseline by >15%, revert immediately

### Cycle Structure

```
Day 1-14:  Run variant (change ONE variable from baseline)
Day 14:    Collect metrics, compare to baseline
Day 14:    Decision: ADOPT (variant > baseline by >10%)
                      REVERT (variant < baseline by >15%)
                      EXTEND (difference < 10%, run 1 more week)
```

## 8-Week Initial Strategy Lock Plan

| Week | Cycle | Variable Tested | Rationale |
|------|-------|----------------|-----------|
| 1-2 | Baseline | None — establish baseline metrics | Need reference point for all future tests |
| 3-4 | Test 1 | **Posting Time** | Highest potential impact, easy to change, no content risk |
| 5-6 | Test 2 | **Content Pillar Mix** | Test heavier ai_automation (35%) vs balanced mix |
| 7-8 | Test 3 | **Hook Type** | Test data-led hooks vs vulnerability hooks |

After Week 8: Strategy v1 locked. Future tests run monthly on remaining variables.

### Post-Lock Testing Calendar (Weeks 9+)

| Month | Variable | Notes |
|-------|----------|-------|
| Month 3 | Tone | vulnerable vs bold-contrarian |
| Month 4 | Format | story-insight vs framework-drop |
| Month 5 | CTA Type | question-CTA vs positioning+follow |
| Month 6 | Hindi Usage | 0 vs 3 sentences |
| Month 7 | Posting Day | Mon/Wed/Fri vs Tue/Thu/Sat |

## Data Storage

Test results stored in MongoDB `sma_config` collection:

```yaml
_id: ab_test_history
tests:
  - cycle_id: "2026-W12-W13"
    variable: "posting_time"
    baseline_value: "18:00-19:00 IST"
    variant_value: "08:00-09:00 IST"
    posts_in_cycle: 6
    baseline_metrics:
      engagement_rate: 4.2
      follower_quality_score: 32
      comment_quality_score: 28
    variant_metrics:
      engagement_rate: 3.8
      follower_quality_score: 35
      comment_quality_score: 22
    decision: "REVERT"
    notes: "Lower engagement, slightly better follower quality but not enough to offset"
```

## Integration with E-Analytics Workflow

- E.2 (Aggregate) feeds cycle metrics into A/B comparison
- E.4 (Strategy Recommendations) considers active A/B test when making suggestions
- E.5 (Feedback Loop) updates `sma_config` with winning variants

## Key Insight: The Personal Post Trap

> Personal/vulnerable posts generate HIGH engagement but attract the WRONG audience (job seekers, sympathy engagers). Technical/startup posts get LOWER engagement but attract the RIGHT audience (VCs, founders, builders).
>
> **Strategy**: Combine vulnerability WITH technical content. Lead with a personal hook, deliver technical insight. This gets engagement AND the right followers.

This framework exists to validate this hypothesis with data.
