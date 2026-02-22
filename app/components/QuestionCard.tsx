"use client";

import { useState } from "react";
import { useThreadActions } from "@crayonai/react-core";
import { getContextualImage } from "../lib/images";
import { getIcon, emojiToIcon } from "./icons";

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
    helpText?: string;
  }>;
  autoImage?: boolean;
  allowDontKnow?: boolean;
}

// AUTO-GENERATE help text if not provided (Josh's requirement)
function generateHelpText(label: string, subtitle?: string): string {
  // Common patterns
  if (label.toLowerCase().includes("pacific") || label.toLowerCase().includes("coast")) {
    return "Beach areas with year-round sunshine. Higher property costs but strong rental income potential.";
  }
  if (label.toLowerCase().includes("central valley") || label.toLowerCase().includes("san josé")) {
    return "Spring-like climate year-round, close to capital. Lower costs, ideal for full-time living.";
  }
  if (label.toLowerCase().includes("caribbean")) {
    return "Tropical rainforest climate, laid-back culture. More rain but lush, affordable, off-the-beaten-path.";
  }
  if (subtitle) {
    return `This option includes: ${subtitle}. Click for more details.`;
  }
  return `Learn more about ${label}`;
}

/**
 * QuestionCard - WITH "I Don't Know" + Help Text (AUTO-ENABLED)
 * 
 * Addresses Mark/Josh feedback from Transcript #423:
 * - Users need context for choices they don't understand
 * - "I don't know" escape hatch for when they need help
 * 
 * FIXED: Always shows enhancements even if backend doesn't send helpText
 */
