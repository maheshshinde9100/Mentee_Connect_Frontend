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
  const url = `${getWsUrl()}?userId=${encodeURIComponent(userId)}`;
  // console.log('Connecting to WebSocket:', url);
  const ws = new WebSocket(url);

  ws.onopen = () => {
    // console.log('WebSocket opened');
    if (onOpen) onOpen();
  };
  
  ws.onerror = (error) => {
    // console.error('WebSocket error:', error);
    // Log more details about the error
    if (error.target) {
      // console.error('WebSocket error details:', {
      //   url: error.target.url,
      //   readyState: error.target.readyState,
      //   protocol: error.target.protocol
      // });
    }
  };
  
  ws.onclose = (event) => {
    const reason = event.reason || 'No reason provided';
    const codeMessages = {
      1000: 'Normal closure',
      1001: 'Going away',
      1002: 'Protocol error',
      1003: 'Unsupported data',
      1006: 'Abnormal closure (no close frame)',
      1011: 'Internal server error',
      1012: 'Service restart',
      1013: 'Try again later',
      1014: 'Bad gateway',
      1015: 'TLS handshake failed'
    };
    const codeMessage = codeMessages[event.code] || 'Unknown code';
    // console.log(`WebSocket closed: ${event.code} (${codeMessage}) - ${reason}`);
    if (onClose) onClose();
  };
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      // console.log('WebSocket message received:', data);
      onMessage && onMessage(data);
    } catch (e) {
      // console.error('Invalid signaling message', e, event.data);
    }
  };

  const send = (payload) => {
    if (ws.readyState === WebSocket.OPEN) {
      // console.log('Sending signaling message:', payload);
      ws.send(JSON.stringify(payload));
    } else {
      // console.warn('WebSocket not open, cannot send:', payload);
    }
  };

  return { ws, send };
};

export default createSignalingClient;

