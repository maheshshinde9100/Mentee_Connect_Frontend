/**
 * Utility for conditionally joining CSS class names together
 * @param  {...string} classes - The classes to join
 * @returns {string} - The joined class string
 */
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
} 