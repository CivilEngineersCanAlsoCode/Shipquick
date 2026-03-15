# ADR-004: Defer Chrome Extension, Use JS Snippet + ChatGPT Actions

- **Status:** Accepted
- **Date:** 2026-03-15

## Context

Workflow E (Analytics) requires collecting LinkedIn engagement metrics (impressions, reactions, comments, reposts) at multiple time points (Day 1, 3, 7, 14, 30). LinkedIn's API has restrictive rate limits and limited metrics access for individual accounts. Options considered:
1. LinkedIn API (official)
2. Chrome Extension with DOM scraping
3. JS DevTools snippet for manual metric collection
4. ChatGPT Actions with OCR-based collection

## Decision

**Defer the Chrome Extension.** Use two complementary collection methods:

1. **Primary — JS DevTools snippet:** A JavaScript snippet run in browser DevTools that scrapes metrics directly from LinkedIn's DOM and sends them to the `/sma-analytics-collect` webhook.
2. **Backup — ChatGPT Actions OCR:** User screenshots the LinkedIn analytics view; ChatGPT extracts metrics via vision/OCR and calls the webhook.

The Chrome Extension remains a future option if collection frequency or user friction demands it.

## Consequences

**Positive:**
- Dramatically less development effort than a Chrome Extension
- No extension review/publishing process or cross-browser compatibility concerns
- JS snippet is simple to update when LinkedIn DOM changes
- ChatGPT Actions OCR leverages existing infrastructure (ADR-003)
- Same data quality — both methods collect the same metric fields

**Negative:**
- Manual process — user must open DevTools or take screenshots
- JS snippet breaks if LinkedIn changes DOM structure (fragile)
- OCR backup may have accuracy issues with certain layouts
- No automated scheduled collection — relies on user discipline at Day 1,3,7,14,30

**Mitigations:**
- Telegram reminders (via n8n) prompt metric collection at each time point
- Snippet includes validation to flag missing or suspicious values
- Multi-point collection (ADR-005) provides redundancy — a missed day doesn't invalidate the dataset
