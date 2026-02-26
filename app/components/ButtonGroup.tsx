"use client";

import { useState } from "react";
import { useThreadActions } from "@crayonai/react-core";

interface ButtonGroupProps {
  question?: string;
  options?: Array<{
    label: string;
    value: string;
    emoji?: string;
    avatar_url?: string;
    subtitle?: string;
  }>;
  // Backend format support
  masterPersonId?: number;
  buttons?: Array<{
    text: string;
    action: string;
  }>;
}

function ArrowIcon({ size = 14 }: { size?: number }) {
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
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function CheckIcon({ size = 14 }: { size?: number }) {
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
  const displayQuestion = question || "";
  const displayOptions: Array<{ label: string; value: string; emoji?: string; avatar_url?: string; subtitle?: string }> =
    options || (buttons || []).map(btn => ({
      label: btn.text,
      value: btn.action,
    }));
  const { processMessage } = useThreadActions();
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
        position: "relative",
        background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: "4px",
        margin: "4px 0",
        fontFamily: "Inter, -apple-system, sans-serif",
        overflow: "hidden",
        animation: "cardEntrance 0.35s cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      {/* Top shimmer accent */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "15%",
        right: "15%",
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)",
        opacity: 0.6,
      }} />

      {/* Question header */}
      {displayQuestion && (
        <div
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.5)",
            padding: "12px 14px 8px",
            lineHeight: 1.5,
            letterSpacing: "-0.01em",
          }}
        >
          {displayQuestion}
        </div>
      )}

      {/* Button options */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
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
                position: "relative",
                padding: "14px 16px",
                background: isSelected
                  ? "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.12))"
                  : isHovered
                  ? "rgba(255,255,255,0.06)"
                  : "transparent",
                border: "none",
                borderRadius: "12px",
                color: isSelected
                  ? "rgba(167,139,250,1)"
                  : isDisabled
                  ? "rgba(255,255,255,0.25)"
                  : "rgba(255,255,255,0.9)",
                fontSize: "14px",
                fontWeight: isSelected ? 600 : 500,
                cursor: isDisabled ? "default" : "pointer",
                fontFamily: "inherit",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                opacity: isDisabled ? 0.3 : 1,
                transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)",
                letterSpacing: "-0.01em",
                lineHeight: 1.4,
                overflow: "hidden",
                animation: `fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) ${0.05 * index}s both`,
              }}
            >
              {/* Left accent bar on hover/select */}
              <div style={{
                position: "absolute",
                left: 0,
                top: "20%",
                bottom: "20%",
                width: "3px",
                borderRadius: "0 3px 3px 0",
                background: isSelected
                  ? "linear-gradient(180deg, #6366f1, #a78bfa)"
                  : "linear-gradient(180deg, rgba(99,102,241,0.6), rgba(167,139,250,0.4))",
                opacity: isSelected ? 1 : isHovered ? 0.7 : 0,
                transition: "opacity 0.2s ease",
              }} />

              {/* Avatar (when available) */}
              {option.avatar_url && (
                <img
                  src={option.avatar_url}
                  alt=""
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                    border: isSelected
                      ? "2px solid rgba(99,102,241,0.5)"
                      : "2px solid rgba(255,255,255,0.1)",
                    transition: "border-color 0.2s ease",
                  }}
                />
              )}

              <span style={{
                flex: 1,
                paddingLeft: isSelected || isHovered ? "4px" : "0px",
                transition: "padding-left 0.2s ease",
                display: "flex",
                flexDirection: "column",
                gap: option.subtitle ? "2px" : "0px",
              }}>
                <span>{option.label}</span>
                {option.subtitle && (
                  <span style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: isSelected
                      ? "rgba(167,139,250,0.6)"
                      : isDisabled
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(255,255,255,0.4)",
                    lineHeight: 1.3,
                    transition: "color 0.2s ease",
                  }}>
                    {option.subtitle}
                  </span>
                )}
              </span>

              <span
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  borderRadius: "8px",
                  background: isSelected
                    ? "rgba(99,102,241,0.25)"
                    : isHovered
                    ? "rgba(255,255,255,0.06)"
                    : "transparent",
                  color: isSelected
                    ? "rgba(167,139,250,1)"
                    : isHovered
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(255,255,255,0.12)",
                  transition: "all 0.2s ease",
                  transform: isHovered && !isSelected ? "translateX(2px)" : "translateX(0)",
                }}
              >
                {isSelected ? <CheckIcon size={13} /> : <ArrowIcon size={13} />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
