const { WebSocketServer } = require('ws');
const config = require('../config');
const sessionStore = require('./session-store');

const HEARTBEAT_INTERVAL = 30000;

function attach(httpServer) {
  const wss = new WebSocketServer({ noServer: true });

  // Handle upgrade with auth + path parsing
  httpServer.on('upgrade', (req, socket, head) => {
    const match = req.url.match(/^\/ws\/agent\/([a-f0-9-]+)(\?.*)?$/);
    if (!match) {
      socket.destroy();
      return;
    }

    // Auth: check api key from query string
    const url = new URL(req.url, `http://${req.headers.host}`);
    const apiKey = url.searchParams.get('apiKey');
    if (!apiKey || apiKey !== config.API_KEY) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      ws._sessionId = match[1];
      wss.emit('connection', ws, req);
    });
  });

  wss.on('connection', (ws) => {
    const sessionId = ws._sessionId;
    const session = sessionStore.get(sessionId);

    if (!session) {
      ws.send(JSON.stringify({ type: 'error', message: 'Session not found' }));
      ws.close();
      return;
    }

    // Subscribe this WS to session output
    session.ws.push(ws);

    // Send buffered log
    for (const data of session.log) {
      ws.send(JSON.stringify({ type: 'output', data, sessionId }));
    }

    // If already finished, send done
    if (session.status !== 'running') {
      ws.send(JSON.stringify({ type: 'done', sessionId, exitCode: session.status === 'done' ? 0 : 1 }));
    }

    // Heartbeat
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });

    ws.on('close', () => {
      const idx = session.ws.indexOf(ws);
      if (idx !== -1) session.ws.splice(idx, 1);
    });

    ws.on('error', () => {
      const idx = session.ws.indexOf(ws);
      if (idx !== -1) session.ws.splice(idx, 1);
    });
  });

  // Heartbeat interval
  const heartbeat = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) { ws.terminate(); return; }
      ws.isAlive = false;
      ws.ping();
    });
  }, HEARTBEAT_INTERVAL);

  wss.on('close', () => clearInterval(heartbeat));

  return wss;
}

module.exports = { attach };
