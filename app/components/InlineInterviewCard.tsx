"use client";

import { useState } from "react";
import { useThreadActions } from "@crayonai/react-core";
import { PersonPicker } from "./PersonPicker";

/**
 * Inline Interview Card - appears IN the chat as a response card
 * Conversational, dynamic, context-aware
 */

interface InlineInterviewCardProps {
  question: string;
  stage: "identify_person" | "clarify_outcome" | "extract_context" | "confirm";
  context?: {
    personName?: string;
    personId?: number;
    outcome?: string;
    constraints?: string[];
  };
  examples?: string[];
  helpText?: string;
}

export function InlineInterviewCard({
  question,
  stage,
  context,
  examples,
  helpText,
}: InlineInterviewCardProps) {
  const { processMessage } = useThreadActions();
  const [textAnswer, setTextAnswer] = useState("");
  const [showPersonPicker, setShowPersonPicker] = useState(stage === "identify_person");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<any>(null);

  const handleSubmit = async () => {
    if (textAnswer.trim() && !isProcessing) {
      setIsProcessing(true);
      try {
        await processMessage({
          role: "user",
          type: "prompt",
          message: textAnswer.trim(),
        });
        setTextAnswer("");
      } catch (error) {
        console.error("[InlineInterviewCard] Submit error:", error);
      }
      setIsProcessing(false);
    }
  };

  const handleExampleClick = async (example: string) => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        // Special handling for confirm stage "Yes, dispatch now"
        if (stage === "confirm" && example.toLowerCase().includes("yes") && example.toLowerCase().includes("dispatch")) {
          // Trigger dispatch modal with collected context
          const event = new CustomEvent("interview-dispatch-ready", {
            detail: {
              personId: context?.personId,
              personName: context?.personName,
              outcome: context?.outcome,
              constraints: context?.constraints,
              description: question, // Use the question as it contains the full summary
            },
          });
          window.dispatchEvent(event);
          setIsProcessing(false);
          return;
        }

        await processMessage({
          role: "user",
          type: "prompt",
          message: example,
        });
      } catch (error) {
        console.error("[InlineInterviewCard] Example error:", error);
      }
      setIsProcessing(false);
    }
  };

  const handlePersonSelect = async (person: any, context: string) => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        // Send the person's name as the message
        const personName = person.master_person?.name || person.full_name;
        await processMessage({
          role: "user",
          type: "prompt",
          message: `Selected: ${personName}`,
        });
        setShowPersonPicker(false);
      } catch (error) {
        console.error("[InlineInterviewCard] Person select error:", error);
      }
      setIsProcessing(false);
    }
  };

  const handleSkip = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      try {
        await processMessage({
          role: "user",
          type: "prompt",
          message: "skip",
        });
      } catch (error) {
        console.error("[InlineInterviewCard] Skip error:", error);
      }
      setIsProcessing(false);
    }
  };

  // Dynamic styling based on stage
  const stageColors = {
    identify_person: { bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.25)" },
    clarify_outcome: { bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.25)" },
    extract_context: { bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.25)" },
    confirm: { bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.25)" },
  };

  const colors = stageColors[stage];

  return (
    <div
      style={{
        maxWidth: "560px",
        background: `linear-gradient(135deg, ${colors.bg}, ${colors.bg.replace("0.08", "0.12")})`,
        border: `1px solid ${colors.border}`,
        borderRadius: "16px",
        padding: "20px 24px",
        margin: "16px 0",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.05)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Question */}
      <div
        style={{
          fontSize: "15px",
          fontWeight: 600,
          color: "rgba(255,255,255,0.95)",
          marginBottom: "16px",
          lineHeight: "1.5",
        }}
      >
        {question}
      </div>

      {/* Context hint (if provided) */}
      {context?.personName && stage !== "identify_person" && (
        <div
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.6)",
            marginBottom: "12px",
            padding: "8px 12px",
            background: "rgba(0,0,0,0.2)",
            borderRadius: "8px",
          }}
        >
          👤 {context.personName}
          {context.outcome && ` • 🎯 ${context.outcome}`}
        </div>
      )}

      {/* Person Picker (for identify_person stage) */}
      {showPersonPicker && stage === "identify_person" && (
        <div style={{ marginBottom: "16px" }}>
          <PersonPicker
            onSelect={handlePersonSelect}
            selectedPerson={selectedPerson}
            onClear={() => setSelectedPerson(null)}
          />
        </div>
      )}

      {/* Example buttons (dynamic based on stage and context) */}
      {examples && examples.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          {examples.map((example, i) => (
            <button
              key={i}
              onClick={() => handleExampleClick(example)}
              disabled={isProcessing}
              style={{
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.3)",
                borderRadius: "10px",
                padding: "8px 14px",
                fontSize: "13px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.9)",
                cursor: isProcessing ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                opacity: isProcessing ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(99,102,241,0.25)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(99,102,241,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(99,102,241,0.15)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {example}
            </button>
          ))}
        </div>
      )}

      {/* Text input (for freeform answers) */}
      {stage !== "identify_person" && (
        <div style={{ marginBottom: "12px" }}>
          <input
            type="text"
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Or type your own answer..."
            style={{
              width: "100%",
              padding: "10px 14px",
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "rgba(255,255,255,0.9)",
              fontSize: "14px",
              outline: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
      )}

      {/* Help text */}
      {helpText && (
        <div
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "12px",
            lineHeight: "1.4",
          }}
        >
          💡 {helpText}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
        {stage === "extract_context" && !isProcessing && (
          <button
            onClick={handleSkip}
            style={{
              padding: "8px 16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              color: "rgba(255,255,255,0.6)",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "rgba(255,255,255,0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "rgba(255,255,255,0.6)";
            }}
          >
            Skip
          </button>
        )}
        {stage !== "identify_person" && textAnswer.trim() && !isProcessing && (
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            style={{
              padding: "8px 20px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: "8px",
              color: "white",
              fontSize: "13px",
              fontWeight: 600,
              cursor: isProcessing ? "not-allowed" : "pointer",
              boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
              transition: "all 0.2s",
              opacity: isProcessing ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(99,102,241,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(99,102,241,0.3)";
            }}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
