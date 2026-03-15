# ADR-003: ChatGPT Custom Model as Primary Interface

- **Status:** Accepted
- **Date:** 2026-03-15

## Context

SMA needs a user-facing interface for interactive workflows (Ideation, Drafting, Review, Analytics). Options considered:
1. Custom web UI (React/Next.js)
2. Telegram bot
3. ChatGPT with Custom GPT + Actions
4. Slack integration

The primary user (Satvik) already uses ChatGPT daily for other tasks.

## Decision

Use a **ChatGPT Custom GPT with Actions** (webhook calls to n8n) as the primary user interface. The Custom GPT:
- Hosts agent instructions and system prompts
- Uses Actions to call n8n webhooks for all data operations
- Provides conversational UX for interactive workflows (A, B, C, E)
- Handles automated workflows (D) via n8n triggers independently

## Consequences

**Positive:**
- Zero new UI learning curve — Satvik already uses ChatGPT daily
- Actions provide structured API access to n8n webhooks
- No frontend development, hosting, or maintenance cost
- Conversational interface is natural for creative workflows (ideation, drafting)
- Mobile access via ChatGPT app with no additional work

**Negative:**
- Dependent on OpenAI platform stability and Actions API
- Limited UI customization (no custom dashboards, charts, or rich previews)
- ChatGPT conversation context limits may affect long sessions
- Cannot embed complex interactive elements (drag-and-drop, calendars)

**Mitigations:**
- All business logic lives in n8n webhooks — interface is swappable
- Analytics visualization deferred to future Notion or dashboard integration
- Session recovery steps (step-01b) handle context window resets
