/**
 * Production-safe logger utility
 * Automatically disables console logging in production builds
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Create a no-op function for production
const noop = () => {};

/**
 * Logger object with environment-aware methods
 */
export const logger = {
  /**
   * Log general information (disabled in production)
   */
  log: isDevelopment ? console.log.bind(console) : noop,
  
  /**
   * Log errors (always enabled, but sanitized in production)
   */
  error: isProduction 
    ? (...args) => {
        // In production, log errors but remove sensitive data
        const sanitized = args.map(arg => {
          if (typeof arg === 'object' && arg !== null) {
            // Remove sensitive fields
            const { token, password, authorization, ...safe } = arg;
            return safe;
          }
          return arg;
        });
        console.error(...sanitized);
      }
    : console.error.bind(console),
  
  /**
   * Log warnings (disabled in production)
   */
  warn: isDevelopment ? console.warn.bind(console) : noop,
  
  /**
   * Log info messages (disabled in production)
   */
  info: isDevelopment ? console.info.bind(console) : noop,
  
  /**
   * Log debug messages (disabled in production)
   */
  debug: isDevelopment ? console.debug.bind(console) : noop,
  
  /**
   * Log table data (disabled in production)
   */
  table: isDevelopment ? console.table.bind(console) : noop,
  
  /**
   * Group console logs (disabled in production)
   */
  group: isDevelopment ? console.group.bind(console) : noop,
  groupEnd: isDevelopment ? console.groupEnd.bind(console) : noop,
  groupCollapsed: isDevelopment ? console.groupCollapsed.bind(console) : noop
};

/**
 * Sanitize sensitive data from objects before logging
 * @param {any} data - Data to sanitize
 * @returns {any} Sanitized data
 */
export const sanitize = (data) => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  
  const sensitiveKeys = [
    'token',
    'password',
    'authorization',
    'auth',
    'secret',
    'apiKey',
    'api_key',
    'accessToken',
    'refreshToken',
    'sessionId',
    'cookie',
    'credentials'
  ];
  
  const sanitized = { ...data };
  
  sensitiveKeys.forEach(key => {
    if (key in sanitized) {
      sanitized[key] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

/**
 * Safe logger that automatically sanitizes sensitive data
 */
export const safeLogger = {
  log: (...args) => logger.log(...args.map(sanitize)),
  error: (...args) => logger.error(...args.map(sanitize)),
  warn: (...args) => logger.warn(...args.map(sanitize)),
  info: (...args) => logger.info(...args.map(sanitize))
};

export default logger;
