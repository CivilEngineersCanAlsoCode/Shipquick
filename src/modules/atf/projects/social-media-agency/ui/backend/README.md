# SMA Bridge Server

Express.js API bridge between the SMA React dashboard and n8n webhook endpoints.

## Setup

```bash
cd ui/backend
cp .env.example .env        # edit with your API key
npm install
npm run dev                  # starts with nodemon on :3001
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `N8N_BASE_URL` | `http://localhost:5678/webhook` | n8n webhook base URL |
| `SMA_API_KEY` | `dev-key-change-me` | API key for `X-API-Key` header |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |

## API Endpoints

All `/api/*` routes require `X-API-Key` header.

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/health` | Health check (no auth) |
| GET | `/api/briefs` | Fetch briefs |
| POST | `/api/briefs` | Submit brief |
| GET | `/api/posts` | Paginated post list with filters |
| GET | `/api/posts/:id` | Single post detail |
| PUT | `/api/posts/:id` | Update post content/status/schedule |
| POST | `/api/posts` | Save new post |
| GET | `/api/config?type=` | Fetch config documents |
| PUT | `/api/config` | Save config document |
| POST | `/api/publish/:id` | Publish post to LinkedIn |
| POST | `/api/notify` | Send Telegram notification |
| GET | `/api/analytics?period=7d` | Analytics summary |
| POST | `/api/experiences` | Save experience |
| GET | `/api/experiences` | Search experiences |
| GET | `/api/pipeline` | Pipeline counts + action items |

## Error Format

```json
{
  "error": "Human-readable message",
  "code": "MACHINE_READABLE_CODE",
  "timestamp": "2026-03-15T10:00:00.000Z"
}
```

Error codes: `AUTH_MISSING_KEY`, `INVALID_CONFIG`, `INVALID_STATUS`, `WEBHOOK_ERROR`, `UPSTREAM_TIMEOUT`, `VALIDATION_ERROR`.
