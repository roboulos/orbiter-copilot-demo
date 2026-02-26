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

const btnBase: React.CSSProperties = {
  width: "100%",
  borderRadius: "18px",
  padding: "22px 24px",
  textAlign: "left",
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "all 0.18s ease",
  outline: "none",
};

function ForkButton({
  title,
  subtitle,
  gradient,
  border,
  onClick,
}: {
  title: string;
  subtitle: string;
  gradient: string;
  border: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...btnBase,
        background: hovered
          ? gradient.replace("0.12", "0.2").replace("0.08", "0.14")
          : gradient,
        border: `1px solid ${hovered ? border.replace("0.35", "0.55").replace("0.12", "0.25") : border}`,
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 8px 32px rgba(0,0,0,0.3)"
          : "0 2px 12px rgba(0,0,0,0.15)",
      }}
    >
      <div
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#e8e8f0",
          marginBottom: "5px",
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", lineHeight: 1.5 }}>
        {subtitle}
      </div>
    </button>
  );
}

function SubFork({
  person,
  onSuggest,
  onIKnow,
  onBack,
}: {
  person: ForkPerson;
  onSuggest: () => void;
  onIKnow: () => void;
  onBack: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "32px 24px",
        gap: "14px",
        animation: "forkSlideIn 0.22s ease both",
      }}
    >
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          alignSelf: "flex-start",
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.32)",
          fontSize: "12px",
          cursor: "pointer",
          fontFamily: "inherit",
          padding: "0 0 4px 0",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          marginBottom: "4px",
          transition: "color 0.12s ease",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.65)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.32)")}
      >
        ← Back
      </button>

      <div style={{ textAlign: "center", marginBottom: "4px" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: "0 0 4px" }}>
          Helping {person.name} — how do you want to start?
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <ForkButton
          title={`Suggest what ${person.name} might need`}
          subtitle="Orbiter reads the context and proposes the best options for you"
          gradient="linear-gradient(135deg, rgba(245,158,11,0.1), rgba(234,179,8,0.06))"
          border="rgba(245,158,11,0.3)"
          onClick={onSuggest}
        />
        <ForkButton
          title="I already know what to help with"
          subtitle="Tell Orbiter exactly what you want — it will find the right path through your network"
          gradient="linear-gradient(135deg, rgba(52,211,153,0.08), rgba(16,185,129,0.05))"
          border="rgba(52,211,153,0.25)"
          onClick={onIKnow}
        />
      </div>
    </div>
  );
}

export function ForkInTheRoad({ person, onChoice }: ForkInTheRoadProps) {
  const displayTitle =
    [person.title, person.company].filter(Boolean).join(" · ");

  // Path 1: Direct dispatch (no interview)
  const leveragePrompt = `Leverage my network for ${person.name}${displayTitle ? ` (${displayTitle})` : ""}. What's my single best move right now to activate this relationship? Be direct and concise — tell me what to do and draft the message.`;

  // Path 2: Interview flow (ask questions)
  const interviewPrompt = `I want to help ${person.name}${displayTitle ? ` (${displayTitle})` : ""} with something specific. What would I like to help them with?`;

  // Removed SubFork - direct to chat after choice

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "32px 24px",
        gap: "16px",
        animation: "forkSlideIn 0.25s ease both",
      }}
    >
      {/* Person badge */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          marginBottom: "4px",
        }}
      >
        <Avatar name={person.name} size={52} borderRadius="50%" />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: "#e8e8f0",
              letterSpacing: "-0.02em",
              marginBottom: "3px",
            }}
          >
            {person.name}
          </div>
          {displayTitle && (
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
              {displayTitle}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: "48px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)",
          margin: "0",
        }}
      />

      {/* Prompt */}
      <p
        style={{
          color: "rgba(255,255,255,0.45)",
          fontSize: "13px",
          textAlign: "center",
          margin: 0,
          lineHeight: 1.5,
          maxWidth: "300px",
        }}
      >
        What do you want to do with this relationship?
      </p>

      {/* Two main choices */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <ForkButton
          title={`Leverage my Network for ${person.name}`}
          subtitle="Skip the interview — get instant suggestions and message draft"
          gradient="linear-gradient(135deg, rgba(99,102,241,0.14), rgba(139,92,246,0.08))"
          border="rgba(99,102,241,0.35)"
          onClick={() => onChoice(leveragePrompt)}
        />
        <ForkButton
          title={`Help ${person.name} with something specific`}
          subtitle="Answer a few questions — we'll find the best path through your network"
          gradient="linear-gradient(135deg, rgba(236,72,153,0.12), rgba(219,39,119,0.08))"
          border="rgba(236,72,153,0.35)"
          onClick={() => onChoice(interviewPrompt)}
        />
      </div>
    </div>
  );
}
