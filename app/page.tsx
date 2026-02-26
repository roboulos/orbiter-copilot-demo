"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { CrayonChat } from "@crayonai/react-ui";
import { OutcomeCardEnhanced } from "./components/OutcomeCard";
import { LeverageLoopCard } from "./components/LeverageLoopCard";
import { ContactCard } from "./components/ContactCard";
import { SerendipityCard } from "./components/SerendipityCard";
import { NetworkView } from "./components/NetworkView";
import { OutcomesView } from "./components/OutcomesView";
import { HorizonView } from "./components/HorizonView";
import { DocsView } from "./components/DocsView";
import { SearchView } from "./components/SearchView";
import { CollectionsView } from "./components/CollectionsView";
import { InsightsView } from "./components/InsightsView";
import { MeetingPrepCard } from "./components/MeetingPrepCard";
import { PersonPicker } from "./components/PersonPicker";
import { ForkInTheRoad } from "./components/ForkInTheRoad";
import { ButtonGroup } from "./components/ButtonGroup";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { SubmitButton } from "./components/SubmitButton";
import { SuccessToast } from "./components/SuccessToast";
import { ErrorMessage } from "./components/ErrorMessage";
import CalendarSettingsModal from "./components/CalendarSettingsModal";
import { QuestionCard } from "./components/QuestionCard";
import { QuestionCardEnhanced } from "./components/QuestionCardEnhanced";
import { QuickResultCard } from "./components/QuickResultCard";
import { ScanningCard } from "./components/ScanningCard";
import { RichWelcomeScreen } from "./components/RichWelcomeScreen";
import { LoadingIndicator } from "./components/LoadingIndicator";
import { ModeStartScreen } from "./components/ModeStartScreen";
import { ErrorCard } from "./components/ErrorCard";
import { ProgressTracker } from "./components/ProgressTracker";
import { BackButton } from "./components/BackButton";
import { CancelButton } from "./components/CancelButton";
import { Confetti } from "./components/Confetti";
// DispatchConfirmationModal replaced by InlineDispatchCard template
import { WaitingRoomConnected } from "./components/WaitingRoomConnected";
import { InlineInterviewCard } from "./components/InlineInterviewCard";
import { FormattedDispatchSummary } from "./components/FormattedDispatchSummary";
import { ModePicker } from "./components/ModePicker";
// InterviewPanel removed - using conversational backend flow instead
import { chat, dispatch, createLeverageLoop, dispatchLeverageLoop, getLeverageLoopSuggestions, searchPersons, createConversation, addMessage, getConversations, type CopilotConversation } from "./lib/xano";
import { detectDispatchIntent, generateDispatchDescription } from "./lib/dispatch";
import { generateMeetingPrep } from "./lib/meeting-prep";
// Interview classifier imports removed - backend handles conversational flow
// useInterviewFlow removed - backend handles conversational interview
// import { orbiterTheme } from "./lib/theme"; // Using CSS-based theming instead
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useForceFullWidth } from "./hooks/useForceFullWidth";
import "@crayonai/react-ui/styles/index.css";

// Premium Orbiter AI avatar for chat messages
const ORBITER_AVATAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#a78bfa"/></linearGradient></defs><circle cx="28" cy="28" r="28" fill="url(#g)"/><circle cx="28" cy="28" r="10" fill="none" stroke="white" stroke-width="2" opacity="0.9"/><circle cx="28" cy="20" r="2.5" fill="white" opacity="0.9"/></svg>`;
const ORBITER_AVATAR = `data:image/svg+xml,${encodeURIComponent(ORBITER_AVATAR_SVG)}`;

// Inline dispatch confirmation card — renders in chat stream
function InlineDispatchCard({ person_name, goal, context, master_person_id }: {
  person_name?: string;
  goal?: string;
  context?: string;
  master_person_id?: number;
}) {
  const [dispatching, setDispatching] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  const handleConfirm = () => {
    if (dispatching || dispatched) return;
    setDispatching(true);
    window.dispatchEvent(new CustomEvent("inline-dispatch-confirmed", {
      detail: { person_name, goal, context, master_person_id }
    }));
  };

  useEffect(() => {
    const onDone = () => { setDispatching(false); setDispatched(true); };
    window.addEventListener("dispatch-completed", onDone);
    return () => window.removeEventListener("dispatch-completed", onDone);
  }, []);

  return (
    <div style={{
      maxWidth: "480px",
      background: "rgba(255,255,255,0.03)",
      border: dispatched ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(99,102,241,0.15)",
      borderRadius: "16px",
      padding: "20px",
      margin: "12px 0",
      animation: "cardEntrance 0.3s cubic-bezier(0.22,1,0.36,1) both",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: dispatched
            ? "rgba(34,197,94,0.1)"
            : "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))",
          border: dispatched
            ? "1px solid rgba(34,197,94,0.2)"
            : "1px solid rgba(99,102,241,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.3s ease",
        }}>
          {dispatched ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(34,197,94,0.8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,0.92)", letterSpacing: "-0.01em" }}>
            {dispatched ? "Dispatched" : "Ready to Dispatch"}
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "1px" }}>
            {dispatched ? "Analyzing your network now" : "Review and confirm"}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div style={{
        padding: "12px 14px",
        background: "rgba(255,255,255,0.02)",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.06)",
        marginBottom: "14px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}>
        {person_name && (
          <div>
            <div style={{ fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "3px" }}>Person</div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "rgba(255,255,255,0.88)" }}>{person_name}</div>
          </div>
        )}
        {goal && (
          <div>
            <div style={{ fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "3px" }}>Goal</div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "rgba(255,255,255,0.88)" }}>{goal}</div>
          </div>
        )}
        {context && (
          <div>
            <div style={{ fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "3px" }}>Context</div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>{context}</div>
          </div>
        )}
      </div>

      {/* Action */}
      {!dispatched ? (
        <button
          onClick={handleConfirm}
          disabled={dispatching}
          className="orbiter-btn"
          style={{
            width: "100%",
            padding: "11px 20px",
            background: dispatching ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg, #6366f1, #7c3aed)",
            border: "none",
            borderRadius: "10px",
            color: "white",
            fontSize: "14px",
            fontWeight: 600,
            cursor: dispatching ? "not-allowed" : "pointer",
            boxShadow: dispatching ? "none" : "0 2px 12px rgba(99,102,241,0.25)",
            transition: "all 0.2s ease",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            letterSpacing: "-0.01em",
          }}
        >
          {dispatching ? (
            <>
              <div style={{
                width: "14px", height: "14px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "white",
                borderRadius: "50%",
                animation: "orbitSpin 0.7s linear infinite",
              }} />
              Dispatching...
            </>
          ) : (
            "Confirm & Dispatch"
          )}
        </button>
      ) : (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          padding: "10px",
          fontSize: "13px",
          color: "rgba(34,197,94,0.7)",
          fontWeight: 500,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          Results will appear in 2-5 minutes
        </div>
      )}
    </div>
  );
}

const templates = [
  { name: "outcome_card",       Component: OutcomeCardEnhanced       },
  { name: "leverage_loop_card", Component: LeverageLoopCard  },
  { name: "contact_card",       Component: ContactCard       },
  { name: "serendipity_card",   Component: SerendipityCard   },
  { name: "meeting_prep_card",  Component: MeetingPrepCard   },
  { name: "button_group",       Component: ButtonGroup       },
  { name: "submit_button",      Component: SubmitButton      },
  { name: "error_message",      Component: ErrorMessage      },
  { name: "question_card",      Component: QuestionCard      },
  { name: "question_card_enhanced", Component: QuestionCardEnhanced },
  { name: "quick_result_card",  Component: QuickResultCard   },
  { name: "scanning_card",      Component: ScanningCard      },
  { name: "loading_indicator",  Component: LoadingIndicator  },
  { name: "error_card",         Component: ErrorCard         },
  { name: "interview_card",     Component: InlineInterviewCard },
  { name: "dispatch_confirmation", Component: InlineDispatchCard },
];

