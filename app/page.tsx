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
import { DispatchConfirmationModal } from "./components/DispatchConfirmationModal";
import { WaitingRoomConnected } from "./components/WaitingRoomConnected";
import { InlineInterviewCard } from "./components/InlineInterviewCard";
import { FormattedDispatchSummary } from "./components/FormattedDispatchSummary";
import { ModePicker } from "./components/ModePicker";
// InterviewPanel removed - using conversational backend flow instead
import { chat, dispatch, getLeverageLoopSuggestions } from "./lib/xano";
import { detectDispatchIntent, generateDispatchDescription } from "./lib/dispatch";
import { generateMeetingPrep } from "./lib/meeting-prep";
// Interview classifier imports removed - backend handles conversational flow
// useInterviewFlow removed - backend handles conversational interview
// import { orbiterTheme } from "./lib/theme"; // Using CSS-based theming instead
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useForceFullWidth } from "./hooks/useForceFullWidth";
import "@crayonai/react-ui/styles/index.css";

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
  { name: "question_card_enhanced", Component: QuestionCardEnhanced }, // NEW: with "I don't know" + help text
  { name: "quick_result_card",  Component: QuickResultCard   }, // NEW: Jason's two-layer system
  { name: "scanning_card",      Component: ScanningCard      },
  { name: "loading_indicator",  Component: LoadingIndicator  },
  { name: "error_card",         Component: ErrorCard         },
  { name: "interview_card",     Component: InlineInterviewCard }, // NEW: Inline conversational interview
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
}: CopilotModalProps) {
  const chatKey = useRef(0);
  const [selectedMode, setSelectedMode] = useState<'default' | 'leverage' | 'meeting' | 'outcome'>('default');
  const [hasStartedConversation, setHasStartedConversation] = useState(false);
  const [promptToSend, setPromptToSend] = useState<string | null>(null);
  const [showDispatchModal, setShowDispatchModal] = useState(false);

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
  const [dispatchDescription, setDispatchDescription] = useState("");
  const [isDispatching, setIsDispatching] = useState(false);
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

  // Listen for interview dispatch ready event
  useEffect(() => {
    const handleDispatchReady = (event: CustomEvent) => {
      const { personId, personName, outcome, constraints, description } = event.detail;
      
      // Set dispatch data (using new format)
      setCurrentDispatchData({
        summary: outcome || "Help with outcome",
        mode: "outcome", // This looks like an outcome dispatch
        personName: personName,
      });
      setDispatchDescription(description);
      
      // Show dispatch modal
      setShowDispatchModal(true);
    };

    window.addEventListener("interview-dispatch-ready", handleDispatchReady as EventListener);
    return () => {
      window.removeEventListener("interview-dispatch-ready", handleDispatchReady as EventListener);
    };
  }, []);

  // Listen for dispatch_confirmation template from backend
  useEffect(() => {
    const handleDispatchConfirmation = (event: CustomEvent) => {
      const { person_name, goal, context, master_person_id } = event.detail;
      console.log('[MODAL TRIGGER]', event.detail);
      
      // Set dispatch data (using new format)
      setDispatchDescription(`Leverage my network to help ${person_name} ${goal}\n\n${context}`);
      setCurrentDispatchData({
        summary: `${goal} - ${context}`,
        mode: "loop", // This is a leverage loop
        personName: person_name,
      });
      
      // Show dispatch modal
      setShowDispatchModal(true);
    };

    window.addEventListener("dispatch-confirmation-received", handleDispatchConfirmation as EventListener);
    return () => {
      window.removeEventListener("dispatch-confirmation-received", handleDispatchConfirmation as EventListener);
    };
  }, []);

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
          // STEP 1: Set the value programmatically
          inputElement.value = pendingPrompt;
          
          // STEP 2: Trigger React onChange handler
          // NOTE: Must dispatch 'input' event for React to detect change
          const inputEvent = new Event('input', { bubbles: true });
          inputElement.dispatchEvent(inputEvent);
          
          // STEP 3: Find and click the send button
          // Try multiple possible button locations (welcome screen or thread composer)
          const sendButton = document.querySelector('.crayon-shell-desktop-welcome-composer button[type="submit"], .crayon-shell-composer button[type="submit"], .crayon-shell-composer-send') as HTMLButtonElement;
          
          if (sendButton) {
            // SUCCESS PATH: Found send button, click after brief delay
            setTimeout(() => {
              sendButton.click();
              onPendingPromptConsumed(); // Clear prompt to prevent re-send
            }, 100); // Small delay ensures React state updated
          } else {
            // FALLBACK PATH: No send button found, try form submit
            const form = inputElement.closest('form');
            if (form) {
              setTimeout(() => {
                form.requestSubmit(); // Modern form submission
                onPendingPromptConsumed();
              }, 100);
            } else {
              // EDGE CASE: No button or form found
              // This shouldn't happen, but consume prompt to prevent infinite loop
              console.warn('[AUTO-SEND] Could not find send button or form');
              onPendingPromptConsumed();
            }
          }
        } else {
          // ERROR CASE: Input element not found
          // Likely CrayonChat structure changed or didn't mount
          console.warn('[AUTO-SEND] Could not find input element');
          onPendingPromptConsumed();
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

          {/* Dispatch button - triggers dispatch modal only when ready */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              
              if (selectedPerson) {
                // Person selected - show dispatch modal directly
                setDispatchDescription(`Help ${personName} with...`);
                setCurrentDispatchData({
                  summary: "Help with...",
                  mode: "loop",
                  personName: personName,
                });
                setShowDispatchModal(true);
              } else {
                // No person - prompt in chat
                onForkChoice("I want to help someone from my network");
              }
            }}
            style={{
              padding: "7px 14px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "1px solid rgba(99,102,241,0.3)",
              color: "white",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexShrink: 0,
              fontFamily: "inherit",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 12px rgba(99,102,241,0.4)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(99,102,241,0.6)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 12px rgba(99,102,241,0.4)";
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
                onChoice={(prompt) => {
                  console.log('[FORK CHOICE]', { prompt });
                  onForkChoice(prompt);
                  onChatStart();
                  
                  // Auto-send fix: Direct DOM manipulation after state settles
                  setTimeout(() => {
                    const textarea = document.querySelector('textarea[placeholder*="Type your message"]') as HTMLTextAreaElement;
                    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                    
                    if (textarea && submitButton) {
                      console.log('[AUTO-SEND FIX] Found textarea and submit button');
                      textarea.value = prompt;
                      textarea.dispatchEvent(new Event('input', { bubbles: true }));
                      
                      setTimeout(() => {
                        console.log('[AUTO-SEND FIX] Clicking submit');
                        submitButton.click();
                      }, 200);
                    } else {
                      console.warn('[AUTO-SEND FIX] Textarea or button not found, retrying...');
                      // Retry once after additional delay
                      setTimeout(() => {
                        const retryTextarea = document.querySelector('textarea[placeholder*="Type your message"]') as HTMLTextAreaElement;
                        const retryButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                        if (retryTextarea && retryButton) {
                          console.log('[AUTO-SEND FIX] Retry successful');
                          retryTextarea.value = prompt;
                          retryTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                          setTimeout(() => retryButton.click(), 200);
                        } else {
                          console.error('[AUTO-SEND FIX] Retry failed - elements still not found');
                        }
                      }, 800);
                    }
                  }, 1200);
                }}
              />
            ) : (
              <div
                key={`chat-${chatKey.current}`}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
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
                          setPromptToSend(null);
                          onPersonClear();
                          chatKey.current += 1;
                        }
                      }
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
                      </div>
                    ) : (selectedMode !== 'default' && !hasStartedConversation) ? (
                      // Meeting/Outcome modes: Start screens
                      <ModeStartScreen 
                        mode={selectedMode}
                        onSubmit={(value) => {
                          // Handle the submitted value
                          setPromptToSend(value);
                          setHasStartedConversation(true);
                        }}
                      />
                    ) : (
                      <CrayonChat
                        key={chatKey.current}
                      type="standalone"
                      processMessage={processMessage}
                      agentName={
                        selectedMode === 'default' ? "Copilot" :
                        selectedMode === 'leverage' ? "Leverage Loops" :
                        selectedMode === 'meeting' ? "Meeting Prep" :
                        "Outcomes"
                      }
                      responseTemplates={templates}
                    // theme={orbiterTheme} // Custom theme via CSS instead
                    messageLoadingComponent={() => <LoadingIndicator />}
                    welcomeMessage={{
                      title: selectedMode === 'default'
                        ? "How can I help you?"
                        : personName
                          ? `Help ${personName}`
                          : selectedMode === 'leverage' ? "Leverage Loops" :
                            selectedMode === 'meeting' ? "Meeting Prep" :
                            "Outcomes",
                      description: selectedMode === 'default'
                        ? "Ask me anything"
                        : personName
                          ? personTitle && personCompany
                            ? `${personTitle} · ${personCompany}`
                            : personTitle || personCompany || "What would you like to help them with?"
                          : selectedMode === 'leverage' ? "Help someone from your network" :
                            selectedMode === 'meeting' ? "Get context for your meetings" :
                            "Map your goals to actions",
                    }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dispatch Confirmation Modal */}
      <DispatchConfirmationModal
        open={showDispatchModal}
        onClose={() => setShowDispatchModal(false)}
        onConfirm={async () => {
          setIsDispatching(true);
          try {
            // Create leverage loop
            const BASE_URL = process.env.NEXT_PUBLIC_XANO_API_URL || "https://xh2o-yths-38lt.n7c.xano.io/api:Bd_dCiOz";
            
            const createResponse = await fetch(`${BASE_URL}/leverage-loop`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                master_person_id: selectedPerson?.master_person_id || null,
                goal: currentDispatchData?.summary || "Help with network analysis",
                context: dispatchDescription,
                fast: false,
              }),
            });
            
            if (!createResponse.ok) throw new Error("Failed to create leverage loop");
            
            const { id: loopId, process_id } = await createResponse.json();
            
            // Dispatch the loop
            await fetch(`${BASE_URL}/leverage-loop/${loopId}/dispatch`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ approved: true }),
            });
            
            // Store process ID and show waiting room
            setProcessId(process_id);
            setShowDispatchModal(false);
            setIsDispatching(false);
            setShowWaitingRoom(true);
          } catch (error) {
            console.error("Dispatch failed:", error);
            setIsDispatching(false);
            alert("Failed to dispatch: " + (error instanceof Error ? error.message : "Unknown error"));
          }
        }}
        description={dispatchDescription}
        personName={personName}
        isDispatching={isDispatching}
      />

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

      try {
        // MOCK MODE: Use mock responses for testing frontend
        // Default to mock mode if no API URL configured
        const HAS_API_URL = Boolean(process.env.NEXT_PUBLIC_XANO_API_URL);
        const MOCK_ENABLED = !HAS_API_URL || process.env.NEXT_PUBLIC_MOCK_BACKEND === 'true';
        let raw = "";
        
        if (MOCK_ENABLED) {
          console.log('[MOCK MODE] Using mock backend (no API URL configured)');
          const { getMockResponse } = await import('./lib/mock-backend');
          raw = getMockResponse(prompt, networkSummary);
          console.log('[MOCK RESPONSE]', raw);
        } else {
          // Send person context and network data separately (network_data is structured JSON)
          const data = await chat(
            prompt,
            personContextRef.current || undefined,
            history.length > 0 ? history : undefined,
            masterPersonIdRef.current,
            networkSummary || undefined // Structured JSON with full network
          );
          raw = data.raw || "";
          console.log('[BACKEND RESPONSE]', raw); // DEBUG: See what backend returned
        }
      
      // AGGRESSIVE JSON EXTRACTION
      // Backend sends: 'some text "type": "button_group", "templateProps": {...}'
      // Missing opening brace!
      
      let cleaned = raw;
      let textBeforeJson: string | null = null;
      
      // Check if we have broken JSON (has "type": but missing opening brace)
      if (raw.includes('"type":') && !raw.trim().startsWith('{')) {
        console.log('[BROKEN JSON DETECTED] Missing opening brace');
        
        // Find where the JSON-like content starts
        const typeIndex = raw.indexOf('"type":');
        textBeforeJson = raw.substring(0, typeIndex).trim();
        const jsonLike = raw.substring(typeIndex).trim();
        
        // Wrap in braces
        cleaned = `{${jsonLike}}`;
        console.log('[JSON RECONSTRUCTION] Text:', textBeforeJson);
        console.log('[JSON RECONSTRUCTION] JSON:', cleaned);
      } else {
        // Try to extract valid JSON object
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleaned = jsonMatch[0];
        }
      }
      
      cleaned = cleaned
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/, "")
        .trim();

      const sanitized = cleaned
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t");

      type ResponseItem =
        | { type: "text"; text: string }
        | { name: string; templateProps: Record<string, unknown> };

      let items: ResponseItem[] = [];
      try {
        let parsed;
        
        // Try standard JSON parsing first
        try { 
          parsed = JSON.parse(cleaned);
          console.log('[PARSE SUCCESS] Cleaned:', parsed);
        } catch (e1) { 
          console.warn('[PARSE FAILED] Cleaned, trying sanitized...', e1);
          try {
            parsed = JSON.parse(sanitized);
            console.log('[PARSE SUCCESS] Sanitized:', parsed);
          } catch (e2) {
            console.warn('[PARSE FAILED] Sanitized, checking for mixed content...', e2);
            
            // Check if response has both text and JSON mixed together
            // Pattern: "some text" {"type": "button_group", ...}
            const jsonObjectMatch = raw.match(/\{[\s\S]*"type"\s*:[\s\S]*\}/);
            if (jsonObjectMatch) {
              const textBefore = raw.substring(0, raw.indexOf(jsonObjectMatch[0])).trim().replace(/^["']|["']$/g, '');
              
              try {
                const jsonPart = JSON.parse(jsonObjectMatch[0]);
                console.log('[PARSE SUCCESS] Extracted mixed content:', {text: textBefore, json: jsonPart});
                
                // Construct proper response array
                parsed = {
                  response: [
                    ...(textBefore ? [{ type: "text", text: textBefore }] : []),
                    jsonPart
                  ]
                };
              } catch (e3) {
                console.error('[PARSE FAILED] JSON extraction failed:', e3);
                throw e2;
              }
            } else if (cleaned.includes('"type"') || cleaned.includes('"name"')) {
              // Try wrapping in braces as last resort
              const wrapped = `{${cleaned}}`;
              parsed = JSON.parse(wrapped);
              console.log('[PARSE SUCCESS] Wrapped:', parsed);
            } else {
              throw e2;
            }
          }
        }
        
        // Check if we extracted text before the JSON
        if (textBeforeJson && textBeforeJson.length > 0) {
          items.push({ type: "text", text: textBeforeJson });
        }
        
        // Normalize function: convert 'content' to 'text', handle both 'name' and 'type'
        const normalizeItem = (item: any): ResponseItem => {
          // Handle text items
          if (item.type === "text" || item.name === "text") {
            return {
              type: "text",
              text: item.text || item.content || ""
            };
          }
          // Handle template/card items
          return {
            name: item.name || item.type,
            templateProps: item.templateProps || item.data || item
          };
        };
        
        // Support multiple backend response formats
        if (parsed?.response && Array.isArray(parsed.response)) {
          // Format 1: {response: [{name, templateProps}]}
          items.push(...parsed.response.map(normalizeItem));
        } else if (parsed?.type && typeof parsed.type === 'string') {
          // Format 2: Single {type: "...", templateProps/content: {...}}
          items.push(normalizeItem(parsed));
        } else if (parsed?.template && parsed?.data) {
          // Format 3: {template: "name", data: {...}}
          items.push(normalizeItem({ name: parsed.template, templateProps: parsed.data }));
        } else if (Array.isArray(parsed)) {
          // Format 4: [{template, data}, ...] or [{type, templateProps}, ...]
          items.push(...parsed.map(normalizeItem));
        } else {
          // Fallback to empty array
          console.warn('[PARSE WARNING] Unknown response format:', parsed);
        }
      } catch (err) {
        console.error('[PARSE ERROR]', err);
        console.error('[PARSE ERROR] Raw response:', raw);
        
        // SUPER ROBUST FALLBACK: Try to extract content from malformed JSON
        // Strategy: Look for the text between "content":" and the next "
        // But handle escaped quotes and long text
        
        try {
          // Find content or text field value using indexOf (more reliable than regex for long strings)
          let extractedText = "";
          
          if (raw.includes('"content"')) {
            const contentStart = raw.indexOf('"content"');
            const valueStart = raw.indexOf(':"', contentStart) + 2; // After :"
            if (valueStart > contentStart) {
              // Find end - but need to handle escaped quotes
              let valueEnd = valueStart;
              let inEscape = false;
              for (let i = valueStart; i < raw.length; i++) {
                if (raw[i] === '\\' && !inEscape) {
                  inEscape = true;
                  continue;
                }
                if (raw[i] === '"' && !inEscape) {
                  valueEnd = i;
                  break;
                }
                inEscape = false;
              }
              extractedText = raw.substring(valueStart, valueEnd);
            }
          } else if (raw.includes('"text"')) {
            const textStart = raw.indexOf('"text"');
            const valueStart = raw.indexOf(':"', textStart) + 2;
            if (valueStart > textStart) {
              let valueEnd = valueStart;
              let inEscape = false;
              for (let i = valueStart; i < raw.length; i++) {
                if (raw[i] === '\\' && !inEscape) {
                  inEscape = true;
                  continue;
                }
                if (raw[i] === '"' && !inEscape) {
                  valueEnd = i;
                  break;
                }
                inEscape = false;
              }
              extractedText = raw.substring(valueStart, valueEnd);
            }
          }
          
          if (extractedText && extractedText.length > 10) {
            console.log('[FALLBACK EXTRACTION SUCCESS]', extractedText.substring(0, 100));
            items = [{ type: "text", text: extractedText }];
          } else {
            throw new Error('No extractable text found');
          }
        } catch (extractError) {
          // Absolute last resort: show raw response
          console.error('[EXTRACTION FAILED]', extractError);
          items = [{ 
            type: "text", 
            text: `⚠️ Response format error. Showing raw response:\n\n${raw.substring(0, 500)}` 
          }];
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
            } else if ("name" in item && item.name === "dispatch_confirmation") {
              // Special handling: dispatch_confirmation triggers modal, not a chat template
              const props = (item as { templateProps: Record<string, unknown> }).templateProps;
              console.log('[DISPATCH CONFIRMATION]', props);
              
              // Emit event to trigger modal (event listener is set up in useEffect)
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent("dispatch-confirmation-received", {
                  detail: props
                }));
              }, 0);
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
            const errorText = `⚠️ Error processing message: ${error instanceof Error ? error.message : 'Unknown error'}`;
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
    [networkSummary]
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
