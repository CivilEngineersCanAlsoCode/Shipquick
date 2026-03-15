import { useState, useRef, useCallback, useEffect } from 'react';

const MAX_BACKOFF = 8000;

export default function useAgentSocket() {
  const [status, setStatus] = useState('disconnected'); // connecting | connected | disconnected | error
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);
  const sessionRef = useRef(null);
  const retriesRef = useRef(0);
  const queueRef = useRef([]);
  const reconnectTimerRef = useRef(null);

  const flushQueue = useCallback((ws) => {
    while (queueRef.current.length > 0) {
      const msg = queueRef.current.shift();
      ws.send(JSON.stringify(msg));
    }
  }, []);

  const doConnect = useCallback((sessionId) => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setStatus('connecting');
    const ws = new WebSocket(`ws://localhost:3001/ws/agent/${sessionId}`);

    ws.onopen = () => {
      setStatus('connected');
      retriesRef.current = 0;
      flushQueue(ws);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => {
          // Streaming: append chunk to last agent message
          if (data.type === 'chunk' && prev.length > 0) {
            const last = prev[prev.length - 1];
            if (last.role === 'agent' && !last.done) {
              return [...prev.slice(0, -1), { ...last, text: last.text + (data.text || '') }];
            }
          }
          if (data.type === 'chunk') {
            return [...prev, { role: 'agent', text: data.text || '', done: false, ts: Date.now() }];
          }
          if (data.type === 'done') {
            if (prev.length > 0 && prev[prev.length - 1].role === 'agent') {
              return [...prev.slice(0, -1), { ...prev[prev.length - 1], done: true }];
            }
            return prev;
          }
          if (data.type === 'error') {
            return [...prev, { role: 'system', text: data.message || 'Agent error', ts: Date.now() }];
          }
          // Generic message
          return [...prev, { role: data.role || 'agent', text: data.text || JSON.stringify(data), done: true, ts: Date.now() }];
        });
      } catch {
        // Non-JSON message
        setMessages((prev) => [...prev, { role: 'agent', text: event.data, done: true, ts: Date.now() }]);
      }
    };

    ws.onerror = () => {
      setStatus('error');
    };

    ws.onclose = () => {
      setStatus('disconnected');
      wsRef.current = null;
      // Auto-reconnect with exponential backoff
      if (sessionRef.current) {
        const delay = Math.min(1000 * Math.pow(2, retriesRef.current), MAX_BACKOFF);
        retriesRef.current += 1;
        reconnectTimerRef.current = setTimeout(() => {
          if (sessionRef.current) doConnect(sessionRef.current);
        }, delay);
      }
    };

    wsRef.current = ws;
  }, [flushQueue]);

  const connect = useCallback((sessionId) => {
    sessionRef.current = sessionId;
    retriesRef.current = 0;
    setMessages([]);
    doConnect(sessionId);
  }, [doConnect]);

  const disconnect = useCallback(() => {
    sessionRef.current = null;
    clearTimeout(reconnectTimerRef.current);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus('disconnected');
  }, []);

  const sendInput = useCallback((data) => {
    const msg = typeof data === 'string' ? { type: 'input', text: data } : data;
    // Add user message to local state
    setMessages((prev) => [...prev, { role: 'user', text: msg.text || '', done: true, ts: Date.now() }]);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    } else {
      queueRef.current.push(msg);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sessionRef.current = null;
      clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return {
    status,
    messages,
    isConnected: status === 'connected',
    connect,
    disconnect,
    sendInput,
  };
}