type Tab = "Network" | "Search" | "Outcomes" | "Horizon" | "Collections" | "Insights" | "Docs";

interface SelectedPerson {
  master_person_id: number;
  full_name: string;
  in_my_network?: boolean;
  master_person: {
    id?: number;
    name: string;
    avatar: string | null;
    current_title: string | null;
    bio?: string | null;
    master_company?: { id?: number; company_name: string; logo?: string | null } | null;
  } | null;
}

// ─── Small ambient dot grid background ───────────────────────────────────────
function DotGrid() {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      pointerEvents: "none",
      zIndex: 0,
      backgroundImage: `radial-gradient(circle, rgba(99,102,241,0.09) 1px, transparent 1px)`,
      backgroundSize: "28px 28px",
      maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
      WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
    }} />
  );
}

// ─── Copilot Modal ────────────────────────────────────────────────────────────
interface CopilotModalProps {
  open: boolean;
  onClose: () => void;
  selectedPerson: SelectedPerson | null;
  onPersonSelect: (person: SelectedPerson, context: string) => void;
  onPersonClear: () => void;
  processMessage: (args: { threadId: string; messages: Array<{ role: string; message?: unknown }>; abortController: AbortController }) => Promise<Response>;
  onForkChoice: (prompt: string) => void;
  showFork: boolean;
  onChatStart: () => void;
  pendingPrompt: string | null;
  onPendingPromptConsumed: () => void;
  onTabChange?: (tab: string) => void;
  hasConversationContext: boolean;
  onResetContext: () => void;
  conversations: CopilotConversation[];
  onSelectConversation: (conv: CopilotConversation) => void;
}

