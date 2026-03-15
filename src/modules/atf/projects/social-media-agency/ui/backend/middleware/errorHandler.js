function errorHandler(err, req, res, _next) {
  const status = err.status || 502;
  const body = {
    error: err.message || 'Upstream error',
    code: err.code || 'UPSTREAM_ERROR',
    timestamp: new Date().toISOString(),
  };
  if (err.upstream) body.upstream = err.upstream;
  console.error(`[ERROR] ${req.method} ${req.path} → ${status}: ${err.message}`);
  res.status(status).json(body);
}

module.exports = errorHandler;
