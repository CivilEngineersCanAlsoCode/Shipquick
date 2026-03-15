const express = require('express');
const router = express.Router();
const sessionStore = require('../lib/session-store');

// POST /api/agent/sessions — spawn a new agent session
router.post('/sessions', (req, res) => {
  const { agent, prompt, workdir } = req.body;

  if (!agent || !prompt) {
    return res.status(400).json({ error: 'agent and prompt are required' });
  }

  try {
    const result = sessionStore.spawn(agent, prompt, workdir);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/agent/sessions — list all sessions
router.get('/sessions', (_req, res) => {
  res.json(sessionStore.list());
});

// GET /api/agent/sessions/:id — get session details
router.get('/sessions/:id', (req, res) => {
  try {
    const session = sessionStore.get(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json({
      id: session.id,
      agent: session.agent,
      status: session.status,
      startedAt: session.startedAt,
      log: session.log,
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// DELETE /api/agent/sessions/:id — kill session
router.delete('/sessions/:id', (req, res) => {
  try {
    sessionStore.kill(req.params.id);
    res.json({ status: 'killed' });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// POST /api/agent/sessions/:id/input — write to PTY stdin
router.post('/sessions/:id/input', (req, res) => {
  const { data } = req.body;
  if (data === undefined) {
    return res.status(400).json({ error: 'data is required' });
  }

  try {
    sessionStore.writeInput(req.params.id, data);
    res.json({ status: 'sent' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
