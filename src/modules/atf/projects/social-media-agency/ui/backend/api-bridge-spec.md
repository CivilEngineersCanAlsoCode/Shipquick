# API Bridge Server Specification

**Runtime:** Node.js + Express.js
**Purpose:** Thin proxy layer between the React frontend and n8n webhook endpoints
**Auth:** API key (single user, `X-API-Key` header)
**Port:** 3001 (frontend on 3000)

---

## Architecture

```
React App (3000)  →  Express API Bridge (3001)  →  n8n Webhooks (5678)
                      ├─ API key validation
                      ├─ Request shaping (GET→POST translation)
                      ├─ Error normalization
                      └─ Response transformation
```

The bridge exists because:
1. n8n webhooks are all POST — the bridge exposes RESTful GET/PUT routes
2. Centralizes error handling and response normalization
3. Keeps the n8n webhook URL and credentials out of the browser
4. Adds CORS configuration for local dev

---

## Configuration

```js
// config.js
module.exports = {
  PORT: process.env.PORT || 3001,
  N8N_BASE_URL: process.env.N8N_BASE_URL || 'http://localhost:5678/webhook',
  API_KEY: process.env.SMA_API_KEY || 'dev-key-change-me',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  REQUEST_TIMEOUT_MS: 15000,
};
```

---

## Middleware

### Auth Middleware

```js
function authMiddleware(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key || key !== config.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized', code: 'AUTH_MISSING_KEY' });
  }
  next();
}
```

Applied to all `/api/*` routes.

### Error Handler

```js
function errorHandler(err, req, res, next) {
  const status = err.status || 502;
  const body = {
    error: err.message || 'Upstream error',
    code: err.code || 'UPSTREAM_ERROR',
    timestamp: new Date().toISOString(),
  };
  if (err.upstream) body.upstream = err.upstream;
  res.status(status).json(body);
}
```

---

## Route Definitions

### GET /api/posts

Fetches all posts (pipeline overview + list page data).

| Aspect | Detail |
|--------|--------|
| n8n webhook | `POST /sma-fetch-post` |
| Request body sent to n8n | `{ "action": "list", "filters": { status, pillar, dateFrom, dateTo }, "sort": "scheduled_date", "page": 1, "limit": 10 }` |
| Query params | `?status=Ready_ToPublish&pillar=Skill-Building&sort=scheduled_date&page=1&limit=10` |
| Response | `{ posts: [...], total: number, page: number, pages: number }` |

```js
router.get('/posts', async (req, res, next) => {
  const { status, pillar, dateFrom, dateTo, sort, page, limit } = req.query;
  const payload = {
    action: 'list',
    filters: { status, pillar, dateFrom, dateTo },
    sort: sort || 'scheduled_date',
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
  };
  const data = await callWebhook('/sma-fetch-post', payload);
  res.json(data);
});
```

### GET /api/posts/:id

Fetches a single post by MongoDB `_id`.

| Aspect | Detail |
|--------|--------|
| n8n webhook | `POST /sma-fetch-post` |
| Request body sent to n8n | `{ "action": "get", "post_id": ":id" }` |
| Response | Full post document |

```js
router.get('/posts/:id', async (req, res, next) => {
  const data = await callWebhook('/sma-fetch-post', {
    action: 'get',
    post_id: req.params.id,
  });
  res.json(data);
});
```

### PUT /api/posts/:id

Updates a post (status change, content edit, reschedule).

| Aspect | Detail |
|--------|--------|
| n8n webhook | `POST /sma-update-post` |
| Request body sent to n8n | `{ "post_id": ":id", ...req.body }` |
| Accepted body fields | `status`, `content`, `scheduled_date`, `metadata` |
| Response | Updated post document |

```js
router.put('/posts/:id', async (req, res, next) => {
  const allowed = ['status', 'content', 'scheduled_date', 'metadata'];
  const updates = pick(req.body, allowed);
  const data = await callWebhook('/sma-update-post', {
    post_id: req.params.id,
    ...updates,
  });
  res.json(data);
});
```

### GET /api/config

Fetches all 7 config documents from `sma_config` collection.

| Aspect | Detail |
|--------|--------|
| n8n webhook | `POST /sma-fetch-config` |
| Request body sent to n8n | `{ "config_id": "all" }` or `{ "config_id": ":type" }` |
| Query params | `?type=scoring_weights` (optional, defaults to all) |
| Response | `{ configs: { scoring_weights: {...}, posting_schedule: {...}, ... } }` |

```js
router.get('/config', async (req, res, next) => {
  const configId = req.query.type || 'all';
  const data = await callWebhook('/sma-fetch-config', { config_id: configId });
  res.json(data);
});
```

### PUT /api/config

Saves a config document.

| Aspect | Detail |
|--------|--------|
| n8n webhook | `POST /sma-save-config` |
| Request body sent to n8n | `{ "config_id": req.body.config_id, "data": req.body.data }` |
| Accepted config_ids | `scoring_weights`, `scoring_scales`, `posting_schedule`, `formatting_config`, `engagement_config`, `review_config`, `analytics_config` |
| Response | `{ success: true, config_id: "..." }` |

```js
const VALID_CONFIGS = [
  'scoring_weights', 'scoring_scales', 'posting_schedule',
  'formatting_config', 'engagement_config', 'review_config', 'analytics_config',
];

router.put('/config', async (req, res, next) => {
  const { config_id, data } = req.body;
  if (!VALID_CONFIGS.includes(config_id)) {
    return res.status(400).json({ error: 'Invalid config_id', code: 'INVALID_CONFIG' });
  }
  const result = await callWebhook('/sma-save-config', { config_id, data });
  res.json(result);
});
```

