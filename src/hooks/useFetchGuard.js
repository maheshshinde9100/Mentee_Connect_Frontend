import { useEffect, useRef } from 'react';

/**
 * Runs an async fetch on mount with cancellation support.
 * Uses a generation counter so React Strict Mode remounts always run a fresh fetch.
 */
const useFetchGuard = (fetchFn, deps = []) => {
  const generationRef = useRef(0);

  useEffect(() => {
    const generation = ++generationRef.current;
    let cancelled = false;
    const isCancelled = () => cancelled || generation !== generationRef.current;

    const run = async () => {
      try {
        await fetchFn(isCancelled);
      } catch (err) {
        if (!isCancelled()) {
          console.error('useFetchGuard:', err);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useFetchGuard;
