/**
 * LinkRight SMA — API Client
 * 
 * All data flows through n8n webhooks.
 * Base URL: http://172.17.0.2:5678/webhook
 * 
 * When Satvik builds the 5 missing webhooks, just update the
 * status from "NOT_BUILT" to the actual path — no other changes needed.
 */

// ── n8n Webhook Base ──────────────────────────────────────────────────
const N8N_BASE = 'http://172.17.0.2:5678/webhook';

// ── Webhook Registry ──────────────────────────────────────────────────
// Status: ✅ = working, ❌ = 404 (Satvik needs to build in n8n)
export const WEBHOOKS = {
  // ✅ WORKING — 9 webhooks
  SUBMIT_BRIEF:       `${N8N_BASE}/sma-submit-brief`,
  FETCH_BRIEFS:       `${N8N_BASE}/sma-fetch-briefs`,
  FETCH_PAST_POSTS:   `${N8N_BASE}/sma-fetch-past-posts`,
  SEARCH_EXPERIENCES: `${N8N_BASE}/sma-search-experiences`,
  FETCH_CONFIG:       `${N8N_BASE}/sma-fetch-config`,
  UPDATE_SHEET:       `${N8N_BASE}/sma-update-sheet-status`,
  SAVE_CONFIG:        `${N8N_BASE}/sma-save-config`,
  SAVE_EXPERIENCE:    `${N8N_BASE}/sma-save-experience`,
  SAVE_POST:          `${N8N_BASE}/sma-save-post`,

  // ❌ NOT BUILT — 5 webhooks (Satvik: create these in n8n, same URL pattern)
  FETCH_POST:         `${N8N_BASE}/sma-fetch-post`,         // GET post by ID + list with all fields
  UPDATE_POST:        `${N8N_BASE}/sma-update-post`,        // Merge updates into post document
  PUBLISH_LINKEDIN:   `${N8N_BASE}/sma-publish-linkedin`,   // One-shot publish to LinkedIn
  NOTIFY_TELEGRAM:    `${N8N_BASE}/sma-notify-telegram`,    // Send notification to Telegram group
  ANALYTICS_COLLECT:  `${N8N_BASE}/sma-analytics-collect`,  // Submit metrics from JS snippet
};

// ── Fetch helper ──────────────────────────────────────────────────────
export async function n8nFetch(webhookUrl, body = {}) {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Webhook not built yet. Ask Satvik to create it in n8n.`);
    }
    throw new Error(`Webhook failed: ${res.status}`);
  }
  return res.json();
}

// ── Convenience functions ─────────────────────────────────────────────

/** Fetch all posts (working) */
export async function fetchPosts(limit = 50) {
  const data = await n8nFetch(WEBHOOKS.FETCH_PAST_POSTS, { channel: 'linkedin', limit });
  return data.posts || [];
}

/** Fetch all config docs (working) */
export async function fetchAllConfig() {
  return n8nFetch(WEBHOOKS.FETCH_CONFIG, { config_id: 'all' });
}

/** Save a config doc (working) */
export async function saveConfig(configId, data) {
  return n8nFetch(WEBHOOKS.SAVE_CONFIG, { config_id: configId, data });
}

/** Fetch single post by ID (❌ NOT BUILT) */
export async function fetchPost(postId) {
  return n8nFetch(WEBHOOKS.FETCH_POST, { action: 'get', post_id: postId });
}

/** Update post (❌ NOT BUILT) */
export async function updatePost(postId, updates) {
  return n8nFetch(WEBHOOKS.UPDATE_POST, { post_id: postId, ...updates });
}

/** Publish to LinkedIn (❌ NOT BUILT) */
export async function publishPost(postId) {
  return n8nFetch(WEBHOOKS.PUBLISH_LINKEDIN, { post_id: postId });
}
