const { Router } = require('express');
const { callWebhook } = require('../lib/webhook');

const router = Router();

// POST /api/notify — send Telegram notification
router.post('/', async (req, res, next) => {
  try {
    const data = await callWebhook('/sma-notify-telegram', req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
