const { Router } = require('express');
const { callWebhook } = require('../lib/webhook');

const router = Router();

// GET /api/analytics — analytics summary data
router.get('/', async (req, res, next) => {
  try {
    const period = req.query.period || '7d';
    const data = await callWebhook('/sma-analytics-collect', {
      action: 'summary',
      period,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
