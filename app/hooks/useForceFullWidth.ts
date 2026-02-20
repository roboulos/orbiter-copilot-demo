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

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el: Element) => {
          const htmlEl = el as HTMLElement;
          htmlEl.style.paddingLeft = '0';
          htmlEl.style.paddingRight = '0';
          htmlEl.style.width = '100%';
          htmlEl.style.maxWidth = 'none';
        });
      });

      // Force the outer container to have padding only
      const outerContainer = document.querySelector('.crayon-copilot-shell-container');
      if (outerContainer) {
        (outerContainer as HTMLElement).style.paddingLeft = '24px';
        (outerContainer as HTMLElement).style.paddingRight = '24px';
      }
    };

    // Run immediately
    forceWidth();

    // Run again after a short delay (in case DOM updates)
    const timeout = setTimeout(forceWidth, 100);

    // Set up mutation observer to catch dynamic changes
    const observer = new MutationObserver(forceWidth);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);
}
