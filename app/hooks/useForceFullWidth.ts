import { useEffect } from 'react';

/**
 * Width is now fully handled by CSS.
 * This hook is kept for backwards compatibility but does nothing.
 */
export function useForceFullWidth() {
  // Width forcing removed - CSS handles it properly now
  useEffect(() => {}, []);
}
