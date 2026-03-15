const pty = require('node-pty');
const { v4: uuidv4 } = require('uuid');

const MAX_CONCURRENT = 3;
const AUTO_KILL_MS = 10 * 60 * 1000; // 10 minutes
const DEFAULT_WORKDIR = '/home/ubuntu/MasterWorkspace/shipquick/src/modules/atf/projects/social-media-agency';
const ALLOWED_PREFIX = '/home/ubuntu/MasterWorkspace/shipquick/src/modules/atf/projects/social-media-agency';

const AGENT_COMMANDS = {
  claude: (prompt) => ({
    cmd: 'claude',
    args: ['--permission-mode', 'bypassPermissions', '--print', prompt],
  }),
  gemini: (prompt) => ({
    cmd: 'gemini',
    args: ['-p', prompt],
  }),
  opencode: (prompt) => ({
    cmd: 'opencode',
    args: ['run', prompt],
  }),
};

class SessionStore {
  constructor() {
    this.sessions = new Map();
  }

  spawn(agent, prompt, workdir) {
    if (this.sessions.size >= MAX_CONCURRENT) {
      throw new Error(`Max ${MAX_CONCURRENT} concurrent sessions reached`);
    }

    if (!AGENT_COMMANDS[agent]) {
      throw new Error(`Unknown agent: ${agent}. Supported: ${Object.keys(AGENT_COMMANDS).join(', ')}`);
    }

    const cwd = workdir || DEFAULT_WORKDIR;
    if (!cwd.startsWith(ALLOWED_PREFIX)) {
      throw new Error('Workdir must be under the SMA project directory');
    }

    const id = uuidv4();
    const { cmd, args } = AGENT_COMMANDS[agent](prompt);

    const ptyProcess = pty.spawn(cmd, args, {
      name: 'xterm-256color',
      cols: 120,
      rows: 40,
      cwd,
      env: { ...process.env },
    });

    const session = {
      id,
      pty: ptyProcess,
      agent,
      status: 'running',
      log: [],
      startedAt: new Date().toISOString(),
      ws: [],
      _timer: null,
    };

    // Auto-kill timer
    session._timer = setTimeout(() => {
      this.kill(id);
    }, AUTO_KILL_MS);

    // Collect output
    ptyProcess.onData((data) => {
      session.log.push(data);
      // Notify all subscribed WebSockets
      for (const ws of session.ws) {
        if (ws.readyState === 1) { // OPEN
          ws.send(JSON.stringify({ type: 'output', data, sessionId: id }));
        }
      }
    });

    ptyProcess.onExit(({ exitCode }) => {
      session.status = exitCode === 0 ? 'done' : 'error';
      clearTimeout(session._timer);
      // Notify all subscribed WebSockets
      for (const ws of session.ws) {
        if (ws.readyState === 1) {
          ws.send(JSON.stringify({ type: 'done', sessionId: id, exitCode }));
        }
      }
    });

    this.sessions.set(id, session);
    return { sessionId: id, status: 'running' };
  }

  kill(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    clearTimeout(session._timer);
    if (session.status === 'running') {
      try { session.pty.kill(); } catch (_) { /* already dead */ }
      session.status = 'killed';
    }
    // Notify WebSockets
    for (const ws of session.ws) {
      if (ws.readyState === 1) {
        ws.send(JSON.stringify({ type: 'done', sessionId, exitCode: -1 }));
      }
    }
    this.sessions.delete(sessionId);
  }

  list() {
    return Array.from(this.sessions.values()).map((s) => ({
      id: s.id,
      agent: s.agent,
      status: s.status,
      startedAt: s.startedAt,
      logLength: s.log.length,
    }));
  }

  getLog(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');
    return session.log;
  }

  get(sessionId) {
    return this.sessions.get(sessionId);
  }

  writeInput(sessionId, data) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');
    if (session.status !== 'running') throw new Error('Session is not running');
    session.pty.write(data);
  }
}

// Singleton
module.exports = new SessionStore();
