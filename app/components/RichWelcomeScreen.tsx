"use client";

import { useEffect, useState } from "react";

interface RichWelcomeScreenProps {
  networkSize?: number;
  outcomesCount?: number;
  onSelectTopic: (topic: string, prompt: string) => void;
}

export function RichWelcomeScreen({
  networkSize = 847,
  outcomesCount = 12,
  onSelectTopic,
}: RichWelcomeScreenProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(99,102,241,0.15), transparent 70%)",
          animation: "pulse 8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "800px" }}>
        {/* Icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 24px auto",
            borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
            border: "1px solid rgba(99,102,241,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px",
            boxShadow: "0 0 40px rgba(99,102,241,0.2)",
            animation: "float 6s ease-in-out infinite",
          }}
        >
          🌟
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 800,
            color: "#e8e8f0",
            marginBottom: "12px",
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
          }}
        >
          Your Network is Full of Doors
        </h1>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#34d399",
                boxShadow: "0 0 8px rgba(52,211,153,0.5)",
              }}
            />
            <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
              {networkSize.toLocaleString()} connections
            </span>
          </div>

          <div
            style={{
              width: "1px",
              height: "16px",
              background: "rgba(255,255,255,0.1)",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#8b5cf6",
                boxShadow: "0 0 8px rgba(139,92,246,0.5)",
              }}
            />
            <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
              {outcomesCount} active outcomes
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.6)",
            marginBottom: "48px",
            lineHeight: 1.6,
          }}
        >
          Tell me what you want to accomplish and I'll find the perfect connections to make it happen.
        </p>

        {/* Quick Action Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
            marginTop: "32px",
          }}
        >
          <QuickActionCard
            icon="🏝️"
            title="Find Connections"
            description="Buy a house in Costa Rica"
            gradient="linear-gradient(135deg, #10b981, #059669)"
            isHovered={hoveredCard === "costa-rica"}
            onHover={() => setHoveredCard("costa-rica")}
            onLeave={() => setHoveredCard(null)}
            onClick={() => onSelectTopic("costa-rica", "I want to buy a house in Costa Rica for relocation")}
          />

          <QuickActionCard
            icon="💰"
            title="Get Warm Intros"
            description="Find investors for my startup"
            gradient="linear-gradient(135deg, #8b5cf6, #7c3aed)"
            isHovered={hoveredCard === "investors"}
            onHover={() => setHoveredCard("investors")}
            onLeave={() => setHoveredCard(null)}
            onClick={() => onSelectTopic("investors", "I'm raising a seed round and need warm introductions to investors")}
          />

          <QuickActionCard
            icon="🎯"
            title="Help Someone"
            description="Leverage my network for a friend"
            gradient="linear-gradient(135deg, #6366f1, #4f46e5)"
            isHovered={hoveredCard === "help"}
            onHover={() => setHoveredCard("help")}
            onLeave={() => setHoveredCard(null)}
            onClick={() => onSelectTopic("help", "I want to help someone I know")}
          />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

function QuickActionCard({
  icon,
  title,
  description,
  gradient,
  isHovered,
  onHover,
  onLeave,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  gradient: string;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${isHovered ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "16px",
        padding: "24px",
        textAlign: "left",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(99,102,241,0.3)"
          : "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      {/* Gradient overlay on hover */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: gradient,
          opacity: isHovered ? 0.08 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Icon */}
        <div
          style={{
            fontSize: "32px",
            marginBottom: "12px",
            transition: "transform 0.3s ease",
            transform: isHovered ? "scale(1.1)" : "scale(1)",
          }}
        >
          {icon}
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#e8e8f0",
            marginBottom: "6px",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.5,
            marginBottom: "16px",
          }}
        >
          {description}
        </p>

        {/* Arrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            fontWeight: 600,
            color: isHovered ? "#8b5cf6" : "rgba(255,255,255,0.4)",
            transition: "color 0.3s ease",
          }}
        >
          Get started
          <span
            style={{
              transition: "transform 0.3s ease",
              transform: isHovered ? "translateX(4px)" : "translateX(0)",
            }}
          >
            →
          </span>
        </div>
      </div>
    </button>
  );
}
