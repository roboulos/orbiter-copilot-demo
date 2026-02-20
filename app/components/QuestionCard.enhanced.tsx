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
  autoImage?: boolean;
}

/**
 * QuestionCard - Premium Edition
 * 8-Pass Enhanced Design:
 * - Pass 1: Typography hierarchy with Space Grotesk + DM Sans
 * - Pass 2: Rich gradients and glass-morphism
 * - Pass 3: Refined spacing system
 * - Pass 4: Premium interactive states
 * - Pass 5: Multi-layer shadows and depth
 * - Pass 6: Smooth animations with stagger
 * - Pass 7: Loading states and feedback
 * - Pass 8: Micro-interactions and polish
 */
export function QuestionCard({
  image_url,
  icon,
  title,
  description,
  buttons,
  autoImage = true,
}: QuestionCardProps) {
  const { processMessage } = useThreadActions();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);

  // Auto-select image if not provided
  const displayImage = image_url || (autoImage && !icon ? getContextualImage(title + " " + (description || "")) : undefined);

  const handleSelect = async (button: { label: string; value: string }, index: number) => {
    if (selectedValue !== null) return; // Already selected

    setSelectedValue(button.value);

    try {
      await processMessage({
        role: "user",
        type: "prompt",
        message: button.label,
      });
    } catch (error) {
      console.error("[QuestionCard] Error processing message:", error);
      setSelectedValue(null);
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        /* Pass 5: Multi-layer depth */
        position: "relative",
        maxWidth: "600px",
        margin: "var(--space-lg) 0",
        borderRadius: "var(--radius-2xl)",
        overflow: "hidden",
        
        /* Pass 2: Premium glass surface */
        background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
        backdropFilter: "blur(32px) saturate(180%)",
        border: `1px solid ${hovered ? "rgba(124, 58, 237, 0.4)" : "rgba(255, 255, 255, 0.1)"}`,
        
        /* Pass 5: Layered shadows */
        boxShadow: hovered
          ? `0 0 0 1px rgba(124, 58, 237, 0.3),
             0 20px 40px -10px rgba(124, 58, 237, 0.3),
             0 10px 20px -5px rgba(0, 0, 0, 0.4),
             inset 0 1px 0 rgba(255, 255, 255, 0.1)`
          : `0 4px 24px rgba(0, 0, 0, 0.2),
             inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        
        /* Pass 6: Smooth transitions */
        transition: "all 500ms var(--ease-out-expo)",
        
        /* Pass 4: Subtle lift on hover */
        transform: hovered ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
        
        /* Pass 6: Entrance animation */
        animation: "constellation-appear 0.8s var(--ease-out-expo)",
      }}
    >
      {/* Animated border glow (Pass 8: Micro-interaction) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          width: "60%",
          height: "2px",
          background: "linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.8), transparent)",
          opacity: hovered ? 1 : 0.4,
          transition: "all 400ms ease",
          filter: hovered ? "blur(1px)" : "blur(0px)",
        }}
      />

      {/* Image/Icon Header */}
      {displayImage ? (
        <div
          style={{
            width: "100%",
            height: "220px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Image */}
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundImage: `url(${displayImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              /* Pass 4: Subtle zoom on hover */
              transform: hovered ? "scale(1.05)" : "scale(1)",
              transition: "transform 800ms var(--ease-out-expo)",
            }}
          />
          
          {/* Gradient overlay for text readability */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.7) 100%)",
            }}
          />
        </div>
      ) : icon ? (
        <div
          style={{
            width: "100%",
            padding: "var(--space-2xl) 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)",
          }}
        >
          <div
            style={{
              fontSize: "4rem",
              /* Pass 8: Gentle float animation */
              animation: "float-gentle 6s ease-in-out infinite",
            }}
          >
            {icon}
          </div>
        </div>
      ) : null}

      {/* Content Section */}
      <div style={{ padding: "var(--space-xl)" }}>
        {/* Pass 1: Typography hierarchy */}
        <h3
          className="text-heading"
          style={{
            fontSize: "var(--text-2xl)",
            fontWeight: "var(--weight-bold)",
            color: "var(--text-primary)",
            marginBottom: "var(--space-sm)",
            letterSpacing: "var(--tracking-tight)",
          }}
        >
          {title}
        </h3>

        {description && (
          <p
            className="text-body"
            style={{
              fontSize: "var(--text-base)",
              color: "var(--text-secondary)",
              marginBottom: "var(--space-xl)",
              lineHeight: "var(--leading-relaxed)",
            }}
          >
            {description}
          </p>
        )}

        {/* Buttons with stagger animation (Pass 6) */}
        <div
          className="stagger-children"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-sm)",
          }}
        >
          {buttons.map((button, index) => {
            const isSelected = selectedValue === button.value;
            const isHovered = hoveredButton === index;
            const isDisabled = selectedValue !== null && !isSelected;

            return (
              <button
                key={button.value}
                onClick={() => handleSelect(button, index)}
                onMouseEnter={() => setHoveredButton(index)}
                onMouseLeave={() => setHoveredButton(null)}
                disabled={isDisabled}
                style={{
                  /* Pass 3: Refined spacing */
                  padding: button.subtitle ? "var(--space-md) var(--space-lg)" : "var(--space-md) var(--space-lg)",
                  minHeight: "52px",
                  
                  /* Pass 2: Glass button surface */
                  background: isSelected
                    ? "linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(99, 102, 241, 0.2))"
                    : isHovered
                    ? "linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.08))"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03))",
                  
                  backdropFilter: "blur(16px)",
                  border: `1px solid ${
                    isSelected
                      ? "rgba(124, 58, 237, 0.5)"
                      : isHovered
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(255, 255, 255, 0.1)"
                  }`,
                  borderRadius: "var(--radius-lg)",
                  
                  /* Pass 5: Shadows */
                  boxShadow: isSelected
                    ? "0 0 20px rgba(124, 58, 237, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                    : isHovered
                    ? "0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                    : "0 2px 4px rgba(0, 0, 0, 0.1)",
                  
                  /* Pass 4: Interactive states */
                  transform: isSelected
                    ? "scale(1)"
                    : isHovered
                    ? "scale(1.02) translateY(-2px)"
                    : "scale(1)",
                  
                  /* Pass 6: Smooth transitions */
                  transition: "all 300ms var(--ease-out-expo)",
                  
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  opacity: isDisabled ? 0.4 : 1,
                  
                  /* Layout */
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-md)",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                {/* Emoji/Icon */}
                {button.emoji && (
                  <div
                    style={{
                      fontSize: "1.5rem",
                      flexShrink: 0,
                      /* Pass 8: Subtle scale on hover */
                      transform: isHovered ? "scale(1.1)" : "scale(1)",
                      transition: "transform 200ms var(--ease-smooth)",
                    }}
                  >
                    {button.emoji}
                  </div>
                )}

                {/* Text Content */}
                <div style={{ flex: 1 }}>
                  {/* Pass 1: Typography for button label */}
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-base)",
                      fontWeight: "var(--weight-semibold)",
                      color: "var(--text-primary)",
                      marginBottom: button.subtitle ? "2px" : 0,
                    }}
                  >
                    {button.label}
                  </div>
                  
                  {button.subtitle && (
                    <div
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--text-tertiary)",
                        lineHeight: "1.3",
                      }}
                    >
                      {button.subtitle}
                    </div>
                  )}
                </div>

                {/* Selected checkmark (Pass 8: Micro-interaction) */}
                {isSelected && (
                  <div
                    style={{
                      fontSize: "1.25rem",
                      color: "var(--color-primary)",
                      /* Pass 6: Scale-in animation */
                      animation: "scale-in 300ms var(--ease-spring)",
                    }}
                  >
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom glow accent (Pass 8: Visual polish) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "40%",
          height: "2px",
          background: "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)",
          opacity: hovered ? 0.8 : 0,
          transition: "opacity 400ms ease",
          filter: "blur(2px)",
        }}
      />
    </div>
  );
}
