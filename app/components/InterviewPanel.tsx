"use client";

import { useState, useEffect } from "react";
import { PersonPicker } from "./PersonPicker";
import type { InterviewState } from "../hooks/useInterviewFlow";

interface InterviewPanelProps {
  state: InterviewState;
  question: string;
  examples?: string[];
  helpText?: string;
  onPersonSelect: (personId: number, personName: string) => void;
  onAnswer: (answer: string) => void;
  onSkip: () => void;
  onReset: () => void;
}

const stageLabels = {
  identify_person: "Who to help",
  clarify_outcome: "What outcome",
  extract_context: "Add details",
  confirm: "Confirm & dispatch",
};

const stageNumbers = {
  identify_person: 1,
  clarify_outcome: 2,
  extract_context: 3,
  confirm: 4,
};

export function InterviewPanel({
  state,
  question,
  examples,
  helpText,
  onPersonSelect,
  onAnswer,
  onSkip,
  onReset,
}: InterviewPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [showPersonPicker, setShowPersonPicker] = useState(state.stage === "identify_person");

  // Update person picker visibility when stage changes
  useEffect(() => {
    setShowPersonPicker(state.stage === "identify_person");
  }, [state.stage]);

  const currentStep = stageNumbers[state.stage];
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onAnswer(inputValue);
      setInputValue("");
    }
  };

  const handleExampleClick = (example: string) => {
    setInputValue(example);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(600px, 90vw)",
        maxHeight: "80vh",
        background: "linear-gradient(145deg, rgba(20,20,30,0.98), rgba(15,15,25,0.98))",
        backdropFilter: "blur(40px)",
        border: "1px solid rgba(99,102,241,0.3)",
        borderRadius: "24px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.2)",
        zIndex: 2000,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header with progress */}
      <div
        style={{
          background: "rgba(0,0,0,0.3)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "20px 24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#8b5cf6",
                boxShadow: "0 0 12px rgba(139,92,246,0.6)",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <button
            onClick={onReset}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.4)",
              fontSize: "20px",
              cursor: "pointer",
              padding: "4px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.4)")}
          >
            ×
          </button>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: "4px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
              borderRadius: "2px",
              transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>

        {/* Stage label */}
        <div
          style={{
            marginTop: "12px",
            fontSize: "12px",
            color: "#8b5cf6",
            fontWeight: 600,
          }}
        >
          {stageLabels[state.stage]}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: "32px 24px",
          flex: 1,
          overflow: "auto",
        }}
      >
        {/* Question */}
        <h3
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#e8e8f0",
            marginBottom: "16px",
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
          }}
        >
          {question}
        </h3>

        {/* Help text */}
        {helpText && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              padding: "12px 14px",
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <span style={{ fontSize: "16px" }}>💡</span>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
              {helpText}
            </span>
          </div>
        )}

        {/* Show person picker for identify_person stage */}
        {state.stage === "identify_person" && showPersonPicker && (
          <div style={{ marginBottom: "20px" }}>
            <PersonPicker
              selectedPerson={null}
              onSelect={(person) => {
                onPersonSelect(
                  person.master_person_id,
                  person.master_person?.name || person.full_name
                );
                setShowPersonPicker(false);
              }}
              onClear={() => {
                // No-op in interview mode
              }}
            />
          </div>
        )}

        {/* Examples */}
        {examples && examples.length > 0 && state.stage !== "identify_person" && (
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 600,
              }}
            >
              Examples:
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {examples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => handleExampleClick(example)}
                  style={{
                    padding: "12px 16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "14px",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input field (not shown for person picker stage) */}
        {state.stage !== "identify_person" && (
          <div style={{ marginBottom: "20px" }}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your answer..."
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "14px 16px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#e8e8f0",
                fontSize: "15px",
                fontFamily: "inherit",
                resize: "vertical",
                outline: "none",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleSubmit();
                }
              }}
            />
            <div
              style={{
                marginTop: "8px",
                fontSize: "12px",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Press ⌘+Enter to submit
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "16px 24px",
          background: "rgba(0,0,0,0.2)",
          display: "flex",
          gap: "12px",
        }}
      >
        <button
          onClick={onSkip}
          style={{
            flex: 1,
            padding: "12px 20px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            color: "rgba(255,255,255,0.6)",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
          }}
        >
          Skip Questions
        </button>
        {state.stage !== "identify_person" && (
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
            style={{
              flex: 2,
              padding: "12px 20px",
              background: inputValue.trim()
                ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                : "rgba(99,102,241,0.3)",
              border: "none",
              borderRadius: "10px",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              cursor: inputValue.trim() ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (inputValue.trim()) {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(99,102,241,0.4)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
