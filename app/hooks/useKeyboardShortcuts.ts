import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean; // Cmd on Mac, Windows key on Windows
  callback: () => void;
  description?: string;
}

/**
 * Hook for registering keyboard shortcuts
 * 
 * @example
 * useKeyboardShortcuts([
 *   { key: 'k', meta: true, callback: () => openCopilot() },
 *   { key: 'Escape', callback: () => closeCopilot() },
 * ]);
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrl === undefined || event.ctrlKey === shortcut.ctrl;
        const shiftMatches = shortcut.shift === undefined || event.shiftKey === shortcut.shift;
        const altMatches = shortcut.alt === undefined || event.altKey === shortcut.alt;
        const metaMatches = shortcut.meta === undefined || event.metaKey === shortcut.meta;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

/**
 * Common keyboard shortcuts for the copilot
 */
export const COPILOT_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: 'k',
    meta: true,
    description: 'Open copilot (Cmd+K or Ctrl+K)',
    callback: () => {}, // Set in component
  },
  {
    key: 'Escape',
    description: 'Close copilot (Escape)',
    callback: () => {}, // Set in component
  },
  {
    key: '/',
    description: 'Focus search (Press /)',
    callback: () => {}, // Set in component
  },
];

/**
 * Format keyboard shortcut for display
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  
  if (shortcut.meta) parts.push('⌘');
  if (shortcut.ctrl) parts.push('Ctrl');
  if (shortcut.alt) parts.push('Alt');
  if (shortcut.shift) parts.push('Shift');
  
  parts.push(shortcut.key.toUpperCase());
  
  return parts.join('+');
}
