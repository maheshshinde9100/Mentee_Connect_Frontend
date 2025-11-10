/**
 * Utility functions for debugging authentication and token issues
 */

/**
 * Logs the current authentication state to the console
 * @returns {boolean} Whether the user is authenticated based on token presence
 */
export const debugAuthState = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Verifies authentication status
 * @returns {object} Details about authentication state
 */
export const checkAuthStatus = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  return {
    isAuthenticated: !!token,
    hasUserData: !!user,
    userData: user ? JSON.parse(user) : null,
    tokenLength: token ? token.length : 0
  };
};

/**
 * Forces a reset of authentication state
 * @returns {void}
 */
export const resetAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

/**
 * Checks if the proxy settings might be causing issues and fixes token format if needed
 * @returns {boolean} Whether any fixes were applied
 */
export const fixProxyAuth = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  // Check if the token is missing "Bearer " prefix that might be needed by the proxy
  if (token && !token.startsWith('Bearer ') && !token.includes(' ')) {
    // Some proxies might need explicit "Bearer " prefix
    localStorage.setItem('token', token);
    return true;
  }
  
  return false;
};

/**
 * Explicitly calls the API with the current token to verify auth works
 */
export const verifyAuth = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return { success: false, message: 'No token found' };
  }
  
  try {
    // Use fetch directly to avoid axios interceptors
    const response = await fetch('/api/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      return { success: true, message: 'Token valid' };
    } else {
      return { 
        success: false, 
        status: response.status,
        message: 'Token verification failed'
      };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const authUtils = {
  debugAuthState,
  checkAuthStatus,
  resetAuth,
  fixProxyAuth,
  verifyAuth
};

export default authUtils;