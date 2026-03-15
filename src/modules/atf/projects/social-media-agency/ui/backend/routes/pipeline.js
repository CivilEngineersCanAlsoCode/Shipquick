const { Router } = require('express');
const { callWebhook } = require('../lib/webhook');

const router = Router();

// GET /api/pipeline — dashboard pipeline counts + action items
router.get('/', async (req, res, next) => {
  try {
    const data = await callWebhook('/sma-fetch-post', {
      action: 'pipeline_summary',
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
