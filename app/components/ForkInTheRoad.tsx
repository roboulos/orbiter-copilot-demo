"use client";

import { useState } from "react";
import { Avatar } from "./Avatar";

interface ForkPerson {
  name: string;
  title?: string | null;
  company?: string | null;
  avatar?: string | null;
}

interface ForkInTheRoadProps {
  person: ForkPerson;
  onChoice: (prompt: string) => void;
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8h9M9 4.5L12.5 8 9 11.5" />
    </svg>
  );
}

function ForkButton({
  title,
  subtitle,
  accentColor,
  onClick,
}: {
  title: string;
  subtitle: string;
  accentColor: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        borderRadius: "16px",
        padding: "18px 20px",
        textAlign: "left",
        cursor: "pointer",
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        background: hovered
          ? `rgba(${accentColor}, 0.08)`
          : `rgba(${accentColor}, 0.04)`,
        border: `1px solid rgba(${accentColor}, ${hovered ? 0.3 : 0.15})`,
        transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
        outline: "none",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.92)",
            marginBottom: "3px",
            letterSpacing: "-0.01em",
            lineHeight: 1.35,
          }}
        >
          {title}
        </div>
        <div style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.35)",
          lineHeight: 1.5,
          letterSpacing: "-0.005em",
        }}>
          {subtitle}
        </div>
      </div>
      <div style={{
        flexShrink: 0,
        color: `rgba(${accentColor}, ${hovered ? 0.8 : 0.4})`,
        transition: "all 0.18s ease",
        transform: hovered ? "translateX(2px)" : "translateX(0)",
      }}>
        <ArrowRight />
      </div>
    </button>
  );
}

export function ForkInTheRoad({ person, onChoice }: ForkInTheRoadProps) {
  const displayTitle =
    [person.title, person.company].filter(Boolean).join(" · ");

  const leveragePrompt = `Leverage my network for ${person.name}${displayTitle ? ` (${displayTitle})` : ""}. What's my single best move right now to activate this relationship? Be direct and concise — tell me what to do and draft the message.`;

  const interviewPrompt = `I want to help ${person.name}${displayTitle ? ` (${displayTitle})` : ""} with something specific. What would I like to help them with?`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "40px 24px",
        gap: "20px",
        animation: "forkSlideIn 0.25s cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      {/* Person badge */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Avatar name={person.name} size={48} borderRadius="50%" />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.95)",
              letterSpacing: "-0.02em",
              marginBottom: "2px",
            }}
          >
            {person.name}
          </div>
          {displayTitle && (
            <div style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "-0.005em",
            }}>
              {displayTitle}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: "40px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
        }}
      />

      {/* Prompt */}
      <p
        style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: "13px",
          textAlign: "center",
          margin: 0,
          lineHeight: 1.5,
          maxWidth: "280px",
          letterSpacing: "-0.005em",
        }}
      >
        How would you like to proceed?
      </p>

      {/* Two main choices */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <ForkButton
          title={`Leverage my Network for ${person.name}`}
          subtitle="Skip the interview — get instant suggestions"
          accentColor="99,102,241"
          onClick={() => onChoice(leveragePrompt)}
        />
        <ForkButton
          title={`Help ${person.name} with something specific`}
          subtitle="Answer a few questions to find the best path"
          accentColor="236,72,153"
          onClick={() => onChoice(interviewPrompt)}
        />
      </div>
    </div>
  );
}
