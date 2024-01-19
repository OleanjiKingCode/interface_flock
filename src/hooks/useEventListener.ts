'use client'
import { useEffect } from 'react';

// @ts-ignore
const useEventListener = (eventType, listener, targetElement
  ) => {
  useEffect(() => {
    if (targetElement?.addEventListener) {
      targetElement.addEventListener(eventType, listener);
    }

    return () => {
      // https://github.com/niksy/throttle-debounce#cancelling
      if (listener?.cancel) {
        listener.cancel();
      }

      // Remove the event listeners
      if (targetElement?.removeEventListener) {
        targetElement.removeEventListener(eventType, listener);
      }
    };
  }, [eventType, listener, targetElement]);
};

export default useEventListener;