export function QuestionCard({
  image_url,
  icon,
  title,
  description,
  buttons,
  autoImage = true,
  allowDontKnow = true, // ALWAYS true by default
}: QuestionCardProps) {
  const { processMessage } = useThreadActions();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);
  const [expandedHelp, setExpandedHelp] = useState<number | null>(null);

  const displayImage = image_url || (autoImage && !icon ? getContextualImage(title + " " + (description || "")) : undefined);

  const handleSelect = async (button: { label: string; value: string }, index: number) => {
    if (selectedValue !== null) return;
    setSelectedValue(button.value);

    try {
      await processMessage({
        role: "user",
        type: "prompt",
        message: button.label,
      });
    } catch (error) {
      console.error("[QuestionCard] Error:", error);
      setSelectedValue(null);
    }
  };

  const handleDontKnow = async () => {
    if (selectedValue !== null) return;
    setSelectedValue("dont_know");

    try {
      await processMessage({
        role: "user",
        type: "prompt",
        message: "I don't know - can you help me understand the differences between these options?",
      });
    } catch (error) {
      console.error("[QuestionCard] Error:", error);
      setSelectedValue(null);
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        maxWidth: "600px",
        margin: "var(--space-lg) 0",
        borderRadius: "var(--radius-2xl)",
        overflow: "hidden",
        background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
        backdropFilter: "blur(32px) saturate(180%)",
        border: `1px solid ${hovered ? "rgba(124, 58, 237, 0.4)" : "rgba(255, 255, 255, 0.1)"}`,
        boxShadow: hovered
          ? `0 0 0 1px rgba(124, 58, 237, 0.3), 0 20px 40px -10px rgba(124, 58, 237, 0.3), 0 10px 20px -5px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
          : `0 4px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        transition: "all 500ms var(--ease-out-expo)",
        transform: hovered ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
        animation: "constellation-appear 0.8s var(--ease-out-expo)",
      }}
    >
      <div style={{
        position: "absolute",
        top: 0,
        left: "20%",
        width: "60%",
        height: "2px",
        background: "linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.8), transparent)",
        opacity: hovered ? 1 : 0.4,
        transition: "all 400ms ease",
      }} />

      {displayImage && (
        <div style={{ width: "100%", height: "220px", position: "relative", overflow: "hidden" }}>
          <div style={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${displayImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 800ms var(--ease-out-expo)",
          }} />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.7) 100%)",
          }} />
        </div>
      )}

      <div style={{ padding: "var(--space-xl)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", marginBottom: "var(--space-sm)" }}>
          {icon && !displayImage && (
            <div style={{ fontSize: "2rem", flexShrink: 0, opacity: 0.9 }}>{icon}</div>
          )}
          <h3 style={{
            fontSize: "var(--text-2xl)",
            fontWeight: "var(--weight-bold)",
            color: "var(--text-primary)",
            letterSpacing: "var(--tracking-tight)",
            flex: 1,
          }}>
            {title}
          </h3>
        </div>

        {description && (
          <p style={{
            fontSize: "var(--text-base)",
            color: "var(--text-secondary)",
            marginBottom: "var(--space-xl)",
            lineHeight: "var(--leading-relaxed)",
          }}>
            {description}
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
          {buttons.map((button, index) => {
            const isSelected = selectedValue === button.value;
            const isHovered = hoveredButton === index;
            const isDisabled = selectedValue !== null && !isSelected;
            const helpExpanded = expandedHelp === index;
            
            // AUTO-GENERATE help text if not provided
            const effectiveHelpText = button.helpText || generateHelpText(button.label, button.subtitle);

            return (
              <div key={button.value} style={{ position: "relative" }}>
                <button
                  onClick={() => handleSelect(button, index)}
                  onMouseEnter={() => setHoveredButton(index)}
                  onMouseLeave={() => setHoveredButton(null)}
                  disabled={isDisabled}
                  style={{
                    padding: button.subtitle ? "var(--space-md) var(--space-lg)" : "var(--space-md) var(--space-lg)",
                    minHeight: "52px",
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(124, 58, 237, 0.4), rgba(99, 102, 241, 0.3))"
                      : isHovered
                      ? "linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.12))"
                      : "linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.08))",
                    backdropFilter: "blur(16px)",
                    border: `1px solid ${
                      isSelected
                        ? "rgba(124, 58, 237, 0.6)"
                        : isHovered
                        ? "rgba(255, 255, 255, 0.25)"
                        : "rgba(255, 255, 255, 0.15)"
                    }`,
                    borderRadius: "var(--radius-lg)",
                    boxShadow: isSelected
                      ? "0 0 20px rgba(124, 58, 237, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                      : isHovered
                      ? "0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                      : "0 2px 4px rgba(0, 0, 0, 0.1)",
                    transform: isSelected ? "scale(1)" : isHovered ? "scale(1.02) translateY(-2px)" : "scale(1)",
                    transition: "all 300ms var(--ease-out-expo)",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    opacity: isDisabled ? 0.4 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-md)",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  {button.emoji && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(124, 58, 237, 0.1))",
                      border: "1px solid rgba(99, 102, 241, 0.2)",
                      color: "#a5b4fc",
                      flexShrink: 0,
                      transform: isHovered ? "scale(1.1)" : "scale(1)",
                      transition: "all 200ms var(--ease-smooth)",
                    }}>
                      {getIcon(emojiToIcon(button.emoji), 18)}
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-base)",
                      fontWeight: "var(--weight-semibold)",
                      color: "var(--text-primary)",
                      marginBottom: button.subtitle ? "2px" : 0,
                    }}>
                      {button.label}
                    </div>
                    {button.subtitle && (
                      <div style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--text-tertiary)",
                        lineHeight: "1.3",
                      }}>
                        {button.subtitle}
                      </div>
                    )}
                  </div>

                  {/* Help icon - ALWAYS show (Josh's requirement) */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedHelp(helpExpanded ? null : index);
                    }}
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "rgba(99, 102, 241, 0.2)",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      color: "rgba(99, 102, 241, 0.9)",
                      fontSize: "12px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      userSelect: "none",
                    }}
                  >
                    ?
                  </div>

                  {isSelected && (
                    <div style={{
                      fontSize: "1.25rem",
                      color: "var(--color-primary)",
                      animation: "scale-in 300ms var(--ease-spring)",
                    }}>
                      ✓
                    </div>
                  )}
                </button>

                {/* Expanded help text - uses effective (auto-generated or provided) help text */}
                {helpExpanded && effectiveHelpText && (
                  <div style={{
                    marginTop: "var(--space-xs)",
                    padding: "var(--space-sm) var(--space-md)",
                    background: "rgba(99, 102, 241, 0.15)",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--text-sm)",
                    color: "var(--text-secondary)",
                    lineHeight: "1.5",
                    animation: "slideDown 200ms ease-out",
                  }}>
                    {effectiveHelpText}
                  </div>
                )}
              </div>
            );
          })}

          {/* "I don't know" button - ALWAYS show */}
          {allowDontKnow && (
            <button
              onClick={handleDontKnow}
              disabled={selectedValue !== null}
              style={{
                marginTop: "var(--space-md)",
                padding: "var(--space-sm) var(--space-lg)",
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))",
                border: "1px dashed rgba(255, 255, 255, 0.2)",
                borderRadius: "var(--radius-lg)",
                color: "var(--text-tertiary)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--weight-medium)",
                cursor: selectedValue ? "not-allowed" : "pointer",
                opacity: selectedValue ? 0.4 : 0.8,
                textAlign: "center",
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => {
                if (!selectedValue) {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255, 255, 255, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = selectedValue ? "0.4" : "0.8";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255, 255, 255, 0.2)";
              }}
            >
              I don't know - help me choose
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
