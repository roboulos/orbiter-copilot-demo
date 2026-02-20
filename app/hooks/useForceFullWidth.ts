import { useEffect } from 'react';

/**
 * Forces Crayon welcome screen containers to full width using JavaScript
 * because CSS overrides aren't working due to specificity issues
 */
export function useForceFullWidth() {
  useEffect(() => {
    const forceWidth = () => {
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
          // Use setProperty with empty priority to override inline styles
          htmlEl.style.setProperty('padding-left', '0', 'important');
          htmlEl.style.setProperty('padding-right', '0', 'important');
          htmlEl.style.setProperty('width', '100%', 'important');
          htmlEl.style.setProperty('max-width', 'none', 'important');
          changed = true;
        });
      });

      // Force the outer container to have padding only
      const outerContainer = document.querySelector('.crayon-copilot-shell-container');
      if (outerContainer) {
        const htmlEl = outerContainer as HTMLElement;
        htmlEl.style.setProperty('padding-left', '24px', 'important');
        htmlEl.style.setProperty('padding-right', '24px', 'important');
      }

      if (changed) {
        console.log('[useForceFullWidth] Applied width fixes to', selectors.length, 'selectors');
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
