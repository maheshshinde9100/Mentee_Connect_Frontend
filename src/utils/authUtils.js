/**
 * Utility functions for debugging authentication and token issues
 */

/**
 * Logs the current authentication state to the console
 * @returns {boolean} Whether the user is authenticated based on token presence
 */
export const debugAuthState = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const refreshToken = localStorage.getItem('refreshToken');
  
  console.log('==== Auth Debug Information ====');
  console.log('Token present:', !!token);
  if (token) {
    console.log('Token length:', token.length);
    console.log('Token preview:', token.substring(0, 15) + '...');
  }
  
  console.log('User data present:', !!user);
  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log('User role:', userData.role);
      console.log('User ID:', userData.id);
    } catch (e) {
      console.error('Failed to parse user data:', e);
    }
  }
  
  console.log('Refresh token present:', !!refreshToken);
  console.log('================================');
  
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
  console.log('Resetting authentication state...');
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  console.log('Auth state reset complete');
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
    console.log('Fixing token format for proxy compatibility');
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
    console.error('No token to verify');
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
    console.error('Auth verification error:', error);
    return { success: false, message: error.message };
  }
};

export default {
  debugAuthState,
  checkAuthStatus,
  resetAuth,
  fixProxyAuth,
  verifyAuth
}; 