import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value by a given delay.
 * Useful for preventing API calls on every keystroke in search inputs.
 *
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 400ms)
 * @returns {any} The debounced value
 */
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (or component unmounts)
    // This is how we prevent the debounced value from updating
    // until the user has stopped typing for the specified delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
