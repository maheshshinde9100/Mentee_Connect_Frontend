const getWsUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  // Extract host and port from API URL
  try {
    const url = new URL(apiUrl);
    const host = url.host;
    return `${protocol}//${host}/api/signal`;
  } catch (e) {
    // Fallback if URL parsing fails
    const host = apiUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `${protocol}//${host}/api/signal`;
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

