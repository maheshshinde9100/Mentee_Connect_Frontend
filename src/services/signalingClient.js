const getWsUrl = () => {
  // Use the WebSocket URL from environment variable if available
  const wsUrl = process.env.REACT_APP_SIGNAL_URL;
  if (wsUrl) {
    return wsUrl;
  }

  // Fallback to constructing from API URL
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  try {
    const url = new URL(apiUrl);
    const host = url.host;
    return `${protocol}//${host}/signal`;
  } catch (e) {
    const host = apiUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `${protocol}//${host}/signal`;
  }
};

export const createSignalingClient = (userId, onMessage, onOpen, onClose) => {
  const token = localStorage.getItem('token');
  const url = `${getWsUrl()}?userId=${encodeURIComponent(userId)}${token ? `&token=${encodeURIComponent(token)}` : ''}`;
  const ws = new WebSocket(url);

  ws.onopen = () => {
    if (onOpen) onOpen();
  };
  
  ws.onerror = (error) => {
    // Log error without sensitive details
    if (onClose) onClose();
  };
  
  ws.onclose = (event) => {
    if (onClose) onClose();
  };
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage && onMessage(data);
    } catch (e) {
      // Silently handle invalid messages
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

