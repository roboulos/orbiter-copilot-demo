"use client";

import { useState } from "react";
import { useThreadActions } from "@crayonai/react-core";

interface ButtonGroupProps {
  question?: string;
  options?: Array<{
    label: string;
    value: string;
    emoji?: string;
  }>;
  // Backend format support
  masterPersonId?: number;
  buttons?: Array<{
    text: string;
    action: string;
  }>;
}

function ChevronRight({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 4l4 4-4 4" />
    </svg>
  );
}

function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5l3.5 3.5 6.5-7" />
    </svg>
  );
}

export function ButtonGroup({ question, options, masterPersonId, buttons }: ButtonGroupProps) {
  // Handle both frontend format (question/options) and backend format (buttons)
  const displayQuestion = question || "";
  const displayOptions = options || (buttons || []).map(btn => ({
    label: btn.text,
    value: btn.action,
  }));
  const { appendMessages, processMessage } = useThreadActions();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);

  const handleSelect = async (option: { label: string; value: string }) => {
    if (selectedValue !== null) return;

    setSelectedValue(option.value);

    try {
      await processMessage({
        role: "user",
        type: "prompt",
        message: option.label,
      });
    } catch (error) {
      console.error("[ButtonGroup] Error processing message:", error);
      setSelectedValue(null);
    }
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "18px",
        padding: "6px",
        margin: "4px 0",
        fontFamily: "Inter, -apple-system, sans-serif",
        animation: "cardEntrance 0.35s cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      {/* Question header - only show if there's a question */}
      {displayQuestion && (
        <div
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.55)",
            padding: "12px 16px 8px",
            lineHeight: 1.5,
            letterSpacing: "-0.01em",
          }}
        >
          {displayQuestion}
        </div>
      )}

      {/* Button options */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {displayOptions.map((option, index) => {
          const isSelected = selectedValue === option.value;
          const isDisabled = selectedValue !== null && !isSelected;
          const isHovered = hoveredValue === option.value && !isDisabled;

          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              disabled={isDisabled}
              onMouseEnter={() => setHoveredValue(option.value)}
              onMouseLeave={() => setHoveredValue(null)}
              style={{
                padding: "13px 16px",
                background: isSelected
                  ? "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.12))"
                  : isHovered
                  ? "rgba(255,255,255,0.05)"
                  : "transparent",
                border: isSelected
                  ? "1px solid rgba(99,102,241,0.4)"
                  : "1px solid transparent",
                borderRadius: "14px",
                color: isSelected
                  ? "rgba(167,139,250,1)"
                  : isDisabled
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(255,255,255,0.88)",
                fontSize: "14px",
                fontWeight: isSelected ? 600 : 500,
                cursor: isDisabled ? "default" : "pointer",
                fontFamily: "inherit",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                opacity: isDisabled ? 0.35 : 1,
                transition: "all 0.18s cubic-bezier(0.22,1,0.36,1)",
                letterSpacing: "-0.01em",
                lineHeight: 1.4,
                animation: `fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) ${0.04 * index}s both`,
              }}
            >
              <span style={{ flex: 1 }}>{option.label}</span>
              <span
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "22px",
                  height: "22px",
                  borderRadius: "7px",
                  background: isSelected
                    ? "rgba(99,102,241,0.25)"
                    : "transparent",
                  color: isSelected
                    ? "rgba(167,139,250,1)"
                    : isHovered
                    ? "rgba(255,255,255,0.4)"
                    : "rgba(255,255,255,0.15)",
                  transition: "all 0.18s ease",
                  transform: isHovered && !isSelected ? "translateX(2px)" : "translateX(0)",
                }}
              >
                {isSelected ? <CheckIcon size={13} /> : <ChevronRight size={13} />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