function CopilotModal({
  open,
  onClose,
  selectedPerson,
  onPersonSelect,
  onPersonClear,
  processMessage,
  onForkChoice,
  showFork,
  onChatStart,
  pendingPrompt,
  onPendingPromptConsumed,
  onTabChange,
  hasConversationContext,
  onResetContext,
  conversations,
  onSelectConversation,
}: CopilotModalProps) {
  const chatKey = useRef(0);
  const [selectedMode, setSelectedMode] = useState<'default' | 'leverage' | 'meeting' | 'outcome'>('default');
  const [hasStartedConversation, setHasStartedConversation] = useState(false);
  const [isQuickDispatching, setIsQuickDispatching] = useState(false);
  const [autoSending, setAutoSending] = useState(false);
  const [suggestedPeople, setSuggestedPeople] = useState<any[]>([]);

  // Fetch suggested people when entering leverage mode
  useEffect(() => {
    if (selectedMode === 'leverage' && !selectedPerson && open) {
      searchPersons("", "network", 9).then(data => {
        setSuggestedPeople(data.items || []);
      }).catch(() => {});
    }
  }, [selectedMode, selectedPerson, open]);

  // Quick leverage: Button 1 fires suggestion_request immediately, returns to person search
  const handleQuickLeverage = useCallback(async () => {
    if (!selectedPerson?.master_person_id) return;
    setIsQuickDispatching(true);
    try {
      const result = await createLeverageLoop({
        master_person_id: selectedPerson.master_person_id,
        request_panel_title: `Leverage network for ${selectedPerson.master_person?.name || selectedPerson.full_name}`,
        request_context: `General leverage loop — suggest ways to help ${selectedPerson.master_person?.name || selectedPerson.full_name}`,
      });

      // Dispatch it immediately
      await dispatchLeverageLoop(result.id);

      console.log('[QUICK LEVERAGE] Created + dispatched loop:', result.id);

      // Brief success flash, then clear person and return to search
      setTimeout(() => {
        setIsQuickDispatching(false);
        onPersonClear();
      }, 800);
    } catch (error) {
      console.error('[QUICK LEVERAGE] Failed:', error);
      setIsQuickDispatching(false);
    }
  }, [selectedPerson, onPersonClear]);

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * KEYBOARD NAVIGATION - ESC TO CLOSE
   * ═══════════════════════════════════════════════════════════════════════════
   * 
   * MARK'S REQUIREMENT: "Esc to close" (modal enhancements)
   * 
   * ACCESSIBILITY: Keyboard users should be able to close modal with Esc key
   * 
   * WHY: Standard UX pattern, matches system modals (macOS, browsers)
   *      Improves accessibility for keyboard-only users
   * 
   * INTEGRATION NOTE: Keep this pattern for all modals in the app.
   *                   Consider adding Cmd+K to open modal as well.
   * ═══════════════════════════════════════════════════════════════════════════
   */
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * FOCUS MANAGEMENT - AUTO-FOCUS & FOCUS TRAP
   * ═══════════════════════════════════════════════════════════════════════════
   * 
   * ACCESSIBILITY: Focus first interactive element when modal opens
   *                Return focus to trigger when modal closes
   * 
   * WHY: Screen readers announce modal content
   *      Keyboard users start at logical position
   *      Prevents focus escaping modal (focus trap)
   * 
   * INTEGRATION NOTE: For production, use focus-trap-react library
   *                   This is a simplified implementation
   * 
   * WCAG 2.1: Meets 2.4.3 Focus Order criterion
   * ═══════════════════════════════════════════════════════════════════════════
   */
  useEffect(() => {
    if (!open) return;

    // Store element that had focus before modal opened
    const previouslyFocused = document.activeElement as HTMLElement;

    // Focus first interactive element after modal animation
    const focusTimer = setTimeout(() => {
      const modal = document.querySelector('.copilot-modal-container');
      if (modal) {
        const firstFocusable = modal.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }
    }, 150); // Match modal animation duration

    // Return focus when modal closes
    return () => {
      clearTimeout(focusTimer);
      // Small delay ensures modal is fully closed before returning focus
      setTimeout(() => {
        previouslyFocused?.focus();
      }, 50);
    };
  }, [open]);
  // Dispatch state managed by inline card template + event listeners
  const [processId, setProcessId] = useState<number | null>(null);
  const [showWaitingRoom, setShowWaitingRoom] = useState(false);
  const [currentDispatchData, setCurrentDispatchData] = useState<{
    summary: string;
    mode: "loop" | "outcome";
    personName?: string;
  } | null>(null);
  
  // No interview mode interception - backend handles conversational flow

  // When fork closes (showFork becomes false), start conversation  
  useEffect(() => {
    console.log('[FORK CLOSE EFFECT]', { showFork, selectedPerson: !!selectedPerson });
    if (!showFork && selectedPerson) {
      console.log('[FORK CLOSE EFFECT] Setting hasStartedConversation = true');
      setHasStartedConversation(true);
    }
  }, [showFork, selectedPerson]);

  // Listen for legacy interview dispatch ready event (InlineInterviewCard)
  // Routes to the same inline dispatch handler
  useEffect(() => {
    const handleDispatchReady = (event: CustomEvent) => {
      const { personId, personName, outcome, description } = event.detail;
      window.dispatchEvent(new CustomEvent("inline-dispatch-confirmed", {
        detail: {
          person_name: personName,
          goal: outcome || "Help with outcome",
          context: description || "",
          master_person_id: personId || selectedPerson?.master_person_id,
        }
      }));
    };

    window.addEventListener("interview-dispatch-ready", handleDispatchReady as EventListener);
    return () => {
      window.removeEventListener("interview-dispatch-ready", handleDispatchReady as EventListener);
    };
  }, [selectedPerson]);

  // Listen for inline dispatch card confirmation (user clicks "Confirm & Dispatch" in chat)
  useEffect(() => {
    const handleInlineDispatch = async (event: CustomEvent) => {
      const { person_name, goal, context, master_person_id } = event.detail;
      console.log('[INLINE DISPATCH]', event.detail);

      try {
        const BASE_URL = process.env.NEXT_PUBLIC_XANO_API_URL || "https://xh2o-yths-38lt.n7c.xano.io/api:Bd_dCiOz";

        const createResponse = await fetch(`${BASE_URL}/leverage-loop`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            master_person_id: master_person_id || selectedPerson?.master_person_id || null,
            goal: goal || "Help with network analysis",
            context: `${goal || ""} - ${context || ""}`,
            fast: false,
          }),
        });

        if (!createResponse.ok) throw new Error("Failed to create leverage loop");
        const { id: loopId, process_id } = await createResponse.json();

        await fetch(`${BASE_URL}/leverage-loop/${loopId}/dispatch`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approved: true }),
        });

        setProcessId(process_id);
        setCurrentDispatchData({
          summary: `${goal} - ${context}`,
          mode: "loop",
          personName: person_name,
        });

        // Signal the inline card that dispatch completed
        window.dispatchEvent(new Event("dispatch-completed"));

        // Show waiting room after brief delay
        setTimeout(() => setShowWaitingRoom(true), 1500);
      } catch (error) {
        console.error("Inline dispatch failed:", error);
        window.dispatchEvent(new Event("dispatch-completed"));
      }
    };

    window.addEventListener("inline-dispatch-confirmed", handleInlineDispatch as unknown as EventListener);
    return () => {
      window.removeEventListener("inline-dispatch-confirmed", handleInlineDispatch as unknown as EventListener);
    };
  }, [selectedPerson]);

  /**
   * ═══════════════════════════════════════════════════════════════════════
   * AUTO-SEND INTERVIEW PROMPT - CRITICAL FLOW LOGIC
   * ═══════════════════════════════════════════════════════════════════════
   * 
   * MARK'S REQUIREMENT: "Interview should start immediately, no empty chat"
   * 
   * PROBLEM SOLVED: After user clicks fork option "Help with specific task",
   *                  chat was showing welcome screen instead of starting interview.
   * 
   * SOLUTION: Automatically inject the pending prompt into CrayonChat input
   *           and programmatically trigger send button after mount.
   * 
   * HOW IT WORKS:
   *   1. User clicks fork option → sets pendingPrompt
   *   2. Fork closes → showFork becomes false
   *   3. Chat appears → hasStartedConversation becomes true
   *   4. This effect detects all three conditions met
   *   5. Wait 500ms for CrayonChat to fully mount
   *   6. Find textarea via DOM selector
   *   7. Set value to pendingPrompt
   *   8. Trigger React onChange via input event
   *   9. Click send button (or submit form)
   *  10. Consume prompt to prevent re-send
   * 
   * INTEGRATION NOTE: This is a workaround for CrayonChat limitation.
   *                   Ideally, CrayonChat should accept initialMessage prop.
   * 
   * ALTERNATIVE: If backend can send first message directly, remove this
   *              and have backend initiate interview conversation.
   * 
   * TIMING: 500ms delay is critical - too fast and input won't exist yet.
   *         Too slow and user sees empty chat briefly.
   * 
   * KEEP: This pattern for any auto-send scenarios (Meeting Prep calendar click)
   * ═══════════════════════════════════════════════════════════════════════
   */
  useEffect(() => {
    console.log('[AUTO-SEND CHECK]', { pendingPrompt: !!pendingPrompt, showFork, hasStartedConversation });
    // Write to DOM for debugging
    if (typeof window !== 'undefined') {
      (window as any).debugAutoSend = { pendingPrompt: !!pendingPrompt, showFork, hasStartedConversation };
    }
    if (pendingPrompt && !showFork && hasStartedConversation) {
      console.log('[AUTO-SEND TRIGGERED] Waiting 500ms for CrayonChat mount...');
      setAutoSending(true);
      // TIMING NOTE: Wait for CrayonChat to mount (500ms tested as reliable)
      const timer = setTimeout(() => {
        /**
         * DOM MANIPULATION APPROACH:
         * Since CrayonChat doesn't expose initialMessage prop, we directly
         * manipulate DOM to inject the message and trigger send.
         * 
         * SELECTORS: Try multiple possible input locations:
         *   - '.crayon-shell-desktop-welcome-composer__input' - Welcome screen input
         *   - '.crayon-shell-composer textarea' - Thread composer (active chat)
         *   - '.crayon-shell-composer input' - Alternative composer
         * 
         * INTEGRATION NOTE: Update selectors if CrayonChat structure changes.
         */
        const inputElement = document.querySelector('.crayon-shell-desktop-welcome-composer__input, .crayon-shell-composer textarea, .crayon-shell-composer input') as HTMLTextAreaElement | HTMLInputElement;

        console.log('[AUTO-SEND] Input element found:', !!inputElement, inputElement?.className);

        if (inputElement) {
          // Use React's native input setter to properly update controlled state
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype, 'value'
          )?.set || Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 'value'
          )?.set;

          if (nativeInputValueSetter) {
            nativeInputValueSetter.call(inputElement, pendingPrompt);
          } else {
            inputElement.value = pendingPrompt;
          }

          // Dispatch both input and change events for React to detect
          inputElement.dispatchEvent(new Event('input', { bubbles: true }));
          inputElement.dispatchEvent(new Event('change', { bubbles: true }));

          // Wait for React to process the state update and enable the button
          setTimeout(() => {
            // Find send button - broader selector (no type="submit" requirement)
            const sendButton = document.querySelector(
              '.crayon-shell-desktop-welcome-composer button:not([disabled]), ' +
              '.crayon-shell-composer button:not([disabled]):last-child, ' +
              '.crayon-shell-composer-send'
            ) as HTMLButtonElement;

            console.log('[AUTO-SEND] Button found:', !!sendButton, sendButton?.className);

            if (sendButton) {
              sendButton.click();
              onPendingPromptConsumed();
              // Brief delay so message starts flowing before we reveal chat
              setTimeout(() => setAutoSending(false), 300);
            } else {
              // Fallback: try Enter key on the input
              inputElement.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true
              }));
              onPendingPromptConsumed();
              setTimeout(() => setAutoSending(false), 300);
            }
          }, 200);
        } else {
          console.warn('[AUTO-SEND] Could not find input element');
          onPendingPromptConsumed();
          setAutoSending(false);
        }
      }, 500); // TIMING: 500ms tested as reliable for CrayonChat mount
      
      return () => clearTimeout(timer);
    }
  }, [pendingPrompt, showFork, hasStartedConversation, onPendingPromptConsumed]);

  const personName = selectedPerson?.master_person?.name || selectedPerson?.full_name;
  const personTitle = selectedPerson?.master_person?.current_title;
  const personCompany = selectedPerson?.master_person?.master_company?.company_name;

  /**
   * ═══════════════════════════════════════════════════════════════════════
   * CONVERSATION STARTERS - INTENTIONALLY EMPTY
   * ═══════════════════════════════════════════════════════════════════════
   * 
   * MARK'S REQUIREMENT: "No intermediate suggestions" / "Lean and mean"
   * 
   * WHY: Mark wants clean chat interface without preset prompts.
   *      Interview should flow naturally without artificial suggestions.
   * 
   * INTEGRATION NOTE: Keep this empty array. If you need starters for
   *                   default mode, add them there only, NOT in leverage mode.
   * 
   * DURING INTEGRATION: Verify CrayonChat doesn't show its own starters.
   *                     May need to pass a prop to disable them.
   * ═══════════════════════════════════════════════════════════════════════
   */
  const defaultStarters: Array<{displayText: string; prompt: string}> = [];

  return (
    <>
      {/* Modal - only show when open */}
      {open && (
      <>
        {/* 
        ═══════════════════════════════════════════════════════════════════════
        BACKDROP - CLICK OUTSIDE TO CLOSE
        ═══════════════════════════════════════════════════════════════════════
        
        MARK'S REQUIREMENT: "Click outside to close" modal
        
        ACCESSIBILITY: Standard modal UX pattern
        
        HOW: onClick on backdrop closes modal
             Modal container stops event propagation (see below)
        
        STYLING: 72% black with 12px blur for depth
        
        INTEGRATION NOTE: Verify this doesn't conflict with other modals
        ═══════════════════════════════════════════════════════════════════════
      */}
      <div
        onClick={onClose}
        role="presentation"
        aria-label="Close modal backdrop"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          zIndex: 900,
          animation: "backdropFadeIn 0.2s ease both",
          cursor: "pointer",
        }}
      />

      {/* 
        ═══════════════════════════════════════════════════════════════════════
        MODAL CONTAINER - PREVENT CLICK-THROUGH
        ═══════════════════════════════════════════════════════════════════════
        
        CRITICAL: Stops event propagation to prevent backdrop click
        
        WHY: Clicking inside modal should NOT close it
             Only clicking backdrop (outside) should close
        
        ACCESSIBILITY:
          - role="dialog" indicates modal dialog
          - aria-modal="true" traps screen reader
          - aria-labelledby links to title
        
        ANIMATION: Slide up with smooth cubic-bezier (0.28s)
        ═══════════════════════════════════════════════════════════════════════
      */}
      <div
        className="copilot-modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="copilot-modal-title"
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(1200px, 95vw)",
          height: "min(88vh, 850px)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          animation: "modalSlideUp 0.28s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        {/* Card wrapper with rounded borders and shadows */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(160deg, #0d0d18 0%, #0a0a13 100%)",
            border: "1px solid rgba(99,102,241,0.18)",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 32px 96px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Top shimmer */}
          <div style={{
            position: "absolute",
            top: 0,
            left: "20%",
            right: "20%",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)",
            zIndex: 5,
          }} />

          {/* Modal header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 18px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              flexShrink: 0,
              height: "60px",
              zIndex: 10,
              background: "rgba(10,10,15,0.98)",
              position: "relative",
            }}
          >
          {/* Logo */}
          <div style={{
            width: "26px",
            height: "26px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 2px 10px rgba(79,70,229,0.4)",
          }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="2.5" fill="white" />
              <circle cx="8" cy="8" r="5.5" stroke="white" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2.5 2" />
              <circle cx="8" cy="8" r="7.5" stroke="white" strokeWidth="0.75" strokeOpacity="0.25" strokeDasharray="1.5 3" />
            </svg>
          </div>

          <span 
            id="copilot-modal-title"
            style={{ fontSize: "13px", fontWeight: 700, color: "#e8e8f0", letterSpacing: "-0.01em" }}
          >
            Orbiter Copilot
          </span>

          <div style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: "#34d399",
            boxShadow: "0 0 8px rgba(52,211,153,0.7)",
            animation: "glowPulse 3s ease-in-out infinite",
            marginLeft: "2px",
          }} />

          {/* Person picker */}
          <div style={{ flex: 1, marginLeft: "16px" }}>
            <PersonPicker
              onSelect={onPersonSelect}
              selectedPerson={selectedPerson}
              onClear={() => { onPersonClear(); }}
            />
          </div>

          {/* Dispatch button - disabled until conversation has context */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!hasConversationContext) return;
              // Dispatch via chat prompt — backend returns dispatch_confirmation template
              onForkChoice("I'm ready to dispatch. Create the dispatch confirmation now.");
            }}
            disabled={!hasConversationContext}
            style={{
              padding: "7px 14px",
              borderRadius: "10px",
              background: hasConversationContext
                ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                : "rgba(99,102,241,0.2)",
              border: `1px solid rgba(99,102,241,${hasConversationContext ? 0.3 : 0.1})`,
              color: hasConversationContext ? "white" : "rgba(255,255,255,0.35)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: hasConversationContext ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexShrink: 0,
              fontFamily: "inherit",
              transition: "all 0.2s ease",
              boxShadow: hasConversationContext ? "0 2px 12px rgba(99,102,241,0.4)" : "none",
              opacity: hasConversationContext ? 1 : 0.6,
            }}
            onMouseEnter={(e) => {
              if (hasConversationContext) {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(99,102,241,0.6)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = hasConversationContext ? "0 2px 12px rgba(99,102,241,0.4)" : "none";
            }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <path d="M2 8L14 2L8 14L6 9L2 8Z" fill="currentColor" />
            </svg>
            Dispatch
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.45)",
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontFamily: "inherit",
              transition: "all 0.15s ease",
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.8)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)";
            }}
          >
            ✕
          </button>
        </div>

          {/* Modal body - fixed height for CrayonChat */}
          <div style={{
            flex: 1,
            minHeight: 0,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}>
            {/* Fork in the road — shown when person is selected but chat hasn't started */}
            {showFork && selectedPerson ? (
              <ForkInTheRoad
                person={{
                  name: personName || "",
                  title: personTitle,
                  company: personCompany,
                  avatar: selectedPerson.master_person?.avatar,
                }}
                isDispatching={isQuickDispatching}
                onQuickLeverage={handleQuickLeverage}
                onChoice={(prompt) => {
                  // Button 2: "Help with something specific" → chat interview
                  onForkChoice(prompt);
                  onChatStart();
                  // Auto-send useEffect handles injecting prompt into CrayonChat
                }}
              />
            ) : (
              <div
                key={`chat-${chatKey.current}`}
                className={autoSending ? "auto-sending" : ""}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Loading overlay during auto-send transition */}
                {autoSending && (
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "16px",
                    background: "rgba(10,10,18,0.95)",
                  }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {[0, 1, 2].map((i) => (
                        <div key={i} style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "rgba(139,92,246,0.7)",
                          animation: `autoSendPulse 1.2s ease-in-out ${i * 0.15}s infinite`,
                        }} />
                      ))}
                    </div>
                    <div style={{
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.4)",
                      letterSpacing: "-0.01em",
                    }}>
                      Starting conversation...
                    </div>
                  </div>
                )}
                <div className="force-light-text" style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "row"
                }}>
                  {/* Left sidebar - always visible */}
                  <ModePicker
                    selectedMode={selectedMode}
                    onSelectMode={(mode) => {
                      if (mode !== selectedMode) {
                        setSelectedMode(mode);

                        // Preserve conversation if switching within same mode or has active person
                        const shouldPreserveConversation = selectedPerson !== null;

                        if (shouldPreserveConversation) {
                          // Keep conversation active, don't reset
                          setHasStartedConversation(true);
                        } else {
                          // Reset for fresh start
                          setHasStartedConversation(mode === 'default');
                          onResetContext();
                          onPersonClear();
                          chatKey.current += 1;
                        }
                      }
                    }}
                    conversations={conversations}
                    onSelectConversation={(conv) => {
                      setSelectedMode((conv.mode || 'default') as typeof selectedMode);
                      setHasStartedConversation(true);
                      onSelectConversation(conv);
                      chatKey.current += 1;
                    }}
                  />
                  
                  {/* Right content area */}
                  <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0
                  }}>
                    {(selectedMode === 'leverage' && !selectedPerson) ? (
                      // Leverage mode: Big search interface for person
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        height: "100%",
                        padding: "64px 48px 80px",
                        gap: "32px"
                      }}>
                        <h1 style={{
                          fontSize: "40px",
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.98)",
                          marginBottom: "16px",
                          textAlign: "center",
                          letterSpacing: "-0.03em",
                          background: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}>
                          Who would you like to help?
                        </h1>
                        <p style={{
                          fontSize: "16px",
                          color: "rgba(255,255,255,0.55)",
                          textAlign: "center",
                          marginBottom: "24px",
                        }}>
                          Search your network or type a name
                        </p>
                        <div style={{
                          width: "100%",
                          maxWidth: "580px"
                        }}>
                          <PersonPicker
                            onSelect={onPersonSelect}
                            selectedPerson={selectedPerson}
                            onClear={() => { onPersonClear(); }}
                          />
                        </div>

                        {/* Suggested people from network */}
                        {suggestedPeople.length > 0 && (
                          <div style={{ width: "100%", maxWidth: "580px", marginTop: "8px" }}>
                            <div style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color: "rgba(255,255,255,0.35)",
                              textTransform: "uppercase" as const,
                              letterSpacing: "0.06em",
                              marginBottom: "12px",
                            }}>
                              Your Network
                            </div>
                            <div style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(3, 1fr)",
                              gap: "8px",
                            }}>
                              {suggestedPeople.slice(0, 9).map((person) => {
                                const name = person.master_person?.name || person.full_name;
                                const title = person.master_person?.current_title;
                                const company = person.master_person?.master_company?.company_name;
                                const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

                                return (
                                  <button
                                    key={person.master_person_id}
                                    onClick={() => onPersonSelect(person as any, "")}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      padding: "10px 12px",
                                      background: "rgba(255,255,255,0.02)",
                                      border: "1px solid rgba(255,255,255,0.06)",
                                      borderRadius: "10px",
                                      cursor: "pointer",
                                      textAlign: "left",
                                      transition: "all 0.15s ease",
                                      fontFamily: "inherit",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background = "rgba(99,102,241,0.08)";
                                      e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                                    }}
                                  >
                                    <div style={{
                                      width: "32px",
                                      height: "32px",
                                      borderRadius: "50%",
                                      background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: "11px",
                                      fontWeight: 700,
                                      color: "rgba(167,139,250,0.9)",
                                      flexShrink: 0,
                                    }}>
                                      {initials}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        color: "rgba(255,255,255,0.85)",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}>
                                        {name}
                                      </div>
                                      {(title || company) && (
                                        <div style={{
                                          fontSize: "11px",
                                          color: "rgba(255,255,255,0.35)",
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                        }}>
                                          {[title, company].filter(Boolean).join(" \u00B7 ")}
                                        </div>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (selectedMode !== 'default' && !hasStartedConversation) ? (
                      // Meeting/Outcome modes: Start screens
                      <ModeStartScreen
                        mode={selectedMode}
                        onSubmit={(value) => {
                          setHasStartedConversation(true);
                          onForkChoice(value);
                        }}
                      />
                    ) : (
                      <CrayonChat
                        key={chatKey.current}
                        type="standalone"
                        processMessage={processMessage}
                        logoUrl={ORBITER_AVATAR}
                        agentName={
                          selectedMode === 'default' ? "Copilot" :
                          selectedMode === 'leverage' ? "Leverage Loops" :
                          selectedMode === 'meeting' ? "Meeting Prep" :
                          "Outcomes"
                        }
                        responseTemplates={templates}
                        messageLoadingComponent={() => <LoadingIndicator />}
                        scrollVariant="user-message-anchor"
                        welcomeMessage={{
                          title: selectedMode === 'default'
                            ? "How can I help you?"
                            : personName
                              ? `Help ${personName}`
                              : selectedMode === 'leverage' ? "Leverage Loops" :
                                selectedMode === 'meeting' ? "Meeting Prep" :
                                "Outcomes",
                          description: selectedMode === 'default'
                            ? "Ask me anything about your network"
                            : personName
                              ? personTitle && personCompany
                                ? `${personTitle} · ${personCompany}`
                                : personTitle || personCompany || "What would you like to help them with?"
                              : selectedMode === 'leverage' ? "Help someone from your network" :
                                selectedMode === 'meeting' ? "Get context for your meetings" :
                                "Map your goals to actions",
                          image: (
                            <div style={{
                              width: 56,
                              height: 56,
                              borderRadius: 16,
                              background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))",
                              border: "1px solid rgba(99,102,241,0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}>
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                                <path d="M2 12h20" />
                              </svg>
                            </div>
                          ),
                        }}
                        conversationStarters={selectedMode === 'default' ? {
                          variant: "long",
                          options: [
                            {
                              displayText: "Search my network for investors",
                              prompt: "Help me find investors in my network who might be relevant for funding conversations.",
                              icon: (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="11" cy="11" r="8" />
                                  <path d="M21 21l-4.35-4.35" />
                                </svg>
                              ),
                            },
                            {
                              displayText: "Prepare for my next meeting",
                              prompt: "Help me prepare for my next meeting. Pull context on the people I'm meeting with.",
                              icon: (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                  <line x1="16" y1="2" x2="16" y2="6" />
                                  <line x1="8" y1="2" x2="8" y2="6" />
                                  <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                              ),
                            },
                            {
                              displayText: "Find warm introductions",
                              prompt: "Who in my network can make warm introductions to people I want to connect with?",
                              icon: (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                  <circle cx="9" cy="7" r="4" />
                                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                              ),
                            },
                            {
                              displayText: "Analyze my network strength",
                              prompt: "Give me an overview of my network. Where are my strongest connections and where are the gaps?",
                              icon: (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                                  <path d="M22 12A10 10 0 0 0 12 2v10z" />
                                </svg>
                              ),
                            },
                          ],
                        } : selectedMode === 'leverage' && personName ? {
                          variant: "short",
                          options: [
                            {
                              displayText: "Find investors",
                              prompt: `Find investors in my network who could help ${personName}.`,
                              icon: <></>,
                            },
                            {
                              displayText: "Make introductions",
                              prompt: `Who in my network should I introduce to ${personName}?`,
                              icon: <></>,
                            },
                            {
                              displayText: "Get advice",
                              prompt: `Help ${personName} find mentors or advisors in my network.`,
                              icon: <></>,
                            },
                          ],
                        } : undefined}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dispatch is now inline via InlineDispatchCard template in chat */}

      </>
      )}

      {/* Interview Panel removed - backend will handle conversational flow, modal only for final dispatch */}
    </>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2px",
      padding: "12px 20px",
      background: "rgba(255,255,255,0.025)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "14px",
    }}>
      <span style={{ fontSize: "20px", fontWeight: 800, color: "#e8e8f0", letterSpacing: "-0.03em" }}>
        {value}
      </span>
      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </span>
    </div>
  );
}

