# LinkedIn Metrics Scraper — DevTools Snippet

## What It Does

Scrapes metrics (likes, comments, reposts, impressions, follower count) from visible LinkedIn posts on your activity page and POSTs them as a single batch to the n8n webhook at `https://n8n.linkright.in/webhook/sma-analytics-collect`.

---

## Setup (One-Time)

1. Open Chrome and go to any page
2. Open **DevTools** → `F12` or `Cmd+Opt+I` (Mac) / `Ctrl+Shift+I` (Windows)
3. Go to **Sources** tab → **Snippets** (left sidebar, may need to click `>>` to see it)
4. Click **+ New snippet** → name it `linkedin-metrics`
5. Paste the entire contents of `linkedin-metrics-snippet.js`
6. Press `Ctrl+S` to save — the snippet persists across browser sessions

---

## Usage (Each Time)

1. Navigate to your LinkedIn profile → **Activity** tab (or `linkedin.com/in/YOUR-HANDLE/recent-activity/all/`)
2. **Scroll down** through all posts you want captured — the page lazy-loads content, so posts that were never scrolled into view won't appear in the DOM
3. Open DevTools → **Sources** → **Snippets**
4. Select `linkedin-metrics` and click the **▶ Run** button (or `Ctrl+Enter`)
5. Watch the **Console** tab for progress logs and the final payload
6. The snippet auto-scrolls a couple more times to catch straggler posts, then POSTs everything to the webhook

---

## Sample Output (Webhook Payload)

```json
{
  "source": "linkedin-devtools-snippet",
  "scraped_at": "2026-03-14T10:30:00.000Z",
  "page_url": "https://www.linkedin.com/in/satvik/recent-activity/all/",
  "follower_count": 4520,
  "post_count": 8,
  "posts": [
    {
      "index": 1,
      "post_url": "https://www.linkedin.com/feed/update/urn:li:activity:7100000000000000000",
      "text_preview": "Excited to share our latest case study on...",
      "timestamp": "3d",
      "likes": 142,
      "comments": 23,
      "reposts": 8,
      "impressions": 4500,
      "raw": {
        "reactions": "142",
        "comments": "23 comments",
        "reposts": "8 reposts",
        "impressions": "4,500 impressions"
      }
    }
  ]
}
```

---

## When Selectors Break (LinkedIn DOM Changes)

LinkedIn updates its HTML frequently. If the snippet returns 0 posts or all-zero metrics:

1. **Open DevTools → Elements tab** on the activity page
2. **Right-click a post card** → Inspect → note the wrapper class (e.g. `.feed-shared-update-v2`)
3. **Right-click a like/reaction count** → Inspect → note the element and its selector
4. Open the snippet and update the **`SELECTORS` object** at the top of the file:

```js
const SELECTORS = {
  postCard: '.feed-shared-update-v2',        // ← update this
  reactions: 'button[aria-label*="reaction"] span', // ← update this
  // ... etc
};
```

Each key in `SELECTORS` has a comment explaining what it targets. You only need to update the CSS selector string — the rest of the code stays the same.

**Tip:** Use Chrome's `$$('your-selector')` in the Console to test a selector before editing the snippet. It should return an array of matching elements.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| **0 posts found** | Scroll down on the activity page before running. Check `SELECTORS.postCard` matches the post wrapper. |
| **All metrics are 0** | Inspect a reaction count element and update the matching selector in `SELECTORS`. |
| **No follower count** | The selector depends on which LinkedIn view you're on. Navigate to the main profile page header view, or update `SELECTORS.followerCount`. |
| **Webhook fails (network error)** | Check that `https://n8n.linkright.in` is reachable. The payload is logged to console — you can copy it manually. |
| **Webhook returns 4xx/5xx** | The n8n workflow may be inactive or the webhook path changed. Check n8n. |
| **Impressions always 0** | Impressions are only visible in LinkedIn's creator/analytics mode. Switch to that view, or accept 0. |
| **CORS error on fetch** | LinkedIn's CSP may block cross-origin requests. Copy the logged payload from console and POST it manually (e.g. via curl or Postman). |

---

## Updating the Webhook URL

Edit the `CONFIG.WEBHOOK_URL` value at the top of the snippet:

```js
const CONFIG = {
  WEBHOOK_URL: 'https://n8n.linkright.in/webhook/sma-analytics-collect',
  // ...
};
```
