# Agent Bridge — CLI ↔ Dashboard Integration Plan

**Goal:** Let the dashboard UI spawn and interact with AI coding agents (Claude Code, Gemini CLI, OpenCode) running on the server, so Satvik can run content pipeline commands from the browser.

**Status:** NOT BUILT — current backend only proxies to n8n webhooks.

---

## Why This Matters

Right now the content pipeline works like:
```
Satvik → ChatGPT (browser) → n8n webhooks → MongoDB
Satvik → Dashboard (browser) → n8n webhooks → MongoDB (view/review)
```

With Agent Bridge:
```
Satvik → Dashboard (browser) → Agent Bridge → Claude Code CLI → (reads files, runs pipeline, updates MongoDB via n8n)
```

**Use case:** "Plan 3 posts for this week" → Dashboard sends to Claude Code → Claude reads config, scores briefs, calls n8n webhooks, returns planned posts → Dashboard shows results in real-time.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│ FRONTEND (React + MUI)                       │
│                                              │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │ Dashboard     │  │ Agent Chat Panel     │ │
│  │ Posts         │  │ ┌──────────────────┐ │ │
│  │ Analytics     │  │ │ Message history   │ │ │
│  │ Settings      │  │ │ ...              │ │ │
│  │               │  │ │ User: Plan 3     │ │ │
│  │               │  │ │ Agent: Working...│ │ │
│  │               │  │ │ Agent: Done! ✅  │ │ │
│  │               │  │ └──────────────────┘ │ │
│  │               │  │ [Type message...] 📎 │ │
│  └──────────────┘  └──────────────────────┘ │
│                              ↕ WebSocket     │
├──────────────────────────────────────────────┤
│ BACKEND (Express.js)                         │
│                                              │
│  ┌────────────┐  ┌──────────────────────┐   │
│  │ REST API    │  │ Agent Bridge         │   │
│  │ (n8n proxy) │  │                      │   │
│  │ /api/posts  │  │ WebSocket server     │   │
│  │ /api/config │  │ Session manager      │   │
│  │ ...         │  │ PTY spawner          │   │
│  └────────────┘  │ Output streamer      │   │
│                   └──────────┬───────────┘   │
│                              │               │
│                   ┌──────────▼───────────┐   │
│                   │ CLI Process (PTY)     │   │
│                   │                      │   │
│                   │ claude --print       │   │
│                   │ OR                   │   │
│                   │ gemini               │   │
│                   │ OR                   │   │
│                   │ opencode             │   │
│                   └──────────────────────┘   │
└──────────────────────────────────────────────┘
```

---

## Option A: WebSocket + node-pty (FULL INTERACTIVE)

**Best for:** Real-time streaming, interactive sessions, terminal-like experience

### Backend Changes

```
NEW DEPENDENCIES:
  ws ^8.16.0          # WebSocket server
  node-pty ^1.0.0     # Pseudo-terminal spawning
  uuid ^9.0.0         # Session IDs

NEW FILES:
  routes/agent.js     # REST endpoints for agent management
  lib/agent-bridge.js # Core bridge logic
  lib/session-store.js # In-memory session tracking
```

### Flow

```
1. Frontend opens WebSocket: ws://localhost:3001/ws/agent
2. Frontend sends: { action: "spawn", agent: "claude", prompt: "Plan 3 posts" }
3. Backend spawns: claude --print --permission-mode bypassPermissions "Plan 3 posts"
4. Backend streams stdout chunks via WebSocket: { type: "output", data: "Analyzing..." }
5. When agent finishes: { type: "done", exitCode: 0 }
6. Frontend can send input: { action: "input", data: "yes" }
7. Frontend can kill: { action: "kill" }
```

### Agent Bridge API

```
WebSocket /ws/agent:
  → { action: "spawn", agent: "claude"|"gemini"|"opencode", prompt: string, workdir?: string }
  ← { type: "output", data: string, sessionId: string }
  ← { type: "done", sessionId: string, exitCode: number }
  ← { type: "error", message: string }
  → { action: "input", sessionId: string, data: string }
  → { action: "kill", sessionId: string }
  → { action: "list" }
  ← { type: "sessions", sessions: [{ id, agent, status, startedAt }] }

REST /api/agent:
  GET  /api/agent/sessions         → list active sessions
  GET  /api/agent/sessions/:id/log → get session output history
  POST /api/agent/sessions         → spawn new session (returns sessionId)
  DELETE /api/agent/sessions/:id   → kill session
