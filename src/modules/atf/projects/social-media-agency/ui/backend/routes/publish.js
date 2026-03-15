const { Router } = require('express');
const { callWebhook } = require('../lib/webhook');

const router = Router();

// POST /api/publish/:id — publish post to LinkedIn
router.post('/:id', async (req, res, next) => {
  try {
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

    // 3. Notify via Telegram (non-blocking)
    callWebhook('/sma-notify-telegram', {
      post_id: req.params.id,
      event: 'published',
    }).catch(() => {});

    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
