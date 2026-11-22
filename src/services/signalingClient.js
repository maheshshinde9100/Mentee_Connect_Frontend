const getWsUrl = () => {
  const wsUrl = process.env.REACT_APP_SIGNAL_URL;
  if (wsUrl) {
    return wsUrl;
  }

  // The backend exposes the signaling endpoint at /api/signal (context-path /api).
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  try {
    const url = new URL(apiUrl);
    return `${protocol}//${url.host}/api/signal`;
  } catch (e) {
    const host = apiUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `${protocol}//${host}/api/signal`;
  }
};

export const createSignalingClient = (userId, onMessage, onOpen, onClose) => {
  const token = localStorage.getItem('token');
  const url = `${getWsUrl()}?userId=${encodeURIComponent(userId)}${
    token ? `&token=${encodeURIComponent(token)}` : ''
  }`;
  const ws = new WebSocket(url);

  let closed = false;
  const notifyClose = () => {
    if (closed) return;
    closed = true;
    if (onClose) onClose();
  };

  ws.onopen = () => {
    closed = false;
    if (onOpen) onOpen();
  };

  ws.onerror = () => {
    notifyClose();
  };

  ws.onclose = () => {
    notifyClose();
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (onMessage) onMessage(data);
    } catch (e) {
      // Ignore malformed messages
    }
  };

  const send = (payload) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  };

  return { ws, send };
};

export default createSignalingClient;
