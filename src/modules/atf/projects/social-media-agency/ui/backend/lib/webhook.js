const config = require('../config');

async function callWebhook(path, body) {
  const url = `${config.N8N_BASE_URL}${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await response.json();

    if (!response.ok) {
      const err = new Error(data.message || `Webhook ${path} failed`);
      err.status = response.status >= 400 ? response.status : 502;
      err.code = 'WEBHOOK_ERROR';
      err.upstream = { path, status: response.status };
      throw err;
    }

    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeout = new Error(`Webhook ${path} timed out`);
      timeout.status = 504;
      timeout.code = 'UPSTREAM_TIMEOUT';
      timeout.upstream = { path, status: null };
      throw timeout;
    }
    if (err.code === 'WEBHOOK_ERROR') throw err;

    const wrapped = new Error(err.message || `Webhook ${path} failed`);
    wrapped.status = 502;
    wrapped.code = 'WEBHOOK_ERROR';
    wrapped.upstream = { path, status: null };
    throw wrapped;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { callWebhook };
