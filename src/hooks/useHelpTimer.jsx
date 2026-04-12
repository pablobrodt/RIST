import { useState, useLayoutEffect } from 'react';

export function useHelpTimer(endTime, onComplete) {
  const [timeLeft, setTimeLeft] = useState(0);

  useLayoutEffect(() => {
    if (!endTime) {
      if (timeLeft !== 0) setTimeLeft(0);
      return;
    }

    const tick = () => {
      let remaining = Math.ceil((endTime - Date.now()) / 1000);
      if (remaining <= 0) {
        remaining = 0;
        if (onComplete) {
          onComplete();
        }
      }
      setTimeLeft(remaining);
      return remaining;
    };

    const initialRemaining = tick();
    if (initialRemaining <= 0) return;

    const interval = setInterval(() => {
      const r = tick();
      if (r <= 0) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [endTime, onComplete]);

  return timeLeft;
}