```

### Session Manager

```javascript
// lib/session-store.js
class SessionStore {
  sessions = new Map();  // sessionId → { pty, agent, status, log, startedAt, ws }
  
  spawn(agent, prompt, workdir) {
    const id = uuid();
    const shell = this.getCommand(agent, prompt);
    const pty = spawn(shell.cmd, shell.args, {
      name: 'xterm-256color',
      cols: 120, rows: 40,
      cwd: workdir || SMA_ROOT,
      env: { ...process.env, TERM: 'xterm-256color' }
    });
    
    this.sessions.set(id, { pty, agent, status: 'running', log: [], startedAt: new Date() });
    return id;
  }
  
  getCommand(agent, prompt) {
    switch (agent) {
      case 'claude':
        return { 
          cmd: 'claude', 
          args: ['--permission-mode', 'bypassPermissions', '--print', prompt] 
        };
      case 'gemini':
        return { cmd: 'gemini', args: ['-p', prompt] };
      case 'opencode':
        return { cmd: 'opencode', args: ['run', prompt] };
    }
  }
}
```

### Security

- **Single user** (no auth in v1, same as rest of app)
- **Workdir locked** to SMA project root (prevent file system escape)
- **Max sessions:** 3 concurrent (prevent resource exhaustion)
- **Session timeout:** 10 minutes (auto-kill hung agents)
- **No shell injection:** prompt passed as single arg, not interpolated

### Estimated Work

| Task | Hours |
|------|-------|
| WebSocket server setup | 1 |
| Session manager + PTY spawning | 2 |
| Output streaming + buffering | 1 |
| Frontend chat panel component | 2 |
| Frontend WebSocket client | 1 |
| Error handling + reconnect | 1 |
| **Total** | **8 hours** |

---

## Option B: REST Polling (SIMPLER)

**Best for:** MVP, no WebSocket complexity, works behind proxies

### How It Works

```
1. POST /api/agent/run { agent: "claude", prompt: "Plan 3 posts" }
   → Returns: { sessionId: "abc123" }
   → Backend spawns claude --print in background

2. GET /api/agent/sessions/abc123/stream
   → Returns: Server-Sent Events (SSE) stream
   → Content-Type: text/event-stream
   → data: {"chunk": "Analyzing config...\n"}
   → data: {"chunk": "Found 3 briefs...\n"}
   → data: {"done": true, "exitCode": 0}

3. POST /api/agent/sessions/abc123/input
   → Sends: { data: "yes" }
```

### Advantages Over WebSocket
- Works through HTTP proxies
- SSE auto-reconnects
- Simpler error handling
- No ws dependency

### Estimated Work: **5 hours**

---

## Option C: Hybrid (RECOMMENDED)

**WebSocket for real-time streaming + REST for management**

```
REST:
  POST /api/agent/sessions           → spawn agent (returns sessionId)
  GET  /api/agent/sessions           → list sessions
  GET  /api/agent/sessions/:id       → session status + recent log
  DELETE /api/agent/sessions/:id     → kill
  POST /api/agent/sessions/:id/input → send input

WebSocket:
  ws://localhost:3001/ws/agent/:sessionId → subscribe to output stream
