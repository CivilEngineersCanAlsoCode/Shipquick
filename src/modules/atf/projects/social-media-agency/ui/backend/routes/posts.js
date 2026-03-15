const { Router } = require('express');
const { callWebhook } = require('../lib/webhook');

const router = Router();

// GET /api/posts — paginated post list with filters
router.get('/', async (req, res, next) => {
  try {
    const { status, pillar, dateFrom, dateTo, sort, page, limit } = req.query;
    const payload = {
      action: 'list',
      filters: { status, pillar, dateFrom, dateTo },
      sort: sort || 'scheduled_date',
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    };
    const data = await callWebhook('/sma-fetch-post', payload);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/:id — single post detail
router.get('/:id', async (req, res, next) => {
  try {
    const data = await callWebhook('/sma-fetch-post', {
      action: 'get',
      post_id: req.params.id,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// PUT /api/posts/:id — update post
router.put('/:id', async (req, res, next) => {
  try {
    const allowed = ['status', 'content', 'scheduled_date', 'metadata'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const data = await callWebhook('/sma-update-post', {
      post_id: req.params.id,
      ...updates,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// POST /api/posts — save new post
router.post('/', async (req, res, next) => {
  try {
    const data = await callWebhook('/sma-save-post', req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
