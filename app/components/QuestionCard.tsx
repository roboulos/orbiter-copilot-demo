"use client";

import { useState } from "react";
import { useThreadActions } from "@crayonai/react-core";
import { getContextualImage } from "../lib/images";

interface QuestionCardProps {
  image_url?: string;
  icon?: string;
  title: string;
  description?: string;
  buttons: Array<{
    label: string;
    value: string;
    emoji?: string;
    subtitle?: string;
  }>;
  autoImage?: boolean;  // Auto-select image based on title/description
}

export function QuestionCard({
  image_url,
  icon,
  title,
  description,
  buttons,
  autoImage = true,
}: QuestionCardProps) {
  const { appendMessages, processMessage } = useThreadActions();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);

  // Auto-select image if not provided
  const displayImage = image_url || (autoImage && !icon ? getContextualImage(title + " " + (description || "")) : undefined);

  const handleSelect = async (button: { label: string; value: string }) => {
    if (selectedValue !== null) return; // Already selected

    setSelectedValue(button.value);

    try {
      // Send the user's selection to the backend
      await processMessage({
        role: "user",
        type: "prompt",
        message: button.label,
      });
    } catch (error) {
      console.error("[QuestionCard] Error processing message:", error);
      setSelectedValue(null); // Reset on error
    }
  };

  return (
    <div
      className="orbiter-card-enter"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "linear-gradient(160deg, #0f0f1a 0%, #13131f 60%, #0d0d18 100%)",
        border: `1px solid ${hovered ? "rgba(99,102,241,0.45)" : "rgba(99, 102, 241, 0.28)"}`,
        borderRadius: "20px",
        overflow: "hidden",
        margin: "6px 0",
        boxShadow: hovered
          ? "0 0 0 1px rgba(99,102,241,0.4), 0 12px 40px rgba(0,0,0,0.5)"
          : "0 4px 24px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
        fontFamily: "Inter, sans-serif",
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        maxWidth: "560px",
      }}
    >
      {/* Top glow line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.7), transparent)",
          opacity: hovered ? 1 : 0.6,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Image/Icon Section */}
      {displayImage ? (
        <div
          style={{
            width: "100%",
            height: "200px",
            background: `url(${displayImage}) center/cover`,
            position: "relative",
          }}
        >
          {/* Gradient overlay for readability */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, transparent 40%, rgba(15,15,26,0.95))",
            }}
          />
        </div>
      ) : icon ? (
        <div
          style={{
            width: "100%",
            padding: "32px 0 16px 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              lineHeight: 1,
              filter: "drop-shadow(0 4px 12px rgba(99,102,241,0.3))",
            }}
          >
            {icon}
          </div>
        </div>
      ) : null}

      {/* Content */}
      <div style={{ padding: displayImage ? "24px" : "20px 24px 24px 24px" }}>
        {/* Title */}
        <h3
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#e8e8f0",
            marginBottom: description ? "8px" : "20px",
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.6,
              marginBottom: "20px",
            }}
          >
            {description}
          </p>
        )}

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {buttons.map((button) => {
            const isSelected = selectedValue === button.value;
            const isDisabled = selectedValue !== null && !isSelected;

            return (
              <button
                key={button.value}
                onClick={() => handleSelect(button)}
                disabled={isDisabled}
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  background: isSelected
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : "rgba(255,255,255,0.04)",
                  border: isSelected
                    ? "1px solid rgba(99,102,241,0.6)"
                    : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "14px",
                  color: isSelected ? "white" : "rgba(255,255,255,0.85)",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: selectedValue === null ? "pointer" : isSelected ? "default" : "not-allowed",
                  fontFamily: "Inter, sans-serif",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  opacity: isDisabled ? 0.4 : 1,
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                }}
                className="question-button"
              >
                {/* Emoji */}
                {button.emoji && (
                  <span style={{ fontSize: "24px", lineHeight: 1 }}>
                    {button.emoji}
                  </span>
                )}

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "15px", fontWeight: 600 }}>
                    {button.label}
                  </div>
                  {button.subtitle && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: isSelected
                          ? "rgba(255,255,255,0.8)"
                          : "rgba(255,255,255,0.45)",
                        marginTop: "3px",
                        fontWeight: 400,
                      }}
                    >
                      {button.subtitle}
                    </div>
                  )}
                </div>

                {/* Checkmark for selected */}
                {isSelected && (
                  <span
                    style={{
                      fontSize: "18px",
                      color: "white",
                      animation: "checkPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    }}
                  >
                    ✓
                  </span>
                )}

                {/* Hover gradient effect */}
                {!isSelected && selectedValue === null && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))",
                      opacity: 0,
                      transition: "opacity 0.2s ease",
                    }}
                    className="button-hover-gradient"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes checkPop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }

        .question-button:hover .button-hover-gradient {
          opacity: 1;
        }

        .question-button:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}