```

Frontend:
1. Call REST to spawn
2. Open WebSocket to subscribe to output
3. Display in chat-like panel
4. Use REST for input/kill

### Estimated Work: **6 hours**

---

## Frontend: Agent Chat Panel

### Component: AgentPanel.jsx

```
┌──────────────────────────────────────┐
│ 🤖 Claude Code                [Stop]│
│ ─────────────────────────────────── │
│ You: Plan 3 posts for this week     │
│                                      │
│ Claude: Analyzing scoring config...  │
│ > Freshness weight: 8               │
│ > Personal Experience: 5            │
│ > Research Quality: 3               │
│                                      │
│ Fetching briefs from Google Sheets...│
│ Found 5 briefs, scoring...          │
│                                      │
│ ✅ 3 posts planned:                  │
│ 1. "Why AI won't replace PMs" (ai)  │
│    Score: 142/160 ■■■■■■■■■░        │
│ 2. "GoGoGo driver welfare" (startup) │
│    Score: 134/160 ■■■■■■■■░░        │
│ 3. "Hot take: MBA vs hustle" (hot)   │
│    Score: 128/160 ■■■■■■■░░░        │
│                                      │
│ Posts saved to MongoDB. ✅            │
├──────────────────────────────────────┤
│ [Type a message...              ] 📤│
└──────────────────────────────────────┘
```

### Integration with Dashboard

| Dashboard Action | Agent Command |
|-----------------|---------------|
| "Plan Content" FAB | `claude --print "Plan content using SMA pipeline step A. Read config, score briefs, save top 3."` |
| "Draft Post" button | `claude --print "Draft post for brief: {title}. Follow B-ContentDrafting workflow."` |
| "Format Post" button | `claude --print "Format post {id}. Apply FR01-FR16 rules. Save formatting report."` |
| "Review All" batch | `claude --print "Review all Previewed posts. Apply C-ContentReview workflow."` |
| "Analyze" trigger | `claude --print "Run E-AnalyticsReview for post {id}. Calculate engagement."` |

### Pre-built Prompts (dropdown)

The Agent Panel has a dropdown of pre-configured prompts:

```javascript
const AGENT_PROMPTS = [
  {
    label: "Plan This Week's Content",
    prompt: `You are the LinkRight SMA content planning agent.
Read config from: http://172.17.0.2:5678/webhook/sma-fetch-config
Read briefs from: http://172.17.0.2:5678/webhook/sma-fetch-briefs
Read past posts from: http://172.17.0.2:5678/webhook/sma-fetch-past-posts

Steps:
1. Fetch scoring_weights and posting_schedule configs
2. Fetch all open briefs
3. Fetch past 14 days of posts (for freshness scoring)
4. Score each brief: F×8 + P×5 + R×3
5. Pick top 3 scoring briefs for Mon/Wed/Fri
6. Save each as a post via: http://172.17.0.2:5678/webhook/sma-save-post
7. Report what was planned with scores`,
    agent: "claude"
  },
  {
    label: "Draft Selected Post",
    prompt: "Draft content for post: {{POST_TITLE}}. Follow vulnerable-conversational tone...",
    agent: "claude",
    requiresPost: true
  },
  // ... more prompts
];
```

---

## Prerequisite: System Prompt for Agent

The CLI agent needs a system prompt / context that tells it:
1. What webhook URLs to use
2. What the pipeline steps are
3. What config format to expect
4. What MongoDB schema looks like

This already exists in our ChatGPT knowledge files (K1-K6)!
The agent can read them from disk:
```
src/modules/atf/projects/social-media-agency/chatgpt/knowledge/K1-config-and-pipeline.md
src/modules/atf/projects/social-media-agency/CONTEXT.md
```

---

## Build Order

```
Phase 1 (Backend — 3 hours):
  [ ] Install ws + node-pty
  [ ] lib/session-store.js (spawn, kill, list, getLog)
  [ ] lib/agent-bridge.js (WebSocket handler)
  [ ] routes/agent.js (REST management endpoints)
  [ ] Update server.js (mount WS + routes)

Phase 2 (Frontend — 3 hours):
  [ ] src/components/AgentPanel.jsx (chat UI)
  [ ] src/hooks/useAgentSocket.js (WebSocket client)
  [ ] AGENT_PROMPTS config with pre-built commands
  [ ] Integration: FAB → AgentPanel, PostDetail → "Draft" button
  [ ] Slide-out drawer or right sidebar layout

Phase 3 (Polish — 1 hour):
  [ ] Reconnect logic
  [ ] Session persistence across page navigation
  [ ] Agent output syntax highlighting (markdown)
  [ ] Loading/thinking animation
  [ ] Error states
```

---

## Decision Matrix

| Criteria | Option A (WS+PTY) | Option B (REST) | Option C (Hybrid) |
|----------|-------------------|-----------------|-------------------|
| Real-time streaming | ✅ Best | ⚠️ SSE ok | ✅ Best |
| Complexity | High | Low | Medium |
| Works behind proxy | ❌ Maybe | ✅ Yes | ✅ Yes |
| Interactive input | ✅ Full | ⚠️ REST calls | ✅ REST+WS |
| Hours to build | 8 | 5 | 6 |
| **Recommendation** | | | **✅ THIS ONE** |

---

## Currently Available: Claude Code only

```
claude --version → 2.1.72 (Claude Code)
gemini → NOT INSTALLED
opencode → NOT INSTALLED  
codex → NOT INSTALLED
```

Can install others:
```bash
npm install -g @anthropic-ai/claude-code    # Already installed
npm install -g @google/gemini-cli           # Available
npm install -g opencode                      # Available
npx codex@latest                            # Available
```

Start with Claude Code only. Add others later as plugins.
