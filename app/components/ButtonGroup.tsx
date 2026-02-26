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

export function ButtonGroup({ question, options, masterPersonId, buttons }: ButtonGroupProps) {
  // Handle both frontend format (question/options) and backend format (buttons)
  const displayQuestion = question || "What would you like to do?";
  const displayOptions = options || (buttons || []).map(btn => ({
    label: btn.text,
    value: btn.action,
  }));
  const { appendMessages, processMessage } = useThreadActions();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleSelect = async (option: { label: string; value: string }) => {
    if (selectedValue !== null) return; // Already selected
    
    setSelectedValue(option.value);

    try {
      // Send the user's selection to the backend
      await processMessage({
        role: "user",
        type: "prompt",
        message: option.label,
      });
    } catch (error) {
      console.error("[ButtonGroup] Error processing message:", error);
      setSelectedValue(null); // Reset on error
    }
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: "20px",
        margin: "6px 0",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Question */}
      <div
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "rgba(255,255,255,0.9)",
          marginBottom: "14px",
          lineHeight: 1.5,
        }}
      >
        {displayQuestion}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {displayOptions.map((option) => {
          const isSelected = selectedValue === option.value;
          const isDisabled = selectedValue !== null && !isSelected;

          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              disabled={isDisabled}
              style={{
                padding: "12px 16px",
                background: isSelected
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  : "rgba(255,255,255,0.04)",
                border: isSelected
                  ? "1px solid rgba(99,102,241,0.5)"
                  : "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: isSelected ? "white" : "rgba(255,255,255,0.85)",
                fontSize: "14px",
                fontWeight: 600,
                cursor: isDisabled ? "not-allowed" : "pointer",
                fontFamily: "Inter, sans-serif",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                opacity: isDisabled ? 0.4 : 1,
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ flex: 1 }}>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
