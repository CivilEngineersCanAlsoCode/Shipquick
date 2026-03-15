const express = require('express');
const cors = require('cors');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// --- Middleware ---
app.use(cors({
  origin: config.CORS_ORIGIN,
  methods: ['GET', 'PUT', 'POST'],
  allowedHeaders: ['Content-Type', 'X-API-Key'],
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.path} → ${res.statusCode} (${ms}ms)`);
  });
  next();
});

// Health check (no auth)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Auth for all /api routes ---
app.use('/api', authMiddleware);

// --- Routes ---
app.use('/api/briefs', require('./routes/briefs'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/config', require('./routes/config'));
app.use('/api/publish', require('./routes/publish'));
app.use('/api/notify', require('./routes/notify'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/experiences', require('./routes/experiences'));
app.use('/api/pipeline', require('./routes/pipeline'));

// --- Error handling ---
app.use(errorHandler);

// --- Start ---
app.listen(config.PORT, () => {
  console.log(`SMA Bridge running on port ${config.PORT}`);
  console.log(`n8n target: ${config.N8N_BASE_URL}`);
  console.log(`CORS origin: ${config.CORS_ORIGIN}`);
});
