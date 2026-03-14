// ============================================================
// LinkedIn Metrics Scraper — Chrome DevTools Snippet
// ============================================================
// HOW TO USE:
//   1. Go to your LinkedIn activity page
//   2. Scroll down to load all posts you want to capture
//   3. Open DevTools → Sources → Snippets → paste & run
//
// LinkedIn changes its DOM frequently. If scraping breaks,
// update the SELECTORS object below — each key is commented.
// ============================================================

(async function linkedInMetricsScraper() {
  'use strict';

  // ── CONFIGURATION ──────────────────────────────────────────
  const CONFIG = {
    // n8n webhook endpoint
    WEBHOOK_URL: 'https://n8n.linkright.in/webhook/sma-analytics-collect',

    // Maximum time (ms) to wait for lazy-loaded content
    SCROLL_WAIT_MS: 1500,

    // Number of extra scrolls to trigger lazy loading
    EXTRA_SCROLLS: 2,
  };

  // ── SELECTORS ──────────────────────────────────────────────
  // Update these when LinkedIn changes its HTML structure.
  // Tip: right-click an element → Inspect → copy selector.
  const SELECTORS = {

    // Each post card wrapper on the activity/recent-activity page
    postCard: '.feed-shared-update-v2',

    // Anchor link inside a post that leads to the post detail page
    // Usually an <a> with the post URL in href
    postLink: 'a[data-urn], a.feed-shared-update-v2__content-wrapper, a[href*="/feed/update/"]',

    // Reaction (like) count — the button/span showing "X reactions"
    reactions: '.social-details-social-counts__reactions-count, button[aria-label*="reaction"] span, span.social-details-social-counts__social-proof-text',

    // Comment count — the button/span showing "X comments"
    comments: 'button[aria-label*="comment"] span, .social-details-social-counts__comments',

    // Repost / share count
    reposts: 'button[aria-label*="repost"] span, .social-details-social-counts__reposts',

    // Impressions — visible in creator/analytics mode (may not always exist)
    impressions: '.analytics-entry-point span, .feed-shared-update-v2__analytics span, [data-test-id="impressions"]',

    // Follower count on the profile sidebar or header
    followerCount: '.pv-top-card--list .t-bold, .pvs-header__subtitle span, span.t-bold[aria-label*="follower"]',

    // Post text content (first ~100 chars used as fallback identifier)
    postText: '.feed-shared-update-v2__description .break-words span[dir="ltr"], .feed-shared-text__text-view span[dir="ltr"]',

    // Post timestamp
    postTimestamp: '.feed-shared-actor__sub-description span.visually-hidden, time',
  };

  // ── HELPERS ────────────────────────────────────────────────

  /** Safely read trimmed text from the first matching element inside a parent */
  function getText(parent, selector) {
    try {
      const el = parent.querySelector(selector);
      return el ? el.innerText.trim() : null;
    } catch {
      return null;
    }
  }

  /** Parse a LinkedIn metric string like "1,234" or "12K" into a number */
  function parseMetric(raw) {
    if (!raw) return 0;
    const cleaned = raw.replace(/,/g, '').trim().toLowerCase();
    if (cleaned.endsWith('k')) return Math.round(parseFloat(cleaned) * 1000);
    if (cleaned.endsWith('m')) return Math.round(parseFloat(cleaned) * 1000000);
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? 0 : num;
  }

  /** Extract the first href that looks like a LinkedIn post URL */
  function extractPostUrl(card) {
    // Try dedicated selector first
    const link = card.querySelector(SELECTORS.postLink);
    if (link && link.href) return link.href.split('?')[0];

    // Fallback: any anchor with /feed/update/ in href
    const fallback = card.querySelector('a[href*="/feed/update/"]');
    if (fallback) return fallback.href.split('?')[0];

    // Last resort: data-urn attribute
    const urn = card.getAttribute('data-urn');
    if (urn) return `https://www.linkedin.com/feed/update/${urn}`;

    return null;
  }

  /** Scroll down to trigger lazy loading, then wait */
  async function triggerLazyLoad() {
    for (let i = 0; i < CONFIG.EXTRA_SCROLLS; i++) {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, CONFIG.SCROLL_WAIT_MS));
    }
    // Scroll back to top so user can see console output
    window.scrollTo(0, 0);
  }

  // ── MAIN SCRAPE ────────────────────────────────────────────
  console.log('%c[LinkedIn Scraper] Starting...', 'color: #0a66c2; font-weight: bold');

  // Trigger lazy load for off-screen posts
  console.log('[LinkedIn Scraper] Scrolling to load lazy content...');
  await triggerLazyLoad();

  // Grab follower count from page (best-effort)
  const followerRaw = getText(document, SELECTORS.followerCount);
  const followerCount = parseMetric(followerRaw);
  console.log(`[LinkedIn Scraper] Follower count detected: ${followerRaw || 'not found'} → ${followerCount}`);

  // Find all post cards
  const cards = document.querySelectorAll(SELECTORS.postCard);
  console.log(`[LinkedIn Scraper] Found ${cards.length} post cards on page`);

  if (cards.length === 0) {
    console.warn('[LinkedIn Scraper] No posts found. Check SELECTORS.postCard or scroll more.');
    return;
  }

  const posts = [];

  cards.forEach((card, idx) => {
    const postUrl = extractPostUrl(card);
    const reactionsRaw = getText(card, SELECTORS.reactions);
    const commentsRaw = getText(card, SELECTORS.comments);
    const repostsRaw = getText(card, SELECTORS.reposts);
    const impressionsRaw = getText(card, SELECTORS.impressions);
    const textSnippet = getText(card, SELECTORS.postText);
    const timestamp = getText(card, SELECTORS.postTimestamp);

    const post = {
      index: idx + 1,
      post_url: postUrl,
      text_preview: textSnippet ? textSnippet.substring(0, 120) : null,
      timestamp: timestamp || null,
      likes: parseMetric(reactionsRaw),
      comments: parseMetric(commentsRaw),
      reposts: parseMetric(repostsRaw),
      impressions: parseMetric(impressionsRaw),
      raw: {
        reactions: reactionsRaw,
        comments: commentsRaw,
        reposts: repostsRaw,
        impressions: impressionsRaw,
      },
    };

    posts.push(post);
    console.log(
      `  Post #${post.index}: ${post.likes} likes, ${post.comments} comments, ${post.reposts} reposts` +
        (post.impressions ? `, ${post.impressions} impressions` : '')
    );
  });

  // ── BUILD PAYLOAD ──────────────────────────────────────────
  const payload = {
    source: 'linkedin-devtools-snippet',
    scraped_at: new Date().toISOString(),
    page_url: window.location.href,
    follower_count: followerCount,
    post_count: posts.length,
    posts: posts,
  };

  console.log('%c[LinkedIn Scraper] Payload ready:', 'color: #0a66c2', JSON.stringify(payload, null, 2));

  // ── SEND TO WEBHOOK ────────────────────────────────────────
  try {
    console.log(`[LinkedIn Scraper] POSTing ${posts.length} posts to webhook...`);
    const response = await fetch(CONFIG.WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const body = await response.text();
      console.log('%c[LinkedIn Scraper] ✓ Webhook accepted!', 'color: green; font-weight: bold');
      console.log('[LinkedIn Scraper] Response:', body);
    } else {
      console.error(`[LinkedIn Scraper] Webhook returned ${response.status}: ${response.statusText}`);
    }
  } catch (err) {
    console.error('[LinkedIn Scraper] Webhook request failed:', err.message);
    console.log('[LinkedIn Scraper] Payload was logged above — you can copy it manually.');
  }

  console.log('%c[LinkedIn Scraper] Done.', 'color: #0a66c2; font-weight: bold');
})();
