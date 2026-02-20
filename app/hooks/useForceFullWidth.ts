import { useEffect } from 'react';

/**
 * Forces Crayon welcome screen containers to full width using JavaScript
 * because CSS overrides aren't working due to specificity issues
 */
export function useForceFullWidth() {
  useEffect(() => {
    const forceWidth = () => {
      // Force the thread wrapper to be full width (this is what's constraining it!)
      const threadWrapper = document.querySelector('.crayon-shell-thread-wrapper');
      if (threadWrapper) {
        const htmlEl = threadWrapper as HTMLElement;
        htmlEl.style.setProperty('width', '100%', 'important');
        htmlEl.style.setProperty('max-width', 'none', 'important');
      }

      const chatPanel = document.querySelector('.crayon-shell-thread-chat-panel');
      if (chatPanel) {
        const htmlEl = chatPanel as HTMLElement;
        htmlEl.style.setProperty('width', '100%', 'important');
        htmlEl.style.setProperty('max-width', 'none', 'important');
      }

      // Target all nested containers that are adding padding
      const selectors = [
        '.crayon-shell-welcome-screen',
        '.crayon-shell-welcome-screen__header',
        '.crayon-shell-welcome-screen__content',
        '.crayon-shell-welcome-screen__desktop-composer',
        '.crayon-shell-desktop-welcome-composer'
      ];

      let changed = false;
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el: Element) => {
          const htmlEl = el as HTMLElement;
          htmlEl.style.setProperty('padding-left', '0', 'important');
          htmlEl.style.setProperty('padding-right', '0', 'important');
          htmlEl.style.setProperty('width', '100%', 'important');
          htmlEl.style.setProperty('max-width', 'none', 'important');
          changed = true;
        });
      });

      if (changed || threadWrapper || chatPanel) {
        console.log('[useForceFullWidth] Applied width fixes');
      }
    };

    // Run immediately
    forceWidth();

    // Run again after delays (in case DOM updates)
    const timeout1 = setTimeout(forceWidth, 100);
    const timeout2 = setTimeout(forceWidth, 500);
    const timeout3 = setTimeout(forceWidth, 1000);

    // Set up mutation observer to catch dynamic changes
    const observer = new MutationObserver(() => {
      setTimeout(forceWidth, 50);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      observer.disconnect();
    };
  }, []);
}
