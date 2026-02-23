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
import { ErrorCard } from "./components/ErrorCard";
import { ProgressTracker } from "./components/ProgressTracker";
import { BackButton } from "./components/BackButton";
import { CancelButton } from "./components/CancelButton";
import { Confetti } from "./components/Confetti";
import { DispatchConfirmationModal } from "./components/DispatchConfirmationModal";
import { WaitingRoomConnected } from "./components/WaitingRoomConnected";
// InterviewPanel removed - using conversational backend flow instead
import { chat, dispatch } from "./lib/xano";
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
  const [promptToSend, setPromptToSend] = useState<string | null>(null);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [dispatchDescription, setDispatchDescription] = useState("");
  const [isDispatching, setIsDispatching] = useState(false);
  const [processId, setProcessId] = useState<number | null>(null);
  const [showWaitingRoom, setShowWaitingRoom] = useState(false);
  const [currentDispatchData, setCurrentDispatchData] = useState<{
    personId?: number;
    goal?: string;
    context?: string;
  } | null>(null);
  
  // No interview mode interception - backend handles conversational flow

  useEffect(() => {
    if (pendingPrompt) {
      chatKey.current += 1;
      setPromptToSend(pendingPrompt);
      onPendingPromptConsumed();
    }
  }, [pendingPrompt, onPendingPromptConsumed]);

  const personName = selectedPerson?.master_person?.name || selectedPerson?.full_name;
  const personTitle = selectedPerson?.master_person?.current_title;
  const personCompany = selectedPerson?.master_person?.master_company?.company_name;

  // Dynamic conversation starters based on whether person is selected
  const defaultStarters = selectedPerson
    ? [
        {
          displayText: `Explore ways to help ${personName}`,
          prompt: `I want to explore ways to help ${personName}. Guide me through some options.`,
        },
        {
          displayText: `What's my best move with ${personName}?`,
          prompt: `What's my single best move right now to activate my relationship with ${personName}? Be direct — tell me what to do.`,
        },
        {
          displayText: `Help ${personName} with something specific`,
          prompt: `I want to help ${personName}${personTitle ? ` — ${personTitle}` : ""} with something specific. Ask me what I want to help them with — keep it brief.`,
        },
        {
          displayText: `Meeting Prep for ${personName}`,
          prompt: `Meeting prep: give me a meeting prep card for ${personName}. Include a summary, 3 talking points, things to listen for, and any landmines to avoid.`,
        },
      ]
    : [
        {
          displayText: "Help someone in my network",
          prompt: "I want to help someone in my network. Ask me who and what they need.",
        },
        {
          displayText: "Explore my network for opportunities",
          prompt: "Guide me through exploring my network to find valuable connections.",
        },
        {
          displayText: "Find the right person for...",
          prompt: "I'm looking for someone specific in my network. Help me find them.",
        },
      ];

  return (
    <>
      {/* Modal - only show when open */}
      {open && (
      <>
        {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          zIndex: 900,
          animation: "backdropFadeIn 0.2s ease both",
        }}
      />

      {/* Modal container - centered card */}
      <div
        className="copilot-modal-container"
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

          <span style={{ fontSize: "13px", fontWeight: 700, color: "#e8e8f0", letterSpacing: "-0.01em" }}>
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
                  personId: selectedPerson.master_person_id,
                  goal: "",
                  context: "",
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
                  onForkChoice(prompt);
                  onChatStart();
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
                  flexDirection: "column"
                }}>
                  <CrayonChat
                    type="standalone"
                    processMessage={processMessage}
                    agentName="Orbiter Copilot"
                    responseTemplates={templates}
                    // theme={orbiterTheme} // Custom theme via CSS instead
                    messageLoadingComponent={() => <LoadingIndicator />}
                    welcomeMessage={{
                      title: personName
                        ? `What do you want to do with ${personName}?`
                        : "Your network is full of doors.",
                      description: personName
                        ? `${personTitle || ""}${personCompany ? ` · ${personCompany}` : ""}`
                        : "Pick someone above or ask me anything about your network.",
                    }}
                    conversationStarters={{
                      variant: "long",
                      options: defaultStarters,
                    }}
                  />
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
                master_person_id: currentDispatchData?.personId || selectedPerson?.master_person_id,
                goal: currentDispatchData?.goal || "Help with network analysis",
                context: currentDispatchData?.context || dispatchDescription,
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

      {/* Waiting Room for Process Monitoring */}
      {showWaitingRoom && processId && (
        <WaitingRoomConnected
          processId={processId}
          title={`Analyzing network for ${personName || "contact"}`}
          description={dispatchDescription}
          onComplete={(result) => {
            console.log("Process complete!", result);
            setShowWaitingRoom(false);
            setProcessId(null);
            // Navigate to Outcomes tab
            onTabChange?.("outcomes");
          }}
          onError={(error) => {
            console.error("Process failed:", error);
            alert(`Process failed: ${error}`);
            setShowWaitingRoom(false);
            setProcessId(null);
          }}
          onCancel={() => {
            console.log("Process cancelled by user");
            setShowWaitingRoom(false);
            setProcessId(null);
          }}
        />
      )}
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
    setPendingPrompt(prompt);
  }, []);

  const handleChatStart = useCallback(() => {
    setShowFork(false);
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
      
      // Success - close modal and reset
      setDispatching(false);
      setShowConfirmation(false);
      setModalOpen(false);
      
      // Show success toast with dispatch ID
      setSuccessMessage(
        `Your network has been activated! (${result.dispatch_id}) We'll notify you when connections are found.`
      );
      setShowSuccessToast(true);
      
      // Trigger confetti celebration!
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      handlePersonClear();
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

      // MOCK MODE: Use mock responses for testing frontend
      const MOCK_ENABLED = process.env.NEXT_PUBLIC_MOCK_BACKEND === 'true';
      let raw = "";
      
      if (MOCK_ENABLED) {
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
      
      const cleaned = raw
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
        try { parsed = JSON.parse(cleaned); }
        catch { parsed = JSON.parse(sanitized); }
        
        // Support multiple backend response formats
        if (parsed?.response && Array.isArray(parsed.response)) {
          // Format 1: {response: [{name, templateProps}]}
          items = parsed.response;
        } else if (parsed?.template && parsed?.data) {
          // Format 2: {template: "name", data: {...}}
          items = [{ name: parsed.template, templateProps: parsed.data }];
        } else if (Array.isArray(parsed)) {
          // Format 3: [{template, data}, ...]
          items = parsed.map(item => ({
            name: item.template || item.name,
            templateProps: item.data || item.templateProps || item
          }));
        } else {
          // Fallback to empty array
          console.warn('[PARSE WARNING] Unknown response format:', parsed);
          items = [];
        }
      } catch (err) {
        console.error('[PARSE ERROR]', err, 'Raw:', raw);
        items = [{ type: "text", text: cleaned || raw || "I encountered an error. Please try again." }];
      }

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          if (abortController.signal.aborted) { controller.close(); return; }
          for (const item of items) {
            if ("type" in item && item.type === "text" && item.text) {
              const words = item.text.split(" ");
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
