const { Router } = require('express');
const { callWebhook } = require('../lib/webhook');

const router = Router();

// POST /api/experiences — save experience
router.post('/', async (req, res, next) => {
  try {
    const data = await callWebhook('/sma-save-experience', req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/experiences — search experiences
router.get('/', async (req, res, next) => {
  try {
    const data = await callWebhook('/sma-search-experiences', req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
