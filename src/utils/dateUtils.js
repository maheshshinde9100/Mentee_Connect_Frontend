import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format a date string into a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a date string to relative time (e.g., "5 minutes ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return dateString;
  }
};

/**
 * Format a date and time string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM dd, yyyy h:mm a');
  } catch (error) {
    console.error('Error formatting date time:', error);
    return dateString;
  }
}; 