const { Router } = require('express');
const { callWebhook } = require('../lib/webhook');

const router = Router();

const VALID_CONFIGS = [
  'scoring_weights', 'scoring_scales', 'posting_schedule',
  'formatting_config', 'engagement_config', 'review_config', 'analytics_config',
];

// GET /api/config — fetch config documents
router.get('/', async (req, res, next) => {
  try {
    const configId = req.query.type || 'all';
    const data = await callWebhook('/sma-fetch-config', { config_id: configId });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// PUT /api/config — save config document
router.put('/', async (req, res, next) => {
  try {
    const { config_id, data } = req.body;
    if (!VALID_CONFIGS.includes(config_id)) {
      return res.status(400).json({ error: 'Invalid config_id', code: 'INVALID_CONFIG' });
    }
    const result = await callWebhook('/sma-save-config', { config_id, data });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
