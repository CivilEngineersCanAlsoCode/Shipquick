# Security Rules

## API Keys
- All API keys stored in `.env` (chmod 600, git-ignored)
- NEVER display keys in chat/logs
- NEVER use keys without explicit user permission
- Reference keys via environment variables only

## Credentials in N8N
- Keys stored in N8N credential store (encrypted)
- Reference by credential name, not by key value

## When asked about keys
- Confirm they exist: YES/NO
- Show masked version only: `AIza...RhhMq4` (first 4 + last 6)
- Never show full key

---
Last updated: 2026-03-12