### POST /api/publish/:id

Triggers LinkedIn publishing for a single post.

| Aspect | Detail |
|--------|--------|
| n8n webhook | `POST /sma-publish-linkedin` |
| Request body sent to n8n | `{ "post_id": ":id" }` |
| Pre-check | Fetch post first, verify status is `Ready_ToPublish` |
| Response | `{ success: true, linkedin_post_urn: "urn:li:share:..." }` |
| Notes | One-shot, no retry. If it fails, status → `Publish_Failed` |

```js
router.post('/publish/:id', async (req, res, next) => {
  // 1. Verify post status
  const post = await callWebhook('/sma-fetch-post', {
    action: 'get',
    post_id: req.params.id,
  });
  if (post.status !== 'Ready_ToPublish') {
    return res.status(409).json({
      error: `Post status is "${post.status}", must be "Ready_ToPublish"`,
      code: 'INVALID_STATUS',
    });
  }

  // 2. Publish (one-shot)
  const result = await callWebhook('/sma-publish-linkedin', {
    post_id: req.params.id,
  });

  // 3. Notify via Telegram
  await callWebhook('/sma-notify-telegram', {
    post_id: req.params.id,
    event: 'published',
  }).catch(() => {}); // non-blocking

  res.json(result);
});
```

### GET /api/analytics

Fetches analytics data for the dashboard.

| Aspect | Detail |
|--------|--------|
| n8n webhook | `POST /sma-analytics-collect` |
| Request body sent to n8n | `{ "action": "summary", "period": ":period" }` |
| Query params | `?period=7d` (7d, 30d, 90d) |
| Response | `{ overview: {...}, posts: [...], byPillar: {...}, byFramework: {...}, collectionSchedule: [...] }` |

```js
router.get('/analytics', async (req, res, next) => {
  const period = req.query.period || '7d';
  const data = await callWebhook('/sma-analytics-collect', {
    action: 'summary',
    period,
  });
  res.json(data);
});
```

### GET /api/pipeline

Dashboard pipeline summary (counts by status).

| Aspect | Detail |
|--------|--------|
| n8n webhook | `POST /sma-fetch-post` |
| Request body sent to n8n | `{ "action": "pipeline_summary" }` |
| Response | `{ counts: { Scheduled_NoDraft: 3, Drafting: 0, ... }, actionItems: [...], weekCalendar: [...] }` |

```js
router.get('/pipeline', async (req, res, next) => {
  const data = await callWebhook('/sma-fetch-post', {
    action: 'pipeline_summary',
  });
  res.json(data);
});
```

---

## Webhook Client

```js
const axios = require('axios');

async function callWebhook(path, body) {
  try {
    const response = await axios.post(`${config.N8N_BASE_URL}${path}`, body, {
      timeout: config.REQUEST_TIMEOUT_MS,
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (err) {
    const wrapped = new Error(
      err.response?.data?.message || `Webhook ${path} failed`
    );
    wrapped.status = err.response?.status >= 400 ? err.response.status : 502;
    wrapped.code = 'WEBHOOK_ERROR';
    wrapped.upstream = { path, status: err.response?.status };
    throw wrapped;
  }
}
```

---

## Error Response Format

All errors follow a consistent shape:

```json
{
  "error": "Human-readable message",
  "code": "MACHINE_READABLE_CODE",
  "timestamp": "2026-03-15T10:00:00.000Z",
  "upstream": { "path": "/sma-fetch-post", "status": 500 }
}
```

### Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `AUTH_MISSING_KEY` | 401 | Missing or invalid `X-API-Key` header |
| `INVALID_CONFIG` | 400 | Unrecognized `config_id` value |
| `INVALID_STATUS` | 409 | Post status doesn't allow the requested action |
| `WEBHOOK_ERROR` | 502 | n8n webhook call failed |
| `UPSTREAM_TIMEOUT` | 504 | n8n webhook didn't respond within timeout |
| `VALIDATION_ERROR` | 400 | Request body missing required fields |

---

## Route Summary

| Method | Route | n8n Webhook | Purpose |
|--------|-------|-------------|---------|
| GET | `/api/pipeline` | `/sma-fetch-post` | Dashboard pipeline counts + action items |
| GET | `/api/posts` | `/sma-fetch-post` | Paginated post list with filters |
| GET | `/api/posts/:id` | `/sma-fetch-post` | Single post detail |
| PUT | `/api/posts/:id` | `/sma-update-post` | Update post content/status/schedule |
| GET | `/api/config` | `/sma-fetch-config` | Fetch config documents |
| PUT | `/api/config` | `/sma-save-config` | Save config document |
| POST | `/api/publish/:id` | `/sma-publish-linkedin` + `/sma-notify-telegram` | Publish post to LinkedIn |
| GET | `/api/analytics` | `/sma-analytics-collect` | Analytics summary data |

---

## CORS Configuration

```js
const cors = require('cors');
app.use(cors({
  origin: config.CORS_ORIGIN,
  methods: ['GET', 'PUT', 'POST'],
  allowedHeaders: ['Content-Type', 'X-API-Key'],
}));
```

---

## Project Structure

```
ui/backend/
├── server.js           # Express app setup, middleware, startup
├── config.js           # Environment config
├── routes/
│   ├── posts.js        # /api/posts, /api/posts/:id
│   ├── pipeline.js     # /api/pipeline
│   ├── config.js       # /api/config
│   ├── publish.js      # /api/publish/:id
│   └── analytics.js    # /api/analytics
├── middleware/
│   ├── auth.js         # API key validation
│   └── errorHandler.js # Centralized error handling
├── lib/
│   └── webhook.js      # callWebhook helper
├── package.json
└── .env.example
```
