const config = require('../config');

function authMiddleware(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key || key !== config.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized', code: 'AUTH_MISSING_KEY' });
  }
  next();
}

module.exports = authMiddleware;