// ─── Quick action card ────────────────────────────────────────────────────────
function QuickAction({
  title,
  subtitle,
  onClick,
}: {
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: "16px",
        padding: "18px",
        textAlign: "left",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.15s ease",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      <div style={{ fontSize: "13px", fontWeight: 600, color: "#e8e8f0", marginBottom: "4px" }}>{title}</div>
      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", lineHeight: 1.4 }}>{subtitle}</div>
    </button>
  );
}

// ─── Main page home view ──────────────────────────────────────────────────────
function HomeView({ onOpenCopilot }: { onOpenCopilot: (withPerson?: boolean) => void }) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 32px",
        gap: "32px",
        animation: "fadeUp 0.4s ease both",
        maxWidth: "640px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Hero */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(99,102,241,0.1)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: "100px",
          padding: "5px 14px",
          margin: "0 auto",
        }}>
          <div style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: "#34d399",
            boxShadow: "0 0 8px rgba(52,211,153,0.7)",
            animation: "glowPulse 3s ease-in-out infinite",
          }} />
          <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(165,180,252,0.9)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Relationship Intelligence
          </span>
        </div>

        <h1 style={{
          fontSize: "clamp(26px, 4vw, 36px)",
          fontWeight: 800,
          color: "#e8e8f0",
          letterSpacing: "-0.03em",
          lineHeight: 1.15,
          margin: 0,
          background: "linear-gradient(135deg, #e8e8f0 30%, #a5b4fc 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Your network is full of doors.
        </h1>
        <p style={{
          fontSize: "14px",
          color: "rgba(255,255,255,0.4)",
          lineHeight: 1.7,
          margin: 0,
          maxWidth: "380px",
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          Orbiter finds the right one. Pick someone from your network and let the copilot show you exactly what to do next.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
        <StatPill value="2,400+" label="Connections" />
        <StatPill value="47" label="Leverage Loops" />
        <StatPill value="12" label="Active Outcomes" />
      </div>

      {/* Open copilot CTA */}
      <button
        onClick={() => onOpenCopilot()}
        style={{
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          border: "none",
          borderRadius: "14px",
          padding: "14px 32px",
          color: "white",
          fontSize: "14px",
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          letterSpacing: "0.01em",
          transition: "all 0.18s ease",
          boxShadow: "0 4px 24px rgba(79,70,229,0.4)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(79,70,229,0.55)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 24px rgba(79,70,229,0.4)";
        }}
      >
        Open Copilot
      </button>

      {/* Quick actions */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>
          Quick actions
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
          <QuickAction
            title="Leverage Loop"
            subtitle="Activate a relationship right now"
            onClick={() => onOpenCopilot()}
          />
          <QuickAction
            title="Outcomes"
            subtitle="Map a goal through your network"
            onClick={() => onOpenCopilot()}
          />
          <QuickAction
            title="Serendipity"
            subtitle="Discover unexpected connections"
            onClick={() => onOpenCopilot()}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab | "Home">("Home");
  const [selectedPerson, setSelectedPerson] = useState<SelectedPerson | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [showFork, setShowFork] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [dispatchSummary, setDispatchSummary] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [networkSummary, setNetworkSummary] = useState<string>("");
  const [processId, setProcessId] = useState<number | null>(null);
  const [showWaitingRoom, setShowWaitingRoom] = useState(false);
  const [hasConversationContext, setHasConversationContext] = useState(false);
  const [conversations, setConversations] = useState<CopilotConversation[]>([]);
  const conversationIdRef = useRef<number | null>(null);
  const [currentDispatchData, setCurrentDispatchData] = useState<{
    summary: string;
    mode: "loop" | "outcome";
    personName?: string;
  } | null>(null);
  const personContextRef = useRef<string>("");
  const masterPersonIdRef = useRef<number | undefined>(undefined);
  const conversationHistoryRef = useRef<Array<{ role: string; content: string }>>([]);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (modalOpen && chatContainerRef.current) {
      // Small delay to ensure DOM has updated with new message
      const timer = setTimeout(() => {
        const container = document.querySelector('.crayon-shell-thread');
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [modalOpen, conversationHistoryRef.current.length]);

  // Fetch conversations for sidebar
  const fetchConversations = useCallback(() => {
    getConversations({ per_page: 10 })
      .then((data) => setConversations(data.items || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Force full width (JavaScript override since CSS isn't working)
  useForceFullWidth();

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      meta: true,
      callback: () => setModalOpen(true),
    },
    {
      key: 'Escape',
      callback: () => {
        if (modalOpen) setModalOpen(false);
      },
    },
  ]);

  const handlePersonSelect = useCallback((person: SelectedPerson, context: string) => {
    setSelectedPerson(person);
    personContextRef.current = context;
    masterPersonIdRef.current = person.master_person_id;
    setShowFork(true);
  }, []);

  const handlePersonClear = useCallback(() => {
    setSelectedPerson(null);
    personContextRef.current = "";
    masterPersonIdRef.current = undefined;
    conversationIdRef.current = null;
    setShowFork(false);
    setPendingPrompt(null);
  }, []);

  const handleSelectPersonFromView = useCallback((person: SelectedPerson) => {
    setSelectedPerson(person);
    personContextRef.current = person.master_person?.current_title
      ? `name: ${person.master_person?.name || person.full_name}\ntitle: ${person.master_person.current_title}`
      : `name: ${person.master_person?.name || person.full_name}`;
    masterPersonIdRef.current = person.master_person_id;
    setShowFork(true);
    setModalOpen(true);
  }, []);

  const handleForkChoice = useCallback((prompt: string) => {
    console.log('[FORK CHOICE]', { prompt });
    setPendingPrompt(prompt);
  }, []);

  const handleChatStart = useCallback(() => {
    console.log('[handleChatStart] Called');
    setShowFork(false);
    console.log('[handleChatStart] Set showFork = false');
    // hasStartedConversation will be set by useEffect watching showFork
  }, []);

  const handleReadyToDispatch = useCallback((summary: string) => {
    setDispatchSummary(summary);
    setShowConfirmation(true);
  }, []);

  useEffect(() => {
    const tabHandler = ((e: CustomEvent<{ tab: string }>) => {
      const t = e.detail.tab;
      if (t !== "Copilot" && t !== "Home") setActiveTab(t as Tab);
    }) as EventListener;

    const dispatchHandler = ((e: CustomEvent<{ summary: string }>) => {
      handleReadyToDispatch(e.detail.summary);
    }) as EventListener;

    window.addEventListener("orbiter:switch-tab", tabHandler);
    window.addEventListener("orbiter:switch-tab-after-action", tabHandler);
    window.addEventListener("orbiter:ready-to-dispatch", dispatchHandler);
    
    return () => {
      window.removeEventListener("orbiter:switch-tab", tabHandler);
      window.removeEventListener("orbiter:switch-tab-after-action", tabHandler);
      window.removeEventListener("orbiter:ready-to-dispatch", dispatchHandler);
    };
  }, [handleReadyToDispatch]);

  // Fetch FULL network data when copilot opens (structured JSON, not text)
  useEffect(() => {
    if (modalOpen && !networkSummary) {
      import("./lib/xano").then(({ getNetwork }) => {
        // Fetch ALL connections (increase to 200 or itemsTotal if available)
        getNetwork({ per_page: 200 })
          .then((data) => {
            // Build structured JSON for intelligent AI suggestions
            const networkData = {
              total: data.itemsTotal || data.items.length,
              loaded: data.items.length,
              connections: data.items.map(p => ({
                id: p.master_person_id,
                name: p.full_name,
                title: p.master_person?.current_title || null,
                company: p.master_person?.master_company?.company_name || null,
                bio: p.master_person?.bio || null,
                avatar: p.master_person?.avatar || null,
                status: p.status_connected,
                last_activity: p.last_activity_at,
              })),
              // Extract industries/companies for filtering
              industries: [...new Set(
                data.items
                  .map(p => p.master_person?.master_company?.company_name)
                  .filter(Boolean)
              )].slice(0, 50),
              top_companies: [...new Set(
                data.items
                  .map(p => p.master_person?.master_company?.company_name)
                  .filter(Boolean)
              )].slice(0, 20),
            };
            
            // Store as JSON string for backend
            const summary = JSON.stringify(networkData);
            setNetworkSummary(summary);
            console.log('[Network] Loaded FULL data:', data.items.length, 'connections with structured metadata');
          })
          .catch((err) => {
            console.error('[Network] Failed to load:', err);
          });
      });
    }
  }, [modalOpen, networkSummary]);

  const handleConfirmDispatch = useCallback(async () => {
    setDispatching(true);
    try {
      // Call real dispatch endpoint
      const result = await dispatch({
        summary: dispatchSummary,
        context: {
          copilot_mode: selectedPerson ? "loop" : "outcome",
          person_context: personContextRef.current || undefined,
        },
        person_id: masterPersonIdRef.current || null,
        conversation_history: conversationHistoryRef.current,
      });
      
      console.log("Dispatch success:", result);
      
      // Success - close confirmation modal but keep main modal open
      setShowConfirmation(false);
      setDispatching(false);
      
      // Show waiting room and poll for results
      setProcessId(result.suggestion_request_id);
      setShowWaitingRoom(true);
      setCurrentDispatchData({
        summary: dispatchSummary,
        mode: selectedPerson ? "loop" : "outcome",
        personName: selectedPerson?.master_person?.name || selectedPerson?.full_name,
      });
    } catch (error) {
      console.error("Dispatch failed:", error);
      setDispatching(false);
      // Show error in toast
      setSuccessMessage("Failed to dispatch. Please try again.");
      setShowSuccessToast(true);
    }
  }, [dispatchSummary, selectedPerson, handlePersonClear]);

  const handleCancelDispatch = useCallback(() => {
    setShowConfirmation(false);
    setDispatchSummary("");
  }, []);

  const processMessage = useCallback(
    async ({ messages, abortController }: {
      threadId: string;
      messages: Array<{ role: string; message?: unknown }>;
      abortController: AbortController;
    }) => {
      const lastMessage = messages[messages.length - 1];
      const prompt = typeof lastMessage?.message === "string"
        ? lastMessage.message
        : String(lastMessage?.message ?? "");

      const history = messages
        .slice(0, -1)
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => {
          // User messages are always strings
          if (m.role === "user") {
            return {
              role: m.role,
              content: typeof m.message === "string" ? m.message : String(m.message ?? ""),
            };
          }
          // Assistant messages: extract only text, skip template/card data
          if (typeof m.message === "string") {
            return { role: m.role, content: m.message };
          }
          // CrayonChat may store assistant messages as arrays or objects with text + template parts
          try {
            const msg = m.message as unknown;
            if (Array.isArray(msg)) {
              const textParts = msg
                .filter((item: Record<string, unknown>) => item.type === "text" && item.text)
                .map((item: Record<string, unknown>) => item.text as string);
              return { role: m.role, content: textParts.join(" ") || "I provided a card response." };
            }
            if (msg && typeof msg === "object" && "text" in msg) {
              return { role: m.role, content: String((msg as Record<string, unknown>).text) };
            }
          } catch { /* fall through */ }
          return { role: m.role, content: "I provided a card response." };
        })
        .filter((m) => m.content.length > 0);

      // Store conversation history for dispatch
      conversationHistoryRef.current = [
        ...history,
        { role: "user", content: prompt }
      ];

      // Persist: create conversation on first message, save user message
      if (!conversationIdRef.current) {
        const title = prompt.length > 60 ? prompt.slice(0, 57) + "..." : prompt;
        createConversation({
          mode: "default",
          title,
          master_person_id: masterPersonIdRef.current,
        })
          .then((conv) => {
            conversationIdRef.current = conv.id;
            addMessage(conv.id, { role: "user", content: prompt }).catch(() => {});
            fetchConversations();
          })
          .catch(() => {});
      } else {
        addMessage(conversationIdRef.current, { role: "user", content: prompt }).catch(() => {});
      }

      try {
        // Backend returns pre-parsed structured data: {response: [...items], model: "..."}
        const data = await chat(
          prompt,
          personContextRef.current || undefined,
          history.length > 0 ? history : undefined,
          masterPersonIdRef.current,
          networkSummary || undefined
        );
        console.log('[BACKEND RESPONSE]', data);

        type ResponseItem =
          | { type: "text"; text: string }
          | { name: string; templateProps: Record<string, unknown> };

        // Normalize each item from the backend response
        const normalizeItem = (item: any): ResponseItem => {
          if (item.type === "text" || item.name === "text") {
            return { type: "text", text: item.text || item.content || "" };
          }
          return {
            name: item.name || item.type,
            templateProps: item.templateProps || item.data || item
          };
        };

        let items: ResponseItem[] = (data.response || []).map(normalizeItem);

      // Signal that we have conversation context (enables dispatch button)
      if (items.length > 0) {
        setHasConversationContext(true);
      }

      // Persist assistant response
      if (conversationIdRef.current && items.length > 0) {
        const textParts = items
          .filter((i): i is { type: "text"; text: string } => "type" in i && i.type === "text")
          .map((i) => i.text);
        const templateParts = items
          .filter((i): i is { name: string; templateProps: Record<string, unknown> } => "name" in i && !!i.name);
        const content = textParts.join(" ") || (templateParts.length > 0 ? `[${templateParts[0].name}]` : "");
        if (content) {
          addMessage(conversationIdRef.current, {
            role: "assistant",
            content,
            ...(templateParts.length > 0 ? {
              template_name: templateParts[0].name,
              template_props: templateParts[0].templateProps,
            } : {}),
          }).catch(() => {});
        }
      }

      // MARK'S REQUIREMENT: NO intermediate suggestions during conversation
      // Filter out person/leverage loop cards - only allow at dispatch confirmation
      const BLOCKED_DURING_INTERVIEW = ['contact_card', 'leverage_loop_card', 'serendipity_card'];
      items = items.filter(item => {
        if ('name' in item && BLOCKED_DURING_INTERVIEW.includes(item.name)) {
          console.log('[FILTERED]', item.name, '- Mark wants NO intermediate suggestions');
          return false; // Block these cards during conversation
        }
        return true; // Allow everything else (text, dispatch_confirmation, etc.)
      });

      // FRONTEND FALLBACK: If backend shows results but doesn't send dispatch_confirmation,
      // auto-generate one to trigger the modal
      const hasResults = items.some(item => 'name' in item && 
        (item.name === 'quick_result_card' || item.name === 'scanning_card'));
      const hasDispatchConfirmation = items.some(item => 'name' in item && 
        item.name === 'dispatch_confirmation');
      
      if (hasResults && !hasDispatchConfirmation && history.length > 0) {
        // Extract goal from conversation history
        const lastUserMessages = history
          .filter(m => m.role === 'user')
          .map(m => typeof m.content === 'string' ? m.content : String(m.content))
          .slice(-3); // Last 3 user messages
        
        const goalText = lastUserMessages.join(' ');
        const personMatch = goalText.match(/(?:help|for)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
        const personName = personMatch ? personMatch[1] : 'contact';
        
        // Extract goal keywords
        const goalMatch = goalText.match(/(?:find|get|help with|looking for)\s+([^.!?]+)/i);
        const goal = goalMatch ? goalMatch[1].trim() : 'network analysis';
        
        console.log('[FALLBACK] Auto-generating dispatch_confirmation:', { personName, goal });
        
        items.push({
          name: 'dispatch_confirmation',
          templateProps: {
            person_name: personName,
            goal: goal,
            context: `Compiled from conversation: ${lastUserMessages.join('. ')}`,
            master_person_id: masterPersonIdRef.current || null
          }
        });
      }

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          if (abortController.signal.aborted) { controller.close(); return; }
          for (const item of items) {
            // Handle text items (support both 'text' and 'content' fields)
            const textContent = ("type" in item && item.type === "text") ? (item.text || (item as any).content) : null;
            if (textContent) {
              const words = String(textContent).split(" ");
              for (let i = 0; i < words.length; i++) {
                const chunk = (i === 0 ? "" : " ") + words[i];
                controller.enqueue(encoder.encode(`event: text\ndata: ${chunk}\n\n`));
              }
            } else if ("name" in item && item.name) {
              controller.enqueue(encoder.encode(
                `event: tpl\ndata: ${JSON.stringify({
                  name: item.name,
                  templateProps: (item as { templateProps: Record<string, unknown> }).templateProps,
                })}\n\n`
              ));
            }
          }
          controller.close();
        },
      });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          },
        });
      } catch (error) {
        console.error('[PROCESS MESSAGE ERROR]', error);
        console.error('[ERROR DETAILS]', {
          prompt,
          hasNetworkSummary: !!networkSummary,
          historyLength: history?.length || 0
        });
        
        // Return error as text stream
        const encoder = new TextEncoder();
        const errorStream = new ReadableStream({
          start(controller) {
            const errorText = `Error processing message: ${error instanceof Error ? error.message : 'Unknown error'}`;
            controller.enqueue(encoder.encode(`event: text\ndata: ${errorText}\n\n`));
            controller.close();
          }
        });
        
        return new Response(errorStream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          },
        });
      }
    },
    [networkSummary, fetchConversations]
  );

  const tabs: Array<{ id: Tab; icon: string }> = [
    { id: "Network",     icon: "◎" },
    { id: "Search",      icon: "⌕" },
    { id: "Outcomes",    icon: "◈" },
    { id: "Horizon",     icon: "◷" },
    { id: "Collections", icon: "▦" },
    { id: "Insights",    icon: "◑" },
    { id: "Docs",        icon: "≡" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Network":     return <NetworkView onSwitchTab={(t) => setActiveTab(t as Tab)} onSelectPerson={handleSelectPersonFromView} />;
      case "Search":      return <SearchView onSwitchTab={(t) => setActiveTab(t as Tab)} onSelectPerson={handleSelectPersonFromView} />;
      case "Outcomes":    return <OutcomesView onSwitchTab={(t) => setActiveTab(t as Tab)} onSelectPerson={handleSelectPersonFromView} />;
      case "Horizon":     return <HorizonView onSwitchTab={(t) => setActiveTab(t as Tab)} />;
      case "Collections": return <CollectionsView onSwitchTab={(t) => setActiveTab(t as Tab)} onSelectPerson={handleSelectPersonFromView} />;
      case "Insights":    return <InsightsView onSwitchTab={(t) => setActiveTab(t as Tab)} />;
      case "Docs":        return <DocsView />;
      default:            return <HomeView onOpenCopilot={() => setModalOpen(true)} />;
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#070710",
        fontFamily: "Inter, -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <DotGrid />

      {/* ─── Header ──────────────────────────────────────── */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "0 20px",
          height: "52px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(7,7,16,0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          flexShrink: 0,
          zIndex: 100,
          position: "relative",
        }}
      >
        {/* Logo */}
        <div
          onClick={() => setActiveTab("Home")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <div style={{
            width: "26px",
            height: "26px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 10px rgba(79,70,229,0.45)",
          }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="2.5" fill="white" />
              <circle cx="8" cy="8" r="5.5" stroke="white" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2.5 2" />
              <circle cx="8" cy="8" r="7.5" stroke="white" strokeWidth="0.75" strokeOpacity="0.25" strokeDasharray="1.5 3" />
            </svg>
          </div>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#e8e8f0", letterSpacing: "-0.02em" }}>
            Orbiter
          </span>
        </div>

        <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.07)", margin: "0 4px" }} />

        {/* Nav tabs */}
        <nav style={{ display: "flex", alignItems: "center", gap: "1px" }}>
          {tabs.map(({ id, icon }) => (
            <NavTab
              key={id}
              label={id}
              icon={icon}
              active={activeTab === id}
              onClick={() => setActiveTab(id)}
            />
          ))}
        </nav>

        {/* Right */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Open Copilot */}
          <button
            onClick={() => setModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "6px 14px",
              background: "linear-gradient(135deg, rgba(79,70,229,0.2), rgba(124,58,237,0.15))",
              border: "1px solid rgba(99,102,241,0.35)",
              borderRadius: "10px",
              color: "#a5b4fc",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s ease",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, rgba(79,70,229,0.3), rgba(124,58,237,0.22))";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,102,241,0.55)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, rgba(79,70,229,0.2), rgba(124,58,237,0.15))";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,102,241,0.35)";
            }}
          >
            Copilot
          </button>

          {/* Calendar Settings */}
          <button
            onClick={() => setCalendarModalOpen(true)}
            title="Calendar Settings"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              color: "#8b92a7",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)";
              (e.currentTarget as HTMLButtonElement).style.color = "#a5b4fc";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLButtonElement).style.color = "#8b92a7";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </button>

          {/* Avatar */}
          <div style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 700,
            color: "white",
            boxShadow: "0 2px 8px rgba(99,102,241,0.35)",
            flexShrink: 0,
            cursor: "pointer",
          }}>
            R
          </div>
        </div>
      </header>

      {/* ─── Content ──────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          key={activeTab}
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            animation: "fadeUp 0.22s ease both",
          }}
        >
          {renderContent()}
        </div>
      </div>

      {/* ─── Copilot Modal ────────────────────────────────── */}
      <CopilotModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPerson={selectedPerson}
        onPersonSelect={handlePersonSelect}
        onPersonClear={handlePersonClear}
        processMessage={processMessage}
        onForkChoice={handleForkChoice}
        showFork={showFork}
        onChatStart={handleChatStart}
        pendingPrompt={pendingPrompt}
        onPendingPromptConsumed={() => setPendingPrompt(null)}
        onTabChange={(tab) => setActiveTab(tab as Tab | "Home")}
        hasConversationContext={hasConversationContext}
        onResetContext={() => { setHasConversationContext(false); conversationIdRef.current = null; }}
        conversations={conversations}
        onSelectConversation={(conv) => {
          conversationIdRef.current = conv.id;
          setHasConversationContext(true);
        }}
      />

      {/* ─── Calendar Settings Modal ──────────────────────── */}
      <CalendarSettingsModal
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        onSuccess={(connection) => {
          setSuccessMessage(`Successfully connected ${connection.provider} calendar for ${connection.email}`);
          setShowSuccessToast(true);
          setTimeout(() => setCalendarModalOpen(false), 2000);
        }}
      />

      {/* ─── Confirmation Modal ───────────────────────────── */}
      <ConfirmationModal
        open={showConfirmation}
        onClose={handleCancelDispatch}
        onConfirm={handleConfirmDispatch}
        summary={dispatchSummary}
        dispatching={dispatching}
      />

      {/* ─── Success Toast ─────────────────────────────────*/}
      <SuccessToast
        visible={showSuccessToast}
        message={successMessage}
        onClose={() => setShowSuccessToast(false)}
      />

      {/* ─── Confetti ────────────────────────────────────── */}
      <Confetti active={showConfetti} />

      {/* ─── Waiting Room (Process Monitoring) ──────────── */}
      {showWaitingRoom && processId && currentDispatchData && (
        <WaitingRoomConnected
          processId={processId}
          title={currentDispatchData.personName 
            ? `Finding connections for ${currentDispatchData.personName}` 
            : `Analyzing your network`}
          description={currentDispatchData.summary}
          onComplete={async () => {
            console.log("Process complete! Fetching results...");
            
            try {
              // Fetch results based on mode
              if (currentDispatchData.mode === "loop") {
                const results = await getLeverageLoopSuggestions(processId);
                console.log("Leverage loop suggestions:", results);
              } else if (currentDispatchData.mode === "outcome") {
                // TODO: Fetch outcome suggestions endpoint TBD
                console.log("Outcome suggestions - endpoint TBD");
              }
              
              // Close waiting room and modal
              setShowWaitingRoom(false);
              setProcessId(null);
              setModalOpen(false);
              
              // Navigate to Outcomes tab
              setActiveTab("Outcomes");
              
              // Clear person selection
              handlePersonClear();
              
              // Show success
              setSuccessMessage("Found connections! Check the Outcomes tab.");
              setShowSuccessToast(true);
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 3000);
            } catch (error) {
              console.error("Failed to fetch results:", error);
              setShowWaitingRoom(false);
              setProcessId(null);
              setSuccessMessage("Results ready but couldn't load. Check Outcomes tab.");
              setShowSuccessToast(true);
            }
          }}
          onError={(error) => {
            console.error("Process failed:", error);
            setShowWaitingRoom(false);
            setProcessId(null);
            setModalOpen(false);
            setSuccessMessage(`Process failed: ${error}`);
            setShowSuccessToast(true);
          }}
          onCancel={() => {
            console.log("Process cancelled by user");
            setShowWaitingRoom(false);
            setProcessId(null);
          }}
        />
      )}
    </div>
  );
}

function NavTab({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: "12px",
        fontWeight: active ? 600 : 400,
        padding: "5px 10px",
        borderRadius: "8px",
        background: active ? "rgba(99,102,241,0.12)" : hovered ? "rgba(255,255,255,0.04)" : "transparent",
        border: active ? "1px solid rgba(99,102,241,0.28)" : "1px solid transparent",
        color: active ? "#a5b4fc" : hovered ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.3)",
        cursor: "pointer",
        transition: "all 0.14s ease",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <span style={{ fontSize: "11px", opacity: 0.7 }}>{icon}</span>
      {label}
    </button>
  );
}
