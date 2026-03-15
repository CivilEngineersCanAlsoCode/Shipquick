require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3001,
  N8N_BASE_URL: process.env.N8N_BASE_URL || 'http://localhost:5678/webhook',
  API_KEY: process.env.SMA_API_KEY || 'dev-key-change-me',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  REQUEST_TIMEOUT_MS: 15000,
};
