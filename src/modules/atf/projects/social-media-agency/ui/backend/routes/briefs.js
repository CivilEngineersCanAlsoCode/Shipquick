const { Router } = require('express');
const { callWebhook } = require('../lib/webhook');

const router = Router();

// GET /api/briefs — fetch briefs
router.get('/', async (req, res, next) => {
  try {
    const data = await callWebhook('/sma-fetch-briefs', req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// POST /api/briefs — submit brief
router.post('/', async (req, res, next) => {
  try {
    const data = await callWebhook('/sma-submit-brief', req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
