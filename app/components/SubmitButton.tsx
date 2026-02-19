"use client";

import { useState } from "react";

interface SubmitButtonProps {
  summary?: string;
  label?: string;
  onSubmit?: (summary: string) => void;
}

export function SubmitButton({
  summary = "Ready to leverage your network for this outcome",
  label = "Submit & Deploy",
  onSubmit,
}: SubmitButtonProps) {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (onSubmit) {
      onSubmit(summary);
    }
    // Dispatch custom event to parent
    window.dispatchEvent(
      new CustomEvent("orbiter:ready-to-dispatch", {
        detail: { summary },
      })
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        margin: "16px 0 8px",
        padding: "16px",
        background: "rgba(99,102,241,0.06)",
        border: "1px solid rgba(99,102,241,0.15)",
        borderRadius: "16px",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.6)",
          lineHeight: 1.5,
        }}
      >
        {summary}
      </div>

      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: "14px 24px",
          borderRadius: "12px",
          background: hovered
            ? "linear-gradient(135deg, #7c3aed, #6366f1)"
            : "linear-gradient(135deg, #6366f1, #8b5cf6)",
          border: "none",
          color: "white",
          fontSize: "14px",
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "Inter, sans-serif",
          transition: "all 0.2s ease",
          boxShadow: hovered
            ? "0 8px 24px rgba(99,102,241,0.4), 0 0 0 3px rgba(99,102,241,0.15)"
            : "0 4px 16px rgba(99,102,241,0.3)",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <span>⚡</span>
        <span>{label}</span>
      </button>

      <div
        style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.35)",
          textAlign: "center",
        }}
      >
        This will activate your network to help with your outcome
      </div>
    </div>
  );
}
