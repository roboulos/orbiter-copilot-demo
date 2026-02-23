import { useEffect, useState, useRef } from 'react';
import { detectDispatchIntent } from '../lib/dispatch';

interface UseDispatchIntentProps {
  messages: Array<{ role: string; content?: string; message?: unknown }>;
  isThinking?: boolean;
}

/**
 * Hook to monitor conversation messages and detect when user expresses dispatch intent
 * Returns shouldShowDispatch flag when keywords detected in recent messages
 */
export function useDispatchIntent({ messages, isThinking }: UseDispatchIntentProps) {
  const [shouldShowDispatch, setShouldShowDispatch] = useState(false);
  const lastMessageCountRef = useRef(0);

  useEffect(() => {
    // Only check when new messages arrive and AI is not thinking
    if (isThinking || messages.length === lastMessageCountRef.current) {
      return;
    }

    lastMessageCountRef.current = messages.length;

    // Get last 3 user messages to check for dispatch intent
    const recentUserMessages = messages
      .filter(m => m.role === 'user')
      .slice(-3)
      .map(m => {
        if (typeof m.content === 'string') return m.content;
        if (typeof m.message === 'string') return m.message;
        return '';
      })
      .filter(Boolean);

    // Check if any recent message has dispatch intent
    const hasIntent = recentUserMessages.some(msg => detectDispatchIntent(msg));

    if (hasIntent && !shouldShowDispatch) {
      setShouldShowDispatch(true);
    }

    // Auto-hide after 30 seconds if no new messages
    if (hasIntent) {
      const timer = setTimeout(() => {
        setShouldShowDispatch(false);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [messages, isThinking, shouldShowDispatch]);

  const dismissDispatchPrompt = () => {
    setShouldShowDispatch(false);
  };

  return { shouldShowDispatch, dismissDispatchPrompt };
}
