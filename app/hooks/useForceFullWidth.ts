import { useEffect } from 'react';

/**
 * Forces Crayon containers to proper width - CSS is now handling centering and padding
 */
export function useForceFullWidth() {
  useEffect(() => {
    const forceWidth = () => {
      // Force the thread wrapper to be full width
      const threadWrapper = document.querySelector('.crayon-shell-thread-wrapper');
      if (threadWrapper) {
        (threadWrapper as HTMLElement).style.setProperty('width', '100%', 'important');
        (threadWrapper as HTMLElement).style.setProperty('max-width', 'none', 'important');
      }

      const chatPanel = document.querySelector('.crayon-shell-thread-chat-panel');
      if (chatPanel) {
        (chatPanel as HTMLElement).style.setProperty('width', '100%', 'important');
        (chatPanel as HTMLElement).style.setProperty('max-width', 'none', 'important');
      }
    };

    forceWidth();
    const timeout1 = setTimeout(forceWidth, 100);
    const timeout2 = setTimeout(forceWidth, 500);

    const observer = new MutationObserver(() => setTimeout(forceWidth, 50));
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      observer.disconnect();
    };
  }, []);
}
