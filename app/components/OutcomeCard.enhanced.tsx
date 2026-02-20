"use client";

import { useState } from "react";
import { createOutcome } from "../lib/xano";

interface OutcomeCardProps {
  goal: string;
  whyItMatters: string;
  idealHelper: string;
  timeframe: string;
  contextToShare: string;
  matchStrength?: "high" | "medium" | "building";
  masterPersonId?: number;
}

/**
 * OutcomeCard - Premium Edition
 * Final deliverable with premium design + dispatch button
 * All 8 passes applied for maximum impact
 */
export function OutcomeCard({
  goal,
  whyItMatters,
  idealHelper,
  timeframe,
  contextToShare,
  matchStrength = "building",
  masterPersonId,
}: OutcomeCardProps) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const strengthConfig = {
    high: { 
      label: "Strong matches found",
      color: "var(--color-success)",
      glow: "rgba(16, 185, 129, 0.3)" 
    },
    medium: { 
      label: "Some signals detected",
      color: "var(--color-warning)",
      glow: "rgba(245, 158, 11, 0.3)" 
    },
    building: { 
      label: "Scanning your network…",
      color: "var(--color-secondary)",
      glow: "rgba(99, 102, 241, 0.3)" 
    },
  };
  const strength = strengthConfig[matchStrength] || strengthConfig.building;

  const handleSaveToOrbiter = async () => {
    if (saving || saved) return;
    
    setSaving(true);
    try {
      const result = await createOutcome({
        copilot_mode: "outcome",
        request_panel_title: goal,
        request_context: [
          whyItMatters,
          `Ideal connector: ${idealHelper}`,
          `Timeframe: ${timeframe}`,
          contextToShare
        ].filter(Boolean).join("\n"),
        ...(masterPersonId ? { master_person_id: masterPersonId } : {}),
      });
      
      setSaved(true);
      setShowConfetti(true);
      
      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (err) {
      console.error("Failed to save outcome:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        maxWidth: "700px",
        margin: "var(--space-xl) 0",
        borderRadius: "var(--radius-2xl)",
        overflow: "hidden",
        
        /* Pass 2: Premium surface - changes when saved */
        background: saved
          ? "linear-gradient(145deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.06) 100%)"
          : "linear-gradient(145deg, rgba(124, 58, 237, 0.10) 0%, rgba(255, 255, 255, 0.04) 100%)",
        backdropFilter: "blur(32px) saturate(180%)",
        border: `1px solid ${
          saved
            ? "rgba(16, 185, 129, 0.4)"
            : hovered
            ? "rgba(124, 58, 237, 0.4)"
            : "rgba(255, 255, 255, 0.1)"
        }`,
        
        /* Pass 5: Elevated shadow */
        boxShadow: saved
          ? `0 0 40px rgba(16, 185, 129, 0.3),
             0 20px 40px -10px rgba(0, 0, 0, 0.4),
             inset 0 1px 0 rgba(255, 255, 255, 0.1)`
          : hovered
          ? `0 0 40px rgba(124, 58, 237, 0.2),
             0 20px 40px -10px rgba(0, 0, 0, 0.4),
             inset 0 1px 0 rgba(255, 255, 255, 0.1)`
          : `0 10px 30px rgba(0, 0, 0, 0.3),
             inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        
        /* Pass 6: Entrance animation */
        animation: "constellation-appear 0.8s var(--ease-out-expo)",
        
        /* Pass 4: Subtle lift on hover */
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 500ms var(--ease-out-expo)",
      }}
    >
      {/* Pass 8: Top glow accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          width: "60%",
          height: "2px",
          background: saved
            ? "linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.8), transparent)"
            : "linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.8), transparent)",
          opacity: hovered || saved ? 1 : 0.4,
          transition: "all 400ms ease",
        }}
      />

      <div style={{ padding: "var(--space-2xl)" }}>
        {/* Header Section */}
        <div style={{ marginBottom: "var(--space-xl)" }}>
          {/* Match Strength Badge (Pass 8: Status indicator) */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-xs)",
              padding: "var(--space-xs) var(--space-md)",
              borderRadius: "var(--radius-full)",
              background: "rgba(255, 255, 255, 0.05)",
              border: `1px solid ${strength.color}`,
              marginBottom: "var(--space-lg)",
              /* Pass 6: Subtle animation */
              animation: "slide-up-fade 0.6s var(--ease-out-expo) 0.1s backwards",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: strength.color,
                boxShadow: `0 0 10px ${strength.glow}`,
                /* Pass 6: Pulse animation */
                animation: "glow-pulse 2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: "var(--weight-medium)",
                color: strength.color,
              }}
            >
              {strength.label}
            </span>
          </div>

          {/* Pass 1: Main heading */}
          <h2
            className="text-display"
            style={{
              fontSize: "var(--text-3xl)",
              fontWeight: "var(--weight-bold)",
              color: "var(--text-primary)",
              marginBottom: "var(--space-md)",
              lineHeight: "var(--leading-tight)",
              letterSpacing: "var(--tracking-tight)",
              /* Pass 6: Staggered entrance */
              animation: "slide-up-fade 0.6s var(--ease-out-expo) 0.2s backwards",
            }}
          >
            {goal}
          </h2>
        </div>

        {/* Content Sections (Pass 3: Organized spacing) */}
        <div
          className="stagger-children"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-lg)",
          }}
        >
          {/* Why It Matters */}
          <Section
            icon="💡"
            title="Why It Matters"
            content={whyItMatters}
          />

          {/* Ideal Connector */}
          <Section
            icon="🎯"
            title="Ideal Connector"
            content={idealHelper}
          />

          {/* Timeframe */}
          <Section
            icon="⏰"
            title="Timeframe"
            content={timeframe}
          />

          {/* Context to Share */}
          <Section
            icon="💬"
            title="Context to Share"
            content={contextToShare}
          />
        </div>

        {/* Save Button (Pass 4: Premium button states) */}
        <button
          onClick={handleSaveToOrbiter}
          disabled={saving || saved}
          style={{
            width: "100%",
            marginTop: "var(--space-2xl)",
            padding: "var(--space-lg) var(--space-xl)",
            borderRadius: "var(--radius-xl)",
            
            /* Pass 2: Gradient button */
            background: saved
              ? "linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.2))"
              : "linear-gradient(135deg, rgba(124, 58, 237, 1), rgba(99, 102, 241, 1))",
            border: saved
              ? "1px solid rgba(16, 185, 129, 0.4)"
              : "1px solid rgba(124, 58, 237, 0.5)",
            
            /* Pass 5: Button shadow */
            boxShadow: saved
              ? "0 0 30px rgba(16, 185, 129, 0.4)"
              : "0 4px 14px rgba(124, 58, 237, 0.4), 0 0 20px rgba(124, 58, 237, 0.2)",
            
            /* Pass 1: Typography */
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-lg)",
            fontWeight: "var(--weight-semibold)",
            color: "white",
            
            /* Pass 4: Interactive states */
            transform: saved || saving ? "scale(1)" : "scale(1.02)",
            opacity: saving ? 0.6 : 1,
            cursor: saved || saving ? "not-allowed" : "pointer",
            
            /* Pass 6: Smooth transitions */
            transition: "all 300ms var(--ease-out-expo)",
            
            /* Pass 6: Entrance animation */
            animation: "slide-up-fade 0.6s var(--ease-out-expo) 0.8s backwards",
          }}
        >
          {saved ? "✓ Saved to Orbiter" : saving ? "Saving..." : "Save to Orbiter"}
        </button>
      </div>

      {/* Pass 8: Confetti overlay */}
      {showConfetti && <Confetti />}
    </div>
  );
}

/**
 * Section component - Consistent content blocks
 * (Pass 3: Spacing, Pass 1: Typography)
 */
function Section({ icon, title, content }: { icon: string; title: string; content: string }) {
  return (
    <div
      style={{
        padding: "var(--space-lg)",
        borderRadius: "var(--radius-lg)",
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Section Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-sm)",
          marginBottom: "var(--space-sm)",
        }}
      >
        <span style={{ fontSize: "1.25rem" }}>{icon}</span>
        <h4
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-wide)",
          }}
        >
          {title}
        </h4>
      </div>
      
      {/* Content */}
      <p
        className="text-body"
        style={{
          fontSize: "var(--text-base)",
          color: "var(--text-primary)",
          lineHeight: "var(--leading-relaxed)",
          margin: 0,
        }}
      >
        {content}
      </p>
    </div>
  );
}

/**
 * Confetti animation component
 * (Pass 8: Success celebration)
 */
function Confetti() {
  const particles = Array.from({ length: 50 });
  
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {particles.map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: "-10px",
            width: `${4 + Math.random() * 6}px`,
            height: `${4 + Math.random() * 6}px`,
            background: ["#7c3aed", "#6366f1", "#10b981", "#f59e0b", "#ef4444"][Math.floor(Math.random() * 5)],
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
            opacity: 0.8,
            animation: `confetti-fall ${2 + Math.random() * 2}s ease-out forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(600px) rotate(${360 + Math.random() * 360}deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
